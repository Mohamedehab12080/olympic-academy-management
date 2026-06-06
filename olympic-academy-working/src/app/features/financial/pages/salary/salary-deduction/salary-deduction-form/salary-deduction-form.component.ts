import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FinancialService } from '../../../../../../core/services/financial.service';
import { EmployeeService } from '../../../../../../core/services/employee.service';
import { NotificationService } from '../../../../../../core/services/notification.service';
import { SALARY_TYPES } from '../../../../../../core/models/common.model';

@Component({
  selector: 'app-salary-deduction-form',
  standalone: false,
  template: `
    <div class="form-container">
      <mat-card>
        <div class="form-header">
          <button mat-icon-button routerLink="/financial/salary-deductions">
            <mat-icon>arrow_forward</mat-icon>
          </button>
          <h2>{{ isEditMode ? 'تعديل خصم' : 'إضافة خصم جديد' }}</h2>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-grid">
            <!-- الموظف -->
            <mat-form-field appearance="outline">
              <mat-label>الموظف *</mat-label>
              <mat-select formControlName="employeeId">
                <mat-option *ngFor="let emp of employees" [value]="emp.id">
                  {{ emp.title }}
                </mat-option>
              </mat-select>
              <mat-error *ngIf="form.get('employeeId')?.hasError('required')">الموظف مطلوب</mat-error>
            </mat-form-field>

            <!-- المبلغ -->
            <mat-form-field appearance="outline">
              <mat-label>المبلغ *</mat-label>
              <input matInput type="number" formControlName="amountDeducted" placeholder="مثال: 500">
              <span matSuffix>ريال</span>
              <mat-error *ngIf="form.get('amountDeducted')?.hasError('required')">المبلغ مطلوب</mat-error>
              <mat-error *ngIf="form.get('amountDeducted')?.hasError('min')">المبلغ يجب أن يكون أكبر من 0</mat-error>
            </mat-form-field>

            <!-- تاريخ الخصم -->
            <mat-form-field appearance="outline">
              <mat-label>تاريخ الخصم *</mat-label>
              <input matInput [matDatepicker]="datePicker" formControlName="deductionDate">
              <mat-datepicker-toggle matSuffix [for]="datePicker"></mat-datepicker-toggle>
              <mat-datepicker #datePicker></mat-datepicker>
              <mat-error *ngIf="form.get('deductionDate')?.hasError('required')">تاريخ الخصم مطلوب</mat-error>
            </mat-form-field>

            <!-- نوع الراتب -->
            <mat-form-field appearance="outline">
              <mat-label>نوع الراتب</mat-label>
              <mat-select formControlName="salaryType">
                <mat-option *ngFor="let type of salaryTypes" [value]="type">
                  {{ type.title }}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <!-- السبب -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>سبب الخصم</mat-label>
              <input matInput formControlName="reason" placeholder="مثال: غياب بدون عذر, تأخير متكرر">
            </mat-form-field>

            <!-- ملاحظات -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>ملاحظات إضافية</mat-label>
              <textarea matInput formControlName="note" rows="3" placeholder="تفاصيل إضافية عن الخصم..."></textarea>
            </mat-form-field>

            <!-- رفع صورة (اختياري) -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>رابط الصورة</mat-label>
              <input matInput formControlName="imageUrl" placeholder="https://example.com/image.jpg">
              <mat-icon matSuffix>image</mat-icon>
            </mat-form-field>
          </div>

          <div class="form-actions">
            <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">
              <mat-icon>save</mat-icon> {{ isEditMode ? 'تحديث' : 'حفظ' }}
            </button>
            <button mat-stroked-button type="button" routerLink="/financial/salary-deductions">
              <mat-icon>close</mat-icon> إلغاء
            </button>
          </div>
        </form>
      </mat-card>
    </div>
  `,
  styles: [`
    .form-container { max-width: 800px; margin: 0 auto; padding: 24px; }
    .form-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
    .form-header h2 { margin: 0; font-size: 24px; font-weight: 600; }
    .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
    .full-width { grid-column: span 2; }
    .form-actions { display: flex; gap: 16px; justify-content: flex-end; margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb; }
    .form-actions button { min-width: 120px; }
  `]
})
export class SalaryDeductionFormComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  itemId?: number;
  employees: any[] = [];
  salaryTypes = SALARY_TYPES;

  constructor(
    private fb: FormBuilder,
    private financialService: FinancialService,
    private employeeService: EmployeeService,
    private notification: NotificationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      employeeId: [null, [Validators.required]],
      amountDeducted: [null, [Validators.required, Validators.min(1)]],
      deductionDate: [null, [Validators.required]],
      salaryType: [null],
      reason: [''],
      note: [''],
      imageUrl: ['']
    });
  }

  ngOnInit() {
    this.loadEmployees();
    this.itemId = this.route.snapshot.params['id'];
    if (this.itemId) {
      this.isEditMode = true;
      this.loadItemData();
    }
  }

  loadEmployees() {
    this.employeeService.getAllEmployeesLookup().subscribe({
      next: (res: any) => { this.employees = res.list; },
      error: () => { this.notification.showError('حدث خطأ في تحميل بيانات الموظفين'); }
    });
  }

  loadItemData() {
    if (!this.itemId) return;
    this.financialService.getSalaryDeductionById(this.itemId).subscribe({
      next: (res: any) => {
        this.form.patchValue({
          employeeId: res.employee?.id,
          amountDeducted: res.amountDeducted,
          deductionDate: res.deductionDate,
          salaryType: res.salaryType,
          reason: res.reason,
          note: res.note,
          imageUrl: res.imageUrl
        });
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل بيانات الخصم');
        this.router.navigate(['/financial/salary-deductions']);
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notification.showWarning('يرجى تعبئة جميع الحقول المطلوبة');
      return;
    }

    const formData = this.form.value;

    if (this.isEditMode && this.itemId) {
      this.financialService.updateSalaryDeduction(this.itemId, formData).subscribe({
        next: () => {
          this.notification.showSuccess('تم تحديث الخصم بنجاح');
          this.router.navigate(['/financial/salary-deductions']);
        },
        error: () => {
          this.notification.showError('حدث خطأ في تحديث الخصم');
        }
      });
    } else {
      this.financialService.createSalaryDeduction(formData).subscribe({
        next: () => {
          this.notification.showSuccess('تم إضافة الخصم بنجاح');
          this.router.navigate(['/financial/salary-deductions']);
        },
        error: () => {
          this.notification.showError('حدث خطأ في إضافة الخصم');
        }
      });
    }
  }
}