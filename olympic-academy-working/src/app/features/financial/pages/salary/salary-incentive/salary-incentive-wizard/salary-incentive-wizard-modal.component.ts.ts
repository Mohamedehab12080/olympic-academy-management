import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatDialog } from '@angular/material/dialog';
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
import { MatListModule } from '@angular/material/list';

import { FinancialService } from '../../../../../../core/services/financial.service';
import { EmployeeService } from '../../../../../../core/services/employee.service';
import { NotificationService } from '../../../../../../core/services/notification.service';
import { SearchableSelectComponent, SelectOption } from '../../../../../../shared/components/searchable-select/searchable-select.component';
import { SALARY_TYPES } from '../../../../../../core/models/common.model';
import { SALARY_TRANSACTION_TYPES } from '../../../../../../core/models/financial.model';
import { LookupVTO } from '../../../../../../core/models/common.model';

interface EmployeeOption extends SelectOption {
  employeeData?: {
    fullName: string;
    salary: number;
    remainedSalary: number;
    salaryType?: LookupVTO;
    nationalId?: string;
  };
}

// Employee Selection Dialog for barcode search
@Component({
  selector: 'app-employee-selection-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatListModule
  ],
  template: `
    <h2 mat-dialog-title>اختر الموظف</h2>
    <mat-dialog-content>
      <p>تم العثور على عدة موظفين. الرجاء اختيار الموظف المناسب:</p>
      <mat-list>
        <mat-list-item *ngFor="let employee of data.employees" (click)="selectEmployee(employee)" class="employee-item">
          <mat-icon mat-list-icon>person</mat-icon>
          <div mat-line><strong>{{ employee.fullName }}</strong></div>
          <div mat-line class="employee-detail">رقم الهوية: {{ employee.nationalId }}</div>
          <button mat-raised-button color="primary" (click)="selectEmployee(employee); $event.stopPropagation()">
            اختر
          </button>
        </mat-list-item>
      </mat-list>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>إلغاء</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .employee-item {
      cursor: pointer;
      transition: background-color 0.2s;
      border-radius: 8px;
      margin-bottom: 4px;
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      padding: 8px 12px !important;
    }
    .employee-item:hover {
      background-color: #f3e8ff;
    }
    .employee-detail {
      color: #6b7280;
      font-size: 12px;
    }
  `]
})
export class EmployeeSelectionDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EmployeeSelectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { employees: any[] }
  ) {}

  selectEmployee(employee: any): void {
    this.dialogRef.close(employee);
  }
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
    MatListModule,
    SearchableSelectComponent,
    EmployeeSelectionDialogComponent
  ],
  templateUrl: './salary-incentive-wizard-modal.component.html',
  styleUrls: ['./salary-incentive-wizard-modal.component.css']
})
export class SalaryIncentiveWizardModalComponent implements OnInit {
  @ViewChild('barcodeInput') barcodeInput!: ElementRef<HTMLInputElement>;
  
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
  
  // Barcode search
  barcodeSearch: string = '';
  isBarcodeMode: boolean = false;
  barcodeSearchResult: { found: boolean; employeeName?: string; message?: string } | null = null;
  
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
    private dialog: MatDialog,
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
        this.transactionTypeName = type.title || '';
        this.isSalaryTransaction = type.id === 1;
        
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
          this.barcodeSearch = '';
          this.barcodeSearchResult = null;
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
        this.employees = res || [];
        this.employeeOptions = this.employees.map((e: any) => ({ 
          value: e.id, 
          label: `${e.fullName} - (الراتب المتبقي: ${e.remainedSalary || 0} جم)`,
          employeeData: {
            fullName: e.fullName,
            salary: e.salary || 0,
            remainedSalary: e.remainedSalary || 0,
            salaryType: e.salaryType,
            nationalId: e.nationalId
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
        // The response already has salaryTransactionType and salaryType as LookupVTO objects
        // with id and title properties - use them directly
        
        // Find the matching transaction type object from our list to ensure it's the same reference
        let transactionTypeObj = null;
        if (res.salaryTransactionType?.id) {
          transactionTypeObj = this.transactionTypes.find(t => t.id === res.salaryTransactionType.id);
          // If not found in our list, use the one from the response
          if (!transactionTypeObj) {
            transactionTypeObj = res.salaryTransactionType;
          }
        }
        
        // Find the matching salary type object from our list
        let salaryTypeObj = null;
        if (res.salaryType?.id) {
          salaryTypeObj = this.salaryTypes.find(s => s.id === res.salaryType.id);
          // If not found in our list, use the one from the response
          if (!salaryTypeObj) {
            salaryTypeObj = res.salaryType;
          }
        }
        
        this.selectedTransactionType = transactionTypeObj;
        this.transactionTypeName = transactionTypeObj?.title || '';
        this.isSalaryTransaction = transactionTypeObj?.id === 1;
        
        // Format the date for the date picker
        let withdrawDate = new Date();
        if (res.withdrawDate) {
          withdrawDate = new Date(res.withdrawDate);
        }
        
        this.transactionForm.patchValue({
          transactionTypeObj: transactionTypeObj,
          employeeId: res.employee?.id,
          amountWithdrawn: res.amountWithdrawn,
          withdrawDate: withdrawDate,
          paymentMethodId: res.paymentMethod?.id,
          salaryTypeObj: salaryTypeObj,
          note: res.note
        });
        
        // Fetch employee data
        if (res.employee?.id) {
          this.fetchFreshEmployeeData(res.employee?.id, res.amountWithdrawn);
        }
        
        // Mark steps as completed
        this.steps.forEach(step => step.completed = true);
        this.currentStep = 4;
        
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading transaction:', err);
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
            employeeFullName: employee.title || employee.fullName,
            employeeSalary: employee.salary || 0,
            employeeRemainedSalary: previousRemained,
            newRemainedSalary: previousRemained - currentAmount
          });
        } else {
          this.maxWithdrawAmount = currentRemainedSalary;
          
          this.transactionForm.patchValue({
            employeeFullName: employee.title || employee.fullName,
            employeeSalary: employee.salary || 0,
            employeeRemainedSalary: currentRemainedSalary,
            newRemainedSalary: currentRemainedSalary
          });
        }
        
        this.selectedEmployee = {
          fullName: employee.title || employee.fullName,
          salary: employee.salary || 0,
          remainedSalary: currentRemainedSalary,
          salaryType: employee.salaryType,
          nationalId: employee.nationalId
        };
        
        this.setAmountValidators();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching employee:', err);
        this.notification.showError('حدث خطأ في تحميل بيانات الموظف');
        this.isLoading = false;
      }
    });
  }

  setAmountValidators() {
    const amountControl = this.transactionForm.get('amountWithdrawn');
    if (amountControl) {
      if (this.isSalaryTransaction) {
        amountControl.setValidators([
          Validators.required,
          Validators.min(1),
          Validators.max(this.maxWithdrawAmount || 0)
        ]);
      } else {
        amountControl.setValidators([
          Validators.required,
          Validators.min(1)
        ]);
      }
      amountControl.updateValueAndValidity();
    }
  }

  // ==========================================================================
  // BARCODE SEARCH METHODS
  // ==========================================================================

  toggleBarcodeMode(): void {
    this.isBarcodeMode = !this.isBarcodeMode;
    if (this.isBarcodeMode) {
      setTimeout(() => this.barcodeInput?.nativeElement.focus(), 100);
    } else {
      this.barcodeSearch = '';
      this.barcodeSearchResult = null;
    }
  }

  searchEmployeeByBarcode(): void {
    if (!this.barcodeSearch?.trim()) {
      this.barcodeSearchResult = {
        found: false,
        message: 'الرجاء إدخال رقم الباركود'
      };
      return;
    }

    const searchValue = this.barcodeSearch.trim();
    this.isLoading = true;

    this.employeeService.getAllEmployeesLookup().subscribe({
      next: (res: any[]) => {
        const allEmployees = res || [];
        const matchedEmployees = allEmployees.filter((e: any) => 
          e.nationalId && e.nationalId.includes(searchValue)
        );

        if (matchedEmployees.length === 0) {
          this.barcodeSearchResult = {
            found: false,
            message: 'لم يتم العثور على موظف بهذا الرقم'
          };
          this.notification.showError('لم يتم العثور على موظف');
          this.isLoading = false;
          return;
        }

        const exactMatch = matchedEmployees.find((e: any) => 
          e.nationalId === searchValue
        );

        if (exactMatch) {
          this.selectEmployeeInWizard(exactMatch);
          this.notification.showSuccess(`تم العثور على الموظف: ${exactMatch.fullName}`);
          this.isLoading = false;
          return;
        }

        if (matchedEmployees.length > 1) {
          this.showEmployeeSelectionDialog(matchedEmployees);
          this.isLoading = false;
          return;
        }

        const employee = matchedEmployees[0];
        this.selectEmployeeInWizard(employee);
        this.notification.showSuccess(`تم العثور على الموظف: ${employee.fullName}`);
        this.isLoading = false;
      },
      error: () => {
        this.barcodeSearchResult = {
          found: false,
          message: 'حدث خطأ في البحث عن الموظف'
        };
        this.notification.showError('حدث خطأ في البحث عن الموظف');
        this.isLoading = false;
      }
    });
  }

  private selectEmployeeInWizard(employee: any): void {
    this.barcodeSearchResult = {
      found: true,
      employeeName: employee.fullName
    };
    
    this.transactionForm.patchValue({
      employeeId: employee.id
    });
    
    this.barcodeSearch = '';
    this.isBarcodeMode = false;
    
    // Trigger employee selection
    this.onEmployeeSelect();
    
    // Auto-advance to next step after selection
    setTimeout(() => {
      if (this.isStepValid(1)) {
        this.steps[1].completed = true;
        if (this.currentStep === 1) {
          this.currentStep = 2;
        }
      }
    }, 500);
  }

  private showEmployeeSelectionDialog(employees: any[]): void {
    const selectionDialog = this.dialog.open(EmployeeSelectionDialogComponent, {
      width: '500px',
      maxWidth: '90vw',
      data: { employees }
    });

    selectionDialog.afterClosed().subscribe((selected: any) => {
      if (selected) {
        this.selectEmployeeInWizard(selected);
        this.notification.showSuccess(`تم اختيار الموظف: ${selected.fullName}`);
      }
    });
  }

  onBarcodeKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.searchEmployeeByBarcode();
    }
  }

  clearBarcodeSearch(): void {
    this.barcodeSearch = '';
    this.barcodeSearchResult = null;
    this.isBarcodeMode = false;
  }

  // ==========================================================================
  // EMPLOYEE SELECTION
  // ==========================================================================

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
          fullName: employee.title || employee.fullName,
          salary: employee.salary || 0,
          remainedSalary: currentRemainedSalary,
          salaryType: employee.salaryType,
          nationalId: employee.nationalId
        };
        
        this.transactionForm.patchValue({
          employeeFullName: employee.title || employee.fullName,
          employeeSalary: employee.salary || 0,
          employeeRemainedSalary: currentRemainedSalary,
          amountWithdrawn: null,
          newRemainedSalary: currentRemainedSalary
        });
        
        this.setAmountValidators();
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
    if (!this.isSalaryTransaction) {
      this.transactionForm.get('newRemainedSalary')?.setValue(this.transactionForm.get('employeeRemainedSalary')?.value || 0);
      return;
    }
    
    const currentRemained = this.transactionForm.get('employeeRemainedSalary')?.value || 0;
    const amountWithdrawn = this.transactionForm.get('amountWithdrawn')?.value || 0;
    
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

  // ==========================================================================
  // STEP NAVIGATION
  // ==========================================================================

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

  // ==========================================================================
  // GETTER METHODS
  // ==========================================================================

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
    if (this.isSalaryTransaction && this.getCurrentRemained() === 0) {
      return false;
    }
    return true;
  }

  // ==========================================================================
  // SUBMIT
  // ==========================================================================
onSubmit(): void {
  console.log('===== FORM SUBMISSION TRIGGERED =====');
  console.log('Form valid:', this.transactionForm.valid);
  console.log('Form errors:', this.transactionForm.errors);
  console.log('Form value:', this.transactionForm.value);
  
  // Check each control
  Object.keys(this.transactionForm.controls).forEach(key => {
    const control = this.transactionForm.get(key);
    console.log(`${key}:`, {
      value: control?.value,
      valid: control?.valid,
      errors: control?.errors,
      touched: control?.touched
    });
  });
  
    if (this.transactionForm.invalid) {
      this.notification.showWarning('يرجى تعبئة جميع الحقول المطلوبة في الخطوات السابقة');
      return;
    }

    const amountWithdrawn = this.transactionForm.get('amountWithdrawn')?.value;
    const currentRemained = this.transactionForm.get('employeeRemainedSalary')?.value;
    
    if (this.isSalaryTransaction && currentRemained === 0) {
      this.notification.showWarning('لا يمكن صرف راتب للموظف حيث أن الراتب المتبقي صفر');
      return;
    }
    
    if (this.isSalaryTransaction && amountWithdrawn > currentRemained && currentRemained > 0) {
      this.notification.showWarning(`المبلغ المطلوب لا يمكن أن يتجاوز الراتب المتبقي (${currentRemained} جم)`);
      return;
    }

    const transactionTypeObj = this.transactionForm.get('transactionTypeObj')?.value;
    const salaryTypeObj = this.transactionForm.get('salaryTypeObj')?.value;
    
    let salaryTypeEnum = null;
    if (salaryTypeObj) {
      switch(salaryTypeObj.id) {
        case 1: salaryTypeEnum = 'MONTHLY'; break;
        case 2: salaryTypeEnum = 'HOURLY'; break;
        case 3: salaryTypeEnum = 'DAILY'; break;
        case 4: salaryTypeEnum = 'PERCENTAGE'; break;
        default: salaryTypeEnum = null;
      }
    }
    
    let transactionTypeEnum = null;
    if (transactionTypeObj) {
      switch(transactionTypeObj.id) {
        case 1: transactionTypeEnum = 'SALARY'; break;
        case 2: transactionTypeEnum = 'INCENTIVE'; break;
        case 3: transactionTypeEnum = 'BONUS'; break;
        case 4: transactionTypeEnum = 'ADVANCE'; break;
        default: transactionTypeEnum = null;
      }
    }
    
    // Format date for backend (YYYY-MM-DD)
    const withdrawDate = this.transactionForm.get('withdrawDate')?.value;
    let formattedDate = null;
    if (withdrawDate) {
      const date = new Date(withdrawDate);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      formattedDate = `${year}-${month}-${day}`;
    }
    
    const transactionData = {
      employeeId: this.transactionForm.get('employeeId')?.value,
      amountWithdrawn: amountWithdrawn,
      withdrawDate: formattedDate,
      paymentMethodId: this.transactionForm.get('paymentMethodId')?.value,
      salaryType: salaryTypeEnum,
      salaryTransactionType: transactionTypeEnum,
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