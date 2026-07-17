// employee-wizard-modal.component.ts
// Complete Professional Employee Wizard Modal

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
import { Subject, finalize, forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { EmployeeService } from '../../../../core/services/employee.service';
import { DepartmentService } from '../../../../core/services/department.service';
import { CourseService } from '../../../../core/services/course.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { FileService } from '../../../../core/services/file.service';
import { FileDomain } from '../../../../core/models/file.model';
import { FileUploadComponent } from '../../../../shared/components/file-upload/file-upload.component';
import { NewRecordVTO } from '../../../../core/models/common.model';
import { 
  EMPLOYEE_TYPES, 
  EmployeeType,
  AssignDepartmentDTO, 
  AssignCourseDTO,
  EmployeeVTO,
  EmployeeContactVTO
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

interface ContactFormData {
  id?: number;
  contactType: ContactType | null;
  contactValue: string;
  isNew?: boolean;
  isDeleted?: boolean;
  isModified?: boolean;
  originalValue?: string;
  originalType?: ContactType | null;
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
  templateUrl: './employee-wizard-modal.component.html',
  styleUrls: ['./employee-wizard-modal.component.css']
})
export class EmployeeWizardModalComponent implements OnInit, OnDestroy {
  @ViewChild('stepper') stepper!: MatStepper;
  
  // ============================================================
  // FORM GROUPS
  // ============================================================
  
  basicInfoForm: FormGroup;
  financialForm: FormGroup;
  departmentsForm: FormGroup;
  coursesForm: FormGroup;
  contactsForm: FormGroup;
  
  // ============================================================
  // DATA
  // ============================================================
  
  departmentAssignments: DepartmentAssignment[] = [];
  courseAssignments: CourseAssignment[] = [];
  allCourses: any[] = [];
  
  // ============================================================
  // OPTIONS
  // ============================================================
  
  genderOptions: any[] = [];
  employeeTypeOptions: any[] = [];
  salaryTypeOptions: any[] = [];
  contactTypeOptions: any[] = [];
  
  // ============================================================
  // STATE
  // ============================================================
  
  employeeImageFid: string | null = null;
  isLoading = false;
  isSubmitting = false;
  isEditMode = false;
  employeeId: number | null = null;
  isDataLoaded = false;
  
  private deletedContactIds: number[] = [];
  private destroy$ = new Subject<void>();
  
  FileDomain = FileDomain;
  
  // ============================================================
  // GETTERS
  // ============================================================
  
  get contactsArray(): FormArray {
    return this.contactsForm.get('contacts') as FormArray;
  }
  
  get selectedDepartments(): DepartmentAssignment[] {
    return this.departmentAssignments.filter(d => d.assigned);
  }
  
  get selectedCourses(): CourseAssignment[] {
    return this.courseAssignments.filter(c => c.assigned);
  }
  
  get contactsList(): ContactFormData[] {
    return this.contactsArray.value.filter((c: any) => 
      c.contactType && 
      c.contactValue && 
      c.contactValue.trim() !== '' &&
      !c.isDeleted
    );
  }

  // ============================================================
  // CONSTRUCTOR
  // ============================================================
  
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
      salaryType: [null],
      isMonthlyUpdated: [false],
      updatePeriodInDays: [30]
    });
    
    this.departmentsForm = this.fb.group({});
    this.coursesForm = this.fb.group({});
    
    this.contactsForm = this.fb.group({
      contacts: this.fb.array([])
    });
  }

  // ============================================================
  // LIFECYCLE HOOKS
  // ============================================================
  
  ngOnInit(): void {
    this.loadSelectOptions();
    this.loadDepartments();
    this.loadCourses();
    this.addContact();
    
    if (this.isEditMode && this.employeeId) {
      this.loadEmployeeData();
    } else {
      this.isDataLoaded = true;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ============================================================
  // LOADING METHODS
  // ============================================================
  
  private loadSelectOptions(): void {
    this.genderOptions = GENDERS.map(g => ({ value: g, label: g.title }));
    this.employeeTypeOptions = EMPLOYEE_TYPES.map(t => ({ value: t, label: t.title }));
    this.salaryTypeOptions = SALARY_TYPES.map(s => ({ value: s, label: s.title }));
    this.contactTypeOptions = CONTACT_TYPES.map(c => ({ value: c, label: c.title }));
  }

  private loadDepartments(): void {
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

  private loadCourses(): void {
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
  
  private loadEmployeeData(): void {
    this.isLoading = true;
    this.employeeService.getEmployeeById(this.employeeId!).subscribe({
      next: (emp: EmployeeVTO) => {
        console.log('📋 Loading employee data:', emp);
        
        this.patchBasicInfo(emp);
        this.patchFinancialInfo(emp);
        
        // Load assignments and contacts in parallel
        forkJoin({
          departments: this.employeeService.getTrainerDepartments({ trainerId: emp.id, pageSize: 100 }),
          courses: this.employeeService.getTrainerCourses({ trainerId: emp.id, pageSize: 100 })
        }).subscribe({
          next: (results) => {
            this.processDepartmentAssignments(results.departments.items || []);
            this.processCourseAssignments(results.courses.items || []);
            this.loadContacts(emp.contacts || []);
            
            if (emp.imageUrl) {
              this.employeeImageFid = emp.imageUrl;
            }
            
            this.isDataLoaded = true;
            this.isLoading = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error loading assignments:', err);
            this.isLoading = false;
            this.isDataLoaded = true;
            this.notification.showError('حدث خطأ في تحميل بيانات الموظف');
          }
        });
      },
      error: (err) => {
        console.error('❌ Error loading employee:', err);
        this.notification.showError('حدث خطأ في تحميل بيانات الموظف');
        this.isLoading = false;
        this.isDataLoaded = true;
      }
    });
  }

  private patchBasicInfo(emp: EmployeeVTO): void {
    let genderObj: Gender | null = null;
    if (emp.gender?.id) {
      genderObj = GENDERS.find(g => g.id === emp.gender?.id) || null;
    }
    
    let employeeTypeObj: EmployeeType | null = null;
    if (emp.employeeType?.id) {
      employeeTypeObj = EMPLOYEE_TYPES.find(t => t.id === emp.employeeType.id) || null;
    }
    
    this.basicInfoForm.patchValue({
      fullName: emp.fullName || '',
      nationalId: emp.nationalId || '',
      birthDate: emp.birthDate || '',
      gender: genderObj,
      employeeType: employeeTypeObj,
      hireDate: emp.hireDate || '',
      isActive: emp.isActive !== undefined ? emp.isActive : true
    });
  }

  private patchFinancialInfo(emp: EmployeeVTO): void {
    let salaryTypeObj: SalaryType | null = null;
    if (emp.salaryType?.id) {
      salaryTypeObj = SALARY_TYPES.find(s => s.id === emp.salaryType?.id) || null;
    }
    
    this.financialForm.patchValue({
      salary: emp.salary || null,
      remainedSalary: emp.remainedSalary || null,
      salaryType: salaryTypeObj,
      isMonthlyUpdated: emp.isMonthlyUpdated !== undefined ? emp.isMonthlyUpdated : false,
      updatePeriodInDays: emp.updatePeriodInDays || 30
    });
  }

  private processDepartmentAssignments(items: any[]): void {
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
  }

  private processCourseAssignments(items: any[]): void {
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
  }

  // ============================================================
  // CONTACT LOADING
  // ============================================================
  
  private loadContacts(contacts: EmployeeContactVTO[]): void {
    this.clearContactsArray();
    
    if (contacts && contacts.length > 0) {
      contacts.forEach((c: EmployeeContactVTO) => {
        let contactTypeObj: ContactType | null = null;
        if (c.contactType?.id) {
          contactTypeObj = CONTACT_TYPES.find(ct => ct.id === c.contactType.id) || null;
        }
        
        this.addContactFormGroup({
          id: c.id,
          contactType: contactTypeObj,
          contactValue: c.contactValue || '',
          isNew: false,
          isDeleted: false,
          isModified: false,
          originalValue: c.contactValue || '',
          originalType: contactTypeObj
        });
      });
    } else {
      this.addContact();
    }
  }

  private clearContactsArray(): void {
    while (this.contactsArray.length) {
      this.contactsArray.removeAt(0);
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

  // ============================================================
  // CONTACTS MANAGEMENT
  // ============================================================
  
  addContact(): void {
  this.addContactFormGroup({
    id: undefined,  // ✅ Changed from null to undefined
    contactType: null,
    contactValue: '',
    isNew: true,
    isDeleted: false,
    isModified: false,
    originalValue: '',
    originalType: null
  });
}

private addContactFormGroup(data: ContactFormData): void {
  const group = this.fb.group({
    id: [data.id],  // ✅ Changed from [data.id || null] to just [data.id]
    contactType: [data.contactType, Validators.required],
    contactValue: [data.contactValue, Validators.required],
    isNew: [data.isNew || true],
    isDeleted: [data.isDeleted || false],
    isModified: [data.isModified || false],
    originalValue: [data.originalValue || ''],
    originalType: [data.originalType || null]
  });
  
  this.contactsArray.push(group);
  this.cdr.detectChanges();
}

  removeContact(index: number): void {
    const contactGroup = this.contactsArray.at(index);
    const contactId = contactGroup.get('id')?.value;
    
    if (contactId) {
      contactGroup.patchValue({ isDeleted: true, isModified: false });
      this.deletedContactIds.push(contactId);
      this.contactsArray.removeAt(index);
    } else {
      this.contactsArray.removeAt(index);
    }
    
    this.cdr.detectChanges();
  }

  // ============================================================
  // CONTACT API HELPERS
  // ============================================================
  
  private mapContactTypeToEnum(contactType: ContactType | null): string {
    if (!contactType) return 'PHONE';
    if (contactType.id === 1) return 'EMAIL';
    if (contactType.id === 2) return 'PHONE';
    return 'PHONE';
  }

  private processContacts(employeeId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const contacts = this.contactsArray.value;
      
      const contactsToCreate = contacts.filter((c: any) => 
        c.contactType && c.contactValue && c.contactValue.trim() !== '' && !c.isDeleted && !c.id
      );
      
      const contactsToUpdate = contacts.filter((c: any) => 
        c.contactType && c.contactValue && c.contactValue.trim() !== '' && !c.isDeleted && c.id &&
        (c.isModified || c.contactValue !== c.originalValue || c.contactType?.id !== c.originalType?.id)
      );
      
      const contactsToDelete = this.deletedContactIds;
      
      console.log('📋 Contact processing summary:');
      console.log('  New:', contactsToCreate.length);
      console.log('  Update:', contactsToUpdate.length);
      console.log('  Delete:', contactsToDelete.length);
      
      const operations: Promise<any>[] = [];
      
      contactsToCreate.forEach((contact: any) => {
        const dto = {
          contactType: this.mapContactTypeToEnum(contact.contactType),
          contactValue: contact.contactValue
        };
        operations.push(this.employeeService.createEmployeeContact(employeeId, dto).toPromise());
      });
      
      contactsToUpdate.forEach((contact: any) => {
        const dto = {
          contactType: this.mapContactTypeToEnum(contact.contactType),
          contactValue: contact.contactValue
        };
        operations.push(this.employeeService.updateEmployeeContact(employeeId, contact.id, dto).toPromise());
      });
      
      contactsToDelete.forEach((id: number) => {
        operations.push(this.employeeService.deleteEmployeeContact(employeeId, id).toPromise());
      });
      
      if (operations.length === 0) {
        resolve();
        return;
      }
      
      Promise.all(operations)
        .then(() => {
          console.log('✅ All contact operations completed');
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
    isMonthlyUpdated: this.financialForm.get('isMonthlyUpdated')?.value,
    updatePeriodInDays: this.financialForm.get('updatePeriodInDays')?.value,
    departments: this.selectedDepartments,
    courses: this.selectedCourses,
    contacts: this.contactsList,
    imageUrl: imagePreviewUrl,
    isNewEmployee: !this.isEditMode,
    isActive: this.basicInfoForm.get('isActive')?.value
  };
  
  this.generatePrintDocument(previewData);
  
  // ✅ Fix: Check if imagePreviewUrl exists before revoking
  if (imagePreviewUrl) {
    setTimeout(() => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    }, 1000);
  }
}

  private generatePrintDocument(data: any): void {
    const printWindow = window.open('', '_blank', 'width=800,height=800,scrollbars=yes');
    if (!printWindow) {
      this.notification.showError('تعذر فتح نافذة الطباعة');
      return;
    }
    
    const today = new Date().toLocaleDateString('ar-EG');
    
    let departmentsHtml = data.departments?.length > 0 
      ? data.departments.map((d: any) => `<span class="dept-chip">${d.title}</span>`).join('')
      : '';
    
    let coursesHtml = data.courses?.length > 0
      ? data.courses.map((c: any) => `<span class="course-chip">${c.title}</span>`).join('')
      : '';
    
    let contactsHtml = data.contacts?.length > 0
      ? data.contacts.map((c: any) => `
        <div class="contact-item">
          <span class="contact-type">${c.contactType?.title || 'جهة اتصال'}:</span>
          <span>${c.contactValue}</span>
        </div>
      `).join('')
      : '';
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>طلب توظيف - ${this.escapeHtml(data.fullName) || 'جديد'}</title>
        <style>
          * { font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif; box-sizing: border-box; margin: 0; padding: 0; }
          @media print { body { margin: 0; padding: 20px; } .no-print { display: none; } }
          body { background: white; padding: 20px; direction: rtl; }
          .container { max-width: 800px; margin: 0 auto; background: white; }
          .header { text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; border-radius: 12px; }
          .header h1 { margin: 0; font-size: 24px; }
          .header p { margin: 10px 0 0 0; font-size: 12px; opacity: 0.9; }
          .details { display: flex; justify-content: space-between; margin-bottom: 20px; padding: 10px; background: #f9fafb; border-radius: 8px; }
          .photo-section { text-align: center; margin-bottom: 20px; }
          .employee-photo { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 3px solid #f59e0b; }
          .placeholder-photo { width: 120px; height: 120px; border-radius: 50%; background: #f3f4f6; display: flex; align-items: center; justify-content: center; margin: 0 auto; border: 3px solid #f59e0b; font-size: 48px; }
          h2 { color: #f59e0b; border-bottom: 2px solid #f59e0b; padding-bottom: 8px; margin-top: 24px; margin-bottom: 16px; font-size: 18px; }
          .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 16px; }
          .item { border-bottom: 1px solid #e5e7eb; padding: 8px 0; }
          .label { font-weight: 600; color: #374151; font-size: 13px; margin-bottom: 4px; }
          .value { color: #1f2937; font-size: 14px; }
          .value.amount { font-weight: 700; color: #f59e0b; }
          .contacts { display: flex; flex-direction: column; gap: 8px; margin-top: 8px; }
          .contact-item { display: flex; gap: 8px; padding: 6px 0; border-bottom: 1px solid #f3f4f6; }
          .contact-type { font-weight: 600; color: #f59e0b; min-width: 100px; }
          .dept-chip, .course-chip { display: inline-block; background: #f3f4f6; padding: 4px 12px; border-radius: 20px; font-size: 12px; margin: 2px; }
          .signature { margin-top: 40px; display: flex; justify-content: space-between; gap: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
          .signature-box { text-align: center; flex: 1; }
          .signature-line { width: 100%; border-top: 1px solid #000; margin-top: 40px; padding-top: 8px; }
          .footer { text-align: center; margin-top: 30px; padding: 16px; font-size: 10px; color: #9ca3af; border-top: 1px solid #e5e7eb; }
          .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); opacity: 0.1; font-size: 60px; white-space: nowrap; pointer-events: none; }
          @media print { .watermark { display: none; } }
        </style>
      </head>
      <body>
        ${data.isNewEmployee ? '<div class="watermark">مسودة - غير معتمد</div>' : ''}
        <div class="container">
          <div class="header">
            <h1>طلب توظيف</h1>
            <p>نظام إدارة الأكاديمية الأولمبية لعلوم الرياضة</p>
          </div>
          <div class="details">
            <div><strong>رقم الطلب:</strong> ${data.isNewEmployee ? 'جديد' : '#' + this.employeeId}</div>
            <div><strong>تاريخ الطباعة:</strong> ${today}</div>
          </div>
          <div class="photo-section">
            ${data.imageUrl ? `<img src="${data.imageUrl}" class="employee-photo">` : '<div class="placeholder-photo">📷</div>'}
          </div>
          <h2>📋 المعلومات الشخصية</h2>
          <div class="grid">
            <div class="item"><div class="label">الاسم الكامل</div><div class="value">${this.escapeHtml(data.fullName) || '-'}</div></div>
            <div class="item"><div class="label">رقم الهوية</div><div class="value">${this.escapeHtml(data.nationalId) || '-'}</div></div>
            <div class="item"><div class="label">تاريخ الميلاد</div><div class="value">${data.birthDate ? new Date(data.birthDate).toLocaleDateString('ar-EG') : '-'}</div></div>
            <div class="item"><div class="label">الجنس</div><div class="value">${data.gender?.title || '-'}</div></div>
            <div class="item"><div class="label">نوع الموظف</div><div class="value">${data.employeeType?.title || '-'}</div></div>
            <div class="item"><div class="label">تاريخ التوظيف</div><div class="value">${data.hireDate ? new Date(data.hireDate).toLocaleDateString('ar-EG') : '-'}</div></div>
            ${!data.isNewEmployee ? `<div class="item"><div class="label">الحالة</div><div class="value">${data.isActive ? 'نشط' : 'غير نشط'}</div></div>` : ''}
          </div>
          
          <h2>💰 المعلومات المالية</h2>
          <div class="grid">
            <div class="item"><div class="label">الراتب</div><div class="value amount">${data.salary || 0} جم</div></div>
            <div class="item"><div class="label">الراتب المتبقي</div><div class="value">${data.remainedSalary || 0} جم</div></div>
            <div class="item"><div class="label">نوع الراتب</div><div class="value">${data.salaryType?.title || '-'}</div></div>
            <div class="item"><div class="label">تحديث شهري</div><div class="value">${data.isMonthlyUpdated ? 'مفعل' : 'غير مفعل'}</div></div>
            <div class="item"><div class="label">فترة التحديث</div><div class="value">${data.updatePeriodInDays || 0} يوم</div></div>
          </div>
          
          ${data.departments?.length > 0 ? `
            <h2>🏢 الأقسام (${data.departments.length})</h2>
            <div>${departmentsHtml}</div>
          ` : ''}
          
          ${data.courses?.length > 0 ? `
            <h2>📚 الدورات (${data.courses.length})</h2>
            <div>${coursesHtml}</div>
          ` : ''}
          
          ${data.contacts?.length > 0 ? `
            <h2>📞 جهات الاتصال (${data.contacts.length})</h2>
            <div class="contacts">${contactsHtml}</div>
          ` : ''}
          
          <div class="signature">
            <div class="signature-box"><div class="signature-line"></div><div>توقيع الموظف</div></div>
            <div class="signature-box"><div class="signature-line"></div><div>توقيع مدير الموارد البشرية</div></div>
            <div class="signature-box"><div class="signature-line"></div><div>ختم الأكاديمية</div></div>
          </div>
          <div class="footer">تم التصدير من نظام إدارة الأكاديمية الأولمبية لعلوم الرياضة</div>
        </div>
        <div class="no-print" style="text-align: center; margin-top: 20px;">
          <button onclick="window.print();" style="padding: 10px 20px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; border: none; border-radius: 5px; cursor: pointer;">🖨️ طباعة / حفظ كـ PDF</button>
        </div>
      </body>
      </html>
    `);
    
    printWindow.document.close();
    this.notification.showSuccess('تم فتح نموذج الطلب للطباعة');
  }

  // ============================================================
  // SUBMIT METHODS - MAIN ENTRY POINT
  // ============================================================
  
  submitEmployee(): void {
    if (this.basicInfoForm.invalid) {
      this.notification.showWarning('يرجى تعبئة جميع الحقول المطلوبة بشكل صحيح');
      this.basicInfoForm.markAllAsTouched();
      return;
    }
    
    this.isSubmitting = true;
    const payload = this.buildEmployeePayload();
    
    if (this.isEditMode && this.employeeId) {
      this.updateEmployee(this.employeeId, payload);
    } else {
      this.createEmployee(payload);
    }
  }

  // ============================================================
  // PAYLOAD BUILDER
  // ============================================================
  
  private buildEmployeePayload(): any {
    const genderObj = this.basicInfoForm.get('gender')?.value;
    const employeeTypeObj = this.basicInfoForm.get('employeeType')?.value;
    const salaryTypeObj = this.financialForm.get('salaryType')?.value;
    
    const formatDate = (date: any): string | null => {
      if (!date) return null;
      const d = new Date(date);
      if (isNaN(d.getTime())) return null;
      return d.toISOString().split('T')[0];
    };
    
    const genderEnum = genderObj ? (genderObj.id === 1 ? 'MALE' : 'FEMALE') : null;
    const employeeTypeEnum = employeeTypeObj ? 
      (employeeTypeObj.id === 1 ? 'TRAINER' : 
       employeeTypeObj.id === 3 ? 'LECTURER' : 'MANAGER') : null;

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
    
    return {
      fullName: this.basicInfoForm.get('fullName')?.value?.trim(),
      nationalId: this.basicInfoForm.get('nationalId')?.value?.trim(),
      birthDate: formatDate(this.basicInfoForm.get('birthDate')?.value),
      gender: genderEnum,
      employeeType: employeeTypeEnum,
      salary: Number(this.financialForm.get('salary')?.value) || 0,
      remainedSalary: Number(this.financialForm.get('remainedSalary')?.value) || 0,
      salaryType: salaryTypeEnum,
      hireDate: formatDate(this.basicInfoForm.get('hireDate')?.value),
      departmentIds: this.selectedDepartments.map(d => d.id),
      imageUrl: this.employeeImageFid,
      isMonthlyUpdated: this.financialForm.get('isMonthlyUpdated')?.value || false,
      updatePeriodInDays: Number(this.financialForm.get('updatePeriodInDays')?.value) || 30
    };
  }

  // ============================================================
  // CREATE EMPLOYEE
  // ============================================================
  
  private createEmployee(payload: any): void {
    console.log('📤 Creating employee:', payload);
    
    this.employeeService.createEmployee(payload)
      .pipe(finalize(() => { this.isSubmitting = false; }))
      .subscribe({
        next: (response: NewRecordVTO) => {
          console.log('✅ Employee created:', response);
          const employeeId = response.id;
          
          if (!employeeId) {
            this.notification.showError('حدث خطأ: لم يتم الحصول على معرف الموظف الجديد');
            this.finalizeSubmit();
            return;
          }
          
          // Process all related data
          this.processEmployeeRelations(employeeId);
        },
        error: (err) => {
          console.error('❌ Create error:', err);
          this.handleError(err);
        }
      });
  }

  // ============================================================
  // UPDATE EMPLOYEE
  // ============================================================
  
  private updateEmployee(employeeId: number, payload: any): void {
    payload.isActive = this.basicInfoForm.get('isActive')?.value;
    
    console.log('📤 Updating employee:', payload);
    
    this.employeeService.updateEmployee(employeeId, payload)
      .pipe(finalize(() => { this.isSubmitting = false; }))
      .subscribe({
        next: () => {
          console.log('✅ Employee updated successfully');
          this.processEmployeeRelations(employeeId);
        },
        error: (err) => {
          console.error('❌ Update error:', err);
          this.handleError(err);
        }
      });
  }

  // ============================================================
  // PROCESS EMPLOYEE RELATIONS (Contacts + Assignments)
  // ============================================================
  
  private processEmployeeRelations(employeeId: number): void {
    const departmentIds = this.selectedDepartments.map(d => d.id);
    const courseIds = this.selectedCourses.map(c => c.id);
    
    console.log('📋 Processing relations for employee:', employeeId);
    console.log('  Departments:', departmentIds);
    console.log('  Courses:', courseIds);
    
    // Step 1: Process contacts
    this.processContacts(employeeId)
      .then(() => {
        console.log('✅ Contacts processed');
        
        // Step 2: Handle assignments based on mode
        if (this.isEditMode) {
          this.handleEditAssignments(employeeId, departmentIds, courseIds);
        } else {
          this.handleCreateAssignments(employeeId, departmentIds, courseIds);
        }
      })
      .catch((error) => {
        console.error('❌ Error processing contacts:', error);
        this.notification.showWarning('تم حفظ الموظف ولكن حدث خطأ في جهات الاتصال');
        
        // Continue with assignments
        if (this.isEditMode) {
          this.handleEditAssignments(employeeId, departmentIds, courseIds);
        } else {
          this.handleCreateAssignments(employeeId, departmentIds, courseIds);
        }
      });
  }

  // ============================================================
  // CREATE MODE - ASSIGN ALL
  // ============================================================
  
  private handleCreateAssignments(employeeId: number, departmentIds: number[], courseIds: number[]): void {
    console.log('📋 Create mode: Assigning all departments and courses');
    
    const operations: any[] = [];
    
    // Assign departments
    if (departmentIds.length > 0) {
      const deptData: AssignDepartmentDTO = { departmentId: departmentIds };
      operations.push(this.employeeService.assignDepartmentToTrainer(employeeId, deptData));
    }
    
    // Assign courses
    if (courseIds.length > 0) {
      const courseData: AssignCourseDTO = {
        courseIdToBeAdded: courseIds,
        courseIdToBeDeleted: []
      };
      operations.push(this.employeeService.assignCourseToTrainer(employeeId, courseData));
    }
    
    if (operations.length === 0) {
      console.log('ℹ️ No departments or courses to assign');
      this.finalizeSubmit();
      return;
    }
    
    forkJoin(operations).subscribe({
      next: (results) => {
        console.log('✅ All assignments completed:', results);
        this.refreshAssignmentIds(employeeId);
      },
      error: (err) => {
        console.error('❌ Error in assignments:', err);
        this.notification.showWarning('تم حفظ الموظف ولكن حدث خطأ في إسناد بعض البيانات');
        this.finalizeSubmit();
      }
    });
  }

  // ============================================================
  // EDIT MODE - DIFF ONLY
  // ============================================================
  
  private handleEditAssignments(employeeId: number, departmentIds: number[], courseIds: number[]): void {
    console.log('📋 Edit mode: Calculating assignment differences');
    
    forkJoin({
      currentDepartments: this.employeeService.getTrainerDepartments({ trainerId: employeeId, pageSize: 100 }),
      currentCourses: this.employeeService.getTrainerCourses({ trainerId: employeeId, pageSize: 100 })
    }).subscribe({
      next: (results) => {
        const currentDeptIds = (results.currentDepartments.items || [])
          .map((item: any) => item.department?.id).filter(Boolean);
        const currentCourseIds = (results.currentCourses.items || [])
          .map((item: any) => item.course?.id).filter(Boolean);
        
        const deptsToAdd = departmentIds.filter(id => !currentDeptIds.includes(id));
        const deptsToRemove = currentDeptIds.filter(id => !departmentIds.includes(id));
        const coursesToAdd = courseIds.filter(id => !currentCourseIds.includes(id));
        const coursesToRemove = currentCourseIds.filter(id => !courseIds.includes(id));
        
        console.log('  Changes - Departments:', { add: deptsToAdd, remove: deptsToRemove });
        console.log('  Changes - Courses:', { add: coursesToAdd, remove: coursesToRemove });
        
        const operations: any[] = [];
        
        // Remove departments
        if (deptsToRemove.length > 0) {
          const assignmentsToRemove = (results.currentDepartments.items || [])
            .filter((item: any) => deptsToRemove.includes(item.department?.id))
            .map((item: any) => item.id);
          
          assignmentsToRemove.forEach((id: number) => {
            operations.push(this.employeeService.unassignDepartmentFromTrainer(id));
          });
        }
        
        // Add departments
        if (deptsToAdd.length > 0) {
          operations.push(this.employeeService.assignDepartmentToTrainer(employeeId, { departmentId: deptsToAdd }));
        }
        
        // Remove courses
        if (coursesToRemove.length > 0) {
          const assignmentsToRemove = (results.currentCourses.items || [])
            .filter((item: any) => coursesToRemove.includes(item.course?.id))
            .map((item: any) => item.id);
          
          assignmentsToRemove.forEach((id: number) => {
            operations.push(this.employeeService.unassignCourseFromTrainer(id));
          });
        }
        
        // Add courses
        if (coursesToAdd.length > 0) {
          operations.push(this.employeeService.assignCourseToTrainer(employeeId, {
            courseIdToBeAdded: coursesToAdd,
            courseIdToBeDeleted: []
          }));
        }
        
        if (operations.length === 0) {
          console.log('ℹ️ No assignment changes needed');
          this.finalizeSubmit();
          return;
        }
        
        forkJoin(operations).subscribe({
          next: () => {
            console.log('✅ All assignment changes completed');
            this.refreshAssignmentIds(employeeId);
          },
          error: (err) => {
            console.error('❌ Error in assignments:', err);
            this.notification.showWarning('تم تحديث الموظف ولكن حدث خطأ في إسناد بعض البيانات');
            this.finalizeSubmit();
          }
        });
      },
      error: (err) => {
        console.error('❌ Error fetching current assignments:', err);
        this.notification.showWarning('تم تحديث الموظف ولكن حدث خطأ في تحميل البيانات');
        this.finalizeSubmit();
      }
    });
  }

  // ============================================================
  // REFRESH ASSIGNMENT IDs
  // ============================================================
  
  private refreshAssignmentIds(employeeId: number): void {
    forkJoin({
      departments: this.employeeService.getTrainerDepartments({ trainerId: employeeId, pageSize: 100 }),
      courses: this.employeeService.getTrainerCourses({ trainerId: employeeId, pageSize: 100 })
    }).subscribe({
      next: (results) => {
        console.log('🔄 Refreshing assignment IDs...');
        
        // Refresh departments
        const deptItems = results.departments.items || [];
        this.departmentAssignments.forEach(dept => {
          const found = deptItems.find((item: any) => item.department?.id === dept.id);
          dept.assignmentId = found?.id;
          dept.assigned = !!found;
        });
        
        // Refresh courses
        const courseItems = results.courses.items || [];
        this.courseAssignments.forEach(course => {
          const found = courseItems.find((item: any) => item.course?.id === course.id);
          course.assignmentId = found?.id;
          course.assigned = !!found;
        });
        
        this.cdr.detectChanges();
        this.finalizeSubmit();
      },
      error: () => {
        this.finalizeSubmit();
      }
    });
  }

  // ============================================================
  // FINALIZE & ERROR HANDLING
  // ============================================================
  
  private finalizeSubmit(): void {
    this.notification.showSuccess(
      this.isEditMode ? 'تم تحديث الموظف بنجاح' : 'تم إضافة الموظف بنجاح'
    );
    this.dialogRef.close(true);
    this.isSubmitting = false;
  }

  private handleError(err: any): void {
    this.isSubmitting = false;
    
    if (err.status === 400 && err.error) {
      const error = err.error;
      let errorMessage = error.messageAr || error.messageEn || 'حدث خطأ';
      
      if (error.reqBodyErrors?.length > 0) {
        errorMessage += '\n' + error.reqBodyErrors.join('\n');
      }
      
      this.notification.showError(errorMessage);
    } else {
      this.notification.showError('حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى');
    }
  }
}