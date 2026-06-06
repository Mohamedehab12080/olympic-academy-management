import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FinancialService } from '../../../../../core/services/financial.service';
import { NotificationService } from '../../../../../core/services/notification.service';

@Component({
  selector: 'app-expense-form',
  standalone: false,
  template: `
    <div class="form-container">
      <mat-card>
        <div class="form-header"><button mat-icon-button routerLink="/financial/expenses"><mat-icon>arrow_forward</mat-icon></button><h2>{{ isEditMode ? 'تعديل مصروف' : 'إضافة مصروف جديد' }}</h2></div>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-grid">
            <mat-form-field appearance="outline"><mat-label>نوع المصروف *</mat-label><mat-select formControlName="expenseTypeId"><mat-option *ngFor="let t of expenseTypes" [value]="t.id">{{ t.title }}</mat-option></mat-select></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>المبلغ *</mat-label><input matInput type="number" formControlName="amountExpensed"></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>تاريخ المصروف *</mat-label><input matInput [matDatepicker]="datePicker" formControlName="expenseDate"><mat-datepicker-toggle matSuffix [for]="datePicker"></mat-datepicker-toggle><mat-datepicker #datePicker></mat-datepicker></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>طريقة الدفع</mat-label><mat-select formControlName="paymentMethodId"><mat-option *ngFor="let p of paymentMethods" [value]="p.id">{{ p.title }}</mat-option></mat-select></mat-form-field>
            <mat-form-field appearance="outline" class="full-width"><mat-label>ملاحظات</mat-label><textarea matInput formControlName="note" rows="3"></textarea></mat-form-field>
          </div>
          <div class="form-actions"><button mat-raised-button color="primary" type="submit"><mat-icon>save</mat-icon> {{ isEditMode ? 'تحديث' : 'حفظ' }}</button><button mat-stroked-button type="button" routerLink="/financial/expenses">إلغاء</button></div>
        </form>
      </mat-card>
    </div>
  `,
  styles: [`
    .form-container { max-width: 800px; margin: 0 auto; padding: 24px; }
    .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
    .full-width { grid-column: span 2; }
    .form-actions { display: flex; gap: 16px; justify-content: flex-end; margin-top: 24px; }
  `]
})
export class ExpenseFormComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  itemId?: number;
  expenseTypes: any[] = [];
  paymentMethods: any[] = [];

  constructor(private fb: FormBuilder, private financialService: FinancialService, private notification: NotificationService, private route: ActivatedRoute, private router: Router) {
    this.form = this.fb.group({ expenseTypeId: [null, Validators.required], amountExpensed: [null, Validators.required], expenseDate: [null, Validators.required], paymentMethodId: [null], note: [''] });
  }

  ngOnInit() {
    this.loadExpenseTypes();
    this.loadPaymentMethods();
    this.itemId = this.route.snapshot.params['id'];
    if (this.itemId) { this.isEditMode = true; this.financialService.getExpenseById(this.itemId).subscribe((res: any) => this.form.patchValue(res)); }
  }

  loadExpenseTypes() { this.financialService.getAllExpenseTypesLookup().subscribe((res: any) => this.expenseTypes = res.list); }
  loadPaymentMethods() { this.financialService.getAllPaymentMethodsLookup().subscribe((res: any) => this.paymentMethods = res.list); }

  onSubmit() {
    if (this.form.invalid) return;
    if (this.isEditMode && this.itemId) {
      this.financialService.updateExpense(this.itemId, this.form.value).subscribe({
        next: () => { this.notification.showSuccess('تم التحديث'); this.router.navigate(['/financial/expenses']); },
        error: () => this.notification.showError('حدث خطأ')
      });
    } else {
      this.financialService.createExpense(this.form.value).subscribe({
        next: () => { this.notification.showSuccess('تم الإضافة'); this.router.navigate(['/financial/expenses']); },
        error: () => this.notification.showError('حدث خطأ')
      });
    }
  }
}