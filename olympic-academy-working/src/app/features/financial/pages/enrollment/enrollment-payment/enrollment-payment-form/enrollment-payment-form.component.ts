import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FinancialService } from '../../../../../../core/services/financial.service';
import { EnrollmentService } from '../../../../../../core/services/enrollment.service';
import { NotificationService } from '../../../../../../core/services/notification.service';
import { PAYMENT_STATUSES } from '../../../../../../core/models/common.model';

@Component({
  selector: 'app-enrollment-payment-form',
  templateUrl: './enrollment-payment-form.component.html',
  styleUrls: ['./enrollment-payment-form.component.css']
})
export class EnrollmentPaymentFormComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  itemId?: number;
  enrollments: any[] = [];
  paymentMethods: any[] = [];
  paymentStatuses = PAYMENT_STATUSES;
  
  // إضافات للتحسين
  selectedEnrollment: any = null;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private financialService: FinancialService,
    private enrollmentService: EnrollmentService,
    private notification: NotificationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      enrollmentId: [null, Validators.required],
      enrollmentValue: [{ value: null, disabled: true }],
      paidAmount: [null, [Validators.required, Validators.min(1)]],
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
      this.loadPaymentData();
    }
  }

  loadEnrollments() {
    this.enrollmentService.getAllEnrollmentsByFilter().subscribe({
      next: (res: any) => {
        this.enrollments = res.items.map((e: any) => ({ 
          id: e.id, 
          title: `${e.trainee?.title || 'غير محدد'} - ${e.course?.title || 'غير محدد'}`,
          finalSubscriptionValue: e.finalSubscriptionValue,
          remainedSubscriptionValue: e.remainedSubscriptionValue
        }));
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل التسجيلات');
      }
    });
  }

  loadPaymentMethods() {
    this.financialService.getAllPaymentMethodsLookup().subscribe({
      next: (res: any) => {
        this.paymentMethods = res.list;
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل طرق الدفع');
      }
    });
  }

  loadPaymentData() {
    this.financialService.getEnrollmentPaymentById(this.itemId!).subscribe({
      next: (res: any) => {
        this.form.patchValue({
          enrollmentId: res.enrollment?.id,
          enrollmentValue: res.enrollmentValue,
          paidAmount: res.paidAmount,
          remainedValue: res.remainedValue,
          paymentDate: res.paymentDate,
          paymentMethodId: res.paymentMethod?.id,
          paymentStatus: res.paymentStatus,
          note: res.note
        });
        this.selectedEnrollment = res.enrollment;
        this.calculateRemained();
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل بيانات الدفعة');
        this.router.navigate(['/financial/enrollment-payments']);
      }
    });
  }

  onEnrollmentSelect() {
    const enrollmentId = this.form.get('enrollmentId')?.value;
    this.selectedEnrollment = this.enrollments.find(e => e.id === enrollmentId);
    if (this.selectedEnrollment) {
      this.form.patchValue({ 
        enrollmentValue: this.selectedEnrollment.finalSubscriptionValue 
      });
      this.calculateRemained();
    }
  }

  calculateRemained() {
    const enrollmentValue = this.form.get('enrollmentValue')?.value || 0;
    const paidAmount = this.form.get('paidAmount')?.value || 0;
    const remained = enrollmentValue - paidAmount;
    this.form.get('remainedValue')?.setValue(remained >= 0 ? remained : 0);
    
    // إذا كان المبلغ المتبقي 0، قم بتحديث حالة الدفع إلى "مدفوع"
    if (remained <= 0 && paidAmount > 0) {
      const paidStatus = this.paymentStatuses.find(s => s.id === 2);
      if (paidStatus) {
        this.form.get('paymentStatus')?.setValue(paidStatus);
      }
    }
  }

  getStatusColor(statusId: number): string {
    switch(statusId) {
      case 2: return '#10b981'; // مدفوع - أخضر
      case 1: return '#f59e0b'; // قيد الانتظار - أصفر
      case 3: return '#ef4444'; // فشل - أحمر
      default: return '#6b7280';
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notification.showWarning('يرجى تعبئة جميع الحقول المطلوبة');
      return;
    }

    this.isSubmitting = true;
    const formValue = { 
      ...this.form.value, 
      remainedValue: this.form.get('remainedValue')?.value 
    };

    if (this.isEditMode && this.itemId) {
      this.financialService.updateEnrollmentPayment(this.itemId, formValue).subscribe({
        next: () => {
          this.notification.showSuccess('تم تحديث الدفعة بنجاح');
          this.router.navigate(['/financial/enrollment-payments']);
          this.isSubmitting = false;
        },
        error: (err) => {
          this.notification.showError(err.error?.messageEn || 'حدث خطأ في تحديث الدفعة');
          this.isSubmitting = false;
        }
      });
    } else {
      this.financialService.createEnrollmentPayment(formValue).subscribe({
        next: () => {
          this.notification.showSuccess('تم إضافة الدفعة بنجاح');
          this.router.navigate(['/financial/enrollment-payments']);
          this.isSubmitting = false;
        },
        error: (err) => {
          this.notification.showError(err.error?.messageEn || 'حدث خطأ في إضافة الدفعة');
          this.isSubmitting = false;
        }
      });
    }
  }

  getFormTitle(): string {
    return this.isEditMode ? 'تعديل دفعة' : 'إضافة دفعة جديدة';
  }
}