import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

// Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { FinancialService } from '../../../../../../core/services/financial.service';
import { EmployeeService } from '../../../../../../core/services/employee.service';
import { NotificationService } from '../../../../../../core/services/notification.service';
import { SearchableSelectComponent, SelectOption } from '../../../../../../shared/components/searchable-select/searchable-select.component';
import { SALARY_TYPES } from '../../../../../../core/models/common.model';

@Component({
  selector: 'app-salary-deduction-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    SearchableSelectComponent
  ],
  templateUrl: './salary-deduction-form.component.html',
  styleUrls: ['./salary-deduction-form.component.css']
})
export class SalaryDeductionFormComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  itemId?: number;
  employees: SelectOption[] = [];
  salaryTypes: SelectOption[] = [];  // ✅ تغيير النوع إلى SelectOption[]
  isSubmitting = false;

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
      amountDeducted: [null, [Validators.required, Validators.min(1)]],
      deductionDate: [null, Validators.required],
      salaryType: [null],
      reason: [''],
      note: ['']
    });
  }

  ngOnInit() {
    this.loadEmployees();
    this.loadSalaryTypes();
    this.itemId = this.route.snapshot.params['id'];
    if (this.itemId) {
      this.isEditMode = true;
      this.loadItemData();
    }
  }

  loadEmployees() {
    this.employeeService.getAllEmployeesLookup().subscribe({
      next: (res: any) => {
        this.employees = res.list.map((emp: any) => ({ 
          value: emp.id, 
          label: emp.title 
        }));
      },
      error: () => { 
        this.notification.showError('حدث خطأ في تحميل بيانات الموظفين'); 
      }
    });
  }

  // ✅ تحويل SALARY_TYPES إلى SelectOption[]
  loadSalaryTypes() {
    this.salaryTypes = SALARY_TYPES.map((type: any) => ({ 
      value: type, 
      label: type.title 
    }));
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
          note: res.note
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

    this.isSubmitting = true;
    const formData = this.form.value;

    if (this.isEditMode && this.itemId) {
      this.financialService.updateSalaryDeduction(this.itemId, formData).subscribe({
        next: () => {
          this.notification.showSuccess('تم تحديث الخصم بنجاح');
          this.router.navigate(['/financial/salary-deductions']);
          this.isSubmitting = false;
        },
        error: () => {
          this.notification.showError('حدث خطأ في تحديث الخصم');
          this.isSubmitting = false;
        }
      });
    } else {
      this.financialService.createSalaryDeduction(formData).subscribe({
        next: () => {
          this.notification.showSuccess('تم إضافة الخصم بنجاح');
          this.router.navigate(['/financial/salary-deductions']);
          this.isSubmitting = false;
        },
        error: () => {
          this.notification.showError('حدث خطأ في إضافة الخصم');
          this.isSubmitting = false;
        }
      });
    }
  }
}