import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { MatTooltipModule } from '@angular/material/tooltip';

import { CourseService } from '../../../../core/services/course.service';
import { DepartmentService } from '../../../../core/services/department.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { SearchableSelectComponent, SelectOption } from '../../../../shared/components/searchable-select/searchable-select.component';
import { COURSE_TYPES, CourseType } from '../../../../core/models/course.model';

@Component({
  selector: 'app-course-wizard-modal',
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
    SearchableSelectComponent
  ],
  template: `
    <div class="wizard-container" dir="rtl">
      <!-- Header -->
      <div class="wizard-header">
        <div class="header-title">
          <mat-icon>{{ isEditMode ? 'edit' : 'add_circle' }}</mat-icon>
          <h2>{{ isEditMode ? 'تعديل دورة' : 'إضافة دورة جديدة' }}</h2>
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
                <mat-icon>info</mat-icon>
                <span>المعلومات الأساسية</span>
              </div>
            </ng-template>
            <div class="step-content">
              <form [formGroup]="basicInfoForm">
                <div class="form-grid">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>اسم الدورة *</mat-label>
                    <input matInput formControlName="title">
                    <mat-error *ngIf="basicInfoForm.get('title')?.hasError('required')">اسم الدورة مطلوب</mat-error>
                  </mat-form-field>

                  <app-searchable-select
                    [ngModel]="basicInfoForm.get('departmentId')?.value"
                    (ngModelChange)="basicInfoForm.get('departmentId')?.setValue($event)"
                    label="القسم *"
                    [options]="departmentOptions"
                    [required]="true"
                    [ngModelOptions]="{standalone: true}">
                  </app-searchable-select>

                  <app-searchable-select
                    [ngModel]="basicInfoForm.get('courseType')?.value"
                    (ngModelChange)="basicInfoForm.get('courseType')?.setValue($event)"
                    label="نوع الدورة *"
                    [options]="courseTypeOptions"
                    [required]="true"
                    [ngModelOptions]="{standalone: true}">
                  </app-searchable-select>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>المدة (ساعة) *</mat-label>
                    <input matInput type="number" formControlName="duration">
                    <mat-error *ngIf="basicInfoForm.get('duration')?.hasError('required')">المدة مطلوبة</mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>السعر *</mat-label>
                    <input matInput type="number" formControlName="price">
                    <span matSuffix>جم</span>
                    <mat-error *ngIf="basicInfoForm.get('price')?.hasError('required')">السعر مطلوب</mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>السعة القصوى</mat-label>
                    <input matInput type="number" formControlName="maxCapacity">
                    <span matSuffix>متدرب</span>
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

          <!-- Step 2: Dates & Description -->
          <mat-step>
            <ng-template matStepLabel>
              <div class="step-label">
                <mat-icon>event</mat-icon>
                <span>التواريخ والوصف</span>
              </div>
            </ng-template>
            <div class="step-content">
              <form [formGroup]="datesForm">
                <div class="form-grid">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>تاريخ البدء *</mat-label>
                    <input matInput [matDatepicker]="startPicker" formControlName="startDate">
                    <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
                    <mat-datepicker #startPicker></mat-datepicker>
                    <mat-error *ngIf="datesForm.get('startDate')?.hasError('required')">تاريخ البدء مطلوب</mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>تاريخ الانتهاء</mat-label>
                    <input matInput [matDatepicker]="endPicker" formControlName="endDate">
                    <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
                    <mat-datepicker #endPicker></mat-datepicker>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width full-width-row">
                    <mat-label>الوصف</mat-label>
                    <textarea matInput formControlName="description" rows="4" placeholder="وصف الدورة..."></textarea>
                  </mat-form-field>
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

          <!-- Step 3: Summary & Submit -->
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
                    <div><strong>اسم الدورة:</strong> {{ basicInfoForm.get('title')?.value }}</div>
                    <div><strong>القسم:</strong> {{ getDepartmentName() }}</div>
                    <div><strong>نوع الدورة:</strong> {{ getCourseTypeName() }}</div>
                    <div><strong>المدة:</strong> {{ basicInfoForm.get('duration')?.value }} ساعة</div>
                    <div><strong>السعر:</strong> {{ basicInfoForm.get('price')?.value | currency:'EGP' }}</div>
                    <div><strong>السعة القصوى:</strong> {{ basicInfoForm.get('maxCapacity')?.value || 'غير محدد' }}</div>
                  </div>
                </mat-card>

                <mat-card class="summary-card">
                  <mat-card-title>التواريخ والوصف</mat-card-title>
                  <div class="summary-grid">
                    <div><strong>تاريخ البدء:</strong> {{ datesForm.get('startDate')?.value | date:'dd/MM/yyyy' }}</div>
                    <div><strong>تاريخ الانتهاء:</strong> {{ datesForm.get('endDate')?.value | date:'dd/MM/yyyy'  }}</div>
                    <div class="full-width"><strong>الوصف:</strong> {{ datesForm.get('description')?.value || '-' }}</div>
                  </div>
                </mat-card>
              </div>
            </div>
            <div class="step-actions">
              <button mat-stroked-button matStepperPrevious>
                <mat-icon>arrow_forward</mat-icon> السابق
              </button>
              <button mat-raised-button color="primary" (click)="submitCourse()" [disabled]="isSubmitting">
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
      min-width: 650px;
      max-width: 850px;
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
      background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
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

    .full-width-row {
      grid-column: span 2;
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
      color: #2563eb;
      margin-bottom: 12px;
    }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
    .full-width {
      grid-column: span 2;
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
      .full-width-row {
        grid-column: span 1;
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
export class CourseWizardModalComponent implements OnInit {
  @ViewChild('stepper') stepper!: MatStepper;
  
  basicInfoForm: FormGroup;
  datesForm: FormGroup;
  
  departments: any[] = [];
  courseTypes = COURSE_TYPES;
  
  departmentOptions: SelectOption[] = [];
  courseTypeOptions: SelectOption[] = [];
  
  isLoading = false;
  isSubmitting = false;
  isEditMode = false;
  courseId: number | null = null;

  constructor(
    private dialogRef: MatDialogRef<CourseWizardModalComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { courseId?: number },
    private fb: FormBuilder,
    private courseService: CourseService,
    private departmentService: DepartmentService,
    private notification: NotificationService
  ) {
    this.isEditMode = !!data?.courseId;
    this.courseId = data?.courseId || null;
    
    this.basicInfoForm = this.fb.group({
      title: ['', Validators.required],
      departmentId: [null, Validators.required],
      courseType: [null, Validators.required],
      duration: [null, Validators.required],
      price: [null, Validators.required],
      maxCapacity: [null]
    });
    
    this.datesForm = this.fb.group({
      startDate: [null, Validators.required],
      endDate: [null],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.loadSelectOptions();
    this.loadDepartments();
    
    if (this.isEditMode && this.courseId) {
      this.loadCourseData();
    }
  }

  loadSelectOptions(): void {
    // Store full course type object for display
    this.courseTypeOptions = COURSE_TYPES.map(t => ({ 
      value: t,  // Full object with id, title, and value
      label: t.title 
    }));
  }

  loadDepartments(): void {
    this.departmentService.getAllDepartmentsLookup().subscribe({
      next: (res: any) => {
        this.departments = res.list || [];
        this.departmentOptions = this.departments.map(d => ({ value: d.id, label: d.title }));
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل الأقسام');
      }
    });
  }

  loadCourseData(): void {
    this.isLoading = true;
    this.courseService.getCourseById(this.courseId!).subscribe({
      next: (course: any) => {
        // Find matching course type from the enum constant string or object
        let courseTypeObj = null;
        
        if (course.courseType) {
          // If backend returns LookupVTO (has id and title)
          if (typeof course.courseType === 'object' && course.courseType.title) {
            courseTypeObj = COURSE_TYPES.find(ct => ct.title === course.courseType.title);
          }
          // If backend returns string (enum constant like "QUALIFICATION")
          else if (typeof course.courseType === 'string') {
            // Try matching by enum value first
            courseTypeObj = COURSE_TYPES.find(ct => ct.value === course.courseType);
            // If not found, try matching by title
            if (!courseTypeObj) {
              courseTypeObj = COURSE_TYPES.find(ct => ct.title === course.courseType);
            }
          }
        }
        
        this.basicInfoForm.patchValue({
          title: course.title,
          departmentId: course.department?.id,
          courseType: courseTypeObj || null,
          duration: course.duration,
          price: course.price,
          maxCapacity: course.maxCapacity
        });
        
        this.datesForm.patchValue({
          startDate: course.startDate,
          endDate: course.endDate,
          description: course.description
        });
        
        this.isLoading = false;
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل بيانات الدورة');
        this.isLoading = false;
      }
    });
  }

  getDepartmentName(): string {
    const deptId = this.basicInfoForm.get('departmentId')?.value;
    const dept = this.departments.find(d => d.id === deptId);
    return dept?.title || '-';
  }

  getCourseTypeName(): string {
    const courseType = this.basicInfoForm.get('courseType')?.value;
    if (courseType) {
      if (typeof courseType === 'object') {
        return courseType.title;
      }
      // If it's a string, try to find matching CourseType
      const found = COURSE_TYPES.find(ct => ct.title === courseType || ct.value === courseType);
      return found?.title || courseType;
    }
    return '-';
  }

  printPreview(): void {
    const previewData = {
      ...this.basicInfoForm.value,
      ...this.datesForm.value,
      departmentName: this.getDepartmentName(),
      courseTypeName: this.getCourseTypeName(),
      isNewCourse: !this.isEditMode,
      id: this.courseId || 'جديد'
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
        <title>بيانات الدورة - ${data.title}</title>
        <style>
          * { font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif; }
          @media print { body { margin: 0; padding: 20px; } .no-print { display: none; } }
          .course-container { max-width: 800px; margin: 0 auto; background: white; }
          .header { text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); color: white; border-radius: 12px; }
          .header h1 { margin: 0; font-size: 24px; }
          .header p { margin: 10px 0 0 0; font-size: 12px; opacity: 0.9; }
          .course-details { display: flex; justify-content: space-between; margin-bottom: 20px; padding: 10px; background: #f9fafb; border-radius: 8px; }
          h2 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 8px; margin-top: 24px; margin-bottom: 16px; font-size: 18px; }
          .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 16px; }
          .info-item { border-bottom: 1px solid #e5e7eb; padding: 8px 0; }
          .info-label { font-weight: 600; color: #374151; font-size: 13px; margin-bottom: 4px; }
          .info-value { color: #1f2937; font-size: 14px; }
          .full-width { grid-column: span 2; }
          .signature-section { margin-top: 40px; display: flex; justify-content: space-between; align-items: flex-end; gap: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
          .signature-box { text-align: center; flex: 1; }
          .signature-line { width: 100%; border-top: 1px solid #000; margin-top: 40px; padding-top: 8px; }
          .footer { text-align: center; margin-top: 30px; padding: 16px; font-size: 10px; color: #9ca3af; }
          .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); opacity: 0.1; font-size: 60px; white-space: nowrap; pointer-events: none; }
          @media print { .watermark { display: none; } }
          @media (max-width: 600px) { .info-grid { grid-template-columns: 1fr; } .signature-section { flex-direction: column; align-items: center; gap: 30px; } }
        </style>
      </head>
      <body>
        ${data.isNewCourse ? '<div class="watermark">مسودة - غير معتمد</div>' : ''}
        <div class="course-container">
          <div class="header">
            <h1>بيانات الدورة التدريبية</h1>
            <p>نظام إدارة الأكاديمية الأولمبية</p>
          </div>
          <div class="course-details">
            <div><strong>رقم الدورة:</strong> ${data.isNewCourse ? 'جديد' : '#' + data.id}</div>
            <div><strong>تاريخ الطباعة:</strong> ${today}</div>
          </div>
          <h2>📋 المعلومات الأساسية</h2>
          <div class="info-grid">
            <div class="info-item"><div class="info-label">اسم الدورة</div><div class="info-value">${data.title || '-'}</div></div>
            <div class="info-item"><div class="info-label">القسم</div><div class="info-value">${data.departmentName || '-'}</div></div>
            <div class="info-item"><div class="info-label">نوع الدورة</div><div class="info-value">${data.courseTypeName || '-'}</div></div>
            <div class="info-item"><div class="info-label">المدة</div><div class="info-value">${data.duration || 0} ساعة</div></div>
            <div class="info-item"><div class="info-label">السعر</div><div class="info-value">${(data.price || 0).toLocaleString('ar-EG')} جم</div></div>
            <div class="info-item"><div class="info-label">السعة القصوى</div><div class="info-value">${data.maxCapacity || 'غير محدد'}</div></div>
          </div>
          <h2>📅 التواريخ</h2>
          <div class="info-grid">
            <div class="info-item"><div class="info-label">تاريخ البدء</div><div class="info-value">${data.startDate ? new Date(data.startDate).toLocaleDateString('ar-EG') : '-'}</div></div>
            <div class="info-item"><div class="info-label">تاريخ الانتهاء</div><div class="info-value">${data.endDate ? new Date(data.endDate).toLocaleDateString('ar-EG') : '-'}</div></div>
          </div>
          ${data.description ? `<h2>📝 الوصف</h2><div class="info-item full-width">${data.description}</div>` : ''}
          <div class="signature-section">
            <div class="signature-box"><div class="signature-line"></div><div>توقيع مدير القسم</div></div>
            <div class="signature-box"><div class="signature-line"></div><div>توقيع المدير الأكاديمي</div></div>
            <div class="signature-box"><div class="signature-line"></div><div>ختم الأكاديمية</div></div>
          </div>
          <div class="footer">تم التصدير من نظام إدارة الأكاديمية الأولمبية</div>
        </div>
        <div class="no-print" style="text-align: center; margin-top: 20px;">
          <button onclick="window.print();" style="padding: 10px 20px; background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); color: white; border: none; border-radius: 5px; cursor: pointer;">🖨️ طباعة / حفظ كـ PDF</button>
        </div>
      </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank', 'width=800,height=800,scrollbars=yes');
    if (printWindow) {
      printWindow.document.write(printContainer.innerHTML);
      printWindow.document.close();
      this.notification.showSuccess('تم فتح نموذج الدورة - يمكنك طباعته');
    } else {
      document.body.appendChild(printContainer);
      window.print();
      setTimeout(() => { document.body.removeChild(printContainer); }, 500);
    }
  }

  submitCourse(): void {
    if (this.basicInfoForm.invalid || this.datesForm.invalid) {
      this.notification.showWarning('يرجى تعبئة جميع الحقول المطلوبة');
      return;
    }
    
    this.isSubmitting = true;
    
    const courseTypeObj = this.basicInfoForm.get('courseType')?.value;
    
    // CRITICAL: Send the enum constant (QUALIFICATION or TRAINING)
    // This matches what your backend expects for CourseTypes enum
    const courseData: any = {
      title: this.basicInfoForm.get('title')?.value,
      description: this.datesForm.get('description')?.value || null,
      departmentId: this.basicInfoForm.get('departmentId')?.value,
      duration: this.basicInfoForm.get('duration')?.value,
      maxCapacity: this.basicInfoForm.get('maxCapacity')?.value || null,
      startDate: this.datesForm.get('startDate')?.value,
      endDate: this.datesForm.get('endDate')?.value || null,
      imageUrl: null,
      courseType: courseTypeObj?.value, // This sends "QUALIFICATION" or "TRAINING"
      price: this.basicInfoForm.get('price')?.value
    };
    
    console.log('Sending course data:', courseData); // Debug: Should show courseType as "QUALIFICATION" or "TRAINING"
    
    if (this.isEditMode && this.courseId) {
      this.courseService.updateCourse(this.courseId, courseData).subscribe({
        next: () => {
          this.notification.showSuccess('تم تحديث الدورة بنجاح');
          this.dialogRef.close(true);
          this.isSubmitting = false;
        },
        error: (err) => {
          console.error('Update error:', err);
          this.notification.showError(err.error?.messageEn || 'حدث خطأ في تحديث الدورة');
          this.isSubmitting = false;
        }
      });
    } else {
      this.courseService.createCourse(courseData).subscribe({
        next: () => {
          this.notification.showSuccess('تم إضافة الدورة بنجاح');
          this.dialogRef.close(true);
          this.isSubmitting = false;
        },
        error: (err) => {
          console.error('Create error:', err);
          console.error('Error details:', err.error);
          this.notification.showError(err.error?.messageEn || 'حدث خطأ في إضافة الدورة');
          this.isSubmitting = false;
        }
      });
    }
  }
}