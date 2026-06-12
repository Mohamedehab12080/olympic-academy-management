import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDividerModule } from '@angular/material/divider';

import { FinancialService } from '../../../../../core/services/financial.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { SearchableSelectComponent, SelectOption } from '../../../../../shared/components/searchable-select/searchable-select.component';

@Component({
  selector: 'app-expense-wizard-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatStepperModule,
    MatDividerModule,
    SearchableSelectComponent
  ],
  templateUrl: './expense-wizard-modal.component.html',
  styleUrls: ['./expense-wizard-modal.component.css']
})
export class ExpenseWizardModalComponent implements OnInit {
  expenseForm: FormGroup;
  isEditMode = false;
  expenseId?: number;
  isLoading = false;
  isSubmitting = false;
  
  // Data collections
  expenseTypes: any[] = [];
  paymentMethods: any[] = [];
  
  // Options for selects
  expenseTypeOptions: SelectOption[] = [];
  paymentMethodOptions: SelectOption[] = [];
  
  // Selected data for display
  selectedExpenseType: any = null;
  
  // Wizard steps
  currentStep = 0;
  steps = [
    { label: 'نوع المصروف', icon: 'category', completed: false },
    { label: 'تفاصيل المصروف', icon: 'payments', completed: false },
    { label: 'تأكيد', icon: 'check_circle', completed: false }
  ];

  constructor(
    private fb: FormBuilder,
    private financialService: FinancialService,
    private notification: NotificationService,
    private dialogRef: MatDialogRef<ExpenseWizardModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.expenseId = data?.expenseId;
    this.isEditMode = !!this.expenseId;
    
    this.expenseForm = this.fb.group({
      expenseTypeId: [null, Validators.required],
      expenseTypeTitle: [{ value: null, disabled: true }],
      amountExpensed: [null, [Validators.required, Validators.min(1)]],
      expenseDate: [new Date(), Validators.required],
      paymentMethodId: [null],
      note: ['']
    });
  }

  ngOnInit() {
    this.loadExpenseTypes();
    this.loadPaymentMethods();
    
    if (this.isEditMode) {
      this.loadExpenseData();
    }
  }

  loadExpenseTypes() {
    this.isLoading = true;
    this.financialService.getAllExpenseTypesLookup(true).subscribe({
      next: (res: any) => {
        this.expenseTypes = res.list || [];
        this.expenseTypeOptions = this.expenseTypes.map((t: any) => ({ 
          value: t.id, 
          label: t.title 
        }));
        this.isLoading = false;
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل أنواع المصروفات');
        this.isLoading = false;
      }
    });
  }

  loadPaymentMethods() {
    this.financialService.getAllPaymentMethodsLookup().subscribe({
      next: (res: any) => {
        this.paymentMethods = res.list || [];
        this.paymentMethodOptions = [
          { value: null, label: '-- اختر --' },
          ...this.paymentMethods.map((p: any) => ({ value: p.id, label: p.title }))
        ];
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل طرق الدفع');
      }
    });
  }

  loadExpenseData() {
    this.isLoading = true;
    this.financialService.getExpenseById(this.expenseId!).subscribe({
      next: (res: any) => {
        // Find expense type object
        const expenseType = this.expenseTypes.find(t => t.id === res.expenseType?.id);
        
        this.expenseForm.patchValue({
          expenseTypeId: res.expenseType?.id,
          expenseTypeTitle: expenseType?.title,
          amountExpensed: res.amountExpensed,
          expenseDate: new Date(res.expenseDate),
          paymentMethodId: res.paymentMethod?.id,
          note: res.note
        });
        
        this.selectedExpenseType = expenseType;
        
        // Mark steps as completed for edit mode
        this.steps.forEach(step => step.completed = true);
        this.currentStep = 2;
        
        this.isLoading = false;
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل بيانات المصروف');
        this.isLoading = false;
      }
    });
  }

  onExpenseTypeSelect() {
    const expenseTypeId = this.expenseForm.get('expenseTypeId')?.value;
    const selected = this.expenseTypes.find(t => t.id === expenseTypeId);
    
    if (selected) {
      this.selectedExpenseType = selected;
      this.expenseForm.patchValue({
        expenseTypeTitle: selected.title
      });
    } else {
      this.selectedExpenseType = null;
      this.expenseForm.patchValue({
        expenseTypeTitle: null
      });
    }
  }

  goToStep(step: number) {
    if (step <= this.currentStep || this.isStepValid(step - 1)) {
      this.currentStep = step;
    }
  }

  nextStep() {
    if (this.isStepValid(this.currentStep)) {
      this.steps[this.currentStep].completed = true;
      if (this.currentStep < this.steps.length - 1) {
        this.currentStep++;
      }
    } else {
      this.markCurrentStepFieldsAsTouched();
      this.notification.showWarning('يرجى تعبئة جميع الحقول المطلوبة');
    }
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  isStepValid(step: number): boolean {
    switch(step) {
      case 0:
        return this.expenseForm.get('expenseTypeId')?.valid === true;
      case 1:
        return this.expenseForm.get('amountExpensed')?.valid === true && 
               this.expenseForm.get('expenseDate')?.valid === true;
      default:
        return true;
    }
  }

  markCurrentStepFieldsAsTouched() {
    switch(this.currentStep) {
      case 0:
        this.expenseForm.get('expenseTypeId')?.markAsTouched();
        break;
      case 1:
        this.expenseForm.get('amountExpensed')?.markAsTouched();
        this.expenseForm.get('expenseDate')?.markAsTouched();
        break;
    }
  }

  getAmountExpensed(): number {
    return this.expenseForm.get('amountExpensed')?.value || 0;
  }

  getExpenseTypeLabel(): string {
    const expenseTypeId = this.expenseForm.get('expenseTypeId')?.value;
    const expenseType = this.expenseTypes.find(t => t.id === expenseTypeId);
    return expenseType?.title || 'غير محدد';
  }

  getPaymentMethodLabel(): string {
    const methodId = this.expenseForm.get('paymentMethodId')?.value;
    const method = this.paymentMethods.find(m => m.id === methodId);
    return method?.title || 'غير محدد';
  }

  onSubmit(): void {
    if (this.expenseForm.invalid) {
      this.notification.showWarning('يرجى تعبئة جميع الحقول المطلوبة في الخطوات السابقة');
      return;
    }

    const expenseData = {
      expenseTypeId: this.expenseForm.get('expenseTypeId')?.value,
      amountExpensed: this.expenseForm.get('amountExpensed')?.value,
      expenseDate: this.expenseForm.get('expenseDate')?.value,
      paymentMethodId: this.expenseForm.get('paymentMethodId')?.value,
      note: this.expenseForm.get('note')?.value
    };

    console.log('Submitting expense data:', expenseData);

    this.isSubmitting = true;

    if (this.isEditMode && this.expenseId) {
      this.financialService.updateExpense(this.expenseId, expenseData as any).subscribe({
        next: () => {
          this.notification.showSuccess('تم تحديث المصروف بنجاح');
          this.dialogRef.close(true);
          this.isSubmitting = false;
        },
        error: (err) => {
          console.error('Update error:', err);
          this.notification.showError(err.error?.messageEn || 'حدث خطأ في تحديث المصروف');
          this.isSubmitting = false;
        }
      });
    } else {
      this.financialService.createExpense(expenseData as any).subscribe({
        next: () => {
          this.notification.showSuccess('تم إضافة المصروف بنجاح');
          this.dialogRef.close(true);
          this.isSubmitting = false;
        },
        error: (err) => {
          console.error('Create error:', err);
          this.notification.showError(err.error?.messageEn || 'حدث خطأ في إضافة المصروف');
          this.isSubmitting = false;
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}