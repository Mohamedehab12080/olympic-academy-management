import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../../../core/services/course.service';
import { DepartmentService } from '../../../../core/services/department.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { COURSE_TYPES } from '../../../../core/models/course.model';

@Component({
  selector: 'app-course-form',
  template: `
    <div class="form-container">
      <mat-card>
        <div class="form-header">
          <button mat-icon-button routerLink="/courses"><mat-icon>arrow_forward</mat-icon></button>
          <h2>{{ isEditMode ? 'تعديل دورة' : 'إضافة دورة جديدة' }}</h2>
        </div>

        <form [formGroup]="courseForm" (ngSubmit)="onSubmit()">
          <div class="form-grid">
            <mat-form-field appearance="outline">
              <mat-label>اسم الدورة *</mat-label>
              <input matInput formControlName="title">
              <mat-error *ngIf="courseForm.get('title')?.hasError('required')">اسم الدورة مطلوب</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>القسم *</mat-label>
              <mat-select formControlName="departmentId">
                <mat-option *ngFor="let dept of departments" [value]="dept.id">{{ dept.title }}</mat-option>
              </mat-select>
              <mat-error *ngIf="courseForm.get('departmentId')?.hasError('required')">القسم مطلوب</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>نوع الدورة *</mat-label>
              <mat-select formControlName="courseType">
                <mat-option *ngFor="let type of courseTypes" [value]="type">{{ type.title }}</mat-option>
              </mat-select>
              <mat-error *ngIf="courseForm.get('courseType')?.hasError('required')">نوع الدورة مطلوب</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>المدة (ساعة) *</mat-label>
              <input matInput type="number" formControlName="duration">
              <mat-error *ngIf="courseForm.get('duration')?.hasError('required')">المدة مطلوبة</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>السعر *</mat-label>
              <input matInput type="number" formControlName="price">
              <mat-error *ngIf="courseForm.get('price')?.hasError('required')">السعر مطلوب</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>السعة القصوى</mat-label>
              <input matInput type="number" formControlName="maxCapacity">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>تاريخ البدء *</mat-label>
              <input matInput [matDatepicker]="startPicker" formControlName="startDate">
              <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
              <mat-datepicker #startPicker></mat-datepicker>
              <mat-error *ngIf="courseForm.get('startDate')?.hasError('required')">تاريخ البدء مطلوب</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>تاريخ الانتهاء</mat-label>
              <input matInput [matDatepicker]="endPicker" formControlName="endDate">
              <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
              <mat-datepicker #endPicker></mat-datepicker>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>الوصف</mat-label>
              <textarea matInput formControlName="description" rows="3"></textarea>
            </mat-form-field>
          </div>

          <div class="form-actions">
            <button mat-raised-button color="primary" type="submit" [disabled]="courseForm.invalid">
              <mat-icon>save</mat-icon> {{ isEditMode ? 'تحديث' : 'حفظ' }}
            </button>
            <button mat-stroked-button type="button" routerLink="/courses">إلغاء</button>
          </div>
        </form>
      </mat-card>
    </div>
  `,
  styles: [`
    .form-container { max-width: 900px; margin: 0 auto; padding: 24px; }
    .form-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
    .form-header h2 { margin: 0; font-size: 24px; font-weight: 600; }
    .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
    .full-width { grid-column: span 2; }
    .form-actions { display: flex; gap: 16px; margin-top: 24px; justify-content: flex-end; }
    @media (max-width: 768px) { .form-grid { grid-template-columns: 1fr; } .full-width { grid-column: span 1; } }
  `]
})
export class CourseFormComponent implements OnInit {
  courseForm: FormGroup;
  isEditMode = false;
  courseId?: number;
  departments: any[] = [];
  courseTypes = COURSE_TYPES;

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private departmentService: DepartmentService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.courseForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      departmentId: [null, Validators.required],
      duration: [null, Validators.required],
      maxCapacity: [null],
      startDate: [null, Validators.required],
      endDate: [null],
      courseType: [null, Validators.required],
      price: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.loadDepartments();
    this.courseId = this.route.snapshot.params['id'];
    if (this.courseId) {
      this.isEditMode = true;
      this.loadCourse();
    }
  }

  loadDepartments() {
    this.departmentService.getAllDepartmentsLookup().subscribe({
      next: (res: any) => this.departments = res.list
    });
  }

  loadCourse() {
    this.courseService.getCourseById(this.courseId!).subscribe({
      next: (course: any) => this.courseForm.patchValue(course)
    });
  }

  onSubmit() {
    if (this.courseForm.invalid) return;
    const formData = this.courseForm.value;
    if (this.isEditMode) {
      this.courseService.updateCourse(this.courseId!, formData).subscribe({
        next: () => { this.notificationService.showSuccess('تم تحديث الدورة بنجاح'); this.router.navigate(['/courses']); },
        error: () => this.notificationService.showError('حدث خطأ في تحديث الدورة')
      });
    } else {
      this.courseService.createCourse(formData).subscribe({
        next: () => { this.notificationService.showSuccess('تم إضافة الدورة بنجاح'); this.router.navigate(['/courses']); },
        error: () => this.notificationService.showError('حدث خطأ في إضافة الدورة')
      });
    }
  }
}