import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartmentService } from '../../../../core/services/department.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-department-form',
  template: `
    <div class="form-container">
      <mat-card class="form-card">
        <div class="form-header">
          <button mat-icon-button routerLink="/departments" class="back-btn">
            <mat-icon>arrow_forward</mat-icon>
          </button>
          <div class="header-info">
            <h1 class="form-title">{{ isEditMode ? 'تعديل القسم' : 'إضافة قسم جديد' }}</h1>
            <p class="form-subtitle">{{ isEditMode ? 'تحديث بيانات القسم' : 'إضافة قسم جديد إلى الأكاديمية' }}</p>
          </div>
        </div>

        <form [formGroup]="departmentForm" (ngSubmit)="onSubmit()">
          <div class="form-content">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>اسم القسم *</mat-label>
              <input matInput formControlName="title" placeholder="مثال: قسم السباحة">
              <mat-error *ngIf="departmentForm.get('title')?.hasError('required') && departmentForm.get('title')?.touched">
                اسم القسم مطلوب
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>الوصف</mat-label>
              <textarea matInput formControlName="description" rows="4" placeholder="وصف مختصر للقسم..."></textarea>
            </mat-form-field>

            <div class="status-toggle" *ngIf="isEditMode">
              <div class="toggle-info">
                <mat-icon>info</mat-icon>
                <span>حالة القسم</span>
              </div>
              <mat-slide-toggle formControlName="isActive">
                {{ departmentForm.get('isActive')?.value ? 'نشط' : 'غير نشط' }}
              </mat-slide-toggle>
            </div>
          </div>

          <div class="form-actions">
            <button mat-raised-button color="primary" type="submit" [disabled]="departmentForm.invalid">
              <mat-icon>save</mat-icon>
              {{ isEditMode ? 'تحديث' : 'حفظ' }}
            </button>
            <button mat-stroked-button type="button" routerLink="/departments">
              <mat-icon>close</mat-icon>
              إلغاء
            </button>
          </div>
        </form>
      </mat-card>
    </div>
  `,
  styles: [`
    .form-container { max-width: 700px; margin: 0 auto; padding: 24px; }
    .form-card { border-radius: 20px; overflow: hidden; }
    .form-header { display: flex; align-items: center; gap: 16px; padding: 24px 24px 0 24px; }
    .back-btn { background-color: #f3f4f6; }
    .header-info { flex: 1; }
    .form-title { font-size: 24px; font-weight: 700; margin: 0 0 4px 0; color: #1f2937; }
    .form-subtitle { font-size: 14px; color: #6b7280; margin: 0; }
    .form-content { padding: 24px; display: flex; flex-direction: column; gap: 20px; }
    .full-width { width: 100%; }
    .status-toggle { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-top: 1px solid #e5e7eb; }
    .toggle-info { display: flex; align-items: center; gap: 12px; color: #4b5563; }
    .toggle-info mat-icon { color: #2563eb; }
    .form-actions { display: flex; gap: 16px; padding: 20px 24px 24px 24px; border-top: 1px solid #e5e7eb; background-color: #f9fafb; }
  `]
})
export class DepartmentFormComponent implements OnInit {
  departmentForm: FormGroup;
  isEditMode = false;
  departmentId?: number;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private departmentService: DepartmentService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.departmentForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      isActive: [true]
    });
  }

  ngOnInit() {
    this.departmentId = this.route.snapshot.params['id'];
    if (this.departmentId) {
      this.isEditMode = true;
      this.loadDepartment();
    }
  }

  loadDepartment() {
    if (!this.departmentId) return;
    this.departmentService.getDepartmentSimpleById(this.departmentId).subscribe({
      next: (department: any) => {
        this.departmentForm.patchValue({
          title: department.title,
          description: department.description || '',
          isActive: department.isActive
        });
      },
      error: () => {
        this.notificationService.showError('حدث خطأ في تحميل بيانات القسم');
        this.router.navigate(['/departments']);
      }
    });
  }

  onSubmit() {
    if (this.departmentForm.invalid) {
      this.departmentForm.markAllAsTouched();
      this.notificationService.showWarning('يرجى تعبئة جميع الحقول المطلوبة');
      return;
    }

    this.isSubmitting = true;
    const formData = {
      title: this.departmentForm.value.title,
      description: this.departmentForm.value.description
    };

    if (this.isEditMode && this.departmentId) {
      this.departmentService.updateDepartment(this.departmentId, formData).subscribe({
        next: () => {
          this.notificationService.showSuccess('تم تحديث القسم بنجاح');
          this.router.navigate(['/departments']);
        },
        error: () => {
          this.notificationService.showError('حدث خطأ في تحديث القسم');
          this.isSubmitting = false;
        }
      });
    } else {
      this.departmentService.createDepartment(formData).subscribe({
        next: () => {
          this.notificationService.showSuccess('تم إضافة القسم بنجاح');
          this.router.navigate(['/departments']);
        },
        error: () => {
          this.notificationService.showError('حدث خطأ في إضافة القسم');
          this.isSubmitting = false;
        }
      });
    }
  }
}