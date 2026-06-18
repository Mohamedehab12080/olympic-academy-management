// course-session-form-modal.component.ts

import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { animate, style, transition, trigger } from '@angular/animations';

import { CourseSessionService } from '../../../../core/services/course-session.service';
import { CourseService } from '../../../../core/services/course.service';
import { EmployeeService } from '../../../../core/services/employee.service';
import { PlaceService } from '../../../../core/services/place.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { SearchableSelectComponent, SelectOption } from '../../../../shared/components/searchable-select/searchable-select.component';

// Status mapping for display
interface StatusOption {
  id: number;
  value: string;  // Enum value for backend
  label: string;  // Display text in Arabic
}

const STATUS_OPTIONS: StatusOption[] = [
  { id: 1, value: 'SCHEDULED', label: 'مجدول' },
  { id: 2, value: 'IN_PROGRESS', label: 'في تقدم' },
  { id: 3, value: 'COMPLETED', label: 'مكتمل' },
  { id: 4, value: 'CANCELLED', label: 'ملغي' }
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
    SearchableSelectComponent
  ],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-out', style({ opacity: 0 }))
      ])
    ]),
    trigger('slideInRight', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('300ms ease-out', style({ transform: 'translateX(0)' }))
      ])
    ])
  ],
  template: `
    <div class="modal-container" [@fadeInOut]>
      <!-- Modal Header -->
      <div class="modal-header" [class.edit-mode]="data.mode === 'edit'">
        <div class="header-icon">
          <mat-icon>{{ data.mode === 'edit' ? 'edit' : 'add_circle' }}</mat-icon>
        </div>
        <div class="header-content">
          <h2>{{ data.mode === 'edit' ? 'تعديل الجلسة' : 'جلسة تدريبية جديدة' }}</h2>
          <p>{{ data.mode === 'edit' ? 'قم بتحديث بيانات الجلسة التدريبية' : 'أضف جلسة تدريبية جديدة إلى الدورة' }}</p>
        </div>
        <button mat-icon-button (click)="onClose()" class="close-button" matTooltip="إغلاق">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-divider></mat-divider>

      <!-- Modal Body -->
      <div class="modal-body">
        <form [formGroup]="sessionForm" (ngSubmit)="onSubmit()" class="session-form">
          <!-- Basic Information Section -->
          <div class="form-section">
            <div class="section-title">
              <mat-icon class="section-icon">info</mat-icon>
              <h3>المعلومات الأساسية</h3>
            </div>
            
            <div class="form-grid">
              <div class="form-field full-width">
                <mat-form-field appearance="outline" class="custom-form-field">
                  <mat-label>عنوان الجلسة</mat-label>
                  <input matInput formControlName="title" placeholder="مثال: مقدمة في البرمجة">
                  <mat-icon matPrefix>title</mat-icon>
                  <mat-error *ngIf="sessionForm.get('title')?.hasError('required')">
                    عنوان الجلسة مطلوب
                  </mat-error>
                </mat-form-field>
              </div>
            </div>
          </div>

          <mat-divider></mat-divider>

          <!-- Selection Information Section -->
          <div class="form-section">
            <div class="section-title">
              <mat-icon class="section-icon">assignment</mat-icon>
              <h3>البيانات الأساسية</h3>
            </div>

            <div class="form-grid">
              <!-- Course Selection -->
              <div class="form-field">
                <label class="field-label">
                  <mat-icon>school</mat-icon>
                  الدورة التدريبية
                  <span class="required-star">*</span>
                </label>
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
                  لا يمكن تغيير الدورة بعد إنشاء الجلسة
                </div>
              </div>

              <!-- Trainer Selection -->
              <div class="form-field">
                <label class="field-label">
                  <mat-icon>person</mat-icon>
                  المدرب
                  <span class="required-star">*</span>
                </label>
                <app-searchable-select
                  [ngModel]="sessionForm.get('trainerId')?.value"
                  (ngModelChange)="sessionForm.get('trainerId')?.setValue($event)"
                  placeholder="اختر المدرب"
                  [options]="trainerOptions"
                  [required]="true"
                  [ngModelOptions]="{standalone: true}">
                </app-searchable-select>
              </div>

              <!-- Place Selection -->
              <div class="form-field">
                <label class="field-label">
                  <mat-icon>location_on</mat-icon>
                  المكان
                  <span class="required-star">*</span>
                </label>
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

          <!-- Date & Time Section -->
          <div class="form-section">
            <div class="section-title">
              <mat-icon class="section-icon">schedule</mat-icon>
              <h3>التاريخ والوقت</h3>
            </div>

            <div class="form-grid">
              <!-- Session Date -->
              <div class="form-field">
                <mat-form-field appearance="outline" class="custom-form-field">
                  <mat-label>تاريخ الجلسة</mat-label>
                  <input matInput [matDatepicker]="datePicker" formControlName="sessionDate" placeholder="اختر التاريخ">
                  <mat-datepicker-toggle matSuffix [for]="datePicker"></mat-datepicker-toggle>
                  <mat-datepicker #datePicker></mat-datepicker>
                  <mat-icon matPrefix>event</mat-icon>
                  <mat-error *ngIf="sessionForm.get('sessionDate')?.hasError('required')">
                    تاريخ الجلسة مطلوب
                  </mat-error>
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
                </mat-form-field>
              </div>

              <!-- Session Status -->
              <div class="form-field">
                <label class="field-label">
                  <mat-icon>flag</mat-icon>
                  حالة الجلسة
                </label>
                <mat-form-field appearance="outline" class="custom-form-field">
                  <mat-label>اختر الحالة</mat-label>
                  <mat-select formControlName="status">
                    <mat-option *ngFor="let status of statusOptions" [value]="status.value">
                      <div class="status-option">
                        <span class="status-dot" [class]="getStatusClass(status.id)"></span>
                        {{ status.label }}
                      </div>
                    </mat-option>
                  </mat-select>
                </mat-form-field>
              </div>
            </div>
          </div>

          <mat-divider></mat-divider>

          <!-- Additional Information Section -->
          <div class="form-section">
            <div class="section-title">
              <mat-icon class="section-icon">notes</mat-icon>
              <h3>معلومات إضافية</h3>
            </div>

            <div class="form-grid">
              <div class="form-field full-width">
                <mat-form-field appearance="outline" class="custom-form-field">
                  <mat-label>ملاحظات إضافية</mat-label>
                  <textarea matInput formControlName="note" rows="4" 
                            placeholder="أضف أي ملاحظات أو تعليمات خاصة بالجلسة..."></textarea>
                  <mat-icon matPrefix>note_add</mat-icon>
                  <mat-hint>يمكنك إضافة تعليمات للمدرب أو المتدربين هنا</mat-hint>
                </mat-form-field>
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="form-actions">
            <button mat-raised-button color="primary" type="submit" 
                    [disabled]="sessionForm.invalid || isLoading" 
                    class="submit-btn">
              <mat-icon>{{ data.mode === 'edit' ? 'update' : 'save' }}</mat-icon>
              <span>{{ data.mode === 'edit' ? 'تحديث البيانات' : 'حفظ الجلسة' }}</span>
              <div class="btn-overlay" *ngIf="isLoading"></div>
            </button>
            <button mat-stroked-button type="button" (click)="onClose()" class="cancel-btn">
              <mat-icon>close</mat-icon>
              <span>إلغاء</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Loading Overlay -->
      <div class="loading-overlay" *ngIf="isLoading" [@fadeInOut]>
        <div class="loading-content">
          <mat-spinner diameter="60" color="accent"></mat-spinner>
          <div class="loading-text">
            <p>{{ data.mode === 'edit' ? 'جاري تحديث البيانات...' : 'جاري حفظ البيانات...' }}</p>
            <span class="loading-subtitle">يرجى الانتظار</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-container {
      position: relative;
      background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
      border-radius: 32px;
      overflow: hidden;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }

    .modal-header {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 28px 32px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      position: relative;
      overflow: hidden;
    }

    .modal-header::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -10%;
      width: 200px;
      height: 200px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      pointer-events: none;
    }

    .modal-header::after {
      content: '';
      position: absolute;
      bottom: -30%;
      left: -5%;
      width: 150px;
      height: 150px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 50%;
      pointer-events: none;
    }

    .modal-header.edit-mode {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }

    .header-icon {
      width: 56px;
      height: 56px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(10px);
      z-index: 1;
    }

    .header-icon mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
    }

    .header-content {
      flex: 1;
      z-index: 1;
    }

    .header-content h2 {
      margin: 0 0 4px 0;
      font-size: 24px;
      font-weight: 700;
    }

    .header-content p {
      margin: 0;
      font-size: 13px;
      opacity: 0.9;
    }

    .close-button {
      color: white !important;
      background: rgba(255, 255, 255, 0.2) !important;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 1;
    }

    .close-button:hover {
      background: rgba(255, 255, 255, 0.3) !important;
      transform: rotate(90deg) scale(1.1);
    }

    .modal-body {
      flex: 1;
      overflow-y: auto;
      padding: 32px;
    }

    .modal-body::-webkit-scrollbar {
      width: 8px;
    }

    .modal-body::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 10px;
    }

    .modal-body::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 10px;
    }

    .modal-body::-webkit-scrollbar-thumb:hover {
      background: #667eea;
    }

    .form-section {
      margin-bottom: 32px;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 24px;
    }

    .section-icon {
      color: #667eea;
      font-size: 24px;
    }

    .section-title h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #1f2937;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-field.full-width {
      grid-column: span 2;
    }

    .field-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 600;
      color: #374151;
      margin-bottom: 4px;
    }

    .field-label mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #667eea;
    }

    .required-star {
      color: #ef4444;
      margin-right: 4px;
    }

    .field-hint {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: #f59e0b;
      margin-top: 4px;
    }

    .field-hint mat-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
    }

    .status-option {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .status-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      display: inline-block;
    }

    .status-dot.scheduled {
      background-color: #3b82f6;
    }

    .status-dot.in-progress {
      background-color: #f59e0b;
    }

    .status-dot.completed {
      background-color: #10b981;
    }

    .status-dot.cancelled {
      background-color: #ef4444;
    }

    ::ng-deep .custom-form-field .mat-form-field-outline {
      background: white;
      border-radius: 12px;
      transition: all 0.3s;
    }

    ::ng-deep .custom-form-field .mat-form-field-flex {
      padding: 0 16px;
    }

    ::ng-deep .custom-form-field .mat-form-field-prefix {
      margin-right: 12px;
      color: #94a3b8;
    }

    ::ng-deep .custom-form-field:hover .mat-form-field-outline {
      background: #f9fafb;
    }

    ::ng-deep .custom-form-field.mat-focused .mat-form-field-outline {
      background: #f3f4f6;
    }

    .form-actions {
      display: flex;
      gap: 16px;
      margin-top: 32px;
      padding-top: 24px;
      border-top: 2px solid #e5e7eb;
      justify-content: flex-end;
    }

    .submit-btn,
    .cancel-btn {
      padding: 0 32px;
      height: 48px;
      font-weight: 600;
      font-size: 14px;
      position: relative;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .submit-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
      color: white !important;
    }

    .submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
    }

    .submit-btn:active:not(:disabled) {
      transform: translateY(0);
    }

    .submit-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-overlay {
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
      border: 2px solid #e5e7eb !important;
      background: white !important;
      transition: all 0.3s;
    }

    .cancel-btn:hover {
      background: #f9fafb !important;
      border-color: #d1d5db !important;
      transform: translateY(-1px);
    }

    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.98);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      backdrop-filter: blur(8px);
    }

    .loading-content {
      text-align: center;
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

    @media (max-width: 768px) {
      .modal-header {
        padding: 20px;
      }

      .header-icon {
        width: 44px;
        height: 44px;
      }

      .header-icon mat-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
      }

      .header-content h2 {
        font-size: 20px;
      }

      .modal-body {
        padding: 20px;
      }

      .form-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .form-field.full-width {
        grid-column: span 1;
      }

      .section-title h3 {
        font-size: 16px;
      }

      .form-actions {
        flex-direction: column-reverse;
      }

      .submit-btn,
      .cancel-btn {
        width: 100%;
      }
    }

    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .form-section {
      animation: slideInUp 0.4s ease-out forwards;
    }

    .form-section:nth-child(1) { animation-delay: 0s; }
    .form-section:nth-child(2) { animation-delay: 0.1s; }
    .form-section:nth-child(3) { animation-delay: 0.2s; }
    .form-section:nth-child(4) { animation-delay: 0.3s; }

    ::ng-deep .mat-form-field.mat-form-field-invalid .mat-form-field-outline {
      color: #ef4444;
    }

    ::ng-deep .mat-error {
      font-size: 11px;
      margin-top: 4px;
      color: #ef4444;
    }

    ::ng-deep .mat-form-field.mat-form-field-valid .mat-form-field-outline {
      color: #10b981;
    }

    ::ng-deep .mat-form-field.mat-focused .mat-form-field-label {
      color: #667eea !important;
    }

    ::ng-deep .mat-form-field.mat-focused .mat-form-field-outline {
      color: #667eea !important;
    }

    mat-divider {
      margin: 0;
      opacity: 0.5;
    }
  `]
})
export class CourseSessionFormModalComponent implements OnInit {
  sessionForm: FormGroup;
  isLoading = false;

  courses: any[] = [];
  trainers: any[] = [];
  places: any[] = [];
  statusOptions = STATUS_OPTIONS;

  courseOptions: SelectOption[] = [];
  trainerOptions: SelectOption[] = [];
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
      title: ['', Validators.required],
      courseId: [null, Validators.required],
      trainerId: [null, Validators.required],
      placeId: [null, Validators.required],
      sessionDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      status: [null],
      note: ['']
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
        this.trainerOptions = this.trainers.map(t => ({ value: t.id, label: t.title }));
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
  
  // Map status from backend enum to display value
  let statusValue = null;
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
    courseId: session.course?.id,  // This will be disabled but still has value
    trainerId: session.trainer?.id,
    placeId: session.place?.id,
    sessionDate: session.sessionDate,
    startTime: session.startTime,
    endTime: session.endTime,
    status: statusValue,
    note: session.note
  });
}

  getStatusClass(statusId: number): string {
    switch(statusId) {
      case 1: return 'scheduled';
      case 2: return 'in-progress';
      case 3: return 'completed';
      case 4: return 'cancelled';
      default: return '';
    }
  }

onSubmit(): void {
  if (this.sessionForm.invalid) {
    this.notification.showWarning('يرجى تعبئة جميع الحقول المطلوبة');
    Object.keys(this.sessionForm.controls).forEach(key => {
      this.sessionForm.get(key)?.markAsTouched();
    });
    return;
  }

  this.isLoading = true;
  const formData = this.sessionForm.value;
  
  // IMPORTANT: Get courseId from form data or from the data object
  const courseId = this.data.mode === 'edit' ? this.data.courseId : formData.courseId;
  
  // Prepare payload - include courseId for both create and update
  const payload: any = {
    courseId: courseId,  // ← This is required by backend
    title: formData.title,
    trainerId: formData.trainerId,
    placeId: formData.placeId,
    sessionDate: formData.sessionDate,
    startTime: formData.startTime,
    endTime: formData.endTime,
    note: formData.note
  };
  
  // Add status as enum string if selected
  if (formData.status) {
    payload.status = formData.status;
  }
  
  console.log('Submitting payload:', payload);

  if (this.data.mode === 'edit' && this.data.courseId && this.data.sessionId) {
    // For update, you might not need to send courseId in body if it's in URL
    // But to be safe, we send it
    this.sessionService.updateCourseSession(this.data.courseId, this.data.sessionId, payload).subscribe({
      next: () => {
        this.notification.showSuccess('تم تحديث الجلسة بنجاح');
        this.dialogRef.close('updated');
        this.isLoading = false;
      },
      error: (err) => {
        this.notification.showError(err.error?.messageEn || 'حدث خطأ في تحديث الجلسة');
        this.isLoading = false;
      }
    });
  } else {
    this.sessionService.createCourseSession(courseId, payload).subscribe({
      next: () => {
        this.notification.showSuccess('تم إضافة الجلسة بنجاح');
        this.dialogRef.close('saved');
        this.isLoading = false;
      },
      error: (err) => {
        this.notification.showError(err.error?.messageEn || 'حدث خطأ في إضافة الجلسة');
        this.isLoading = false;
      }
    });
  }
}
  onClose(): void {
    if (!this.isLoading) {
      this.dialogRef.close();
    }
  }
}