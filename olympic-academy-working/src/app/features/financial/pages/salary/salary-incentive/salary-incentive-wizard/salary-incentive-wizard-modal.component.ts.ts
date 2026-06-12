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

import { FinancialService } from '../../../../../../core/services/financial.service';
import { EmployeeService } from '../../../../../../core/services/employee.service';
import { NotificationService } from '../../../../../../core/services/notification.service';
import { SearchableSelectComponent, SelectOption } from '../../../../../../shared/components/searchable-select/searchable-select.component';
import { SALARY_TYPES } from '../../../../../../core/models/common.model';
import { SALARY_TRANSACTION_TYPES } from '../../../../../../core/models/financial.model';

interface EmployeeOption extends SelectOption {
  employeeData?: {
    fullName: string;
    salary: number;
    remainedSalary: number;
    salaryType?: any;
  };
}

@Component({
  selector: 'app-salary-incentive-wizard-modal',
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
  templateUrl: './salary-incentive-wizard-modal.component.html',
  styleUrls: ['./salary-incentive-wizard-modal.component.css']
})
export class SalaryIncentiveWizardModalComponent implements OnInit {
  transactionForm: FormGroup;
  isEditMode = false;
  transactionId?: number;
  isLoading = false;
  isSubmitting = false;
  
  // Data collections
  employees: any[] = [];
  paymentMethods: any[] = [];
  transactionTypes = SALARY_TRANSACTION_TYPES;
  salaryTypes = SALARY_TYPES;
  
  // Options for selects
  employeeOptions: EmployeeOption[] = [];
  paymentMethodOptions: SelectOption[] = [];
  transactionTypeOptions: SelectOption[] = [];
  salaryTypeOptions: SelectOption[] = [];
  
  // Selected data for display
  selectedEmployee: any = null;
  selectedTransactionType: any = null;
  maxWithdrawAmount: number = 0;
  transactionTypeName: string = '';
  isSalaryTransaction: boolean = false;
  
  // Wizard steps
  currentStep = 0;
  steps = [
    { label: 'نوع المعاملة', icon: 'category', completed: false },
    { label: 'اختر الموظف', icon: 'person', completed: false },
    { label: 'تفاصيل المعاملة', icon: 'payments', completed: false },
    { label: 'معلومات الدفع', icon: 'credit_card', completed: false },
    { label: 'تأكيد', icon: 'check_circle', completed: false }
  ];

  constructor(
    private fb: FormBuilder,
    private financialService: FinancialService,
    private employeeService: EmployeeService,
    private notification: NotificationService,
    private dialogRef: MatDialogRef<SalaryIncentiveWizardModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.transactionId = data?.transactionId;
    this.isEditMode = !!this.transactionId;
    
    this.transactionForm = this.fb.group({
      transactionTypeObj: [null, Validators.required],
      employeeId: [null, Validators.required],
      employeeFullName: [{ value: null, disabled: true }],
      employeeSalary: [{ value: null, disabled: true }],
      employeeRemainedSalary: [{ value: null, disabled: true }],
      amountWithdrawn: [null, [Validators.required, Validators.min(1)]],
      newRemainedSalary: [{ value: null, disabled: true }],
      withdrawDate: [new Date(), Validators.required],
      paymentMethodId: [null, Validators.required],
      salaryTypeObj: [null],
      note: ['']
    });
  }

  ngOnInit() {
    this.loadSelectOptions();
    this.loadEmployees();
    this.loadPaymentMethods();
    
    if (this.isEditMode) {
      this.loadTransactionData();
    }
    
    // Subscribe to amount withdrawn changes
    this.transactionForm.get('amountWithdrawn')?.valueChanges.subscribe(() => {
      this.calculateNewRemainedSalary();
    });
    
    // Subscribe to transaction type changes
this.transactionForm.get('transactionTypeObj')?.valueChanges.subscribe((type) => {
  if (type) {
    this.selectedTransactionType = type;
    this.transactionTypeName = type.title || ''; // Fixed: added fallback empty string
    this.isSalaryTransaction = type.id === 1; // Salary type id = 1
    
    // Reset employee selection when transaction type changes
    if (!this.isEditMode) {
      this.transactionForm.patchValue({
        employeeId: null,
        employeeFullName: null,
        employeeSalary: null,
        employeeRemainedSalary: null,
        amountWithdrawn: null,
        newRemainedSalary: null
      });
      this.selectedEmployee = null;
      this.maxWithdrawAmount = 0;
    }
  }
});
  }

  loadSelectOptions(): void {
    this.transactionTypeOptions = this.transactionTypes.map(t => ({ 
      value: t, 
      label: t.title 
    }));
    
    this.salaryTypeOptions = this.salaryTypes.map(s => ({ 
      value: s, 
      label: s.title 
    }));
  }

  loadEmployees() {
    this.isLoading = true;
    this.employeeService.getAllEmployeesLookup().subscribe({
      next: (res: any) => {
        this.employees = res.list || [];
        this.employeeOptions = this.employees.map((e: any) => ({ 
          value: e.id, 
          label: `${e.title} - (الراتب المتبقي: ${e.remainedSalary || 0} جم)`,
          employeeData: {
            fullName: e.title,
            salary: e.salary || 0,
            remainedSalary: e.remainedSalary || 0,
            salaryType: e.salaryType
          }
        }));
        this.isLoading = false;
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل الموظفين');
        this.isLoading = false;
      }
    });
  }

  loadPaymentMethods() {
    this.financialService.getAllPaymentMethodsLookup().subscribe({
      next: (res: any) => {
        this.paymentMethods = res.list || [];
        this.paymentMethodOptions = this.paymentMethods.map((p: any) => ({ 
          value: p.id, 
          label: p.title 
        }));
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل طرق الدفع');
      }
    });
  }

loadTransactionData() {
  this.isLoading = true;
  this.financialService.getSalaryIncentiveById(this.transactionId!).subscribe({
    next: (res: any) => {
      // Convert enum strings back to objects for display
      let transactionTypeObj = null;
      if (res.salaryTransactionType) {
        switch(res.salaryTransactionType) {
          case 'SALARY':
            transactionTypeObj = this.transactionTypes.find(t => t.id === 1);
            break;
          case 'INCENTIVE':
            transactionTypeObj = this.transactionTypes.find(t => t.id === 2);
            break;
          case 'BONUS':
            transactionTypeObj = this.transactionTypes.find(t => t.id === 3);
            break;
          case 'ADVANCE':
            transactionTypeObj = this.transactionTypes.find(t => t.id === 4);
            break;
          default:
            transactionTypeObj = null;
        }
      }
      
      let salaryTypeObj = null;
      if (res.salaryType) {
        switch(res.salaryType) {
          case 'MONTHLY':
            salaryTypeObj = this.salaryTypes.find(s => s.id === 1);
            break;
          case 'HOURLY':
            salaryTypeObj = this.salaryTypes.find(s => s.id === 2);
            break;
          case 'DAILY':
            salaryTypeObj = this.salaryTypes.find(s => s.id === 3);
            break;
          case 'PERCENTAGE':
            salaryTypeObj = this.salaryTypes.find(s => s.id === 4);
            break;
          default:
            salaryTypeObj = null;
        }
      }
      
      this.selectedTransactionType = transactionTypeObj;
      this.transactionTypeName = transactionTypeObj?.title || ''; // Fixed: added fallback empty string
      this.isSalaryTransaction = transactionTypeObj?.id === 1;
      
      this.transactionForm.patchValue({
        transactionTypeObj: transactionTypeObj,
        employeeId: res.employee?.id,
        amountWithdrawn: res.amountWithdrawn,
        withdrawDate: new Date(res.withdrawDate),
        paymentMethodId: res.paymentMethod?.id,
        salaryTypeObj: salaryTypeObj,
        note: res.note
      });
      
      // Fetch fresh employee data
      this.fetchFreshEmployeeData(res.employee?.id, res.amountWithdrawn);
      
      // Mark steps as completed for edit mode
      this.steps.forEach(step => step.completed = true);
      this.currentStep = 4;
      
      this.isLoading = false;
    },
    error: () => {
      this.notification.showError('حدث خطأ في تحميل بيانات المعاملة');
      this.isLoading = false;
    }
  });
}

  fetchFreshEmployeeData(employeeId: number, currentAmount?: number) {
    this.isLoading = true;
    this.employeeService.getEmployeeById(employeeId).subscribe({
      next: (employee: any) => {
        const currentRemainedSalary = employee.remainedSalary || 0;
        
        if (this.isEditMode && currentAmount !== undefined) {
          const previousRemained = currentRemainedSalary + currentAmount;
          this.maxWithdrawAmount = previousRemained;
          
          this.transactionForm.patchValue({
            employeeFullName: employee.title,
            employeeSalary: employee.salary || 0,
            employeeRemainedSalary: previousRemained,
            newRemainedSalary: previousRemained - currentAmount
          });
        } else {
          this.maxWithdrawAmount = currentRemainedSalary;
          
          this.transactionForm.patchValue({
            employeeFullName: employee.title,
            employeeSalary: employee.salary || 0,
            employeeRemainedSalary: currentRemainedSalary,
            newRemainedSalary: currentRemainedSalary
          });
        }
        
        this.selectedEmployee = {
          fullName: employee.title,
          salary: employee.salary || 0,
          remainedSalary: currentRemainedSalary,
          salaryType: employee.salaryType
        };
        
        // Set max validation for amount withdrawn (only for salary transactions)
        const amountControl = this.transactionForm.get('amountWithdrawn');
        if (amountControl) {
          if (this.isSalaryTransaction) {
            amountControl.setValidators([
              Validators.required,
              Validators.min(1),
              Validators.max(this.maxWithdrawAmount)
            ]);
          } else {
            // For incentive, bonus, advance - no max limit from remained salary
            amountControl.setValidators([
              Validators.required,
              Validators.min(1)
            ]);
          }
          amountControl.updateValueAndValidity();
        }
        
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching employee:', err);
        this.notification.showError('حدث خطأ في تحميل بيانات الموظف');
        this.isLoading = false;
      }
    });
  }

  onEmployeeSelect() {
    const employeeId = this.transactionForm.get('employeeId')?.value;
    
    if (!employeeId) {
      this.selectedEmployee = null;
      this.maxWithdrawAmount = 0;
      this.transactionForm.patchValue({
        employeeFullName: null,
        employeeSalary: null,
        employeeRemainedSalary: null,
        amountWithdrawn: null,
        newRemainedSalary: null
      });
      return;
    }
    
    this.isLoading = true;
    
    this.employeeService.getEmployeeById(employeeId).subscribe({
      next: (employee: any) => {
        const currentRemainedSalary = employee.remainedSalary || 0;
        this.maxWithdrawAmount = currentRemainedSalary;
        
        this.selectedEmployee = {
          fullName: employee.title,
          salary: employee.salary || 0,
          remainedSalary: currentRemainedSalary,
          salaryType: employee.salaryType
        };
        
        this.transactionForm.patchValue({
          employeeFullName: employee.title,
          employeeSalary: employee.salary || 0,
          employeeRemainedSalary: currentRemainedSalary,
          amountWithdrawn: null,
          newRemainedSalary: currentRemainedSalary
        });
        
        // Set max validation for amount withdrawn (only for salary transactions)
        const amountControl = this.transactionForm.get('amountWithdrawn');
        if (amountControl) {
          if (this.isSalaryTransaction) {
            amountControl.setValidators([
              Validators.required,
              Validators.min(1),
              Validators.max(currentRemainedSalary)
            ]);
          } else {
            // For incentive, bonus, advance - no max limit from remained salary
            amountControl.setValidators([
              Validators.required,
              Validators.min(1)
            ]);
          }
          amountControl.updateValueAndValidity();
        }
        
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching employee:', err);
        this.notification.showError('حدث خطأ في تحميل بيانات الموظف');
        this.isLoading = false;
      }
    });
  }

  calculateNewRemainedSalary() {
    // Only calculate for salary transactions
    if (!this.isSalaryTransaction) {
      this.transactionForm.get('newRemainedSalary')?.setValue(this.transactionForm.get('employeeRemainedSalary')?.value || 0);
      return;
    }
    
    const currentRemained = this.transactionForm.get('employeeRemainedSalary')?.value || 0;
    const amountWithdrawn = this.transactionForm.get('amountWithdrawn')?.value || 0;
    
    // Validate that amount doesn't exceed remained salary
    if (amountWithdrawn > currentRemained && currentRemained > 0) {
      this.transactionForm.get('amountWithdrawn')?.setErrors({ exceedsRemained: true });
      this.notification.showWarning(`المبلغ المطلوب لا يمكن أن يتجاوز الراتب المتبقي (${currentRemained} جم)`);
      return;
    } else {
      this.transactionForm.get('amountWithdrawn')?.setErrors(null);
    }
    
    const newRemained = currentRemained - amountWithdrawn;
    this.transactionForm.get('newRemainedSalary')?.setValue(Math.max(0, newRemained));
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
        return this.transactionForm.get('transactionTypeObj')?.valid === true;
      case 1:
        return this.transactionForm.get('employeeId')?.valid === true;
      case 2:
        const amountWithdrawn = this.transactionForm.get('amountWithdrawn')?.value;
        const currentRemained = this.transactionForm.get('employeeRemainedSalary')?.value;
        
        if (this.isSalaryTransaction) {
          return this.transactionForm.get('amountWithdrawn')?.valid === true && 
                 this.transactionForm.get('withdrawDate')?.valid === true &&
                 amountWithdrawn <= currentRemained;
        } else {
          return this.transactionForm.get('amountWithdrawn')?.valid === true && 
                 this.transactionForm.get('withdrawDate')?.valid === true;
        }
      case 3:
        return this.transactionForm.get('paymentMethodId')?.valid === true;
      default:
        return true;
    }
  }

  markCurrentStepFieldsAsTouched() {
    switch(this.currentStep) {
      case 0:
        this.transactionForm.get('transactionTypeObj')?.markAsTouched();
        break;
      case 1:
        this.transactionForm.get('employeeId')?.markAsTouched();
        break;
      case 2:
        this.transactionForm.get('amountWithdrawn')?.markAsTouched();
        this.transactionForm.get('withdrawDate')?.markAsTouched();
        break;
      case 3:
        this.transactionForm.get('paymentMethodId')?.markAsTouched();
        break;
    }
  }

  getAmountWithdrawn(): number {
    return this.transactionForm.get('amountWithdrawn')?.value || 0;
  }

  getCurrentRemained(): number {
    return this.transactionForm.get('employeeRemainedSalary')?.value || 0;
  }

  getNewRemained(): number {
    return this.transactionForm.get('newRemainedSalary')?.value || 0;
  }

  getTransactionTypeLabel(): string {
    const typeObj = this.transactionForm.get('transactionTypeObj')?.value;
    return typeObj?.title || 'غير محدد';
  }

  getTransactionTypeClass(): string {
    const typeObj = this.transactionForm.get('transactionTypeObj')?.value;
    if (!typeObj) return '';
    switch(typeObj.id) {
      case 1: return 'salary';
      case 2: return 'incentive';
      case 3: return 'bonus';
      case 4: return 'advance';
      default: return '';
    }
  }

  getTransactionTypeIcon(): string {
    const typeObj = this.transactionForm.get('transactionTypeObj')?.value;
    if (!typeObj) return 'receipt';
    switch(typeObj.id) {
      case 1: return 'attach_money';
      case 2: return 'star';
      case 3: return 'celebration';
      case 4: return 'account_balance_wallet';
      default: return 'receipt';
    }
  }

  getPaymentMethodLabel(): string {
    const methodId = this.transactionForm.get('paymentMethodId')?.value;
    const method = this.paymentMethods.find(m => m.id === methodId);
    return method?.title || 'غير محدد';
  }

  getSalaryTypeLabel(): string {
    const salaryTypeObj = this.transactionForm.get('salaryTypeObj')?.value;
    return salaryTypeObj?.title || 'غير محدد';
  }

  canProceedWithZeroRemained(): boolean {
    // If it's salary transaction and remained salary is 0, cannot proceed
    if (this.isSalaryTransaction && this.getCurrentRemained() === 0) {
      return false;
    }
    return true;
  }

onSubmit(): void {
  if (this.transactionForm.invalid) {
    this.notification.showWarning('يرجى تعبئة جميع الحقول المطلوبة في الخطوات السابقة');
    return;
  }

  const amountWithdrawn = this.transactionForm.get('amountWithdrawn')?.value;
  const currentRemained = this.transactionForm.get('employeeRemainedSalary')?.value;
  
  // Check if salary transaction with zero remained
  if (this.isSalaryTransaction && currentRemained === 0) {
    this.notification.showWarning('لا يمكن صرف راتب للموظف حيث أن الراتب المتبقي صفر');
    return;
  }
  
  // Validate amount doesn't exceed remained (only for salary)
  if (this.isSalaryTransaction && amountWithdrawn > currentRemained && currentRemained > 0) {
    this.notification.showWarning(`المبلغ المطلوب لا يمكن أن يتجاوز الراتب المتبقي (${currentRemained} جم)`);
    return;
  }

  const transactionTypeObj = this.transactionForm.get('transactionTypeObj')?.value;
  const salaryTypeObj = this.transactionForm.get('salaryTypeObj')?.value;
  
  // Convert SalaryType object to enum string expected by backend
  // SalaryType values from common.model: 1='شهري' (MONTHLY), 2='بالساعة' (HOURLY), 3='يومي' (DAILY), 4='نسبة' (PERCENTAGE)
  let salaryTypeEnum = null;
  if (salaryTypeObj) {
    switch(salaryTypeObj.id) {
      case 1: // شهري
        salaryTypeEnum = 'MONTHLY';
        break;
      case 2: // بالساعة
        salaryTypeEnum = 'HOURLY';
        break;
      case 3: // يومي
        salaryTypeEnum = 'DAILY';
        break;
      case 4: // نسبة
        salaryTypeEnum = 'PERCENTAGE';
        break;
      default:
        salaryTypeEnum = null;
    }
  }
  
  // Convert SalaryTransactionType object to enum string expected by backend
  // SalaryTransactionType values: 1='راتب' (SALARY), 2='حافز' (INCENTIVE), 3='مكافأة' (BONUS), 4='سلفة' (ADVANCE)
  let transactionTypeEnum = null;
  if (transactionTypeObj) {
    switch(transactionTypeObj.id) {
      case 1: // راتب
        transactionTypeEnum = 'SALARY';
        break;
      case 2: // حافز
        transactionTypeEnum = 'INCENTIVE';
        break;
      case 3: // مكافأة
        transactionTypeEnum = 'BONUS';
        break;
      case 4: // سلفة
        transactionTypeEnum = 'ADVANCE';
        break;
      default:
        transactionTypeEnum = null;
    }
  }
  
  const transactionData = {
    employeeId: this.transactionForm.get('employeeId')?.value,
    amountWithdrawn: amountWithdrawn,
    withdrawDate: this.transactionForm.get('withdrawDate')?.value,
    paymentMethodId: this.transactionForm.get('paymentMethodId')?.value,
    salaryType: salaryTypeEnum,  // Send enum string, not object
    salaryTransactionType: transactionTypeEnum,  // Send enum string, not object
    note: this.transactionForm.get('note')?.value
  };

  console.log('Submitting transaction data:', transactionData);

  this.isSubmitting = true;

  if (this.isEditMode && this.transactionId) {
    this.financialService.updateSalaryIncentive(this.transactionId, transactionData as any).subscribe({
      next: () => {
        this.notification.showSuccess(`تم تحديث ${this.transactionTypeName} بنجاح`);
        this.dialogRef.close(true);
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('Update error:', err);
        this.notification.showError(err.error?.messageEn || 'حدث خطأ في تحديث المعاملة');
        this.isSubmitting = false;
      }
    });
  } else {
    this.financialService.createSalaryIncentive(transactionData as any).subscribe({
      next: () => {
        this.notification.showSuccess(`تم إضافة ${this.transactionTypeName} بنجاح`);
        this.dialogRef.close(true);
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('Create error:', err);
        this.notification.showError(err.error?.messageEn || 'حدث خطأ في إضافة المعاملة');
        this.isSubmitting = false;
      }
    });
  }
}

  onCancel(): void {
    this.dialogRef.close(false);
  }
}