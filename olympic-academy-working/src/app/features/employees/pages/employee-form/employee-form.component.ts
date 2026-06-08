import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { EmployeeService } from '../../../../core/services/employee.service';
import { DepartmentService } from '../../../../core/services/department.service';
import { CourseService } from '../../../../core/services/course.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { SearchableSelectComponent, SelectOption } from '../../../../shared/components/searchable-select/searchable-select.component';
import { EMPLOYEE_TYPES } from '../../../../core/models/employee.model';
import { GENDERS, SALARY_TYPES, CONTACT_TYPES } from '../../../../core/models/common.model';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatTabsModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    SearchableSelectComponent
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <div class="form-header">
          <button mat-icon-button routerLink="/employees">
            <mat-icon>arrow_forward</mat-icon>
          </button>
          <h2>{{ isEditMode ? 'تعديل موظف' : 'إضافة موظف جديد' }}</h2>
        </div>

        <mat-tab-group>
          <!-- Basic Information Tab -->
          <mat-tab label="المعلومات الأساسية">
            <div class="tab-content">
              <div class="image-upload-section">
                <div class="image-preview" *ngIf="imagePreview || employeeImageUrl">
                  <img [src]="imagePreview || employeeImageUrl" alt="صورة الموظف">
                  <button mat-icon-button class="remove-image" (click)="removeImage()" *ngIf="imagePreview || employeeImageUrl">
                    <mat-icon>close</mat-icon>
                  </button>
                </div>
                <div class="upload-placeholder" *ngIf="!imagePreview && !employeeImageUrl" (click)="fileInput.click()">
                  <mat-icon>cloud_upload</mat-icon>
                  <p>اضغط لرفع صورة الموظف</p>
                </div>
                <input type="file" #fileInput (change)="onFileSelected($event)" accept="image/*" style="display: none">
                <button mat-stroked-button type="button" (click)="fileInput.click()" *ngIf="!imagePreview && !employeeImageUrl">
                  <mat-icon>upload</mat-icon> اختيار صورة
                </button>
                <button mat-stroked-button type="button" (click)="fileInput.click()" *ngIf="imagePreview || employeeImageUrl">
                  <mat-icon>edit</mat-icon> تغيير الصورة
                </button>
              </div>

              <form [formGroup]="employeeForm">
                <div class="form-grid">
                  <mat-form-field appearance="outline">
                    <mat-label>الاسم الكامل *</mat-label>
                    <input matInput formControlName="fullName">
                    <mat-error *ngIf="employeeForm.get('fullName')?.hasError('required')">الاسم مطلوب</mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>رقم الهوية *</mat-label>
                    <input matInput formControlName="nationalId" maxlength="14">
                    <mat-error *ngIf="employeeForm.get('nationalId')?.hasError('required')">رقم الهوية مطلوب</mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>تاريخ الميلاد</mat-label>
                    <input matInput [matDatepicker]="birthPicker" formControlName="birthDate">
                    <mat-datepicker-toggle matSuffix [for]="birthPicker"></mat-datepicker-toggle>
                    <mat-datepicker #birthPicker></mat-datepicker>
                  </mat-form-field>

                  <app-searchable-select
                    [ngModel]="employeeForm.get('gender')?.value"
                    (ngModelChange)="employeeForm.get('gender')?.setValue($event)"
                    label="الجنس"
                    [options]="genderOptions"
                    [ngModelOptions]="{standalone: true}"
                    class="full-width">
                  </app-searchable-select>

                  <app-searchable-select
                    [ngModel]="employeeForm.get('employeeType')?.value"
                    (ngModelChange)="employeeForm.get('employeeType')?.setValue($event); onEmployeeTypeChange()"
                    label="نوع الموظف *"
                    [options]="employeeTypeOptions"
                    [required]="true"
                    [ngModelOptions]="{standalone: true}"
                    class="full-width">
                  </app-searchable-select>

                  <mat-form-field appearance="outline">
                    <mat-label>تاريخ التوظيف</mat-label>
                    <input matInput [matDatepicker]="hirePicker" formControlName="hireDate">
                    <mat-datepicker-toggle matSuffix [for]="hirePicker"></mat-datepicker-toggle>
                    <mat-datepicker #hirePicker></mat-datepicker>
                  </mat-form-field>
                </div>
              </form>
            </div>
          </mat-tab>

          <!-- Financial Tab -->
          <mat-tab label="المعلومات المالية">
            <div class="tab-content">
              <form [formGroup]="employeeForm">
                <div class="form-grid">
                  <mat-form-field appearance="outline">
                    <mat-label>الراتب</mat-label>
                    <input matInput type="number" formControlName="salary">
                  </mat-form-field>

                  <app-searchable-select
                    [ngModel]="employeeForm.get('salaryType')?.value"
                    (ngModelChange)="employeeForm.get('salaryType')?.setValue($event)"
                    label="نوع الراتب"
                    [options]="salaryTypeOptions"
                    [ngModelOptions]="{standalone: true}"
                    class="full-width">
                  </app-searchable-select>

                  <mat-form-field appearance="outline">
                    <mat-label>الراتب المتبقي</mat-label>
                    <input matInput type="number" formControlName="remainedSalary">
                  </mat-form-field>
                </div>
              </form>
            </div>
          </mat-tab>

          <!-- Departments Tab -->
          <mat-tab label="الأقسام">
            <div class="tab-content">
              <form [formGroup]="employeeForm">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>الأقسام</mat-label>
                  <mat-select formControlName="departmentIds" multiple>
                    <mat-option *ngFor="let dept of departments" [value]="dept.id">
                      {{ dept.title }}
                    </mat-option>
                  </mat-select>
                </mat-form-field>
              </form>
            </div>
          </mat-tab>

          <!-- Contacts Tab -->
          <mat-tab label="جهات الاتصال">
            <div class="tab-content">
              <form [formGroup]="employeeForm">
                <div formArrayName="contacts">
                  <div *ngFor="let contact of contacts.controls; let i=index" [formGroupName]="i" class="contact-row">
                    <app-searchable-select
                      [ngModel]="contact.get('contactType')?.value"
                      (ngModelChange)="contact.get('contactType')?.setValue($event)"
                      label="النوع"
                      [options]="contactTypeOptions"
                      [ngModelOptions]="{standalone: true}"
                      class="contact-type">
                    </app-searchable-select>

                    <mat-form-field appearance="outline" class="contact-value">
                      <mat-label>القيمة</mat-label>
                      <input matInput formControlName="contactValue">
                    </mat-form-field>

                    <button mat-icon-button color="warn" (click)="removeContact(i)" *ngIf="contacts.length > 1" matTooltip="حذف">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                  <button mat-stroked-button type="button" (click)="addContact()">
                    <mat-icon>add</mat-icon> إضافة جهة اتصال
                  </button>
                </div>
              </form>
            </div>
          </mat-tab>

          <!-- Assigned Courses Tab (for Trainers only) -->
          <mat-tab *ngIf="isEditMode && isTrainer" label="الدورات المسندة">
            <div class="tab-content">
              <div class="courses-section">
                <div class="courses-header">
                  <h3>الدورات المسندة للمدرب</h3>
                  <button mat-raised-button color="primary" (click)="openAssignCourseDialog()">
                    <mat-icon>add</mat-icon> إضافة دورة
                  </button>
                </div>

                <div class="table-container" *ngIf="assignedCourses.length > 0; else noCourses">
                  <table mat-table [dataSource]="coursesDataSource" class="full-width-table">
                    <ng-container matColumnDef="courseName">
                      <th mat-header-cell *matHeaderCellDef>اسم الدورة</th>
                      <td mat-cell *matCellDef="let course">{{ course.course?.title || course.title }}</td>
                    </ng-container>

                    <ng-container matColumnDef="assignedOn">
                      <th mat-header-cell *matHeaderCellDef>تاريخ الإسناد</th>
                      <td mat-cell *matCellDef="let course">{{ course.createdOn | date:'dd/MM/yyyy' }}</td>
                    </ng-container>

                    <ng-container matColumnDef="actions">
                      <th mat-header-cell *matHeaderCellDef>الإجراءات</th>
                      <td mat-cell *matCellDef="let course">
                        <button mat-icon-button color="warn" (click)="unassignCourse(course)" matTooltip="إلغاء الإسناد">
                          <mat-icon>delete</mat-icon>
                        </button>
                      </td>
                    </ng-container>

                    <tr mat-header-row *matHeaderRowDef="coursesDisplayedColumns"></tr>
                    <tr mat-row *matRowDef="let row; columns: coursesDisplayedColumns;"></tr>
                  </table>
                </div>
                <ng-template #noCourses>
                  <div class="empty-state">
                    <mat-icon>school</mat-icon>
                    <p>لا توجد دورات مسندة لهذا المدرب</p>
                  </div>
                </ng-template>
              </div>
            </div>
          </mat-tab>
        </mat-tab-group>

        <div class="form-actions">
          <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="employeeForm.invalid || isUploading">
            <mat-icon>save</mat-icon> {{ isEditMode ? 'تحديث' : 'حفظ' }}
          </button>
          <button mat-stroked-button type="button" routerLink="/employees">
            إلغاء
          </button>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .form-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
    }

    .form-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
    }

    .form-header h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }

    .tab-content {
      padding: 24px;
    }

    .image-upload-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
      padding: 20px;
      background: #f9fafb;
      border-radius: 12px;
    }

    .image-preview {
      position: relative;
      width: 150px;
      height: 150px;
      border-radius: 50%;
      overflow: hidden;
      border: 3px solid #2563eb;
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
      background: rgba(0,0,0,0.5);
      color: white;
    }

    .upload-placeholder {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      background: #e5e7eb;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s;
    }

    .upload-placeholder:hover {
      background: #d1d5db;
    }

    .upload-placeholder mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #6b7280;
    }

    .upload-placeholder p {
      margin: 8px 0 0;
      font-size: 12px;
      color: #6b7280;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }

    .full-width {
      width: 100%;
    }

    .contact-row {
      display: grid;
      grid-template-columns: 200px 1fr auto;
      gap: 16px;
      align-items: center;
      margin-bottom: 16px;
    }

    .contact-type {
      width: 100%;
    }

    .contact-value {
      width: 100%;
    }

    .courses-section {
      margin-top: 16px;
    }

    .courses-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .courses-header h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #2563eb;
    }

    .table-container {
      overflow-x: auto;
      margin-top: 16px;
    }

    .full-width-table {
      width: 100%;
    }

    .empty-state {
      text-align: center;
      padding: 60px;
      color: #9ca3af;
    }

    .empty-state mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 16px;
    }

    .form-actions {
      display: flex;
      gap: 16px;
      margin-top: 24px;
      padding: 16px;
      justify-content: flex-end;
      border-top: 1px solid #e5e7eb;
    }

    @media (max-width: 768px) {
      .form-grid {
        grid-template-columns: 1fr;
      }

      .contact-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class EmployeeFormComponent implements OnInit {
  employeeForm: FormGroup;
  isEditMode = false;
  isTrainer = false;
  employeeId?: number;
  isLoading = false;
  isUploading = false;
  
  departments: any[] = [];
  allCourses: any[] = [];
  assignedCourses: any[] = [];
  coursesDataSource = new MatTableDataSource<any>([]);
  coursesDisplayedColumns: string[] = ['courseName', 'assignedOn', 'actions'];
  
  // Image upload
  selectedImage: File | null = null;
  imagePreview: string | null = null;
  employeeImageUrl: string | null = null;
  
  // Options for searchable selects
  genderOptions: SelectOption[] = [];
  employeeTypeOptions: SelectOption[] = [];
  salaryTypeOptions: SelectOption[] = [];
  contactTypeOptions: SelectOption[] = [];

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private courseService: CourseService,
    private notification: NotificationService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.employeeForm = this.fb.group({
      fullName: ['', Validators.required],
      nationalId: ['', Validators.required],
      birthDate: [''],
      gender: [null],
      employeeType: [null, Validators.required],
      salary: [null],
      remainedSalary: [null],
      salaryType: [null],
      hireDate: [''],
      departmentIds: [[]],
      contacts: this.fb.array([])
    });
  }

  get contacts() { return this.employeeForm.get('contacts') as FormArray; }

  addContact() { 
    this.contacts.push(this.fb.group({ 
      contactType: [null], 
      contactValue: [''] 
    })); 
  }
  
  removeContact(index: number) { 
    this.contacts.removeAt(index); 
  }

  ngOnInit(): void {
    this.loadSelectOptions();
    this.loadDepartments();
    this.loadCourses();
    this.addContact(); // Add one empty contact by default
    
    this.employeeId = this.route.snapshot.params['id'];
    if (this.employeeId) { 
      this.isEditMode = true; 
      this.loadEmployee(); 
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
    this.courseService.getAllCourses().subscribe({
      next: (res: any) => {
        this.allCourses = res.items || [];
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل الدورات');
      }
    });
  }

  loadEmployee(): void {
    this.isLoading = true;
    this.employeeService.getEmployeeById(this.employeeId!).subscribe({
      next: (emp: any) => {
        this.employeeForm.patchValue({
          fullName: emp.fullName,
          nationalId: emp.nationalId,
          birthDate: emp.birthDate,
          gender: emp.gender,
          employeeType: emp.employeeType,
          salary: emp.salary,
          remainedSalary: emp.remainedSalary,
          salaryType: emp.salaryType,
          hireDate: emp.hireDate,
          departmentIds: emp.departments?.map((d: any) => d.id) || []
        });
        
        // Set employee image URL
        if (emp.imageUrl) {
          this.employeeImageUrl = emp.imageUrl;
        }
        
        // Check if employee is a trainer
        this.isTrainer = emp.employeeType?.id === 1;
        
        // Load contacts
        if (emp.contacts?.length) {
          while (this.contacts.length) this.contacts.removeAt(0);
          emp.contacts.forEach((c: any) => {
            this.contacts.push(this.fb.group({ 
              contactType: [c.contactType], 
              contactValue: [c.contactValue] 
            }));
          });
        }
        
        // Load assigned courses for trainers
        if (this.isTrainer) {
          this.loadAssignedCourses();
        }
        
        this.isLoading = false;
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل بيانات الموظف');
        this.isLoading = false;
      }
    });
  }

  loadAssignedCourses(): void {
    if (!this.employeeId) return;
    
    this.employeeService.getTrainerCourses(this.employeeId).subscribe({
      next: (res: any) => {
        this.assignedCourses = res.items || [];
        this.coursesDataSource.data = this.assignedCourses;
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل الدورات المسندة');
      }
    });
  }

  onEmployeeTypeChange(): void {
    const employeeType = this.employeeForm.get('employeeType')?.value;
    this.isTrainer = employeeType?.id === 1;
    
    if (this.isEditMode && this.isTrainer && this.employeeId) {
      this.loadAssignedCourses();
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedImage = input.files[0];
      
      // Create preview
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
    this.employeeImageUrl = null;
  }

  async uploadImage(): Promise<string | null> {
    if (!this.selectedImage) return this.employeeImageUrl;
    
    this.isUploading = true;
    
    // Create form data for upload
    const formData = new FormData();
    formData.append('file', this.selectedImage);
    
    // Call your upload service (adjust endpoint as needed)
    try {
      const response = await this.employeeService.uploadEmployeeImage(formData).toPromise();
      this.isUploading = false;
      return response?.imageUrl || null;
    } catch (error) {
      this.isUploading = false;
      this.notification.showError('حدث خطأ في رفع الصورة');
      return null;
    }
  }

  openAssignCourseDialog(): void {
    const availableCourses = this.allCourses.filter(
      course => !this.assignedCourses.some(assigned => assigned.course?.id === course.id)
    );
    
    const dialogRef = this.dialog.open(AssignCourseDialogComponent, {
      width: '500px',
      data: {
        courses: availableCourses,
        employeeId: this.employeeId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.employeeService.assignCourseToTrainer(this.employeeId!, { courseId: result }).subscribe({
          next: () => {
            this.notification.showSuccess('تم إسناد الدورة بنجاح');
            this.loadAssignedCourses();
          },
          error: () => {
            this.notification.showError('حدث خطأ في إسناد الدورة');
          }
        });
      }
    });
  }

  unassignCourse(course: any): void {
    const courseId = course.course?.id || course.id;
    const courseName = course.course?.title || course.title;
    
    if (confirm(`هل أنت متأكد من إلغاء إسناد دورة "${courseName}"؟`)) {
      this.employeeService.unassignCourseFromTrainer(this.employeeId!, courseId).subscribe({
        next: () => {
          this.notification.showSuccess('تم إلغاء إسناد الدورة بنجاح');
          this.loadAssignedCourses();
        },
        error: () => {
          this.notification.showError('حدث خطأ في إلغاء إسناد الدورة');
        }
      });
    }
  }

  async onSubmit(): Promise<void> {
    if (this.employeeForm.invalid) {
      this.notification.showWarning('يرجى تعبئة جميع الحقول المطلوبة');
      return;
    }
    
    this.isLoading = true;
    
    // Upload image first if selected
    let imageUrl = this.employeeImageUrl;
    if (this.selectedImage) {
      imageUrl = await this.uploadImage();
      if (!imageUrl && this.selectedImage) {
        this.isLoading = false;
        return;
      }
    }
    
    const formData = this.employeeForm.value;
    formData.imageUrl = imageUrl;
    formData.contacts = formData.contacts.filter((c: any) => c.contactType && c.contactValue);
    
    if (this.isEditMode) {
      this.employeeService.updateEmployee(this.employeeId!, formData).subscribe({
        next: () => {
          this.notification.showSuccess('تم تحديث الموظف بنجاح');
          this.router.navigate(['/employees']);
          this.isLoading = false;
        },
        error: (err) => {
          this.notification.showError(err.error?.messageEn || 'حدث خطأ في تحديث الموظف');
          this.isLoading = false;
        }
      });
    } else {
      this.employeeService.createEmployee(formData).subscribe({
        next: (res) => {
          this.notification.showSuccess('تم إضافة الموظف بنجاح');
          this.router.navigate(['/employees', res.id]);
          this.isLoading = false;
        },
        error: (err) => {
          this.notification.showError(err.error?.messageEn || 'حدث خطأ في إضافة الموظف');
          this.isLoading = false;
        }
      });
    }
  }
}

// Assign Course Dialog Component
@Component({
  selector: 'app-assign-course-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    SearchableSelectComponent
  ],
  template: `
    <h2 mat-dialog-title>إسناد دورة للمدرب</h2>
    <mat-dialog-content>
      <div class="dialog-form">
        <app-searchable-select
          [(ngModel)]="selectedCourseId"
          label="اختر الدورة"
          [options]="courseOptions"
          [required]="true"
          class="full-width">
        </app-searchable-select>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>إلغاء</button>
      <button mat-raised-button color="primary" [disabled]="!selectedCourseId" (click)="save()">
        <mat-icon>add</mat-icon> إسناد
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 400px;
      padding: 16px 0;
    }
    .full-width {
      width: 100%;
    }
  `]
})
export class AssignCourseDialogComponent {
  selectedCourseId: number | null = null;
  courseOptions: SelectOption[] = [];

  constructor(
    public dialogRef: MatDialogRef<AssignCourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.courseOptions = (data.courses || []).map((course: any) => ({
      value: course.id,
      label: course.title
    }));
  }

  save(): void {
    if (this.selectedCourseId) {
      this.dialogRef.close(this.selectedCourseId);
    }
  }
}