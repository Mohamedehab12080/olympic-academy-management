import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FinancialService } from '../../../../../../core/services/financial.service';
import { EnrollmentService } from '../../../../../../core/services/enrollment.service';
import { NotificationService } from '../../../../../../core/services/notification.service';
import { REFUND_STATUSES } from '../../../../../../core/models/financial.model';

@Component({
  selector: 'app-enrollment-refund-form',
  standalone: false,
  template: `
    <div class="form-container">
      <mat-card>
        <div class="form-header"><button mat-icon-button routerLink="/financial/enrollment-refunds"><mat-icon>arrow_forward</mat-icon></button><h2>{{ isEditMode ? 'تعديل استرداد' : 'إضافة استرداد جديد' }}</h2></div>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-grid">
            <mat-form-field appearance="outline"><mat-label>التسجيل *</mat-label><mat-select formControlName="enrollmentId" (selectionChange)="onEnrollmentSelect()"><mat-option *ngFor="let e of enrollments" [value]="e.id">{{ e.title }}</mat-option><\/mat-select><\/mat-form-field>
            <mat-form-field appearance="outline"><mat-label>المبلغ القابل للاسترداد</mat-label><input matInput type="number" formControlName="refundableAmount" readonly><\/mat-form-field>
            <mat-form-field appearance="outline"><mat-label>المبلغ المسترد *</mat-label><input matInput type="number" formControlName="amountRefunded"><\/mat-form-field>
            <mat-form-field appearance="outline"><mat-label>تاريخ الاسترداد *</mat-label><input matInput [matDatepicker]="datePicker" formControlName="refundDate"><mat-datepicker-toggle matSuffix [for]="datePicker"><\/mat-datepicker-toggle><mat-datepicker #datePicker><\/mat-datepicker><\/mat-form-field>
            <mat-form-field appearance="outline"><mat-label>طريقة الدفع</mat-label><mat-select formControlName="paymentMethodId"><mat-option *ngFor="let pm of paymentMethods" [value]="pm.id">{{ pm.title }}</mat-option><\/mat-select><\/mat-form-field>
            <mat-form-field appearance="outline"><mat-label>حالة الاسترداد</mat-label><mat-select formControlName="status"><mat-option *ngFor="let s of refundStatuses" [value]="s">{{ s.title }}</mat-option><\/mat-select><\/mat-form-field>
            <mat-form-field appearance="outline" class="full-width"><mat-label>ملاحظات</mat-label><textarea matInput formControlName="note" rows="3"><\/textarea><\/mat-form-field>
          <\/div>
          <div class="form-actions"><button mat-raised-button color="primary" type="submit"><mat-icon>save</mat-icon> {{ isEditMode ? 'تحديث' : 'حفظ' }}<\/button><button mat-stroked-button type="button" routerLink="/financial/enrollment-refunds">إلغاء<\/button><\/div>
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
export class EnrollmentRefundFormComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  itemId?: number;
  enrollments: any[] = [];
  paymentMethods: any[] = [];
  refundStatuses = REFUND_STATUSES;

  constructor(private fb: FormBuilder, private financialService: FinancialService, private enrollmentService: EnrollmentService, private notification: NotificationService, private route: ActivatedRoute, private router: Router) {
    this.form = this.fb.group({
      enrollmentId: [null, Validators.required],
      refundableAmount: [{ value: null, disabled: true }],
      amountRefunded: [null, Validators.required],
      refundDate: [null, Validators.required],
      paymentMethodId: [null],
      status: [null],
      note: ['']
    });
  }

  ngOnInit() {
    this.loadEnrollments();
    this.loadPaymentMethods();
    this.itemId = this.route.snapshot.params['id'];
    if (this.itemId) {
      this.isEditMode = true;
      this.financialService.getEnrollmentRefundById(this.itemId).subscribe({
        next: (res: any) => { this.form.patchValue(res); },
        error: () => { this.notification.showError('حدث خطأ'); this.router.navigate(['/financial/enrollment-refunds']); }
      });
    }
  }

  loadEnrollments() { this.enrollmentService.getAllEnrollmentsByFilter().subscribe((res: any) => this.enrollments = res.items.map((e: any) => ({ id: e.id, title: `${e.trainee?.title} - ${e.course?.title}`, remainedValue: e.remainedSubscriptionValue }))); }
  loadPaymentMethods() { this.financialService.getAllPaymentMethodsLookup().subscribe((res: any) => this.paymentMethods = res.list); }

  onEnrollmentSelect() {
    const enrollmentId = this.form.get('enrollmentId')?.value;
    const enrollment = this.enrollments.find(e => e.id === enrollmentId);
    if (enrollment) { this.form.patchValue({ refundableAmount: enrollment.remainedValue }); }
  }

  onSubmit() {
    if (this.form.invalid) return;
    if (this.isEditMode && this.itemId) {
      this.financialService.updateEnrollmentRefund(this.itemId, this.form.value).subscribe({
        next: () => { this.notification.showSuccess('تم التحديث'); this.router.navigate(['/financial/enrollment-refunds']); },
        error: () => this.notification.showError('حدث خطأ')
      });
    } else {
      this.financialService.createEnrollmentRefund(this.form.value).subscribe({
        next: () => { this.notification.showSuccess('تم الإضافة'); this.router.navigate(['/financial/enrollment-refunds']); },
        error: () => this.notification.showError('حدث خطأ')
      });
    }
  }
}