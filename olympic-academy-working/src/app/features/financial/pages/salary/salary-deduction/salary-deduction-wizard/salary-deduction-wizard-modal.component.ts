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
import { DEDUCTION_TYPES } from '../../../../../../core/models/financial.model';

interface EmployeeOption extends SelectOption {
  employeeData?: {
    fullName: string;
    salary: number;
    remainedSalary: number;
    salaryType?: any;
  };
}

@Component({
  selector: 'app-salary-deduction-wizard-modal',
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
  templateUrl: './salary-deduction-wizard-modal.component.html',
  styleUrls: ['./salary-deduction-wizard-modal.component.css']
})
export class SalaryDeductionWizardModalComponent implements OnInit {
  deductionForm: FormGroup;
  isEditMode = false;
  deductionId?: number;
  isLoading = false;
  isSubmitting = false;
  
  // Data collections
  employees: any[] = [];
  deductionTypes = DEDUCTION_TYPES;
  salaryTypes = SALARY_TYPES;
  
  // Options for selects
  employeeOptions: EmployeeOption[] = [];
  deductionTypeOptions: SelectOption[] = [];
  salaryTypeOptions: SelectOption[] = [];
  
  // Selected data for display
  selectedEmployee: any = null;
  maxDeductionAmount: number = 0;
  
  // Wizard steps
  currentStep = 0;
  steps = [
    { label: 'اختر الموظف', icon: 'person', completed: false },
    { label: 'تفاصيل الخصم', icon: 'payments', completed: false },
    { label: 'تأكيد', icon: 'check_circle', completed: false }
  ];

  constructor(
    private fb: FormBuilder,
    private financialService: FinancialService,
    private employeeService: EmployeeService,
    private notification: NotificationService,
    private dialogRef: MatDialogRef<SalaryDeductionWizardModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.deductionId = data?.deductionId;
    this.isEditMode = !!this.deductionId;
    
    this.deductionForm = this.fb.group({
      employeeId: [null, Validators.required],
      employeeFullName: [{ value: null, disabled: true }],
      employeeSalary: [{ value: null, disabled: true }],
      employeeRemainedSalary: [{ value: null, disabled: true }],
      deductionTypeObj: [null, Validators.required],
      amountDeducted: [null, [Validators.required, Validators.min(1)]],
      newRemainedSalary: [{ value: null, disabled: true }],
      deductionDate: [new Date(), Validators.required],
      salaryTypeObj: [null],
      reason: [''],
      note: ['']
    });
  }

  ngOnInit() {
    this.loadSelectOptions();
    this.loadEmployees();
    
    if (this.isEditMode) {
      this.loadDeductionData();
    }
    
    // Subscribe to amount deducted changes
    this.deductionForm.get('amountDeducted')?.valueChanges.subscribe(() => {
      this.calculateNewRemainedSalary();
    });
  }

  loadSelectOptions(): void {
    this.deductionTypeOptions = this.deductionTypes.map(t => ({ 
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

  loadDeductionData() {
    this.isLoading = true;
    this.financialService.getSalaryDeductionById(this.deductionId!).subscribe({
      next: (res: any) => {
        // Find deduction type object from ID
        let deductionTypeObj = null;
        if (res.deductionType) {
          deductionTypeObj = this.deductionTypes.find(t => t.id === res.deductionType?.id);
        }
        
        this.deductionForm.patchValue({
          employeeId: res.employee?.id,
          deductionTypeObj: deductionTypeObj,
          amountDeducted: res.amountDeducted,
          deductionDate: new Date(res.deductionDate),
          salaryTypeObj: res.salaryType,
          reason: res.reason,
          note: res.note
        });
        
        // Fetch fresh employee data
        this.fetchFreshEmployeeData(res.employee?.id, res.amountDeducted);
        
        // Mark steps as completed for edit mode
        this.steps.forEach(step => step.completed = true);
        this.currentStep = 2;
        
        this.isLoading = false;
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل بيانات الخصم');
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
          this.maxDeductionAmount = previousRemained;
          
          this.deductionForm.patchValue({
            employeeFullName: employee.title,
            employeeSalary: employee.salary || 0,
            employeeRemainedSalary: previousRemained,
            newRemainedSalary: previousRemained - currentAmount
          });
        } else {
          this.maxDeductionAmount = currentRemainedSalary;
          
          this.deductionForm.patchValue({
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
        
        // Set max validation for amount deducted
        const amountControl = this.deductionForm.get('amountDeducted');
        if (amountControl) {
          amountControl.setValidators([
            Validators.required,
            Validators.min(1),
            Validators.max(this.maxDeductionAmount)
          ]);
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
    const employeeId = this.deductionForm.get('employeeId')?.value;
    
    if (!employeeId) {
      this.selectedEmployee = null;
      this.maxDeductionAmount = 0;
      this.deductionForm.patchValue({
        employeeFullName: null,
        employeeSalary: null,
        employeeRemainedSalary: null,
        amountDeducted: null,
        newRemainedSalary: null
      });
      return;
    }
    
    this.isLoading = true;
    
    this.employeeService.getEmployeeById(employeeId).subscribe({
      next: (employee: any) => {
        const currentRemainedSalary = employee.remainedSalary || 0;
        this.maxDeductionAmount = currentRemainedSalary;
        
        this.selectedEmployee = {
          fullName: employee.title,
          salary: employee.salary || 0,
          remainedSalary: currentRemainedSalary,
          salaryType: employee.salaryType
        };
        
        this.deductionForm.patchValue({
          employeeFullName: employee.title,
          employeeSalary: employee.salary || 0,
          employeeRemainedSalary: currentRemainedSalary,
          amountDeducted: null,
          newRemainedSalary: currentRemainedSalary
        });
        
        // Set max validation for amount deducted
        const amountControl = this.deductionForm.get('amountDeducted');
        if (amountControl) {
          amountControl.setValidators([
            Validators.required,
            Validators.min(1),
            Validators.max(currentRemainedSalary)
          ]);
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
    const currentRemained = this.deductionForm.get('employeeRemainedSalary')?.value || 0;
    const amountDeducted = this.deductionForm.get('amountDeducted')?.value || 0;
    
    // Validate that amount doesn't exceed remained salary
    if (amountDeducted > currentRemained && currentRemained > 0) {
      this.deductionForm.get('amountDeducted')?.setErrors({ exceedsRemained: true });
      this.notification.showWarning(`المبلغ المطلوب لا يمكن أن يتجاوز الراتب المتبقي (${currentRemained} جم)`);
      return;
    } else {
      this.deductionForm.get('amountDeducted')?.setErrors(null);
    }
    
    const newRemained = currentRemained - amountDeducted;
    this.deductionForm.get('newRemainedSalary')?.setValue(Math.max(0, newRemained));
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
        return this.deductionForm.get('employeeId')?.valid === true;
      case 1:
        const amountDeducted = this.deductionForm.get('amountDeducted')?.value;
        const currentRemained = this.deductionForm.get('employeeRemainedSalary')?.value;
        return this.deductionForm.get('amountDeducted')?.valid === true && 
               this.deductionForm.get('deductionDate')?.valid === true &&
               amountDeducted <= currentRemained;
      default:
        return true;
    }
  }

  markCurrentStepFieldsAsTouched() {
    switch(this.currentStep) {
      case 0:
        this.deductionForm.get('employeeId')?.markAsTouched();
        break;
      case 1:
        this.deductionForm.get('amountDeducted')?.markAsTouched();
        this.deductionForm.get('deductionDate')?.markAsTouched();
        break;
    }
  }

  getAmountDeducted(): number {
    return this.deductionForm.get('amountDeducted')?.value || 0;
  }

  getCurrentRemained(): number {
    return this.deductionForm.get('employeeRemainedSalary')?.value || 0;
  }

  getNewRemained(): number {
    return this.deductionForm.get('newRemainedSalary')?.value || 0;
  }

  getDeductionTypeLabel(): string {
    const typeObj = this.deductionForm.get('deductionTypeObj')?.value;
    return typeObj?.title || 'غير محدد';
  }

  getSalaryTypeLabel(): string {
    const salaryTypeObj = this.deductionForm.get('salaryTypeObj')?.value;
    return salaryTypeObj?.title || 'غير محدد';
  }

  onSubmit(): void {
    if (this.deductionForm.invalid) {
      this.notification.showWarning('يرجى تعبئة جميع الحقول المطلوبة في الخطوات السابقة');
      return;
    }

    const amountDeducted = this.deductionForm.get('amountDeducted')?.value;
    const currentRemained = this.deductionForm.get('employeeRemainedSalary')?.value;
    
    if (amountDeducted > currentRemained && currentRemained > 0) {
      this.notification.showWarning(`المبلغ المطلوب لا يمكن أن يتجاوز الراتب المتبقي (${currentRemained} جم)`);
      return;
    }

    const deductionTypeObj = this.deductionForm.get('deductionTypeObj')?.value;
    const salaryTypeObj = this.deductionForm.get('salaryTypeObj')?.value;
    
    const deductionData = {
      employeeId: this.deductionForm.get('employeeId')?.value,
      amountDeducted: amountDeducted,
      deductionDate: this.deductionForm.get('deductionDate')?.value,
      deductionType: deductionTypeObj,
      salaryType: salaryTypeObj,
      reason: this.deductionForm.get('reason')?.value,
      note: this.deductionForm.get('note')?.value
    };

    console.log('Submitting deduction data:', deductionData);

    this.isSubmitting = true;

    if (this.isEditMode && this.deductionId) {
      this.financialService.updateSalaryDeduction(this.deductionId, deductionData as any).subscribe({
        next: () => {
          this.notification.showSuccess('تم تحديث الخصم بنجاح');
          this.dialogRef.close(true);
          this.isSubmitting = false;
        },
        error: (err) => {
          console.error('Update error:', err);
          this.notification.showError(err.error?.messageEn || 'حدث خطأ في تحديث الخصم');
          this.isSubmitting = false;
        }
      });
    } else {
      this.financialService.createSalaryDeduction(deductionData as any).subscribe({
        next: () => {
          this.notification.showSuccess('تم إضافة الخصم بنجاح');
          this.dialogRef.close(true);
          this.isSubmitting = false;
        },
        error: (err) => {
          console.error('Create error:', err);
          this.notification.showError(err.error?.messageEn || 'حدث خطأ في إضافة الخصم');
          this.isSubmitting = false;
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}