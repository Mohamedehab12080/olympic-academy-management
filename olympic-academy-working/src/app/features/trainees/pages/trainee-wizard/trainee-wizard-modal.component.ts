import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
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
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { TraineeService } from '../../../../core/services/trainee.service';
import { CourseService } from '../../../../core/services/course.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { SearchableSelectComponent, SelectOption } from '../../../../shared/components/searchable-select/searchable-select.component';
import { GENDERS, CONTACT_TYPES } from '../../../../core/models/common.model';

@Component({
  selector: 'app-trainee-wizard-modal',
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
    MatChipsModule,
    MatTooltipModule,
    MatSlideToggleModule,
    SearchableSelectComponent
  ],
  template: `
    <div class="wizard-container" dir="rtl">
      <!-- Header -->
      <div class="wizard-header">
        <div class="header-title">
          <mat-icon>{{ isEditMode ? 'edit' : 'person_add' }}</mat-icon>
          <h2>{{ isEditMode ? 'تعديل متدرب' : 'إضافة متدرب جديد' }}</h2>
        </div>
        <div class="header-actions">
          <button mat-icon-button (click)="printPreview()" matTooltip="معاينة الطباعة" *ngIf="isEditMode">
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
          
          <!-- Step 1: Basic Information -->
          <mat-step [stepControl]="basicInfoForm">
            <ng-template matStepLabel>
              <div class="step-label">
                <mat-icon>person</mat-icon>
                <span>المعلومات الأساسية</span>
              </div>
            </ng-template>
            <div class="step-content">
              <form [formGroup]="basicInfoForm">
                <!-- Image Upload -->
                <div class="image-upload-section">
                  <div class="image-preview" *ngIf="imagePreview || traineeImageUrl">
                    <img [src]="imagePreview || traineeImageUrl" alt="صورة المتدرب">
                    <button mat-icon-button class="remove-image" (click)="removeImage()" type="button">
                      <mat-icon>close</mat-icon>
                    </button>
                  </div>
                  <div class="upload-placeholder" *ngIf="!imagePreview && !traineeImageUrl" (click)="fileInput.click()">
                    <mat-icon>cloud_upload</mat-icon>
                    <p>اضغط لرفع صورة المتدرب</p>
                  </div>
                  <input type="file" #fileInput (change)="onFileSelected($event)" accept="image/*" style="display: none">
                  <button mat-stroked-button type="button" (click)="fileInput.click()">
                    <mat-icon>{{ imagePreview || traineeImageUrl ? 'edit' : 'upload' }}</mat-icon>
                    {{ imagePreview || traineeImageUrl ? 'تغيير الصورة' : 'رفع صورة' }}
                  </button>
                </div>

                <div class="form-grid">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>الاسم الكامل *</mat-label>
                    <input matInput formControlName="fullName">
                    <mat-error *ngIf="basicInfoForm.get('fullName')?.hasError('required')">الاسم مطلوب</mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>رقم الهوية *</mat-label>
                    <input matInput formControlName="nationalId" maxlength="14">
                    <mat-error *ngIf="basicInfoForm.get('nationalId')?.hasError('required')">رقم الهوية مطلوب</mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>السنة الدراسية</mat-label>
                    <input matInput formControlName="academicYear">
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>تاريخ الميلاد</mat-label>
                    <input matInput [matDatepicker]="birthPicker" formControlName="birthDate">
                    <mat-datepicker-toggle matSuffix [for]="birthPicker"></mat-datepicker-toggle>
                    <mat-datepicker #birthPicker></mat-datepicker>
                  </mat-form-field>

                  <app-searchable-select
                    [ngModel]="basicInfoForm.get('gender')?.value"
                    (ngModelChange)="basicInfoForm.get('gender')?.setValue($event)"
                    label="الجنس"
                    [options]="genderOptions"
                    [ngModelOptions]="{standalone: true}">
                  </app-searchable-select>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>العنوان</mat-label>
                    <input matInput formControlName="address">
                  </mat-form-field>

                  <!-- Status Toggle - Only visible in Edit Mode -->
                  <div class="full-width status-toggle" *ngIf="isEditMode">
                    <mat-slide-toggle 
                      [color]="'primary'"
                      [checked]="basicInfoForm.get('isActive')?.value"
                      (change)="basicInfoForm.get('isActive')?.setValue($event.checked)">
                      <div class="toggle-label">
                        <mat-icon>account_circle</mat-icon>
                        <span>حالة المتدرب</span>
                      </div>
                      <div class="toggle-status" [class.active]="basicInfoForm.get('isActive')?.value">
                        {{ basicInfoForm.get('isActive')?.value ? 'نشط' : 'غير نشط' }}
                      </div>
                    </mat-slide-toggle>
                  </div>
                </div>
              </form>
            </div>
            <div class="step-actions">
              <button mat-raised-button color="primary" matStepperNext [disabled]="basicInfoForm.invalid">
                التالي <mat-icon>arrow_back</mat-icon>
              </button>
            </div>
          </mat-step>

          <!-- Step 2: Contacts -->
          <mat-step>
            <ng-template matStepLabel>
              <div class="step-label">
                <mat-icon>contact_phone</mat-icon>
                <span>جهات الاتصال</span>
              </div>
            </ng-template>
            <div class="step-content">
              <form [formGroup]="contactsForm">
                <div formArrayName="contacts">
                  <div *ngFor="let contact of contactsArray.controls; let i=index" [formGroupName]="i" class="contact-row">
                    <app-searchable-select
                      [ngModel]="contact.get('contactType')?.value"
                      (ngModelChange)="contact.get('contactType')?.setValue($event)"
                      label="نوع جهة الاتصال"
                      [options]="contactTypeOptions"
                      [ngModelOptions]="{standalone: true}">
                    </app-searchable-select>

                    <mat-form-field appearance="outline" class="contact-value">
                      <mat-label>القيمة</mat-label>
                      <input matInput formControlName="contactValue" placeholder="مثال: 05xxxxxxxx">
                    </mat-form-field>

                    <button mat-icon-button color="warn" (click)="removeContact(i)" type="button" matTooltip="حذف">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                </div>
                <button mat-stroked-button type="button" (click)="addContact()" class="add-contact-btn">
                  <mat-icon>add</mat-icon> إضافة جهة اتصال
                </button>
              </form>
            </div>
            <div class="step-actions">
              <button mat-stroked-button matStepperPrevious>
                <mat-icon>arrow_forward</mat-icon> السابق
              </button>
              <button mat-raised-button color="primary" matStepperNext>
                التالي <mat-icon>arrow_back</mat-icon>
              </button>
            </div>
          </mat-step>

          <!-- Step 3: Certificates -->
          <mat-step>
            <ng-template matStepLabel>
              <div class="step-label">
                <mat-icon>school</mat-icon>
                <span>الشهادات</span>
              </div>
            </ng-template>
            <div class="step-content">
              <form [formGroup]="certificatesForm">
                <div formArrayName="certificates">
                  <div *ngFor="let cert of certificatesArray.controls; let i=index" [formGroupName]="i" class="certificate-row">
                    <mat-form-field appearance="outline" class="cert-name">
                      <mat-label>اسم الشهادة</mat-label>
                      <input matInput formControlName="certificateName">
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="cert-number">
                      <mat-label>رقم الشهادة</mat-label>
                      <input matInput formControlName="certificateNumber">
                    </mat-form-field>

                    <app-searchable-select
                      [ngModel]="cert.get('courseId')?.value"
                      (ngModelChange)="cert.get('courseId')?.setValue($event)"
                      label="الدورة"
                      [options]="courseOptions"
                      [ngModelOptions]="{standalone: true}">
                    </app-searchable-select>

                    <mat-form-field appearance="outline" class="cert-date">
                      <mat-label>تاريخ الإصدار</mat-label>
                      <input matInput [matDatepicker]="issuePicker" formControlName="issueDate">
                      <mat-datepicker-toggle matSuffix [for]="issuePicker"></mat-datepicker-toggle>
                      <mat-datepicker #issuePicker></mat-datepicker>
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="cert-grade">
                      <mat-label>الدرجة</mat-label>
                      <input matInput formControlName="grade">
                    </mat-form-field>

                    <button mat-icon-button color="warn" (click)="removeCertificate(i)" type="button" matTooltip="حذف">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                </div>
                <button mat-stroked-button type="button" (click)="addCertificate()" class="add-cert-btn">
                  <mat-icon>add</mat-icon> إضافة شهادة
                </button>
              </form>
            </div>
            <div class="step-actions">
              <button mat-stroked-button matStepperPrevious>
                <mat-icon>arrow_forward</mat-icon> السابق
              </button>
              <button mat-raised-button color="primary" matStepperNext>
                التالي <mat-icon>arrow_back</mat-icon>
              </button>
            </div>
          </mat-step>

          <!-- Step 4: Health Conditions -->
          <mat-step>
            <ng-template matStepLabel>
              <div class="step-label">
                <mat-icon>health_and_safety</mat-icon>
                <span>الحالات الصحية</span>
              </div>
            </ng-template>
            <div class="step-content">
              <form [formGroup]="healthConditionsForm">
                <div formArrayName="healthConditions">
                  <div *ngFor="let condition of healthConditionsArray.controls; let i=index" [formGroupName]="i" class="condition-row">
                    <mat-form-field appearance="outline" class="condition-title">
                      <mat-label>العنوان</mat-label>
                      <input matInput formControlName="title">
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="condition-desc">
                      <mat-label>الوصف</mat-label>
                      <input matInput formControlName="description">
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="condition-med">
                      <mat-label>العلاج</mat-label>
                      <input matInput formControlName="medication">
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="condition-note">
                      <mat-label>ملاحظات</mat-label>
                      <input matInput formControlName="note">
                    </mat-form-field>

                    <button mat-icon-button color="warn" (click)="removeHealthCondition(i)" type="button" matTooltip="حذف">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                </div>
                <button mat-stroked-button type="button" (click)="addHealthCondition()" class="add-condition-btn">
                  <mat-icon>add</mat-icon> إضافة حالة صحية
                </button>
              </form>
            </div>
            <div class="step-actions">
              <button mat-stroked-button matStepperPrevious>
                <mat-icon>arrow_forward</mat-icon> السابق
              </button>
              <button mat-raised-button color="primary" matStepperNext>
                التالي <mat-icon>arrow_back</mat-icon>
              </button>
            </div>
          </mat-step>

          <!-- Step 5: Summary & Submit -->
          <mat-step>
            <ng-template matStepLabel>
              <div class="step-label">
                <mat-icon>check_circle</mat-icon>
                <span>تأكيد المعلومات</span>
              </div>
            </ng-template>
            <div class="step-content">
              <div class="summary-section">
                <h3>مراجعة البيانات</h3>
                
                <mat-card class="summary-card">
                  <mat-card-title>المعلومات الأساسية</mat-card-title>
                  <div class="summary-grid">
                    <div><strong>الاسم:</strong> {{ basicInfoForm.get('fullName')?.value }}</div>
                    <div><strong>رقم الهوية:</strong> {{ basicInfoForm.get('nationalId')?.value }}</div>
                    <div><strong>السنة الدراسية:</strong> {{ basicInfoForm.get('academicYear')?.value || '-' }}</div>
                    <div><strong>تاريخ الميلاد:</strong> {{ basicInfoForm.get('birthDate')?.value | date:'dd/MM/yyyy' }}</div>
                    <div><strong>الجنس:</strong> {{ basicInfoForm.get('gender')?.value?.title }}</div>
                    <div><strong>العنوان:</strong> {{ basicInfoForm.get('address')?.value || '-' }}</div>
                    <div *ngIf="isEditMode"><strong>الحالة:</strong> {{ basicInfoForm.get('isActive')?.value ? 'نشط' : 'غير نشط' }}</div>
                  </div>
                </mat-card>

                <mat-card class="summary-card" *ngIf="getContactsList().length > 0">
                  <mat-card-title>جهات الاتصال</mat-card-title>
                  <div class="contacts-summary">
                    <div *ngFor="let contact of getContactsList()" class="summary-item">
                      <strong>{{ contact.contactType?.title }}:</strong> {{ contact.contactValue }}
                    </div>
                  </div>
                </mat-card>

                <mat-card class="summary-card" *ngIf="getCertificatesList().length > 0">
                  <mat-card-title>الشهادات</mat-card-title>
                  <div class="certificates-summary">
                    <div *ngFor="let cert of getCertificatesList()" class="summary-item">
                      <strong>{{ cert.certificateName }}</strong>
                      <span *ngIf="cert.certificateNumber"> - رقم: {{ cert.certificateNumber }}</span>
                    </div>
                  </div>
                </mat-card>

                <mat-card class="summary-card" *ngIf="getHealthConditionsList().length > 0">
                  <mat-card-title>الحالات الصحية</mat-card-title>
                  <div class="health-summary">
                    <div *ngFor="let condition of getHealthConditionsList()" class="summary-item">
                      <strong>{{ condition.title }}</strong>
                      <span *ngIf="condition.description"> - {{ condition.description }}</span>
                    </div>
                  </div>
                </mat-card>
              </div>
            </div>
            <div class="step-actions">
              <button mat-stroked-button matStepperPrevious>
                <mat-icon>arrow_forward</mat-icon> السابق
              </button>
              <button mat-raised-button color="primary" (click)="submitTrainee()" [disabled]="isSubmitting">
                <mat-spinner diameter="20" *ngIf="isSubmitting"></mat-spinner>
                <span *ngIf="!isSubmitting">{{ isEditMode ? 'تحديث' : 'تأكيد الإضافة' }}</span>
              </button>
              <button mat-stroked-button color="accent" (click)="printPreview()" [disabled]="isSubmitting" *ngIf="isEditMode">
                <mat-icon>print</mat-icon>
                طباعة
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
      background: #f5f7fa;
      border-radius: 24px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    /* Header */
    .wizard-header {
      flex-shrink: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
    .wizard-header h2 {
      margin: 0;
      font-size: 22px;
      font-weight: 600;
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
    }

    /* Stepper Container */
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
      min-height: 350px;
    }

    .step-actions {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
      padding: 16px 0;
      border-top: 1px solid #e5e7eb;
      margin-top: 16px;
      background: #f5f7fa;
      position: sticky;
      bottom: 0;
      z-index: 10;
    }
    .step-actions button {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 24px;
    }

    /* Form Layout */
    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }

    .full-width {
      width: 100%;
    }

    /* Status Toggle */
    .status-toggle {
      margin-top: 16px;
      padding: 16px;
      background: #f9fafb;
      border-radius: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .toggle-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
      color: #374151;
    }
    .toggle-label mat-icon {
      color: #667eea;
    }
    .toggle-status {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      background: #fee2e2;
      color: #991b1b;
    }
    .toggle-status.active {
      background: #d1fae5;
      color: #065f46;
    }

    /* Image Upload */
    .image-upload-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
      padding: 20px;
      background: white;
      border-radius: 16px;
      border: 1px solid #e5e7eb;
    }
    .image-preview {
      position: relative;
      width: 120px;
      height: 120px;
      border-radius: 50%;
      overflow: hidden;
      border: 3px solid #667eea;
    }
    .image-preview img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .remove-image {
      position: absolute;
      top: 5px;
      right: 5px;
      background: rgba(0,0,0,0.6);
      color: white;
    }
    .upload-placeholder {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: #f3f4f6;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border: 2px dashed #d1d5db;
      transition: all 0.3s;
    }
    .upload-placeholder:hover {
      background: #e5e7eb;
      border-color: #667eea;
    }
    .upload-placeholder mat-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
      color: #9ca3af;
    }
    .upload-placeholder p {
      margin: 8px 0 0;
      font-size: 11px;
      color: #6b7280;
    }

    /* Contacts */
    .contact-row {
      display: grid;
      grid-template-columns: 200px 1fr auto;
      gap: 16px;
      align-items: center;
      margin-bottom: 16px;
    }
    .contact-value {
      width: 100%;
    }
    .add-contact-btn {
      margin-top: 16px;
    }

    /* Certificates */
    .certificate-row {
      display: grid;
      grid-template-columns: 1fr 1fr 1.5fr 1fr 1fr auto;
      gap: 12px;
      align-items: center;
      margin-bottom: 16px;
    }
    .cert-name, .cert-number, .cert-course, .cert-date, .cert-grade {
      width: 100%;
    }
    .add-cert-btn {
      margin-top: 16px;
    }

    /* Health Conditions */
    .condition-row {
      display: grid;
      grid-template-columns: 1fr 1.5fr 1fr 1.5fr auto;
      gap: 12px;
      align-items: center;
      margin-bottom: 16px;
    }
    .condition-title, .condition-desc, .condition-med, .condition-note {
      width: 100%;
    }
    .add-condition-btn {
      margin-top: 16px;
    }

    /* Summary Section */
    .summary-section {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .summary-card {
      padding: 16px;
    }
    .summary-card mat-card-title {
      font-size: 16px;
      font-weight: 600;
      color: #667eea;
      margin-bottom: 12px;
    }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
    .summary-item {
      padding: 4px 0;
      border-bottom: 1px solid #f3f4f6;
    }

    /* Loading Overlay */
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

    /* Responsive */
    @media (max-width: 768px) {
      .wizard-container {
        min-width: 90vw;
        max-width: 90vw;
      }
      .form-grid {
        grid-template-columns: 1fr;
      }
      .contact-row {
        grid-template-columns: 1fr;
      }
      .certificate-row {
        grid-template-columns: 1fr;
      }
      .condition-row {
        grid-template-columns: 1fr;
      }
      .summary-grid {
        grid-template-columns: 1fr;
      }
      .step-actions {
        flex-direction: column;
      }
      .step-actions button {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class TraineeWizardModalComponent implements OnInit {
  @ViewChild('stepper') stepper!: MatStepper;
  
  basicInfoForm: FormGroup;
  contactsForm: FormGroup;
  certificatesForm: FormGroup;
  healthConditionsForm: FormGroup;
  
  courses: any[] = [];
  
  genderOptions: SelectOption[] = [];
  contactTypeOptions: SelectOption[] = [];
  courseOptions: SelectOption[] = [];
  
  selectedImage: File | null = null;
  imagePreview: string | null = null;
  traineeImageUrl: string | null = null;
  
  isLoading = false;
  isSubmitting = false;
  isEditMode = false;
  traineeId: number | null = null;
  
  get contactsArray() { return this.contactsForm.get('contacts') as FormArray; }
  get certificatesArray() { return this.certificatesForm.get('certificates') as FormArray; }
  get healthConditionsArray() { return this.healthConditionsForm.get('healthConditions') as FormArray; }

  constructor(
    private dialogRef: MatDialogRef<TraineeWizardModalComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { traineeId?: number },
    private fb: FormBuilder,
    private traineeService: TraineeService,
    private courseService: CourseService,
    private notification: NotificationService
  ) {
    this.isEditMode = !!data?.traineeId;
    this.traineeId = data?.traineeId || null;
    
    this.basicInfoForm = this.fb.group({
      fullName: ['', Validators.required],
      nationalId: ['', Validators.required],
      academicYear: [''],
      birthDate: [''],
      gender: [null],
      address: [''],
      isActive: [true]  // Default to active for new trainees
    });
    
    this.contactsForm = this.fb.group({
      contacts: this.fb.array([])
    });
    
    this.certificatesForm = this.fb.group({
      certificates: this.fb.array([])
    });
    
    this.healthConditionsForm = this.fb.group({
      healthConditions: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadSelectOptions();
    this.loadCourses();
    this.addContact();
    
    if (this.isEditMode && this.traineeId) {
      this.loadTraineeData();
    }
  }

  loadSelectOptions(): void {
    this.genderOptions = GENDERS.map(g => ({ value: g, label: g.title }));
    this.contactTypeOptions = CONTACT_TYPES.map(c => ({ value: c, label: c.title }));
  }

  loadCourses(): void {
    this.courseService.getAllCourses().subscribe({
      next: (res: any) => {
        this.courses = res.items || [];
        this.courseOptions = this.courses.map(c => ({ value: c.id, label: c.title }));
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل الدورات');
      }
    });
  }

 loadTraineeData(): void {
  this.isLoading = true;
  this.traineeService.getTraineeById(this.traineeId!).subscribe({
    next: (t: any) => {
      // Convert backend enum strings back to objects with id and title
      let genderObj = null;
      if (t.gender) {
        genderObj = t.gender === 'MALE' ? GENDERS.find(g => g.id === 1) : GENDERS.find(g => g.id === 2);
      }
      
      this.basicInfoForm.patchValue({
        fullName: t.fullName,
        nationalId: t.nationalId,
        academicYear: t.academicYear,
        birthDate: t.birthDate,
        gender: genderObj,
        address: t.address,
        isActive: t.isActive !== undefined ? t.isActive : true
      });
      
      if (t.imageUrl) {
        this.traineeImageUrl = t.imageUrl;
      }
      
      // Load contacts - convert contactType enum strings back to objects
      if (t.contacts?.length) {
        while (this.contactsArray.length) this.contactsArray.removeAt(0);
        t.contacts.forEach((c: any) => {
          let contactTypeObj = null;
          if (c.contactType) {
            switch(c.contactType) {
              case 'EMAIL':
                contactTypeObj = CONTACT_TYPES.find(ct => ct.id === 1);
                break;
              case 'PHONE':
                contactTypeObj = CONTACT_TYPES.find(ct => ct.id === 2);
                break;
              default:
                contactTypeObj = CONTACT_TYPES.find(ct => ct.id === 2);
            }
          }
          this.contactsArray.push(this.fb.group({
            contactType: [contactTypeObj],
            contactValue: [c.contactValue]
          }));
        });
      }
      
      // Load certificates
      if (t.certificates?.length) {
        while (this.certificatesArray.length) this.certificatesArray.removeAt(0);
        t.certificates.forEach((c: any) => {
          this.certificatesArray.push(this.fb.group({
            certificateName: [c.certificateName],
            certificateNumber: [c.certificateNumber],
            courseId: [c.course?.id],
            issueDate: [c.issueDate],
            grade: [c.grade]
          }));
        });
      }
      
      // Load health conditions
      if (t.healthConditions?.length) {
        while (this.healthConditionsArray.length) this.healthConditionsArray.removeAt(0);
        t.healthConditions.forEach((h: any) => {
          this.healthConditionsArray.push(this.fb.group({
            title: [h.title],
            description: [h.description],
            medication: [h.medication],
            note: [h.note]
          }));
        });
      }
      
      this.isLoading = false;
    },
    error: () => {
      this.notification.showError('حدث خطأ في تحميل بيانات المتدرب');
      this.isLoading = false;
    }
  });
}

  addContact(): void {
    this.contactsArray.push(this.fb.group({
      contactType: [null],
      contactValue: ['']
    }));
  }

  removeContact(index: number): void {
    this.contactsArray.removeAt(index);
  }

  addCertificate(): void {
    this.certificatesArray.push(this.fb.group({
      certificateName: [''],
      certificateNumber: [''],
      courseId: [null],
      issueDate: [''],
      grade: ['']
    }));
  }

  removeCertificate(index: number): void {
    this.certificatesArray.removeAt(index);
  }

  addHealthCondition(): void {
    this.healthConditionsArray.push(this.fb.group({
      title: [''],
      description: [''],
      medication: [''],
      note: ['']
    }));
  }

  removeHealthCondition(index: number): void {
    this.healthConditionsArray.removeAt(index);
  }

  getContactsList(): any[] {
    return this.contactsArray.value.filter((c: any) => c.contactType && c.contactValue);
  }

  getCertificatesList(): any[] {
    return this.certificatesArray.value.filter((c: any) => c.certificateName);
  }

  getHealthConditionsList(): any[] {
    return this.healthConditionsArray.value.filter((h: any) => h.title);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedImage = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedImage);
    }
  }

  removeImage(): void {
    this.selectedImage = null;
    this.imagePreview = null;
    this.traineeImageUrl = null;
  }

  async uploadImage(): Promise<string | null> {
    if (!this.selectedImage) return this.traineeImageUrl;
    
    const formData = new FormData();
    formData.append('file', this.selectedImage);
    
    try {
      const response = await this.traineeService.uploadTraineeImage(formData).toPromise();
      return response?.imageUrl || null;
    } catch (error) {
      this.notification.showError('حدث خطأ في رفع الصورة');
      return null;
    }
  }

  printPreview(): void {
    const previewData = {
      ...this.basicInfoForm.value,
      contacts: this.getContactsList(),
      certificates: this.getCertificatesList(),
      healthConditions: this.getHealthConditionsList(),
      imageUrl: this.imagePreview || this.traineeImageUrl,
      isNewTrainee: !this.isEditMode,
      id: this.traineeId || 'جديد'
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
    
    printContainer.innerHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>ملف متدرب - ${data.fullName || 'جديد'}</title>
        <style>
          * { font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif; }
          @media print { body { margin: 0; padding: 20px; } .no-print { display: none; } }
          .profile-container { max-width: 800px; margin: 0 auto; background: white; }
          .header { text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 12px; }
          .header h1 { margin: 0; font-size: 24px; }
          .header p { margin: 10px 0 0 0; font-size: 12px; opacity: 0.9; }
          .profile-details { display: flex; justify-content: space-between; margin-bottom: 20px; padding: 10px; background: #f9fafb; border-radius: 8px; }
          .photo-section { text-align: center; margin-bottom: 20px; }
          .trainee-photo { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 3px solid #667eea; }
          .placeholder-photo { width: 120px; height: 120px; border-radius: 50%; background: #f3f4f6; display: flex; align-items: center; justify-content: center; margin: 0 auto; border: 3px solid #667eea; font-size: 48px; }
          h2 { color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 8px; margin-top: 24px; margin-bottom: 16px; font-size: 18px; }
          .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 16px; }
          .info-item { border-bottom: 1px solid #e5e7eb; padding: 8px 0; }
          .info-label { font-weight: 600; color: #374151; font-size: 13px; margin-bottom: 4px; }
          .info-value { color: #1f2937; font-size: 14px; }
          .signature-section { margin-top: 40px; display: flex; justify-content: space-between; align-items: flex-end; gap: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
          .signature-box { text-align: center; flex: 1; }
          .signature-line { width: 100%; border-top: 1px solid #000; margin-top: 40px; padding-top: 8px; }
          .footer { text-align: center; margin-top: 30px; padding: 16px; font-size: 10px; color: #9ca3af; }
          .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); opacity: 0.1; font-size: 60px; white-space: nowrap; pointer-events: none; }
          @media print { .watermark { display: none; } }
        </style>
      </head>
      <body>
        ${data.isNewTrainee ? '<div class="watermark">مسودة - غير معتمد</div>' : ''}
        <div class="profile-container">
          <div class="header">
            <h1>ملف متدرب</h1>
            <p>نظام إدارة الأكاديمية الأولمبية</p>
          </div>
          <div class="profile-details">
            <div><strong>رقم الملف:</strong> ${data.isNewTrainee ? 'جديد' : '#' + data.id}</div>
            <div><strong>تاريخ الطباعة:</strong> ${today}</div>
          </div>
          <div class="photo-section">
            ${data.imageUrl ? `<img src="${data.imageUrl}" class="trainee-photo">` : '<div class="placeholder-photo">📷</div>'}
          </div>
          <h2>📋 المعلومات الشخصية</h2>
          <div class="info-grid">
            <div class="info-item"><div class="info-label">الاسم الكامل</div><div class="info-value">${data.fullName || '-'}</div></div>
            <div class="info-item"><div class="info-label">رقم الهوية</div><div class="info-value">${data.nationalId || '-'}</div></div>
            <div class="info-item"><div class="info-label">تاريخ الميلاد</div><div class="info-value">${data.birthDate ? new Date(data.birthDate).toLocaleDateString('ar-EG') : '-'}</div></div>
            <div class="info-item"><div class="info-label">الجنس</div><div class="info-value">${data.gender?.title || '-'}</div></div>
            <div class="info-item"><div class="info-label">السنة الدراسية</div><div class="info-value">${data.academicYear || '-'}</div></div>
            <div class="info-item"><div class="info-label">العنوان</div><div class="info-value">${data.address || '-'}</div></div>
            ${!data.isNewTrainee ? `<div class="info-item"><div class="info-label">الحالة</div><div class="info-value">${data.isActive ? 'نشط' : 'غير نشط'}</div></div>` : ''}
          </div>
          <div class="signature-section">
            <div class="signature-box"><div class="signature-line"></div><div>توقيع المتدرب</div></div>
            <div class="signature-box"><div class="signature-line"></div><div>توقيع ولي الأمر</div></div>
            <div class="signature-box"><div class="signature-line"></div><div>ختم الأكاديمية</div></div>
          </div>
          <div class="footer">تم التصدير من نظام إدارة الأكاديمية الأولمبية</div>
        </div>
        <div class="no-print" style="text-align: center; margin-top: 20px;">
          <button onclick="window.print();" style="padding: 10px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 5px; cursor: pointer;">🖨️ طباعة / حفظ كـ PDF</button>
        </div>
      </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank', 'width=800,height=800,scrollbars=yes');
    if (printWindow) {
      printWindow.document.write(printContainer.innerHTML);
      printWindow.document.close();
      this.notification.showSuccess('تم فتح نموذج الطلب - يمكنك طباعته للحصول على التوقيعات');
    } else {
      document.body.appendChild(printContainer);
      window.print();
      setTimeout(() => { document.body.removeChild(printContainer); }, 500);
    }
  }

 async submitTrainee(): Promise<void> {
  if (this.basicInfoForm.invalid) {
    this.notification.showWarning('يرجى تعبئة جميع الحقول المطلوبة');
    return;
  }
  
  this.isSubmitting = true;
  
  let imageUrl = this.traineeImageUrl;
  if (this.selectedImage) {
    imageUrl = await this.uploadImage();
  }
  
  // Get the selected gender object
  const genderValue = this.basicInfoForm.get('gender')?.value;
  
  // Convert gender to enum string (backend expects MALE/FEMALE)
  let genderEnum = null;
  if (genderValue) {
    genderEnum = genderValue.id === 1 ? 'MALE' : 'FEMALE';
  }
  
  // Convert contact types to enum strings for backend
  // ContactTypes expected: EMAIL, PHONE, MOBILE (based on your backend)
  const contactsList = this.getContactsList().map(contact => {
    const contactTypeObj = contact.contactType;
    let contactTypeEnum = null;
    if (contactTypeObj) {
      switch(contactTypeObj.id) {
        case 1: // ايميل
          contactTypeEnum = 'EMAIL';
          break;
        case 2: // هاتف
          contactTypeEnum = 'PHONE';
          break;
        default:
          contactTypeEnum = 'PHONE';
      }
    }
    return {
      contactType: contactTypeEnum,
      contactValue: contact.contactValue
    };
  });
  
  const formData = {
    fullName: this.basicInfoForm.get('fullName')?.value,
    nationalId: this.basicInfoForm.get('nationalId')?.value,
    academicYear: this.basicInfoForm.get('academicYear')?.value,
    birthDate: this.basicInfoForm.get('birthDate')?.value,
    gender: genderEnum,
    address: this.basicInfoForm.get('address')?.value,
    isActive: this.basicInfoForm.get('isActive')?.value,
    contacts: contactsList,
    certificates: this.getCertificatesList().map(cert => ({
      certificateName: cert.certificateName,
      certificateNumber: cert.certificateNumber,
      courseId: cert.courseId,
      issueDate: cert.issueDate,
      grade: cert.grade
    })),
    healthConditions: this.getHealthConditionsList(),
    imageUrl: imageUrl
  };
  
  console.log('Submitting trainee data:', formData);
  
  if (this.isEditMode && this.traineeId) {
    this.traineeService.updateTrainee(this.traineeId, formData as any).subscribe({
      next: () => {
        this.notification.showSuccess('تم تحديث المتدرب بنجاح');
        this.dialogRef.close(true);
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('Update error:', err);
        this.notification.showError(err.error?.messageEn || 'حدث خطأ في تحديث المتدرب');
        this.isSubmitting = false;
      }
    });
  } else {
    this.traineeService.createTrainee(formData as any).subscribe({
      next: () => {
        this.notification.showSuccess('تم إضافة المتدرب بنجاح');
        this.dialogRef.close(true);
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('Create error:', err);
        this.notification.showError(err.error?.messageEn || 'حدث خطأ في إضافة المتدرب');
        this.isSubmitting = false;
      }
    });
  }
}

}