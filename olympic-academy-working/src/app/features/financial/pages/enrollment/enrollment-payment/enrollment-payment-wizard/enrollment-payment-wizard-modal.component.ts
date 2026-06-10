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
import { PAYMENT_STATUSES } from '../../../../../../core/models/common.model';

interface EnrollmentOption extends SelectOption {
  enrollmentData?: {
    trainee: any;
    course: any;
    startDate: string;
    finalSubscriptionValue: number;
    remainedSubscriptionValue: number;
    totalPaidAmount?: number;
  };
}

@Component({
  selector: 'app-enrollment-payment-wizard-modal',
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
  templateUrl: './enrollment-payment-wizard-modal.component.html',
  styleUrls: ['./enrollment-payment-wizard-modal.component.css']
})
export class EnrollmentPaymentWizardModalComponent implements OnInit {
  paymentForm: FormGroup;
  isEditMode = false;
  paymentId?: number;
  isLoading = false;
  isSubmitting = false;
  
  // Data collections
  enrollments: any[] = [];
  paymentMethods: any[] = [];
  paymentStatuses = PAYMENT_STATUSES;
  
  // Options for selects
  enrollmentOptions: EnrollmentOption[] = [];
  paymentMethodOptions: SelectOption[] = [];
  paymentStatusOptions: SelectOption[] = [];
  
  // Selected data for display
  selectedEnrollment: any = null;
  currentRemainingAmount: number = 0;
  isLoadingEnrollment: boolean = false;
  
  // Wizard steps
  currentStep = 0;
  steps = [
    { label: 'اختر التسجيل', icon: 'school', completed: false },
    { label: 'تفاصيل الدفعة', icon: 'payments', completed: false },
    { label: 'معلومات الدفع', icon: 'credit_card', completed: false },
    { label: 'تأكيد', icon: 'check_circle', completed: false }
  ];

  constructor(
    private fb: FormBuilder,
    private financialService: FinancialService,
    private enrollmentService: EnrollmentService,
    private notification: NotificationService,
    private dialogRef: MatDialogRef<EnrollmentPaymentWizardModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.paymentId = data?.paymentId;
    this.isEditMode = !!this.paymentId;
    
    this.paymentForm = this.fb.group({
      enrollmentId: [null, Validators.required],
      enrollmentValue: [{ value: null, disabled: true }],
      totalPaidAmount: [{ value: null, disabled: true }],
      currentRemaining: [{ value: null, disabled: true }],
      paidAmount: [null, [Validators.required, Validators.min(1)]],
      newRemainingValue: [{ value: null, disabled: true }],
      paymentDate: [new Date(), Validators.required],
      paymentMethodId: [null, Validators.required],
      paymentStatusObj: [null, Validators.required],
      note: ['']
    });
  }

  ngOnInit() {
    this.loadSelectOptions();
    this.loadEnrollmentsList();
    this.loadPaymentMethods();
    
    if (this.isEditMode) {
      this.loadPaymentData();
    }
    
    // Subscribe to paid amount changes
    this.paymentForm.get('paidAmount')?.valueChanges.subscribe(() => {
      this.calculateNewRemaining();
    });
  }

  loadSelectOptions(): void {
    this.paymentStatusOptions = this.paymentStatuses.map(s => ({ 
      value: s,
      label: s.title 
    }));
  }

  loadEnrollmentsList() {
    this.isLoading = true;
    // Get all enrollments with their current remaining values
    this.enrollmentService.getAllEnrollmentsByFilter().subscribe({
      next: (res: any) => {
        this.enrollments = res.items || [];
        this.enrollmentOptions = this.enrollments.map((e: any) => ({ 
          value: e.id, 
          label: `${e.trainee?.title || 'غير محدد'} - ${e.course?.title || 'غير محدد'}`,
          enrollmentData: {
            trainee: e.trainee,
            course: e.course,
            startDate: e.startDate,
            finalSubscriptionValue: e.finalSubscriptionValue,
            remainedSubscriptionValue: e.remainedSubscriptionValue || 0,
            totalPaidAmount: (e.finalSubscriptionValue || 0) - (e.remainedSubscriptionValue || 0)
          }
        }));
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

  loadPaymentData() {
    this.isLoading = true;
    this.financialService.getEnrollmentPaymentById(this.paymentId!).subscribe({
      next: (res: any) => {
        const paymentStatusObj = this.paymentStatuses.find(s => s.id === res.paymentStatus?.id);
        
        this.paymentForm.patchValue({
          enrollmentId: res.enrollment?.id,
          enrollmentValue: res.enrollmentValue,
          paidAmount: res.paidAmount,
          newRemainingValue: res.remainedValue,
          paymentDate: new Date(res.paymentDate),
          paymentMethodId: res.paymentMethod?.id,
          paymentStatusObj: paymentStatusObj,
          note: res.note
        });
        
        // Fetch fresh enrollment data
        this.fetchFreshEnrollmentData(res.enrollment?.id, res.paidAmount, res.remainedValue);
        
        // Mark steps as completed for edit mode
        this.steps.forEach(step => step.completed = true);
        this.currentStep = 3;
        
        this.isLoading = false;
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل بيانات الدفعة');
        this.isLoading = false;
      }
    });
  }

  fetchFreshEnrollmentData(enrollmentId: number, currentPaidAmount?: number, currentRemainingValue?: number) {
    this.isLoadingEnrollment = true;
    // Fetch the specific enrollment to get real-time data
    this.enrollmentService.getEnrollmentById(enrollmentId).subscribe({
      next: (enrollment: any) => {
        // Use the real remainedSubscriptionValue from the backend
        const realRemainingValue = enrollment.remainedSubscriptionValue || 0;
        
        if (this.isEditMode && currentPaidAmount !== undefined && currentRemainingValue !== undefined) {
          // For edit mode, we need to add back the current payment to get the previous remaining
          const previousRemaining = realRemainingValue + currentPaidAmount;
          this.currentRemainingAmount = previousRemaining;
          
          this.paymentForm.patchValue({
            currentRemaining: previousRemaining,
            totalPaidAmount: (enrollment.finalSubscriptionValue || 0) - previousRemaining
          });
        } else {
          // For create mode
          this.currentRemainingAmount = realRemainingValue;
          this.paymentForm.patchValue({
            currentRemaining: realRemainingValue,
            totalPaidAmount: (enrollment.finalSubscriptionValue || 0) - realRemainingValue
          });
        }
        
        this.selectedEnrollment = {
          trainee: enrollment.trainee,
          course: enrollment.course,
          startDate: enrollment.startDate,
          finalSubscriptionValue: enrollment.finalSubscriptionValue,
          remainedSubscriptionValue: realRemainingValue,
          totalPaidAmount: (enrollment.finalSubscriptionValue || 0) - realRemainingValue
        };
        
        this.paymentForm.patchValue({
          enrollmentValue: enrollment.finalSubscriptionValue
        });
        
        this.isLoadingEnrollment = false;
      },
      error: (err) => {
        console.error('Error fetching enrollment:', err);
        this.notification.showError('حدث خطأ في تحميل بيانات التسجيل');
        this.isLoadingEnrollment = false;
      }
    });
  }

  onEnrollmentSelect() {
    const enrollmentId = this.paymentForm.get('enrollmentId')?.value;
    
    if (!enrollmentId) {
      this.selectedEnrollment = null;
      this.currentRemainingAmount = 0;
      this.paymentForm.patchValue({ 
        enrollmentValue: null,
        totalPaidAmount: null,
        currentRemaining: null,
        paidAmount: null,
        newRemainingValue: null
      });
      return;
    }
    
    this.isLoadingEnrollment = true;
    
    // Fetch the specific enrollment to get real-time data
    this.enrollmentService.getEnrollmentById(enrollmentId).subscribe({
      next: (enrollment: any) => {
        // Use the real remainedSubscriptionValue from the backend
        const realRemainingValue = enrollment.remainedSubscriptionValue || 0;
        this.currentRemainingAmount = realRemainingValue;
        
        this.selectedEnrollment = {
          trainee: enrollment.trainee,
          course: enrollment.course,
          startDate: enrollment.startDate,
          finalSubscriptionValue: enrollment.finalSubscriptionValue,
          remainedSubscriptionValue: realRemainingValue,
          totalPaidAmount: (enrollment.finalSubscriptionValue || 0) - realRemainingValue
        };
        
        this.paymentForm.patchValue({ 
          enrollmentValue: enrollment.finalSubscriptionValue,
          totalPaidAmount: (enrollment.finalSubscriptionValue || 0) - realRemainingValue,
          currentRemaining: realRemainingValue,
          paidAmount: null,
          newRemainingValue: null
        });
        
        this.isLoadingEnrollment = false;
        this.calculateNewRemaining();
      },
      error: (err) => {
        console.error('Error fetching enrollment:', err);
        this.notification.showError('حدث خطأ في تحميل بيانات التسجيل');
        this.isLoadingEnrollment = false;
      }
    });
  }

  calculateNewRemaining() {
    const currentRemaining = this.paymentForm.get('currentRemaining')?.value || 0;
    const paidAmount = this.paymentForm.get('paidAmount')?.value || 0;
    
    // Validate that paid amount doesn't exceed current remaining
    if (paidAmount > currentRemaining && currentRemaining > 0) {
      this.paymentForm.get('paidAmount')?.setErrors({ exceedsRemaining: true });
      this.notification.showWarning('المبلغ المدفوع لا يمكن أن يتجاوز المبلغ المتبقي');
      return;
    } else {
      this.paymentForm.get('paidAmount')?.setErrors(null);
    }
    
    const newRemaining = currentRemaining - paidAmount;
    const finalNewRemaining = newRemaining >= 0 ? newRemaining : 0;
    this.paymentForm.get('newRemainingValue')?.setValue(finalNewRemaining);
    
    // Auto-set payment status based on new remaining amount
    if (finalNewRemaining === 0 && paidAmount > 0) {
      const paidStatus = this.paymentStatuses.find(s => s.id === 2);
      if (paidStatus) {
        this.paymentForm.get('paymentStatusObj')?.setValue(paidStatus);
      }
    } else if (paidAmount > 0 && finalNewRemaining > 0) {
      const partialStatus = this.paymentStatuses.find(s => s.id === 6);
      if (partialStatus) {
        this.paymentForm.get('paymentStatusObj')?.setValue(partialStatus);
      }
    } else if (paidAmount === 0 && currentRemaining > 0) {
      const pendingStatus = this.paymentStatuses.find(s => s.id === 1);
      if (pendingStatus) {
        this.paymentForm.get('paymentStatusObj')?.setValue(pendingStatus);
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
        return this.paymentForm.get('enrollmentId')?.valid === true;
      case 1:
        const paidAmount = this.paymentForm.get('paidAmount')?.value;
        const currentRemaining = this.paymentForm.get('currentRemaining')?.value;
        return this.paymentForm.get('paidAmount')?.valid === true && 
               this.paymentForm.get('paymentDate')?.valid === true &&
               (paidAmount <= currentRemaining || currentRemaining === 0);
      case 2:
        return this.paymentForm.get('paymentMethodId')?.valid === true && 
               this.paymentForm.get('paymentStatusObj')?.valid === true;
      default:
        return true;
    }
  }

  markCurrentStepFieldsAsTouched() {
    switch(this.currentStep) {
      case 0:
        this.paymentForm.get('enrollmentId')?.markAsTouched();
        break;
      case 1:
        this.paymentForm.get('paidAmount')?.markAsTouched();
        this.paymentForm.get('paymentDate')?.markAsTouched();
        break;
      case 2:
        this.paymentForm.get('paymentMethodId')?.markAsTouched();
        this.paymentForm.get('paymentStatusObj')?.markAsTouched();
        break;
    }
  }

  getTotalAmount(): number {
    return this.paymentForm.get('paidAmount')?.value || 0;
  }

  getCurrentRemaining(): number {
    return this.paymentForm.get('currentRemaining')?.value || 0;
  }

  getNewRemaining(): number {
    return this.paymentForm.get('newRemainingValue')?.value || 0;
  }

  getPaymentStatusLabel(): string {
    const statusObj = this.paymentForm.get('paymentStatusObj')?.value;
    return statusObj?.title || 'غير محدد';
  }

  getPaymentMethodLabel(): string {
    const methodId = this.paymentForm.get('paymentMethodId')?.value;
    const method = this.paymentMethods.find(m => m.id === methodId);
    return method?.title || 'غير محدد';
  }

  onSubmit(): void {
    if (this.paymentForm.invalid) {
      this.notification.showWarning('يرجى تعبئة جميع الحقول المطلوبة في الخطوات السابقة');
      return;
    }

    const paidAmount = this.paymentForm.get('paidAmount')?.value;
    const currentRemaining = this.paymentForm.get('currentRemaining')?.value;
    
    if (paidAmount > currentRemaining && currentRemaining > 0) {
      this.notification.showWarning('المبلغ المدفوع لا يمكن أن يتجاوز المبلغ المتبقي');
      return;
    }

    const paymentStatusObj = this.paymentForm.get('paymentStatusObj')?.value;
    
    let paymentStatusEnum = null;
    if (paymentStatusObj) {
      switch(paymentStatusObj.id) {
        case 1:
          paymentStatusEnum = 'PENDING';
          break;
        case 2:
          paymentStatusEnum = 'PAID';
          break;
        case 3:
          paymentStatusEnum = 'FAILED';
          break;
        case 4:
          paymentStatusEnum = 'REFUNDED';
          break;
        case 5:
          paymentStatusEnum = 'CANCELLED';
          break;
        case 6:
          paymentStatusEnum = 'PARTIAL';
          break;
        default:
          paymentStatusEnum = 'PENDING';
      }
    }
    
    const paymentData = {
      enrollmentId: this.paymentForm.get('enrollmentId')?.value,
      paidAmount: paidAmount,
      paymentDate: this.paymentForm.get('paymentDate')?.value,
      paymentMethodId: this.paymentForm.get('paymentMethodId')?.value,
      paymentStatus: paymentStatusEnum,
      note: this.paymentForm.get('note')?.value
    };

    console.log('Submitting payment data:', paymentData);

    this.isSubmitting = true;

    if (this.isEditMode && this.paymentId) {
      this.financialService.updateEnrollmentPayment(this.paymentId, paymentData as any).subscribe({
        next: () => {
          this.notification.showSuccess('تم تحديث الدفعة بنجاح');
          this.dialogRef.close(true);
          this.isSubmitting = false;
        },
        error: (err) => {
          console.error('Update error:', err);
          this.notification.showError(err.error?.messageEn || 'حدث خطأ في تحديث الدفعة');
          this.isSubmitting = false;
        }
      });
    } else {
      this.financialService.createEnrollmentPayment(paymentData as any).subscribe({
        next: () => {
          this.notification.showSuccess('تم إضافة الدفعة بنجاح');
          this.dialogRef.close(true);
          this.isSubmitting = false;
        },
        error: (err) => {
          console.error('Create error:', err);
          this.notification.showError(err.error?.messageEn || 'حدث خطأ في إضافة الدفعة');
          this.isSubmitting = false;
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}