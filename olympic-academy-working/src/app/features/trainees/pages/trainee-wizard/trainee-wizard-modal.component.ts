// trainee-wizard-modal.component.ts

import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatDialog } from '@angular/material/dialog';
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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { TraineeService } from '../../../../core/services/trainee.service';
import { CourseService } from '../../../../core/services/course.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { FileService } from '../../../../core/services/file.service';
import { FileDomain } from '../../../../core/models/file.model';
import { FileUploadComponent } from '../../../../shared/components/file-upload/file-upload.component';
import { TraineeContactDTO } from '../../../../core/models/trainee.model';
import { EnrollmentWizardModalComponent } from '../../../enrollments/pages/enrollment-wizard/enrollment-wizard-modal.component';

// ============ HELPER FUNCTIONS ============

function mapGenderToEnum(gender: any): string | null {
  if (!gender) return null;
  
  if (typeof gender === 'string') {
    const normalized = gender.trim();
    if (normalized === 'انثي' || normalized === 'أنثى' || 
        normalized === 'FEMALE' || normalized === 'female' ||
        normalized === 'FEMALE' || normalized === '2') {
      return 'FEMALE';
    }
    if (normalized === 'ذكر' || normalized === 'MALE' || normalized === 'male' || normalized === '1') {
      return 'MALE';
    }
    return null;
  }
  
  if (typeof gender === 'object') {
    if (gender.title) {
      const title = gender.title.trim();
      if (title === 'انثي' || title === 'أنثى' || title === 'FEMALE' || title === 'female') {
        return 'FEMALE';
      }
      if (title === 'ذكر' || title === 'MALE' || title === 'male') {
        return 'MALE';
      }
    }
    if (gender.value) {
      const value = gender.value.trim();
      if (value === 'FEMALE' || value === 'female' || value === 'انثي' || value === 'أنثى') {
        return 'FEMALE';
      }
      if (value === 'MALE' || value === 'male' || value === 'ذكر') {
        return 'MALE';
      }
    }
    if (gender.id !== undefined) {
      if (gender.id === 1 || gender.id === '1') return 'MALE';
      if (gender.id === 2 || gender.id === '2') return 'FEMALE';
    }
    return null;
  }
  
  return null;
}

function mapAcademicYearToEnum(academicYear: any): string | null {
  if (!academicYear) return null;
  
  if (typeof academicYear === 'string') {
    const normalized = academicYear.trim();
    if (normalized === '1' || normalized === '_1') return '_1';
    if (normalized === '2' || normalized === '_2') return '_2';
    if (normalized === '3' || normalized === '_3') return '_3';
    if (normalized === '4' || normalized === '_4') return '_4';
    return null;
  }
  
  if (typeof academicYear === 'object' && academicYear.title) {
    const title = academicYear.title.trim();
    if (title === '1' || title === '_1') return '_1';
    if (title === '2' || title === '_2') return '_2';
    if (title === '3' || title === '_3') return '_3';
    if (title === '4' || title === '_4') return '_4';
    return null;
  }
  
  return null;
}

function mapContactTypeToEnum(contactType: any): string | null {
  if (!contactType) return null;
  
  if (typeof contactType === 'string') {
    const normalized = contactType.trim().toLowerCase();
    if (normalized === 'email' || normalized === 'بريد إلكتروني') return 'EMAIL';
    if (normalized === 'phone' || normalized === 'جوال' || normalized === 'هاتف') return 'PHONE';
    return null;
  }
  
  if (typeof contactType === 'object' && contactType.title) {
    const title = contactType.title.trim().toLowerCase();
    if (title === 'email' || title === 'بريد إلكتروني') return 'EMAIL';
    if (title === 'phone' || title === 'جوال' || title === 'هاتف') return 'PHONE';
    return null;
  }
  
  return null;
}

// ============ COMPONENT ============

interface EnumMapping {
  id: number;
  title: string;
  enumName: string;
}

export interface TraineeWizardData {
  traineeId?: number;
  traineeData?: any;
}

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
    MatTooltipModule,
    MatSlideToggleModule,
    FileUploadComponent
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
                <!-- Image Upload using FileUploadComponent -->
                <div class="image-upload-section">
                  <label class="upload-label">صورة المتدرب</label>
                  <app-file-upload
                    [domainId]="FileDomain.TRAINEE"
                    [acceptedTypes]="'image/jpeg,image/png,image/jpg'"
                    [maxSizeMB]="2"
                    [label]="'اضغط لرفع صورة المتدرب'"
                    (fileUploaded)="onImageUploaded($event)"
                    (fileRemoved)="onImageRemoved()">
                  </app-file-upload>
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
                    <mat-select formControlName="academicYear">
                      <mat-option [value]="null">لا يوجد</mat-option>
                      <mat-option *ngFor="let year of academicYearOptions" [value]="year.enumName">
                        {{ year.title }}
                      </mat-option>
                    </mat-select>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>تاريخ الميلاد</mat-label>
                    <input matInput [matDatepicker]="birthPicker" formControlName="birthDate">
                    <mat-datepicker-toggle matSuffix [for]="birthPicker"></mat-datepicker-toggle>
                    <mat-datepicker #birthPicker></mat-datepicker>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>الجنس</mat-label>
                    <mat-select formControlName="gender">
                      <mat-option [value]="null">لا يوجد</mat-option>
                      <mat-option *ngFor="let gender of genderOptions" [value]="gender.enumName">
                        {{ gender.title }}
                      </mat-option>
                    </mat-select>
                  </mat-form-field>

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
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>نوع جهة الاتصال</mat-label>
                      <mat-select formControlName="contactType">
                        <mat-option *ngFor="let type of contactTypeOptions" [value]="type.enumName">
                          {{ type.title }}
                        </mat-option>
                      </mat-select>
                      <mat-error *ngIf="contact.get('contactType')?.hasError('required')">النوع مطلوب</mat-error>
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="contact-value">
                      <mat-label>القيمة</mat-label>
                      <input matInput formControlName="contactValue" placeholder="مثال: 05xxxxxxxx">
                      <mat-error *ngIf="contact.get('contactValue')?.hasError('required')">القيمة مطلوبة</mat-error>
                    </mat-form-field>

                    <button mat-icon-button color="warn" (click)="removeContact(i)" type="button" matTooltip="حذف" *ngIf="contactsArray.length > 1">
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
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>اسم الشهادة</mat-label>
                      <input matInput formControlName="certificateName">
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>رقم الشهادة</mat-label>
                      <input matInput formControlName="certificateNumber">
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>الدورة</mat-label>
                      <mat-select formControlName="courseId">
                        <mat-option [value]="null">لا يوجد</mat-option>
                        <mat-option *ngFor="let course of courseOptions" [value]="course.value">
                          {{ course.label }}
                        </mat-option>
                      </mat-select>
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>تاريخ الإصدار</mat-label>
                      <input matInput [matDatepicker]="issuePicker" formControlName="issueDate">
                      <mat-datepicker-toggle matSuffix [for]="issuePicker"></mat-datepicker-toggle>
                      <mat-datepicker #issuePicker></mat-datepicker>
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="full-width">
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
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>العنوان</mat-label>
                      <input matInput formControlName="title">
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>الوصف</mat-label>
                      <input matInput formControlName="description">
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>العلاج</mat-label>
                      <input matInput formControlName="medication">
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="full-width">
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
                    <div><strong>السنة الدراسية:</strong> {{ getAcademicYearTitle(basicInfoForm.get('academicYear')?.value) || '-' }}</div>
                    <div><strong>تاريخ الميلاد:</strong> {{ basicInfoForm.get('birthDate')?.value | date:'dd/MM/yyyy' }}</div>
                    <div><strong>الجنس:</strong> {{ getGenderTitle(basicInfoForm.get('gender')?.value) || '-' }}</div>
                    <div><strong>العنوان:</strong> {{ basicInfoForm.get('address')?.value || '-' }}</div>
                    <div *ngIf="isEditMode"><strong>الحالة:</strong> {{ basicInfoForm.get('isActive')?.value ? 'نشط' : 'غير نشط' }}</div>
                  </div>
                </mat-card>

                <mat-card class="summary-card" *ngIf="getContactsList().length > 0">
                  <mat-card-title>جهات الاتصال</mat-card-title>
                  <div class="contacts-summary">
                    <div *ngFor="let contact of getContactsList()" class="summary-item">
                      <strong>{{ getContactTypeTitle(contact.contactType) }}:</strong> {{ contact.contactValue }}
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

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }

    .full-width {
      width: 100%;
    }

    .image-upload-section {
      margin-bottom: 24px;
      padding: 16px;
      background: white;
      border-radius: 16px;
      border: 1px solid #e5e7eb;
    }

    .upload-label {
      display: block;
      margin-bottom: 12px;
      font-weight: 500;
      color: #374151;
    }

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

    .add-contact-btn, .add-cert-btn, .add-condition-btn {
      margin-top: 16px;
    }

    .certificate-row, .condition-row {
      display: grid;
      grid-template-columns: 1fr 1fr 1.5fr 1fr 1fr auto;
      gap: 12px;
      align-items: center;
      margin-bottom: 16px;
    }

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

    /* Fix for mat-select dropdown in dialog */
    ::ng-deep .mat-select-panel {
      background: white !important;
      max-height: 300px !important;
      min-width: 200px !important;
    }

    ::ng-deep .mat-select-panel .mat-option {
      padding: 0 16px !important;
      height: 48px !important;
    }

    ::ng-deep .mat-select-panel .mat-option:hover {
      background: #f3f4f6 !important;
    }

    ::ng-deep .mat-select-panel .mat-option.mat-selected {
      background: #dbeafe !important;
      color: #1e40af !important;
    }

    /* Fix for datepicker in dialog */
    ::ng-deep .mat-datepicker-popup {
      z-index: 10000 !important;
    }

    @media (max-width: 768px) {
      .wizard-container {
        min-width: 90vw;
        max-width: 90vw;
      }
      .form-grid {
        grid-template-columns: 1fr;
      }
      .contact-row, .certificate-row, .condition-row {
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
  
  genderOptions: EnumMapping[] = [];
  contactTypeOptions: EnumMapping[] = [];
  academicYearOptions: EnumMapping[] = [];
  courseOptions: { value: number; label: string }[] = [];
  
  traineeImageFid: string | null = null;
  createdTraineeId: number | null = null;
  
  isLoading = false;
  isSubmitting = false;
  isEditMode = false;
  traineeId: number | null = null;
  traineeData: any = null;
  
  FileDomain = FileDomain;
  
  get contactsArray() { return this.contactsForm.get('contacts') as FormArray; }
  get certificatesArray() { return this.certificatesForm.get('certificates') as FormArray; }
  get healthConditionsArray() { return this.healthConditionsForm.get('healthConditions') as FormArray; }

  constructor(
    private dialogRef: MatDialogRef<TraineeWizardModalComponent>,
    @Inject(MAT_DIALOG_DATA) private data: TraineeWizardData,
    private fb: FormBuilder,
    private traineeService: TraineeService,
    private courseService: CourseService,
    private notification: NotificationService,
    private fileService: FileService,
    private dialog: MatDialog
  ) {
    this.isEditMode = !!data?.traineeId;
    this.traineeId = data?.traineeId || null;
    this.traineeData = data?.traineeData || null;
    
    console.log('🔍 TraineeWizardModal - Constructor:');
    console.log('  isEditMode:', this.isEditMode);
    console.log('  traineeId:', this.traineeId);
    console.log('  traineeData:', this.traineeData ? '✅ Has data' : '❌ No data');
    
    this.basicInfoForm = this.fb.group({
      fullName: ['', Validators.required],
      nationalId: ['', Validators.required],
      academicYear: [null],
      birthDate: [''],
      gender: [null],
      address: [''],
      isActive: [true]
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
    
    // If edit mode, load the trainee data
    if (this.isEditMode) {
      this.loadTraineeData();
    }
  }

  loadSelectOptions(): void {
    this.genderOptions = [
      { id: 1, title: 'ذكر', enumName: 'MALE' },
      { id: 2, title: 'انثي', enumName: 'FEMALE' }
    ];

    this.contactTypeOptions = [
      { id: 1, title: 'بريد إلكتروني', enumName: 'EMAIL' },
      { id: 2, title: 'جوال', enumName: 'PHONE' }
    ];

    this.academicYearOptions = [
      { id: 1, title: '1', enumName: '_1' },
      { id: 2, title: '2', enumName: '_2' },
      { id: 3, title: '3', enumName: '_3' },
      { id: 4, title: '4', enumName: '_4' }
    ];
  }

  loadCourses(): void {
    this.courseService.getAllCoursesLookup().subscribe({
      next: (res: any) => {
        this.courseOptions = (res.list || []).map((c: any) => ({ value: c.id, label: c.title }));
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل الدورات');
      }
    });
  }

  loadTraineeData(): void {
    this.isLoading = true;
    
    // If we have trainee data passed directly, use it
    if (this.traineeData) {
      console.log('✅ Using passed trainee data');
      this.patchTraineeData(this.traineeData);
      this.isLoading = false;
      return;
    }
    
    // Fallback: Load from API if no data passed
    console.log('🔄 Loading trainee from API');
    this.traineeService.getTraineeById(this.traineeId!).subscribe({
      next: (t: any) => {
        console.log('✅ Trainee loaded from API');
        this.patchTraineeData(t);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Error loading trainee data:', err);
        this.notification.showError('حدث خطأ في تحميل بيانات المتدرب');
        this.isLoading = false;
      }
    });
  }

  private patchTraineeData(t: any): void {
    console.log('📋 Patching trainee data:', t);
    
    const genderEnum = mapGenderToEnum(t.gender);
    const academicYearEnum = mapAcademicYearToEnum(t.academicYear);
    
    console.log('  Gender mapped to:', genderEnum);
    console.log('  Academic Year mapped to:', academicYearEnum);
    
    // Patch the form
    this.basicInfoForm.patchValue({
      fullName: t.fullName || '',
      nationalId: t.nationalId || '',
      academicYear: academicYearEnum,
      birthDate: t.birthDate || null,
      gender: genderEnum,
      address: t.address || '',
      isActive: t.isActive !== undefined ? t.isActive : true
    });
    
    console.log('📝 Form values after patch:', this.basicInfoForm.value);
    
    if (t.imageUrl) {
      this.traineeImageFid = t.imageUrl;
    }
    
    // Load contacts
    if (t.contacts && t.contacts.length > 0) {
      while (this.contactsArray.length) this.contactsArray.removeAt(0);
      t.contacts.forEach((c: any) => {
        const contactTypeEnum = mapContactTypeToEnum(c.contactType);
        this.contactsArray.push(this.fb.group({
          contactType: [contactTypeEnum, Validators.required],
          contactValue: [c.contactValue, Validators.required]
        }));
      });
    }
    
    // Load certificates
    if (t.certificates && t.certificates.length > 0) {
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
    if (t.healthConditions && t.healthConditions.length > 0) {
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
  }

  getGenderTitle(enumName: string | null): string | null {
    if (!enumName) return null;
    const found = this.genderOptions.find(g => g.enumName === enumName);
    return found ? found.title : null;
  }

  getAcademicYearTitle(enumName: string | null): string | null {
    if (!enumName) return null;
    const found = this.academicYearOptions.find(y => y.enumName === enumName);
    return found ? found.title : null;
  }

  getContactTypeTitle(enumName: string | null): string | null {
    if (!enumName) return null;
    const found = this.contactTypeOptions.find(c => c.enumName === enumName);
    return found ? found.title : null;
  }

  onImageUploaded(fid: string): void {
    this.traineeImageFid = fid;
    this.notification.showSuccess('تم رفع الصورة بنجاح');
  }

  onImageRemoved(): void {
    this.traineeImageFid = null;
    this.notification.showSuccess('تم حذف الصورة');
  }

  addContact(): void {
    this.contactsArray.push(this.fb.group({
      contactType: [null, Validators.required],
      contactValue: ['', Validators.required]
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
    const contacts = this.contactsArray.value;
    return contacts.filter((c: any) => c.contactType && c.contactValue && c.contactValue.trim() !== '');
  }

  getCertificatesList(): any[] {
    return this.certificatesArray.value.filter((c: any) => c.certificateName && c.certificateName.trim() !== '');
  }

  getHealthConditionsList(): any[] {
    return this.healthConditionsArray.value.filter((h: any) => h.title && h.title.trim() !== '');
  }

  async printPreview(): Promise<void> {
    let imagePreviewUrl: string | null = null;
    
    if (this.traineeImageFid) {
      try {
        const blob = await this.fileService.downloadFile(this.traineeImageFid).toPromise();
        if (blob) {
          imagePreviewUrl = URL.createObjectURL(blob);
        }
      } catch (error) {
        console.error('Failed to load image for preview:', error);
        this.notification.showWarning('تعذر تحميل الصورة للطباعة');
      }
    }
    
    const previewData = {
      fullName: this.basicInfoForm.get('fullName')?.value,
      nationalId: this.basicInfoForm.get('nationalId')?.value,
      academicYear: this.getAcademicYearTitle(this.basicInfoForm.get('academicYear')?.value),
      birthDate: this.basicInfoForm.get('birthDate')?.value,
      gender: this.getGenderTitle(this.basicInfoForm.get('gender')?.value),
      address: this.basicInfoForm.get('address')?.value,
      isActive: this.basicInfoForm.get('isActive')?.value,
      contacts: this.getContactsList(),
      certificates: this.getCertificatesList(),
      healthConditions: this.getHealthConditionsList(),
      imageUrl: imagePreviewUrl,
      isNewTrainee: !this.isEditMode,
      id: this.traineeId || 'جديد'
    };
    
    this.generatePrintDocument(previewData);
    
    if (imagePreviewUrl) {
      setTimeout(() => {
        if (imagePreviewUrl) {
          URL.revokeObjectURL(imagePreviewUrl);
        }
      }, 1000);
    }
  }

  generatePrintDocument(data: any): void {
    const printWindow = window.open('', '_blank', 'width=800,height=800,scrollbars=yes');
    if (!printWindow) {
      this.notification.showError('تعذر فتح نافذة الطباعة');
      return;
    }
    
    const today = new Date().toLocaleDateString('ar-EG');
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>ملف متدرب - ${this.escapeHtml(data.fullName) || 'جديد'}</title>
        <style>
          * { font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif; }
          @media print { body { margin: 0; padding: 20px; } .no-print { display: none; } }
          .profile-container { max-width: 800px; margin: 0 auto; background: white; direction: rtl; }
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
            <div class="info-item"><div class="info-label">الاسم الكامل</div><div class="info-value">${this.escapeHtml(data.fullName) || '-'}</div></div>
            <div class="info-item"><div class="info-label">رقم الهوية</div><div class="info-value">${this.escapeHtml(data.nationalId) || '-'}</div></div>
            <div class="info-item"><div class="info-label">تاريخ الميلاد</div><div class="info-value">${data.birthDate ? new Date(data.birthDate).toLocaleDateString('ar-EG') : '-'}</div></div>
            <div class="info-item"><div class="info-label">الجنس</div><div class="info-value">${data.gender || '-'}</div></div>
            <div class="info-item"><div class="info-label">السنة الدراسية</div><div class="info-value">${this.escapeHtml(data.academicYear) || '-'}</div></div>
            <div class="info-item"><div class="info-label">العنوان</div><div class="info-value">${this.escapeHtml(data.address) || '-'}</div></div>
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
    `);
    
    printWindow.document.close();
    this.notification.showSuccess('تم فتح نموذج الطلب - يمكنك طباعته للحصول على التوقيعات');
  }

  private escapeHtml(str: string | null | undefined): string {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  private openEnrollmentWizard(traineeId: number): void {
    this.dialogRef.close(true);
    setTimeout(() => {
      const enrollmentDialogRef = this.dialog.open(EnrollmentWizardModalComponent, {
        width: '900px',
        maxWidth: '90vw',
        data: { traineeId: traineeId }
      });
      enrollmentDialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.notification.showSuccess('تم إضافة التسجيل بنجاح');
        }
      });
    }, 300);
  }

  submitTrainee(): void {
    if (this.basicInfoForm.invalid) {
      this.notification.showWarning('يرجى تعبئة جميع الحقول المطلوبة');
      return;
    }
    
    this.isSubmitting = true;
    
    const genderValue = this.basicInfoForm.get('gender')?.value;
    const academicYearValue = this.basicInfoForm.get('academicYear')?.value;
    
    const contactsList = this.getContactsList().map(contact => ({
      contactType: contact.contactType,
      contactValue: contact.contactValue
    }));
    
    const formData = {
      fullName: this.basicInfoForm.get('fullName')?.value,
      nationalId: this.basicInfoForm.get('nationalId')?.value,
      academicYear: academicYearValue,
      birthDate: this.basicInfoForm.get('birthDate')?.value,
      gender: genderValue,
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
      imageUrl: this.traineeImageFid
    };
    
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
        next: (res: any) => {
          this.createdTraineeId = res.id;
          
          if (contactsList.length > 0 && this.createdTraineeId) {
            this.addContactsSequentially(this.createdTraineeId, contactsList);
          } else {
            this.isSubmitting = false;
            this.notification.showSuccess('تم إضافة المتدرب بنجاح');
            if (this.createdTraineeId) {
              this.openEnrollmentWizard(this.createdTraineeId);
            } else {
              this.dialogRef.close(true);
            }
          }
        },
        error: (err) => {
          console.error('Create error:', err);
          this.notification.showError(err.error?.messageEn || 'حدث خطأ في إضافة المتدرب');
          this.isSubmitting = false;
        }
      });
    }
  }

  private addContactsSequentially(traineeId: number, contacts: any[]): void {
    let completed = 0;
    const total = contacts.length;
    let hasError = false;

    contacts.forEach((contact, index) => {
      const contactDTO: TraineeContactDTO = {
        contactType: contact.contactType as any,
        contactValue: contact.contactValue
      };

      this.traineeService.createTraineeContact(traineeId, contactDTO).subscribe({
        next: () => {
          completed++;
          if (completed === total && !hasError) {
            this.isSubmitting = false;
            this.notification.showSuccess(`تم إضافة المتدرب و ${total} جهة اتصال بنجاح`);
            if (traineeId) {
              this.openEnrollmentWizard(traineeId);
            } else {
              this.dialogRef.close(true);
            }
          }
        },
        error: (err) => {
          console.error(`Error adding contact ${index + 1}:`, err);
          hasError = true;
          this.notification.showError(`حدث خطأ في إضافة جهة الاتصال ${index + 1}`);
          this.isSubmitting = false;
        }
      });
    });
  }
}