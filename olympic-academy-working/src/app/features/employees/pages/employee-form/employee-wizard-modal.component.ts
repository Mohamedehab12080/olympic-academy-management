// employee-wizard-modal.component.ts - COMPLETE WORKING VERSION WITH CONTACT CREATION FIXED

import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
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
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Subject, finalize } from 'rxjs';

import { EmployeeService } from '../../../../core/services/employee.service';
import { DepartmentService } from '../../../../core/services/department.service';
import { CourseService } from '../../../../core/services/course.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { FileService } from '../../../../core/services/file.service';
import { FileDomain } from '../../../../core/models/file.model';
import { FileUploadComponent } from '../../../../shared/components/file-upload/file-upload.component';
import { 
  EMPLOYEE_TYPES, 
  EmployeeType,
  AssignDepartmentDTO, 
  AssignCourseDTO,
  EmployeeVTO,
  EmployeeContactVTO,
  TrainerDepartmentVTO,
  TrainerCourseVTO
} from '../../../../core/models/employee.model';
import { GENDERS, SALARY_TYPES, CONTACT_TYPES, Gender, ContactType, SalaryType } from '../../../../core/models/common.model';

// ============================================================
// INTERFACES
// ============================================================

interface DepartmentAssignment {
  id: number;
  title: string;
  assigned: boolean;
  assignmentId?: number;
}

interface CourseAssignment {
  id: number;
  title: string;
  assigned: boolean;
  assignmentId?: number;
}

// ============================================================
// COMPONENT
// ============================================================

@Component({
  selector: 'app-employee-wizard-modal',
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
    MatTableModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    FileUploadComponent
  ],
  template: `
    <div class="wizard-container" dir="rtl">
      <!-- Header -->
      <div class="wizard-header">
        <div class="header-title">
          <mat-icon>{{ isEditMode ? 'edit' : 'person_add' }}</mat-icon>
          <h2>{{ isEditMode ? 'تعديل موظف' : 'إضافة موظف جديد' }}</h2>
        </div>
        <div class="header-actions">
          <button mat-icon-button (click)="printPreview()" matTooltip="معاينة الطباعة" *ngIf="!isLoading">
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
                  <label class="upload-label">صورة الموظف</label>
                  <app-file-upload
                    [domainId]="FileDomain.EMPLOYEE"
                    [acceptedTypes]="'image/jpeg,image/png,image/jpg'"
                    [maxSizeMB]="2"
                    [label]="'اضغط لرفع صورة الموظف'"
                    (fileUploaded)="onImageUploaded($event)"
                    (fileRemoved)="onImageRemoved()">
                  </app-file-upload>
                </div>

                <div class="form-grid">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>الاسم الكامل *</mat-label>
                    <input matInput formControlName="fullName" placeholder="أدخل الاسم الكامل">
                    <mat-error *ngIf="basicInfoForm.get('fullName')?.hasError('required')">الاسم مطلوب</mat-error>
                    <mat-error *ngIf="basicInfoForm.get('fullName')?.hasError('minlength')">الاسم يجب أن يكون على الأقل 3 أحرف</mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>رقم الهوية *</mat-label>
                    <input matInput formControlName="nationalId" placeholder="أدخل رقم الهوية">
                    <mat-error *ngIf="basicInfoForm.get('nationalId')?.hasError('required')">رقم الهوية مطلوب</mat-error>
                    <mat-error *ngIf="basicInfoForm.get('nationalId')?.hasError('pattern')">رقم الهوية يجب أن يحتوي على أرقام فقط</mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>تاريخ الميلاد</mat-label>
                    <input matInput [matDatepicker]="birthPicker" formControlName="birthDate" placeholder="اختر تاريخ الميلاد">
                    <mat-datepicker-toggle matSuffix [for]="birthPicker"></mat-datepicker-toggle>
                    <mat-datepicker #birthPicker></mat-datepicker>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>الجنس</mat-label>
                    <mat-select formControlName="gender">
                      <mat-option [value]="null">اختر الجنس</mat-option>
                      <mat-option *ngFor="let gender of genderOptions" [value]="gender.value">
                        {{ gender.label }}
                      </mat-option>
                    </mat-select>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>نوع الموظف *</mat-label>
                    <mat-select formControlName="employeeType">
                      <mat-option [value]="null">اختر نوع الموظف</mat-option>
                      <mat-option *ngFor="let type of employeeTypeOptions" [value]="type.value">
                        {{ type.label }}
                      </mat-option>
                    </mat-select>
                    <mat-error *ngIf="basicInfoForm.get('employeeType')?.hasError('required')">نوع الموظف مطلوب</mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>تاريخ التوظيف</mat-label>
                    <input matInput [matDatepicker]="hirePicker" formControlName="hireDate" placeholder="اختر تاريخ التوظيف">
                    <mat-datepicker-toggle matSuffix [for]="hirePicker"></mat-datepicker-toggle>
                    <mat-datepicker #hirePicker></mat-datepicker>
                  </mat-form-field>

                  <!-- Status Toggle - Only visible in Edit Mode -->
                  <div class="full-width status-toggle" *ngIf="isEditMode">
                    <mat-slide-toggle 
                      [color]="'primary'"
                      [checked]="basicInfoForm.get('isActive')?.value"
                      (change)="basicInfoForm.get('isActive')?.setValue($event.checked)">
                      <div class="toggle-label">
                        <mat-icon>account_circle</mat-icon>
                        <span>حالة الموظف</span>
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

          <!-- Step 2: Financial Information -->
          <mat-step [stepControl]="financialForm">
            <ng-template matStepLabel>
              <div class="step-label">
                <mat-icon>attach_money</mat-icon>
                <span>المعلومات المالية</span>
              </div>
            </ng-template>
            <div class="step-content">
              <form [formGroup]="financialForm">
                <div class="financial-cards">
                  <mat-card class="financial-card">
                    <mat-card-content>
                      <div class="form-field">
                        <mat-form-field appearance="outline" class="full-width">
                          <mat-label>الراتب الأساسي</mat-label>
                          <input matInput type="number" formControlName="salary" placeholder="أدخل الراتب">
                          <span matSuffix>جم</span>
                        </mat-form-field>
                      </div>
                    </mat-card-content>
                  </mat-card>

                  <mat-card class="financial-card warning">
                    <mat-card-content>
                      <div class="form-field">
                        <mat-form-field appearance="outline" class="full-width">
                          <mat-label>الراتب المتبقي</mat-label>
                          <input matInput type="number" formControlName="remainedSalary" placeholder="أدخل الراتب المتبقي">
                          <span matSuffix>جم</span>
                        </mat-form-field>
                      </div>
                    </mat-card-content>
                  </mat-card>

                  <mat-card class="financial-card info">
                    <mat-card-content>
                      <div class="form-field">
                        <mat-form-field appearance="outline" class="full-width">
                          <mat-label>نوع الراتب</mat-label>
                          <mat-select formControlName="salaryType">
                            <mat-option [value]="null">اختر نوع الراتب</mat-option>
                            <mat-option *ngFor="let type of salaryTypeOptions" [value]="type.value">
                              {{ type.label }}
                            </mat-option>
                          </mat-select>
                        </mat-form-field>
                      </div>
                    </mat-card-content>
                  </mat-card>
                </div>
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

          <!-- Step 3: Departments Assignment -->
          <mat-step [stepControl]="departmentsForm">
            <ng-template matStepLabel>
              <div class="step-label">
                <mat-icon>business</mat-icon>
                <span>الأقسام</span>
              </div>
            </ng-template>
            <div class="step-content">
              <div class="step-header">
                <div class="step-header-icon">🏢</div>
                <div class="step-header-text">
                  <h3>إسناد الأقسام</h3>
                  <p>اختر الأقسام التي سينتمي إليها الموظف</p>
                </div>
              </div>

              <form [formGroup]="departmentsForm">
                <div class="selection-grid">
                  <div *ngFor="let dept of departmentAssignments" class="selection-item">
                    <mat-checkbox 
                      [checked]="dept.assigned"
                      (change)="toggleDepartment(dept, $event.checked)"
                      [disabled]="isSubmitting">
                      {{ dept.title }}
                    </mat-checkbox>
                    <span class="assignment-status" *ngIf="isEditMode && dept.assigned && dept.assignmentId">
                      <mat-icon class="assigned-icon">check_circle</mat-icon>
                    </span>
                  </div>
                </div>
                
                <div class="selected-items" *ngIf="getSelectedDepartments().length > 0">
                  <label>الأقسام المختارة ({{ getSelectedDepartments().length }}):</label>
                  <div class="items-chips">
                    <mat-chip *ngFor="let dept of getSelectedDepartments()" (removed)="removeDepartment(dept)">
                      {{ dept.title }}
                      <mat-icon matChipRemove>cancel</mat-icon>
                    </mat-chip>
                  </div>
                </div>
                <div class="no-selection" *ngIf="getSelectedDepartments().length === 0">
                  <mat-icon>info</mat-icon>
                  <span>لم يتم اختيار أي قسم</span>
                </div>
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

          <!-- Step 4: Courses Assignment -->
          <mat-step [stepControl]="coursesForm">
            <ng-template matStepLabel>
              <div class="step-label">
                <mat-icon>school</mat-icon>
                <span>الدورات</span>
              </div>
            </ng-template>
            <div class="step-content">
              <div class="step-header">
                <div class="step-header-icon">📚</div>
                <div class="step-header-text">
                  <h3>إسناد الدورات</h3>
                  <p>اختر الدورات التي سيدرسها الموظف (للمدربين فقط)</p>
                </div>
              </div>

              <div class="info-banner" *ngIf="!isTrainer">
                <mat-icon>info</mat-icon>
                <span>إسناد الدورات متاح فقط للمدربين</span>
              </div>

              <form [formGroup]="coursesForm">
                <div class="selection-grid" *ngIf="isTrainer">
                  <div *ngFor="let course of courseAssignments" class="selection-item">
                    <mat-checkbox 
                      [checked]="course.assigned"
                      (change)="toggleCourse(course, $event.checked)"
                      [disabled]="isSubmitting">
                      {{ course.title }}
                    </mat-checkbox>
                    <span class="assignment-status" *ngIf="isEditMode && course.assigned && course.assignmentId">
                      <mat-icon class="assigned-icon">check_circle</mat-icon>
                    </span>
                  </div>
                </div>
                
                <div class="selected-items" *ngIf="getSelectedCourses().length > 0 && isTrainer">
                  <label>الدورات المختارة ({{ getSelectedCourses().length }}):</label>
                  <div class="items-chips">
                    <mat-chip *ngFor="let course of getSelectedCourses()" (removed)="removeCourse(course)">
                      {{ course.title }}
                      <mat-icon matChipRemove>cancel</mat-icon>
                    </mat-chip>
                  </div>
                </div>
                <div class="no-selection" *ngIf="isTrainer && getSelectedCourses().length === 0">
                  <mat-icon>info</mat-icon>
                  <span>لم يتم اختيار أي دورة</span>
                </div>
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

          <!-- Step 5: Contacts -->
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
                        <mat-option [value]="null">اختر النوع</mat-option>
                        <mat-option *ngFor="let type of contactTypeOptions" [value]="type.value">
                          {{ type.label }}
                        </mat-option>
                      </mat-select>
                      <mat-error *ngIf="contact.get('contactType')?.hasError('required')">النوع مطلوب</mat-error>
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="contact-value">
                      <mat-label>القيمة</mat-label>
                      <input matInput formControlName="contactValue" placeholder="مثال: 05xxxxxxxx أو example@email.com">
                      <mat-error *ngIf="contact.get('contactValue')?.hasError('required')">القيمة مطلوبة</mat-error>
                    </mat-form-field>

                    <div class="contact-actions">
                      <button mat-icon-button color="warn" (click)="removeContact(i)" type="button" matTooltip="حذف" [disabled]="contactsArray.length <= 1">
                        <mat-icon>delete</mat-icon>
                      </button>
                      <span class="contact-status" *ngIf="isEditMode && contact.get('id')?.value">
                        <mat-icon class="status-icon existing" matTooltip="جهة اتصال حالية">check_circle</mat-icon>
                      </span>
                      <span class="contact-status" *ngIf="isEditMode && !contact.get('id')?.value">
                        <mat-icon class="status-icon new" matTooltip="جهة اتصال جديدة">add_circle</mat-icon>
                      </span>
                      <span class="contact-status" *ngIf="isEditMode && contact.get('id')?.value && contact.get('isModified')?.value">
                        <mat-icon class="status-icon modified" matTooltip="تم التعديل">edit</mat-icon>
                      </span>
                    </div>
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

          <!-- Step 6: Summary & Submit -->
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
                    <div><strong>تاريخ الميلاد:</strong> {{ basicInfoForm.get('birthDate')?.value | date:'dd/MM/yyyy' }}</div>
                    <div><strong>الجنس:</strong> {{ basicInfoForm.get('gender')?.value?.title || '-' }}</div>
                    <div><strong>نوع الموظف:</strong> {{ basicInfoForm.get('employeeType')?.value?.title || '-' }}</div>
                    <div><strong>تاريخ التوظيف:</strong> {{ basicInfoForm.get('hireDate')?.value | date:'dd/MM/yyyy' }}</div>
                    <div *ngIf="isEditMode"><strong>الحالة:</strong> {{ basicInfoForm.get('isActive')?.value ? 'نشط' : 'غير نشط' }}</div>
                  </div>
                </mat-card>

                <mat-card class="summary-card">
                  <mat-card-title>المعلومات المالية</mat-card-title>
                  <div class="summary-grid">
                    <div><strong>الراتب:</strong> {{ financialForm.get('salary')?.value | currency:'EGP' }}</div>
                    <div><strong>الراتب المتبقي:</strong> {{ financialForm.get('remainedSalary')?.value | currency:'EGP' }}</div>
                    <div><strong>نوع الراتب:</strong> {{ financialForm.get('salaryType')?.value?.title || '-' }}</div>
                  </div>
                </mat-card>

                <mat-card class="summary-card" *ngIf="getSelectedDepartments().length > 0">
                  <mat-card-title>الأقسام ({{ getSelectedDepartments().length }})</mat-card-title>
                  <div class="items-chips">
                    <mat-chip *ngFor="let dept of getSelectedDepartments()">{{ dept.title }}</mat-chip>
                  </div>
                </mat-card>

                <mat-card class="summary-card" *ngIf="getSelectedCourses().length > 0 && isTrainer">
                  <mat-card-title>الدورات ({{ getSelectedCourses().length }})</mat-card-title>
                  <div class="items-chips">
                    <mat-chip *ngFor="let course of getSelectedCourses()">{{ course.title }}</mat-chip>
                  </div>
                </mat-card>

                <mat-card class="summary-card" *ngIf="getContactsList().length > 0">
                  <mat-card-title>جهات الاتصال ({{ getContactsList().length }})</mat-card-title>
                  <div class="contacts-summary">
                    <div *ngFor="let contact of getContactsList()" class="summary-item">
                      <strong>{{ contact.contactType?.title || 'جهة اتصال' }}:</strong> {{ contact.contactValue }}
                      <span class="contact-action-badge" *ngIf="isEditMode && contact.id">
                        <mat-icon class="existing-badge" matTooltip="موجود">check_circle</mat-icon>
                      </span>
                      <span class="contact-action-badge" *ngIf="isEditMode && !contact.id">
                        <mat-icon class="new-badge" matTooltip="جديد">add_circle</mat-icon>
                      </span>
                    </div>
                  </div>
                </mat-card>
              </div>
            </div>
            <div class="step-actions">
              <button mat-stroked-button matStepperPrevious>
                <mat-icon>arrow_forward</mat-icon> السابق
              </button>
              <button mat-raised-button color="primary" (click)="submitEmployee()" [disabled]="isSubmitting">
                <mat-spinner diameter="20" *ngIf="isSubmitting"></mat-spinner>
                <span *ngIf="!isSubmitting">{{ isEditMode ? 'تحديث' : 'تأكيد الإضافة' }}</span>
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
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
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
      color: #f59e0b;
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

    .financial-cards {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }

    .financial-card {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: white;
    }

    .financial-card.warning {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    }

    .financial-card.info {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    }

    .contact-row {
      display: grid;
      grid-template-columns: 200px 1fr auto;
      gap: 16px;
      align-items: center;
      margin-bottom: 16px;
      padding: 12px 16px;
      background: white;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
      transition: border-color 0.3s;
    }

    .contact-row:hover {
      border-color: #f59e0b;
    }

    .contact-value {
      width: 100%;
    }

    .contact-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .contact-status {
      display: flex;
      align-items: center;
    }

    .status-icon {
      font-size: 20px;
    }

    .status-icon.existing {
      color: #10b981;
    }

    .status-icon.new {
      color: #3b82f6;
    }

    .status-icon.modified {
      color: #f59e0b;
    }

    .add-contact-btn {
      margin-top: 16px;
    }

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

    .selection-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 12px;
      margin-bottom: 20px;
      padding: 16px;
      background: white;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
    }

    .selection-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 8px;
      transition: background 0.2s;
    }

    .selection-item:hover {
      background: #f8fafc;
    }

    .assignment-status {
      display: flex;
      align-items: center;
    }

    .assigned-icon {
      color: #10b981;
      font-size: 16px;
    }

    .selected-items {
      margin-top: 16px;
    }

    .selected-items label {
      font-weight: 600;
      color: #374151;
      margin-bottom: 8px;
      display: block;
    }

    .items-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .no-selection {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px;
      background: #f9fafb;
      border-radius: 8px;
      color: #9ca3af;
      font-size: 13px;
    }

    .no-selection mat-icon {
      color: #d1d5db;
    }

    .info-banner {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: #fef3c7;
      border-radius: 12px;
      border: 1px solid #fcd34d;
      color: #92400e;
      margin-bottom: 20px;
    }

    .info-banner mat-icon {
      color: #f59e0b;
    }

    .summary-section {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .summary-section h3 {
      margin: 0;
      font-size: 20px;
      font-weight: 700;
      color: #1f2937;
    }

    .summary-card {
      padding: 16px;
    }

    .summary-card mat-card-title {
      font-size: 16px;
      font-weight: 600;
      color: #f59e0b;
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
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .contact-action-badge {
      display: inline-flex;
      align-items: center;
    }

    .existing-badge {
      color: #10b981;
      font-size: 16px;
    }

    .new-badge {
      color: #3b82f6;
      font-size: 16px;
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

    @media (max-width: 768px) {
      .wizard-container {
        min-width: 90vw;
        max-width: 90vw;
      }
      .form-grid {
        grid-template-columns: 1fr;
      }
      .financial-cards {
        grid-template-columns: 1fr;
      }
      .contact-row {
        grid-template-columns: 1fr;
      }
      .step-actions {
        flex-direction: column;
      }
      .step-actions button {
        width: 100%;
        justify-content: center;
      }
      .selection-grid {
        grid-template-columns: 1fr;
      }
      .summary-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class EmployeeWizardModalComponent implements OnInit, OnDestroy {
  @ViewChild('stepper') stepper!: MatStepper;
  
  // Form Groups
  basicInfoForm: FormGroup;
  financialForm: FormGroup;
  departmentsForm: FormGroup;
  coursesForm: FormGroup;
  contactsForm: FormGroup;
  
  // Department and Course assignments
  departmentAssignments: DepartmentAssignment[] = [];
  courseAssignments: CourseAssignment[] = [];
  allCourses: any[] = [];
  
  // Options
  genderOptions: any[] = [];
  employeeTypeOptions: any[] = [];
  salaryTypeOptions: any[] = [];
  contactTypeOptions: any[] = [];
  
  // State
  employeeImageFid: string | null = null;
  isLoading = false;
  isSubmitting = false;
  isEditMode = false;
  employeeId: number | null = null;
  isTrainer: boolean = false;
  
  // Contact tracking
  private deletedContactIds: number[] = [];
  private destroy$ = new Subject<void>();
  
  FileDomain = FileDomain;
  
  // Getters
  get contactsArray() { return this.contactsForm.get('contacts') as FormArray; }
  get selectedDepartments(): DepartmentAssignment[] {
    return this.departmentAssignments.filter(d => d.assigned);
  }
  get selectedCourses(): CourseAssignment[] {
    return this.courseAssignments.filter(c => c.assigned);
  }

  constructor(
    private dialogRef: MatDialogRef<EmployeeWizardModalComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { employeeId?: number; employeeData?: any },
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private courseService: CourseService,
    private notification: NotificationService,
    private fileService: FileService,
    private cdr: ChangeDetectorRef
  ) {
    this.isEditMode = !!data?.employeeId;
    this.employeeId = data?.employeeId || null;
    
    // Initialize forms
    this.basicInfoForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      nationalId: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      birthDate: [''],
      gender: [null],
      employeeType: [null, Validators.required],
      hireDate: [''],
      isActive: [true]
    });
    
    this.financialForm = this.fb.group({
      salary: [null],
      remainedSalary: [null],
      salaryType: [null]
    });
    
    this.departmentsForm = this.fb.group({});
    this.coursesForm = this.fb.group({});
    
    this.contactsForm = this.fb.group({
      contacts: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadSelectOptions();
    this.loadDepartments();
    this.loadCourses();
    this.addContact();
    
    // Watch for employee type changes
    this.basicInfoForm.get('employeeType')?.valueChanges.subscribe((type) => {
      this.isTrainer = type?.id === 1;
      if (!this.isTrainer) {
        this.courseAssignments.forEach(c => c.assigned = false);
        this.coursesForm.updateValueAndValidity();
      }
      this.cdr.detectChanges();
    });
    
    if (this.isEditMode && this.employeeId) {
      this.loadEmployeeData();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ============================================================
  // LOADING METHODS
  // ============================================================

  loadSelectOptions(): void {
    this.genderOptions = GENDERS.map(g => ({ value: g, label: g.title }));
    this.employeeTypeOptions = EMPLOYEE_TYPES.map(t => ({ value: t, label: t.title }));
    this.salaryTypeOptions = SALARY_TYPES.map(s => ({ value: s, label: s.title }));
    this.contactTypeOptions = CONTACT_TYPES.map(c => ({ value: c, label: c.title }));
  }

  loadDepartments(): void {
    this.departmentService.getAllDepartmentsLookup().subscribe({
      next: (res: any) => {
        const departments = res.list || [];
        this.departmentAssignments = departments.map((d: any) => ({
          id: d.id,
          title: d.title,
          assigned: false,
          assignmentId: undefined
        }));
        this.cdr.detectChanges();
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل الأقسام');
      }
    });
  }

  loadCourses(): void {
    this.courseService.getAllCoursesLookup().subscribe({
      next: (res: any) => {
        this.allCourses = res.list || [];
        this.courseAssignments = this.allCourses.map((c: any) => ({
          id: c.id,
          title: c.title,
          assigned: false,
          assignmentId: undefined
        }));
        this.cdr.detectChanges();
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل الدورات');
      }
    });
  }

  // ============================================================
  // EMPLOYEE DATA LOADING
  // ============================================================

  loadEmployeeData(): void {
    this.isLoading = true;
    this.employeeService.getEmployeeById(this.employeeId!).subscribe({
      next: (emp: EmployeeVTO) => {
        console.log('📋 Loading employee data:', emp);
        
        // Map gender
        let genderObj: Gender | null = null;
        if (emp.gender && emp.gender.id) {
          genderObj = GENDERS.find(g => g.id === emp.gender?.id) || null;
        }
        
        // Map employee type
        let employeeTypeObj: EmployeeType | null = null;
        if (emp.employeeType && emp.employeeType.id) {
          employeeTypeObj = EMPLOYEE_TYPES.find(t => t.id === emp.employeeType.id) || null;
          this.isTrainer = emp.employeeType.id === 1;
        }
        
        // Map salary type
        let salaryTypeObj: SalaryType | null = null;
        if (emp.salaryType && emp.salaryType.id) {
          salaryTypeObj = SALARY_TYPES.find(s => s.id === emp.salaryType?.id) || null;
        }
        
        // Patch basic info
        this.basicInfoForm.patchValue({
          fullName: emp.fullName || '',
          nationalId: emp.nationalId || '',
          birthDate: emp.birthDate || '',
          gender: genderObj,
          employeeType: employeeTypeObj,
          hireDate: emp.hireDate || '',
          isActive: emp.isActive !== undefined ? emp.isActive : true
        });
        
        // Patch financial info
        this.financialForm.patchValue({
          salary: emp.salary || null,
          remainedSalary: emp.remainedSalary || null,
          salaryType: salaryTypeObj
        });
        
        // ============================================================
        // LOAD DEPARTMENTS
        // ============================================================
        this.loadTrainerDepartmentAssignments(emp);
        
        // ============================================================
        // LOAD COURSES
        // ============================================================
        this.loadTrainerCourseAssignments(emp);
        
        // ============================================================
        // LOAD CONTACTS
        // ============================================================
        this.loadContacts(emp.contacts || []);
        
        // Set image
        if (emp.imageUrl) {
          this.employeeImageFid = emp.imageUrl;
        }
        
        this.cdr.detectChanges();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Error loading employee:', err);
        this.notification.showError('حدث خطأ في تحميل بيانات الموظف');
        this.isLoading = false;
      }
    });
  }

  // ============================================================
  // LOAD TRAINER DEPARTMENT ASSIGNMENTS
  // ============================================================

  private loadTrainerDepartmentAssignments(emp: EmployeeVTO): void {
    if (emp.departments && emp.departments.length > 0) {
      const deptMap = new Map<number, number>();
      emp.departments.forEach((d: any) => {
        deptMap.set(d.id, d.id);
      });
      
      this.departmentAssignments.forEach(dept => {
        if (deptMap.has(dept.id)) {
          dept.assigned = true;
        }
      });
    }
    
    if (emp.employeeType?.id === 1) {
      this.employeeService.getTrainerDepartments({ trainerId: emp.id, pageSize: 100 }).subscribe({
        next: (res: any) => {
          const items = res.items || [];
          items.forEach((item: any) => {
            const deptId = item.department?.id;
            if (deptId) {
              const assignment = this.departmentAssignments.find(d => d.id === deptId);
              if (assignment) {
                assignment.assigned = true;
                assignment.assignmentId = item.id;
              }
            }
          });
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error loading trainer department assignments:', err);
        }
      });
    }
  }

  // ============================================================
  // LOAD TRAINER COURSE ASSIGNMENTS
  // ============================================================

  private loadTrainerCourseAssignments(emp: EmployeeVTO): void {
    if (emp.courses && emp.courses.length > 0) {
      const courseMap = new Map<number, number>();
      emp.courses.forEach((c: any) => {
        courseMap.set(c.id, c.id);
      });
      
      this.courseAssignments.forEach(course => {
        if (courseMap.has(course.id)) {
          course.assigned = true;
        }
      });
    }
    
    if (emp.employeeType?.id === 1) {
      this.employeeService.getTrainerCourses({ trainerId: emp.id, pageSize: 100 }).subscribe({
        next: (res: any) => {
          const items = res.items || [];
          items.forEach((item: any) => {
            const courseId = item.course?.id;
            if (courseId) {
              const assignment = this.courseAssignments.find(c => c.id === courseId);
              if (assignment) {
                assignment.assigned = true;
                assignment.assignmentId = item.id;
              }
            }
          });
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error loading trainer course assignments:', err);
        }
      });
    }
  }

  // ============================================================
  // CONTACT LOADING
  // ============================================================

  private loadContacts(contacts: EmployeeContactVTO[]): void {
    while (this.contactsArray.length) {
      this.contactsArray.removeAt(0);
    }
    
    if (contacts && contacts.length > 0) {
      contacts.forEach((c: EmployeeContactVTO) => {
        let contactTypeObj: ContactType | null = null;
        if (c.contactType && c.contactType.id) {
          contactTypeObj = CONTACT_TYPES.find(ct => ct.id === c.contactType.id) || null;
        }
        
        this.contactsArray.push(this.fb.group({
          id: [c.id],
          contactType: [contactTypeObj, Validators.required],
          contactValue: [c.contactValue || '', Validators.required],
          isNew: [false],
          isDeleted: [false],
          isModified: [false],
          originalValue: [c.contactValue || ''],
          originalType: [contactTypeObj]
        }));
      });
    } else {
      this.addContact();
    }
  }

  // ============================================================
  // IMAGE HANDLING
  // ============================================================

  onImageUploaded(fid: string): void {
    this.employeeImageFid = fid;
    this.notification.showSuccess('تم رفع الصورة بنجاح');
  }

  onImageRemoved(): void {
    this.employeeImageFid = null;
    this.notification.showSuccess('تم حذف الصورة');
  }

  // ============================================================
  // EMPLOYEE TYPE HANDLING
  // ============================================================

  onEmployeeTypeChange(type: EmployeeType | null): void {
    this.isTrainer = type?.id === 1;
    if (!this.isTrainer) {
      this.courseAssignments.forEach(c => c.assigned = false);
      this.coursesForm.updateValueAndValidity();
    }
    this.cdr.detectChanges();
  }

  // ============================================================
  // DEPARTMENT MANAGEMENT
  // ============================================================

  toggleDepartment(dept: DepartmentAssignment, checked: boolean): void {
    dept.assigned = checked;
    if (!checked) {
      dept.assignmentId = undefined;
    }
    this.departmentsForm.updateValueAndValidity();
    this.cdr.detectChanges();
  }

  removeDepartment(dept: DepartmentAssignment): void {
    dept.assigned = false;
    dept.assignmentId = undefined;
    this.departmentsForm.updateValueAndValidity();
    this.cdr.detectChanges();
  }

  getSelectedDepartments(): DepartmentAssignment[] {
    return this.departmentAssignments.filter(d => d.assigned);
  }

  // ============================================================
  // COURSE MANAGEMENT
  // ============================================================

  toggleCourse(course: CourseAssignment, checked: boolean): void {
    course.assigned = checked;
    if (!checked) {
      course.assignmentId = undefined;
    }
    this.coursesForm.updateValueAndValidity();
    this.cdr.detectChanges();
  }

  removeCourse(course: CourseAssignment): void {
    course.assigned = false;
    course.assignmentId = undefined;
    this.coursesForm.updateValueAndValidity();
    this.cdr.detectChanges();
  }

  getSelectedCourses(): CourseAssignment[] {
    return this.courseAssignments.filter(c => c.assigned);
  }

  // ============================================================
  // CONTACTS MANAGEMENT - FULL CRUD
  // ============================================================

  addContact(): void {
    const contactGroup = this.fb.group({
      id: [null],
      contactType: [null, Validators.required],
      contactValue: ['', Validators.required],
      isNew: [true],
      isDeleted: [false],
      isModified: [false],
      originalValue: [''],
      originalType: [null]
    });
    
    this.contactsArray.push(contactGroup);
    this.cdr.detectChanges();
  }

  removeContact(index: number): void {
    const contactGroup = this.contactsArray.at(index);
    const contactId = contactGroup.get('id')?.value;
    
    if (contactId) {
      contactGroup.patchValue({ 
        isDeleted: true,
        isModified: false
      });
      this.deletedContactIds.push(contactId);
      this.contactsArray.removeAt(index);
    } else {
      this.contactsArray.removeAt(index);
    }
    
    this.cdr.detectChanges();
  }

  getContactsList(): any[] {
    const contacts = this.contactsArray.value;
    return contacts.filter((c: any) => 
      c.contactType && 
      c.contactValue && 
      c.contactValue.trim() !== '' &&
      !c.isDeleted
    );
  }

  /**
   * Map ContactType object to enum string for API
   * IMPORTANT: 
   * - id: 1 = 'ايميل' -> 'EMAIL'
   * - id: 2 = 'هاتف' -> 'PHONE'
   */
  private mapContactTypeToEnum(contactType: ContactType | null): string {
    if (!contactType) {
      return 'PHONE';
    }
    if (contactType.id === 1) {
      return 'EMAIL';
    }
    if (contactType.id === 2) {
      return 'PHONE';
    }
    return 'PHONE';
  }

  /**
   * Create contacts for a given employee
   */
  private createContactsForEmployee(employeeId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const contacts = this.getContactsList();
      
      if (contacts.length === 0) {
        console.log('ℹ️ No contacts to create');
        resolve();
        return;
      }
      
      console.log(`📋 Creating ${contacts.length} contacts for employee ${employeeId}`);
      
      const createOperations = contacts.map((contact: any) => {
        const contactDTO = {
          contactType: this.mapContactTypeToEnum(contact.contactType),
          contactValue: contact.contactValue
        };
        console.log(`  Creating contact: Type=${contact.contactType?.title} (id=${contact.contactType?.id}) -> ${contactDTO.contactType}, Value=${contactDTO.contactValue}`);
        return this.employeeService.createEmployeeContact(employeeId, contactDTO).toPromise();
      });
      
      Promise.all(createOperations)
        .then(() => {
          console.log(`✅ All ${contacts.length} contacts created successfully`);
          resolve();
        })
        .catch((error) => {
          console.error('❌ Error creating contacts:', error);
          reject(error);
        });
    });
  }

  /**
   * Process contacts for submission (Edit Mode)
   */
  private processContacts(employeeId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const contacts = this.contactsArray.value;
      
      const contactsToCreate = contacts.filter((c: any) => 
        c.contactType && 
        c.contactValue && 
        c.contactValue.trim() !== '' &&
        !c.isDeleted &&
        !c.id
      );
      
      const contactsToUpdate = contacts.filter((c: any) => 
        c.contactType && 
        c.contactValue && 
        c.contactValue.trim() !== '' &&
        !c.isDeleted &&
        c.id &&
        (c.isModified ||
         c.contactValue !== c.originalValue ||
         c.contactType?.id !== c.originalType?.id)
      );
      
      const contactsToDelete = this.deletedContactIds;
      
      console.log('📋 Contact processing summary (Edit Mode):');
      console.log('  New contacts to create:', contactsToCreate.length);
      console.log('  Existing contacts to update:', contactsToUpdate.length);
      console.log('  Contacts to delete:', contactsToDelete.length);
      
      const createOperations = contactsToCreate.map((contact: any) => {
        const contactDTO = {
          contactType: this.mapContactTypeToEnum(contact.contactType),
          contactValue: contact.contactValue
        };
        return this.employeeService.createEmployeeContact(employeeId, contactDTO).toPromise();
      });
      
      const updateOperations = contactsToUpdate.map((contact: any) => {
        const contactDTO = {
          contactType: this.mapContactTypeToEnum(contact.contactType),
          contactValue: contact.contactValue
        };
        return this.employeeService.updateEmployeeContact(employeeId, contact.id, contactDTO).toPromise();
      });
      
      const deleteOperations = contactsToDelete.map((contactId: number) => {
        return this.employeeService.deleteEmployeeContact(employeeId, contactId).toPromise();
      });
      
      const allOperations = [...createOperations, ...updateOperations, ...deleteOperations];
      
      if (allOperations.length === 0) {
        resolve();
        return;
      }
      
      Promise.all(allOperations)
        .then(() => {
          console.log('✅ All contact operations completed successfully');
          resolve();
        })
        .catch((error) => {
          console.error('❌ Error processing contacts:', error);
          reject(error);
        });
    });
  }

  // ============================================================
  // PRINT METHODS
  // ============================================================

  private escapeHtml(str: string | null | undefined): string {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  async printPreview(): Promise<void> {
    let imagePreviewUrl: string | null = null;
    
    if (this.employeeImageFid) {
      try {
        const blob = await this.fileService.downloadFile(this.employeeImageFid).toPromise();
        if (blob) {
          imagePreviewUrl = URL.createObjectURL(blob);
        }
      } catch (error) {
        console.error('Failed to load image for print:', error);
      }
    }
    
    const previewData = {
      fullName: this.basicInfoForm.get('fullName')?.value || '-',
      nationalId: this.basicInfoForm.get('nationalId')?.value || '-',
      birthDate: this.basicInfoForm.get('birthDate')?.value,
      gender: this.basicInfoForm.get('gender')?.value,
      employeeType: this.basicInfoForm.get('employeeType')?.value,
      hireDate: this.basicInfoForm.get('hireDate')?.value,
      salary: this.financialForm.get('salary')?.value,
      remainedSalary: this.financialForm.get('remainedSalary')?.value,
      salaryType: this.financialForm.get('salaryType')?.value,
      departments: this.getSelectedDepartments(),
      courses: this.getSelectedCourses(),
      contacts: this.getContactsList(),
      imageUrl: imagePreviewUrl,
      isNewEmployee: !this.isEditMode,
      isActive: this.basicInfoForm.get('isActive')?.value
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
    
    let departmentsHtml = '';
    if (data.departments && data.departments.length > 0) {
      departmentsHtml = data.departments.map((d: any) => `<span class="dept-chip">${d.title}</span>`).join('');
    }
    
    let coursesHtml = '';
    if (data.courses && data.courses.length > 0) {
      coursesHtml = data.courses.map((c: any) => `<span class="course-chip">${c.title}</span>`).join('');
    }
    
    let contactsHtml = '';
    if (data.contacts && data.contacts.length > 0) {
      contactsHtml = data.contacts.map((c: any) => `
        <div class="contact-item">
          <span class="contact-type">${c.contactType?.title || 'جهة اتصال'}:</span>
          <span>${c.contactValue}</span>
        </div>
      `).join('');
    }
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>طلب توظيف - ${this.escapeHtml(data.fullName) || 'جديد'}</title>
        <style>
          * { font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif; }
          @media print { body { margin: 0; padding: 20px; } .no-print { display: none; } }
          .application-container { max-width: 800px; margin: 0 auto; background: white; direction: rtl; }
          .header { text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; border-radius: 12px; }
          .header h1 { margin: 0; font-size: 24px; }
          .header p { margin: 10px 0 0 0; font-size: 12px; opacity: 0.9; }
          .application-details { display: flex; justify-content: space-between; margin-bottom: 20px; padding: 10px; background: #f9fafb; border-radius: 8px; }
          .photo-section { text-align: center; margin-bottom: 20px; }
          .employee-photo { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 3px solid #f59e0b; }
          .placeholder-photo { width: 120px; height: 120px; border-radius: 50%; background: #f3f4f6; display: flex; align-items: center; justify-content: center; margin: 0 auto; border: 3px solid #f59e0b; font-size: 48px; }
          h2 { color: #f59e0b; border-bottom: 2px solid #f59e0b; padding-bottom: 8px; margin-top: 24px; margin-bottom: 16px; font-size: 18px; }
          .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 16px; }
          .info-item { border-bottom: 1px solid #e5e7eb; padding: 8px 0; }
          .info-label { font-weight: 600; color: #374151; font-size: 13px; margin-bottom: 4px; }
          .info-value { color: #1f2937; font-size: 14px; }
          .info-value.amount { font-weight: 700; color: #f59e0b; }
          .contacts-list { display: flex; flex-direction: column; gap: 8px; margin-top: 8px; }
          .contact-item { display: flex; gap: 8px; padding: 6px 0; border-bottom: 1px solid #f3f4f6; }
          .contact-type { font-weight: 600; color: #f59e0b; min-width: 100px; }
          .dept-chip, .course-chip { display: inline-block; background: #f3f4f6; padding: 4px 12px; border-radius: 20px; font-size: 12px; margin: 2px; }
          .signature-section { margin-top: 40px; display: flex; justify-content: space-between; align-items: flex-end; gap: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
          .signature-box { text-align: center; flex: 1; }
          .signature-line { width: 100%; border-top: 1px solid #000; margin-top: 40px; padding-top: 8px; }
          .footer { text-align: center; margin-top: 30px; padding: 16px; font-size: 10px; color: #9ca3af; border-top: 1px solid #e5e7eb; }
          .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); opacity: 0.1; font-size: 60px; white-space: nowrap; pointer-events: none; }
          @media print { .watermark { display: none; } }
        </style>
      </head>
      <body>
        ${data.isNewEmployee ? '<div class="watermark">مسودة - غير معتمد</div>' : ''}
        <div class="application-container">
          <div class="header">
            <h1>طلب توظيف</h1>
            <p>نظام إدارة الأكاديمية الأولمبية</p>
          </div>
          <div class="application-details">
            <div><strong>رقم الطلب:</strong> ${data.isNewEmployee ? 'جديد' : '#' + this.employeeId}</div>
            <div><strong>تاريخ الطباعة:</strong> ${today}</div>
          </div>
          <div class="photo-section">
            ${data.imageUrl ? `<img src="${data.imageUrl}" class="employee-photo">` : '<div class="placeholder-photo">📷</div>'}
          </div>
          <h2>📋 المعلومات الشخصية</h2>
          <div class="info-grid">
            <div class="info-item"><div class="info-label">الاسم الكامل</div><div class="info-value">${this.escapeHtml(data.fullName) || '-'}</div></div>
            <div class="info-item"><div class="info-label">رقم الهوية</div><div class="info-value">${this.escapeHtml(data.nationalId) || '-'}</div></div>
            <div class="info-item"><div class="info-label">تاريخ الميلاد</div><div class="info-value">${data.birthDate ? new Date(data.birthDate).toLocaleDateString('ar-EG') : '-'}</div></div>
            <div class="info-item"><div class="info-label">الجنس</div><div class="info-value">${data.gender?.title || '-'}</div></div>
            <div class="info-item"><div class="info-label">نوع الموظف</div><div class="info-value">${data.employeeType?.title || '-'}</div></div>
            <div class="info-item"><div class="info-label">تاريخ التوظيف</div><div class="info-value">${data.hireDate ? new Date(data.hireDate).toLocaleDateString('ar-EG') : '-'}</div></div>
            ${!data.isNewEmployee ? `<div class="info-item"><div class="info-label">الحالة</div><div class="info-value">${data.isActive ? 'نشط' : 'غير نشط'}</div></div>` : ''}
          </div>
          
          <h2>💰 المعلومات المالية</h2>
          <div class="info-grid">
            <div class="info-item"><div class="info-label">الراتب</div><div class="info-value amount">${data.salary || 0} جم</div></div>
            <div class="info-item"><div class="info-label">الراتب المتبقي</div><div class="info-value">${data.remainedSalary || 0} جم</div></div>
            <div class="info-item"><div class="info-label">نوع الراتب</div><div class="info-value">${data.salaryType?.title || '-'}</div></div>
          </div>
          
          ${data.departments && data.departments.length > 0 ? `
            <h2>🏢 الأقسام (${data.departments.length})</h2>
            <div>${departmentsHtml}</div>
          ` : ''}
          
          ${data.courses && data.courses.length > 0 ? `
            <h2>📚 الدورات (${data.courses.length})</h2>
            <div>${coursesHtml}</div>
          ` : ''}
          
          ${data.contacts && data.contacts.length > 0 ? `
            <h2>📞 جهات الاتصال (${data.contacts.length})</h2>
            <div class="contacts-list">${contactsHtml}</div>
          ` : ''}
          
          <div class="signature-section">
            <div class="signature-box"><div class="signature-line"></div><div>توقيع الموظف</div></div>
            <div class="signature-box"><div class="signature-line"></div><div>توقيع مدير الموارد البشرية</div></div>
            <div class="signature-box"><div class="signature-line"></div><div>ختم الأكاديمية</div></div>
          </div>
          <div class="footer">تم التصدير من نظام إدارة الأكاديمية الأولمبية</div>
        </div>
        <div class="no-print" style="text-align: center; margin-top: 20px;">
          <button onclick="window.print();" style="padding: 10px 20px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; border: none; border-radius: 5px; cursor: pointer;">🖨️ طباعة / حفظ كـ PDF</button>
        </div>
      </body>
      </html>
    `);
    
    printWindow.document.close();
    this.notification.showSuccess('تم فتح نموذج الطلب - يمكنك طباعته للحصول على التوقيعات');
  }

  // ============================================================
  // SUBMIT METHODS
  // ============================================================

  submitEmployee(): void {
    if (this.basicInfoForm.invalid) {
      this.notification.showWarning('يرجى تعبئة جميع الحقول المطلوبة بشكل صحيح');
      this.basicInfoForm.markAllAsTouched();
      return;
    }
    
    this.isSubmitting = true;
    
    const genderObj = this.basicInfoForm.get('gender')?.value;
    const employeeTypeObj = this.basicInfoForm.get('employeeType')?.value;
    const salaryTypeObj = this.financialForm.get('salaryType')?.value;
    
    const genderEnum = genderObj ? (genderObj.id === 1 ? 'MALE' : 'FEMALE') : null;
    const employeeTypeEnum = employeeTypeObj ? (employeeTypeObj.id === 1 ? 'TRAINER' : 'MANAGER') : null;
    
    let salaryTypeEnum = null;
    if (salaryTypeObj) {
      switch(salaryTypeObj.id) {
        case 1: salaryTypeEnum = 'MONTHLY'; break;
        case 2: salaryTypeEnum = 'HOURLY'; break;
        case 3: salaryTypeEnum = 'DAILY'; break;
        case 4: salaryTypeEnum = 'PERCENTAGE'; break;
        default: salaryTypeEnum = 'MONTHLY';
      }
    }
    
    const selectedDepartmentIds = this.getSelectedDepartments().map(d => d.id);
    const selectedCourseIds = this.getSelectedCourses().map(c => c.id);
    
    if (this.isEditMode && this.employeeId) {
      // ============================================================
      // EDIT MODE
      // ============================================================
      
      const employeeUpdateData: any = {
        fullName: this.basicInfoForm.get('fullName')?.value,
        nationalId: this.basicInfoForm.get('nationalId')?.value,
        birthDate: this.basicInfoForm.get('birthDate')?.value,
        gender: genderEnum,
        employeeType: employeeTypeEnum,
        salary: this.financialForm.get('salary')?.value ? Number(this.financialForm.get('salary')?.value) : null,
        remainedSalary: this.financialForm.get('remainedSalary')?.value ? Number(this.financialForm.get('remainedSalary')?.value) : null,
        salaryType: salaryTypeEnum,
        hireDate: this.basicInfoForm.get('hireDate')?.value,
        departmentIds: selectedDepartmentIds,
        imageUrl: this.employeeImageFid,
        isActive: this.basicInfoForm.get('isActive')?.value
      };
      
      console.log('📤 Updating employee:', employeeUpdateData);
      
      this.employeeService.updateEmployee(this.employeeId, employeeUpdateData)
        .pipe(finalize(() => {
          this.isSubmitting = false;
        }))
        .subscribe({
          next: () => {
            console.log('✅ Employee updated successfully');
            this.processContacts(this.employeeId!)
              .then(() => {
                console.log('✅ Contacts processed successfully');
                this.handleDepartmentAssignments(this.employeeId!, this.departmentAssignments);
              })
              .catch((error) => {
                console.error('❌ Error processing contacts:', error);
                this.notification.showError('حدث خطأ في تحديث جهات الاتصال');
                this.handleDepartmentAssignments(this.employeeId!, this.departmentAssignments);
              });
          },
          error: (err) => {
            console.error('❌ Update error:', err);
            this.notification.showError(err.error?.messageEn || 'حدث خطأ في تحديث الموظف');
          }
        });
    } else {
      // ============================================================
      // CREATE MODE - Create employee first without contacts
      // ============================================================
      
      // Remove contacts from the payload - they will be created separately
      const formData: any = {
        fullName: this.basicInfoForm.get('fullName')?.value,
        nationalId: this.basicInfoForm.get('nationalId')?.value,
        birthDate: this.basicInfoForm.get('birthDate')?.value,
        gender: genderEnum,
        employeeType: employeeTypeEnum,
        salary: this.financialForm.get('salary')?.value ? Number(this.financialForm.get('salary')?.value) : null,
        remainedSalary: this.financialForm.get('remainedSalary')?.value ? Number(this.financialForm.get('remainedSalary')?.value) : null,
        salaryType: salaryTypeEnum,
        hireDate: this.basicInfoForm.get('hireDate')?.value,
        departmentIds: selectedDepartmentIds,
        imageUrl: this.employeeImageFid
      };
      
      console.log('📤 Creating employee (without contacts):', formData);
      
      this.employeeService.createEmployee(formData)
        .pipe(finalize(() => {
          this.isSubmitting = false;
        }))
        .subscribe({
          next: (res: any) => {
            const newEmployeeId = res.id;
            console.log('✅ Employee created with ID:', newEmployeeId);
            
            // Now create contacts using the new employee ID
            this.createContactsForEmployee(newEmployeeId)
              .then(() => {
                console.log('✅ All contacts created successfully');
                
                // Assign departments for the new employee
                if (selectedDepartmentIds.length > 0) {
                  this.assignDepartmentsToEmployee(newEmployeeId, selectedDepartmentIds);
                }
                
                // Assign courses if trainer
                if (this.isTrainer && selectedCourseIds.length > 0) {
                  this.assignCoursesToEmployee(newEmployeeId, selectedCourseIds);
                }
                
                this.notification.showSuccess('تم إضافة الموظف وجميع البيانات بنجاح');
                this.dialogRef.close(true);
              })
              .catch((error) => {
                console.error('❌ Error creating contacts:', error);
                this.notification.showError('تم إضافة الموظف ولكن حدث خطأ في إضافة جهات الاتصال');
                // Still close the dialog since employee was created
                this.dialogRef.close(true);
              });
          },
          error: (err) => {
            console.error('❌ Create error:', err);
            this.notification.showError(err.error?.messageEn || 'حدث خطأ في إضافة الموظف');
          }
        });
    }
  }

  // ============================================================
  // ASSIGN DEPARTMENTS TO EMPLOYEE (Create Mode)
  // ============================================================

  private assignDepartmentsToEmployee(employeeId: number, departmentIds: number[]): void {
    const data: AssignDepartmentDTO = { departmentId: departmentIds };
    this.employeeService.assignDepartmentToTrainer(employeeId, data).subscribe({
      next: (res: any) => {
        console.log(`✅ ${departmentIds.length} departments assigned to employee ${employeeId}`, res);
        if (res && Array.isArray(res)) {
          res.forEach((result: any, index: number) => {
            if (result && result.id) {
              const deptId = departmentIds[index];
              const assignment = this.departmentAssignments.find(d => d.id === deptId);
              if (assignment) {
                assignment.assignmentId = result.id;
              }
            }
          });
        }
      },
      error: (err) => {
        console.error('❌ Error assigning departments:', err);
        this.notification.showError('حدث خطأ في إسناد الأقسام للموظف');
      }
    });
  }

  // ============================================================
  // ASSIGN COURSES TO EMPLOYEE (Create Mode)
  // ============================================================

  private assignCoursesToEmployee(employeeId: number, courseIds: number[]): void {
    courseIds.forEach(courseId => {
      const data: AssignCourseDTO = { courseId: courseId };
      this.employeeService.assignCourseToTrainer(employeeId, data).subscribe({
        next: (res: any) => {
          console.log(`✅ Course ${courseId} assigned to employee ${employeeId}`, res);
        },
        error: (err) => {
          console.error(`❌ Error assigning course ${courseId}:`, err);
        }
      });
    });
  }

  // ============================================================
  // DEPARTMENT ASSIGNMENT HANDLING (Edit Mode)
  // ============================================================

  private handleDepartmentAssignments(employeeId: number, assignments: DepartmentAssignment[]): void {
    this.employeeService.getTrainerDepartments({ trainerId: employeeId, pageSize: 100 }).subscribe({
      next: (res: any) => {
        const currentAssignments = res.items || [];
        
        const currentDeptMap = new Map<number, number>();
        currentAssignments.forEach((a: TrainerDepartmentVTO) => {
          const deptId = a.department?.id;
          if (deptId) {
            currentDeptMap.set(deptId, a.id);
          }
        });
        
        const selectedDeptIds = assignments.filter(a => a.assigned).map(a => a.id);
        
        const toUnassign: number[] = [];
        currentDeptMap.forEach((trainerDeptId, deptId) => {
          if (!selectedDeptIds.includes(deptId)) {
            toUnassign.push(trainerDeptId);
          }
        });
        
        const toAssign = selectedDeptIds.filter(deptId => !currentDeptMap.has(deptId));
        
        console.log('📋 Department changes - To unassign:', toUnassign, 'To assign:', toAssign);
        
        if (toUnassign.length === 0 && toAssign.length === 0) {
          console.log('ℹ️ No department changes needed');
          this.handleCourseAssignments(employeeId, this.courseAssignments);
          return;
        }
        
        let completed = 0;
        const total = toUnassign.length + (toAssign.length > 0 ? 1 : 0);
        let hasError = false;
        let errors: string[] = [];
        
        if (toUnassign.length > 0) {
          toUnassign.forEach(trainerDeptId => {
            console.log(`🗑️ Unassigning department (trainerDeptId: ${trainerDeptId})`);
            this.employeeService.unassignDepartmentFromTrainer(trainerDeptId).subscribe({
              next: () => {
                completed++;
                console.log(`✅ Department unassigned`);
                this.checkDepartmentCompletion(completed, total, employeeId, hasError, errors);
              },
              error: (err) => {
                console.error(`❌ Error unassigning department:`, err);
                hasError = true;
                errors.push(`فشل إلغاء إسناد القسم: ${err.error?.messageEn || 'خطأ غير معروف'}`);
                completed++;
                this.checkDepartmentCompletion(completed, total, employeeId, hasError, errors);
              }
            });
          });
        }
        
        if (toAssign.length > 0) {
          console.log(`📌 Assigning ${toAssign.length} departments to employee ${employeeId}`);
          const data: AssignDepartmentDTO = { departmentId: toAssign };
          this.employeeService.assignDepartmentToTrainer(employeeId, data).subscribe({
            next: (res: any) => {
              completed++;
              console.log(`✅ Departments assigned successfully`);
              if (res && Array.isArray(res)) {
                res.forEach((result: any, index: number) => {
                  if (result && result.id) {
                    const deptId = toAssign[index];
                    const assignment = assignments.find(a => a.id === deptId);
                    if (assignment) {
                      assignment.assignmentId = result.id;
                    }
                  }
                });
              }
              this.checkDepartmentCompletion(completed, total, employeeId, hasError, errors);
            },
            error: (err) => {
              console.error(`❌ Error assigning departments:`, err);
              hasError = true;
              errors.push(`فشل إسناد الأقسام: ${err.error?.messageEn || 'خطأ غير معروف'}`);
              completed++;
              this.checkDepartmentCompletion(completed, total, employeeId, hasError, errors);
            }
          });
        } else {
          if (toUnassign.length === 0) {
            this.checkDepartmentCompletion(0, 0, employeeId, hasError, errors);
          }
        }
      },
      error: (err) => {
        console.error('❌ Error fetching current department assignments:', err);
        this.notification.showError('حدث خطأ في تحميل أقسام الموظف');
        this.handleCourseAssignments(employeeId, this.courseAssignments);
      }
    });
  }

  private checkDepartmentCompletion(completed: number, total: number, employeeId: number, hasError: boolean, errors: string[]): void {
    if (completed === total) {
      if (hasError) {
        this.notification.showWarning('تم تحديث الموظف مع بعض الأخطاء في إسناد الأقسام: ' + errors.join('; '));
      }
      this.handleCourseAssignments(employeeId, this.courseAssignments);
    }
  }

  // ============================================================
  // COURSE ASSIGNMENT HANDLING (Edit Mode)
  // ============================================================

  private handleCourseAssignments(employeeId: number, assignments: CourseAssignment[]): void {
    if (!this.isTrainer) {
      console.log('ℹ️ Employee is not a trainer, skipping course assignments');
      this.finalizeSubmit();
      return;
    }
    
    this.employeeService.getTrainerCourses({ trainerId: employeeId, pageSize: 100 }).subscribe({
      next: (res: any) => {
        const currentAssignments = res.items || [];
        
        const currentCourseMap = new Map<number, number>();
        currentAssignments.forEach((a: TrainerCourseVTO) => {
          const courseId = a.course?.id;
          if (courseId) {
            currentCourseMap.set(courseId, a.id);
          }
        });
        
        const selectedCourseIds = assignments.filter(a => a.assigned).map(a => a.id);
        
        const toUnassign: number[] = [];
        currentCourseMap.forEach((trainerCourseId, courseId) => {
          if (!selectedCourseIds.includes(courseId)) {
            toUnassign.push(trainerCourseId);
          }
        });
        
        const toAssign = selectedCourseIds.filter(courseId => !currentCourseMap.has(courseId));
        
        console.log('📋 Course changes - To unassign:', toUnassign, 'To assign:', toAssign);
        
        if (toUnassign.length === 0 && toAssign.length === 0) {
          console.log('ℹ️ No course changes needed');
          this.finalizeSubmit();
          return;
        }
        
        let completed = 0;
        const total = toUnassign.length + toAssign.length;
        let hasError = false;
        let errors: string[] = [];
        
        if (toUnassign.length > 0) {
          toUnassign.forEach(trainerCourseId => {
            console.log(`🗑️ Unassigning course (trainerCourseId: ${trainerCourseId})`);
            this.employeeService.unassignCourseFromTrainer(trainerCourseId).subscribe({
              next: () => {
                completed++;
                console.log(`✅ Course unassigned`);
                this.checkCourseCompletion(completed, total, hasError, errors);
              },
              error: (err) => {
                console.error(`❌ Error unassigning course:`, err);
                hasError = true;
                errors.push(`فشل إلغاء إسناد الدورة: ${err.error?.messageEn || 'خطأ غير معروف'}`);
                completed++;
                this.checkCourseCompletion(completed, total, hasError, errors);
              }
            });
          });
        }
        
        if (toAssign.length > 0) {
          toAssign.forEach(courseId => {
            const data: AssignCourseDTO = { courseId: courseId };
            console.log(`📌 Assigning course ${courseId} to employee ${employeeId}`);
            this.employeeService.assignCourseToTrainer(employeeId, data).subscribe({
              next: (res: any) => {
                completed++;
                console.log(`✅ Course assigned: ${courseId}`);
                const assignment = assignments.find(a => a.id === courseId);
                if (assignment && res && res.id) {
                  assignment.assignmentId = res.id;
                }
                this.checkCourseCompletion(completed, total, hasError, errors);
              },
              error: (err) => {
                console.error(`❌ Error assigning course ${courseId}:`, err);
                hasError = true;
                errors.push(`فشل إسناد الدورة ${courseId}: ${err.error?.messageEn || 'خطأ غير معروف'}`);
                completed++;
                this.checkCourseCompletion(completed, total, hasError, errors);
              }
            });
          });
        }
      },
      error: (err) => {
        console.error('❌ Error fetching current course assignments:', err);
        this.notification.showError('حدث خطأ في تحميل دورات الموظف');
        this.finalizeSubmit();
      }
    });
  }

  private checkCourseCompletion(completed: number, total: number, hasError: boolean, errors: string[]): void {
    if (completed === total) {
      if (hasError) {
        this.notification.showWarning('تم تحديث الموظف مع بعض الأخطاء في إسناد الدورات: ' + errors.join('; '));
      }
      this.finalizeSubmit();
    }
  }

  private finalizeSubmit(): void {
    this.notification.showSuccess('تم تحديث الموظف وجميع البيانات بنجاح');
    this.dialogRef.close(true);
    this.isSubmitting = false;
  }
}