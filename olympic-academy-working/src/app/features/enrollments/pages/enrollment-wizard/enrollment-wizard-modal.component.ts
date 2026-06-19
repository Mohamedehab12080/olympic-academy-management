// enrollment-wizard-modal.component.ts

import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule, MatStepper } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';

import { EnrollmentService } from '../../../../core/services/enrollment.service';
import { TraineeService } from '../../../../core/services/trainee.service';
import { CourseService } from '../../../../core/services/course.service';
import { EmployeeService } from '../../../../core/services/employee.service';
import { FinancialService } from '../../../../core/services/financial.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { FileService } from '../../../../core/services/file.service';
import { PAYMENT_STATUSES } from '../../../../core/models/common.model';
import { ENROLLMENT_STATUSES } from '../../../../core/models/enrollment.model';
import { SearchableSelectComponent, SelectOption } from '../../../../shared/components/searchable-select/searchable-select.component';

interface TraineeLookup {
  id: number;
  title: string;
  nationalId: string;
  imageUrl: string;
  imagePreviewUrl?: string;
  academicYear?: string;
}

@Component({
  selector: 'app-enrollment-wizard-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatStepperModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatCardModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatChipsModule,
    SearchableSelectComponent
  ],
  template: `
    <div class="wizard-container" dir="rtl">
      <!-- Header -->
      <div class="wizard-header">
        <div class="header-title">
          <mat-icon>{{ isEditMode ? 'edit' : 'person_add' }}</mat-icon>
          <div>
            <h2>{{ isEditMode ? 'تعديل التسجيل' : 'تسجيل جديد' }}</h2>
            <p>{{ isEditMode ? 'قم بتحديث بيانات التسجيل' : 'أضف تسجيل جديد لمتدرب' }}</p>
          </div>
        </div>
        <div class="header-actions">
          <button mat-icon-button (click)="printPreview()" matTooltip="معاينة الطباعة">
            <mat-icon>print</mat-icon>
          </button>
          <button mat-icon-button mat-dialog-close class="close-btn">
            <mat-icon>close</mat-icon>
          </button>
        </div>
      </div>
      
      <mat-divider></mat-divider>
      
      <!-- Scrollable Stepper Container -->
      <div class="stepper-container">
        <mat-stepper [linear]="true" #stepper class="custom-stepper">
          
          <!-- Step 1: Select Trainee -->
          <mat-step [stepControl]="step1Form">
            <ng-template matStepLabel>
              <div class="step-label">
                <mat-icon>person</mat-icon>
                <span>المتدرب</span>
              </div>
            </ng-template>
            <div class="step-content">
              <div class="step-header">
                <div class="step-header-icon">👤</div>
                <div class="step-header-text">
                  <h3>اختر المتدرب</h3>
                  <p>يمكنك البحث عن المتدرب باستخدام الاسم أو رقم الهوية</p>
                </div>
              </div>

              <div class="trainee-search-section">
                <!-- Barcode Scanner Input -->
                <div class="barcode-section">
                  <div class="barcode-icon-wrapper">
                    <mat-icon class="barcode-icon">qr_code_scanner</mat-icon>
                  </div>
                  <div class="barcode-input-wrapper">
                    <mat-form-field appearance="outline" class="barcode-input">
                      <mat-label>مسح الباركود (رقم الهوية)</mat-label>
                      <input matInput 
                             #barcodeInput
                             (keyup.enter)="searchByNationalId(barcodeInput.value)"
                             placeholder="أدخل رقم الهوية أو امسح الباركود...">
                      <button mat-icon-button matSuffix (click)="searchByNationalId(barcodeInput.value)" matTooltip="بحث">
                        <mat-icon>search</mat-icon>
                      </button>
                    </mat-form-field>
                    <div class="barcode-hint">
                      <mat-icon>info</mat-icon>
                      <span>يمكنك مسح الباركود من بطاقة المتدرب أو إدخال رقم الهوية يدوياً</span>
                    </div>
                  </div>
                </div>

                <div class="divider-text">أو اختر من القائمة</div>

                <div class="form-field full-width">
                  <app-searchable-select
                    [ngModel]="step1Form.get('traineeId')?.value"
                    (ngModelChange)="step1Form.get('traineeId')?.setValue($event); onTraineeSelect()"
                    label="المتدرب *"
                    [options]="traineeOptions"
                    [required]="true"
                    [ngModelOptions]="{standalone: true}">
                  </app-searchable-select>
                </div>

                <!-- Selected Trainee Info Card -->
                <div class="trainee-preview-card" *ngIf="selectedTrainee">
                  <div class="trainee-preview-header">
                    <div class="trainee-preview-avatar">
                      <img *ngIf="selectedTrainee.imagePreviewUrl" [src]="selectedTrainee.imagePreviewUrl" [alt]="selectedTrainee.title">
                      <mat-icon *ngIf="!selectedTrainee.imagePreviewUrl">person</mat-icon>
                    </div>
                    <div class="trainee-preview-info">
                      <h4>{{ selectedTrainee.title }}</h4>
                      <div class="trainee-preview-meta">
                        <mat-chip size="small">
                          <mat-icon>badge</mat-icon>
                          {{ selectedTrainee.nationalId || 'رقم الهوية غير متوفر' }}
                        </mat-chip>
                        <mat-chip size="small" *ngIf="selectedTrainee.academicYear">
                          <mat-icon>school</mat-icon>
                          السنة {{ selectedTrainee.academicYear }}
                        </mat-chip>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="step-actions">
              <button mat-raised-button color="primary" matStepperNext [disabled]="step1Form.invalid">
                التالي <mat-icon>arrow_back</mat-icon>
              </button>
            </div>
          </mat-step>

          <!-- Step 2: Select Course -->
          <mat-step [stepControl]="step2Form">
            <ng-template matStepLabel>
              <div class="step-label">
                <mat-icon>school</mat-icon>
                <span>الدورة</span>
              </div>
            </ng-template>
            <div class="step-content">
              <div class="step-header">
                <div class="step-header-icon">📚</div>
                <div class="step-header-text">
                  <h3>اختر الدورة</h3>
                  <p>اختر الدورة التي سيسجل فيها المتدرب</p>
                </div>
              </div>

              <form [formGroup]="step2Form">
                <div class="form-field full-width">
                  <app-searchable-select
                    [ngModel]="step2Form.get('courseId')?.value"
                    (ngModelChange)="step2Form.get('courseId')?.setValue($event); onCourseSelect()"
                    label="الدورة *"
                    [options]="courseOptions"
                    [required]="true"
                    [ngModelOptions]="{standalone: true}">
                  </app-searchable-select>
                </div>
                
                <!-- Course Information Card -->
                <mat-card class="course-info-card" *ngIf="selectedCourse">
                  <mat-card-header>
                    <mat-icon mat-card-avatar>info</mat-icon>
                    <mat-card-title>معلومات الدورة</mat-card-title>
                  </mat-card-header>
                  <mat-card-content>
                    <div class="info-grid">
                      <div class="info-item">
                        <span class="info-label">المدة:</span>
                        <span class="info-value">{{ selectedCourse.duration }} ساعة</span>
                      </div>
                      <div class="info-item">
                        <span class="info-label">السعر:</span>
                        <span class="info-value price">{{ selectedCourse.price | currency:'EGP' }}</span>
                      </div>
                      <div class="info-item">
                        <span class="info-label">تاريخ البدء:</span>
                        <span class="info-value">{{ selectedCourse.startDate | date:'dd/MM/yyyy' }}</span>
                      </div>
                      <div class="info-item">
                        <span class="info-label">تاريخ الانتهاء:</span>
                        <span class="info-value">{{ selectedCourse.endDate | date:'dd/MM/yyyy' }}</span>
                      </div>
                      <div class="info-item full-width" *ngIf="selectedCourse.description">
                        <span class="info-label">الوصف:</span>
                        <span class="info-value">{{ selectedCourse.description }}</span>
                      </div>
                    </div>
                  </mat-card-content>
                </mat-card>
              </form>
            </div>
            <div class="step-actions">
              <button mat-stroked-button matStepperPrevious>
                <mat-icon>arrow_forward</mat-icon> السابق
              </button>
              <button mat-raised-button color="primary" matStepperNext [disabled]="step2Form.invalid">
                التالي <mat-icon>arrow_back</mat-icon>
              </button>
            </div>
          </mat-step>

          <!-- Step 3: Select Trainer -->
          <mat-step [stepControl]="step3Form">
            <ng-template matStepLabel>
              <div class="step-label">
                <mat-icon>badge</mat-icon>
                <span>المدرب</span>
              </div>
            </ng-template>
            <div class="step-content">
              <div class="step-header">
                <div class="step-header-icon">👨‍🏫</div>
                <div class="step-header-text">
                  <h3>اختر المدرب</h3>
                  <p>اختر المدرب المسؤول عن هذه الدورة</p>
                </div>
              </div>

              <form [formGroup]="step3Form">
                <div class="form-field full-width">
                  <app-searchable-select
                    [ngModel]="step3Form.get('trainerId')?.value"
                    (ngModelChange)="step3Form.get('trainerId')?.setValue($event)"
                    label="المدرب *"
                    [options]="trainerOptions"
                    [required]="true"
                    [ngModelOptions]="{standalone: true}">
                  </app-searchable-select>
                </div>
              </form>
            </div>
            <div class="step-actions">
              <button mat-stroked-button matStepperPrevious>
                <mat-icon>arrow_forward</mat-icon> السابق
              </button>
              <button mat-raised-button color="primary" matStepperNext [disabled]="step3Form.invalid">
                التالي <mat-icon>arrow_back</mat-icon>
              </button>
            </div>
          </mat-step>

          <!-- Step 4: Enrollment Details -->
          <mat-step [stepControl]="enrollmentForm">
            <ng-template matStepLabel>
              <div class="step-label">
                <mat-icon>receipt</mat-icon>
                <span>تفاصيل التسجيل</span>
              </div>
            </ng-template>
            <div class="step-content">
              <div class="step-header">
                <div class="step-header-icon">📝</div>
                <div class="step-header-text">
                  <h3>تفاصيل التسجيل</h3>
                  <p>أدخل تفاصيل التسجيل والتكاليف</p>
                </div>
              </div>

              <!-- Course Date Range Info -->
              <div class="course-date-info" *ngIf="selectedCourse">
                <mat-icon>event_range</mat-icon>
                <div class="date-range">
                  <span class="range-label">فترة الدورة:</span>
                  <span class="range-value">{{ selectedCourse.startDate | date:'dd/MM/yyyy' }} - {{ selectedCourse.endDate | date:'dd/MM/yyyy' }}</span>
                </div>
              </div>

              <form [formGroup]="enrollmentForm">
                <!-- First Row -->
                <div class="form-row">
                  <div class="form-field">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>نوع التسجيل</mat-label>
                      <mat-select formControlName="enrollmentTypeId">
                        <mat-option [value]="null">-- اختر --</mat-option>
                        <mat-option *ngFor="let type of enrollmentTypes" [value]="type.id">{{ type.title }}</mat-option>
                        <mat-option [value]="'new'">
                          <div style="display: flex; align-items: center; gap: 8px; color: #2563eb;">
                            <mat-icon>add_circle</mat-icon>
                            <span>إضافة نوع تسجيل جديد</span>
                          </div>
                        </mat-option>
                      </mat-select>
                    </mat-form-field>
                  </div>
                  <div class="form-field">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>تاريخ البدء *</mat-label>
                      <input matInput [matDatepicker]="startPicker" formControlName="startDate" (dateChange)="validateDates()">
                      <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
                      <mat-datepicker #startPicker></mat-datepicker>
                      <mat-error *ngIf="enrollmentForm.get('startDate')?.hasError('required')">تاريخ البدء مطلوب</mat-error>
                      <mat-error *ngIf="enrollmentForm.get('startDate')?.hasError('beforeCourseStart')">تاريخ البدء يجب أن يكون بعد تاريخ بدء الدورة ({{ selectedCourse?.startDate | date:'dd/MM/yyyy' }})</mat-error>
                      <mat-error *ngIf="enrollmentForm.get('startDate')?.hasError('afterCourseEnd')">تاريخ البدء يجب أن يكون قبل تاريخ انتهاء الدورة ({{ selectedCourse?.endDate | date:'dd/MM/yyyy' }})</mat-error>
                    </mat-form-field>
                  </div>
                </div>

                <!-- Second Row -->
                <div class="form-row">
                  <div class="form-field">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>تاريخ الانتهاء</mat-label>
                      <input matInput [matDatepicker]="endPicker" formControlName="endDate" (dateChange)="validateDates()">
                      <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
                      <mat-datepicker #endPicker></mat-datepicker>
                      <mat-error *ngIf="enrollmentForm.get('endDate')?.hasError('afterCourseEnd')">تاريخ الانتهاء يجب أن يكون قبل تاريخ انتهاء الدورة ({{ selectedCourse?.endDate | date:'dd/MM/yyyy' }})</mat-error>
                      <mat-error *ngIf="enrollmentForm.get('endDate')?.hasError('beforeStartDate')">تاريخ الانتهاء يجب أن يكون بعد تاريخ البدء</mat-error>
                    </mat-form-field>
                  </div>
                  <div class="form-field">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>حالة التسجيل</mat-label>
                      <mat-select formControlName="enrollmentStatus">
                        <mat-option *ngFor="let status of enrollmentStatuses" [value]="status">{{ status.title }}</mat-option>
                      </mat-select>
                    </mat-form-field>
                  </div>
                </div>

                <!-- Third Row -->
                <div class="form-row">
                  <div class="form-field">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>قيمة الاشتراك</mat-label>
                      <input matInput type="number" formControlName="subscriptionValue" (input)="calculateFinalValue()">
                      <span matSuffix>جم</span>
                    </mat-form-field>
                  </div>
                  <div class="form-field"></div>
                </div>

                <!-- Fourth Row - Discount with Auto Calculation -->
                <div class="form-row discount-row">
                  <div class="form-field">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>قيمة الخصم</mat-label>
                      <input matInput type="number" formControlName="discountAmount" (input)="onDiscountAmountChange()">
                      <span matSuffix>جم</span>
                    </mat-form-field>
                  </div>
                  <div class="form-field">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>نسبة الخصم</mat-label>
                      <input matInput type="number" formControlName="discountPercentage" (input)="onDiscountPercentageChange()">
                      <span matSuffix>%</span>
                    </mat-form-field>
                  </div>
                </div>

                <!-- Fifth Row - Final Amount -->
                <div class="form-row highlight">
                  <div class="form-field">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>المبلغ النهائي</mat-label>
                      <input matInput type="number" formControlName="finalSubscriptionValue" readonly>
                      <span matSuffix>جم</span>
                    </mat-form-field>
                  </div>
                  <div class="form-field"></div>
                </div>

                <!-- Payment Option -->
                <div class="payment-option">
                  <mat-checkbox color="primary" (change)="onPaymentOptionChange($event)">
                    <span class="payment-checkbox-label">إجراء دفعة مباشرة</span>
                  </mat-checkbox>
                  <div class="payment-info-hint" *ngIf="showPaymentSection">
                    <mat-icon>info</mat-icon>
                    <span>سيتم نقلك إلى صفحة الدفع بعد حفظ التسجيل</span>
                  </div>
                </div>

                <!-- Notes -->
                <div class="form-field full-width">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>ملاحظات</mat-label>
                    <textarea matInput formControlName="note" rows="3" placeholder="أي ملاحظات إضافية..."></textarea>
                  </mat-form-field>
                </div>
              </form>
            </div>
            <div class="step-actions">
              <button mat-stroked-button matStepperPrevious>
                <mat-icon>arrow_forward</mat-icon> السابق
              </button>
              <button mat-raised-button color="primary" (click)="submitEnrollment()" [disabled]="isSubmitting || enrollmentForm.invalid">
                <mat-spinner diameter="20" *ngIf="isSubmitting"></mat-spinner>
                <span *ngIf="!isSubmitting">{{ isEditMode ? 'تحديث' : 'تأكيد التسجيل' }}</span>
              </button>
              <button mat-stroked-button color="accent" (click)="printPreview()" [disabled]="isSubmitting">
                <mat-icon>print</mat-icon>
                معاينة الطباعة
              </button>
            </div>
          </mat-step>
        </mat-stepper>
      </div>
      
      <!-- Loading Overlay -->
      <div class="loading-overlay" *ngIf="isLoading">
        <mat-spinner diameter="50"></mat-spinner>
        <p>جاري التحميل...</p>
      </div>
    </div>
  `,
  styles: [`
    .wizard-container {
      min-width: 700px;
      max-width: 900px;
      max-height: 90vh;
      direction: rtl;
      background: #f0f4f8;
      border-radius: 24px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      border: 1px solid rgba(226, 232, 240, 0.4);
    }

    /* Header */
    .wizard-header {
      flex-shrink: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
      color: white;
    }
    .header-title {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .header-title mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }
    .header-title h2 {
      margin: 0;
      font-size: 22px;
      font-weight: 600;
    }
    .header-title p {
      margin: 4px 0 0;
      font-size: 12px;
      opacity: 0.8;
    }
    .header-actions {
      display: flex;
      gap: 8px;
    }
    .close-btn {
      color: white;
      transition: transform 0.2s;
    }
    .close-btn:hover {
      transform: scale(1.1);
      background: rgba(255, 255, 255, 0.12);
    }

    .stepper-container {
      flex: 1;
      overflow-y: auto;
      max-height: calc(90vh - 80px);
      padding: 0 24px;
    }

    .custom-stepper {
      background: transparent;
      padding: 24px 0;
    }
    .step-label {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .step-label mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .step-content {
      padding: 24px 0;
      min-height: 320px;
    }

    /* Step Header */
    .step-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
      padding: 16px 20px;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-radius: 16px;
      border: 1px solid #e2e8f0;
    }
    .step-header-icon {
      font-size: 36px;
      line-height: 1;
    }
    .step-header-text h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #0f172a;
    }
    .step-header-text p {
      margin: 4px 0 0;
      font-size: 13px;
      color: #64748b;
    }

    .step-actions {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
      padding: 16px 0;
      border-top: 1px solid #e2e8f0;
      margin-top: 16px;
      background: #f8fafc;
      position: sticky;
      bottom: 0;
      z-index: 10;
      border-radius: 0 0 16px 16px;
    }
    .step-actions button {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 24px;
    }

    /* Trainee Search Section */
    .trainee-search-section {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .barcode-section {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      border-radius: 16px;
      border: 2px dashed #bae6fd;
    }
    .barcode-icon-wrapper {
      width: 56px;
      height: 56px;
      min-width: 56px;
      background: linear-gradient(135deg, #0f3460 0%, #1a1a2e 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .barcode-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: white;
    }
    .barcode-input-wrapper {
      flex: 1;
    }
    .barcode-input {
      width: 100%;
    }
    .barcode-input ::ng-deep .mat-form-field-outline {
      background: white !important;
    }
    .barcode-hint {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: #0284c7;
      margin-top: 4px;
    }
    .barcode-hint mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .divider-text {
      text-align: center;
      color: #94a3b8;
      font-size: 13px;
      position: relative;
      padding: 0 20px;
    }
    .divider-text::before,
    .divider-text::after {
      content: '';
      position: absolute;
      top: 50%;
      width: 30%;
      height: 1px;
      background: #e2e8f0;
    }
    .divider-text::before {
      right: 0;
    }
    .divider-text::after {
      left: 0;
    }

    .form-field {
      flex: 1;
    }
    .full-width {
      width: 100%;
    }

    /* Trainee Preview Card */
    .trainee-preview-card {
      margin-top: 16px;
      padding: 16px;
      background: white;
      border-radius: 16px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    }
    .trainee-preview-header {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .trainee-preview-avatar {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .trainee-preview-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .trainee-preview-avatar mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: white;
    }
    .trainee-preview-info {
      flex: 1;
    }
    .trainee-preview-info h4 {
      margin: 0 0 6px;
      font-size: 16px;
      font-weight: 600;
      color: #0f172a;
    }
    .trainee-preview-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    /* Course Info Card */
    .course-date-info {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
      border-radius: 12px;
      margin-bottom: 20px;
      border: 1px solid rgba(37, 99, 235, 0.1);
    }
    .course-date-info mat-icon {
      color: #2563eb;
    }
    .date-range {
      flex: 1;
    }
    .range-label {
      font-weight: 600;
      color: #1e40af;
      margin-left: 8px;
    }
    .range-value {
      color: #1e293b;
      font-weight: 500;
    }

    .course-info-card {
      margin-top: 24px;
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
      border-radius: 16px;
      border: 1px solid rgba(37, 99, 235, 0.1);
    }
    .course-info-card mat-card-header {
      padding: 16px 16px 0 16px;
    }
    .course-info-card mat-card-title {
      font-size: 16px;
      font-weight: 600;
      color: #1e40af;
    }
    .course-info-card mat-card-content {
      padding: 16px;
    }
    .info-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
    }
    .info-item {
      flex: 1;
      min-width: 150px;
      display: flex;
      align-items: baseline;
      gap: 8px;
    }
    .info-item.full-width {
      flex: 100%;
    }
    .info-label {
      font-weight: 600;
      color: #475569;
      font-size: 13px;
    }
    .info-value {
      color: #1e293b;
      font-size: 13px;
    }
    .info-value.price {
      font-weight: 700;
      color: #0f3460;
      font-size: 16px;
    }

    .form-row {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
    }

    .discount-row {
      background: #fffbeb;
      padding: 16px;
      border-radius: 12px;
      margin: 16px 0;
      border: 1px solid rgba(217, 119, 6, 0.15);
    }

    .highlight {
      background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
      padding: 20px;
      border-radius: 16px;
      margin: 20px 0;
      border: 1px solid rgba(79, 70, 229, 0.15);
    }
    .highlight .mat-form-field {
      background: white;
      border-radius: 8px;
    }

    .payment-option {
      background: #f8fafc;
      padding: 16px 20px;
      border-radius: 12px;
      margin: 20px 0;
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
      border: 1px solid #e2e8f0;
    }
    .payment-checkbox-label {
      font-weight: 500;
      color: #0f172a;
    }
    .payment-info-hint {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: #2563eb;
    }
    .payment-info-hint mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.95);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      border-radius: 24px;
      z-index: 1000;
    }
    .loading-overlay p {
      color: #0f3460;
      font-weight: 500;
    }

    /* Input Field Enhancements */
    ::ng-deep .mat-form-field-outline {
      background: white !important;
      border-radius: 10px !important;
    }
    ::ng-deep .mat-form-field.mat-focused .mat-form-field-outline {
      color: #0f3460 !important;
    }
    ::ng-deep .mat-form-field.mat-focused .mat-form-field-label {
      color: #0f3460 !important;
    }
    ::ng-deep .mat-form-field-appearance-outline .mat-form-field-outline-thick {
      color: #0f3460 !important;
    }

    ::ng-deep .mat-step-header .mat-step-icon-selected {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%) !important;
    }
    ::ng-deep .mat-step-header .mat-step-icon-state-done {
      background: #0f3460 !important;
    }

    @media (max-width: 768px) {
      .wizard-container {
        min-width: 90vw;
        max-width: 90vw;
        max-height: 95vh;
      }
      .stepper-container {
        max-height: calc(95vh - 80px);
      }
      .form-row {
        flex-direction: column;
        gap: 12px;
      }
      .step-actions {
        flex-direction: column;
      }
      .step-actions button {
        width: 100%;
        justify-content: center;
      }
      .info-grid {
        flex-direction: column;
        gap: 8px;
      }
      .info-item {
        flex-direction: column;
        gap: 4px;
      }
      .course-date-info {
        flex-direction: column;
        text-align: center;
      }
      .payment-option {
        flex-direction: column;
        align-items: flex-start;
      }
      .barcode-section {
        flex-direction: column;
        text-align: center;
      }
      .barcode-input-wrapper {
        width: 100%;
      }
      .trainee-preview-header {
        flex-direction: column;
        text-align: center;
      }
      .trainee-preview-meta {
        justify-content: center;
      }
      .step-header {
        flex-direction: column;
        text-align: center;
      }
    }
  `]
})
export class EnrollmentWizardModalComponent implements OnInit {
  @ViewChild('stepper') stepper!: MatStepper;
  @ViewChild('barcodeInput') barcodeInput!: ElementRef<HTMLInputElement>;
  
  step1Form: FormGroup;
  step2Form: FormGroup;
  step3Form: FormGroup;
  enrollmentForm: FormGroup;
  
  trainees: TraineeLookup[] = [];
  courses: any[] = [];
  trainers: any[] = [];
  enrollmentTypes: any[] = [];
  paymentStatuses = PAYMENT_STATUSES;
  enrollmentStatuses = ENROLLMENT_STATUSES;
  paymentMethods: any[] = [];
  
  traineeOptions: SelectOption[] = [];
  courseOptions: SelectOption[] = [];
  trainerOptions: SelectOption[] = [];
  paymentMethodOptions: SelectOption[] = [];
  
  selectedCourse: any = null;
  selectedTrainee: TraineeLookup | null = null;
  isLoading = false;
  isSubmitting = false;
  isEditMode = false;
  enrollmentId: number | null = null;
  showPaymentSection: boolean = false;
  makePaymentDirectly: boolean = false;

  constructor(
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<EnrollmentWizardModalComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { enrollmentId?: number },
    private fb: FormBuilder,
    private enrollmentService: EnrollmentService,
    private traineeService: TraineeService,
    private courseService: CourseService,
    private employeeService: EmployeeService,
    private financialService: FinancialService,
    private notification: NotificationService,
    private fileService: FileService
  ) {
    this.isEditMode = !!data?.enrollmentId;
    this.enrollmentId = data?.enrollmentId || null;
    
    this.step1Form = this.fb.group({ traineeId: [null, Validators.required] });
    this.step2Form = this.fb.group({ courseId: [null, Validators.required] });
    this.step3Form = this.fb.group({ trainerId: [null, Validators.required] });
    this.enrollmentForm = this.fb.group({
      enrollmentTypeId: [null],
      startDate: [null, [Validators.required]],
      endDate: [null],
      enrollmentStatus: [null],
      subscriptionValue: [null],
      discountAmount: [null],
      discountPercentage: [null],
      finalSubscriptionValue: [{ value: null, disabled: true }],
      note: ['']
    });
  }

  ngOnInit(): void {
    this.loadLookupData();
    this.loadPaymentMethods();
    
    this.enrollmentForm.get('enrollmentTypeId')?.valueChanges.subscribe(value => {
      if (value === 'new') {
        this.openAddEnrollmentTypeDialog();
      }
    });
    
    if (this.isEditMode && this.enrollmentId) {
      this.loadEnrollmentData();
    }
  }

  loadLookupData(): void {
    this.isLoading = true;
    
    // Load trainees with proper typing
    this.traineeService.getAllTraineesLookup().subscribe({
      next: (res: any) => {
        this.trainees = res.list || [];
        console.log('Trainees loaded:', this.trainees);
        this.traineeOptions = this.trainees.map(t => ({ 
          value: t.id, 
          label: t.title 
        }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading trainees:', err);
        this.notification.showError('حدث خطأ في تحميل المتدربين');
        this.isLoading = false;
      }
    });

    this.courseService.getAllCourses().subscribe({
      next: (res: any) => {
        this.courses = res.items || [];
        this.courseOptions = this.courses.map(c => ({ value: c.id, label: c.title }));
      },
      error: () => this.notification.showError('حدث خطأ في تحميل الدورات')
    });

    this.employeeService.getAllTrainersLookup().subscribe({
      next: (res: any) => {
        this.trainers = res.list || [];
        this.trainerOptions = this.trainers.map(t => ({ value: t.id, label: t.title }));
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل المدربين');
      }
    });

    this.loadEnrollmentTypes();
  }

  loadEnrollmentTypes(): void {
    this.enrollmentService.getAllEnrollmentTypes().subscribe({
      next: (res: any) => {
        this.enrollmentTypes = res.items || [];
      },
      error: () => this.notification.showError('حدث خطأ في تحميل أنواع التسجيل')
    });
  }

  onTraineeSelect(): void {
    const traineeId = this.step1Form.get('traineeId')?.value;
    this.selectedTrainee = this.trainees.find(t => t.id === traineeId) || null;
    if (this.selectedTrainee && this.selectedTrainee.imageUrl) {
      this.loadTraineeImage(this.selectedTrainee);
    }
  }

  searchByNationalId(nationalId: string): void {
    if (!nationalId || nationalId.trim().length === 0) {
      this.notification.showWarning('يرجى إدخال رقم الهوية');
      return;
    }

    this.isLoading = true;
    // Find trainee by national ID
    const trainee = this.trainees.find(t => t.nationalId === nationalId.trim());
    
    if (trainee) {
      this.selectedTrainee = trainee;
      this.step1Form.patchValue({ traineeId: trainee.id });
      this.notification.showSuccess(`تم العثور على المتدرب: ${trainee.title}`);
      if (this.barcodeInput) {
        this.barcodeInput.nativeElement.value = '';
      }
      // Load trainee image if available
      if (trainee.imageUrl) {
        this.loadTraineeImage(trainee);
      }
    } else {
      this.notification.showWarning('لم يتم العثور على متدرب بهذا الرقم');
    }
    this.isLoading = false;
  }

  // enrollment-wizard-modal.component.ts - Fix the loadTraineeImage method

loadTraineeImage(trainee: TraineeLookup): void {
  if (trainee.imageUrl && /^\d{15}(\d{3})?$/.test(trainee.imageUrl)) {
    this.fileService.downloadFile(trainee.imageUrl).subscribe({
      next: (blob) => {
        const blobUrl = URL.createObjectURL(blob);
        // Update the trainee in the array and the selected trainee
        const index = this.trainees.findIndex(t => t.id === trainee.id);
        if (index !== -1) {
          this.trainees[index] = { ...this.trainees[index], imagePreviewUrl: blobUrl };
        }
        // Update selected trainee by reassigning from the array
        if (this.selectedTrainee && this.selectedTrainee.id === trainee.id) {
          this.selectedTrainee = this.trainees[index] || null;
        }
        // Force change detection
        this.selectedTrainee = { ...this.selectedTrainee } as TraineeLookup;
      },
      error: () => {
        trainee.imagePreviewUrl = '';
      }
    });
  }
}

  openAddEnrollmentTypeDialog(): void {
    const dialogRef = this.dialog.open(AddEnrollmentTypeDialogComponent, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        this.loadEnrollmentTypes();
        setTimeout(() => {
          const newType = this.enrollmentTypes.find(t => t.title === result.title);
          if (newType) {
            this.enrollmentForm.patchValue({ enrollmentTypeId: newType.id });
            this.notification.showSuccess('تم إضافة نوع التسجيل بنجاح');
          }
        }, 500);
      } else {
        this.enrollmentForm.patchValue({ enrollmentTypeId: null });
      }
    });
  }

  loadPaymentMethods(): void {
    this.financialService.getAllPaymentMethodsLookup().subscribe({
      next: (res: any) => {
        this.paymentMethods = res.list || [];
        this.paymentMethodOptions = this.paymentMethods.map((p: any) => ({ value: p.id, label: p.title }));
      },
      error: () => this.notification.showError('حدث خطأ في تحميل طرق الدفع')
    });
  }

  loadEnrollmentData(): void {
    this.isLoading = true;
    this.enrollmentService.getEnrollmentById(this.enrollmentId!).subscribe({
      next: (enrollment: any) => {
        this.step1Form.patchValue({ traineeId: enrollment.trainee?.id });
        this.onTraineeSelect();
        this.step2Form.patchValue({ courseId: enrollment.course?.id });
        this.step3Form.patchValue({ trainerId: enrollment.trainer?.id });
        this.onCourseSelect();
        
        let enrollmentStatusObj = null;
        if (enrollment.enrollmentStatus) {
          switch(enrollment.enrollmentStatus) {
            case 'PENDING': enrollmentStatusObj = ENROLLMENT_STATUSES.find(s => s.id === 1); break;
            case 'COMPLETED': enrollmentStatusObj = ENROLLMENT_STATUSES.find(s => s.id === 2); break;
            case 'CANCELLED': enrollmentStatusObj = ENROLLMENT_STATUSES.find(s => s.id === 3); break;
            default: enrollmentStatusObj = ENROLLMENT_STATUSES.find(s => s.id === 1);
          }
        }
        
        this.enrollmentForm.patchValue({
          enrollmentTypeId: enrollment.enrollmentType?.id,
          startDate: enrollment.startDate,
          endDate: enrollment.endDate,
          enrollmentStatus: enrollmentStatusObj,
          subscriptionValue: enrollment.subscriptionValue,
          discountAmount: enrollment.discountAmount,
          discountPercentage: enrollment.discountPercentage,
          note: enrollment.note
        });
        
        this.calculateFinalValue();
        this.isLoading = false;
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل بيانات التسجيل');
        this.isLoading = false;
      }
    });
  }

  onCourseSelect(): void {
    const courseId = this.step2Form.get('courseId')?.value;
    this.selectedCourse = this.courses.find(c => c.id === courseId);
    if (this.selectedCourse) {
      this.enrollmentForm.patchValue({ subscriptionValue: this.selectedCourse.price });
      const currentStartDate = this.enrollmentForm.get('startDate')?.value;
      if (!currentStartDate && this.selectedCourse.startDate) {
        this.enrollmentForm.patchValue({ startDate: this.selectedCourse.startDate });
      }
      this.setDateValidators();
      this.calculateFinalValue();
    }
  }

  setDateValidators(): void {
    if (!this.selectedCourse) return;
    
    const courseStartDate = new Date(this.selectedCourse.startDate);
    const courseEndDate = new Date(this.selectedCourse.endDate);
    
    const startDateValidator = (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const selectedDate = new Date(control.value);
      if (selectedDate < courseStartDate) return { beforeCourseStart: true };
      if (selectedDate > courseEndDate) return { afterCourseEnd: true };
      return null;
    };
    
    const endDateValidator = (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const selectedDate = new Date(control.value);
      const startDate = this.enrollmentForm.get('startDate')?.value;
      if (selectedDate > courseEndDate) return { afterCourseEnd: true };
      if (startDate && selectedDate < new Date(startDate)) return { beforeStartDate: true };
      return null;
    };
    
    this.enrollmentForm.get('startDate')?.setValidators([Validators.required, startDateValidator]);
    this.enrollmentForm.get('endDate')?.setValidators([endDateValidator]);
    this.enrollmentForm.get('startDate')?.updateValueAndValidity();
    this.enrollmentForm.get('endDate')?.updateValueAndValidity();
  }

  validateDates(): void {
    this.enrollmentForm.get('startDate')?.updateValueAndValidity();
    this.enrollmentForm.get('endDate')?.updateValueAndValidity();
  }

  onDiscountAmountChange(): void {
    const subscriptionValue = this.enrollmentForm.get('subscriptionValue')?.value || 0;
    const discountAmount = this.enrollmentForm.get('discountAmount')?.value || 0;
    
    if (subscriptionValue > 0 && discountAmount > 0) {
      const discountPercentage = (discountAmount / subscriptionValue) * 100;
      this.enrollmentForm.patchValue({ discountPercentage: Math.round(discountPercentage * 100) / 100 }, { emitEvent: false });
    } else if (discountAmount === 0) {
      this.enrollmentForm.patchValue({ discountPercentage: null }, { emitEvent: false });
    }
    this.calculateFinalValue();
  }

  onDiscountPercentageChange(): void {
    const subscriptionValue = this.enrollmentForm.get('subscriptionValue')?.value || 0;
    const discountPercentage = this.enrollmentForm.get('discountPercentage')?.value || 0;
    
    if (subscriptionValue > 0 && discountPercentage > 0) {
      const discountAmount = (subscriptionValue * discountPercentage) / 100;
      this.enrollmentForm.patchValue({ discountAmount: Math.round(discountAmount * 100) / 100 }, { emitEvent: false });
    } else if (discountPercentage === 0) {
      this.enrollmentForm.patchValue({ discountAmount: null }, { emitEvent: false });
    }
    this.calculateFinalValue();
  }

  calculateFinalValue(): void {
    const subscriptionValue = this.enrollmentForm.get('subscriptionValue')?.value || 0;
    const discountAmount = this.enrollmentForm.get('discountAmount')?.value || 0;
    const discountPercentage = this.enrollmentForm.get('discountPercentage')?.value || 0;
    
    let finalValue = subscriptionValue;
    if (discountAmount > 0) {
      finalValue = subscriptionValue - discountAmount;
    } else if (discountPercentage > 0) {
      finalValue = subscriptionValue - (subscriptionValue * discountPercentage / 100);
    }
    finalValue = Math.max(0, finalValue);
    this.enrollmentForm.patchValue({ finalSubscriptionValue: finalValue }, { emitEvent: false });
  }

  onPaymentOptionChange(event: any): void {
    this.makePaymentDirectly = event.checked;
    this.showPaymentSection = event.checked;
  }

  printPreview(): void {
    const traineeId = this.step1Form.get('traineeId')?.value;
    const trainee = this.trainees.find(t => t.id === traineeId);
    const courseId = this.step2Form.get('courseId')?.value;
    const course = this.courses.find(c => c.id === courseId);
    const trainerId = this.step3Form.get('trainerId')?.value;
    const trainer = this.trainers.find(t => t.id === trainerId);
    
    const previewData = {
      id: this.enrollmentId || 'جديد',
      trainee, course, trainer,
      enrollmentType: this.enrollmentTypes.find(t => t.id === this.enrollmentForm.get('enrollmentTypeId')?.value),
      startDate: this.enrollmentForm.get('startDate')?.value,
      endDate: this.enrollmentForm.get('endDate')?.value,
      enrollmentStatus: this.enrollmentForm.get('enrollmentStatus')?.value,
      subscriptionValue: this.enrollmentForm.get('subscriptionValue')?.value,
      discountAmount: this.enrollmentForm.get('discountAmount')?.value,
      discountPercentage: this.enrollmentForm.get('discountPercentage')?.value,
      finalSubscriptionValue: this.enrollmentForm.get('finalSubscriptionValue')?.value,
      note: this.enrollmentForm.get('note')?.value,
      isNewEnrollment: !this.isEditMode
    };
    this.generatePrintDocument(previewData);
  }

  generatePrintDocument(data: any): void {
    const printContainer = document.createElement('div');
    printContainer.style.direction = 'rtl';
    printContainer.style.fontFamily = 'Cairo, "Segoe UI", Tahoma, sans-serif';
    printContainer.style.padding = '20px';
    printContainer.style.backgroundColor = 'white';
    printContainer.style.maxWidth = '800px';
    printContainer.style.margin = '0 auto';
    
    const today = new Date().toLocaleDateString('ar-EG');
    const applicationNumber = data.isNewEnrollment ? `NEW-${Date.now()}` : `ENR-${data.id}`;
    
    printContainer.innerHTML = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"><title>طلب تسجيل - ${data.trainee?.title || 'جديد'}</title>
      <style>
        * { font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif; }
        @media print { body { margin: 0; padding: 20px; } .no-print { display: none; } }
        .container { max-width: 800px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); color: white; border-radius: 12px; }
        .header h1 { margin: 0; font-size: 24px; }
        .header p { margin: 8px 0 0; font-size: 13px; opacity: 0.85; }
        .section-title { color: #0f3460; border-bottom: 2px solid #0f3460; padding-bottom: 8px; margin-top: 24px; margin-bottom: 16px; font-size: 18px; font-weight: 600; }
        .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 16px; }
        .info-item { border-bottom: 1px solid #e5e7eb; padding: 8px 0; }
        .info-label { font-weight: 600; color: #374151; }
        .info-value { color: #1f2937; }
        .amount { font-weight: 700; color: #0f3460; font-size: 18px; }
        .footer { text-align: center; margin-top: 30px; padding: 16px; font-size: 10px; color: #9ca3af; }
        .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); opacity: 0.05; font-size: 60px; white-space: nowrap; pointer-events: none; }
        @media print { .watermark { display: none; } }
      </style>
      </head>
      <body>
        ${data.isNewEnrollment ? '<div class="watermark">مسودة - غير معتمد</div>' : ''}
        <div class="container">
          <div class="header">
            <h1>طلب تسجيل في دورة تدريبية</h1>
            <p>${applicationNumber} - ${today}</p>
          </div>
          <div class="section-title">معلومات المتدرب</div>
          <div class="info-grid">
            <div class="info-item"><div class="info-label">الاسم:</div><div class="info-value">${data.trainee?.title || '-'}</div></div>
          </div>
          <div class="section-title">معلومات الدورة</div>
          <div class="info-grid">
            <div class="info-item"><div class="info-label">الدورة:</div><div class="info-value">${data.course?.title || '-'}</div></div>
            <div class="info-item"><div class="info-label">المدرب:</div><div class="info-value">${data.trainer?.title || '-'}</div></div>
            <div class="info-item"><div class="info-label">تاريخ البدء:</div><div class="info-value">${data.startDate ? new Date(data.startDate).toLocaleDateString('ar-EG') : '-'}</div></div>
            <div class="info-item"><div class="info-label">تاريخ الانتهاء:</div><div class="info-value">${data.endDate ? new Date(data.endDate).toLocaleDateString('ar-EG') : '-'}</div></div>
          </div>
          <div class="section-title">تفاصيل الدفع</div>
          <div class="info-grid">
            <div class="info-item"><div class="info-label">قيمة الاشتراك:</div><div class="info-value amount">${(data.subscriptionValue || 0).toLocaleString('ar-EG')} جم</div></div>
            ${data.discountAmount ? `<div class="info-item"><div class="info-label">الخصم:</div><div class="info-value">${data.discountAmount.toLocaleString('ar-EG')} جم</div></div>` : ''}
            <div class="info-item"><div class="info-label">المبلغ النهائي:</div><div class="info-value amount">${(data.finalSubscriptionValue || 0).toLocaleString('ar-EG')} جم</div></div>
          </div>
          ${data.note ? `<div class="section-title">ملاحظات</div><p>${data.note}</p>` : ''}
          <div class="footer">تم التصدير من نظام إدارة الأكاديمية الأولمبية</div>
        </div>
        <div class="no-print" style="text-align: center; margin-top: 20px;">
          <button onclick="window.print();" style="padding: 10px 20px; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); color: white; border: none; border-radius: 5px; cursor: pointer;">🖨️ طباعة / حفظ كـ PDF</button>
        </div>
      </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank', 'width=800,height=800,scrollbars=yes');
    if (printWindow) {
      printWindow.document.write(printContainer.innerHTML);
      printWindow.document.close();
      this.notification.showSuccess('تم فتح نموذج الطلب');
    }
  }

  openPaymentModal(enrollmentId: number, finalAmount: number): void {
    this.dialogRef.close(true);
    setTimeout(() => {
      import('../../../financial/pages/enrollment/enrollment-payment/enrollment-payment-wizard/enrollment-payment-wizard-modal.component')
        .then(module => {
          const paymentDialog = this.dialog.open(module.EnrollmentPaymentWizardModalComponent, {
            width: '800px',
            maxWidth: '90vw',
            data: { enrollmentId: enrollmentId }
          });
          paymentDialog.afterClosed().subscribe((result: any) => {
            if (result) this.notification.showSuccess('تم إضافة الدفعة بنجاح');
          });
        })
        .catch(error => {
          console.error('Error loading payment modal:', error);
          this.notification.showError('حدث خطأ في فتح نافذة الدفع');
        });
    }, 100);
  }

  submitEnrollment(): void {
    if (this.step1Form.invalid || this.step2Form.invalid || this.step3Form.invalid) {
      this.notification.showWarning('يرجى تعبئة جميع الحقول المطلوبة في الخطوات السابقة');
      return;
    }
    if (this.enrollmentForm.invalid) {
      this.notification.showWarning('يرجى التحقق من صحة التواريخ المدخلة');
      return;
    }
    
    this.isSubmitting = true;
    
    const enrollmentStatusObj = this.enrollmentForm.get('enrollmentStatus')?.value;
    let enrollmentStatusEnum = null;
    if (enrollmentStatusObj) {
      switch(enrollmentStatusObj.id) {
        case 1: enrollmentStatusEnum = 'PENDING'; break;
        case 2: enrollmentStatusEnum = 'COMPLETED'; break;
        case 3: enrollmentStatusEnum = 'CANCELLED'; break;
        default: enrollmentStatusEnum = 'PENDING';
      }
    }
    
    const finalSubscriptionValue = this.enrollmentForm.get('finalSubscriptionValue')?.value || 0;
    const enrollmentTypeId = this.enrollmentForm.get('enrollmentTypeId')?.value;
    
    const enrollmentData = {
      traineeId: this.step1Form.get('traineeId')?.value,
      courseId: this.step2Form.get('courseId')?.value,
      trainerId: this.step3Form.get('trainerId')?.value,
      enrollmentTypeId: enrollmentTypeId && enrollmentTypeId !== 'new' ? Number(enrollmentTypeId) : null,
      startDate: this.enrollmentForm.get('startDate')?.value,
      endDate: this.enrollmentForm.get('endDate')?.value,
      enrollmentStatus: enrollmentStatusEnum,
      paymentStatus: this.makePaymentDirectly ? 'PARTIAL' : 'PENDING',
      subscriptionValue: this.enrollmentForm.get('subscriptionValue')?.value,
      discountAmount: this.enrollmentForm.get('discountAmount')?.value,
      discountPercentage: this.enrollmentForm.get('discountPercentage')?.value,
      finalSubscriptionValue: finalSubscriptionValue,
      remainedSubscriptionValue: finalSubscriptionValue,
      note: this.enrollmentForm.get('note')?.value
    };

    if (this.isEditMode && this.enrollmentId) {
      this.enrollmentService.updateEnrollment(this.enrollmentId, enrollmentData as any).subscribe({
        next: () => {
          this.notification.showSuccess('تم تحديث التسجيل بنجاح');
          if (this.makePaymentDirectly && finalSubscriptionValue > 0) {
            this.openPaymentModal(this.enrollmentId!, finalSubscriptionValue);
          } else {
            this.dialogRef.close(true);
          }
          this.isSubmitting = false;
        },
        error: (err) => {
          console.error('Update error:', err);
          this.notification.showError(err.error?.messageEn || 'حدث خطأ في تحديث التسجيل');
          this.isSubmitting = false;
        }
      });
    } else {
      this.enrollmentService.createEnrollment(enrollmentData as any).subscribe({
        next: (res: any) => {
          this.notification.showSuccess('تم إضافة التسجيل بنجاح');
          if (this.makePaymentDirectly && finalSubscriptionValue > 0) {
            this.openPaymentModal(res.id, finalSubscriptionValue);
          } else {
            this.dialogRef.close(true);
          }
          this.isSubmitting = false;
        },
        error: (err) => {
          console.error('Create error:', err);
          this.notification.showError(err.error?.messageEn || 'حدث خطأ في إضافة التسجيل');
          this.isSubmitting = false;
        }
      });
    }
  }
}

// Dialog component for adding new enrollment type
@Component({
  selector: 'app-add-enrollment-type-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <mat-icon>add_circle</mat-icon>
        <h2>إضافة نوع تسجيل جديد</h2>
      </div>
      <mat-divider></mat-divider>
      <div class="dialog-content">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>نوع التسجيل</mat-label>
          <input matInput [(ngModel)]="title" placeholder="مثال: تسجيل عادي, تسجيل مميز, ...">
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>الوصف (اختياري)</mat-label>
          <textarea matInput [(ngModel)]="description" rows="3" placeholder="وصف نوع التسجيل..."></textarea>
        </mat-form-field>
      </div>
      <div class="dialog-actions">
        <button mat-button (click)="cancel()">إلغاء</button>
        <button mat-raised-button color="primary" [disabled]="!title || isSubmitting" (click)="save()">
          <mat-spinner diameter="20" *ngIf="isSubmitting"></mat-spinner>
          <span *ngIf="!isSubmitting">حفظ</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 24px;
      min-width: 400px;
      background: white;
      border-radius: 24px;
    }
    .dialog-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
    }
    .dialog-header mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
      color: #0f3460;
    }
    .dialog-header h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: #1e293b;
    }
    .dialog-content {
      padding: 16px 0;
    }
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    .dialog-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 20px;
      padding-top: 16px;
      border-top: 1px solid #e2e8f0;
    }
    .dialog-actions button {
      min-width: 100px;
    }
    @media (max-width: 500px) {
      .dialog-container {
        min-width: 300px;
        padding: 16px;
      }
      .dialog-actions {
        flex-direction: column-reverse;
      }
      .dialog-actions button {
        width: 100%;
      }
    }
  `]
})
export class AddEnrollmentTypeDialogComponent {
  title: string = '';
  description: string = '';
  isSubmitting: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<AddEnrollmentTypeDialogComponent>,
    private enrollmentService: EnrollmentService,
    private notification: NotificationService
  ) {}

  cancel(): void {
    this.dialogRef.close({ success: false });
  }

  save(): void {
    if (!this.title) {
      this.notification.showWarning('يرجى إدخال نوع التسجيل');
      return;
    }
    this.isSubmitting = true;
    this.enrollmentService.createEnrollmentType({
      title: this.title,
      description: this.description
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.dialogRef.close({ success: true, title: this.title });
      },
      error: (err) => {
        console.error('Error creating enrollment type:', err);
        this.notification.showError(err.error?.messageEn || 'حدث خطأ في إضافة نوع التسجيل');
        this.isSubmitting = false;
      }
    });
  }
}