// employee-wizard-modal.component.ts - COMPLETE FIXED VERSION
import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef } from '@angular/core';
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
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { EmployeeService } from '../../../../core/services/employee.service';
import { DepartmentService } from '../../../../core/services/department.service';
import { CourseService } from '../../../../core/services/course.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { FileService } from '../../../../core/services/file.service';
import { FileDomain } from '../../../../core/models/file.model';
import { FileUploadComponent } from '../../../../shared/components/file-upload/file-upload.component';
import { SearchableSelectComponent, SelectOption } from '../../../../shared/components/searchable-select/searchable-select.component';
import { EMPLOYEE_TYPES, EmployeeDTO, EmployeeContactDTO } from '../../../../core/models/employee.model';
import { GENDERS, SALARY_TYPES, CONTACT_TYPES, Gender, ContactType, SalaryType } from '../../../../core/models/common.model';
import { AssignDepartmentDTO, AssignCourseDTO } from '../../../../core/models/employee.model';

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
    FileUploadComponent,
    SearchableSelectComponent
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
                    <input matInput formControlName="fullName">
                    <mat-error *ngIf="basicInfoForm.get('fullName')?.hasError('required')">الاسم مطلوب</mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>رقم الهوية *</mat-label>
                    <input matInput formControlName="nationalId" maxlength="14">
                    <mat-error *ngIf="basicInfoForm.get('nationalId')?.hasError('required')">رقم الهوية مطلوب</mat-error>
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

                  <app-searchable-select
                    [ngModel]="basicInfoForm.get('employeeType')?.value"
                    (ngModelChange)="basicInfoForm.get('employeeType')?.setValue($event)"
                    label="نوع الموظف *"
                    [options]="employeeTypeOptions"
                    [required]="true"
                    [ngModelOptions]="{standalone: true}">
                  </app-searchable-select>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>تاريخ التوظيف</mat-label>
                    <input matInput [matDatepicker]="hirePicker" formControlName="hireDate">
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
                          <input matInput type="number" formControlName="salary">
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
                          <input matInput type="number" formControlName="remainedSalary">
                          <span matSuffix>جم</span>
                        </mat-form-field>
                      </div>
                    </mat-card-content>
                  </mat-card>

                  <mat-card class="financial-card info">
                    <mat-card-content>
                      <div class="form-field">
                        <app-searchable-select
                          [ngModel]="financialForm.get('salaryType')?.value"
                          (ngModelChange)="financialForm.get('salaryType')?.setValue($event)"
                          label="نوع الراتب"
                          [options]="salaryTypeOptions"
                          [ngModelOptions]="{standalone: true}">
                        </app-searchable-select>
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
                <div class="department-selection-grid">
                  <div *ngFor="let dept of departments" class="department-item">
                    <mat-checkbox 
                      [checked]="isDepartmentSelected(dept.id)"
                      (change)="toggleDepartment(dept.id, $event.checked)">
                      {{ dept.title }}
                    </mat-checkbox>
                  </div>
                </div>
                
                <div class="selected-departments" *ngIf="selectedDepartments.length > 0">
                  <label>الأقسام المختارة:</label>
                  <div class="department-chips">
                    <mat-chip *ngFor="let dept of selectedDepartments" (removed)="removeDepartment(dept.id)">
                      {{ dept.title }}
                      <mat-icon matChipRemove>cancel</mat-icon>
                    </mat-chip>
                  </div>
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
                <div class="course-selection-grid" *ngIf="isTrainer">
                  <div *ngFor="let course of allCourses" class="course-item">
                    <mat-checkbox 
                      [checked]="isCourseSelected(course.id)"
                      (change)="toggleCourse(course.id, $event.checked)">
                      {{ course.title }}
                    </mat-checkbox>
                  </div>
                </div>
                
                <div class="selected-courses" *ngIf="selectedCourses.length > 0 && isTrainer">
                  <label>الدورات المختارة:</label>
                  <div class="course-chips">
                    <mat-chip *ngFor="let course of selectedCourses" (removed)="removeCourse(course.id)">
                      {{ course.title }}
                      <mat-icon matChipRemove>cancel</mat-icon>
                    </mat-chip>
                  </div>
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
                    <app-searchable-select
                      [ngModel]="contact.get('contactType')?.value"
                      (ngModelChange)="contact.get('contactType')?.setValue($event)"
                      label="نوع جهة الاتصال"
                      [options]="contactTypeOptions"
                      [required]="true"
                      [ngModelOptions]="{standalone: true}">
                    </app-searchable-select>

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
                    <div><strong>الجنس:</strong> {{ basicInfoForm.get('gender')?.value?.title }}</div>
                    <div><strong>نوع الموظف:</strong> {{ basicInfoForm.get('employeeType')?.value?.title }}</div>
                    <div><strong>تاريخ التوظيف:</strong> {{ basicInfoForm.get('hireDate')?.value | date:'dd/MM/yyyy' }}</div>
                    <div *ngIf="isEditMode"><strong>الحالة:</strong> {{ basicInfoForm.get('isActive')?.value ? 'نشط' : 'غير نشط' }}</div>
                  </div>
                </mat-card>

                <mat-card class="summary-card">
                  <mat-card-title>المعلومات المالية</mat-card-title>
                  <div class="summary-grid">
                    <div><strong>الراتب:</strong> {{ financialForm.get('salary')?.value | currency:'EGP' }}</div>
                    <div><strong>الراتب المتبقي:</strong> {{ financialForm.get('remainedSalary')?.value | currency:'EGP' }}</div>
                    <div><strong>نوع الراتب:</strong> {{ financialForm.get('salaryType')?.value?.title }}</div>
                  </div>
                </mat-card>

                <mat-card class="summary-card" *ngIf="selectedDepartments.length > 0">
                  <mat-card-title>الأقسام</mat-card-title>
                  <div class="department-chips">
                    <mat-chip *ngFor="let dept of selectedDepartments">{{ dept.title }}</mat-chip>
                  </div>
                </mat-card>

                <mat-card class="summary-card" *ngIf="selectedCourses.length > 0 && isTrainer">
                  <mat-card-title>الدورات</mat-card-title>
                  <div class="course-chips">
                    <mat-chip *ngFor="let course of selectedCourses">{{ course.title }}</mat-chip>
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
    }

    .contact-value {
      width: 100%;
    }

    .add-contact-btn {
      margin-top: 16px;
    }

    .selected-departments, .selected-courses {
      margin-top: 16px;
    }

    .selected-departments label, .selected-courses label {
      font-weight: 600;
      color: #374151;
      margin-bottom: 8px;
      display: block;
    }

    .department-chips, .course-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
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

    .department-selection-grid, .course-selection-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 12px;
      margin-bottom: 20px;
      padding: 16px;
      background: white;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
    }

    .department-item, .course-item {
      padding: 8px 12px;
      border-radius: 8px;
      transition: background 0.2s;
    }

    .department-item:hover, .course-item:hover {
      background: #f8fafc;
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
      .department-selection-grid, .course-selection-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class EmployeeWizardModalComponent implements OnInit {
  @ViewChild('stepper') stepper!: MatStepper;
  
  basicInfoForm: FormGroup;
  financialForm: FormGroup;
  departmentsForm: FormGroup;
  coursesForm: FormGroup;
  contactsForm: FormGroup;
  
  departments: any[] = [];
  allCourses: any[] = [];
  selectedDepartmentIds: number[] = [];
  selectedCourseIds: number[] = [];
  
  genderOptions: SelectOption[] = [];
  employeeTypeOptions: SelectOption[] = [];
  salaryTypeOptions: SelectOption[] = [];
  contactTypeOptions: SelectOption[] = [];
  
  employeeImageFid: string | null = null;
  
  isLoading = false;
  isSubmitting = false;
  isEditMode = false;
  employeeId: number | null = null;
  isTrainer: boolean = false;
  
  FileDomain = FileDomain;
  
  get contactsArray() { return this.contactsForm.get('contacts') as FormArray; }
  
  get selectedDepartments(): any[] {
    return this.departments.filter(d => this.selectedDepartmentIds.includes(d.id));
  }
  
  get selectedCourses(): any[] {
    return this.allCourses.filter(c => this.selectedCourseIds.includes(c.id));
  }

  constructor(
    private dialogRef: MatDialogRef<EmployeeWizardModalComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { employeeId?: number },
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
    
    this.basicInfoForm = this.fb.group({
      fullName: ['', Validators.required],
      nationalId: ['', Validators.required],
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
    
    this.departmentsForm = this.fb.group({
      departmentIds: [[]]
    });
    
    this.coursesForm = this.fb.group({
      courseIds: [[]]
    });
    
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
        this.selectedCourseIds = [];
        this.coursesForm.patchValue({ courseIds: [] });
      }
    });
    
    if (this.isEditMode && this.employeeId) {
      this.loadEmployeeData();
    }
  }

  loadSelectOptions(): void {
    this.genderOptions = GENDERS.map(g => ({ value: g, label: g.title }));
    this.employeeTypeOptions = EMPLOYEE_TYPES.map(t => ({ value: t, label: t.title }));
    this.salaryTypeOptions = SALARY_TYPES.map(s => ({ value: s, label: s.title }));
    this.contactTypeOptions = CONTACT_TYPES.map(c => ({ value: c, label: c.title }));
  }

  loadDepartments(): void {
    this.departmentService.getAllDepartmentsLookup().subscribe({
      next: (res: any) => {
        this.departments = res.list || [];
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
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل الدورات');
      }
    });
  }

  loadEmployeeData(): void {
    this.isLoading = true;
    this.employeeService.getEmployeeById(this.employeeId!).subscribe({
      next: (emp: any) => {
        console.log('Loading employee data:', emp);
        
        // FIX: Map gender - Use the object directly since it's already a LookupVTO
        let genderObj: any = null;
        if (emp.gender) {
          // emp.gender is already an object with id and title
          genderObj = GENDERS.find(g => g.id === emp.gender.id) || null;
        }
        console.log('Mapped gender:', genderObj);
        
        // FIX: Map employee type - Use the object directly since it's already a LookupVTO
        let employeeTypeObj: any = null;
        if (emp.employeeType) {
          // emp.employeeType is already an object with id and title
          employeeTypeObj = EMPLOYEE_TYPES.find(t => t.id === emp.employeeType.id) || null;
          this.isTrainer = emp.employeeType.id === 1;
        }
        console.log('Mapped employee type:', employeeTypeObj);
        
        // Map salary type - Use the object directly
        let salaryTypeObj: any = null;
        if (emp.salaryType) {
          salaryTypeObj = SALARY_TYPES.find(s => s.id === emp.salaryType.id) || null;
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
        
        // Force update for SearchableSelect components
        setTimeout(() => {
          this.basicInfoForm.patchValue({
            gender: genderObj,
            employeeType: employeeTypeObj
          });
          this.cdr.detectChanges();
        }, 100);
        
        // Patch financial info
        this.financialForm.patchValue({
          salary: emp.salary || null,
          remainedSalary: emp.remainedSalary || null,
          salaryType: salaryTypeObj
        });
        
        // Load Departments - Handle null case
        const departmentIds = emp.departments?.map((d: any) => d.id) || [];
        console.log('Loaded department IDs:', departmentIds);
        this.selectedDepartmentIds = [...departmentIds];
        this.departmentsForm.patchValue({
          departmentIds: this.selectedDepartmentIds
        });
        
        // Force update for departments
        setTimeout(() => {
          this.departmentsForm.patchValue({
            departmentIds: this.selectedDepartmentIds
          });
          this.cdr.detectChanges();
        }, 150);
        
        // Load Courses - Handle null case
        const courseIds = emp.courses?.map((c: any) => c.id) || [];
        console.log('Loaded course IDs:', courseIds);
        this.selectedCourseIds = [...courseIds];
        this.coursesForm.patchValue({
          courseIds: this.selectedCourseIds
        });
        
        // Force update for courses
        setTimeout(() => {
          this.coursesForm.patchValue({
            courseIds: this.selectedCourseIds
          });
          this.cdr.detectChanges();
        }, 150);
        
        // Set image
        if (emp.imageUrl) {
          this.employeeImageFid = emp.imageUrl;
        }
        
        // Patch contacts with IDs
        if (emp.contacts && emp.contacts.length > 0) {
          while (this.contactsArray.length) {
            this.contactsArray.removeAt(0);
          }
          emp.contacts.forEach((c: any) => {
            let contactTypeObj: any = null;
            if (c.contactType) {
              // c.contactType is already an object with id and title
              contactTypeObj = CONTACT_TYPES.find(ct => ct.id === c.contactType.id) || null;
            }
            this.contactsArray.push(this.fb.group({
              id: [c.id],
              contactType: [contactTypeObj, Validators.required],
              contactValue: [c.contactValue || '', Validators.required]
            }));
          });
        }
        
        this.cdr.detectChanges();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading employee:', err);
        this.notification.showError('حدث خطأ في تحميل بيانات الموظف');
        this.isLoading = false;
      }
    });
  }

  onImageUploaded(fid: string): void {
    this.employeeImageFid = fid;
    this.notification.showSuccess('تم رفع الصورة بنجاح');
  }

  onImageRemoved(): void {
    this.employeeImageFid = null;
    this.notification.showSuccess('تم حذف الصورة');
  }

  isDepartmentSelected(deptId: number): boolean {
    return this.selectedDepartmentIds.includes(deptId);
  }

  toggleDepartment(deptId: number, checked: boolean): void {
    if (checked) {
      if (!this.selectedDepartmentIds.includes(deptId)) {
        this.selectedDepartmentIds.push(deptId);
      }
    } else {
      this.selectedDepartmentIds = this.selectedDepartmentIds.filter(id => id !== deptId);
    }
    this.departmentsForm.patchValue({ departmentIds: this.selectedDepartmentIds });
  }

  removeDepartment(deptId: number): void {
    this.selectedDepartmentIds = this.selectedDepartmentIds.filter(id => id !== deptId);
    this.departmentsForm.patchValue({ departmentIds: this.selectedDepartmentIds });
  }

  isCourseSelected(courseId: number): boolean {
    return this.selectedCourseIds.includes(courseId);
  }

  toggleCourse(courseId: number, checked: boolean): void {
    if (checked) {
      if (!this.selectedCourseIds.includes(courseId)) {
        this.selectedCourseIds.push(courseId);
      }
    } else {
      this.selectedCourseIds = this.selectedCourseIds.filter(id => id !== courseId);
    }
    this.coursesForm.patchValue({ courseIds: this.selectedCourseIds });
  }

  removeCourse(courseId: number): void {
    this.selectedCourseIds = this.selectedCourseIds.filter(id => id !== courseId);
    this.coursesForm.patchValue({ courseIds: this.selectedCourseIds });
  }

  addContact(): void {
    this.contactsArray.push(this.fb.group({
      id: [null],
      contactType: [null, Validators.required],
      contactValue: ['', Validators.required]
    }));
  }

  removeContact(index: number): void {
    this.contactsArray.removeAt(index);
  }

  getContactsList(): any[] {
    const contacts = this.contactsArray.value;
    return contacts.filter((c: any) => c.contactType && c.contactValue && c.contactValue.trim() !== '');
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

  async printPreview(): Promise<void> {
    let imagePreviewUrl: string | null = null;
    
    if (this.employeeImageFid && /^\d{15}(\d{3})?$/.test(this.employeeImageFid)) {
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
      departments: this.selectedDepartments,
      courses: this.selectedCourses,
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
          .full-width { grid-column: span 2; }
          .contacts-list { display: flex; flex-direction: column; gap: 8px; }
          .contact-item { display: flex; gap: 8px; padding: 6px 0; border-bottom: 1px solid #f3f4f6; }
          .contact-type { font-weight: 600; color: #f59e0b; min-width: 100px; }
          .department-chips, .course-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
          .dept-chip, .course-chip { background: #f3f4f6; padding: 4px 12px; border-radius: 20px; font-size: 12px; }
          .declaration { margin: 24px 0; padding: 16px; background: #f9fafb; border-radius: 12px; font-size: 12px; line-height: 1.6; text-align: justify; }
          .signature-section { margin-top: 40px; display: flex; justify-content: space-between; align-items: flex-end; gap: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
          .signature-box { text-align: center; flex: 1; }
          .signature-line { width: 100%; border-top: 1px solid #000; margin-top: 40px; padding-top: 8px; }
          .signature-date { font-size: 10px; color: #6b7280; margin-top: 8px; }
          .footer { text-align: center; margin-top: 30px; padding: 16px; font-size: 10px; color: #9ca3af; border-top: 1px solid #e5e7eb; }
          .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); opacity: 0.1; font-size: 60px; white-space: nowrap; pointer-events: none; }
          @media print { .watermark { display: none; } }
          @media (max-width: 600px) { 
            .info-grid { grid-template-columns: 1fr; } 
            .signature-section { flex-direction: column; align-items: center; gap: 30px; }
            .signature-box { width: 100%; }
          }
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

  submitEmployee(): void {
    if (this.basicInfoForm.invalid) {
      this.notification.showWarning('يرجى تعبئة جميع الحقول المطلوبة');
      return;
    }
    
    this.isSubmitting = true;
    
    const genderObj = this.basicInfoForm.get('gender')?.value;
    const employeeTypeObj = this.basicInfoForm.get('employeeType')?.value;
    const salaryTypeObj = this.financialForm.get('salaryType')?.value;
    
    // Proper gender mapping
    let genderEnum = null;
    if (genderObj) {
      genderEnum = genderObj.id === 1 ? 'MALE' : 'FEMALE';
    }
    
    // Proper employee type mapping
    let employeeTypeEnum = null;
    if (employeeTypeObj) {
      employeeTypeEnum = employeeTypeObj.id === 1 ? 'TRAINER' : 'MANAGER';
    }
    
    // Proper salary type mapping
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
    
    // Get valid contacts
    const contactsList = this.getContactsList().map(contact => {
      const contactTypeObj = contact.contactType;
      let contactTypeValue = 'PHONE';
      if (contactTypeObj) {
        if (contactTypeObj.id === 1) {
          contactTypeValue = 'EMAIL';
        } else if (contactTypeObj.id === 2) {
          contactTypeValue = 'PHONE';
        }
      }
      return {
        id: contact.id || null,
        contactType: contactTypeValue,
        contactValue: contact.contactValue
      };
    });
    
    // =============================================
    // For Edit Mode: Update employee and manage contacts separately
    // =============================================
    if (this.isEditMode && this.employeeId) {
      // Create the employee update payload WITHOUT contacts
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
        departmentIds: this.selectedDepartmentIds.length > 0 ? this.selectedDepartmentIds : [],
        imageUrl: this.employeeImageFid,
        isActive: this.basicInfoForm.get('isActive')?.value
      };
      
      console.log('Updating employee (without contacts):', employeeUpdateData);
      
      // Update the employee basic info
      this.employeeService.updateEmployee(this.employeeId, employeeUpdateData).subscribe({
        next: (res: any) => {
          console.log('Employee updated successfully:', res);
          
          // Now handle contacts separately using the employee ID
          this.handleContactsUpdate(this.employeeId!, contactsList);
        },
        error: (err) => {
          console.error('Update error:', err);
          this.notification.showError(err.error?.messageEn || 'حدث خطأ في تحديث الموظف');
          this.isSubmitting = false;
        }
      });
    } 
    // =============================================
    // For Create Mode: Create employee then add contacts
    // =============================================
    else {
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
        departmentIds: this.selectedDepartmentIds.length > 0 ? this.selectedDepartmentIds : [],
        contacts: contactsList.map(c => ({ contactType: c.contactType, contactValue: c.contactValue })),
        imageUrl: this.employeeImageFid
      };
      
      console.log('Creating employee with contacts:', formData);
      
      this.employeeService.createEmployee(formData).subscribe({
        next: (res: any) => {
          const newEmployeeId = res.id;
          console.log('Employee created with ID:', newEmployeeId);
          
          // Assign departments if not included in the create request
          if (this.selectedDepartmentIds.length > 0) {
            this.assignDepartmentsToEmployee(newEmployeeId, this.selectedDepartmentIds);
          }
          
          // Assign courses if trainer
          if (this.isTrainer && this.selectedCourseIds.length > 0) {
            this.assignCoursesToEmployee(newEmployeeId, this.selectedCourseIds);
          }
          
          this.notification.showSuccess('تم إضافة الموظف بنجاح');
          this.dialogRef.close(true);
          this.isSubmitting = false;
        },
        error: (err) => {
          console.error('Create error:', err);
          this.notification.showError(err.error?.messageEn || 'حدث خطأ في إضافة الموظف');
          this.isSubmitting = false;
        }
      });
    }
  }

  /**
   * Handle contacts update in edit mode using createEmployeeContact and updateEmployeeContact
   */
  private handleContactsUpdate(employeeId: number, newContacts: any[]): void {
    // Get the current employee data to know existing contacts
    this.employeeService.getEmployeeById(employeeId).subscribe({
      next: (emp: any) => {
        const existingContacts = emp.contacts || [];
        
        // Find contacts to delete (exist in old but not in new)
        const contactsToDelete = existingContacts.filter(
          (old: any) => !newContacts.some((newC: any) => newC.id === old.id)
        );
        
        // Find contacts to update (exist in both)
        const contactsToUpdate = newContacts.filter(
          (newC: any) => existingContacts.some((old: any) => old.id === newC.id)
        );
        
        // Find contacts to create (exist in new but not in old)
        const contactsToCreate = newContacts.filter(
          (newC: any) => !existingContacts.some((old: any) => old.id === newC.id)
        );
        
        console.log('Contacts to delete:', contactsToDelete);
        console.log('Contacts to update:', contactsToUpdate);
        console.log('Contacts to create:', contactsToCreate);
        
        let completed = 0;
        const total = contactsToDelete.length + contactsToUpdate.length + contactsToCreate.length;
        let hasError = false;
        
        // If no changes, close the dialog
        if (total === 0) {
          this.notification.showSuccess('تم تحديث الموظف بنجاح');
          this.dialogRef.close(true);
          this.isSubmitting = false;
          return;
        }
        
        // ==================== DELETE CONTACTS ====================
        contactsToDelete.forEach((contact: any) => {
          this.employeeService.deleteEmployeeContact(employeeId, contact.id).subscribe({
            next: () => {
              completed++;
              console.log(`Contact ${contact.id} deleted`);
              this.checkContactsCompletion(completed, total, hasError);
            },
            error: (err) => {
              console.error(`Error deleting contact ${contact.id}:`, err);
              hasError = true;
              completed++;
              this.checkContactsCompletion(completed, total, hasError);
            }
          });
        });
        
        // ==================== UPDATE CONTACTS ====================
        contactsToUpdate.forEach((contact: any) => {
          const contactDTO = {
            contactType: contact.contactType,
            contactValue: contact.contactValue
          };
          this.employeeService.updateEmployeeContact(employeeId, contact.id, contactDTO).subscribe({
            next: () => {
              completed++;
              console.log(`Contact ${contact.id} updated`);
              this.checkContactsCompletion(completed, total, hasError);
            },
            error: (err) => {
              console.error(`Error updating contact ${contact.id}:`, err);
              hasError = true;
              completed++;
              this.checkContactsCompletion(completed, total, hasError);
            }
          });
        });
        
        // ==================== CREATE CONTACTS ====================
        contactsToCreate.forEach((contact: any) => {
          const contactDTO = {
            contactType: contact.contactType,
            contactValue: contact.contactValue
          };
          this.employeeService.createEmployeeContact(employeeId, contactDTO).subscribe({
            next: () => {
              completed++;
              console.log(`Contact created`);
              this.checkContactsCompletion(completed, total, hasError);
            },
            error: (err) => {
              console.error('Error creating contact:', err);
              hasError = true;
              completed++;
              this.checkContactsCompletion(completed, total, hasError);
            }
          });
        });
      },
      error: (err) => {
        console.error('Error fetching employee for contact management:', err);
        this.notification.showSuccess('تم تحديث الموظف بنجاح (تم تحديث المعلومات الأساسية)');
        this.dialogRef.close(true);
        this.isSubmitting = false;
      }
    });
  }

  /**
   * Check if all contact operations are completed
   */
  private checkContactsCompletion(completed: number, total: number, hasError: boolean): void {
    if (completed === total) {
      if (hasError) {
        this.notification.showWarning('تم تحديث الموظف مع بعض الأخطاء في جهات الاتصال');
      } else {
        this.notification.showSuccess('تم تحديث الموظف وجهات الاتصال بنجاح');
      }
      this.dialogRef.close(true);
      this.isSubmitting = false;
    }
  }

  private assignDepartmentsToEmployee(employeeId: number, departmentIds: number[]): void {
    if (!departmentIds || departmentIds.length === 0) return;
    
    const data: AssignDepartmentDTO = {
      departmentId: departmentIds
    };
    
    this.employeeService.assignDepartmentToTrainer(employeeId, data).subscribe({
      next: (res: any) => {
        console.log(`Departments ${departmentIds.join(', ')} assigned to employee ${employeeId}`, res);
      },
      error: (err) => {
        console.error('Error assigning departments:', err);
        this.notification.showWarning(`حدث خطأ في إسناد الأقسام: ${err.error?.messageEn || 'خطأ غير معروف'}`);
      }
    });
  }

  private assignCoursesToEmployee(employeeId: number, courseIds: number[]): void {
    if (!courseIds || courseIds.length === 0) return;
    
    courseIds.forEach(courseId => {
      const data: AssignCourseDTO = { courseId: courseId };
      this.employeeService.assignCourseToTrainer(employeeId, data).subscribe({
        next: (res: any) => {
          console.log(`Course ${courseId} assigned to employee ${employeeId}`, res);
        },
        error: (err) => {
          console.error(`Error assigning course ${courseId}:`, err);
          this.notification.showWarning(`حدث خطأ في إسناد الدورة: ${err.error?.messageEn || 'خطأ غير معروف'}`);
        }
      });
    });
  }
}