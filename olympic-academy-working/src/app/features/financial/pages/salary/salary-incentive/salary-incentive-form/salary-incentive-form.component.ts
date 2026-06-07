import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FinancialService } from '../../../../../../core/services/financial.service';
import { EmployeeService } from '../../../../../../core/services/employee.service';
import { NotificationService } from '../../../../../../core/services/notification.service';
import { SALARY_TYPES } from '../../../../../../core/models/common.model';
import { SALARY_TRANSACTION_TYPES } from '../../../../../../core/models/financial.model';

@Component({
  selector: 'app-salary-incentive-form',
  templateUrl: './salary-incentive-form.component.html',
  styleUrls: ['./salary-incentive-form.component.css']
})
export class SalaryIncentiveFormComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  itemId?: number;
  employees: any[] = [];
  paymentMethods: any[] = [];
  transactionTypes = SALARY_TRANSACTION_TYPES;
  salaryTypes = SALARY_TYPES;
  
  // عنوان النموذج حسب نوع المعاملة
  formTitle: string = 'إضافة معاملة جديدة';
  transactionTypeName: string = '';

  constructor(
    private fb: FormBuilder,
    private financialService: FinancialService,
    private employeeService: EmployeeService,
    private notification: NotificationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      employeeId: [null, Validators.required],
      type: [null, Validators.required],
      amountWithdrawn: [null, [Validators.required, Validators.min(1)]],
      withdrawDate: [null, Validators.required],
      paymentMethodId: [null],
      salaryType: [null],
      note: ['']
    });
  }

  ngOnInit() {
    this.loadEmployees();
    this.loadPaymentMethods();
    
    // مراقبة تغيير نوع المعاملة لتحديث عنوان النموذج
    this.form.get('type')?.valueChanges.subscribe((type) => {
      if (type) {
        this.transactionTypeName = type.title;
        this.updateFormTitle();
      }
    });

    this.itemId = this.route.snapshot.params['id'];
    if (this.itemId) {
      this.isEditMode = true;
      this.loadTransactionData();
    }
  }

  loadEmployees() {
    this.employeeService.getAllEmployeesLookup().subscribe({
      next: (res: any) => { this.employees = res.list; },
      error: () => { this.notification.showError('حدث خطأ في تحميل الموظفين'); }
    });
  }

  loadPaymentMethods() {
    this.financialService.getAllPaymentMethodsLookup().subscribe({
      next: (res: any) => { this.paymentMethods = res.list; },
      error: () => { this.notification.showError('حدث خطأ في تحميل طرق الدفع'); }
    });
  }

  loadTransactionData() {
    this.financialService.getSalaryIncentiveById(this.itemId!).subscribe({
      next: (res: any) => {
        this.form.patchValue({
          employeeId: res.employee?.id,
          type: res.type,
          amountWithdrawn: res.amountWithdrawn,
          withdrawDate: res.withdrawDate,
          paymentMethodId: res.paymentMethod?.id,
          salaryType: res.salaryType,
          note: res.note
        });
        if (res.type) {
          this.transactionTypeName = res.type.title;
          this.updateFormTitle();
        }
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل البيانات');
        this.router.navigate(['/financial/salary-incentives']);
      }
    });
  }

  updateFormTitle() {
    if (this.isEditMode) {
      this.formTitle = `تعديل ${this.transactionTypeName}`;
    } else {
      this.formTitle = `إضافة ${this.transactionTypeName} جديد`;
    }
  }

  getTransactionTypeClass(typeId: number): string {
    switch(typeId) {
      case 1: return 'salary';
      case 2: return 'incentive';
      case 3: return 'bonus';
      case 4: return 'advance';
      default: return '';
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notification.showWarning('يرجى تعبئة جميع الحقول المطلوبة');
      return;
    }

    const formData = this.form.value;

    if (this.isEditMode && this.itemId) {
      this.financialService.updateSalaryIncentive(this.itemId, formData).subscribe({
        next: () => {
          this.notification.showSuccess(`تم تحديث ${this.transactionTypeName} بنجاح`);
          this.router.navigate(['/financial/salary-incentives']);
        },
        error: (err) => {
          this.notification.showError(err.error?.messageEn || 'حدث خطأ في التحديث');
        }
      });
    } else {
      this.financialService.createSalaryIncentive(formData).subscribe({
        next: () => {
          this.notification.showSuccess(`تم إضافة ${this.transactionTypeName} بنجاح`);
          this.router.navigate(['/financial/salary-incentives']);
        },
        error: (err) => {
          this.notification.showError(err.error?.messageEn || 'حدث خطأ في الإضافة');
        }
      });
    }
  }

  getFormTitle(): string {
    return this.formTitle;
  }
}