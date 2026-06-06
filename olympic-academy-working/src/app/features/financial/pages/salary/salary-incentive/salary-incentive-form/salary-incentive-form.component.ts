import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FinancialService } from '../../../../../../core/services/financial.service';
import { EmployeeService } from '../../../../../../core/services/employee.service';
import { NotificationService } from '../../../../../../core/services/notification.service';
import { SALARY_TYPES } from '../../../../../../core/models/common.model';
import {SALARY_TRANSACTION_TYPES} from '../../../../../../core/models/financial.model';

@Component({
  selector: 'app-salary-incentive-form',
  template: `
    <div class="form-container"><mat-card><div class="form-header"><button mat-icon-button routerLink="/financial/salary-incentives"><mat-icon>arrow_forward</mat-icon></button><h2>{{ isEditMode ? 'تعديل حافز' : 'إضافة حافز جديد' }}</h2></div>
    <form [formGroup]="form" (ngSubmit)="onSubmit()"><div class="form-grid">
      <mat-form-field appearance="outline"><mat-label>الموظف *</mat-label><mat-select formControlName="employeeId"><mat-option *ngFor="let e of employees" [value]="e.id">{{ e.title }}</mat-option></mat-select></mat-form-field>
      <mat-form-field appearance="outline"><mat-label>نوع الحافز *</mat-label><mat-select formControlName="type"><mat-option *ngFor="let t of transactionTypes" [value]="t">{{ t.title }}</mat-option></mat-select></mat-form-field>
      <mat-form-field appearance="outline"><mat-label>المبلغ *</mat-label><input matInput type="number" formControlName="amountWithdrawn"></mat-form-field>
      <mat-form-field appearance="outline"><mat-label>التاريخ *</mat-label><input matInput [matDatepicker]="datePicker" formControlName="withdrawDate"><mat-datepicker-toggle matSuffix [for]="datePicker"></mat-datepicker-toggle><mat-datepicker #datePicker></mat-datepicker></mat-form-field>
      <mat-form-field appearance="outline"><mat-label>طريقة الدفع</mat-label><mat-select formControlName="paymentMethodId"><mat-option *ngFor="let p of paymentMethods" [value]="p.id">{{ p.title }}</mat-option></mat-select></mat-form-field>
      <mat-form-field appearance="outline"><mat-label>نوع الراتب</mat-label><mat-select formControlName="salaryType"><mat-option *ngFor="let s of salaryTypes" [value]="s">{{ s.title }}</mat-option></mat-select></mat-form-field>
      <mat-form-field appearance="outline" class="full-width"><mat-label>ملاحظات</mat-label><textarea matInput formControlName="note" rows="3"></textarea></mat-form-field>
    </div><div class="form-actions"><button mat-raised-button color="primary" type="submit"><mat-icon>save</mat-icon> {{ isEditMode ? 'تحديث' : 'حفظ' }}</button><button mat-stroked-button type="button" routerLink="/financial/salary-incentives">إلغاء</button></div></form></mat-card></div>
  `,
  styles: [`.form-container { max-width: 800px; margin: 0 auto; padding: 24px; } .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; } .full-width { grid-column: span 2; } .form-actions { display: flex; gap: 16px; justify-content: flex-end; margin-top: 24px; }`]
})
export class SalaryIncentiveFormComponent implements OnInit {
  form: FormGroup; isEditMode = false; itemId?: number;
  employees: any[] = []; paymentMethods: any[] = [];
  transactionTypes = SALARY_TRANSACTION_TYPES; salaryTypes = SALARY_TYPES;

  constructor(private fb: FormBuilder, private financialService: FinancialService, private employeeService: EmployeeService, private notification: NotificationService, private route: ActivatedRoute, private router: Router) {
    this.form = this.fb.group({ employeeId: [null, Validators.required], type: [null, Validators.required], amountWithdrawn: [null, Validators.required], withdrawDate: [null, Validators.required], paymentMethodId: [null], salaryType: [null], note: [''] });
  }

  ngOnInit() {
    this.loadEmployees(); this.loadPaymentMethods();
    this.itemId = this.route.snapshot.params['id'];
    if (this.itemId) { this.isEditMode = true; this.financialService.getSalaryIncentiveById(this.itemId).subscribe((res: any) => this.form.patchValue(res)); }
  }

  loadEmployees() { this.employeeService.getAllEmployeesLookup().subscribe((res: any) => this.employees = res.list); }
  loadPaymentMethods() { this.financialService.getAllPaymentMethodsLookup().subscribe((res: any) => this.paymentMethods = res.list); }

  onSubmit() {
    if (this.form.invalid) return;
    if (this.isEditMode && this.itemId) {
      this.financialService.updateSalaryIncentive(this.itemId, this.form.value).subscribe({
        next: () => { this.notification.showSuccess('تم التحديث'); this.router.navigate(['/financial/salary-incentives']); },
        error: () => this.notification.showError('حدث خطأ')
      });
    } else {
      this.financialService.createSalaryIncentive(this.form.value).subscribe({
        next: () => { this.notification.showSuccess('تم الإضافة'); this.router.navigate(['/financial/salary-incentives']); },
        error: () => this.notification.showError('حدث خطأ')
      });
    }
  }
}