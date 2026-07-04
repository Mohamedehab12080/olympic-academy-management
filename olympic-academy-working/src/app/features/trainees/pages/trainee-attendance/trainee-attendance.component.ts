// trainee-attendance.component.ts - COMPLETE WITH ALL REQUIREMENTS

import { Component, OnInit, ViewChild, Inject, ElementRef, AfterViewInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { TraineeAttendanceService } from '../../../../core/services/trainee-attendance.service';
import { CourseService } from '../../../../core/services/course.service';
import { CourseSessionService } from '../../../../core/services/course-session.service';
import { EnrollmentService } from '../../../../core/services/enrollment.service';
import { TraineeService } from '../../../../core/services/trainee.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ReportService } from '../../../../core/services/report.service';
import { FileService } from '../../../../core/services/file.service';
import { SearchableSelectComponent, SelectOption } from '../../../../shared/components/searchable-select/searchable-select.component';
import { TRAINEE_ATTENDANCE_STATUSES, TraineeAttendanceListItem, TraineeAttendanceVTO } from '../../../../core/models/trainee-attendance.model';
import { TraineeAttendanceDetailsModalComponent } from './trainee-attendance-details/trainee-attendance-details-modal.component';
import { EnrollmentListItem } from '../../../../core/models/enrollment.model';
import { LightUserVTO } from '../../../../core/models/common.model';
import { FastAttendanceDialogComponent } from './dialog/fast-attendance-dialog.component';

// ============================================================================
// CONSTANTS
// ============================================================================

const STATUS_ENUM_MAP: { [key: number]: string } = {
  1: 'PRESENT',
  2: 'ABSENT',
  3: 'LATE',
  4: 'EXCUSED'
};

// ============================================================================
// TIME CONVERSION HELPER
// ============================================================================

export function convertTo12HourFormat(timeStr: string | undefined | null): string {
  if (!timeStr) return '-';
  
  if (timeStr.includes('AM') || timeStr.includes('PM') || timeStr.includes('ص') || timeStr.includes('م')) {
    return timeStr;
  }
  
  try {
    const parts = timeStr.split(':');
    if (parts.length < 2) return timeStr;
    
    let hours = parseInt(parts[0], 10);
    const minutes = parts[1];
    const seconds = parts.length > 2 ? parts[2] : '';
    
    if (isNaN(hours)) return timeStr;
    
    const ampm = hours >= 12 ? 'م' : 'ص';
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes}${seconds ? ':' + seconds : ''} ${ampm}`;
  } catch (error) {
    return timeStr;
  }
}

// ============================================================================
// PAGE SELECTION DIALOG COMPONENT - ENHANCED COLORS
// ============================================================================

@Component({
  selector: 'app-attendance-export-page-select-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDividerModule
    ],
  template: `
    <div class="dialog-container" dir="rtl">
      <div class="dialog-header" [class.card-print]="isCardPrint">
        <div class="header-icon" [class.card-print]="isCardPrint">
          <mat-icon>{{ isCardPrint ? 'credit_card' : 'description' }}</mat-icon>
        </div>
        <div>
          <h2>{{ isCardPrint ? 'طباعة البطاقات' : 'تصدير التقرير' }}</h2>
          <p>{{ isCardPrint ? 'اختر الصفحات التي تريد طباعة بطاقاتها' : 'اختر الصفحات التي تريد تصديرها' }}</p>
        </div>
        <button mat-icon-button (click)="close()" class="close-btn">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      
      <mat-divider></mat-divider>
      
      <div class="dialog-body">
        <div class="info-section">
          <div class="info-row">
            <span class="info-label">إجمالي الصفحات</span>
            <span class="info-value">{{ data.totalPages }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">إجمالي السجلات</span>
            <span class="info-value">{{ data.totalItems }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">حجم الصفحة</span>
            <span class="info-value">{{ data.pageSize }}</span>
          </div>
        </div>

        <div class="selection-section">
          <div class="selection-options">
            <button 
              mat-raised-button 
              [color]="selectedOption === 'all' ? 'primary' : 'default'"
              (click)="selectedOption = 'all'"
              class="option-btn"
              [class.selected]="selectedOption === 'all'">
              <mat-icon>description</mat-icon>
              <span>جميع الصفحات ({{ data.totalPages }})</span>
              <span class="check-icon" *ngIf="selectedOption === 'all'">✓</span>
            </button>
            
            <button 
              mat-raised-button 
              [color]="selectedOption === 'current' ? 'primary' : 'default'"
              (click)="selectedOption = 'current'"
              class="option-btn"
              [class.selected]="selectedOption === 'current'">
              <mat-icon>description</mat-icon>
              <span>الصفحة الحالية فقط ({{ data.currentPage + 1 }})</span>
              <span class="check-icon" *ngIf="selectedOption === 'current'">✓</span>
            </button>
            
            <button 
              mat-raised-button 
              [color]="selectedOption === 'range' ? 'primary' : 'default'"
              (click)="selectedOption = 'range'"
              class="option-btn"
              [class.selected]="selectedOption === 'range'">
              <mat-icon>description</mat-icon>
              <span>نطاق صفحات محدد</span>
              <span class="check-icon" *ngIf="selectedOption === 'range'">✓</span>
            </button>
          </div>

          <div class="range-section" *ngIf="selectedOption === 'range'">
            <div class="range-inputs">
              <mat-form-field appearance="outline" class="range-field">
                <mat-label>من صفحة</mat-label>
                <input 
                  matInput 
                  type="number" 
                  [(ngModel)]="startPage" 
                  [min]="1" 
                  [max]="data.totalPages"
                  placeholder="1">
                <mat-error *ngIf="startPage < 1 || startPage > data.totalPages">أدخل صفحة صالحة (1 - {{ data.totalPages }})</mat-error>
              </mat-form-field>
              
              <mat-form-field appearance="outline" class="range-field">
                <mat-label>إلى صفحة</mat-label>
                <input 
                  matInput 
                  type="number" 
                  [(ngModel)]="endPage" 
                  [min]="1" 
                  [max]="data.totalPages"
                  placeholder="{{ data.totalPages }}">
                <mat-error *ngIf="endPage < 1 || endPage > data.totalPages">أدخل صفحة صالحة (1 - {{ data.totalPages }})</mat-error>
                <mat-error *ngIf="startPage > endPage">يجب أن تكون صفحة البداية أقل من صفحة النهاية</mat-error>
              </mat-form-field>
            </div>
            
            <div class="range-info">
              <mat-icon>info</mat-icon>
              <span>سيتم {{ isCardPrint ? 'طباعة' : 'تصدير' }} {{ getRangeCount() }} صفحة ({{ getRangeRecords() }} سجل)</span>
            </div>
          </div>
        </div>
      </div>
      
      <mat-divider></mat-divider>
      
      <div class="dialog-actions">
        <button mat-button (click)="close()" class="cancel-btn">إلغاء</button>
        <button 
          mat-raised-button 
          color="primary" 
          (click)="confirm()"
          [disabled]="!isValid()"
          class="confirm-btn">
          <mat-icon>{{ isCardPrint ? 'print' : 'check' }}</mat-icon>
          <span>{{ isCardPrint ? 'طباعة' : 'تصدير' }}</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .dialog-container {
      min-width: 480px;
      max-width: 580px;
      background: white;
      border-radius: 24px;
      overflow: hidden;
      direction: rtl;
      box-shadow: 0 24px 48px rgba(0, 0, 0, 0.2);
    }

    .dialog-header {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px 24px;
      background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
      color: white;
      position: relative;
    }

    .dialog-header.card-print {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    }

    .header-icon {
      width: 48px;
      height: 48px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      backdrop-filter: blur(4px);
    }

    .header-icon.card-print {
      background: rgba(255, 255, 255, 0.25);
    }

    .header-icon mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .dialog-header h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 700;
    }

    .dialog-header p {
      margin: 4px 0 0;
      font-size: 13px;
      opacity: 0.9;
    }

    .close-btn {
      color: white !important;
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(255, 255, 255, 0.15) !important;
      transition: all 0.3s;
    }

    .close-btn:hover {
      background: rgba(255, 255, 255, 0.3) !important;
      transform: translateY(-50%) rotate(90deg);
    }

    .dialog-body {
      padding: 24px;
      background: #fafbfc;
    }

    .info-section {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-bottom: 24px;
      padding: 16px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      border: 1px solid #eef2f6;
    }

    .info-row {
      text-align: center;
      padding: 4px 0;
    }

    .info-label {
      display: block;
      font-size: 11px;
      color: #94a3b8;
      margin-bottom: 4px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .info-value {
      font-size: 20px;
      font-weight: 700;
      color: #1e293b;
    }

    .info-value:last-child {
      color: #8b5cf6;
    }

    .dialog-header.card-print .info-value:last-child {
      color: #f59e0b;
    }

    .selection-section {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .selection-options {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .option-btn {
      width: 100%;
      justify-content: flex-start;
      padding: 12px 20px;
      height: auto;
      border: 2px solid #e5e7eb;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border-radius: 12px;
      background: white;
      position: relative;
      font-weight: 500;
    }

    .option-btn mat-icon {
      margin-left: 12px;
      color: #94a3b8;
      transition: color 0.3s;
    }

    .option-btn.selected {
      border-color: #8b5cf6;
      background: #eff6ff !important;
      box-shadow: 0 4px 12px rgba(139, 92, 246, 0.15);
    }

    .option-btn.selected mat-icon {
      color: #8b5cf6;
    }

    .dialog-header.card-print .option-btn.selected {
      border-color: #f59e0b;
      background: #fffbeb !important;
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.15);
    }

    .dialog-header.card-print .option-btn.selected mat-icon {
      color: #f59e0b;
    }

    .option-btn:hover:not(.selected) {
      border-color: #cbd5e1;
      background: #f8fafc;
      transform: translateY(-1px);
    }

    .check-icon {
      margin-right: auto;
      color: #8b5cf6;
      font-weight: 700;
      font-size: 18px;
    }

    .dialog-header.card-print .check-icon {
      color: #f59e0b;
    }

    .range-section {
      padding: 16px;
      background: white;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    }

    .range-inputs {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .range-field {
      width: 100%;
    }

    .range-field ::ng-deep .mat-form-field-outline {
      background: #fafbfc !important;
      border-radius: 8px !important;
    }

    .range-info {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 12px;
      padding: 10px 14px;
      background: #f1f5f9;
      border-radius: 8px;
      font-size: 13px;
      color: #475569;
    }

    .range-info mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #8b5cf6;
    }

    .dialog-header.card-print .range-info mat-icon {
      color: #f59e0b;
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 16px 24px;
      background: white;
      border-top: 1px solid #eef2f6;
    }

    .dialog-actions button {
      min-width: 100px;
      font-weight: 600;
      border-radius: 10px;
      transition: all 0.3s;
    }

    .cancel-btn {
      color: #64748b !important;
    }

    .cancel-btn:hover {
      background: #f1f5f9 !important;
    }

    .confirm-btn {
      background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%) !important;
      color: white !important;
      box-shadow: 0 4px 16px rgba(139, 92, 246, 0.3) !important;
    }

    .confirm-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(139, 92, 246, 0.4) !important;
    }

    .confirm-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none !important;
      box-shadow: none !important;
    }

    .dialog-header.card-print .confirm-btn {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%) !important;
      box-shadow: 0 4px 16px rgba(245, 158, 11, 0.3) !important;
    }

    .dialog-header.card-print .confirm-btn:hover:not(:disabled) {
      box-shadow: 0 8px 24px rgba(245, 158, 11, 0.4) !important;
    }

    @media (max-width: 600px) {
      .dialog-container {
        min-width: 320px;
        max-width: 95vw;
      }

      .dialog-header {
        padding: 16px 20px;
        flex-wrap: wrap;
      }

      .header-icon {
        width: 40px;
        height: 40px;
      }

      .header-icon mat-icon {
        font-size: 22px;
        width: 22px;
        height: 22px;
      }

      .dialog-header h2 {
        font-size: 17px;
      }

      .dialog-body {
        padding: 16px;
      }

      .info-section {
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        padding: 12px;
      }

      .info-row:last-child {
        grid-column: span 2;
      }

      .info-value {
        font-size: 17px;
      }

      .range-inputs {
        grid-template-columns: 1fr;
        gap: 8px;
      }

      .dialog-actions {
        flex-direction: column-reverse;
        padding: 12px 16px;
        gap: 8px;
      }

      .dialog-actions button {
        width: 100%;
        min-width: unset;
      }

      .close-btn {
        position: relative;
        left: auto;
        top: auto;
        transform: none;
      }

      .close-btn:hover {
        transform: rotate(90deg);
      }
    }

    @media (max-width: 400px) {
      .dialog-container {
        min-width: 280px;
      }

      .info-section {
        grid-template-columns: 1fr;
      }

      .info-row:last-child {
        grid-column: span 1;
      }

      .option-btn {
        font-size: 13px;
        padding: 10px 14px;
      }

      .option-btn mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
    }
  `]
})
export class AttendanceExportPageSelectDialogComponent {
  selectedOption: 'all' | 'current' | 'range' = 'all';
  startPage: number = 1;
  endPage: number = 1;
  isCardPrint: boolean = false;
  
  constructor(
    private dialogRef: MatDialogRef<AttendanceExportPageSelectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      totalPages: number; 
      totalItems: number; 
      pageSize: number; 
      currentPage: number;
      isCardPrint?: boolean;
    }
  ) {
    this.endPage = data.totalPages;
    this.isCardPrint = data.isCardPrint || false;
  }

  getRangeCount(): number {
    if (this.startPage <= this.endPage) {
      return this.endPage - this.startPage + 1;
    }
    return 0;
  }

  getRangeRecords(): number {
    const count = this.getRangeCount();
    return count * this.data.pageSize;
  }

  isValid(): boolean {
    if (this.selectedOption === 'range') {
      return this.startPage >= 1 && 
             this.endPage <= this.data.totalPages && 
             this.startPage <= this.endPage;
    }
    return true;
  }

  confirm(): void {
    let result: any = { option: this.selectedOption };
    
    if (this.selectedOption === 'range') {
      result.startPage = this.startPage - 1;
      result.endPage = this.endPage - 1;
    }
    
    this.dialogRef.close(result);
  }

  close(): void {
    this.dialogRef.close(null);
  }
}

// ============================================================================
// TRAINEE SELECTION DIALOG
// ============================================================================

@Component({
  selector: 'app-trainee-selection-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatListModule
  ],
  template: `
    <h2 mat-dialog-title>اختر المتدرب</h2>
    <mat-dialog-content>
      <p>تم العثور على عدة متدربين. الرجاء اختيار المتدرب المناسب:</p>
      <mat-list>
        <mat-list-item *ngFor="let trainee of data.trainees" (click)="selectTrainee(trainee)" class="trainee-item">
          <mat-icon mat-list-icon>person</mat-icon>
          <div mat-line><strong>{{ trainee.title || trainee.fullName }}</strong></div>
          <div mat-line class="trainee-detail">رقم الهوية: {{ trainee.nationalId }}</div>
          <button mat-raised-button color="primary" (click)="selectTrainee(trainee); $event.stopPropagation()">
            اختر
          </button>
        </mat-list-item>
      </mat-list>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>إلغاء</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .trainee-item {
      cursor: pointer;
      transition: background-color 0.2s;
      border-radius: 8px;
      margin-bottom: 4px;
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      padding: 8px 12px !important;
    }
    .trainee-item:hover {
      background-color: #f3e8ff;
    }
    .trainee-detail {
      color: #6b7280;
      font-size: 12px;
    }
  `]
})
export class TraineeSelectionDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<TraineeSelectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { trainees: any[] }
  ) {}

  selectTrainee(trainee: any): void {
    this.dialogRef.close(trainee);
  }
}

// ============================================================================
// ATTENDANCE DIALOG COMPONENT - COMPLETE WITH FULL STYLES
// ============================================================================

@Component({
  selector: 'app-trainee-attendance-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    SearchableSelectComponent,
    TraineeSelectionDialogComponent
  ],
  template: `
    <div class="dialog-header">
      <div class="dialog-header-content">
        <mat-icon class="header-icon">event_note</mat-icon>
        <h2 mat-dialog-title class="dialog-title">{{ data.title }}</h2>
      </div>
      <button mat-icon-button mat-dialog-close class="dialog-close-btn">
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-divider></mat-divider>

    <mat-dialog-content class="dialog-content">
      <form [formGroup]="data.form" class="dialog-form">

        <!-- Barcode Search -->
        <div class="barcode-search-container">
          <div class="barcode-search-header">
            <mat-icon class="barcode-icon">qr_code_scanner</mat-icon>
            <span class="barcode-title">بحث بالباركود</span>
            <span class="barcode-hint-text">(مسح الباركود أو إدخال رقم الهوية)</span>
          </div>

          <div class="barcode-search-row">
            <mat-form-field appearance="outline" class="barcode-input-field">
              <mat-label>رقم الباركود</mat-label>
              <input #dialogBarcodeInput
                     matInput
                     [(ngModel)]="barcodeSearch"
                     (keydown)="onDialogBarcodeKeydown($event)"
                     placeholder="أدخل رقم الباركود..."
                     [ngModelOptions]="{ standalone: true }">
              <mat-icon matSuffix>qr_code_scanner</mat-icon>
            </mat-form-field>

            <button mat-raised-button color="primary" (click)="searchTraineeInDialog()" class="barcode-search-btn" type="button">
              <mat-icon>search</mat-icon>
              بحث
            </button>

            <button mat-icon-button (click)="clearBarcodeSearch()" matTooltip="مسح" class="barcode-clear-btn" type="button">
              <mat-icon>clear</mat-icon>
            </button>
          </div>

          <div class="barcode-hint" *ngIf="barcodeSearchResult">
            <span class="hint-success" *ngIf="barcodeSearchResult.found">
              <mat-icon>check_circle</mat-icon>
              تم العثور على المتدرب: <strong>{{ barcodeSearchResult.traineeName }}</strong>
            </span>
            <span class="hint-error" *ngIf="barcodeSearchResult.found === false">
              <mat-icon>error</mat-icon>
              {{ barcodeSearchResult.message }}
            </span>
          </div>
        </div>

        <mat-divider></mat-divider>

        <!-- Form Fields -->
        <div class="form-fields-grid">
          <!-- Trainee -->
          <div class="form-field-full">
            <app-searchable-select
              [formControl]="data.form.get('traineeId')"
              label="المتدرب *"
              [options]="traineeOptions"
              [required]="true"
              class="full-width-select"
              (selectionChange)="onTraineeChange($event)">
            </app-searchable-select>
          </div>

          <!-- Session -->
          <div class="form-field-full">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>الجلسة *</mat-label>
              <mat-select
                [formControl]="data.form.get('courseSessionId')"
                [disabled]="isLoadingSessions || sessionOptions.length === 0"
                (selectionChange)="onSessionChange($event.value)">
                <mat-option *ngFor="let option of sessionOptions" [value]="option.value">
                  {{ option.label }}
                </mat-option>
              </mat-select>
              <mat-icon matSuffix>event</mat-icon>
            </mat-form-field>

            <div *ngIf="isLoadingSessions" class="sessions-loading">
              <mat-spinner diameter="20"></mat-spinner>
              <span>جاري تحميل الجلسات...</span>
            </div>

            <div *ngIf="!isLoadingSessions && sessionOptions.length === 0 && data.form.get('traineeId')?.value" class="no-sessions-message">
              <mat-icon>info</mat-icon>
              <span>لا توجد جلسات متاحة لهذا المتدرب</span>
            </div>
          </div>

          <!-- Status -->
          <div class="form-field-full">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>حالة الحضور *</mat-label>
              <mat-select
                [formControl]="data.form.get('status')"
                (selectionChange)="onStatusChange($event.value)">
                <mat-option *ngFor="let status of attendanceStatuses" [value]="status.value">
                  {{ status.label }}
                </mat-option>
              </mat-select>
              <mat-icon matSuffix>check_circle</mat-icon>
            </mat-form-field>
          </div>

          <!-- Date & Late Time -->
          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field-half">
              <mat-label>تاريخ الحضور</mat-label>
              <input matInput [matDatepicker]="datePicker" formControlName="attendanceDate">
              <mat-datepicker-toggle matSuffix [for]="datePicker"></mat-datepicker-toggle>
              <mat-datepicker #datePicker></mat-datepicker>
              <mat-icon matPrefix>event</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field-half">
              <mat-label>وقت التأخير (دقائق)</mat-label>
              <input matInput type="number" formControlName="lateTime" min="0" placeholder="0">
              <mat-icon matPrefix>timer</mat-icon>
            </mat-form-field>
          </div>

          <!-- Check In & Check Out -->
          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field-half">
              <mat-label>وقت الدخول</mat-label>
              <input matInput type="time" formControlName="checkInTime" #checkInInput>
              <mat-icon matPrefix>login</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field-half">
              <mat-label>وقت الخروج</mat-label>
              <input matInput type="time" formControlName="checkOutTime" #checkOutInput>
              <mat-icon matPrefix>logout</mat-icon>
            </mat-form-field>
          </div>

          <!-- Note -->
          <div class="form-field-full">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>ملاحظات</mat-label>
              <textarea matInput formControlName="note" rows="3" placeholder="أدخل أي ملاحظات إضافية..."></textarea>
              <mat-icon matPrefix>note</mat-icon>
            </mat-form-field>
          </div>
        </div>

      </form>
    </mat-dialog-content>

    <mat-divider></mat-divider>

    <mat-dialog-actions align="end" class="dialog-actions">
      <button mat-button mat-dialog-close class="cancel-btn">
        <mat-icon>close</mat-icon>
        إلغاء
      </button>
      <button mat-raised-button color="primary" 
              [disabled]="isLoadingSessions || !isFormValid()" 
              (click)="save()" class="save-btn">
        <mat-icon>save</mat-icon>
        {{ data.editMode ? 'تحديث' : 'حفظ' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    /* ==========================================================================
       DIALOG HEADER
       ========================================================================== */
    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
      color: white;
      border-radius: 24px 24px 0 0;
      position: relative;
      overflow: hidden;
    }

    .dialog-header::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -50%;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 50%;
      pointer-events: none;
    }

    .dialog-header-content {
      display: flex;
      align-items: center;
      gap: 14px;
      z-index: 1;
    }

    .header-icon {
      font-size: 30px;
      width: 30px;
      height: 30px;
      background: rgba(255, 255, 255, 0.2);
      padding: 10px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .dialog-title {
      margin: 0;
      font-size: 22px;
      font-weight: 700;
      letter-spacing: 0.3px;
    }

    .dialog-close-btn {
      color: white !important;
      transition: all 0.3s;
      z-index: 1;
    }

    .dialog-close-btn:hover {
      transform: rotate(90deg) scale(1.1);
      background: rgba(255, 255, 255, 0.15) !important;
    }

    /* ==========================================================================
       DIALOG CONTENT
       ========================================================================== */
    .dialog-content {
      padding: 24px;
      max-height: 70vh;
      overflow-y: auto;
      background: #fafbfc;
    }

    .dialog-content::-webkit-scrollbar {
      width: 6px;
    }

    .dialog-content::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 10px;
    }

    .dialog-content::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #8b5cf6, #6d28d9);
      border-radius: 10px;
    }

    .dialog-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    /* ==========================================================================
       BARCODE SEARCH
       ========================================================================== */
    .barcode-search-container {
      background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
      padding: 16px 20px;
      border-radius: 16px;
      border: 2px solid #e5d5ff;
      transition: all 0.3s;
    }

    .barcode-search-container:focus-within {
      border-color: #8b5cf6;
      box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
    }

    .barcode-search-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 14px;
    }

    .barcode-icon {
      color: #8b5cf6;
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .barcode-title {
      font-weight: 700;
      color: #4c1d95;
      font-size: 15px;
    }

    .barcode-hint-text {
      font-size: 12px;
      color: #7c3aed;
      opacity: 0.8;
      font-weight: 400;
    }

    .barcode-search-row {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .barcode-input-field {
      flex: 1;
    }

    .barcode-input-field ::ng-deep .mat-form-field-wrapper {
      margin: 0;
      padding: 0;
    }

    .barcode-input-field ::ng-deep .mat-form-field-flex {
      padding: 0 12px !important;
      background: white !important;
      border-radius: 8px !important;
      border: 1px solid #e5e7eb;
      transition: all 0.3s;
    }

    .barcode-input-field ::ng-deep .mat-form-field-flex:hover {
      border-color: #8b5cf6;
    }

    .barcode-input-field ::ng-deep .mat-form-field-flex.mat-focused {
      border-color: #8b5cf6;
      box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
    }

    .barcode-input-field ::ng-deep .mat-form-field-infix {
      padding: 8px 0 !important;
      border-top: 0 !important;
    }

    .barcode-input-field ::ng-deep .mat-form-field-outline {
      display: none;
    }

    .barcode-search-btn {
      height: 44px;
      white-space: nowrap;
      background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%) !important;
      color: white !important;
      border-radius: 10px !important;
      font-weight: 600;
      padding: 0 24px;
      transition: all 0.3s !important;
      box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3) !important;
    }

    .barcode-search-btn:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4) !important;
    }

    .barcode-search-btn mat-icon {
      margin-left: 6px;
    }

    .barcode-clear-btn {
      color: #6b7280 !important;
      transition: all 0.3s;
    }

    .barcode-clear-btn:hover {
      color: #ef4444 !important;
      background: #fee2e2 !important;
      border-radius: 50%;
    }

    .barcode-hint {
      margin-top: 12px;
      font-size: 14px;
      border-radius: 10px;
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

    .hint-success {
      color: #065f46;
      background: #d1fae5;
      padding: 10px 16px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      gap: 10px;
      border-right: 4px solid #059669;
    }

    .hint-success mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: #059669;
    }

    .hint-success strong {
      color: #065f46;
    }

    .hint-error {
      color: #991b1b;
      background: #fee2e2;
      padding: 10px 16px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      gap: 10px;
      border-right: 4px solid #dc2626;
    }

    .hint-error mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: #dc2626;
    }

    /* ==========================================================================
       FORM FIELDS
       ========================================================================== */
    .form-fields-grid {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .form-field-full {
      width: 100%;
    }

    .full-width-select {
      width: 100%;
    }

    .full-width-select ::ng-deep .mat-form-field-wrapper {
      margin: 0;
    }

    .full-width {
      width: 100%;
    }

    .full-width ::ng-deep .mat-form-field-flex {
      background: white !important;
      border-radius: 10px !important;
      padding: 0 12px !important;
    }

    .full-width ::ng-deep .mat-form-field-outline {
      color: #d1d5db;
    }

    .full-width ::ng-deep .mat-form-field-outline-thick {
      color: #8b5cf6;
    }

    .full-width ::ng-deep .mat-form-field-infix {
      padding: 10px 0 !important;
      border-top: 0 !important;
    }

    .full-width textarea {
      min-height: 80px;
      resize: vertical;
    }

    .form-row {
      display: flex;
      gap: 16px;
    }

    .form-field-half {
      flex: 1;
      min-width: 0;
    }

    .form-field-half ::ng-deep .mat-form-field-flex {
      background: white !important;
      border-radius: 10px !important;
      padding: 0 12px !important;
    }

    .form-field-half ::ng-deep .mat-form-field-infix {
      padding: 10px 0 !important;
      border-top: 0 !important;
    }

    /* ==========================================================================
       SESSIONS LOADING / NO SESSIONS
       ========================================================================== */
    .sessions-loading {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #6b7280;
      font-size: 13px;
      margin-top: 8px;
      padding: 10px 14px;
      background: #f3e8ff;
      border-radius: 10px;
      border: 1px solid #e5d5ff;
    }

    .sessions-loading mat-spinner {
      margin: 0;
    }

    .sessions-loading ::ng-deep .mat-progress-spinner circle {
      stroke: #8b5cf6 !important;
    }

    .no-sessions-message {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #92400e;
      font-size: 13px;
      margin-top: 8px;
      padding: 10px 14px;
      background: #fffbeb;
      border-radius: 10px;
      border: 1px solid #fef3c7;
    }

    .no-sessions-message mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #f59e0b;
    }

    /* ==========================================================================
       DIALOG ACTIONS
       ========================================================================== */
    .dialog-actions {
      padding: 16px 24px;
      gap: 12px;
      background: white;
      border-radius: 0 0 24px 24px;
    }

    .cancel-btn {
      color: #6b7280 !important;
      font-weight: 500;
      padding: 0 20px;
      transition: all 0.3s;
      border-radius: 8px;
    }

    .cancel-btn:hover {
      background: #f3f4f6 !important;
      transform: translateY(-1px);
    }

    .cancel-btn mat-icon {
      margin-left: 6px;
    }

    .save-btn {
      background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%) !important;
      color: white !important;
      font-weight: 600;
      border-radius: 10px !important;
      padding: 0 28px;
      transition: all 0.3s !important;
      box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3) !important;
    }

    .save-btn:hover:not(:disabled) {
      transform: translateY(-2px) !important;
      box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4) !important;
    }

    .save-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none !important;
      box-shadow: none !important;
    }

    .save-btn mat-icon {
      margin-left: 6px;
    }

    /* ==========================================================================
       RESPONSIVE DESIGN
       ========================================================================== */
    @media (max-width: 768px) {
      .dialog-header {
        padding: 16px 20px;
        border-radius: 16px 16px 0 0;
      }

      .dialog-header-content {
        gap: 10px;
      }

      .header-icon {
        font-size: 22px;
        width: 22px;
        height: 22px;
        padding: 8px;
      }

      .dialog-title {
        font-size: 18px;
      }

      .dialog-content {
        padding: 16px;
        max-height: 65vh;
      }

      .dialog-form {
        gap: 16px;
      }

      .barcode-search-container {
        padding: 12px 16px;
      }

      .barcode-search-row {
        flex-wrap: wrap;
        gap: 8px;
      }

      .barcode-input-field {
        min-width: 100%;
      }

      .barcode-search-btn {
        flex: 1;
        padding: 0 16px;
        height: 40px;
        font-size: 13px;
      }

      .barcode-hint-text {
        display: none;
      }

      .barcode-title {
        font-size: 13px;
      }

      .form-row {
        flex-direction: column;
        gap: 0;
      }

      .form-field-half {
        width: 100%;
      }

      .form-fields-grid {
        gap: 12px;
      }

      .dialog-actions {
        padding: 12px 16px;
        flex-wrap: wrap;
        justify-content: center;
      }

      .save-btn,
      .cancel-btn {
        flex: 1;
        min-width: 120px;
        justify-content: center;
      }

      .save-btn {
        padding: 0 16px;
        height: 44px;
      }

      .cancel-btn {
        padding: 0 16px;
        height: 44px;
      }
    }

    @media (max-width: 480px) {
      .dialog-header {
        padding: 12px 16px;
      }

      .dialog-title {
        font-size: 16px;
      }

      .header-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
        padding: 6px;
      }

      .dialog-content {
        padding: 12px;
        max-height: 60vh;
      }

      .barcode-search-container {
        padding: 10px 12px;
      }

      .barcode-search-header {
        margin-bottom: 10px;
      }

      .barcode-search-btn {
        font-size: 12px;
        padding: 0 12px;
      }

      .barcode-input-field ::ng-deep .mat-form-field-infix {
        padding: 6px 0 !important;
      }

      .full-width ::ng-deep .mat-form-field-infix {
        padding: 8px 0 !important;
      }

      .form-field-half ::ng-deep .mat-form-field-infix {
        padding: 8px 0 !important;
      }

      .dialog-actions {
        padding: 10px 12px;
        gap: 8px;
      }

      .save-btn,
      .cancel-btn {
        min-width: 80px;
        height: 40px;
        font-size: 13px;
      }
    }

    /* ==========================================================================
       ANIMATIONS
       ========================================================================== */
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .dialog-header,
    .dialog-content,
    .dialog-actions {
      animation: fadeInUp 0.3s ease-out;
    }

    .dialog-content {
      animation-delay: 0.05s;
    }

    .dialog-actions {
      animation-delay: 0.1s;
    }

    /* ==========================================================================
       SEARCHABLE SELECT OVERRIDES
       ========================================================================== */
    .full-width-select ::ng-deep .mat-form-field-wrapper {
      margin: 0;
    }

    .full-width-select ::ng-deep .mat-form-field-flex {
      background: white !important;
      border-radius: 10px !important;
      padding: 0 12px !important;
    }

    .full-width-select ::ng-deep .mat-form-field-outline {
      color: #d1d5db;
    }

    .full-width-select ::ng-deep .mat-form-field-outline-thick {
      color: #8b5cf6;
    }

    .full-width-select ::ng-deep .mat-form-field-infix {
      padding: 10px 0 !important;
      border-top: 0 !important;
    }

    /* ==========================================================================
       MATERIAL OVERRIDES
       ========================================================================== */
    ::ng-deep .mat-form-field-appearance-outline .mat-form-field-outline {
      color: #d1d5db !important;
    }

    ::ng-deep .mat-form-field-appearance-outline.mat-focused .mat-form-field-outline {
      color: #8b5cf6 !important;
    }

    ::ng-deep .mat-form-field-appearance-outline .mat-form-field-outline-thick {
      color: #8b5cf6 !important;
    }

    ::ng-deep .mat-form-field-appearance-outline .mat-form-field-label {
      color: #6b7280 !important;
    }

    ::ng-deep .mat-form-field-appearance-outline.mat-focused .mat-form-field-label {
      color: #8b5cf6 !important;
    }

    ::ng-deep .mat-select-value-text {
      color: #1f2937 !important;
    }

    ::ng-deep .mat-option {
      direction: rtl !important;
      font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif !important;
    }

    ::ng-deep .mat-option.mat-active {
      background: #f3e8ff !important;
    }

    ::ng-deep .mat-option:hover {
      background: #f5f3ff !important;
    }

    ::ng-deep .mat-form-field-infix {
      direction: rtl !important;
    }

    ::ng-deep .mat-input-element {
      direction: rtl !important;
    }

    ::ng-deep .mat-datepicker-toggle {
      color: #6b7280 !important;
    }

    ::ng-deep .mat-datepicker-toggle:hover {
      color: #8b5cf6 !important;
    }

    /* Fix for time input */
    ::ng-deep input[type="time"]::-webkit-calendar-picker-indicator {
      filter: invert(0.5);
      cursor: pointer;
    }

    ::ng-deep input[type="time"]:hover::-webkit-calendar-picker-indicator {
      filter: invert(0.3);
    }

    ::ng-deep input[type="time"]::-webkit-datetime-edit {
      direction: ltr !important;
      text-align: center !important;
    }
  `]
})
export class TraineeAttendanceDialogComponent implements OnInit {

  traineeOptions: SelectOption[] = [];
  sessionOptions: SelectOption[] = [];
  attendanceStatuses: SelectOption[] = [];
  isLoadingSessions: boolean = false;

  private sessionsData: any[] = [];

  barcodeSearch: string = '';
  barcodeSearchResult: { found: boolean; traineeName?: string; message?: string } | null = null;
  private allTrainees: any[] = [];

  private readonly STATUS_ENUM_MAP: { [key: number]: string } = {
    1: 'PRESENT',
    2: 'ABSENT',
    3: 'LATE',
    4: 'EXCUSED'
  };

  constructor(
    public dialogRef: MatDialogRef<TraineeAttendanceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private traineeService: TraineeService,
    private notification: NotificationService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
    this.allTrainees = data.trainees || [];
    this.traineeOptions = this.allTrainees.map((t: any) => ({
      value: t.id,
      label: t.title || t.fullName
    }));

    this.sessionOptions = data.sessionOptions || [];
    this.sessionsData = data.sessions || [];

    this.attendanceStatuses = (data.attendanceStatuses || []).map((s: any) => ({
      value: this.STATUS_ENUM_MAP[s.id] || s.id,
      label: s.title
    }));
  }

  ngOnInit(): void {
    this.data.form.get('traineeId')?.valueChanges.subscribe((traineeId: number) => {
      if (traineeId && this.data.loadSessionsFn) {
        this.isLoadingSessions = true;
        this.sessionOptions = [];
        this.sessionsData = [];
        this.data.form.get('courseSessionId')?.setValue(null);
        this.cdr.detectChanges();
        this.data.loadSessionsFn(traineeId);
      }
    });
  }

  isFormValid(): boolean {
    const form = this.data.form;
    const traineeId = form.get('traineeId')?.value;
    const sessionId = form.get('courseSessionId')?.value;
    const status = form.get('status')?.value;
    
    return !!(traineeId && sessionId && status);
  }

  updateSessions(sessions: any[], sessionOptions: SelectOption[]): void {
    this.isLoadingSessions = false;
    this.sessionsData = [...sessions];
    this.sessionOptions = [...sessionOptions];
    this.cdr.detectChanges();

    const currentSessionId = this.data.form.get('courseSessionId')?.value;
    if (currentSessionId && !sessions.find(s => s.id === currentSessionId)) {
      this.data.form.get('courseSessionId')?.setValue(null);
    }
  }

  private formatTimeForInput(timeStr: string | undefined | null): string {
    if (!timeStr) return '';

    if (/^\d{2}:\d{2}$/.test(timeStr)) {
      return timeStr;
    }

    try {
      const parts = timeStr.split(':');
      if (parts.length >= 2) {
        let hours = parseInt(parts[0], 10);
        const minutes = parts[1].padStart(2, '0');
        if (!isNaN(hours)) {
          if (hours > 23) hours = hours % 24;
          return `${hours.toString().padStart(2, '0')}:${minutes}`;
        }
      }

      const date = new Date(timeStr);
      if (!isNaN(date.getTime())) {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
      }

      return timeStr;
    } catch (error) {
      return timeStr;
    }
  }

  onSessionChange(sessionId: number): void {
    if (!sessionId) {
      this.data.form.get('checkInTime')?.setValue('');
      this.data.form.get('checkOutTime')?.setValue('');
      this.cdr.detectChanges();
      return;
    }

    const selectedSession = this.sessionsData.find(s => s.id === sessionId);
    if (!selectedSession) return;

    const form = this.data.form;
    const currentStatus = form.get('status')?.value;

    if (currentStatus === 'PRESENT' || !currentStatus) {
      const checkInTime = this.formatTimeForInput(selectedSession.startTime);
      const checkOutTime = this.formatTimeForInput(selectedSession.endTime);

      if (checkInTime) form.get('checkInTime')?.setValue(checkInTime);
      else form.get('checkInTime')?.setValue('');
      
      if (checkOutTime) form.get('checkOutTime')?.setValue(checkOutTime);
      else form.get('checkOutTime')?.setValue('');
    }
    
    this.cdr.detectChanges();
  }

  onStatusChange(statusValue: any): void {
    const form = this.data.form;
    const sessionId = form.get('courseSessionId')?.value;
    const selectedSession = this.sessionsData.find(s => s.id === sessionId);

    if (statusValue === 'PRESENT' && selectedSession) {
      const checkInTime = this.formatTimeForInput(selectedSession.startTime);
      const checkOutTime = this.formatTimeForInput(selectedSession.endTime);

      if (checkInTime) form.get('checkInTime')?.setValue(checkInTime);
      else form.get('checkInTime')?.setValue('');
      
      if (checkOutTime) form.get('checkOutTime')?.setValue(checkOutTime);
      else form.get('checkOutTime')?.setValue('');
    } else if (statusValue !== 'PRESENT') {
      form.get('checkInTime')?.setValue('');
      form.get('checkOutTime')?.setValue('');
    }
    
    this.cdr.detectChanges();
  }

  onTraineeChange(traineeId: number): void {
    this.data.form.get('courseSessionId')?.setValue(null);
    this.data.form.get('status')?.setValue(null);
    this.data.form.get('checkInTime')?.setValue('');
    this.data.form.get('checkOutTime')?.setValue('');
    
    if (traineeId && this.data.loadSessionsFn) {
      this.isLoadingSessions = true;
      this.sessionOptions = [];
      this.sessionsData = [];
      this.cdr.detectChanges();
      this.data.loadSessionsFn(traineeId);
    }
    
    this.cdr.detectChanges();
  }

  searchTraineeInDialog(): void {
    if (!this.barcodeSearch?.trim()) {
      this.barcodeSearchResult = {
        found: false,
        message: 'الرجاء إدخال رقم الباركود'
      };
      return;
    }

    const searchValue = this.barcodeSearch.trim();

    this.traineeService.getAllTraineesByFilter({ quickSearch: searchValue }).subscribe({
      next: (res: any) => {
        const foundTrainees = res.items || [];

        if (foundTrainees.length === 0) {
          this.setBarcodeSearchResult(false, 'لم يتم العثور على متدرب بهذا الرقم');
          this.notification.showError('لم يتم العثور على متدرب');
          return;
        }

        const exactMatch = foundTrainees.find((t: any) => t.nationalId === searchValue);

        if (exactMatch) {
          this.selectTraineeInDialog(exactMatch);
          this.notification.showSuccess(`تم العثور على المتدرب: ${exactMatch.title || exactMatch.fullName}`);
          return;
        }

        if (foundTrainees.length > 1) {
          this.showTraineeSelectionDialog(foundTrainees);
          return;
        }

        const trainee = foundTrainees[0];
        this.selectTraineeInDialog(trainee);
        this.notification.showSuccess(`تم العثور على المتدرب: ${trainee.title || trainee.fullName}`);
      },
      error: () => {
        this.setBarcodeSearchResult(false, 'حدث خطأ في البحث عن المتدرب');
        this.notification.showError('حدث خطأ في البحث عن المتدرب');
      }
    });
  }

  private selectTraineeInDialog(trainee: any): void {
    this.barcodeSearchResult = {
      found: true,
      traineeName: trainee.title || trainee.fullName
    };
    
    this.data.form.get('traineeId')?.setValue(trainee.id);
    this.barcodeSearch = '';
    
    this.data.form.get('courseSessionId')?.setValue(null);
    this.data.form.get('status')?.setValue(null);
    this.data.form.get('checkInTime')?.setValue('');
    this.data.form.get('checkOutTime')?.setValue('');
    
    if (this.data.loadSessionsFn) {
      this.isLoadingSessions = true;
      this.sessionOptions = [];
      this.sessionsData = [];
      this.cdr.detectChanges();
      this.data.loadSessionsFn(trainee.id);
    }
    
    this.cdr.detectChanges();
  }

  private setBarcodeSearchResult(found: boolean, message: string): void {
    this.barcodeSearchResult = { found, message };
  }

  private showTraineeSelectionDialog(trainees: any[]): void {
    const selectionDialog = this.dialog.open(TraineeSelectionDialogComponent, {
      width: '500px',
      maxWidth: '90vw',
      data: { trainees }
    });

    selectionDialog.afterClosed().subscribe((selected: any) => {
      if (selected) {
        this.selectTraineeInDialog(selected);
        this.notification.showSuccess(`تم اختيار المتدرب: ${selected.title || selected.fullName}`);
      }
    });
  }

  onDialogBarcodeKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.searchTraineeInDialog();
    }
  }

  clearBarcodeSearch(): void {
    this.barcodeSearch = '';
    this.barcodeSearchResult = null;
  }

  save(): void {
    if (!this.isFormValid()) {
      this.notification.showWarning('الرجاء تعبئة جميع الحقول المطلوبة');
      return;
    }

    const formValue = this.data.form.value;

    let statusValue = formValue.status;
    
    if (typeof statusValue === 'number') {
      statusValue = this.STATUS_ENUM_MAP[statusValue] || statusValue;
    }
    
    if (!statusValue) {
      statusValue = 'PRESENT';
    }

    const attendanceData = {
      traineeId: formValue.traineeId,
      courseSessionId: formValue.courseSessionId,
      status: statusValue,
      attendanceDate: formValue.attendanceDate,
      checkInTime: formValue.checkInTime || null,
      checkOutTime: formValue.checkOutTime || null,
      lateTime: formValue.lateTime || null,
      note: formValue.note || null
    };

    this.dialogRef.close(attendanceData);
  }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

@Component({
  selector: 'app-trainee-attendance',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatSelectModule,
    MatTableModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatChipsModule,
    MatTooltipModule,
    MatDividerModule,
    MatListModule,
    SearchableSelectComponent,
    TraineeAttendanceDetailsModalComponent,
    TraineeSelectionDialogComponent,
    AttendanceExportPageSelectDialogComponent,
    FastAttendanceDialogComponent
  ],
  templateUrl: './trainee-attendance.component.html',
  styleUrls: ['./trainee-attendance.component.css']
})
export class TraineeAttendanceComponent implements OnInit, AfterViewInit, OnDestroy {

  // ==========================================================================
  // PROPERTIES
  // ==========================================================================

  Math = Math;
  
  // Week day filter
  selectedDay: string | null = null;
  dayOptions: SelectOption[] = [];
  
  displayedColumns: string[] = ['index', 'traineeImage', 'traineeNationalId', 'traineeName', 'courseTitle', 'sessionTitle','sessionTrainer','sessionDay','attendanceDate', 'status', 'checkInTime', 'checkOutTime', 'lateTime', 'actions'];
  dataSource = new MatTableDataSource<TraineeAttendanceListItem>([]);
  allAttendances: TraineeAttendanceListItem[] = [];
  isLoading = false;

  // ========== PAGINATION ==========
  totalItems: number = 0;
  pageSize: number = 25;
  pageSizeOptions: number[] = [5, 10, 25, 50, 100];
  currentPage: number = 0;

  // ========== SORTING ==========
  sortBy: string = 'CREATION_DATE';
  sortDir: string = 'DESC';

  // Data stores
  courses: any[] = [];
  sessions: any[] = [];
  trainees: any[] = [];

  // Filters
  selectedCourseId: number | null = null;
  selectedSessionId: number | null = null;
  selectedStatus: string | null = null;
  fromDate: string = '';
  toDate: string = '';

  // Barcode
  barcodeSearch: string = '';
  isBarcodeMode: boolean = false;

  // Options
  attendanceStatuses = TRAINEE_ATTENDANCE_STATUSES;
  courseOptions: SelectOption[] = [];
  sessionOptions: SelectOption[] = [];
  statusOptions: SelectOption[] = [];

  // Form
  attendanceForm: FormGroup;
  editMode = false;
  editId: number | null = null;

  // Stats
  summaryStats = {
    total: 0,
    present: 0,
    absent: 0,
    late: 0,
    excused: 0,
    attendanceRate: 0
  };

  // ========== TRAINEE IMAGE CACHE ==========
  traineeImageCache: Map<number, SafeUrl> = new Map();
  traineeImageLoading: Set<number> = new Set();

  // View children
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('barcodeInput') barcodeInput!: ElementRef<HTMLInputElement>;

  // ==========================================================================
  // CONSTRUCTOR
  // ==========================================================================

  constructor(
    private traineeAttendanceService: TraineeAttendanceService,
    private courseService: CourseService,
    private courseSessionService: CourseSessionService,
    private enrollmentService: EnrollmentService,
    private traineeService: TraineeService,
    private notification: NotificationService,
    private reportService: ReportService,
    private fileService: FileService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {
    this.attendanceForm = this.fb.group({
      traineeId: [null, Validators.required],
      courseSessionId: [null, Validators.required],
      status: [null, Validators.required],
      attendanceDate: [new Date().toISOString().split('T')[0]],
      checkInTime: [''],
      checkOutTime: [''],
      lateTime: [null],
      note: ['']
    });
  }

  // ==========================================================================
  // LIFECYCLE HOOKS
  // ==========================================================================

  ngOnInit(): void {
    this.loadSelectOptions();
    this.loadDayOptions();
    this.loadCourses();
    this.loadTrainees();
    this.loadAttendances();
  }

  ngAfterViewInit(): void {
    if (this.barcodeInput) {
      this.barcodeInput.nativeElement.focus();
    }
    
    // Update paginator with current values
    if (this.paginator) {
      this.paginator.length = this.totalItems;
      this.paginator.pageIndex = this.currentPage;
      this.paginator.pageSize = this.pageSize;
    }
  }

  ngOnDestroy(): void {
    // Clean up all cached image URLs
    this.traineeImageCache.forEach((value, key) => {
      if (value && typeof value === 'string') {
        URL.revokeObjectURL(value);
      }
    });
    this.traineeImageCache.clear();
    this.traineeImageLoading.clear();
  }

  // ==========================================================================
  // TIME CONVERSION HELPER
  // ==========================================================================


openFastAttendanceDialog(): void {
  // Get all sessions WITHOUT pagination params
  // The backend will use default values
  this.courseSessionService.getAllSessionsByFilter().subscribe({
    next: (res: any) => {
      const sessions = res.items || [];
      
      console.log('Sessions loaded for Fast Attendance:', sessions);
      
      const sessionOptions = sessions.map((s: any) => {
        const startTime = s.startTime || '';
        const endTime = s.endTime || '';
        const sessionDay = s.sessionDay || '';
        const sessionTitle = s.title || `جلسة #${s.id}`;
        const trainers = s.trainers || [];
        const courseId = s.course?.id;
        
        // Build a descriptive label
        let label = sessionTitle;
        if (sessionDay) {
          label += ` - ${this.getDayDisplay(sessionDay)}`;
        }
        if (startTime) {
          const startTimeDisplay = this.convertTo12HourFormat(startTime);
          label += ` ${startTimeDisplay}`;
          if (endTime) {
            const endTimeDisplay = this.convertTo12HourFormat(endTime);
            label += ` - ${endTimeDisplay}`;
          }
        }
        
        return {
          value: s.id,
          label: label,
          startTime: startTime,
          endTime: endTime,
          day: sessionDay,
          trainers: trainers,
          courseId: courseId
        };
      });

      console.log('Session options with trainers:', sessionOptions);

      const dialogRef = this.dialog.open(FastAttendanceDialogComponent, {
        width: '750px',
        maxWidth: '95vw',
        disableClose: true,
        data: {
          sessionOptions: sessionOptions
        }
      });

      dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
          this.loadAttendances();
          if (result.success > 0) {
            this.notification.showSuccess(`تم تسجيل ${result.success} حضور بنجاح`);
          }
          if (result.failed > 0) {
            this.notification.showWarning(`فشل تسجيل ${result.failed} حضور`);
          }
        }
      });
    },
    error: (error) => {
      console.error('Error loading sessions:', error);
      this.notification.showError('حدث خطأ في تحميل الجلسات');
    }
  });
}

  convertTo12HourFormat(timeStr: string | undefined | null): string {
    return convertTo12HourFormat(timeStr);
  }

  // ==========================================================================
  // TRAINEE IMAGE HELPERS
  // ==========================================================================

  /**
   * Get trainee image URL from FID
   */
  getTraineeImage(trainee: LightUserVTO | undefined | null): SafeUrl | null {
    if (!trainee?.imageUrl || !trainee?.id) {
      return null;
    }
    
    // Check cache first
    if (this.traineeImageCache.has(trainee.id)) {
      return this.traineeImageCache.get(trainee.id)!;
    }
    
    // Check if already loading
    if (this.traineeImageLoading.has(trainee.id)) {
      return null;
    }
    
    // Start loading
    this.traineeImageLoading.add(trainee.id);
    
    this.fileService.downloadFile(trainee.imageUrl).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const safeUrl = this.sanitizer.bypassSecurityTrustUrl(url);
        this.traineeImageCache.set(trainee.id, safeUrl);
        this.traineeImageLoading.delete(trainee.id);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load trainee image for:', trainee.fullName, error);
        this.traineeImageLoading.delete(trainee.id);
        // Set a placeholder to avoid repeated attempts
        this.traineeImageCache.set(trainee.id, this.sanitizer.bypassSecurityTrustUrl(''));
        this.cdr.detectChanges();
      }
    });
    
    return null;
  }

  /**
   * Get trainee display name
   */
  getTraineeDisplayName(trainee: LightUserVTO | undefined | null): string {
    if (!trainee) return '-';
    return trainee.fullName || '-';
  }

  /**
   * Get trainee national ID
   */
  getTraineeNationalId(trainee: LightUserVTO | undefined | null): string {
    if (!trainee) return '-';
    return trainee.nationalId || '-';
  }

  /**
   * Handle image loading error
   */
  onImageError(trainee: LightUserVTO | undefined | null): void {
    if (!trainee?.id) return;
    
    // Clear cache for this trainee if image fails to load
    if (this.traineeImageCache.has(trainee.id)) {
      const url = this.traineeImageCache.get(trainee.id);
      if (url && typeof url === 'string') {
        URL.revokeObjectURL(url);
      }
      this.traineeImageCache.delete(trainee.id);
    }
    this.traineeImageLoading.delete(trainee.id);
    this.cdr.detectChanges();
  }

  /**
   * Get initials for avatar placeholder
   */
  getInitials(name: string): string {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

      getTrainerDisplayName(trainer: any): string {
      if (!trainer) return '-';
      
      // If it's a single object (EmployeeLookupVTO)
      if (typeof trainer === 'object') {
        return trainer.fullName || '-';
      }
      
      // Fallback if it's a string
      if (typeof trainer === 'string') {
        return trainer;
      }
      
      return '-';
    }

  /**
   * Get day display name
   */
  getDayDisplay(day: string): string {
    const dayMap: { [key: string]: string } = {
      'SATURDAY': 'السبت',
      'SUNDAY': 'الأحد',
      'MONDAY': 'الإثنين',
      'TUESDAY': 'الثلاثاء',
      'WEDNESDAY': 'الأربعاء',
      'THURSDAY': 'الخميس',
      'FRIDAY': 'الجمعة'
    };
    return dayMap[day] || day || '-';
  }

  // ==========================================================================
  // GET TOTAL PAGES
  // ==========================================================================

  getTotalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  // ==========================================================================
  // PAGINATION METHODS - FIXED
  // ==========================================================================

  /**
   * Handle page change events from the paginator
   * This includes page size changes and page navigation
   */
  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadAttendances();
  }

  // ==========================================================================
  // LOAD DAY OPTIONS
  // ==========================================================================

  private loadDayOptions(): void {
    this.dayOptions = [
      { value: null, label: 'الكل' },
      { value: 'SATURDAY', label: 'السبت' },
      { value: 'SUNDAY', label: 'الأحد' },
      { value: 'MONDAY', label: 'الإثنين' },
      { value: 'TUESDAY', label: 'الثلاثاء' },
      { value: 'WEDNESDAY', label: 'الأربعاء' },
      { value: 'THURSDAY', label: 'الخميس' },
      { value: 'FRIDAY', label: 'الجمعة' }
    ];
  }

  // ==========================================================================
  // LOAD ATTENDANCES - UPDATED WITH DAY FILTER
  // ==========================================================================

  loadAttendances(): void {
    this.isLoading = true;
    const params: any = {};

    // Apply filters
    if (this.selectedSessionId) params.courseSessionId = this.selectedSessionId;
    
    // Status is already a string enum value (PRESENT, ABSENT, etc.)
    if (this.selectedStatus) {
      params.status = this.selectedStatus;
    }
    
    // Add day filter
    if (this.selectedDay) {
      params.sessionDay = this.selectedDay;
    }
    
    // Date format - convert to yyyy-MM-dd
    if (this.fromDate) {
      params.fromDate = this.formatDateForAPI(this.fromDate);
    }
    if (this.toDate) {
      params.toDate = this.formatDateForAPI(this.toDate);
    }
    
    // If barcode search is active, add traineeNationalId filter
    if (this.barcodeSearch?.trim()) {
      params.traineeNationalId = this.barcodeSearch.trim();
    }

    // Pagination parameters - use current values
    params.pageNum = this.currentPage;
    params.pageSize = this.pageSize;

    // Sorting parameters
    if (this.sortBy) params.orderBy = this.sortBy;
    if (this.sortDir) params.orderDir = this.sortDir;

    console.log('Request params:', params);

    this.traineeAttendanceService.getAllAttendances(params).subscribe({
      next: (res: any) => {
        this.allAttendances = res.items || [];
        this.totalItems = res.total || 0;
        this.dataSource.data = this.allAttendances;
        this.isLoading = false;
        this.calculateSummary();
        this.traineeImageCache.clear();
        this.traineeImageLoading.clear();
        
        if (this.paginator) {
          this.paginator.length = this.totalItems;
          this.paginator.pageIndex = this.currentPage;
          this.paginator.pageSize = this.pageSize;
        }
        
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Load attendances error:', error);
        this.notification.showError('حدث خطأ في تحميل بيانات الحضور');
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Format date for API - converts to yyyy-MM-dd
   */
  private formatDateForAPI(dateStr: string): string {
    if (!dateStr) return '';
    
    try {
      // If it's already in yyyy-MM-dd format, return as is
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        return dateStr;
      }
      
      // Try to parse the date
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        return dateStr;
      }
      
      // Format as yyyy-MM-dd
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error('Date format error:', error);
      return dateStr;
    }
  }

  private calculateSummary(): void {
    const data = this.allAttendances;
    const total = data.length;
    const present = data.filter(a => a.status?.id === 1).length;

    this.summaryStats = {
      total,
      present,
      absent: data.filter(a => a.status?.id === 2).length,
      late: data.filter(a => a.status?.id === 3).length,
      excused: data.filter(a => a.status?.id === 4).length,
      attendanceRate: total > 0 ? Math.round((present / total) * 100) : 0
    };
  }

  // ==========================================================================
  // BARCODE SEARCH - FILTERING ONLY
  // ==========================================================================

  searchTraineeByBarcode(): void {
    if (!this.barcodeSearch?.trim()) {
      this.notification.showWarning('الرجاء إدخال رقم الباركود');
      return;
    }

    this.isLoading = true;
    const searchValue = this.barcodeSearch.trim();

    const params: any = {};

    if (this.selectedSessionId) params.courseSessionId = this.selectedSessionId;
    
    // Status is already a string enum value
    if (this.selectedStatus) {
      params.status = this.selectedStatus;
    }
    
    // Add day filter
    if (this.selectedDay) {
      params.sessionDay = this.selectedDay;
    }
    
    // Date format
    if (this.fromDate) {
      params.fromDate = this.formatDateForAPI(this.fromDate);
    }
    if (this.toDate) {
      params.toDate = this.formatDateForAPI(this.toDate);
    }
    
    // Add traineeNationalId filter
    params.traineeNationalId = searchValue;
    
    params.pageNum = this.currentPage;
    params.pageSize = this.pageSize;

    if (this.sortBy) params.orderBy = this.sortBy;
    if (this.sortDir) params.orderDir = this.sortDir;

    console.log('Barcode search params:', params);

    this.traineeAttendanceService.getAllAttendances(params).subscribe({
      next: (res: any) => {
        this.allAttendances = res.items || [];
        this.totalItems = res.total || 0;
        this.dataSource.data = this.allAttendances;
        this.isLoading = false;
        this.calculateSummary();
        this.traineeImageCache.clear();
        this.traineeImageLoading.clear();
        
        if (this.paginator) {
          this.paginator.length = this.totalItems;
          this.paginator.pageIndex = this.currentPage;
          this.paginator.pageSize = this.pageSize;
        }
        
        this.cdr.detectChanges();
        
        if (this.allAttendances.length === 0) {
          this.notification.showWarning(`لم يتم العثور على سجلات حضور للمتدرب برقم: ${searchValue}`);
        } else {
          this.notification.showSuccess(`تم العثور على ${this.allAttendances.length} سجل حضور للمتدرب`);
        }
        
        this.clearBarcodeSearch();
      },
      error: (error) => {
        console.error('Barcode search error:', error);
        this.isLoading = false;
        this.notification.showError('حدث خطأ في البحث عن سجلات الحضور');
        this.cdr.detectChanges();
      }
    });
  }

  clearBarcodeFilter(): void {
    this.barcodeSearch = '';
    this.isBarcodeMode = false;
    this.currentPage = 0;
    this.loadAttendances();
    this.notification.showSuccess('تم عرض جميع سجلات الحضور');
  }

  private clearBarcodeSearch(): void {
    this.barcodeSearch = '';
    this.isBarcodeMode = false;
  }

  onBarcodeKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.searchTraineeByBarcode();
    }
  }

  toggleBarcodeMode(): void {
    this.isBarcodeMode = !this.isBarcodeMode;
    if (this.isBarcodeMode) {
      setTimeout(() => this.barcodeInput?.nativeElement.focus(), 100);
    } else {
      this.barcodeSearch = '';
    }
  }

  // ==========================================================================
  // LOAD SELECT OPTIONS
  // ==========================================================================

  private loadSelectOptions(): void {
    this.statusOptions = [
      { value: null, label: 'الكل' },
      { value: 'PRESENT', label: 'حاضر' },
      { value: 'ABSENT', label: 'غائب' },
      { value: 'LATE', label: 'متأخر' },
      { value: 'EXCUSED', label: 'معتذر' }
    ];
  }

  private loadCourses(): void {
    this.courseService.getAllCourses().subscribe({
      next: (res: any) => {
        this.courses = res.items || [];
        this.courseOptions = [
          { value: null, label: 'الكل' },
          ...this.courses.map(c => ({ value: c.id, label: c.title }))
        ];
      },
      error: () => this.notification.showError('حدث خطأ في تحميل الدورات')
    });
  }

  private loadTrainees(): void {
    this.enrollmentService.getAllEnrollmentsByFilter().subscribe({
      next: (res: any) => {
        const uniqueTrainees = new Map();
        const items: EnrollmentListItem[] = res.items || [];
        items.forEach((e: EnrollmentListItem) => {
          if (e.trainee && !uniqueTrainees.has(e.trainee.id)) {
            uniqueTrainees.set(e.trainee.id, e.trainee);
          }
        });
        this.trainees = Array.from(uniqueTrainees.values());
      },
      error: () => this.notification.showError('حدث خطأ في تحميل المتدربين')
    });
  }

  // ==========================================================================
  // SESSION LOADING
  // ==========================================================================

  loadTraineeSessions(traineeId: number): void {
    this.isLoading = true;

    this.enrollmentService.getAllEnrollmentsByFilter({ traineeId }).subscribe({
      next: (res: any) => {
        const items: EnrollmentListItem[] = res.items || [];

        if (items.length === 0) {
          this.setEmptySessions('هذا المتدرب غير مسجل في أي دورة');
          return;
        }

        const courseIds = items
          .map((e: EnrollmentListItem) => e.course?.id)
          .filter((id: any) => id && id > 0);

        if (courseIds.length === 0) {
          this.setEmptySessions('لا توجد دورات صالحة لهذا المتدرب');
          return;
        }

        this.loadSessionsForCourses(courseIds);
      },
      error: (error) => {
        console.error('Load trainee sessions error:', error);
        this.notification.showError('حدث خطأ في تحميل تسجيلات المتدرب');
        this.isLoading = false;
        this.updateDialogSessions();
      }
    });
  }

  private loadSessionsForCourses(courseIds: number[]): void {
    let allSessions: any[] = [];
    let completed = 0;

    if (courseIds.length === 0) {
      this.setSessions([]);
      return;
    }

    courseIds.forEach((courseId: number) => {
      // Use getAllSessionsByFilter without courseId
      this.courseSessionService.getAllSessionsByFilter().subscribe({
        next: (res: any) => {
          const sessions = res.items || [];
          allSessions = [...allSessions, ...sessions];
          completed++;

          if (completed === courseIds.length) {
            this.setSessions(allSessions);
          }
        },
        error: (error) => {
          console.error(`Error loading sessions:`, error);
          completed++;
          if (completed === courseIds.length) {
            this.setSessions(allSessions);
          }
        }
      });
    });
  }

  private setSessions(sessions: any[]): void {
    this.sessions = sessions;
    this.sessionOptions = [
      { value: null, label: 'الكل' },
      ...this.sessions.map((s: any) => ({
        value: s.id,
        label: `${s.title} - ${s.sessionDay || s.sessionDate ? new Date(s.sessionDate).toLocaleDateString('ar-EG') : ''}`
      }))
    ];
    this.isLoading = false;
    this.updateDialogSessions();

    if (this.sessions.length === 0) {
      this.notification.showWarning('لا توجد جلسات متاحة لهذا المتدرب');
    }
    
    // Force change detection
    this.cdr.detectChanges();
  }

  private setEmptySessions(message: string): void {
    this.sessions = [];
    this.sessionOptions = [];
    this.isLoading = false;
    this.notification.showWarning(message);
    this.updateDialogSessions();
  }

  private updateDialogSessions(): void {
    const openDialogs = this.dialog.openDialogs;
    if (openDialogs?.length) {
      const dialogComponent = openDialogs[0].componentInstance as TraineeAttendanceDialogComponent;
      if (dialogComponent?.updateSessions) {
        dialogComponent.updateSessions([...this.sessions], [...this.sessionOptions]);
      }
    }
  }

  // ==========================================================================
  // DIALOG MANAGEMENT
  // ==========================================================================

  openAttendanceDialog(attendanceId?: number): void {
    this.editMode = !!attendanceId;
    this.editId = attendanceId || null;

    if (this.editMode && attendanceId) {
      this.traineeAttendanceService.getAttendanceById(attendanceId).subscribe({
        next: (res: any) => {
          const statusEnumName = STATUS_ENUM_MAP[res.status?.id] || res.status;
          this.attendanceForm.patchValue({
            traineeId: res.trainee?.id,
            courseSessionId: res.session?.id,
            status: statusEnumName,
            attendanceDate: res.attendanceDate,
            checkInTime: res.checkInTime ? convertTo12HourFormat(res.checkInTime) : '',
            checkOutTime: res.checkOutTime ? convertTo12HourFormat(res.checkOutTime) : '',
            lateTime: res.lateTime,
            note: res.note
          });

          if (res.trainee?.id) {
            this.loadTraineeSessionsForEdit(res.trainee.id);
          } else {
            this.openDialog();
          }
        },
        error: () => this.notification.showError('حدث خطأ في تحميل البيانات')
      });
      return;
    }

    this.attendanceForm.reset({
      traineeId: null,
      courseSessionId: null,
      status: null,
      attendanceDate: new Date().toISOString().split('T')[0],
      checkInTime: '',
      checkOutTime: '',
      lateTime: null,
      note: ''
    });
    this.sessions = [];
    this.sessionOptions = [];
    this.openDialog();
  }

  openAttendanceDialogWithTrainee(trainee: any): void {
    this.editMode = false;
    this.editId = null;

    this.attendanceForm.reset({
      traineeId: trainee.id,
      courseSessionId: null,
      status: null,
      attendanceDate: new Date().toISOString().split('T')[0],
      checkInTime: '',
      checkOutTime: '',
      lateTime: null,
      note: ''
    });

    this.sessions = [];
    this.sessionOptions = [];
    this.openDialog();
    this.loadTraineeSessions(trainee.id);
  }

  private loadTraineeSessionsForEdit(traineeId: number): void {
    this.enrollmentService.getAllEnrollmentsByFilter({ traineeId }).subscribe({
      next: (res: any) => {
        const items: EnrollmentListItem[] = res.items || [];
        const courseIds = items
          .map((e: EnrollmentListItem) => e.course?.id)
          .filter((id: any) => id && id > 0);

        if (courseIds.length === 0) {
          this.sessions = [];
          this.sessionOptions = [];
          this.openDialog();
          return;
        }

        let allSessions: any[] = [];
        let completed = 0;

        courseIds.forEach((courseId: number) => {
          this.courseSessionService.getAllCourseSessionsByFilter(courseId).subscribe({
            next: (res2: any) => {
              const sessions = res2.items || [];
              allSessions = [...allSessions, ...sessions];
              completed++;

              if (completed === courseIds.length) {
                this.sessions = allSessions;
                this.sessionOptions = this.sessions.map((s: any) => ({
                  value: s.id,
                  label: `${s.title} - ${s.sessionDate ? new Date(s.sessionDate).toLocaleDateString('ar-EG') : ''}`
                }));
                this.updateDialogSessions();
                this.openDialog();
              }
            },
            error: () => {
              completed++;
              if (completed === courseIds.length) {
                this.sessions = allSessions;
                this.sessionOptions = this.sessions.map((s: any) => ({
                  value: s.id,
                  label: `${s.title} - ${s.sessionDate ? new Date(s.sessionDate).toLocaleDateString('ar-EG') : ''}`
                }));
                this.updateDialogSessions();
                this.openDialog();
              }
            }
          });
        });
      },
      error: () => {
        this.sessions = [];
        this.sessionOptions = [];
        this.openDialog();
      }
    });
  }

  private openDialog(): void {
    const dialogRef = this.dialog.open(TraineeAttendanceDialogComponent, {
      width: '700px',
      maxWidth: '95vw',
      disableClose: true,
      data: {
        form: this.attendanceForm,
        trainees: this.trainees,
        sessions: this.sessions,
        sessionOptions: this.sessionOptions,
        attendanceStatuses: this.attendanceStatuses,
        editMode: this.editMode,
        title: this.editMode ? 'تعديل سجل حضور' : 'تسجيل حضور جديد',
        loadSessionsFn: (traineeId: number) => this.loadTraineeSessions(traineeId)
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        const serviceCall = this.editMode
          ? this.traineeAttendanceService.updateAttendance(this.editId!, result)
          : this.traineeAttendanceService.createAttendance(result);

        serviceCall.subscribe({
          next: () => {
            this.notification.showSuccess(
              this.editMode ? 'تم تحديث سجل الحضور بنجاح' : 'تم إضافة سجل الحضور بنجاح'
            );
            this.loadAttendances();
          },
          error: (err) => this.notification.showError(err.error?.messageEn || 'حدث خطأ في حفظ سجل الحضور')
        });
      }
    });
  }

  // ==========================================================================
  // ATTENDANCE CRUD
  // ==========================================================================

  viewAttendance(id: number): void {
    this.traineeAttendanceService.getAttendanceById(id).subscribe({
      next: (attendance: TraineeAttendanceVTO) => {
        const formattedAttendance = {
          ...attendance,
          checkInTime: convertTo12HourFormat(attendance.checkInTime),
          checkOutTime: convertTo12HourFormat(attendance.checkOutTime)
        };
        this.dialog.open(TraineeAttendanceDetailsModalComponent, {
          data: formattedAttendance,
          width: '650px',
          maxWidth: '90vw'
        });
      },
      error: () => this.notification.showError('حدث خطأ في تحميل بيانات سجل الحضور')
    });
  }

  deleteAttendance(id: number): void {
    if (confirm('هل أنت متأكد من حذف سجل الحضور؟')) {
      this.traineeAttendanceService.deleteAttendance(id).subscribe({
        next: () => {
          this.notification.showSuccess('تم حذف سجل الحضور بنجاح');
          this.loadAttendances();
        },
        error: () => this.notification.showError('حدث خطأ في حذف سجل الحضور')
      });
    }
  }

  // ==========================================================================
  // FILTERS
  // ==========================================================================

  onCourseChange(): void {
    if (this.selectedCourseId) {
      // Use getAllCourseSessionsByFilter with courseId
      this.courseSessionService.getAllCourseSessionsByFilter(this.selectedCourseId).subscribe({
        next: (res: any) => {
          this.sessions = res.items || [];
          this.sessionOptions = [
            { value: null, label: 'الكل' },
            ...this.sessions.map(s => ({
              value: s.id,
              label: `${s.title} - ${s.sessionDay || s.sessionDate ? new Date(s.sessionDate).toLocaleDateString('ar-EG') : ''}`
            }))
          ];
          // Reset selected session when course changes
          this.selectedSessionId = null;
          this.updateDialogSessions();
          this.loadAttendances();
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Load sessions error:', error);
          this.notification.showError('حدث خطأ في تحميل الجلسات');
        }
      });
    } else {
      this.sessions = [];
      this.sessionOptions = [{ value: null, label: 'الكل' }];
      this.selectedSessionId = null;
      this.loadAttendances();
      this.updateDialogSessions();
      this.cdr.detectChanges();
    }
  }

  resetFilters(): void {
    this.selectedCourseId = null;
    this.selectedSessionId = null;
    this.selectedStatus = null;
    this.selectedDay = null;
    this.fromDate = '';
    this.toDate = '';
    this.sessions = [];
    this.sessionOptions = [{ value: null, label: 'الكل' }];
    this.barcodeSearch = '';
    this.isBarcodeMode = false;
    this.currentPage = 0;
    this.loadAttendances();
    this.updateDialogSessions();
    this.notification.showSuccess('تم مسح جميع الفلاتر');
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }

  // ==========================================================================
  // EXPORT FUNCTIONS WITH PAGE SELECTION
  // ==========================================================================

  private showExportPageSelection(isCardPrint: boolean = false): Promise<any> {
    return new Promise((resolve) => {
      const totalPages = this.getTotalPages();
      
      if (totalPages <= 1) {
        resolve({ option: 'all' });
        return;
      }

      const dialogRef = this.dialog.open(AttendanceExportPageSelectDialogComponent, {
        width: '580px',
        maxWidth: '95vw',
        disableClose: true,
        data: {
          totalPages: totalPages,
          totalItems: this.totalItems,
          pageSize: this.pageSize,
          currentPage: this.currentPage,
          isCardPrint: isCardPrint
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        resolve(result);
      });
    });
  }

  private async fetchPagesForExport(startPage: number, endPage: number): Promise<TraineeAttendanceListItem[]> {
    const allData: TraineeAttendanceListItem[] = [];
    const totalPages = this.getTotalPages();
    
    for (let page = startPage; page <= Math.min(endPage, totalPages - 1); page++) {
      const params: any = {};

      if (this.selectedSessionId) params.courseSessionId = this.selectedSessionId;
      if (this.selectedStatus) params.status = this.selectedStatus;
      if (this.selectedDay) params.sessionDay = this.selectedDay;
      if (this.fromDate) params.fromDate = this.formatDateForAPI(this.fromDate);
      if (this.toDate) params.toDate = this.formatDateForAPI(this.toDate);

      params.pageNum = page;
      params.pageSize = this.pageSize;

      if (this.sortBy) params.orderBy = this.sortBy;
      if (this.sortDir) params.orderDir = this.sortDir;

      try {
        const res = await this.traineeAttendanceService.getAllAttendances(params).toPromise();
        if (res && res.items) {
          allData.push(...res.items);
        }
      } catch (error) {
        console.error(`Error fetching page ${page}:`, error);
        this.notification.showError(`حدث خطأ في تحميل الصفحة ${page + 1}`);
      }
    }

    return allData;
  }

async exportToExcel(): Promise<void> {
  const result = await this.showExportPageSelection(false);
  
  if (!result) {
    return;
  }

  let dataToExport: TraineeAttendanceListItem[] = [];

  if (result.option === 'all') {
    dataToExport = await this.fetchPagesForExport(0, this.getTotalPages() - 1);
  } else if (result.option === 'current') {
    dataToExport = this.allAttendances;
  } else if (result.option === 'range') {
    dataToExport = await this.fetchPagesForExport(result.startPage, result.endPage);
  }

  if (dataToExport.length === 0) {
    this.notification.showWarning('لا توجد بيانات لتصديرها');
    return;
  }

  const exportData = dataToExport.map((item, index) => ({
    '#': index + 1,
    'رقم الهوية': this.getTraineeNationalId(item.trainee),
    'المتدرب': this.getTraineeDisplayName(item.trainee),
    'الدورة': item.session.course.title || '-',
    'الجلسة': item.session.title || '-',
    'المدرب': this.getTrainerDisplayName(item.session.trainer), // Added trainer column
    'اليوم': this.getDayDisplay(item.session.sessionDay),
    'تاريخ الحضور': item.attendanceDate || '-',
    'حالة الحضور': item.status?.title || '-',
    'وقت الدخول': convertTo12HourFormat(item.checkInTime) || '-',
    'وقت الخروج': convertTo12HourFormat(item.checkOutTime) || '-',
    'وقت التأخير': item.lateTime ? `${item.lateTime} دقيقة` : '-'
  }));

  this.reportService.exportToExcel(exportData, 'trainee-attendance', 'سجلات الحضور');
  this.notification.showSuccess(`تم تصدير ${exportData.length} سجل بنجاح`);
}

async exportToPDF(): Promise<void> {
  const result = await this.showExportPageSelection(false);
  
  if (!result) {
    return;
  }

  this.isLoading = true;

  let dataToPrint: TraineeAttendanceListItem[] = [];

  if (result.option === 'all') {
    dataToPrint = await this.fetchPagesForExport(0, this.getTotalPages() - 1);
  } else if (result.option === 'current') {
    dataToPrint = this.allAttendances;
  } else if (result.option === 'range') {
    dataToPrint = await this.fetchPagesForExport(result.startPage, result.endPage);
  }

  if (dataToPrint.length === 0) {
    this.notification.showWarning('لا توجد بيانات لتصديرها');
    this.isLoading = false;
    return;
  }

  const filterTexts: string[] = [];
  
  if (this.selectedCourseId) {
    const course = this.courses.find(c => c.id === this.selectedCourseId);
    if (course) filterTexts.push(`الدورة: ${course.title}`);
  }
  if (this.selectedSessionId) {
    const session = this.sessions.find(s => s.id === this.selectedSessionId);
    if (session) filterTexts.push(`الجلسة: ${session.title}`);
  }
  if (this.selectedStatus) {
    const statusMap: { [key: string]: string } = {
      'PRESENT': 'حاضر',
      'ABSENT': 'غائب',
      'LATE': 'متأخر',
      'EXCUSED': 'معتذر'
    };
    const statusTitle = statusMap[this.selectedStatus];
    if (statusTitle) {
      filterTexts.push(`حالة الحضور: ${statusTitle}`);
    }
  }
  if (this.selectedDay) {
    const dayMap: { [key: string]: string } = {
      'SATURDAY': 'السبت',
      'SUNDAY': 'الأحد',
      'MONDAY': 'الإثنين',
      'TUESDAY': 'الثلاثاء',
      'WEDNESDAY': 'الأربعاء',
      'THURSDAY': 'الخميس',
      'FRIDAY': 'الجمعة'
    };
    const dayTitle = dayMap[this.selectedDay];
    if (dayTitle) {
      filterTexts.push(`اليوم: ${dayTitle}`);
    }
  }
  if (this.fromDate) {
    filterTexts.push(`من تاريخ: ${this.fromDate}`);
  }
  if (this.toDate) {
    filterTexts.push(`إلى تاريخ: ${this.toDate}`);
  }

  const total = dataToPrint.length;
  const present = dataToPrint.filter(a => a.status?.id === 1).length;
  const exportStats = {
    total,
    present,
    absent: dataToPrint.filter(a => a.status?.id === 2).length,
    late: dataToPrint.filter(a => a.status?.id === 3).length,
    excused: dataToPrint.filter(a => a.status?.id === 4).length,
    attendanceRate: total > 0 ? Math.round((present / total) * 100) : 0
  };

  let tableRows = '';
  dataToPrint.forEach((item: TraineeAttendanceListItem, index: number) => {
    const statusClass = this.getStatusClass(item.status?.id);
    const statusStyles: { [key: string]: string } = {
      present: 'background-color: #d1fae5; color: #065f46;',
      absent: 'background-color: #fee2e2; color: #991b1b;',
      late: 'background-color: #fef3c7; color: #92400e;',
      excused: 'background-color: #dbeafe; color: #1e40af;'
    };
    const statusStyle = statusStyles[statusClass] || '';

    const checkInFormatted = convertTo12HourFormat(item.checkInTime);
    const checkOutFormatted = convertTo12HourFormat(item.checkOutTime);
    const trainerName = this.getTrainerDisplayName(item.session.trainer);

    tableRows += `
      <tr style="background-color: ${index % 2 === 0 ? '#ffffff' : '#f8fafc'};">
        <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${index + 1}</td>
        <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${this.getTraineeNationalId(item.trainee)}</td>
        <td style="text-align: right; padding: 8px; border: 1px solid #ddd; font-weight: bold;">${this.getTraineeDisplayName(item.trainee)}</td>
        <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${item.session.course.title || '-'}</td>
        <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${item.session.title || '-'}</td>
        <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${trainerName}</td>
        <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${this.getDayDisplay(item.session.sessionDay)}</td>
        <td style="text-align: center; padding: 8px; border: 1px solid #ddd; ${statusStyle}">
          ${item.status?.title || '-'}
        </td>
        <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${checkInFormatted}</td>
        <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${checkOutFormatted}</td>
        <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${item.lateTime ? item.lateTime + ' دقيقة' : '-'}</td>
      </tr>
    `;
  });

  const printContainer = document.createElement('div');
  printContainer.style.direction = 'rtl';
  printContainer.style.fontFamily = 'Cairo, "Segoe UI", Tahoma, sans-serif';
  printContainer.style.padding = '20px';
  printContainer.style.backgroundColor = 'white';
  printContainer.style.maxWidth = '1200px';
  printContainer.style.margin = '0 auto';

  printContainer.innerHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>تقرير حضور المتدربين</title>
      <style>
        * { font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif; box-sizing: border-box; }
        @media print {
          body { margin: 0; padding: 20px; background: #f0f4f8; }
          .no-print { display: none; }
          .header { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
        .header {
          text-align: center;
          margin-bottom: 25px;
          padding: 30px 20px;
          background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
          color: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }
        .header h1 { margin: 0; font-size: 28px; font-weight: 800; }
        .header p { margin: 8px 0 0; font-size: 14px; opacity: 0.85; }
        .filters {
          margin-bottom: 20px;
          padding: 14px 20px;
          background: #ffffff;
          border-radius: 12px;
          font-size: 13px;
          color: #1e293b;
          border: 1px solid #e2e8f0;
        }
        .filters strong { color: #0f3460; margin-left: 8px; }
        .stats {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }
        .stat-item {
          text-align: center;
          padding: 16px 12px;
          background: white;
          border-radius: 14px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .stat-value { font-size: 24px; font-weight: 800; color: #8b5cf6; display: block; }
        .stat-label { font-size: 13px; color: #64748b; margin-top: 4px; font-weight: 500; }
        .stat-value.present { color: #10b981; }
        .stat-value.absent { color: #ef4444; }
        .stat-value.late { color: #f59e0b; }
        .stat-value.excused { color: #3b82f6; }
        table {
          width: 100%;
          border-collapse: collapse;
          direction: rtl;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        }
        th {
          background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
          color: white;
          padding: 14px 12px;
          border: none;
          text-align: center;
          font-weight: 700;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
        td { padding: 10px 12px; border: 1px solid #e2e8f0; }
        .total-row td {
          font-weight: 700;
          background: #f8fafc;
          border-top: 2px solid #8b5cf6;
        }
        .no-print {
          text-align: center;
          margin-top: 20px;
          padding: 10px;
        }
        .no-print button {
          padding: 12px 32px;
          background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
          color: white;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          transition: all 0.3s;
        }
        .no-print button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(139,92,246,0.3);
        }
        @media (max-width: 768px) {
          .stats { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 480px) {
          .stats { grid-template-columns: repeat(2, 1fr); }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>📋 تقرير حضور المتدربين</h1>
        <p>تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}</p>
        <p style="opacity:0.7; font-size:13px;">عدد السجلات: ${dataToPrint.length} سجل</p>
      </div>
      ${filterTexts.length ? `<div class="filters"><strong>🔍 الفلاتر المطبقة:</strong> ${filterTexts.join(' | ')}</div>` : ''}
      <div class="stats">
        <div class="stat-item"><span class="stat-value">${exportStats.total}</span><span class="stat-label">📋 إجمالي السجلات</span></div>
        <div class="stat-item"><span class="stat-value present">${exportStats.present}</span><span class="stat-label">✅ حاضر</span></div>
        <div class="stat-item"><span class="stat-value absent">${exportStats.absent}</span><span class="stat-label">❌ غائب</span></div>
        <div class="stat-item"><span class="stat-value late">${exportStats.late}</span><span class="stat-label">⏰ متأخر</span></div>
        <div class="stat-item"><span class="stat-value excused">${exportStats.excused}</span><span class="stat-label">📝 معتذر</span></div>
        <div class="stat-item"><span class="stat-value">${exportStats.attendanceRate}%</span><span class="stat-label">📊 نسبة الحضور</span></div>
      </div>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>رقم الهوية</th>
            <th>المتدرب</th>
            <th>الدورة</th>
            <th>الجلسة</th>
            <th>المدرب</th>
            <th>اليوم</th>
            <th>الحالة</th>
            <th>وقت الدخول</th>
            <th>وقت الخروج</th>
            <th>وقت التأخير</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
          <tr class="total-row">
            <td colspan="11" style="text-align:center; font-weight:700; color:#8b5cf6; font-size:14px;">
              إجمالي عدد السجلات: ${dataToPrint.length}
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- Footer -->
      <div style="text-align: center; margin-top: 16px; padding: 8px 12px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
        <div style="display: flex; justify-content: center; align-items: center; gap: 16px; flex-wrap: wrap;">
          <span style="font-weight: 700; color: #1e293b;">⚡ CoreStack Solutions</span>
          <span>📱 01069911181</span>
          <span style="color: #94a3b8; font-size: 11px;">نظام إدارة الأكاديمية الأولمبية</span>
        </div>
        <div style="font-size: 10px; color: #94a3b8; margin-top: 4px; padding-top: 4px; border-top: 1px solid #f1f5f9;">
          © ${new Date().getFullYear()} CoreStack Solutions. جميع الحقوق محفوظة
        </div>
      </div>
      
      <div class="no-print">
        <button onclick="window.print();">🖨️ طباعة / حفظ كـ PDF</button>
      </div>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank', 'width=1200,height=900,scrollbars=yes');
  if (printWindow) {
    printWindow.document.write(printContainer.innerHTML);
    printWindow.document.close();
    this.isLoading = false;
    this.notification.showSuccess(`تم فتح التقرير - ${dataToPrint.length} سجل`);
  } else {
    document.body.appendChild(printContainer);
    window.print();
    setTimeout(() => { document.body.removeChild(printContainer); }, 500);
    this.isLoading = false;
    this.notification.showSuccess(`تم فتح التقرير - ${dataToPrint.length} سجل`);
  }
}
  // ==========================================================================
  // HELPER METHODS
  // ==========================================================================

  getStatusClass(statusId: number): string {
    const classes: { [key: number]: string } = {
      1: 'present',
      2: 'absent',
      3: 'late',
      4: 'excused'
    };
    return classes[statusId] || '';
  }
}