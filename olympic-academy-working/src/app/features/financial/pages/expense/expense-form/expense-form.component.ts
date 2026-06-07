import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FinancialService } from '../../../../../core/services/financial.service';
import { NotificationService } from '../../../../../core/services/notification.service';

@Component({
  selector: 'app-expense-form',
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.css']
})
export class ExpenseFormComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  itemId?: number;
  expenseTypes: any[] = [];
  paymentMethods: any[] = [];
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private financialService: FinancialService,
    private notification: NotificationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      expenseTypeId: [null, Validators.required],
      amountExpensed: [null, [Validators.required, Validators.min(1)]],
      expenseDate: [null, Validators.required],
      paymentMethodId: [null],
      note: ['']
    });
  }

  ngOnInit() {
    this.loadExpenseTypes();
    this.loadPaymentMethods();
    this.itemId = this.route.snapshot.params['id'];
    if (this.itemId) {
      this.isEditMode = true;
      this.financialService.getExpenseById(this.itemId).subscribe({
        next: (res: any) => this.form.patchValue(res),
        error: () => this.notification.showError('حدث خطأ')
      });
    }
  }

  loadExpenseTypes() { this.financialService.getAllExpenseTypesLookup().subscribe((res: any) => this.expenseTypes = res.list); }
  loadPaymentMethods() { this.financialService.getAllPaymentMethodsLookup().subscribe((res: any) => this.paymentMethods = res.list); }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); this.notification.showWarning('يرجى تعبئة جميع الحقول المطلوبة'); return; }
    this.isSubmitting = true;
    if (this.isEditMode && this.itemId) {
      this.financialService.updateExpense(this.itemId, this.form.value).subscribe({
        next: () => { this.notification.showSuccess('تم التحديث'); this.router.navigate(['/financial/expenses']); this.isSubmitting = false; },
        error: () => { this.notification.showError('حدث خطأ'); this.isSubmitting = false; }
      });
    } else {
      this.financialService.createExpense(this.form.value).subscribe({
        next: () => { this.notification.showSuccess('تم الإضافة'); this.router.navigate(['/financial/expenses']); this.isSubmitting = false; },
        error: () => { this.notification.showError('حدث خطأ'); this.isSubmitting = false; }
      });
    }
  }
}