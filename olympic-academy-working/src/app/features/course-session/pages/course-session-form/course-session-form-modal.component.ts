import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { animate, style, transition, trigger } from '@angular/animations';
import { Subject, takeUntil } from 'rxjs';

import { CourseSessionService } from '../../../../core/services/course-session.service';
import { CourseService } from '../../../../core/services/course.service';
import { EmployeeService } from '../../../../core/services/employee.service';
import { PlaceService } from '../../../../core/services/place.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { SearchableSelectComponent, SelectOption } from '../../../../shared/components/searchable-select/searchable-select.component';

// ============ INTERFACES & CONSTANTS ============

interface StatusOption {
  id: number;
  value: string;
  label: string;
  color: string;
  icon: string;
}

const STATUS_OPTIONS: StatusOption[] = [
  { id: 0, value: 'SCHEDULED', label: 'مجدول', color: '#3b82f6', icon: 'schedule' },
  { id: 1, value: 'IN_PROGRESS', label: 'في تقدم', color: '#f59e0b', icon: 'play_circle' },
  { id: 2, value: 'COMPLETED', label: 'مكتمل', color: '#10b981', icon: 'check_circle' },
  { id: 3, value: 'CANCELLED', label: 'ملغي', color: '#ef4444', icon: 'cancel' }
];

const WEEK_DAYS = [
  { value: 'SUNDAY', label: 'الأحد' },
  { value: 'MONDAY', label: 'الإثنين' },
  { value: 'TUESDAY', label: 'الثلاثاء' },
  { value: 'WEDNESDAY', label: 'الأربعاء' },
  { value: 'THURSDAY', label: 'الخميس' },
  { value: 'FRIDAY', label: 'الجمعة' },
  { value: 'SATURDAY', label: 'السبت' }
];

@Component({
  selector: 'app-course-session-form-modal',
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
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDialogModule,
    MatDividerModule,
    MatChipsModule,
    MatAutocompleteModule,
    SearchableSelectComponent
  ],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('200ms cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ opacity: 0, transform: 'scale(0.95)' }))
      ])
    ])
  ],
  template: `
    <div class="modal-container" [@fadeInOut]>
      <!-- ========== HEADER ========== -->
      <div class="modal-header" [class.edit-mode]="data.mode === 'edit'">
        <div class="header-decoration"></div>
        <div class="header-content-wrapper">
          <div class="header-icon">
            <mat-icon>{{ data.mode === 'edit' ? 'edit_note' : 'event_note' }}</mat-icon>
          </div>
          <div class="header-text">
            <h2>{{ data.mode === 'edit' ? 'تعديل الجلسة التدريبية' : 'جلسة تدريبية جديدة' }}</h2>
            <p>{{ data.mode === 'edit' ? 'قم بتحديث بيانات الجلسة التدريبية' : 'أضف جلسة تدريبية جديدة إلى الدورة' }}</p>
          </div>
        </div>
        <button mat-icon-button (click)="onClose()" class="close-btn" matTooltip="إغلاق">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-divider></mat-divider>

      <!-- ========== BODY ========== -->
      <div class="modal-body">
        <form [formGroup]="sessionForm" (ngSubmit)="onSubmit()" class="session-form">
          
          <!-- Section 1: Basic Information -->
          <div class="form-section">
            <div class="section-header">
              <div class="section-icon-wrapper">
                <mat-icon>info</mat-icon>
              </div>
              <div class="section-title">
                <h3>المعلومات الأساسية</h3>
                <p>أدخل عنوان الجلسة</p>
              </div>
            </div>
            
            <div class="form-grid">
              <div class="form-field full-width">
                <mat-form-field appearance="outline" class="custom-form-field">
                  <mat-label>عنوان الجلسة</mat-label>
                  <input matInput formControlName="title" placeholder="مثال: مقدمة في البرمجة" autofocus>
                  <mat-icon matPrefix>title</mat-icon>
                  <mat-error *ngIf="sessionForm.get('title')?.hasError('required')">
                    عنوان الجلسة مطلوب
                  </mat-error>
                  <mat-error *ngIf="sessionForm.get('title')?.hasError('minlength')">
                    عنوان الجلسة يجب أن يكون على الأقل 3 أحرف
                  </mat-error>
                </mat-form-field>
              </div>
            </div>
          </div>

          <mat-divider></mat-divider>

          <!-- Section 2: Course and Place -->
          <div class="form-section">
            <div class="section-header">
              <div class="section-icon-wrapper">
                <mat-icon>assignment</mat-icon>
              </div>
              <div class="section-title">
                <h3>الدورة والمكان</h3>
                <p>اختر الدورة والمكان</p>
              </div>
            </div>

            <div class="form-grid">
              <div class="form-field">
                <div class="field-label-wrapper">
                  <label class="field-label">
                    <mat-icon>school</mat-icon>
                    <span>الدورة التدريبية</span>
                    <span class="required-star">*</span>
                  </label>
                </div>
                <app-searchable-select
                  [ngModel]="sessionForm.get('courseId')?.value"
                  (ngModelChange)="sessionForm.get('courseId')?.setValue($event)"
                  placeholder="اختر الدورة التدريبية"
                  [options]="courseOptions"
                  [required]="true"
                  [disabled]="data.mode === 'edit'"
                  [ngModelOptions]="{standalone: true}">
                </app-searchable-select>
                <div class="field-hint" *ngIf="data.mode === 'edit'">
                  <mat-icon>info</mat-icon>
                  <span>لا يمكن تغيير الدورة بعد إنشاء الجلسة</span>
                </div>
              </div>

              <div class="form-field">
                <div class="field-label-wrapper">
                  <label class="field-label">
                    <mat-icon>location_on</mat-icon>
                    <span>المكان</span>
                    <span class="required-star">*</span>
                  </label>
                </div>
                <app-searchable-select
                  [ngModel]="sessionForm.get('placeId')?.value"
                  (ngModelChange)="sessionForm.get('placeId')?.setValue($event)"
                  placeholder="اختر المكان"
                  [options]="placeOptions"
                  [required]="true"
                  [ngModelOptions]="{standalone: true}">
                </app-searchable-select>
              </div>
            </div>
          </div>

          <mat-divider></mat-divider>

          <!-- Section 3: Trainers Selection (Multiple) -->
          <div class="form-section">
            <div class="section-header">
              <div class="section-icon-wrapper">
                <mat-icon>people</mat-icon>
              </div>
              <div class="section-title">
                <h3>المدربون</h3>
                <p>اختر واحد أو أكثر من المدربين للجلسة</p>
              </div>
            </div>

            <div class="form-grid">
              <div class="form-field full-width">
                <mat-form-field appearance="outline" class="custom-form-field">
                  <mat-label>المدربون</mat-label>
                  <mat-select formControlName="trainersId" multiple>
                    <mat-option *ngFor="let trainer of trainers" [value]="trainer.id">
                      {{ trainer.title || trainer.name || trainer.firstName + ' ' + trainer.lastName }}
                    </mat-option>
                  </mat-select>
                  <mat-icon matPrefix>person_add</mat-icon>
                  <mat-error *ngIf="sessionForm.get('trainersId')?.hasError('required')">
                    يجب اختيار مدرب واحد على الأقل
                  </mat-error>
                  <mat-hint>
                    <mat-icon>info</mat-icon>
                    يمكنك اختيار أكثر من مدرب
                  </mat-hint>
                </mat-form-field>
                
                <!-- Selected Trainers Chips -->
                <div class="selected-chips" *ngIf="selectedTrainers.length > 0">
                  <mat-chip-set>
                    <mat-chip *ngFor="let trainer of selectedTrainers" [removable]="true" (removed)="removeTrainer(trainer.id)">
                      <mat-icon matChipAvatar>person</mat-icon>
                      {{ trainer.title || trainer.name || trainer.firstName + ' ' + trainer.lastName }}
                      <button matChipRemove>
                        <mat-icon>cancel</mat-icon>
                      </button>
                    </mat-chip>
                  </mat-chip-set>
                </div>
              </div>
            </div>
          </div>

          <mat-divider></mat-divider>

          <!-- Section 4: Days Selection (Multiple) -->
          <div class="form-section">
            <div class="section-header">
              <div class="section-icon-wrapper">
                <mat-icon>calendar_today</mat-icon>
              </div>
              <div class="section-title">
                <h3>أيام الجلسة</h3>
                <p>اختر يوم أو أكثر من أيام الجلسة</p>
              </div>
            </div>

            <div class="form-grid">
              <div class="form-field full-width">
                <mat-form-field appearance="outline" class="custom-form-field">
                  <mat-label>أيام الجلسة</mat-label>
                  <mat-select formControlName="sessionDays" multiple>
                    <mat-option *ngFor="let day of weekDays" [value]="day.value">
                      {{ day.label }}
                    </mat-option>
                  </mat-select>
                  <mat-icon matPrefix>event</mat-icon>
                  <mat-error *ngIf="sessionForm.get('sessionDays')?.hasError('required')">
                    يجب اختيار يوم واحد على الأقل
                  </mat-error>
                  <mat-hint>
                    <mat-icon>info</mat-icon>
                    يمكنك اختيار أكثر من يوم
                  </mat-hint>
                </mat-form-field>

                <!-- Selected Days Chips -->
                <div class="selected-chips" *ngIf="selectedDays.length > 0">
                  <mat-chip-set>
                    <mat-chip *ngFor="let day of selectedDays" [removable]="true" (removed)="removeDay(day.value)">
                      <mat-icon matChipAvatar>today</mat-icon>
                      {{ day.label }}
                      <button matChipRemove>
                        <mat-icon>cancel</mat-icon>
                      </button>
                    </mat-chip>
                  </mat-chip-set>
                </div>
              </div>
            </div>
          </div>

          <mat-divider></mat-divider>

          <!-- Section 5: Date, Time & Status -->
          <div class="form-section">
            <div class="section-header">
              <div class="section-icon-wrapper">
                <mat-icon>schedule</mat-icon>
              </div>
              <div class="section-title">
                <h3>التاريخ والوقت والحالة</h3>
                <p>حدد تاريخ الجلسة وتوقيتها وحالتها</p>
              </div>
            </div>

            <div class="form-grid">
              <!-- Session Date - Optional -->
              <div class="form-field">
                <mat-form-field appearance="outline" class="custom-form-field">
                  <mat-label>تاريخ الجلسة</mat-label>
                  <input matInput [matDatepicker]="datePicker" formControlName="sessionDate" placeholder="اختر التاريخ">
                  <mat-datepicker-toggle matSuffix [for]="datePicker"></mat-datepicker-toggle>
                  <mat-datepicker #datePicker></mat-datepicker>
                  <mat-icon matPrefix>event</mat-icon>
                  <mat-hint>
                    <mat-icon>info</mat-icon>
                    اختياري
                  </mat-hint>
                </mat-form-field>
              </div>

              <!-- Start Time -->
              <div class="form-field">
                <mat-form-field appearance="outline" class="custom-form-field">
                  <mat-label>وقت البدء</mat-label>
                  <input matInput type="time" formControlName="startTime" placeholder="--:--">
                  <mat-icon matPrefix>play_circle</mat-icon>
                  <mat-error *ngIf="sessionForm.get('startTime')?.hasError('required')">
                    وقت البدء مطلوب
                  </mat-error>
                </mat-form-field>
              </div>

              <!-- End Time -->
              <div class="form-field">
                <mat-form-field appearance="outline" class="custom-form-field">
                  <mat-label>وقت الانتهاء</mat-label>
                  <input matInput type="time" formControlName="endTime" placeholder="--:--">
                  <mat-icon matPrefix>stop_circle</mat-icon>
                  <mat-error *ngIf="sessionForm.get('endTime')?.hasError('required')">
                    وقت الانتهاء مطلوب
                  </mat-error>
                  <mat-error *ngIf="sessionForm.hasError('timeRange')">
                    وقت الانتهاء يجب أن يكون بعد وقت البدء
                  </mat-error>
                </mat-form-field>
              </div>

              <!-- Session Status -->
              <div class="form-field">
                <div class="field-label-wrapper">
                  <label class="field-label">
                    <mat-icon>flag</mat-icon>
                    <span>حالة الجلسة</span>
                  </label>
                </div>
                <mat-form-field appearance="outline" class="custom-form-field">
                  <mat-label>اختر الحالة</mat-label>
                  <mat-select formControlName="status">
                    <mat-option *ngFor="let status of statusOptions" [value]="status.value">
                      <div class="status-option">
                        <span class="status-dot" [style.background-color]="status.color"></span>
                        <span>{{ status.label }}</span>
                      </div>
                    </mat-option>
                  </mat-select>
                </mat-form-field>
              </div>
            </div>
          </div>

          <mat-divider></mat-divider>

          <!-- Section 6: Additional Information -->
          <div class="form-section">
            <div class="section-header">
              <div class="section-icon-wrapper">
                <mat-icon>notes</mat-icon>
              </div>
              <div class="section-title">
                <h3>معلومات إضافية</h3>
                <p>أضف ملاحظات أو تعليمات خاصة</p>
              </div>
            </div>

            <div class="form-grid">
              <div class="form-field full-width">
                <mat-form-field appearance="outline" class="custom-form-field">
                  <mat-label>ملاحظات إضافية</mat-label>
                  <textarea matInput formControlName="note" rows="4" 
                            placeholder="أضف أي ملاحظات أو تعليمات خاصة بالجلسة..."></textarea>
                  <mat-icon matPrefix>note_add</mat-icon>
                </mat-form-field>
              </div>
            </div>
          </div>

          <!-- ========== FORM ACTIONS ========== -->
          <div class="form-actions">
            <div class="actions-left">
              <button mat-stroked-button type="button" (click)="onClose()" class="cancel-btn">
                <mat-icon>close</mat-icon>
                <span>إلغاء</span>
              </button>
            </div>
            <div class="actions-right">
              <button mat-raised-button color="primary" type="submit" 
                      [disabled]="sessionForm.invalid || isLoading" 
                      class="submit-btn">
                <mat-icon>{{ data.mode === 'edit' ? 'update' : 'save' }}</mat-icon>
                <span>{{ data.mode === 'edit' ? 'تحديث البيانات' : 'حفظ الجلسة' }}</span>
                <div class="btn-ripple" *ngIf="isLoading"></div>
              </button>
            </div>
          </div>
        </form>
      </div>

      <!-- ========== LOADING OVERLAY ========== -->
      <div class="loading-overlay" *ngIf="isLoading" [@fadeInOut]>
        <div class="loading-content">
          <div class="loading-spinner-wrapper">
            <mat-spinner diameter="60" color="accent"></mat-spinner>
          </div>
          <div class="loading-text">
            <p>{{ data.mode === 'edit' ? 'جاري تحديث البيانات...' : 'جاري حفظ البيانات...' }}</p>
            <span class="loading-subtitle">يرجى الانتظار، سيتم توجيهك قريباً</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* ========== CONTAINER ========== */
    .modal-container {
      position: relative;
      background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
      border-radius: 32px;
      overflow: hidden;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.3);
      min-width: 780px;
      max-width: 900px;
    }

    /* ========== HEADER ========== */
    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 24px 32px;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
      color: white;
      position: relative;
      overflow: hidden;
    }

    .modal-header.edit-mode {
      background: linear-gradient(135deg, #1a1a2e 0%, #0f3460 50%, #1e3a5f 100%);
    }

    .header-decoration {
      position: absolute;
      top: -50%;
      right: -20%;
      width: 300px;
      height: 300px;
      background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
    }

    .header-decoration::after {
      content: '';
      position: absolute;
      bottom: -30%;
      left: -10%;
      width: 200px;
      height: 200px;
      background: radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%);
      border-radius: 50%;
    }

    .header-content-wrapper {
      display: flex;
      align-items: center;
      gap: 20px;
      z-index: 1;
    }

    .header-icon {
      width: 52px;
      height: 52px;
      background: rgba(255, 255, 255, 0.12);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }

    .header-icon mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .header-text h2 {
      margin: 0 0 4px 0;
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -0.3px;
    }

    .header-text p {
      margin: 0;
      font-size: 13px;
      opacity: 0.8;
      font-weight: 300;
    }

    .close-btn {
      color: white !important;
      background: rgba(255, 255, 255, 0.08) !important;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 1;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .close-btn:hover {
      background: rgba(255, 255, 255, 0.15) !important;
      transform: rotate(90deg) scale(1.05);
    }

    /* ========== BODY ========== */
    .modal-body {
      flex: 1;
      overflow-y: auto;
      padding: 24px 32px 16px;
    }

    .modal-body::-webkit-scrollbar {
      width: 6px;
    }

    .modal-body::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 10px;
    }

    .modal-body::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 10px;
    }

    .modal-body::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }

    /* ========== FORM SECTIONS ========== */
    .form-section {
      margin-bottom: 28px;
      padding: 20px 24px;
      background: white;
      border-radius: 16px;
      border: 1px solid #e8edf2;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      transition: all 0.3s ease;
    }

    .form-section:hover {
      border-color: #cbd5e1;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 20px;
    }

    .section-icon-wrapper {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .section-icon-wrapper mat-icon {
      color: #667eea;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .section-title h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #0f172a;
    }

    .section-title p {
      margin: 2px 0 0;
      font-size: 12px;
      color: #94a3b8;
    }

    /* ========== FORM GRID ========== */
    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .form-field.full-width {
      grid-column: span 2;
    }

    /* ========== FIELD LABELS ========== */
    .field-label-wrapper {
      margin-bottom: 2px;
    }

    .field-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      font-weight: 600;
      color: #334155;
    }

    .field-label mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: #94a3b8;
    }

    .required-star {
      color: #ef4444;
      font-size: 14px;
    }

    .field-hint {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: #f59e0b;
      margin-top: 6px;
    }

    .field-hint mat-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
    }

    /* ========== SELECTED CHIPS ========== */
    .selected-chips {
      margin-top: 8px;
    }

    .selected-chips mat-chip-set {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .selected-chips mat-chip {
      background: #e8edf2;
      border-radius: 8px;
      padding: 4px 12px;
      font-size: 13px;
    }

    .selected-chips mat-chip mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    /* ========== FORM FIELD CUSTOMIZATION ========== */
    ::ng-deep .custom-form-field .mat-form-field-outline {
      background: #fafbfc;
      border-radius: 12px;
      transition: all 0.3s ease;
    }

    ::ng-deep .custom-form-field .mat-form-field-flex {
      padding: 0 14px;
    }

    ::ng-deep .custom-form-field .mat-form-field-prefix {
      margin-left: 10px;
      color: #94a3b8;
    }

    ::ng-deep .custom-form-field .mat-form-field-suffix {
      margin-right: 4px;
    }

    ::ng-deep .custom-form-field:hover .mat-form-field-outline {
      background: #f8fafc;
    }

    ::ng-deep .custom-form-field.mat-focused .mat-form-field-outline {
      background: #f1f5f9;
    }

    ::ng-deep .custom-form-field .mat-form-field-outline-thick {
      color: #667eea !important;
    }

    ::ng-deep .custom-form-field .mat-form-field-label {
      color: #94a3b8 !important;
    }

    ::ng-deep .custom-form-field.mat-focused .mat-form-field-label {
      color: #667eea !important;
    }

    ::ng-deep .custom-form-field .mat-hint {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #94a3b8;
      font-size: 11px;
    }

    ::ng-deep .custom-form-field .mat-hint mat-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
      color: #94a3b8;
    }

    /* ========== STATUS OPTIONS ========== */
    .status-option {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .status-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      display: inline-block;
      flex-shrink: 0;
    }

    /* ========== FORM ACTIONS ========== */
    .form-actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 0 8px;
      border-top: 2px solid #f1f5f9;
      margin-top: 8px;
    }

    .actions-left,
    .actions-right {
      display: flex;
      gap: 12px;
    }

    .submit-btn,
    .cancel-btn {
      padding: 0 28px;
      height: 44px;
      font-weight: 600;
      font-size: 14px;
      position: relative;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border-radius: 12px;
    }

    .submit-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
      color: white !important;
      box-shadow: 0 4px 16px rgba(102, 126, 234, 0.25);
    }

    .submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 28px rgba(102, 126, 234, 0.35);
    }

    .submit-btn:active:not(:disabled) {
      transform: translateY(0);
    }

    .submit-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-ripple {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      animation: shimmer 1.5s infinite;
    }

    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }

    .cancel-btn {
      border: 2px solid #e2e8f0 !important;
      color: #475569 !important;
      background: white !important;
    }

    .cancel-btn:hover {
      background: #f8fafc !important;
      border-color: #cbd5e1 !important;
      transform: translateY(-1px);
    }

    /* ========== LOADING OVERLAY ========== */
    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.97);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      backdrop-filter: blur(8px);
    }

    .loading-content {
      text-align: center;
    }

    .loading-spinner-wrapper {
      display: inline-block;
      animation: pulse 1.5s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    .loading-text {
      margin-top: 20px;
    }

    .loading-text p {
      margin: 0;
      color: #667eea;
      font-weight: 600;
      font-size: 16px;
    }

    .loading-subtitle {
      font-size: 12px;
      color: #94a3b8;
      margin-top: 4px;
      display: inline-block;
    }

    /* ========== RESPONSIVE ========== */
    @media (max-width: 820px) {
      .modal-container {
        min-width: 90vw;
        max-width: 95vw;
        border-radius: 24px;
      }

      .modal-header {
        padding: 20px;
      }

      .header-icon {
        width: 44px;
        height: 44px;
      }

      .header-icon mat-icon {
        font-size: 22px;
        width: 22px;
        height: 22px;
      }

      .header-text h2 {
        font-size: 18px;
      }

      .modal-body {
        padding: 16px 20px;
      }

      .form-section {
        padding: 16px;
      }

      .form-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .form-field.full-width {
        grid-column: span 1;
      }

      .form-actions {
        flex-direction: column;
        gap: 12px;
        padding: 16px 0 8px;
      }

      .actions-left,
      .actions-right {
        width: 100%;
      }

      .submit-btn,
      .cancel-btn {
        width: 100%;
        justify-content: center;
      }
    }

    @media (max-width: 480px) {
      .modal-container {
        border-radius: 16px;
        max-height: 95vh;
      }

      .modal-header {
        padding: 16px;
        flex-wrap: wrap;
      }

      .header-content-wrapper {
        flex: 1;
        gap: 12px;
      }

      .header-text h2 {
        font-size: 16px;
      }

      .header-text p {
        font-size: 11px;
      }

      .close-btn {
        width: 36px;
        height: 36px;
        line-height: 36px;
      }

      .close-btn mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }

      .form-section {
        padding: 12px;
        border-radius: 12px;
      }

      .section-header {
        gap: 12px;
      }

      .section-icon-wrapper {
        width: 32px;
        height: 32px;
      }

      .section-icon-wrapper mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }

      .section-title h3 {
        font-size: 14px;
      }
    }

    /* ========== ERROR STYLES ========== */
    ::ng-deep .mat-form-field.mat-form-field-invalid .mat-form-field-outline {
      color: #ef4444 !important;
    }

    ::ng-deep .mat-error {
      font-size: 11px;
      margin-top: 4px;
      color: #ef4444;
    }

    ::ng-deep .mat-form-field.mat-form-field-valid .mat-form-field-outline {
      color: #10b981 !important;
    }

    ::ng-deep .mat-form-field.mat-focused .mat-form-field-label {
      color: #667eea !important;
    }

    ::ng-deep .mat-form-field.mat-focused .mat-form-field-outline {
      color: #667eea !important;
    }

    mat-divider {
      margin: 0;
      opacity: 0.4;
    }
  `]
})
export class CourseSessionFormModalComponent implements OnInit, OnDestroy {
  sessionForm: FormGroup;
  isLoading = false;
  private destroy$ = new Subject<void>();

  courses: any[] = [];
  trainers: any[] = [];
  places: any[] = [];
  statusOptions = STATUS_OPTIONS;
  weekDays = WEEK_DAYS;

  courseOptions: SelectOption[] = [];
  placeOptions: SelectOption[] = [];

  constructor(
    private fb: FormBuilder,
    private sessionService: CourseSessionService,
    private courseService: CourseService,
    private employeeService: EmployeeService,
    private placeService: PlaceService,
    private notification: NotificationService,
    private dialogRef: MatDialogRef<CourseSessionFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mode: 'add' | 'edit', session?: any, courseId?: number, sessionId?: number }
  ) {
    this.sessionForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      courseId: [null, Validators.required],
      trainersId: [[], Validators.required],
      placeId: [null, Validators.required],
      sessionDays: [[], Validators.required],
      sessionDate: [null],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      status: ['SCHEDULED'],
      note: ['']
    }, {
      validators: [this.timeRangeValidator]
    });
  }

  ngOnInit(): void {
    this.loadLookupData();
    
    if (this.data.mode === 'edit' && this.data.session) {
      this.populateForm();
    } else if (this.data.mode === 'add' && this.data.courseId) {
      this.sessionForm.patchValue({
        courseId: this.data.courseId
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Custom validator to ensure end time is after start time
   */
  timeRangeValidator(group: AbstractControl): { [key: string]: any } | null {
    const startTime = group.get('startTime')?.value;
    const endTime = group.get('endTime')?.value;
    if (startTime && endTime && startTime >= endTime) {
      return { timeRange: true };
    }
    return null;
  }

  /**
   * Get selected trainers
   */
  get selectedTrainers(): any[] {
    const trainerIds = this.sessionForm.get('trainersId')?.value || [];
    return this.trainers.filter(t => trainerIds.includes(t.id));
  }

  /**
   * Get selected days
   */
  get selectedDays(): any[] {
    const dayValues = this.sessionForm.get('sessionDays')?.value || [];
    return this.weekDays.filter(d => dayValues.includes(d.value));
  }

  /**
   * Remove trainer from selection
   */
  removeTrainer(trainerId: number): void {
    const currentValue = this.sessionForm.get('trainersId')?.value || [];
    const newValue = currentValue.filter((id: number) => id !== trainerId);
    this.sessionForm.get('trainersId')?.setValue(newValue);
  }

  /**
   * Remove day from selection
   */
  removeDay(dayValue: string): void {
    const currentValue = this.sessionForm.get('sessionDays')?.value || [];
    const newValue = currentValue.filter((value: string) => value !== dayValue);
    this.sessionForm.get('sessionDays')?.setValue(newValue);
  }

  loadLookupData(): void {
    // Load courses
    this.courseService.getAllCourses().subscribe({
      next: (res: any) => {
        this.courses = res.items || [];
        this.courseOptions = this.courses.map(c => ({ value: c.id, label: c.title }));
      },
      error: () => this.notification.showError('حدث خطأ في تحميل الدورات')
    });

    // Load trainers
    this.employeeService.getAllTrainersLookup().subscribe({
      next: (res: any) => {
        this.trainers = res.list || [];
      },
      error: () => this.notification.showError('حدث خطأ في تحميل المدربين')
    });

    // Load places
    this.placeService.getAllPlacesLookup().subscribe({
      next: (res: any) => {
        this.places = res.list || [];
        this.placeOptions = this.places.map(p => ({ value: p.id, label: p.title }));
      },
      error: () => this.notification.showError('حدث خطأ في تحميل الأماكن')
    });
  }

  populateForm(): void {
    const session = this.data.session;
    
    // Map status
    let statusValue = 'SCHEDULED';
    if (session.status) {
      if (typeof session.status === 'object' && session.status.title) {
        const foundStatus = this.statusOptions.find(s => s.label === session.status.title);
        if (foundStatus) {
          statusValue = foundStatus.value;
        }
      } else if (typeof session.status === 'string') {
        const foundStatus = this.statusOptions.find(s => s.value === session.status);
        if (foundStatus) {
          statusValue = foundStatus.value;
        }
      }
    }
    
    this.sessionForm.patchValue({
      title: session.title,
      courseId: session.course?.id || session.courseId,
      trainersId: session.trainersId || [session.trainer?.id].filter(Boolean),
      placeId: session.place?.id || session.placeId,
      sessionDays: session.sessionDays || [session.sessionDay].filter(Boolean),
      sessionDate: session.sessionDate || null,
      startTime: session.startTime,
      endTime: session.endTime,
      status: statusValue,
      note: session.note
    });
  }

  onSubmit(): void {
    if (this.sessionForm.invalid) {
      this.notification.showWarning('يرجى تعبئة جميع الحقول المطلوبة بشكل صحيح');
      Object.keys(this.sessionForm.controls).forEach(key => {
        const control = this.sessionForm.get(key);
        control?.markAsTouched();
        control?.updateValueAndValidity();
      });
      return;
    }

    this.isLoading = true;
    const formData = this.sessionForm.value;
    
    // Prepare payload matching the backend DTO
    const payload: any = {
      title: formData.title,
      courseId: formData.courseId,
      trainersId: formData.trainersId, // Array of trainer IDs
      placeId: formData.placeId,
      sessionDays: formData.sessionDays, // Array of day strings
      startTime: formData.startTime,
      endTime: formData.endTime,
      note: formData.note || ''
    };
    
    // Add session date if provided (optional)
    if (formData.sessionDate) {
      payload.sessionDate = formData.sessionDate;
    }
    
    // Add status if provided
    if (formData.status) {
      payload.status = formData.status;
    }

    if (this.data.mode === 'edit' && this.data.sessionId) {
      this.sessionService.updateCourseSession(this.data.sessionId, payload).subscribe({
        next: () => {
          this.notification.showSuccess('تم تحديث الجلسة بنجاح');
          this.dialogRef.close('updated');
          this.isLoading = false;
        },
        error: (err) => {
          this.handleError(err);
          this.isLoading = false;
        }
      });
    } else {
      this.sessionService.createCourseSession(formData.courseId, payload).subscribe({
        next: (response) => {
          this.notification.showSuccess(`تم إضافة ${response.length} جلسة بنجاح`);
          this.dialogRef.close('saved');
          this.isLoading = false;
        },
        error: (err) => {
          this.handleError(err);
          this.isLoading = false;
        }
      });
    }
  }

  private handleError(err: any): void {
    let errorMessage = 'حدث خطأ في حفظ الجلسة';
    if (err.error?.messageEn) {
      errorMessage = err.error.messageEn;
    } else if (err.error?.message) {
      errorMessage = err.error.message;
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    // Handle specific error cases
    if (errorMessage.includes('DUPLICATE_TRAINER_DAY_COMBINATION')) {
      errorMessage = 'يوجد تكرار في مجموعة المدرب واليوم';
    } else if (errorMessage.includes('TRAINER_ALREADY_BOOKED')) {
      errorMessage = 'المدرب محجوز في نفس اليوم والوقت';
    } else if (errorMessage.includes('PLACE_ALREADY_BOOKED')) {
      errorMessage = 'المكان محجوز في نفس اليوم والوقت';
    } else if (errorMessage.includes('EMPLOYEE_NOT_FOUND')) {
      errorMessage = 'أحد المدربين غير موجود في النظام';
    }
    
    this.notification.showError(errorMessage);
  }

  onClose(): void {
    if (!this.isLoading) {
      this.dialogRef.close();
    }
  }
}