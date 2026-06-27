// dialog/fast-attendance-dialog.component.ts

import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, ChangeDetectorRef, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { animate, style, transition, trigger } from '@angular/animations';

import { TraineeAttendanceService } from '../../../../../core/services/trainee-attendance.service';
import { TraineeService } from '../../../../../core/services/trainee.service';
import { NotificationService } from '../../../../../core/services/notification.service';

// ============================================================================
// STATUS TYPE
// ============================================================================

export type TraineeAttendanceStatusType = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

export const ATTENDANCE_STATUS_OPTIONS: Array<{ value: TraineeAttendanceStatusType; label: string }> = [
  { value: 'PRESENT', label: 'حاضر' },
  { value: 'ABSENT', label: 'غائب' },
  { value: 'LATE', label: 'متأخر' },
  { value: 'EXCUSED', label: 'معتذر' }
];

// ============================================================================
// COMPONENT
// ============================================================================

@Component({
  selector: 'app-fast-attendance-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ])
  ],
  template: `
    <div class="dialog-container" dir="rtl">
      <!-- Header -->
      <div class="dialog-header">
        <div class="header-content">
          <div class="header-icon-wrapper">
            <mat-icon class="header-icon">qr_code_scanner</mat-icon>
          </div>
          <div class="header-text">
            <h2 class="dialog-title">تسجيل حضور سريع</h2>
            <p class="dialog-subtitle">امسح باركود المتدربين لتسجيل الحضور بسرعة</p>
          </div>
        </div>
        <button mat-icon-button (click)="close()" class="close-btn" matTooltip="إغلاق">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-divider></mat-divider>

      <!-- Body -->
      <div class="dialog-body">
        <!-- Configuration Section -->
        <div class="config-section">
          <div class="section-title">
            <mat-icon>settings</mat-icon>
            <span>إعدادات التسجيل</span>
          </div>

          <div class="config-grid">
            <!-- Course Session Selection -->
            <div class="config-field">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>الجلسة *</mat-label>
                <mat-select [(ngModel)]="selectedSessionId">
                  <mat-option *ngFor="let session of sessionOptions" [value]="session.value">
                    {{ session.label }}
                  </mat-option>
                </mat-select>
                <mat-icon matSuffix>event</mat-icon>
              </mat-form-field>
            </div>

            <!-- Attendance Status Selection -->
            <div class="config-field">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>حالة الحضور *</mat-label>
                <mat-select [(ngModel)]="selectedStatus">
                  <mat-option *ngFor="let status of attendanceStatuses" [value]="status.value">
                    {{ status.label }}
                  </mat-option>
                </mat-select>
                <mat-icon matSuffix>check_circle</mat-icon>
              </mat-form-field>
            </div>
          </div>
        </div>

        <mat-divider></mat-divider>

        <!-- Barcode Scanner Section -->
        <div class="scanner-section" [class.active]="isScannerActive">
          <div class="section-title">
            <mat-icon>qr_code</mat-icon>
            <span>مسح الباركود</span>
            <span class="badge" *ngIf="isScannerActive">جاري المسح...</span>
          </div>

          <div class="scanner-input-container">
            <div class="scanner-input-wrapper">
              <mat-form-field appearance="outline" class="scanner-input">
                <mat-label>رقم الباركود أو رقم الهوية</mat-label>
                <input
                  #barcodeInput
                  matInput
                  [(ngModel)]="barcodeSearch"
                  (keydown)="onBarcodeKeydown($event)"
                  placeholder="ادخل رقم الباركود أو امسحه..."
                  [disabled]="!isConfigurationValid()"
                  autofocus>
                <mat-icon matPrefix>qr_code_scanner</mat-icon>
                <mat-icon matSuffix *ngIf="barcodeSearch" (click)="clearBarcode()" class="clear-icon">clear</mat-icon>
              </mat-form-field>
            </div>

            <button
              mat-raised-button
              color="primary"
              (click)="searchAndCreateAttendance()"
              [disabled]="!barcodeSearch?.trim() || !isConfigurationValid() || isProcessing"
              class="scan-btn">
              <mat-icon *ngIf="!isProcessing">search</mat-icon>
              <mat-spinner diameter="20" *ngIf="isProcessing"></mat-spinner>
              <span>{{ isProcessing ? 'جاري التسجيل...' : 'تسجيل' }}</span>
            </button>
          </div>

          <!-- Status Messages -->
          <div class="scanner-status" *ngIf="lastScanResult">
            <div class="status-message" [class.success]="lastScanResult.success" [class.error]="!lastScanResult.success">
              <mat-icon>{{ lastScanResult.success ? 'check_circle' : 'error' }}</mat-icon>
              <span>{{ lastScanResult.message }}</span>
              <span class="status-time">{{ lastScanResult.time }}</span>
            </div>
          </div>
        </div>

        <mat-divider></mat-divider>

        <!-- Recently Scanned List -->
        <div class="recent-list" *ngIf="recentScans.length > 0">
          <div class="section-title">
            <mat-icon>history</mat-icon>
            <span>سجلات تم تسجيلها</span>
            <span class="badge count">{{ recentScans.length }}</span>
          </div>

          <div class="recent-items">
            <div
              *ngFor="let scan of recentScans; let i = index"
              class="recent-item"
              [class.success]="scan.success"
              [class.error]="!scan.success"
              @slideInOut>
              <div class="recent-item-info">
                <div class="recent-item-number">{{ i + 1 }}</div>
                <div class="recent-item-details">
                  <div class="recent-item-name">{{ scan.traineeName || 'غير معروف' }}</div>
                  <div class="recent-item-id">{{ scan.nationalId || '-' }}</div>
                </div>
              </div>
              <div class="recent-item-status">
                <mat-icon [class.success-icon]="scan.success" [class.error-icon]="!scan.success">
                  {{ scan.success ? 'check_circle' : 'error' }}
                </mat-icon>
                <span class="recent-item-time">{{ scan.time }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <mat-divider></mat-divider>

      <div class="dialog-footer">
        <div class="footer-info" *ngIf="recentScans.length > 0">
          <span class="info-text">
            <mat-icon>checklist</mat-icon>
            تم تسجيل <strong>{{ recentScans.length }}</strong> سجل حضور
          </span>
        </div>
        <div class="footer-actions">
          <button mat-button (click)="close()" class="cancel-btn">
            <mat-icon>close</mat-icon>
            إغلاق
          </button>
          <button
            mat-raised-button
            color="primary"
            (click)="closeWithSummary()"
            [disabled]="recentScans.length === 0"
            class="done-btn">
            <mat-icon>done_all</mat-icon>
            إنهاء ({{ recentScans.length }})
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dialog-container {
      min-width: 580px;
      max-width: 700px;
      background: #ffffff;
      border-radius: 24px;
      overflow: hidden;
      direction: rtl;
      box-shadow: 0 24px 48px rgba(0, 0, 0, 0.2);
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
      color: white;
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .header-icon-wrapper {
      width: 48px;
      height: 48px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .header-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .dialog-title {
      margin: 0;
      font-size: 20px;
      font-weight: 700;
    }

    .dialog-subtitle {
      margin: 2px 0 0;
      font-size: 13px;
      opacity: 0.85;
    }

    .close-btn {
      color: white !important;
      transition: all 0.3s;
    }

    .close-btn:hover {
      transform: rotate(90deg) scale(1.1);
      background: rgba(255, 255, 255, 0.15) !important;
    }

    .dialog-body {
      padding: 20px 24px;
      max-height: 60vh;
      overflow-y: auto;
      background: #f8fafc;
    }

    .dialog-body::-webkit-scrollbar {
      width: 5px;
    }

    .dialog-body::-webkit-scrollbar-track {
      background: #f1f5f9;
    }

    .dialog-body::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #7c3aed, #4f46e5);
      border-radius: 10px;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 600;
      color: #1e293b;
      font-size: 15px;
      margin-bottom: 14px;
    }

    .section-title mat-icon {
      color: #7c3aed;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .badge {
      background: #e2e8f0;
      color: #475569;
      padding: 2px 12px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
      margin-right: auto;
    }

    .badge.count {
      background: #ede9fe;
      color: #7c3aed;
    }

    .config-section {
      background: white;
      padding: 16px 20px;
      border-radius: 16px;
      border: 1px solid #e2e8f0;
      margin-bottom: 16px;
    }

    .config-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .config-field {
      width: 100%;
    }

    .full-width {
      width: 100%;
    }

    .full-width ::ng-deep .mat-form-field-wrapper {
      margin: 0;
    }

    .full-width ::ng-deep .mat-form-field-flex {
      background: #f8fafc !important;
      border-radius: 10px !important;
      padding: 0 12px !important;
      border: 1px solid #e2e8f0;
      transition: all 0.3s;
    }

    .full-width ::ng-deep .mat-form-field-flex:hover {
      border-color: #7c3aed;
    }

    .full-width ::ng-deep .mat-form-field-flex.mat-focused {
      border-color: #7c3aed;
      box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
    }

    .full-width ::ng-deep .mat-form-field-outline {
      display: none;
    }

    .full-width ::ng-deep .mat-form-field-infix {
      padding: 10px 0 !important;
      border-top: 0 !important;
    }

    .scanner-section {
      background: white;
      padding: 16px 20px;
      border-radius: 16px;
      border: 2px solid #e2e8f0;
      margin-bottom: 16px;
      transition: all 0.4s;
    }

    .scanner-section.active {
      border-color: #7c3aed;
      box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.08);
    }

    .scanner-input-container {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .scanner-input-wrapper {
      flex: 1;
    }

    .scanner-input {
      width: 100%;
    }

    .scanner-input ::ng-deep .mat-form-field-wrapper {
      margin: 0;
    }

    .scanner-input ::ng-deep .mat-form-field-flex {
      background: #f8fafc !important;
      border-radius: 10px !important;
      padding: 0 12px !important;
      border: 2px solid #e2e8f0;
      transition: all 0.3s;
    }

    .scanner-input ::ng-deep .mat-form-field-flex:hover {
      border-color: #7c3aed;
    }

    .scanner-input ::ng-deep .mat-form-field-flex.mat-focused {
      border-color: #7c3aed;
      box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
      background: white !important;
    }

    .scanner-input ::ng-deep .mat-form-field-outline {
      display: none;
    }

    .scanner-input ::ng-deep .mat-form-field-infix {
      padding: 12px 0 !important;
      border-top: 0 !important;
    }

    .clear-icon {
      cursor: pointer;
      color: #94a3b8;
      transition: color 0.3s;
    }

    .clear-icon:hover {
      color: #ef4444;
    }

    .scan-btn {
      height: 54px;
      min-width: 120px;
      background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%) !important;
      color: white !important;
      border-radius: 12px !important;
      font-weight: 600;
      font-size: 15px;
      transition: all 0.3s !important;
      box-shadow: 0 4px 16px rgba(124, 58, 237, 0.3) !important;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 24px !important;
    }

    .scan-btn:hover:not(:disabled) {
      transform: translateY(-2px) !important;
      box-shadow: 0 8px 28px rgba(124, 58, 237, 0.4) !important;
    }

    .scan-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none !important;
      box-shadow: none !important;
    }

    .scan-btn mat-spinner ::ng-deep circle {
      stroke: white !important;
    }

    .scanner-status {
      margin-top: 14px;
    }

    .status-message {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border-radius: 12px;
      font-size: 14px;
      animation: slideDown 0.3s ease-out;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .status-message.success {
      background: #d1fae5;
      color: #065f46;
      border-right: 4px solid #059669;
    }

    .status-message.error {
      background: #fee2e2;
      color: #991b1b;
      border-right: 4px solid #dc2626;
    }

    .status-message mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .status-message.success mat-icon {
      color: #059669;
    }

    .status-message.error mat-icon {
      color: #dc2626;
    }

    .status-time {
      margin-right: auto;
      font-size: 11px;
      opacity: 0.7;
    }

    .recent-list {
      background: white;
      padding: 16px 20px;
      border-radius: 16px;
      border: 1px solid #e2e8f0;
    }

    .recent-items {
      display: flex;
      flex-direction: column;
      gap: 6px;
      max-height: 200px;
      overflow-y: auto;
      padding-left: 4px;
    }

    .recent-items::-webkit-scrollbar {
      width: 4px;
    }

    .recent-items::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 10px;
    }

    .recent-items::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #7c3aed, #4f46e5);
      border-radius: 10px;
    }

    .recent-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 14px;
      border-radius: 10px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      transition: all 0.2s;
    }

    .recent-item:hover {
      border-color: #7c3aed;
      background: #f5f3ff;
    }

    .recent-item.success {
      border-right: 4px solid #059669;
    }

    .recent-item.error {
      border-right: 4px solid #dc2626;
    }

    .recent-item-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .recent-item-number {
      width: 24px;
      height: 24px;
      background: #e2e8f0;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 700;
      color: #475569;
    }

    .recent-item-details {
      display: flex;
      flex-direction: column;
    }

    .recent-item-name {
      font-weight: 600;
      color: #1e293b;
      font-size: 14px;
    }

    .recent-item-id {
      font-size: 12px;
      color: #94a3b8;
    }

    .recent-item-status {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .recent-item-status mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .success-icon {
      color: #059669;
    }

    .error-icon {
      color: #dc2626;
    }

    .recent-item-time {
      font-size: 11px;
      color: #94a3b8;
      min-width: 50px;
    }

    .dialog-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      background: white;
      border-top: 1px solid #e2e8f0;
    }

    .footer-info {
      display: flex;
      align-items: center;
    }

    .info-text {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      color: #475569;
    }

    .info-text mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #7c3aed;
    }

    .info-text strong {
      color: #7c3aed;
      font-weight: 700;
    }

    .footer-actions {
      display: flex;
      gap: 10px;
    }

    .cancel-btn {
      color: #64748b !important;
      font-weight: 500;
      border-radius: 10px !important;
      padding: 0 20px !important;
      transition: all 0.3s;
    }

    .cancel-btn:hover {
      background: #f1f5f9 !important;
    }

    .done-btn {
      background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%) !important;
      color: white !important;
      font-weight: 600;
      border-radius: 10px !important;
      padding: 0 24px !important;
      box-shadow: 0 4px 16px rgba(124, 58, 237, 0.3) !important;
      transition: all 0.3s !important;
    }

    .done-btn:hover:not(:disabled) {
      transform: translateY(-2px) !important;
      box-shadow: 0 8px 24px rgba(124, 58, 237, 0.4) !important;
    }

    .done-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none !important;
      box-shadow: none !important;
    }

    @media (max-width: 768px) {
      .dialog-container {
        min-width: 320px;
        max-width: 95vw;
        border-radius: 16px;
      }

      .dialog-header {
        padding: 16px 20px;
      }

      .header-icon-wrapper {
        width: 40px;
        height: 40px;
      }

      .header-icon {
        font-size: 22px;
        width: 22px;
        height: 22px;
      }

      .dialog-title {
        font-size: 17px;
      }

      .dialog-subtitle {
        font-size: 12px;
      }

      .dialog-body {
        padding: 16px;
        max-height: 55vh;
      }

      .config-grid {
        grid-template-columns: 1fr;
        gap: 8px;
      }

      .scanner-input-container {
        flex-direction: column;
      }

      .scan-btn {
        width: 100%;
        justify-content: center;
        height: 48px;
        min-width: unset;
      }

      .dialog-footer {
        flex-direction: column;
        gap: 12px;
        padding: 12px 16px;
      }

      .footer-actions {
        width: 100%;
      }

      .footer-actions button {
        flex: 1;
      }

      .recent-items {
        max-height: 150px;
      }
    }

    @media (max-width: 480px) {
      .dialog-container {
        min-width: 280px;
      }

      .dialog-header {
        padding: 12px 16px;
        flex-wrap: wrap;
      }

      .header-content {
        gap: 10px;
      }

      .header-icon-wrapper {
        width: 34px;
        height: 34px;
      }

      .header-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }

      .dialog-title {
        font-size: 15px;
      }

      .dialog-body {
        padding: 12px;
        max-height: 50vh;
      }

      .config-section,
      .scanner-section,
      .recent-list {
        padding: 12px 14px;
      }

      .section-title {
        font-size: 13px;
      }

      .scan-btn {
        height: 42px;
        font-size: 13px;
        padding: 0 16px !important;
      }

      .footer-actions button {
        font-size: 13px;
        padding: 0 12px !important;
        height: 40px;
      }
    }
  `]
})
export class FastAttendanceDialogComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('barcodeInput') barcodeInput!: ElementRef<HTMLInputElement>;

  // Configuration
  sessionOptions: Array<{ value: number; label: string }> = [];
  selectedSessionId: number | null = null;
  selectedStatus: TraineeAttendanceStatusType | null = null;
  attendanceStatuses = ATTENDANCE_STATUS_OPTIONS;

  // Barcode
  barcodeSearch: string = '';
  isProcessing: boolean = false;
  isScannerActive: boolean = false;

  // Recent scans
  recentScans: Array<{
    traineeId?: number;
    traineeName?: string;
    nationalId?: string;
    success: boolean;
    message: string;
    time: string;
  }> = [];

  lastScanResult: { success: boolean; message: string; time: string } | null = null;

  constructor(
    public dialogRef: MatDialogRef<FastAttendanceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { sessionOptions: Array<{ value: number; label: string }> },
    private traineeAttendanceService: TraineeAttendanceService,
    private traineeService: TraineeService,
    private notification: NotificationService,
    private cdr: ChangeDetectorRef
  ) {
    this.sessionOptions = data.sessionOptions || [];
  }

  ngOnInit(): void {
    this.selectedStatus = 'PRESENT';
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.focusBarcodeInput(), 300);
  }

  ngOnDestroy(): void {}

  isConfigurationValid(): boolean {
    return !!(this.selectedSessionId && this.selectedStatus);
  }

  onBarcodeKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.searchAndCreateAttendance();
    }
  }

  searchAndCreateAttendance(): void {
    if (!this.barcodeSearch?.trim()) {
      this.showStatusMessage(false, 'الرجاء إدخال رقم الباركود أو رقم الهوية');
      return;
    }

    if (!this.isConfigurationValid()) {
      this.showStatusMessage(false, 'الرجاء اختيار الجلسة وحالة الحضور أولاً');
      return;
    }

    if (this.isProcessing) return;

    this.isProcessing = true;
    this.isScannerActive = true;
    const searchValue = this.barcodeSearch.trim();

    this.traineeService.getAllTraineesByFilter({ quickSearch: searchValue }).subscribe({
      next: (res: any) => {
        const foundTrainees = res.items || [];

        if (foundTrainees.length === 0) {
          this.handleScanError('لم يتم العثور على متدرب بهذا الرقم');
          return;
        }

        const exactMatch = foundTrainees.find((t: any) => t.nationalId === searchValue);

        if (exactMatch) {
          this.createAttendanceForTrainee(exactMatch);
          return;
        }

        if (foundTrainees.length > 1) {
          this.notification.showWarning(`تم العثور على ${foundTrainees.length} متدرب، تم اختيار الأول`);
          this.createAttendanceForTrainee(foundTrainees[0]);
          return;
        }

        this.createAttendanceForTrainee(foundTrainees[0]);
      },
      error: () => this.handleScanError('حدث خطأ في البحث عن المتدرب')
    });
  }

  private createAttendanceForTrainee(trainee: any): void {
    const attendanceData = {
      traineeId: trainee.id,
      courseSessionId: this.selectedSessionId!,
      status: this.selectedStatus!,
      attendanceDate: new Date().toISOString().split('T')[0],
      checkInTime: this.getCheckInTime(),
      checkOutTime: null,
      lateTime: this.selectedStatus === 'LATE' ? 0 : null,
      note: 'تم التسجيل عبر المسح السريع'
    };

    this.traineeAttendanceService.createAttendance(attendanceData as any).subscribe({
      next: () => {
        const traineeName = trainee.title || trainee.fullName;
        this.showStatusMessage(true, `تم تسجيل حضور ${traineeName} بنجاح`);
        this.addRecentScan(trainee, true, 'تم التسجيل بنجاح');
        this.notification.showSuccess(`تم تسجيل حضور ${traineeName}`);
        this.barcodeSearch = '';
        this.isProcessing = false;
        this.isScannerActive = false;
        setTimeout(() => this.focusBarcodeInput(), 100);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.handleScanError(err.error?.messageEn || 'حدث خطأ في تسجيل الحضور');
        this.addRecentScan(trainee, false, err.error?.messageEn || 'فشل التسجيل');
      }
    });
  }

  private getCheckInTime(): string | null {
    if (this.selectedStatus === 'PRESENT' || this.selectedStatus === 'LATE') {
      const now = new Date();
      return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    }
    return null;
  }

  private handleScanError(message: string): void {
    this.showStatusMessage(false, message);
    this.isProcessing = false;
    this.isScannerActive = false;
    this.notification.showError(message);
    this.barcodeSearch = '';
    setTimeout(() => this.focusBarcodeInput(), 100);
    this.cdr.detectChanges();
  }

  private showStatusMessage(success: boolean, message: string): void {
    const now = new Date();
    this.lastScanResult = {
      success,
      message,
      time: now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    };
    setTimeout(() => { this.lastScanResult = null; this.cdr.detectChanges(); }, 5000);
    this.cdr.detectChanges();
  }

  private addRecentScan(trainee: any, success: boolean, message: string): void {
    this.recentScans.unshift({
      traineeId: trainee.id,
      traineeName: trainee.title || trainee.fullName,
      nationalId: trainee.nationalId,
      success,
      message,
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    });
    if (this.recentScans.length > 50) this.recentScans = this.recentScans.slice(0, 50);
    this.cdr.detectChanges();
  }

  focusBarcodeInput(): void {
    if (this.barcodeInput) {
      setTimeout(() => {
        this.barcodeInput.nativeElement.focus();
        this.barcodeInput.nativeElement.select();
      }, 100);
    }
  }

  clearBarcode(): void {
    this.barcodeSearch = '';
    this.lastScanResult = null;
    this.focusBarcodeInput();
    this.cdr.detectChanges();
  }

  close(): void {
    this.dialogRef.close(null);
  }

  closeWithSummary(): void {
    if (this.recentScans.length === 0) {
      this.close();
      return;
    }
    const successCount = this.recentScans.filter(s => s.success).length;
    this.dialogRef.close({
      total: this.recentScans.length,
      success: successCount,
      failed: this.recentScans.length - successCount,
      scans: this.recentScans
    });
  }
}