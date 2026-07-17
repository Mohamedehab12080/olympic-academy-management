// fast-attendance-dialog.component.ts - UPDATED WITH ENROLLMENT-BASED TRAINER SELECTION

import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, ChangeDetectorRef, Inject, HostListener } from '@angular/core';
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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { TraineeAttendanceService } from '../../../../../core/services/trainee-attendance.service';
import { TraineeService } from '../../../../../core/services/trainee.service';
import { EnrollmentService } from '../../../../../core/services/enrollment.service';
import { NotificationService } from '../../../../../core/services/notification.service';

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

export type TraineeAttendanceStatusType = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

export const ATTENDANCE_STATUS_OPTIONS: Array<{ value: TraineeAttendanceStatusType; label: string }> = [
  { value: 'PRESENT', label: 'حاضر' },
  { value: 'ABSENT', label: 'غائب' },
  { value: 'LATE', label: 'متأخر' },
  { value: 'EXCUSED', label: 'معتذر' }
];

export interface SessionOption {
  value: number;
  label: string;
  startTime?: string;
  endTime?: string;
  day?: string;
  courseId?: number;
  trainers?: Array<{ id: number; title: string }>;
}

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
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule
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
    ]),
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-out', style({ opacity: 0 }))
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
            <!-- Searchable Session Dropdown -->
            <div class="config-field session-field">
              <div class="searchable-dropdown" [class.open]="isDropdownOpen" [class.disabled]="isLoadingSessions">
                <mat-form-field appearance="outline" class="full-width dropdown-input">
                  <mat-label>البحث عن جلسة *</mat-label>
                  <input
                    #sessionSearchInput
                    matInput
                    [(ngModel)]="searchTerm"
                    (input)="onSearchInput()"
                    (focus)="onInputFocus()"
                    (blur)="onInputBlur()"
                    placeholder="ابحث باسم الجلسة أو اختر من القائمة..."
                    [disabled]="isLoadingSessions"
                    autocomplete="off">
                  <mat-icon matSuffix (mousedown)="toggleDropdown($event)" class="dropdown-icon">
                    {{ isDropdownOpen ? 'expand_less' : 'expand_more' }}
                  </mat-icon>
                  <mat-spinner matSuffix diameter="20" *ngIf="isLoadingSessions"></mat-spinner>
                </mat-form-field>

                <!-- Dropdown Panel -->
                <div class="dropdown-panel" *ngIf="isDropdownOpen" @fadeInOut>
                  <!-- Loading State -->
                  <div class="dropdown-loading" *ngIf="isLoadingSessions">
                    <mat-spinner diameter="30"></mat-spinner>
                    <span>جاري تحميل الجلسات...</span>
                  </div>

                  <!-- No Results -->
                  <div class="dropdown-empty" *ngIf="!isLoadingSessions && filteredSessions.length === 0">
                    <mat-icon>search_off</mat-icon>
                    <span *ngIf="searchTerm">لا توجد جلسات مطابقة لـ "{{ searchTerm }}"</span>
                    <span *ngIf="!searchTerm">لا توجد جلسات متاحة</span>
                  </div>

                  <!-- Session Options -->
                  <div class="dropdown-options" *ngIf="!isLoadingSessions && filteredSessions.length > 0">
                    <div
                      *ngFor="let session of filteredSessions"
                      class="dropdown-option"
                      [class.selected]="selectedSessionId === session.value"
                      (mousedown)="selectSession($event, session)">
                      <div class="option-content">
                        <div class="option-main">
                          <span class="option-title">{{ session.label }}</span>
                          <span class="option-id">#{{ session.value }}</span>
                        </div>
                        <div class="option-details" *ngIf="session.day || session.startTime">
                          <span *ngIf="session.day" class="option-day">{{ session.day }}</span>
                          <span *ngIf="session.startTime" class="option-time">
                            <mat-icon>schedule</mat-icon>
                            {{ formatTimeForDisplay(session.startTime) }}
                            <span *ngIf="session.endTime"> - {{ formatTimeForDisplay(session.endTime) }}</span>
                          </span>
                        </div>
                      </div>
                      <mat-icon *ngIf="selectedSessionId === session.value" class="check-icon">check_circle</mat-icon>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Selected Session Display -->
              <div class="selected-session-display" *ngIf="selectedSession">
                <div class="selected-session-info">
                  <mat-icon>event</mat-icon>
                  <div class="selected-session-details">
                    <span class="selected-session-title">{{ selectedSession.label }}</span>
                    <span class="selected-session-meta" *ngIf="selectedSession.day || selectedSession.startTime">
                      <span *ngIf="selectedSession.day">{{ selectedSession.day }}</span>
                      <span *ngIf="selectedSession.startTime">
                        {{ formatTimeForDisplay(selectedSession.startTime) }}
                        <span *ngIf="selectedSession.endTime"> - {{ formatTimeForDisplay(selectedSession.endTime) }}</span>
                      </span>
                    </span>
                  </div>
                </div>
                <button 
                  mat-icon-button 
                  (click)="clearSelectedSession($event)" 
                  matTooltip="إلغاء تحديد الجلسة"
                  class="clear-selection-btn">
                  <mat-icon>close</mat-icon>
                </button>
              </div>
            </div>

            <!-- Trainer Selection - Auto-populated from enrollment -->
            <div class="config-field">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>المدرب *</mat-label>
                <mat-select 
                  [(ngModel)]="selectedTrainerId" 
                  [disabled]="!selectedSession || selectedSession.trainers?.length === 0 || isLoadingEnrollment">
                  <mat-option *ngFor="let trainer of selectedSession?.trainers || []" [value]="trainer.id">
                    {{ trainer.title }}
                  </mat-option>
                </mat-select>
                <mat-icon matSuffix>person</mat-icon>
                <mat-spinner matSuffix diameter="20" *ngIf="isLoadingEnrollment"></mat-spinner>
              </mat-form-field>
              
              <!-- Loading state -->
              <div class="field-hint loading" *ngIf="isLoadingEnrollment">
                <mat-icon>hourglass_empty</mat-icon>
                <span>جاري البحث عن تسجيل المتدرب...</span>
              </div>
              
              <!-- No session selected -->
              <div class="field-hint" *ngIf="!selectedSession">
                <mat-icon>info</mat-icon>
                <span>الرجاء اختيار الجلسة أولاً</span>
              </div>
              
              <!-- No trainers available -->
              <div class="field-hint warning" *ngIf="selectedSession && selectedSession.trainers?.length === 0">
                <mat-icon>warning</mat-icon>
                <span>لا يوجد مدربين لهذه الجلسة</span>
              </div>
              
              <!-- Auto-selected from enrollment -->
              <div class="field-hint success" *ngIf="enrollmentFound && selectedTrainerId">
                <mat-icon>check_circle</mat-icon>
                <span>تم تحديد المدرب تلقائياً من تسجيل المتدرب</span>
              </div>
              
              <!-- No enrollment found -->
              <div class="field-hint warning" *ngIf="enrollmentChecked && !enrollmentFound && selectedSession">
                <mat-icon>warning</mat-icon>
                <span>لم يتم العثور على تسجيل لهذا المتدرب في هذه الدورة</span>
              </div>
              
              <!-- Multiple trainers available hint -->
              <div class="field-hint" *ngIf="selectedSession && selectedSession.trainers && selectedSession.trainers.length > 1 && !enrollmentFound">
                <mat-icon>people</mat-icon>
                <span>اختر المدرب المناسب من القائمة</span>
              </div>
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

            <!-- Attendance Date -->
            <div class="config-field full-width">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>تاريخ الحضور</mat-label>
                <input matInput [matDatepicker]="datePicker" [(ngModel)]="attendanceDate" placeholder="اختر التاريخ">
                <mat-datepicker-toggle matSuffix [for]="datePicker"></mat-datepicker-toggle>
                <mat-datepicker #datePicker></mat-datepicker>
                <mat-icon matPrefix>event</mat-icon>
              </mat-form-field>
            </div>

            <!-- Check In & Check Out -->
            <div class="config-field time-fields">
              <div class="time-field-group">
                <mat-form-field appearance="outline" class="time-field">
                  <mat-label>وقت الدخول</mat-label>
                  <input matInput type="time" [(ngModel)]="checkInTime" placeholder="--:--">
                  <mat-icon matPrefix>login</mat-icon>
                </mat-form-field>
                
                <mat-form-field appearance="outline" class="time-field">
                  <mat-label>وقت الخروج</mat-label>
                  <input matInput type="time" [(ngModel)]="checkOutTime" placeholder="--:--">
                  <mat-icon matPrefix>logout</mat-icon>
                </mat-form-field>
              </div>
              <div class="time-hint" *ngIf="selectedSession && (checkInTime || checkOutTime)">
                <mat-icon>info</mat-icon>
                <span>تم تعبئة الأوقات تلقائياً من الجلسة المحددة</span>
              </div>
              <div class="time-hint warning" *ngIf="selectedSession && !checkInTime && !checkOutTime">
                <mat-icon>warning</mat-icon>
                <span>لا توجد أوقات محددة لهذه الجلسة، يمكنك إدخالها يدوياً</span>
              </div>
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
            <span class="badge success-badge" *ngIf="recentScans.length > 0">{{ recentScans.length }} مسح</span>
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
                  [disabled]="!isConfigurationValid() || isProcessing"
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

          <!-- Quick Actions -->
          <div class="quick-actions" *ngIf="isConfigurationValid()">
            <button mat-stroked-button (click)="focusBarcodeInput()" class="quick-action-btn">
              <mat-icon>keyboard</mat-icon>
              <span>تركيز الإدخال</span>
            </button>
            <button mat-stroked-button (click)="clearBarcode()" class="quick-action-btn" [disabled]="!barcodeSearch">
              <mat-icon>clear</mat-icon>
              <span>مسح</span>
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
            <button mat-icon-button (click)="clearRecentScans()" matTooltip="مسح القائمة" class="clear-scans-btn">
              <mat-icon>delete_sweep</mat-icon>
            </button>
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
    /* ============================================ */
    /* CONTAINER */
    /* ============================================ */
    .dialog-container {
      min-width: 620px;
      max-width: 750px;
      background: #ffffff;
      border-radius: 24px;
      overflow: hidden;
      direction: rtl;
      box-shadow: 0 24px 48px rgba(0, 0, 0, 0.2);
    }

    /* ============================================ */
    /* HEADER */
    /* ============================================ */
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

    /* ============================================ */
    /* DIALOG BODY */
    /* ============================================ */
    .dialog-body {
      padding: 20px 24px;
      max-height: 65vh;
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

    /* ============================================ */
    /* SECTION TITLE */
    /* ============================================ */
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

    .badge.success-badge {
      background: #d1fae5;
      color: #065f46;
    }

    /* ============================================ */
    /* CONFIG SECTION */
    /* ============================================ */
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

    .config-field.full-width {
      grid-column: 1 / -1;
    }

    .config-field.time-fields {
      grid-column: 1 / -1;
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

    /* ============================================ */
    /* FIELD HINTS */
    /* ============================================ */
    .field-hint {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 6px;
      font-size: 12px;
      color: #6b7280;
      padding: 4px 10px;
      background: #f3f4f6;
      border-radius: 8px;
    }

    .field-hint mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: #7c3aed;
    }

    .field-hint.warning {
      background: #fffbeb;
      color: #92400e;
    }

    .field-hint.warning mat-icon {
      color: #f59e0b;
    }

    .field-hint.success {
      background: #d1fae5;
      color: #065f46;
    }

    .field-hint.success mat-icon {
      color: #059669;
    }

    .field-hint.loading {
      background: #ede9fe;
      color: #5b21b6;
    }

    .field-hint.loading mat-icon {
      color: #7c3aed;
    }

    /* ============================================ */
    /* SESSION DROPDOWN */
    /* ============================================ */
    .session-field {
      position: relative;
      z-index: 10;
    }

    .searchable-dropdown {
      position: relative;
      width: 100%;
    }

    .searchable-dropdown.disabled {
      opacity: 0.7;
    }

    .dropdown-icon {
      cursor: pointer;
      color: #94a3b8;
      transition: transform 0.3s;
      user-select: none;
    }

    .dropdown-icon:hover {
      color: #7c3aed;
    }

    .dropdown-panel {
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
      right: 0;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      max-height: 300px;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
      z-index: 1000;
    }

    .dropdown-options {
      max-height: 260px;
      overflow-y: auto;
      padding: 4px 0;
    }

    .dropdown-options::-webkit-scrollbar {
      width: 4px;
    }

    .dropdown-options::-webkit-scrollbar-track {
      background: #f1f5f9;
    }

    .dropdown-options::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #7c3aed, #4f46e5);
      border-radius: 10px;
    }

    .dropdown-option {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 14px;
      cursor: pointer;
      transition: all 0.2s;
      border-bottom: 1px solid #f1f5f9;
    }

    .dropdown-option:last-child {
      border-bottom: none;
    }

    .dropdown-option:hover {
      background: #f5f3ff;
    }

    .dropdown-option.selected {
      background: #ede9fe;
    }

    .dropdown-option .option-content {
      flex: 1;
      min-width: 0;
    }

    .dropdown-option .option-main {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .dropdown-option .option-title {
      font-weight: 500;
      color: #1e293b;
      font-size: 14px;
    }

    .dropdown-option .option-id {
      font-size: 11px;
      color: #94a3b8;
      background: #f1f5f9;
      padding: 0 8px;
      border-radius: 4px;
    }

    .dropdown-option .option-details {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 2px;
      flex-wrap: wrap;
    }

    .dropdown-option .option-day {
      font-size: 12px;
      color: #7c3aed;
      background: #ede9fe;
      padding: 0 8px;
      border-radius: 4px;
    }

    .dropdown-option .option-time {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: #64748b;
    }

    .dropdown-option .option-time mat-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
      color: #94a3b8;
    }

    .dropdown-option .check-icon {
      color: #7c3aed;
      font-size: 20px;
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    /* ============================================ */
    /* SELECTED SESSION DISPLAY */
    /* ============================================ */
    .selected-session-display {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 8px;
      padding: 10px 14px;
      background: #f5f3ff;
      border-radius: 10px;
      border: 1px solid #e5d5ff;
    }

    .selected-session-info {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }

    .selected-session-info mat-icon {
      color: #7c3aed;
      font-size: 20px;
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    .selected-session-details {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .selected-session-title {
      font-weight: 600;
      color: #4c1d95;
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .selected-session-meta {
      font-size: 12px;
      color: #6b7280;
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .clear-selection-btn {
      color: #6b7280 !important;
      transition: all 0.3s;
      flex-shrink: 0;
    }

    .clear-selection-btn:hover {
      color: #ef4444 !important;
      background: #fee2e2 !important;
    }

    .clear-selection-btn mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    /* ============================================ */
    /* TIME FIELDS */
    /* ============================================ */
    .time-field-group {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .time-field {
      width: 100%;
    }

    .time-field ::ng-deep .mat-form-field-wrapper {
      margin: 0;
    }

    .time-field ::ng-deep .mat-form-field-flex {
      background: #f8fafc !important;
      border-radius: 10px !important;
      padding: 0 12px !important;
      border: 1px solid #e2e8f0;
      transition: all 0.3s;
    }

    .time-field ::ng-deep .mat-form-field-flex:hover {
      border-color: #7c3aed;
    }

    .time-field ::ng-deep .mat-form-field-flex.mat-focused {
      border-color: #7c3aed;
      box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
    }

    .time-field ::ng-deep .mat-form-field-outline {
      display: none;
    }

    .time-field ::ng-deep .mat-form-field-infix {
      padding: 10px 0 !important;
      border-top: 0 !important;
    }

    .time-hint {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 8px;
      font-size: 12px;
      color: #6b7280;
      padding: 6px 12px;
      background: #f3f4f6;
      border-radius: 8px;
    }

    .time-hint mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: #7c3aed;
    }

    .time-hint.warning {
      background: #fffbeb;
      color: #92400e;
    }

    .time-hint.warning mat-icon {
      color: #f59e0b;
    }

    /* ============================================ */
    /* SCANNER SECTION */
    /* ============================================ */
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

    .quick-actions {
      display: flex;
      gap: 8px;
      margin-top: 12px;
    }

    .quick-action-btn {
      border-radius: 8px !important;
      border-color: #e2e8f0 !important;
      color: #475569 !important;
      font-size: 12px;
      padding: 0 12px !important;
      height: 32px !important;
      line-height: 32px !important;
    }

    .quick-action-btn mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      margin-left: 4px;
    }

    .quick-action-btn:hover {
      border-color: #7c3aed !important;
      color: #7c3aed !important;
      background: #f5f3ff !important;
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

    /* ============================================ */
    /* RECENT LIST */
    /* ============================================ */
    .recent-list {
      background: white;
      padding: 16px 20px;
      border-radius: 16px;
      border: 1px solid #e2e8f0;
    }

    .clear-scans-btn {
      color: #94a3b8 !important;
      transition: all 0.3s;
    }

    .clear-scans-btn:hover {
      color: #ef4444 !important;
      background: #fee2e2 !important;
    }

    .clear-scans-btn mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
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

    /* ============================================ */
    /* FOOTER */
    /* ============================================ */
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

    /* ============================================ */
    /* RESPONSIVE */
    /* ============================================ */
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
        gap: 12px;
      }

      .config-field.full-width {
        grid-column: 1;
      }

      .config-field.time-fields {
        grid-column: 1;
      }

      .time-field-group {
        grid-template-columns: 1fr 1fr;
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

      .dropdown-panel {
        max-height: 250px;
      }

      .dropdown-options {
        max-height: 210px;
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
        max-height: 130px;
      }

      .selected-session-display {
        flex-wrap: wrap;
        gap: 8px;
      }

      .selected-session-details {
        min-width: 0;
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

      .time-field-group {
        grid-template-columns: 1fr;
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

      .dropdown-option {
        padding: 8px 12px;
      }

      .dropdown-option .option-title {
        font-size: 13px;
      }

      .dropdown-option .option-details {
        gap: 8px;
      }

      .selected-session-title {
        font-size: 13px;
      }
    }

    /* ============================================ */
    /* MATERIAL OVERRIDES */
    /* ============================================ */
    ::ng-deep .mat-form-field-appearance-outline .mat-form-field-outline {
      color: #d1d5db !important;
    }

    ::ng-deep .mat-form-field-appearance-outline.mat-focused .mat-form-field-outline {
      color: #7c3aed !important;
    }

    ::ng-deep .mat-form-field-appearance-outline .mat-form-field-outline-thick {
      color: #7c3aed !important;
    }

    ::ng-deep .mat-form-field-appearance-outline .mat-form-field-label {
      color: #64748b !important;
    }

    ::ng-deep .mat-form-field-appearance-outline.mat-focused .mat-form-field-label {
      color: #7c3aed !important;
    }

    ::ng-deep .mat-form-field-infix {
      direction: rtl !important;
    }

    ::ng-deep .mat-input-element {
      direction: rtl !important;
    }

    ::ng-deep .mat-form-field-prefix,
    ::ng-deep .mat-form-field-suffix {
      color: #94a3b8 !important;
    }

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
export class FastAttendanceDialogComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('barcodeInput') barcodeInput!: ElementRef<HTMLInputElement>;
  @ViewChild('sessionSearchInput') sessionSearchInput!: ElementRef<HTMLInputElement>;

  // ==========================================================================
  // PROPERTIES
  // ==========================================================================

  // Sessions
  allSessions: SessionOption[] = [];
  filteredSessions: SessionOption[] = [];
  selectedSessionId: number | null = null;
  selectedSession: SessionOption | null = null;
  searchTerm: string = '';
  isDropdownOpen: boolean = false;
  isLoadingSessions: boolean = false;

  // Trainer
  selectedTrainerId: number | null = null;
  isLoadingEnrollment: boolean = false;
  enrollmentFound: boolean = false;
  enrollmentChecked: boolean = false;

  // Status
  selectedStatus: TraineeAttendanceStatusType | null = null;
  attendanceStatuses = ATTENDANCE_STATUS_OPTIONS;

  // Date & Time
  attendanceDate: Date = new Date();
  checkInTime: string = '';
  checkOutTime: string = '';

  // Barcode
  barcodeSearch: string = '';
  isProcessing: boolean = false;
  isScannerActive: boolean = false;

  // Current trainee being processed
  private currentTraineeId: number | null = null;
  private currentTraineeNationalId: string | null = null;

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

  // Cleanup
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  // ==========================================================================
  // CONSTRUCTOR
  // ==========================================================================

  constructor(
    public dialogRef: MatDialogRef<FastAttendanceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { sessionOptions: SessionOption[] },
    private traineeAttendanceService: TraineeAttendanceService,
    private traineeService: TraineeService,
    private enrollmentService: EnrollmentService,
    private notification: NotificationService,
    private cdr: ChangeDetectorRef
  ) {
    this.allSessions = data.sessionOptions || [];
    this.filteredSessions = [...this.allSessions];
    
    console.log('FastAttendanceDialog received data:', this.data);
    console.log('Session options with trainers:', this.allSessions);
  }

  // ==========================================================================
  // LIFECYCLE
  // ==========================================================================

  ngOnInit(): void {
    this.selectedStatus = 'PRESENT';
    this.attendanceDate = new Date();

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(term => {
      this.filterSessions(term);
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.focusBarcodeInput(), 300);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ==========================================================================
  // DROPDOWN METHODS
  // ==========================================================================

  openDropdown(): void {
    if (!this.isDropdownOpen && !this.isLoadingSessions) {
      this.isDropdownOpen = true;
      this.filterSessions(this.searchTerm);
      this.cdr.detectChanges();
    }
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
    this.cdr.detectChanges();
  }

  toggleDropdown(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.isDropdownOpen) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  onInputFocus(): void {
    this.openDropdown();
  }

  onInputBlur(): void {
    setTimeout(() => {
      if (!this.isDropdownOpen) {
        // Keep dropdown open if user is still interacting
      }
    }, 150);
  }

  onSearchInput(): void {
    this.searchSubject.next(this.searchTerm);
    if (!this.isDropdownOpen) {
      this.openDropdown();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const dropdown = target.closest('.searchable-dropdown');
    if (!dropdown && this.isDropdownOpen) {
      this.closeDropdown();
    }
  }

  filterSessions(searchTerm: string): void {
    if (!searchTerm || searchTerm.trim() === '') {
      this.filteredSessions = [...this.allSessions];
      return;
    }

    const term = searchTerm.toLowerCase().trim();
    this.filteredSessions = this.allSessions.filter(session =>
      session.label.toLowerCase().includes(term) ||
      session.value.toString().includes(term)
    );
  }

  // ==========================================================================
  // SESSION SELECTION
  // ==========================================================================

  selectSession(event: Event, session: SessionOption): void {
    event.preventDefault();
    event.stopPropagation();
    
    this.selectedSessionId = session.value;
    this.selectedSession = session;
    this.searchTerm = session.label;
    this.closeDropdown();

    // Reset trainer selection
    this.selectedTrainerId = null;
    this.enrollmentFound = false;
    this.enrollmentChecked = false;

    // Populate times
    if (session.startTime) {
      this.checkInTime = this.formatTimeForInput(session.startTime);
    } else {
      this.checkInTime = '';
    }
    
    if (session.endTime) {
      this.checkOutTime = this.formatTimeForInput(session.endTime);
    } else {
      this.checkOutTime = '';
    }

    // If we have a current trainee, try to find their enrollment
    if (this.currentTraineeId) {
      this.findTraineeEnrollment(this.currentTraineeId, session.courseId);
    }

    this.cdr.detectChanges();
    setTimeout(() => this.focusBarcodeInput(), 100);
  }

  clearSelectedSession(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.selectedSessionId = null;
    this.selectedSession = null;
    this.selectedTrainerId = null;
    this.enrollmentFound = false;
    this.enrollmentChecked = false;
    this.searchTerm = '';
    this.filteredSessions = [...this.allSessions];
    this.checkInTime = '';
    this.checkOutTime = '';
    this.closeDropdown();
    this.cdr.detectChanges();
    setTimeout(() => this.focusBarcodeInput(), 100);
  }

  // ==========================================================================
  // ENROLLMENT-BASED TRAINER SELECTION
  // ==========================================================================

  /**
   * Find trainee enrollment for the selected course
   */
  private findTraineeEnrollment(traineeId: number, courseId?: number): void {
    if (!courseId) {
      // Try to get courseId from selected session
      if (this.selectedSession?.courseId) {
        courseId = this.selectedSession.courseId;
      } else {
        return;
      }
    }

    this.isLoadingEnrollment = true;
    this.enrollmentFound = false;
    this.enrollmentChecked = false;
    this.selectedTrainerId = null;

    // Use the trainee's national ID if available, otherwise use trainee ID
    const traineeNationalId = this.currentTraineeNationalId || undefined;

    const params: any = {};
    if (traineeNationalId) {
      params.traineeNationalId = traineeNationalId;
    } else {
      params.traineeId = traineeId;
    }
    params.courseId = courseId;

    console.log('Searching enrollment with params:', params);

    this.enrollmentService.getAllEnrollmentsDetailsByFilter(params).subscribe({
      next: (res: any) => {
        this.isLoadingEnrollment = false;
        this.enrollmentChecked = true;

        const enrollments = res.items || [];
        
        if (enrollments.length > 0) {
          // Find the first enrollment for this course
          const enrollment = enrollments[0];
          
          if (enrollment.trainer) {
            const trainerId = enrollment.trainer.id;
            const trainerTitle = enrollment.trainer.title;
            
            // Check if this trainer exists in the session's trainers list
            const sessionTrainers = this.selectedSession?.trainers || [];
            const trainerExists = sessionTrainers.some(t => t.id === trainerId);
            
            if (trainerExists) {
              this.selectedTrainerId = trainerId;
              this.enrollmentFound = true;
              console.log(`Auto-selected trainer: ${trainerTitle} (ID: ${trainerId}) from enrollment`);
              this.notification.showSuccess(`تم تحديد المدرب تلقائياً: ${trainerTitle}`);
            } else {
              // Trainer from enrollment is not in the session's trainers list
              console.warn(`Trainer ${trainerTitle} (ID: ${trainerId}) not found in session trainers`);
              
              // Try to match by trainer name if available
              const matchedTrainer = sessionTrainers.find(t => 
                t.title?.toLowerCase().includes(trainerTitle?.toLowerCase() || '') ||
                trainerTitle?.toLowerCase().includes(t.title?.toLowerCase() || '')
              );
              
              if (matchedTrainer) {
                this.selectedTrainerId = matchedTrainer.id;
                this.enrollmentFound = true;
                console.log(`Auto-selected trainer by name match: ${matchedTrainer.title}`);
                this.notification.showSuccess(`تم تحديد المدرب تلقائياً: ${matchedTrainer.title}`);
              } else {
                // No matching trainer found
                this.notification.showWarning(`المدرب "${trainerTitle}" غير متاح في هذه الجلسة، الرجاء الاختيار يدوياً`);
              }
            }
          } else {
            console.warn('Enrollment found but no trainer assigned');
            this.notification.showWarning('تم العثور على تسجيل لكن لا يوجد مدرب معين');
          }
        } else {
          console.log('No enrollment found for this trainee and course');
          this.notification.showWarning('لم يتم العثور على تسجيل لهذا المتدرب في هذه الدورة');
        }
        
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error finding enrollment:', error);
        this.isLoadingEnrollment = false;
        this.enrollmentChecked = true;
        this.cdr.detectChanges();
      }
    });
  }

  // ==========================================================================
  // UTILITY METHODS
  // ==========================================================================

  formatTimeForInput(timeStr: string | undefined | null): string {
    if (!timeStr) return '';
    
    // If it's already in HH:mm format
    if (/^\d{2}:\d{2}$/.test(timeStr)) {
      return timeStr;
    }
    
    try {
      let time = timeStr.replace(/\s*[AP]M\s*/i, '').trim();
      const parts = time.split(':');
      if (parts.length >= 2) {
        let hours = parseInt(parts[0], 10);
        const minutes = parts[1].padStart(2, '0');
        if (!isNaN(hours)) {
          if (hours > 23) hours = hours % 24;
          return `${hours.toString().padStart(2, '0')}:${minutes}`;
        }
      }
      return timeStr;
    } catch (error) {
      return timeStr;
    }
  }

  formatTimeForDisplay(timeStr: string | undefined | null): string {
    if (!timeStr) return '';
    const formatted = this.formatTimeForInput(timeStr);
    if (formatted && formatted !== timeStr) {
      return formatted;
    }
    return timeStr;
  }

  isConfigurationValid(): boolean {
    return !!(this.selectedSessionId && this.selectedTrainerId && this.selectedStatus);
  }

  // ==========================================================================
  // BARCODE SCANNING
  // ==========================================================================

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
      this.showStatusMessage(false, 'الرجاء اختيار الجلسة والمدرب وحالة الحضور أولاً');
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
    // Store current trainee info for enrollment lookup
    this.currentTraineeId = trainee.id;
    this.currentTraineeNationalId = trainee.nationalId;

    // If session has courseId, try to find enrollment to auto-select trainer
    if (this.selectedSession?.courseId) {
      this.findTraineeEnrollment(trainee.id, this.selectedSession.courseId);
    }

    const attendanceData = {
      traineeId: trainee.id,
      courseSessionId: this.selectedSessionId!,
      trainerId: this.selectedTrainerId!,
      status: this.selectedStatus!,
      attendanceDate: this.attendanceDate.toISOString().split('T')[0],
      checkInTime: this.checkInTime || null,
      checkOutTime: this.checkOutTime || null,
      lateTime: this.selectedStatus === 'LATE' ? 0 : null,
      note: 'تم التسجيل عبر المسح السريع'
    };

    console.log('Creating attendance with data:', attendanceData);

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
        console.error('Error creating attendance:', err);
        this.handleScanError(err.error?.messageEn || 'حدث خطأ في تسجيل الحضور');
        this.addRecentScan(trainee, false, err.error?.messageEn || 'فشل التسجيل');
      }
    });
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

  clearRecentScans(): void {
    this.recentScans = [];
    this.cdr.detectChanges();
  }

  // ==========================================================================
  // FOCUS METHODS
  // ==========================================================================

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

  // ==========================================================================
  // DIALOG ACTIONS
  // ==========================================================================

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