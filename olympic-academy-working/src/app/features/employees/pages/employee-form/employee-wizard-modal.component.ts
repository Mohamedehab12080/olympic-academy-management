// employee-wizard-modal.component.ts

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
import { MatTableModule, MatTableDataSource } from '@angular/material/table';

import { EmployeeService } from '../../../../core/services/employee.service';
import { DepartmentService } from '../../../../core/services/department.service';
import { CourseService } from '../../../../core/services/course.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { FileService } from '../../../../core/services/file.service';
import {FileDomain} from '../../../../core/models/file.model';
import { FileUploadComponent } from '../../../../shared/components/file-upload/file-upload.component';
import { SearchableSelectComponent, SelectOption } from '../../../../shared/components/searchable-select/searchable-select.component';
import { EMPLOYEE_TYPES, EmployeeDTO } from '../../../../core/models/employee.model';
import { GENDERS, SALARY_TYPES, CONTACT_TYPES, Gender, ContactType, SalaryType } from '../../../../core/models/common.model';

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
    FileUploadComponent,
    SearchableSelectComponent
  ],
  template: `
    <div class="wizard-container" dir="rtl">
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

          <!-- Step 3: Departments -->
          <mat-step [stepControl]="departmentsForm">
            <ng-template matStepLabel>
              <div class="step-label">
                <mat-icon>business</mat-icon>
                <span>الأقسام</span>
              </div>
            </ng-template>
            <div class="step-content">
              <form [formGroup]="departmentsForm">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>اختر الأقسام</mat-label>
                  <mat-select formControlName="departmentIds" multiple>
                    <mat-option *ngFor="let dept of departments" [value]="dept.id">
                      {{ dept.title }}
                    </mat-option>
                  </mat-select>
                  <mat-hint>يمكنك اختيار أكثر من قسم</mat-hint>
                </mat-form-field>
                
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

          <!-- Step 4: Contacts -->
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
                    <div><strong>تاريخ الميلاد:</strong> {{ basicInfoForm.get('birthDate')?.value | date:'dd/MM/yyyy' }}</div>
                    <div><strong>الجنس:</strong> {{ basicInfoForm.get('gender')?.value?.title }}</div>
                    <div><strong>نوع الموظف:</strong> {{ basicInfoForm.get('employeeType')?.value?.title }}</div>
                    <div><strong>تاريخ التوظيف:</strong> {{ basicInfoForm.get('hireDate')?.value | date:'dd/MM/yyyy' }}</div>
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

                <mat-card class="summary-card" *ngIf="getContactsList().length > 0">
                  <mat-card-title>جهات الاتصال</mat-card-title>
                  <div class="contacts-summary">
                    <div *ngFor="let contact of getContactsList()" class="contact-summary-item">
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
    .selected-departments {
      margin-top: 16px;
    }
    .selected-departments label {
      font-weight: 600;
      color: #374151;
      margin-bottom: 8px;
      display: block;
    }
    .department-chips {
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
    .contacts-summary {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .contact-summary-item {
      padding: 6px 0;
      border-bottom: 1px solid #e5e7eb;
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
export class EmployeeWizardModalComponent implements OnInit {
  @ViewChild('stepper') stepper!: MatStepper;
  
  basicInfoForm: FormGroup;
  financialForm: FormGroup;
  departmentsForm: FormGroup;
  contactsForm: FormGroup;
  
  departments: any[] = [];
  allCourses: any[] = [];
  
  genderOptions: SelectOption[] = [];
  employeeTypeOptions: SelectOption[] = [];
  salaryTypeOptions: SelectOption[] = [];
  contactTypeOptions: SelectOption[] = [];
  
  employeeImageFid: string | null = null;  // Store the FID (15 or 18 digits)
  
  isLoading = false;
  isSubmitting = false;
  isEditMode = false;
  employeeId: number | null = null;
  
  FileDomain = FileDomain;
  
  get contactsArray() { return this.contactsForm.get('contacts') as FormArray; }
  get selectedDepartments(): any[] {
    const ids = this.departmentsForm.get('departmentIds')?.value || [];
    return this.departments.filter(d => ids.includes(d.id));
  }

  constructor(
    private dialogRef: MatDialogRef<EmployeeWizardModalComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { employeeId?: number },
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private courseService: CourseService,
    private notification: NotificationService,
    private fileService: FileService
  ) {
    this.isEditMode = !!data?.employeeId;
    this.employeeId = data?.employeeId || null;
    
    this.basicInfoForm = this.fb.group({
      fullName: ['', Validators.required],
      nationalId: ['', Validators.required],
      birthDate: [''],
      gender: [null],
      employeeType: [null, Validators.required],
      hireDate: ['']
    });
    
    this.financialForm = this.fb.group({
      salary: [null],
      remainedSalary: [null],
      salaryType: [null]
    });
    
    this.departmentsForm = this.fb.group({
      departmentIds: [[]]
    });
    
    this.contactsForm = this.fb.group({
      contacts: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadSelectOptions();
    this.loadDepartments();
    this.addContact();
    
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

  loadEmployeeData(): void {
    this.isLoading = true;
    this.employeeService.getEmployeeById(this.employeeId!).subscribe({
      next: (emp: any) => {
        let genderObj = null;
        if (emp.gender) {
          genderObj = emp.gender === 'MALE' ? GENDERS.find(g => g.id === 1) : GENDERS.find(g => g.id === 2);
        }
        
        let employeeTypeObj = null;
        if (emp.employeeType) {
          employeeTypeObj = emp.employeeType === 'TRAINER' ? EMPLOYEE_TYPES.find(t => t.id === 1) : EMPLOYEE_TYPES.find(t => t.id === 2);
        }
        
        let salaryTypeObj = null;
        if (emp.salaryType) {
          switch(emp.salaryType) {
            case 'MONTHLY': salaryTypeObj = SALARY_TYPES.find(s => s.id === 1); break;
            case 'HOURLY': salaryTypeObj = SALARY_TYPES.find(s => s.id === 2); break;
            case 'DAILY': salaryTypeObj = SALARY_TYPES.find(s => s.id === 3); break;
            case 'PERCENTAGE': salaryTypeObj = SALARY_TYPES.find(s => s.id === 4); break;
            default: salaryTypeObj = SALARY_TYPES.find(s => s.id === 1);
          }
        }
        
        this.basicInfoForm.patchValue({
          fullName: emp.fullName,
          nationalId: emp.nationalId,
          birthDate: emp.birthDate,
          gender: genderObj,
          employeeType: employeeTypeObj,
          hireDate: emp.hireDate
        });
        
        this.financialForm.patchValue({
          salary: emp.salary,
          remainedSalary: emp.remainedSalary,
          salaryType: salaryTypeObj
        });
        
        this.departmentsForm.patchValue({
          departmentIds: emp.departments?.map((d: any) => d.id) || []
        });
        
        // Store the FID (imageUrl from backend is the FID)
        if (emp.imageUrl) {
          this.employeeImageFid = emp.imageUrl;
        }
        
        if (emp.contacts?.length) {
          while (this.contactsArray.length) this.contactsArray.removeAt(0);
          emp.contacts.forEach((c: any) => {
            let contactTypeObj = null;
            if (c.contactType) {
              switch(c.contactType) {
                case 'EMAIL': contactTypeObj = CONTACT_TYPES.find(ct => ct.id === 1); break;
                case 'PHONE': contactTypeObj = CONTACT_TYPES.find(ct => ct.id === 2); break;
                default: contactTypeObj = CONTACT_TYPES.find(ct => ct.id === 2);
              }
            }
            this.contactsArray.push(this.fb.group({
              contactType: [contactTypeObj],
              contactValue: [c.contactValue]
            }));
          });
        }
        
        this.isLoading = false;
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل بيانات الموظف');
        this.isLoading = false;
      }
    });
  }

  // File upload handlers - receives FID from FileUploadComponent
  onImageUploaded(fid: string): void {
    this.employeeImageFid = fid;  // Store the FID (15 or 18 digit number)
    this.notification.showSuccess('تم رفع الصورة بنجاح');
  }

  onImageRemoved(): void {
    this.employeeImageFid = null;
    this.notification.showSuccess('تم حذف الصورة');
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

  getContactsList(): any[] {
    return this.contactsArray.value.filter((c: any) => c.contactType && c.contactValue);
  }

  removeDepartment(deptId: number): void {
    const currentIds = this.departmentsForm.get('departmentIds')?.value || [];
    this.departmentsForm.patchValue({
      departmentIds: currentIds.filter((id: number) => id !== deptId)
    });
  }

async printPreview(): Promise<void> {
  let imagePreviewUrl: string | null = null;
  
  // Load image if FID exists
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
    contacts: this.getContactsList(),
    imageUrl: imagePreviewUrl,
    isNewEmployee: !this.isEditMode
  };
  
  this.generatePrintDocument(previewData);
  
  // Clean up blob URL - only if imagePreviewUrl is not null
  if (imagePreviewUrl) {
    setTimeout(() => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    }, 1000);
  }
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
    const applicationNumber = data.isNewEmployee ? `NEW-${Date.now()}` : `EMP-${this.employeeId}-${new Date().getFullYear()}`;
    
    printContainer.innerHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>طلب توظيف - ${data.fullName}</title>
        <style>
          * { font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif; }
          @media print { 
            body { margin: 0; padding: 20px; } 
            .no-print { display: none; }
            .signature-line { border-top: 1px solid #000 !important; }
          }
          .application-container { max-width: 800px; margin: 0 auto; background: white; }
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
          .department-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
          .dept-chip { background: #f3f4f6; padding: 4px 12px; border-radius: 20px; font-size: 12px; }
          .declaration { margin: 24px 0; padding: 16px; background: #f9fafb; border-radius: 12px; font-size: 12px; line-height: 1.6; text-align: justify; }
          .signature-section { margin-top: 40px; display: flex; justify-content: space-between; align-items: flex-end; gap: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
          .signature-box { text-align: center; flex: 1; }
          .signature-line { width: 100%; border-top: 1px solid #000; margin-top: 40px; padding-top: 8px; }
          .signature-date { font-size: 10px; color: #6b7280; margin-top: 8px; }
          .footer { text-align: center; margin-top: 30px; padding: 16px; font-size: 10px; color: #9ca3af; border-top: 1px solid #e5e7eb; }
          .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); opacity: 0.1; font-size: 60px; white-space: nowrap; pointer-events: none; z-index: 999; }
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
            <div><strong>رقم الطلب:</strong> ${applicationNumber}</div>
            <div><strong>تاريخ الطلب:</strong> ${today}</div>
            ${data.isNewEmployee ? '<div><span style="color: #f59e0b;">مسودة</span></div>' : ''}
          </div>
          
          <div class="photo-section">
            ${data.imageUrl 
              ? `<img src="${data.imageUrl}" class="employee-photo" alt="صورة الموظف">`
              : `<div class="placeholder-photo">📷</div>`
            }
          </div>
          
          <h2>📋 المعلومات الشخصية</h2>
          <div class="info-grid">
            <div class="info-item"><div class="info-label">الاسم الكامل</div><div class="info-value">${this.escapeHtml(data.fullName) || '-'}</div></div>
            <div class="info-item"><div class="info-label">رقم الهوية</div><div class="info-value">${this.escapeHtml(data.nationalId) || '-'}</div></div>
            <div class="info-item"><div class="info-label">تاريخ الميلاد</div><div class="info-value">${data.birthDate ? new Date(data.birthDate).toLocaleDateString('ar-EG') : '-'}</div></div>
            <div class="info-item"><div class="info-label">الجنس</div><div class="info-value">${data.gender?.title || '-'}</div></div>
            <div class="info-item"><div class="info-label">نوع الموظف</div><div class="info-value">${data.employeeType?.title || '-'}</div></div>
            <div class="info-item"><div class="info-label">تاريخ التوظيف</div><div class="info-value">${data.hireDate ? new Date(data.hireDate).toLocaleDateString('ar-EG') : '-'}</div></div>
          </div>
          
          <h2>💰 المعلومات المالية</h2>
          <div class="info-grid">
            <div class="info-item"><div class="info-label">الراتب الأساسي</div><div class="info-value amount">${data.salary?.toLocaleString('ar-EG') || 0} جم</div></div>
            <div class="info-item"><div class="info-label">الراتب المتبقي</div><div class="info-value">${data.remainedSalary?.toLocaleString('ar-EG') || 0} جم</div></div>
            <div class="info-item"><div class="info-label">نوع الراتب</div><div class="info-value">${data.salaryType?.title || '-'}</div></div>
          </div>
          
          <h2>🏢 الأقسام</h2>
          <div class="department-chips">
            ${data.departments?.map((dept: any) => `<span class="dept-chip">${this.escapeHtml(dept.title)}</span>`).join('') || '<span>- لا يوجد أقسام مسندة -</span>'}
          </div>
          
          <h2>📞 جهات الاتصال</h2>
          <div class="contacts-list">
            ${data.contacts?.map((contact: any) => `
              <div class="contact-item">
                <span class="contact-type">${contact.contactType?.title}:</span>
                <span>${this.escapeHtml(contact.contactValue)}</span>
              </div>
            `).join('') || '<span>- لا توجد جهات اتصال -</span>'}
          </div>
          
          <div class="declaration">
            <strong>إقرار:</strong><br>
            أقر أنا ${this.escapeHtml(data.fullName)} بأن جميع البيانات المذكورة أعلاه صحيحة ودقيقة، 
            وأتعهد بالالتزام بجميع لوائح وأنظمة الأكاديمية الأولمبية. 
            كما أقر بحقي في الحصول على الراتب المتفق عليه وفقاً لنوع الراتب المحدد أعلاه.
          </div>
          
          <div class="signature-section">
            <div class="signature-box">
              <div class="signature-line"></div>
              <div>توقيع الموظف</div>
              <div class="signature-date">التاريخ: ___ / ___ / _____</div>
            </div>
            <div class="signature-box">
              <div class="signature-line"></div>
              <div>توقيع مدير الموارد البشرية</div>
              <div class="signature-date">التاريخ: ___ / ___ / _____</div>
            </div>
            <div class="signature-box">
              <div class="signature-line"></div>
              <div>ختم الأكاديمية</div>
              <div class="signature-date">التاريخ: ___ / ___ / _____</div>
            </div>
          </div>
          
          <div class="footer">
            تم التصدير من نظام إدارة الأكاديمية الأولمبية<br>
            هذا المستند معتمد ويحتوي على جميع بيانات الموظف
          </div>
        </div>
        <div class="no-print" style="text-align: center; margin-top: 20px; padding: 10px;">
          <button onclick="window.print();" style="padding: 10px 20px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; border: none; border-radius: 5px; cursor: pointer;">
            🖨️ طباعة / حفظ كـ PDF
          </button>
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

  private escapeHtml(str: string | null | undefined): string {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  async submitEmployee(): Promise<void> {
    if (this.basicInfoForm.invalid) {
      this.notification.showWarning('يرجى تعبئة جميع الحقول المطلوبة');
      return;
    }
    
    this.isSubmitting = true;
    
    const genderObj = this.basicInfoForm.get('gender')?.value;
    const employeeTypeObj = this.basicInfoForm.get('employeeType')?.value;
    const salaryTypeObj = this.financialForm.get('salaryType')?.value;
    
    let genderEnum = null;
    if (genderObj) {
      genderEnum = genderObj.id === 1 ? 'MALE' : 'FEMALE';
    }
    
    let employeeTypeEnum = null;
    if (employeeTypeObj) {
      employeeTypeEnum = employeeTypeObj.id === 1 ? 'TRAINER' : 'MANAGER';
    }
    
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
    
    const contactsList = this.getContactsList().map(contact => {
      const contactTypeObj = contact.contactType;
      let contactTypeEnum = null;
      if (contactTypeObj) {
        switch(contactTypeObj.id) {
          case 1: contactTypeEnum = 'EMAIL'; break;
          case 2: contactTypeEnum = 'PHONE'; break;
          default: contactTypeEnum = 'PHONE';
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
      birthDate: this.basicInfoForm.get('birthDate')?.value,
      gender: genderEnum,
      employeeType: employeeTypeEnum,
      salary: this.financialForm.get('salary')?.value ? Number(this.financialForm.get('salary')?.value) : undefined,
      remainedSalary: this.financialForm.get('remainedSalary')?.value ? Number(this.financialForm.get('remainedSalary')?.value) : undefined,
      salaryType: salaryTypeEnum,
      hireDate: this.basicInfoForm.get('hireDate')?.value,
      departmentIds: this.departmentsForm.get('departmentIds')?.value || [],
      contacts: contactsList,
      imageUrl: this.employeeImageFid  // Send the FID (not a URL)
    };
    
    console.log('Submitting employee data:', formData);
    
    if (this.isEditMode && this.employeeId) {
      this.employeeService.updateEmployee(this.employeeId, formData as any).subscribe({
        next: () => {
          this.notification.showSuccess('تم تحديث الموظف بنجاح');
          this.dialogRef.close(true);
          this.isSubmitting = false;
        },
        error: (err) => {
          console.error('Update error:', err);
          this.notification.showError(err.error?.messageEn || 'حدث خطأ في تحديث الموظف');
          this.isSubmitting = false;
        }
      });
    } else {
      this.employeeService.createEmployee(formData as any).subscribe({
        next: (res: any) => {
          console.log(formData)
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
}