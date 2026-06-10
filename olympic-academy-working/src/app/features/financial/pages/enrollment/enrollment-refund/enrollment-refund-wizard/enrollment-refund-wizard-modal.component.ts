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
import { EnrollmentService } from '../../../../../../core/services/enrollment.service';
import { NotificationService } from '../../../../../../core/services/notification.service';
import { SearchableSelectComponent, SelectOption } from '../../../../../../shared/components/searchable-select/searchable-select.component';
import { REFUND_STATUSES } from '../../../../../../core/models/financial.model';

interface EnrollmentOption extends SelectOption {
  enrollmentData?: {
    trainee: any;
    course: any;
    startDate: string;
    finalSubscriptionValue: number;
    remainedSubscriptionValue: number;
    totalPaidAmount: number; // This is what the trainee actually paid
  };
}

@Component({
  selector: 'app-enrollment-refund-wizard-modal',
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
  templateUrl: './enrollment-refund-wizard-modal.component.html',
  styleUrls: ['./enrollment-refund-wizard-modal.component.css']
})
export class EnrollmentRefundWizardModalComponent implements OnInit {
  refundForm: FormGroup;
  isEditMode = false;
  refundId?: number;
  isLoading = false;
  isSubmitting = false;
  
  // Data collections
  enrollments: any[] = [];
  paymentMethods: any[] = [];
  refundStatuses = REFUND_STATUSES;
  
  // Options for selects
  enrollmentOptions: EnrollmentOption[] = [];
  paymentMethodOptions: SelectOption[] = [];
  refundStatusOptions: SelectOption[] = [];
  
  // Selected data for display
  selectedEnrollment: any = null;
  maxRefundableAmount: number = 0; // Maximum amount that can be refunded (total paid)
  totalPaidAmount: number = 0; // Total amount the trainee has paid
  previouslyRefundedAmount: number = 0; // Track previously refunded amount for edit mode
  
  // Wizard steps
  currentStep = 0;
  steps = [
    { label: 'اختر التسجيل', icon: 'school', completed: false },
    { label: 'تفاصيل الاسترداد', icon: 'payments', completed: false },
    { label: 'معلومات الدفع', icon: 'credit_card', completed: false },
    { label: 'تأكيد', icon: 'check_circle', completed: false }
  ];

  constructor(
    private fb: FormBuilder,
    private financialService: FinancialService,
    private enrollmentService: EnrollmentService,
    private notification: NotificationService,
    private dialogRef: MatDialogRef<EnrollmentRefundWizardModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.refundId = data?.refundId;
    this.isEditMode = !!this.refundId;
    
    this.refundForm = this.fb.group({
      enrollmentId: [null, Validators.required],
      finalSubscriptionValue: [{ value: null, disabled: true }],
      remainedSubscriptionValue: [{ value: null, disabled: true }],
      totalPaidAmount: [{ value: null, disabled: true }],
      previouslyRefunded: [{ value: null, disabled: true }],
      availableForRefund: [{ value: null, disabled: true }],
      amountRefunded: [null, [Validators.required, Validators.min(1)]],
      remainingAfterRefund: [{ value: null, disabled: true }],
      refundDate: [new Date(), Validators.required],
      paymentMethodId: [null, Validators.required],
      refundStatusObj: [null, Validators.required],
      note: ['']
    });
  }

  ngOnInit() {
    this.loadSelectOptions();
    this.loadEnrollments();
    this.loadPaymentMethods();
    
    if (this.isEditMode) {
      this.loadRefundData();
    }
    
    // Subscribe to amount refunded changes
    this.refundForm.get('amountRefunded')?.valueChanges.subscribe(() => {
      this.calculateRemainingAfterRefund();
    });
  }

  loadSelectOptions(): void {
    this.refundStatusOptions = this.refundStatuses.map(s => ({ 
      value: s,
      label: s.title 
    }));
  }

  loadEnrollments() {
    this.isLoading = true;
    this.enrollmentService.getAllEnrollmentsByFilter().subscribe({
      next: (res: any) => {
        this.enrollments = res.items || [];
        this.enrollmentOptions = this.enrollments.map((e: any) => {
          const totalPaid = (e.finalSubscriptionValue || 0) - (e.remainedSubscriptionValue || 0);
          return { 
            value: e.id, 
            label: `${e.trainee?.title || 'غير محدد'} - ${e.course?.title || 'غير محدد'} (المدفوع: ${totalPaid} جم)`,
            enrollmentData: {
              trainee: e.trainee,
              course: e.course,
              startDate: e.startDate,
              finalSubscriptionValue: e.finalSubscriptionValue || 0,
              remainedSubscriptionValue: e.remainedSubscriptionValue || 0,
              totalPaidAmount: totalPaid
            }
          };
        });
        this.isLoading = false;
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل التسجيلات');
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

  loadRefundData() {
    this.isLoading = true;
    this.financialService.getEnrollmentRefundById(this.refundId!).subscribe({
      next: (res: any) => {
        const refundStatusObj = this.refundStatuses.find(s => s.id === res.refundStatus?.id);
        this.previouslyRefundedAmount = res.amountRefunded;
        
        this.refundForm.patchValue({
          enrollmentId: res.enrollment?.id,
          amountRefunded: res.amountRefunded,
          refundDate: new Date(res.refundDate),
          paymentMethodId: res.paymentMethod?.id,
          refundStatusObj: refundStatusObj,
          note: res.note
        });
        
        // Fetch fresh enrollment data
        this.fetchFreshEnrollmentData(res.enrollment?.id, res.amountRefunded);
        
        // Mark steps as completed for edit mode
        this.steps.forEach(step => step.completed = true);
        this.currentStep = 3;
        
        this.isLoading = false;
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل بيانات الاسترداد');
        this.isLoading = false;
      }
    });
  }

  fetchFreshEnrollmentData(enrollmentId: number, currentRefundAmount?: number) {
    this.isLoading = true;
    this.enrollmentService.getEnrollmentById(enrollmentId).subscribe({
      next: (enrollment: any) => {
        const finalValue = enrollment.finalSubscriptionValue || 0;
        const remainedValue = enrollment.remainedSubscriptionValue || 0;
        const totalPaid = finalValue - remainedValue;
        
        // Get all previous refunds for this enrollment (excluding current if editing)
        this.financialService.getAllEnrollmentRefundsByFilter({ enrollmentId: enrollmentId }).subscribe({
          next: (refundsRes: any) => {
            let totalRefunded = 0;
            if (refundsRes.items) {
              totalRefunded = refundsRes.items
                .filter((r: any) => !this.isEditMode || r.id !== this.refundId)
                .reduce((sum: number, r: any) => sum + (r.amountRefunded || 0), 0);
            }
            
            // Available for refund = total paid - already refunded
            const availableForRefund = totalPaid - totalRefunded;
            this.maxRefundableAmount = Math.max(0, availableForRefund);
            
            this.selectedEnrollment = {
              trainee: enrollment.trainee,
              course: enrollment.course,
              startDate: enrollment.startDate,
              finalSubscriptionValue: finalValue,
              remainedSubscriptionValue: remainedValue,
              totalPaidAmount: totalPaid,
              totalRefundedSoFar: totalRefunded,
              availableForRefund: this.maxRefundableAmount
            };
            
            this.refundForm.patchValue({ 
              finalSubscriptionValue: finalValue,
              remainedSubscriptionValue: remainedValue,
              totalPaidAmount: totalPaid,
              previouslyRefunded: totalRefunded,
              availableForRefund: this.maxRefundableAmount,
              amountRefunded: this.isEditMode ? currentRefundAmount : null,
              remainingAfterRefund: this.isEditMode ? (this.maxRefundableAmount - (currentRefundAmount || 0)) : this.maxRefundableAmount
            });
            
            // Set max validation for amount refunded
            const amountRefundedControl = this.refundForm.get('amountRefunded');
            if (amountRefundedControl) {
              amountRefundedControl.setValidators([
                Validators.required,
                Validators.min(1),
                Validators.max(this.maxRefundableAmount)
              ]);
              amountRefundedControl.updateValueAndValidity();
            }
            
            this.isLoading = false;
          },
          error: () => {
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        console.error('Error fetching enrollment:', err);
        this.notification.showError('حدث خطأ في تحميل بيانات التسجيل');
        this.isLoading = false;
      }
    });
  }

  onEnrollmentSelect() {
    const enrollmentId = this.refundForm.get('enrollmentId')?.value;
    
    if (!enrollmentId) {
      this.selectedEnrollment = null;
      this.maxRefundableAmount = 0;
      this.refundForm.patchValue({ 
        finalSubscriptionValue: null,
        remainedSubscriptionValue: null,
        totalPaidAmount: null,
        previouslyRefunded: null,
        availableForRefund: null,
        amountRefunded: null,
        remainingAfterRefund: null
      });
      return;
    }
    
    this.isLoading = true;
    
    this.enrollmentService.getEnrollmentById(enrollmentId).subscribe({
      next: (enrollment: any) => {
        const finalValue = enrollment.finalSubscriptionValue || 0;
        const remainedValue = enrollment.remainedSubscriptionValue || 0;
        const totalPaid = finalValue - remainedValue;
        
        // Get all previous refunds for this enrollment
        this.financialService.getAllEnrollmentRefundsByFilter({ enrollmentId: enrollmentId }).subscribe({
          next: (refundsRes: any) => {
            let totalRefunded = 0;
            if (refundsRes.items) {
              totalRefunded = refundsRes.items.reduce((sum: number, r: any) => sum + (r.amountRefunded || 0), 0);
            }
            
            const availableForRefund = totalPaid - totalRefunded;
            this.maxRefundableAmount = Math.max(0, availableForRefund);
            
            this.selectedEnrollment = {
              trainee: enrollment.trainee,
              course: enrollment.course,
              startDate: enrollment.startDate,
              finalSubscriptionValue: finalValue,
              remainedSubscriptionValue: remainedValue,
              totalPaidAmount: totalPaid,
              totalRefundedSoFar: totalRefunded,
              availableForRefund: this.maxRefundableAmount
            };
            
            this.refundForm.patchValue({ 
              finalSubscriptionValue: finalValue,
              remainedSubscriptionValue: remainedValue,
              totalPaidAmount: totalPaid,
              previouslyRefunded: totalRefunded,
              availableForRefund: this.maxRefundableAmount,
              amountRefunded: null,
              remainingAfterRefund: this.maxRefundableAmount
            });
            
            // Set max validation for amount refunded
            const amountRefundedControl = this.refundForm.get('amountRefunded');
            if (amountRefundedControl) {
              amountRefundedControl.setValidators([
                Validators.required,
                Validators.min(1),
                Validators.max(this.maxRefundableAmount)
              ]);
              amountRefundedControl.updateValueAndValidity();
            }
            
            this.isLoading = false;
          },
          error: () => {
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        console.error('Error fetching enrollment:', err);
        this.notification.showError('حدث خطأ في تحميل بيانات التسجيل');
        this.isLoading = false;
      }
    });
  }

  calculateRemainingAfterRefund() {
    const availableForRefund = this.refundForm.get('availableForRefund')?.value || 0;
    const amountRefunded = this.refundForm.get('amountRefunded')?.value || 0;
    
    // Validate that refund amount doesn't exceed available
    if (amountRefunded > availableForRefund && availableForRefund > 0) {
      this.refundForm.get('amountRefunded')?.setErrors({ exceedsAvailable: true });
      this.notification.showWarning(`المبلغ المسترد لا يمكن أن يتجاوز المبلغ المتاح للاسترداد (${availableForRefund} جم)`);
      return;
    } else {
      this.refundForm.get('amountRefunded')?.setErrors(null);
    }
    
    const remainingAfterRefund = availableForRefund - amountRefunded;
    this.refundForm.get('remainingAfterRefund')?.setValue(Math.max(0, remainingAfterRefund));
    
    // Auto-set refund status based on amount
    if (amountRefunded > 0 && remainingAfterRefund === 0) {
      // Full refund of available amount
      const completedStatus = this.refundStatuses.find(s => s.id === 4);
      if (completedStatus) {
        this.refundForm.get('refundStatusObj')?.setValue(completedStatus);
      }
    } else if (amountRefunded > 0 && remainingAfterRefund > 0) {
      // Partial refund
      const pendingStatus = this.refundStatuses.find(s => s.id === 1);
      if (pendingStatus) {
        this.refundForm.get('refundStatusObj')?.setValue(pendingStatus);
      }
    }
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
        return this.refundForm.get('enrollmentId')?.valid === true;
      case 1:
        const amountRefunded = this.refundForm.get('amountRefunded')?.value;
        const availableForRefund = this.refundForm.get('availableForRefund')?.value;
        return this.refundForm.get('amountRefunded')?.valid === true && 
               this.refundForm.get('refundDate')?.valid === true &&
               amountRefunded <= availableForRefund;
      case 2:
        return this.refundForm.get('paymentMethodId')?.valid === true && 
               this.refundForm.get('refundStatusObj')?.valid === true;
      default:
        return true;
    }
  }

  markCurrentStepFieldsAsTouched() {
    switch(this.currentStep) {
      case 0:
        this.refundForm.get('enrollmentId')?.markAsTouched();
        break;
      case 1:
        this.refundForm.get('amountRefunded')?.markAsTouched();
        this.refundForm.get('refundDate')?.markAsTouched();
        break;
      case 2:
        this.refundForm.get('paymentMethodId')?.markAsTouched();
        this.refundForm.get('refundStatusObj')?.markAsTouched();
        break;
    }
  }

  getRefundAmount(): number {
    return this.refundForm.get('amountRefunded')?.value || 0;
  }

  getAvailableForRefund(): number {
    return this.refundForm.get('availableForRefund')?.value || 0;
  }

  getRemainingAfterRefund(): number {
    return this.refundForm.get('remainingAfterRefund')?.value || 0;
  }

  getTotalPaidAmount(): number {
    return this.refundForm.get('totalPaidAmount')?.value || 0;
  }

  getPreviouslyRefunded(): number {
    return this.refundForm.get('previouslyRefunded')?.value || 0;
  }

  getRefundStatusLabel(): string {
    const statusObj = this.refundForm.get('refundStatusObj')?.value;
    return statusObj?.title || 'غير محدد';
  }

  getPaymentMethodLabel(): string {
    const methodId = this.refundForm.get('paymentMethodId')?.value;
    const method = this.paymentMethods.find(m => m.id === methodId);
    return method?.title || 'غير محدد';
  }

  onSubmit(): void {
    if (this.refundForm.invalid) {
      this.notification.showWarning('يرجى تعبئة جميع الحقول المطلوبة في الخطوات السابقة');
      return;
    }

    const amountRefunded = this.refundForm.get('amountRefunded')?.value;
    const availableForRefund = this.refundForm.get('availableForRefund')?.value;
    
    if (amountRefunded > availableForRefund && availableForRefund > 0) {
      this.notification.showWarning(`المبلغ المسترد لا يمكن أن يتجاوز المبلغ المتاح للاسترداد (${availableForRefund} جم)`);
      return;
    }

    const refundStatusObj = this.refundForm.get('refundStatusObj')?.value;
    
    // Convert to enum string expected by backend
    let refundStatusEnum = null;
    if (refundStatusObj) {
      switch(refundStatusObj.id) {
        case 1:
          refundStatusEnum = 'PENDING';
          break;
        case 2:
          refundStatusEnum = 'APPROVED';
          break;
        case 3:
          refundStatusEnum = 'REJECTED';
          break;
        case 4:
          refundStatusEnum = 'COMPLETED';
          break;
        default:
          refundStatusEnum = 'PENDING';
      }
    }
    
    const refundData = {
      enrollmentId: this.refundForm.get('enrollmentId')?.value,
      amountRefunded: amountRefunded,
      refundDate: this.refundForm.get('refundDate')?.value,
      paymentMethodId: this.refundForm.get('paymentMethodId')?.value,
      status: refundStatusEnum,
      note: this.refundForm.get('note')?.value
    };

    console.log('Submitting refund data:', refundData);

    this.isSubmitting = true;

    if (this.isEditMode && this.refundId) {
      this.financialService.updateEnrollmentRefund(this.refundId, refundData as any).subscribe({
        next: () => {
          this.notification.showSuccess('تم تحديث الاسترداد بنجاح');
          this.dialogRef.close(true);
          this.isSubmitting = false;
        },
        error: (err) => {
          console.error('Update error:', err);
          this.notification.showError(err.error?.messageEn || 'حدث خطأ في تحديث الاسترداد');
          this.isSubmitting = false;
        }
      });
    } else {
      this.financialService.createEnrollmentRefund(refundData as any).subscribe({
        next: () => {
          this.notification.showSuccess('تم إضافة الاسترداد بنجاح');
          this.dialogRef.close(true);
          this.isSubmitting = false;
        },
        error: (err) => {
          console.error('Create error:', err);
          this.notification.showError(err.error?.messageEn || 'حدث خطأ في إضافة الاسترداد');
          this.isSubmitting = false;
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}