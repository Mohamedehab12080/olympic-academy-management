import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../../../core/services/employee.service';
import { DepartmentService } from '../../../../core/services/department.service';
import { NotificationService } from '../../../../core/services/notification.service';
import {EMPLOYEE_TYPES} from '../../../../core/models/employee.model';
import { GENDERS, SALARY_TYPES, CONTACT_TYPES } from '../../../../core/models/common.model';

@Component({
  selector: 'app-employee-form',
  template: `
    <div class="form-container">
      <mat-card>
        <div class="form-header">
          <button mat-icon-button routerLink="/employees"><mat-icon>arrow_forward</mat-icon></button>
          <h2>{{ isEditMode ? 'تعديل موظف' : 'إضافة موظف جديد' }}</h2>
        </div>

        <form [formGroup]="employeeForm" (ngSubmit)="onSubmit()">
          <div class="tabs-container">
            <!-- تبويب المعلومات الأساسية -->
            <div class="tab-section">
              <h3>المعلومات الأساسية</h3>
              <div class="form-grid">
                <mat-form-field appearance="outline"><mat-label>الاسم الكامل *</mat-label><input matInput formControlName="fullName"></mat-form-field>
                <mat-form-field appearance="outline"><mat-label>رقم الهوية *</mat-label><input matInput formControlName="nationalId" maxlength="14"></mat-form-field>
                <mat-form-field appearance="outline"><mat-label>تاريخ الميلاد</mat-label><input matInput [matDatepicker]="birthPicker" formControlName="birthDate"><mat-datepicker-toggle matSuffix [for]="birthPicker"></mat-datepicker-toggle><mat-datepicker #birthPicker></mat-datepicker></mat-form-field>
                <mat-form-field appearance="outline"><mat-label>الجنس</mat-label><mat-select formControlName="gender"><mat-option *ngFor="let g of genders" [value]="g">{{ g.title }}</mat-option></mat-select></mat-form-field>
                <mat-form-field appearance="outline"><mat-label>نوع الموظف *</mat-label><mat-select formControlName="employeeType"><mat-option *ngFor="let t of employeeTypes" [value]="t">{{ t.title }}</mat-option></mat-select></mat-form-field>
                <mat-form-field appearance="outline"><mat-label>تاريخ التوظيف</mat-label><input matInput [matDatepicker]="hirePicker" formControlName="hireDate"><mat-datepicker-toggle matSuffix [for]="hirePicker"></mat-datepicker-toggle><mat-datepicker #hirePicker></mat-datepicker></mat-form-field>
              </div>
            </div>

            <!-- تبويب المالية -->
            <div class="tab-section">
              <h3>المالية</h3>
              <div class="form-grid">
                <mat-form-field appearance="outline"><mat-label>الراتب</mat-label><input matInput type="number" formControlName="salary"></mat-form-field>
                <mat-form-field appearance="outline"><mat-label>نوع الراتب</mat-label><mat-select formControlName="salaryType"><mat-option *ngFor="let s of salaryTypes" [value]="s">{{ s.title }}</mat-option></mat-select></mat-form-field>
              </div>
            </div>

            <!-- تبويب الأقسام -->
            <div class="tab-section">
              <h3>الأقسام</h3>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>الأقسام</mat-label>
                <mat-select formControlName="departmentIds" multiple>
                  <mat-option *ngFor="let dept of departments" [value]="dept.id">{{ dept.title }}</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <!-- تبويب جهات الاتصال -->
            <div class="tab-section">
              <h3>جهات الاتصال</h3>
              <div formArrayName="contacts">
                <div *ngFor="let contact of contacts.controls; let i=index" [formGroupName]="i" class="contact-row">
                  <mat-form-field appearance="outline"><mat-label>النوع</mat-label><mat-select formControlName="contactType"><mat-option *ngFor="let ct of contactTypes" [value]="ct">{{ ct.title }}</mat-option></mat-select></mat-form-field>
                  <mat-form-field appearance="outline"><mat-label>القيمة</mat-label><input matInput formControlName="contactValue"></mat-form-field>
                  <button mat-icon-button color="warn" (click)="removeContact(i)" *ngIf="contacts.length > 1"><mat-icon>delete</mat-icon></button>
                </div>
                <button mat-stroked-button type="button" (click)="addContact()"><mat-icon>add</mat-icon> إضافة جهة اتصال</button>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button mat-raised-button color="primary" type="submit" [disabled]="employeeForm.invalid"><mat-icon>save</mat-icon> {{ isEditMode ? 'تحديث' : 'حفظ' }}</button>
            <button mat-stroked-button type="button" routerLink="/employees">إلغاء</button>
          </div>
        </form>
      </mat-card>
    </div>
  `,
  styles: [`
    .form-container { max-width: 1000px; margin: 0 auto; padding: 24px; }
    .form-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
    .form-header h2 { margin: 0; font-size: 24px; font-weight: 600; }
    .tab-section { margin-bottom: 32px; padding: 16px; background: #f9fafb; border-radius: 12px; }
    .tab-section h3 { margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #2563eb; }
    .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
    .full-width { width: 100%; margin: 16px 0; }
    .contact-row { display: grid; grid-template-columns: 1fr 2fr auto; gap: 16px; align-items: center; margin-bottom: 16px; }
    .form-actions { display: flex; gap: 16px; margin-top: 24px; justify-content: flex-end; }
    @media (max-width: 768px) { .form-grid { grid-template-columns: 1fr; } .contact-row { grid-template-columns: 1fr; } }
  `]
})
export class EmployeeFormComponent implements OnInit {
  employeeForm: FormGroup;
  isEditMode = false;
  employeeId?: number;
  departments: any[] = [];
  genders = GENDERS;
  employeeTypes = EMPLOYEE_TYPES;
  salaryTypes = SALARY_TYPES;
  contactTypes = CONTACT_TYPES;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private notification: NotificationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.employeeForm = this.fb.group({
      fullName: ['', Validators.required],
      nationalId: ['', Validators.required],
      birthDate: [''],
      gender: [null],
      employeeType: [null, Validators.required],
      salary: [null],
      salaryType: [null],
      hireDate: [''],
      departmentIds: [[]],
      contacts: this.fb.array([])
    });
  }

  get contacts() { return this.employeeForm.get('contacts') as FormArray; }

  addContact() { this.contacts.push(this.fb.group({ contactType: [null], contactValue: [''] })); }
  removeContact(index: number) { this.contacts.removeAt(index); }

  ngOnInit() {
    this.loadDepartments();
    this.addContact();
    this.employeeId = this.route.snapshot.params['id'];
    if (this.employeeId) { this.isEditMode = true; this.loadEmployee(); }
  }

  loadDepartments() { this.departmentService.getAllDepartmentsLookup().subscribe((res: any) => this.departments = res.list); }

  loadEmployee() {
    this.employeeService.getEmployeeById(this.employeeId!).subscribe((emp: any) => {
      this.employeeForm.patchValue(emp);
      if (emp.contacts?.length) {
        while (this.contacts.length) this.contacts.removeAt(0);
        emp.contacts.forEach((c: any) => this.contacts.push(this.fb.group({ contactType: [c.contactType], contactValue: [c.contactValue] })));
      }
    });
  }

  onSubmit() {
    if (this.employeeForm.invalid) return;
    const formData = this.employeeForm.value;
    if (this.isEditMode) {
      this.employeeService.updateEmployee(this.employeeId!, formData).subscribe({
        next: () => { this.notification.showSuccess('تم تحديث الموظف'); this.router.navigate(['/employees']); },
        error: () => this.notification.showError('حدث خطأ')
      });
    } else {
      this.employeeService.createEmployee(formData).subscribe({
        next: () => { this.notification.showSuccess('تم إضافة الموظف'); this.router.navigate(['/employees']); },
        error: () => this.notification.showError('حدث خطأ')
      });
    }
  }
}