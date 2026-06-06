import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FinancialService } from '../../../../../../core/services/financial.service';
import { EnrollmentService } from '../../../../../../core/services/enrollment.service';
import { NotificationService } from '../../../../../../core/services/notification.service';
import { PAYMENT_STATUSES } from '../../../../../../core/models/common.model';

@Component({
  selector: 'app-enrollment-payment-form',
  standalone: false,
  template: `
    <div class="form-container">
      <mat-card>
        <div class="form-header"><button mat-icon-button routerLink="/financial/enrollment-payments"><mat-icon>arrow_forward</mat-icon></button><h2>{{ isEditMode ? 'تعديل دفعة' : 'إضافة دفعة جديدة' }}</h2></div>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-grid">
            <mat-form-field appearance="outline"><mat-label>التسجيل *</mat-label><mat-select formControlName="enrollmentId" (selectionChange)="onEnrollmentSelect()"><mat-option *ngFor="let e of enrollments" [value]="e.id">{{ e.title }}</mat-option><\/mat-select><\/mat-form-field>
            <mat-form-field appearance="outline"><mat-label>قيمة التسجيل</mat-label><input matInput type="number" formControlName="enrollmentValue" readonly><\/mat-form-field>
            <mat-form-field appearance="outline"><mat-label>المبلغ المدفوع *</mat-label><input matInput type="number" formControlName="paidAmount" (input)="calculateRemained()"><\/mat-form-field>
            <mat-form-field appearance="outline"><mat-label>المتبقي</mat-label><input matInput type="number" formControlName="remainedValue" readonly><\/mat-form-field>
            <mat-form-field appearance="outline"><mat-label>تاريخ الدفع *</mat-label><input matInput [matDatepicker]="datePicker" formControlName="paymentDate"><mat-datepicker-toggle matSuffix [for]="datePicker"><\/mat-datepicker-toggle><mat-datepicker #datePicker><\/mat-datepicker><\/mat-form-field>
            <mat-form-field appearance="outline"><mat-label>طريقة الدفع</mat-label><mat-select formControlName="paymentMethodId"><mat-option *ngFor="let pm of paymentMethods" [value]="pm.id">{{ pm.title }}</mat-option><\/mat-select><\/mat-form-field>
            <mat-form-field appearance="outline"><mat-label>حالة الدفع</mat-label><mat-select formControlName="paymentStatus"><mat-option *ngFor="let s of paymentStatuses" [value]="s">{{ s.title }}</mat-option><\/mat-select><\/mat-form-field>
            <mat-form-field appearance="outline" class="full-width"><mat-label>ملاحظات</mat-label><textarea matInput formControlName="note" rows="3"><\/textarea><\/mat-form-field>
          <\/div>
          <div class="form-actions"><button mat-raised-button color="primary" type="submit"><mat-icon>save</mat-icon> {{ isEditMode ? 'تحديث' : 'حفظ' }}<\/button><button mat-stroked-button type="button" routerLink="/financial/enrollment-payments">إلغاء<\/button><\/div>
        <\/form>
      <\/mat-card>
    <\/div>
  `,
  styles: [`
    .form-container { max-width: 800px; margin: 0 auto; padding: 24px; }
    .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
    .full-width { grid-column: span 2; }
    .form-actions { display: flex; gap: 16px; justify-content: flex-end; margin-top: 24px; }
  `]
})
export class EnrollmentPaymentFormComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  itemId?: number;
  enrollments: any[] = [];
  paymentMethods: any[] = [];
  paymentStatuses = PAYMENT_STATUSES;

  constructor(private fb: FormBuilder, private financialService: FinancialService, private enrollmentService: EnrollmentService, private notification: NotificationService, private route: ActivatedRoute, private router: Router) {
    this.form = this.fb.group({
      enrollmentId: [null, Validators.required],
      enrollmentValue: [{ value: null, disabled: true }],
      paidAmount: [null, Validators.required],
      remainedValue: [{ value: null, disabled: true }],
      paymentDate: [null, Validators.required],
      paymentMethodId: [null],
      paymentStatus: [null],
      note: ['']
    });
  }

  ngOnInit() {
    this.loadEnrollments();
    this.loadPaymentMethods();
    this.itemId = this.route.snapshot.params['id'];
    if (this.itemId) {
      this.isEditMode = true;
      this.financialService.getEnrollmentPaymentById(this.itemId).subscribe({
        next: (res: any) => { this.form.patchValue(res); this.calculateRemained(); },
        error: () => { this.notification.showError('حدث خطأ'); this.router.navigate(['/financial/enrollment-payments']); }
      });
    }
  }

  loadEnrollments() { this.enrollmentService.getAllEnrollmentsByFilter().subscribe((res: any) => this.enrollments = res.items.map((e: any) => ({ id: e.id, title: `${e.trainee?.title} - ${e.course?.title}` }))); }
  loadPaymentMethods() { this.financialService.getAllPaymentMethodsLookup().subscribe((res: any) => this.paymentMethods = res.list); }

  onEnrollmentSelect() {
    const enrollmentId = this.form.get('enrollmentId')?.value;
    const enrollment = this.enrollments.find(e => e.id === enrollmentId);
    if (enrollment) { this.form.patchValue({ enrollmentValue: enrollment.finalSubscriptionValue }); this.calculateRemained(); }
  }

  calculateRemained() {
    const enrollmentValue = this.form.get('enrollmentValue')?.value || 0;
    const paidAmount = this.form.get('paidAmount')?.value || 0;
    this.form.get('remainedValue')?.setValue(enrollmentValue - paidAmount);
  }

  onSubmit() {
    if (this.form.invalid) return;
    const formValue = { ...this.form.value, remainedValue: this.form.get('remainedValue')?.value };
    if (this.isEditMode && this.itemId) {
      this.financialService.updateEnrollmentPayment(this.itemId, formValue).subscribe({
        next: () => { this.notification.showSuccess('تم التحديث'); this.router.navigate(['/financial/enrollment-payments']); },
        error: () => this.notification.showError('حدث خطأ')
      });
    } else {
      this.financialService.createEnrollmentPayment(formValue).subscribe({
        next: () => { this.notification.showSuccess('تم الإضافة'); this.router.navigate(['/financial/enrollment-payments']); },
        error: () => this.notification.showError('حدث خطأ')
      });
    }
  }
}