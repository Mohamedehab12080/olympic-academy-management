import { Component, OnInit, Inject, ViewChild, ElementRef, OnDestroy } from '@angular/core';
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
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';

import { FinancialService } from '../../../../../../core/services/financial.service';
import { EmployeeService } from '../../../../../../core/services/employee.service';
import { NotificationService } from '../../../../../../core/services/notification.service';
import { SearchableSelectComponent, SelectOption } from '../../../../../../shared/components/searchable-select/searchable-select.component';
import { SALARY_TYPES } from '../../../../../../core/models/common.model';
import { DEDUCTION_TYPES } from '../../../../../../core/models/financial.model';

// ============================================================================
// INTERFACES
// ============================================================================

interface EmployeeOption extends SelectOption {
  employeeData?: {
    fullName: string;
    salary: number;
    remainedSalary: number;
    salaryType?: any;
    nationalId?: string;
  };
}

interface WizardStep {
  label: string;
  icon: string;
  completed: boolean;
}

// ============================================================================
// EMPLOYEE SELECTION DIALOG
// ============================================================================

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
    <h2 mat-dialog-title class="dialog-title">
      <mat-icon>people</mat-icon>
      اختيار الموظف
    </h2>
    <mat-dialog-content class="dialog-content">
      <p class="dialog-subtitle">تم العثور على عدة موظفين. الرجاء اختيار الموظف المناسب:</p>
      <mat-list>
        <mat-list-item 
          *ngFor="let employee of data.employees" 
          (click)="selectEmployee(employee)" 
          class="employee-item"
        >
          <mat-icon mat-list-icon class="employee-icon">person</mat-icon>
          <div mat-line class="employee-name"><strong>{{ employee.fullName }}</strong></div>
          <div mat-line class="employee-detail">
            <span class="detail-label">رقم الهوية:</span>
            <span class="detail-value">{{ employee.nationalId || 'غير محدد' }}</span>
          </div>
          <div mat-line class="employee-detail" *ngIf="employee.remainedSalary !== undefined">
            <span class="detail-label">الراتب المتبقي:</span>
            <span class="detail-value salary">{{ employee.remainedSalary | number }} جم</span>
          </div>
          <button 
            mat-raised-button 
            color="primary" 
            (click)="selectEmployee(employee); $event.stopPropagation()"
            class="select-btn"
          >
            <mat-icon>check</mat-icon>
            اختر
          </button>
        </mat-list-item>
      </mat-list>
    </mat-dialog-content>
    <mat-dialog-actions align="end" class="dialog-actions">
      <button mat-button mat-dialog-close>
        <mat-icon>close</mat-icon>
        إلغاء
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-title {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #1a1a1a;
      font-weight: 600;
    }
    .dialog-subtitle {
      color: #6b7280;
      font-size: 14px;
      margin-bottom: 16px;
    }
    .employee-item {
      cursor: pointer;
      transition: all 0.2s ease;
      border-radius: 8px;
      margin-bottom: 8px;
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      padding: 12px 16px !important;
      border: 1px solid #e5e7eb;
      background: white;
    }
    .employee-item:hover {
      background-color: #f3f4f6;
      border-color: #d1d5db;
      transform: translateX(4px);
    }
    .employee-icon {
      color: #6b7280;
    }
    .employee-name {
      font-size: 16px;
      color: #1a1a1a;
    }
    .employee-detail {
      font-size: 13px;
      color: #6b7280;
      margin-top: 2px;
    }
    .detail-label {
      font-weight: 500;
      color: #4b5563;
    }
    .detail-value {
      color: #1f2937;
    }
    .detail-value.salary {
      color: #059669;
      font-weight: 600;
    }
    .select-btn {
      flex-shrink: 0;
    }
    .dialog-actions {
      padding: 12px 24px;
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

// ============================================================================
// MAIN COMPONENT
// ============================================================================

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
    MatListModule,
    SearchableSelectComponent,
    EmployeeSelectionDialogComponent
  ],
  templateUrl: './salary-deduction-wizard-modal.component.html',
  styleUrls: ['./salary-deduction-wizard-modal.component.css']
})
export class SalaryDeductionWizardModalComponent implements OnInit, OnDestroy {
  // ==========================================================================
  // VIEW CHILDREN
  // ==========================================================================

  @ViewChild('barcodeInput') barcodeInput!: ElementRef<HTMLInputElement>;

  // ==========================================================================
  // FORM
  // ==========================================================================

  deductionForm: FormGroup;

  // ==========================================================================
  // STATE
  // ==========================================================================

  isEditMode = false;
  deductionId?: number;
  isLoading = false;
  isSubmitting = false;
  currentStep = 0;
  private destroy$ = new Subject<void>();

  // ==========================================================================
  // DATA
  // ==========================================================================

  employees: any[] = [];
  deductionTypes = DEDUCTION_TYPES;
  salaryTypes = SALARY_TYPES;
  employeeOptions: EmployeeOption[] = [];
  deductionTypeOptions: SelectOption[] = [];
  salaryTypeOptions: SelectOption[] = [];

  // ==========================================================================
  // SELECTED DATA
  // ==========================================================================

  selectedEmployee: any = null;
  maxDeductionAmount: number = 0;

  // ==========================================================================
  // BARCODE SEARCH
  // ==========================================================================

  barcodeSearch: string = '';
  isBarcodeMode: boolean = false;
  barcodeSearchResult: { found: boolean; employeeName?: string; message?: string } | null = null;

  // ==========================================================================
  // WIZARD STEPS
  // ==========================================================================

  steps: WizardStep[] = [
    { label: 'اختر الموظف', icon: 'person', completed: false },
    { label: 'تفاصيل الخصم', icon: 'payments', completed: false },
    { label: 'تأكيد', icon: 'check_circle', completed: false }
  ];

  // ==========================================================================
  // CONSTRUCTOR
  // ==========================================================================

  constructor(
    private fb: FormBuilder,
    private financialService: FinancialService,
    private employeeService: EmployeeService,
    private notification: NotificationService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<SalaryDeductionWizardModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.deductionId = data?.deductionId;
    this.isEditMode = !!this.deductionId;
    
    this.deductionForm = this.createForm();
  }

  // ==========================================================================
  // LIFECYCLE HOOKS
  // ==========================================================================

  ngOnInit(): void {
    this.loadInitialData();
    this.setupFormSubscriptions();
    
    if (this.isEditMode) {
      this.loadDeductionData();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ==========================================================================
  // FORM CREATION
  // ==========================================================================

  private createForm(): FormGroup {
    return this.fb.group({
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

  // ==========================================================================
  // INITIALIZATION
  // ==========================================================================

  private loadInitialData(): void {
    this.loadSelectOptions();
    this.loadEmployees();
  }

  private setupFormSubscriptions(): void {
    // Watch amount changes - FIXED: Use valueChanges
    this.deductionForm.get('amountDeducted')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.calculateNewRemainedSalary();
      });

    // Watch employee changes - FIXED: Use valueChanges
    this.deductionForm.get('employeeId')?.valueChanges
      .pipe(
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.onEmployeeSelect();
      });
  }

  // ==========================================================================
  // DATA LOADING
  // ==========================================================================

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

  loadEmployees(): void {
    this.isLoading = true;
    this.employeeService.getAllEmployeesLookup()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
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

  loadDeductionData(): void {
    this.isLoading = true;
    this.financialService.getSalaryDeductionById(this.deductionId!)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.patchDeductionData(res);
          this.fetchFreshEmployeeData(res.employee?.id, res.amountDeducted);
          this.markStepsCompleted();
          this.currentStep = 2;
          this.isLoading = false;
        },
        error: () => {
          this.notification.showError('حدث خطأ في تحميل بيانات الخصم');
          this.isLoading = false;
        }
      });
  }

  private patchDeductionData(res: any): void {
    const deductionTypeObj = res.deductionType 
      ? this.deductionTypes.find(t => t.id === res.deductionType?.id) 
      : null;
    
    const salaryTypeObj = res.salaryType?.id 
      ? this.salaryTypes.find(s => s.id === res.salaryType.id) 
      : null;

    this.deductionForm.patchValue({
      employeeId: res.employee?.id,
      deductionTypeObj: deductionTypeObj,
      amountDeducted: res.amountDeducted,
      deductionDate: new Date(res.deductionDate),
      salaryTypeObj: salaryTypeObj,
      reason: res.reason,
      note: res.note
    });
  }

  private markStepsCompleted(): void {
    this.steps.forEach(step => step.completed = true);
  }

  // ==========================================================================
  // EMPLOYEE DATA FETCHING
  // ==========================================================================

  fetchFreshEmployeeData(employeeId: number, currentAmount?: number): void {
    if (!employeeId) return;

    this.isLoading = true;
    this.employeeService.getEmployeeById(employeeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (employee: any) => {
          this.updateEmployeeData(employee, currentAmount);
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching employee:', err);
          this.notification.showError('حدث خطأ في تحميل بيانات الموظف');
          this.isLoading = false;
        }
      });
  }

  private updateEmployeeData(employee: any, currentAmount?: number): void {
    const currentRemainedSalary = employee.remainedSalary || 0;
    
    if (this.isEditMode && currentAmount !== undefined) {
      const previousRemained = currentRemainedSalary + currentAmount;
      this.maxDeductionAmount = previousRemained;
      
      this.deductionForm.patchValue({
        employeeFullName: employee.title || employee.fullName,
        employeeSalary: employee.salary || 0,
        employeeRemainedSalary: previousRemained,
        newRemainedSalary: previousRemained - currentAmount
      });
    } else {
      this.maxDeductionAmount = currentRemainedSalary;
      
      this.deductionForm.patchValue({
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

    this.updateAmountValidators();
  }

  private updateAmountValidators(): void {
    const amountControl = this.deductionForm.get('amountDeducted');
    if (amountControl) {
      amountControl.setValidators([
        Validators.required,
        Validators.min(1),
        Validators.max(this.maxDeductionAmount || 0)
      ]);
      amountControl.updateValueAndValidity();
    }
  }

  // ==========================================================================
  // EMPLOYEE SELECTION
  // ==========================================================================

  onEmployeeSelect(): void {
    const employeeId = this.deductionForm.get('employeeId')?.value;
    
    if (!employeeId) {
      this.clearEmployeeSelection();
      return;
    }
    
    this.fetchFreshEmployeeData(employeeId);
  }

  private clearEmployeeSelection(): void {
    this.selectedEmployee = null;
    this.maxDeductionAmount = 0;
    this.deductionForm.patchValue({
      employeeFullName: null,
      employeeSalary: null,
      employeeRemainedSalary: null,
      amountDeducted: null,
      newRemainedSalary: null
    });
  }

  // ==========================================================================
  // BARCODE SEARCH
  // ==========================================================================

  toggleBarcodeMode(): void {
    this.isBarcodeMode = !this.isBarcodeMode;
    if (this.isBarcodeMode) {
      setTimeout(() => this.barcodeInput?.nativeElement.focus(), 100);
    } else {
      this.clearBarcodeSearch();
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

    this.employeeService.getAllEmployeesLookup()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          const allEmployees = res || [];
          const matchedEmployees = allEmployees.filter((e: any) => 
            e.nationalId && e.nationalId.includes(searchValue)
          );

          this.handleBarcodeSearchResult(matchedEmployees, searchValue);
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

  private handleBarcodeSearchResult(matchedEmployees: any[], searchValue: string): void {
    if (matchedEmployees.length === 0) {
      this.barcodeSearchResult = {
        found: false,
        message: 'لم يتم العثور على موظف بهذا الرقم'
      };
      this.notification.showError('لم يتم العثور على موظف');
      return;
    }

    const exactMatch = matchedEmployees.find((e: any) => e.nationalId === searchValue);

    if (exactMatch) {
      this.selectEmployeeInWizard(exactMatch);
      this.notification.showSuccess(`تم العثور على الموظف: ${exactMatch.fullName}`);
      return;
    }

    if (matchedEmployees.length > 1) {
      this.showEmployeeSelectionDialog(matchedEmployees);
      return;
    }

    const employee = matchedEmployees[0];
    this.selectEmployeeInWizard(employee);
    this.notification.showSuccess(`تم العثور على الموظف: ${employee.fullName}`);
  }

  private selectEmployeeInWizard(employee: any): void {
    this.barcodeSearchResult = {
      found: true,
      employeeName: employee.fullName
    };
    
    this.deductionForm.patchValue({ employeeId: employee.id });
    this.barcodeSearch = '';
    this.isBarcodeMode = false;
    
    // Auto-advance after selection
    setTimeout(() => {
      if (this.isStepValid(0)) {
        this.steps[0].completed = true;
        if (this.currentStep === 0) {
          this.currentStep = 1;
        }
      }
    }, 500);
  }

  private showEmployeeSelectionDialog(employees: any[]): void {
    const selectionDialog = this.dialog.open(EmployeeSelectionDialogComponent, {
      width: '550px',
      maxWidth: '95vw',
      maxHeight: '80vh',
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
  // CALCULATIONS
  // ==========================================================================

  calculateNewRemainedSalary(): void {
    const currentRemained = this.deductionForm.get('employeeRemainedSalary')?.value || 0;
    const amountDeducted = this.deductionForm.get('amountDeducted')?.value || 0;
    
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

  // ==========================================================================
  // STEP NAVIGATION
  // ==========================================================================

  goToStep(step: number): void {
    if (step <= this.currentStep || this.isStepValid(step - 1)) {
      this.currentStep = step;
    }
  }

  nextStep(): void {
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

  previousStep(): void {
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
               this.deductionForm.get('deductionTypeObj')?.valid === true &&
               amountDeducted <= currentRemained;
      default:
        return true;
    }
  }

  markCurrentStepFieldsAsTouched(): void {
    switch(this.currentStep) {
      case 0:
        this.deductionForm.get('employeeId')?.markAsTouched();
        break;
      case 1:
        this.deductionForm.get('deductionTypeObj')?.markAsTouched();
        this.deductionForm.get('amountDeducted')?.markAsTouched();
        this.deductionForm.get('deductionDate')?.markAsTouched();
        break;
    }
  }

  // ==========================================================================
  // GETTERS
  // ==========================================================================

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

  getDeductionTypeIcon(): string {
    const typeObj = this.deductionForm.get('deductionTypeObj')?.value;
    if (!typeObj) return 'remove_circle';
    switch(typeObj.id) {
      case 1: return 'money_off';
      case 2: return 'schedule';
      case 3: return 'gavel';
      default: return 'remove_circle';
    }
  }

  getEmployeeName(): string {
    return this.selectedEmployee?.fullName || '';
  }

  getEmployeeNationalId(): string {
    return this.selectedEmployee?.nationalId || '';
  }

  // ==========================================================================
  // SUBMIT
  // ==========================================================================

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

    const deductionData = this.buildDeductionData();
    console.log('Submitting deduction data:', deductionData);

    this.isSubmitting = true;

    const request$ = this.isEditMode && this.deductionId
      ? this.financialService.updateSalaryDeduction(this.deductionId, deductionData)
      : this.financialService.createSalaryDeduction(deductionData);

    request$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        const message = this.isEditMode ? 'تم تحديث الخصم بنجاح' : 'تم إضافة الخصم بنجاح';
        this.notification.showSuccess(message);
        this.dialogRef.close(true);
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('Submit error:', err);
        this.notification.showError(err.error?.messageEn || 'حدث خطأ في حفظ الخصم');
        this.isSubmitting = false;
      }
    });
  }

  private buildDeductionData(): any {
    const deductionTypeObj = this.deductionForm.get('deductionTypeObj')?.value;
    const salaryTypeObj = this.deductionForm.get('salaryTypeObj')?.value;
    const deductionDate = this.deductionForm.get('deductionDate')?.value;
    
    return {
      employeeId: this.deductionForm.get('employeeId')?.value,
      amountDeducted: this.deductionForm.get('amountDeducted')?.value,
      deductionDate: this.formatDate(deductionDate),
      deductionType: deductionTypeObj?.id || deductionTypeObj,
      salaryType: this.convertSalaryTypeToEnum(salaryTypeObj),
      reason: this.deductionForm.get('reason')?.value,
      note: this.deductionForm.get('note')?.value
    };
  }

  // FIXED: Return empty string instead of null
  private formatDate(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private convertSalaryTypeToEnum(salaryTypeObj: any): string | null {
    if (!salaryTypeObj) return null;
    const mapping: { [key: number]: string } = {
      1: 'MONTHLY',
      2: 'HOURLY', 
      3: 'DAILY',
      4: 'PERCENTAGE'
    };
    return mapping[salaryTypeObj.id] || null;
  }

  // ==========================================================================
  // CANCEL
  // ==========================================================================

  onCancel(): void {
    this.dialogRef.close(false);
  }
}