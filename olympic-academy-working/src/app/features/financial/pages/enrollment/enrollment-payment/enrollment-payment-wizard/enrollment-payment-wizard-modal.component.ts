// enrollment-payment-wizard-modal.component.ts - FIXED TYPE ISSUE

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
import { ReportService } from '../../../../../../core/services/report.service';
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
  showSuccess = false;
  paymentResult: any = null;
  
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
    private reportService: ReportService,
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
        
        this.fetchFreshEnrollmentData(res.enrollment?.id, res.paidAmount, res.remainedValue);
        
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
    this.enrollmentService.getEnrollmentById(enrollmentId).subscribe({
      next: (enrollment: any) => {
        const realRemainingValue = enrollment.remainedSubscriptionValue || 0;
        
        if (this.isEditMode && currentPaidAmount !== undefined && currentRemainingValue !== undefined) {
          const previousRemaining = realRemainingValue + currentPaidAmount;
          this.currentRemainingAmount = previousRemaining;
          
          this.paymentForm.patchValue({
            currentRemaining: previousRemaining,
            totalPaidAmount: (enrollment.finalSubscriptionValue || 0) - previousRemaining
          });
        } else {
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
    
    this.enrollmentService.getEnrollmentById(enrollmentId).subscribe({
      next: (enrollment: any) => {
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

  // ==========================================================================
  // RECEIPT PRINTING
  // ==========================================================================

  printReceipt(paymentData: any, enrollmentData: any): void {
    const printWindow = window.open('', '_blank', 'width=800,height=800,scrollbars=yes');
    if (!printWindow) {
      this.notification.showError('تعذر فتح نافذة الطباعة');
      return;
    }

    const receiptHtml = this.generateReceiptHTML(paymentData, enrollmentData);
    
    printWindow.document.write(receiptHtml);
    printWindow.document.close();
    
    // Auto print after a short delay to ensure content is loaded
    setTimeout(() => {
      printWindow.print();
    }, 500);
    
    this.notification.showSuccess('تم فتح الإيصال للطباعة');
  }

// In the generateReceiptHTML method - UPDATED WITH THERMAL PRINTER SUPPORT

private generateReceiptHTML(paymentData: any, enrollmentData: any): string {
  const statusColors: { [key: string]: string } = {
    'PAID': '#d1fae5',
    'PARTIAL': '#fef3c7',
    'PENDING': '#e0e7ff'
  };
  
  const statusTextColors: { [key: string]: string } = {
    'PAID': '#065f46',
    'PARTIAL': '#92400e',
    'PENDING': '#3730a3'
  };

  const paymentStatus = paymentData.paymentStatus || 'PENDING';
  const statusColor = statusColors[paymentStatus] || '#f3f4f6';
  const statusTextColor = statusTextColors[paymentStatus] || '#374151';
  
  const paidAmount = paymentData.paidAmount || 0;
  const remainedValue = paymentData.remainedValue || 0;
  const totalPaid = (enrollmentData.finalSubscriptionValue || 0) - remainedValue;

  // Format date properly
  const formatDate = (dateValue: any): string => {
    if (!dateValue) return '-';
    
    let dateObj: Date;
    if (typeof dateValue === 'string') {
      dateObj = new Date(dateValue);
    } else if (dateValue instanceof Date) {
      dateObj = dateValue;
    } else if (dateValue && typeof dateValue === 'object' && dateValue.toDate) {
      dateObj = dateValue.toDate();
    } else {
      return '-';
    }
    
    if (isNaN(dateObj.getTime())) return '-';
    
    const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const dayName = days[dateObj.getDay()];
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear();
    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    
    return `${dayName}، ${day}/${month}/${year} - ${hours}:${minutes}`;
  };

  // Format dates for display
  const paymentDateFormatted = formatDate(paymentData.paymentDate);
  const enrollmentDateFormatted = formatDate(enrollmentData.startDate);
  const currentDateFormatted = formatDate(new Date());

  return `
    <!DOCTYPE html>
    <html dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>إيصال الدفع - الأكاديمية الأولمبية</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif;
        }
        
        body {
          background: #f0f4f8;
          padding: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
        }
        
        /* ========== RECEIPT CONTAINER - 80mm Printer ========== */
        .receipt-container {
          max-width: 938px;
          width: 100%;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        /* ========== 58mm Printer Support ========== */
        @media (max-width: 675px) {
          .receipt-container {
            max-width: 675px;
            border-radius: 4px;
          }
          
          .receipt-header {
            padding: 12px 16px !important;
          }
          
          .receipt-header h1 {
            font-size: 16px !important;
          }
          
          .receipt-header .logo {
            font-size: 24px !important;
          }
          
          .receipt-header .subtitle {
            font-size: 10px !important;
          }
          
          .receipt-header .receipt-number {
            font-size: 10px !important;
            padding: 4px 12px !important;
          }
          
          .receipt-body {
            padding: 12px 16px 16px !important;
          }
          
          .section-title {
            font-size: 12px !important;
          }
          
          .info-row {
            font-size: 11px !important;
            padding: 4px 0 !important;
          }
          
          .info-row .value.amount {
            font-size: 13px !important;
          }
          
          .payment-details {
            padding: 10px !important;
          }
          
          .status-badge {
            font-size: 10px !important;
            padding: 2px 10px !important;
          }
          
          .receipt-footer {
            padding: 10px 16px !important;
            font-size: 9px !important;
          }
          
          .print-btn {
            padding: 8px 20px !important;
            font-size: 12px !important;
          }
        }
        
        /* ========== Print Styles ========== */
        @media print {
          body {
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          
          .receipt-container {
            max-width: 100% !important;
            border-radius: 0 !important;
            box-shadow: none !important;
          }
          
          .print-btn-container {
            display: none !important;
          }
          
          .receipt-header {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .status-badge {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .payment-details {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
        
        /* ========== Header ========== */
        .receipt-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px 24px;
          color: white;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        
        .receipt-header::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 50%;
        }
        
        .receipt-header .logo {
          font-size: 28px;
          margin-bottom: 2px;
          position: relative;
          z-index: 1;
        }
        
        .receipt-header h1 {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 2px;
          position: relative;
          z-index: 1;
        }
        
        .receipt-header .subtitle {
          font-size: 11px;
          opacity: 0.85;
          position: relative;
          z-index: 1;
        }
        
        .receipt-header .receipt-number {
          margin-top: 8px;
          padding: 4px 14px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 20px;
          display: inline-block;
          font-size: 11px;
          font-weight: 500;
          position: relative;
          z-index: 1;
          backdrop-filter: blur(4px);
        }
        
        /* ========== Body ========== */
        .receipt-body {
          padding: 20px 24px 24px;
        }
        
        .receipt-section {
          margin-bottom: 16px;
        }
        
        .receipt-section:last-child {
          margin-bottom: 0;
        }
        
        .section-title {
          font-size: 13px;
          font-weight: 600;
          color: #667eea;
          margin-bottom: 10px;
          padding-bottom: 6px;
          border-bottom: 2px solid #eef2f6;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .section-title .icon {
          font-size: 16px;
        }
        
        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 5px 0;
          font-size: 13px;
          border-bottom: 1px dashed #f1f5f9;
        }
        
        .info-row:last-child {
          border-bottom: none;
        }
        
        .info-row .label {
          color: #6b7280;
        }
        
        .info-row .value {
          font-weight: 500;
          color: #1e293b;
        }
        
        .info-row .value.highlight {
          color: #059669;
          font-weight: 700;
        }
        
        .info-row .value.amount {
          font-size: 15px;
        }
        
        /* ========== Payment Details ========== */
        .payment-details {
          background: #f8fafc;
          border-radius: 12px;
          padding: 12px 16px;
          margin-top: 6px;
        }
        
        .payment-details .info-row {
          border-bottom-color: #e2e8f0;
          padding: 4px 0;
        }
        
        .payment-details .info-row:last-child {
          border-bottom: none;
        }
        
        /* ========== Status Badge ========== */
        .status-badge {
          display: inline-block;
          padding: 3px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
        }
        
        /* ========== Footer ========== */
        .receipt-footer {
          padding: 12px 24px;
          background: #f8fafc;
          text-align: center;
          font-size: 10px;
          color: #94a3b8;
          border-top: 1px solid #eef2f6;
        }
        
        .receipt-footer .footer-logo {
          font-weight: 600;
          color: #667eea;
        }
        
        /* ========== Print Button ========== */
        .print-btn-container {
          text-align: center;
          padding: 12px 24px;
          background: white;
          border-top: 1px solid #eef2f6;
        }
        
        .print-btn {
          padding: 10px 28px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        
        .print-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
        }
        
        /* ========== Divider Line (for thermal printer) ========== */
        .divider-line {
          border: none;
          border-top: 2px dashed #e2e8f0;
          margin: 8px 0;
        }
        
        /* ========== Thermal Printer Optimizations ========== */
        @media print and (max-width: 675px) {
          .receipt-container {
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          
          .receipt-body {
            padding: 8px 12px !important;
          }
          
          .payment-details {
            padding: 8px 10px !important;
          }
          
          .info-row {
            font-size: 10px !important;
            padding: 3px 0 !important;
          }
          
          .section-title {
            font-size: 11px !important;
          }
          
          .receipt-header {
            padding: 10px 12px !important;
          }
          
          .receipt-header h1 {
            font-size: 14px !important;
          }
          
          .receipt-footer {
            padding: 8px 12px !important;
            font-size: 8px !important;
          }
        }
        
        /* ========== Mobile Responsive ========== */
        @media (max-width: 480px) {
          body {
            padding: 10px;
          }
          
          .receipt-body {
            padding: 12px 16px 16px;
          }
          
          .receipt-header {
            padding: 16px;
          }
          
          .receipt-header h1 {
            font-size: 17px;
          }
          
          .info-row {
            font-size: 12px;
          }
          
          .payment-details {
            padding: 10px 12px;
          }
          
          .receipt-footer {
            padding: 10px 16px;
          }
        }
      </style>
    </head>
    <body>
      <div class="receipt-container">
        <!-- Header -->
        <div class="receipt-header">
          <div class="logo">🏛️</div>
          <h1>إيصال الدفع</h1>
          <div class="subtitle">الأكاديمية الأولمبية</div>
          <div class="receipt-number">
            رقم الإيصال: #${paymentData.id || 'N/A'}
          </div>
        </div>
        
        <!-- Body -->
        <div class="receipt-body">
          <!-- Enrollment Info -->
          <div class="receipt-section">
            <div class="section-title">
              <span class="icon">📚</span>
              معلومات التسجيل
            </div>
            <div class="info-row">
              <span class="label">المتدرب</span>
              <span class="value">${enrollmentData.trainee?.title || '-'}</span>
            </div>
            <div class="info-row">
              <span class="label">الدورة</span>
              <span class="value">${enrollmentData.course?.title || '-'}</span>
            </div>
            <div class="info-row">
              <span class="label">تاريخ التسجيل</span>
              <span class="value">${enrollmentDateFormatted}</span>
            </div>
            <div class="info-row">
              <span class="label">القيمة الإجمالية</span>
              <span class="value">${enrollmentData.finalSubscriptionValue || 0} جم</span>
            </div>
          </div>
          
          <hr class="divider-line">
          
          <!-- Payment Details -->
          <div class="receipt-section">
            <div class="section-title">
              <span class="icon">💰</span>
              تفاصيل الدفعة
            </div>
            <div class="payment-details">
              <div class="info-row">
                <span class="label">تاريخ الدفع</span>
                <span class="value">${paymentDateFormatted}</span>
              </div>
              <div class="info-row">
                <span class="label">المبلغ المدفوع</span>
                <span class="value highlight amount">${paidAmount.toLocaleString('ar-EG')} جم</span>
              </div>
              <div class="info-row">
                <span class="label">طريقة الدفع</span>
                <span class="value">${paymentData.paymentMethodTitle || '-'}</span>
              </div>
              <div class="info-row">
                <span class="label">المبلغ المتبقي</span>
                <span class="value ${remainedValue === 0 ? 'highlight' : ''}">${remainedValue.toLocaleString('ar-EG')} جم</span>
              </div>
              <div class="info-row">
                <span class="label">إجمالي المدفوع</span>
                <span class="value highlight">${totalPaid.toLocaleString('ar-EG')} جم</span>
              </div>
              <div class="info-row" style="border-bottom: none; padding-top: 6px;">
                <span class="label">حالة الدفع</span>
                <span class="value">
                  <span class="status-badge" style="background: ${statusColor}; color: ${statusTextColor};">
                    ${paymentData.paymentStatusTitle || 'قيد الانتظار'}
                  </span>
                </span>
              </div>
            </div>
          </div>
          
          <!-- Note -->
          ${paymentData.note ? `
            <hr class="divider-line">
            <div class="receipt-section">
              <div class="section-title">
                <span class="icon">📝</span>
                ملاحظات
              </div>
              <div class="info-row" style="border-bottom: none;">
                <span style="color: #4b5563; font-size: 12px;">${paymentData.note}</span>
              </div>
            </div>
          ` : ''}
        </div>
        
        <!-- Footer -->
        <div class="receipt-footer">
          <div class="footer-logo">🏛️ الأكاديمية الأولمبية</div>
          <div style="margin-top: 2px;">شكراً لثقتكم بنا</div>
          <div style="margin-top: 2px; font-size: 9px;">${currentDateFormatted}</div>
        </div>
        
        <!-- Print Button -->
        <div class="print-btn-container">
          <button class="print-btn" onclick="window.print();">
            🖨️ طباعة الإيصال
          </button>
        </div>
      </div>
    </body>
    </html>
  `;
}

  // ==========================================================================
  // SUBMIT WITH RECEIPT OPTION
  // ==========================================================================

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
    
    // FIXED: Explicitly type paymentStatusEnum as string | null
    let paymentStatusEnum: string | null = null;
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

    const serviceCall = this.isEditMode && this.paymentId
      ? this.financialService.updateEnrollmentPayment(this.paymentId, paymentData as any)
      : this.financialService.createEnrollmentPayment(paymentData as any);

    serviceCall.subscribe({
      next: (response: any) => {
        this.notification.showSuccess(this.isEditMode ? 'تم تحديث الدفعة بنجاح' : 'تم إضافة الدفعة بنجاح');
        this.isSubmitting = false;
        
        // Store payment result for receipt
        this.paymentResult = {
          id: response.id || this.paymentId,
          paidAmount: paidAmount,
          remainedValue: this.getNewRemaining(),
          paymentDate: this.paymentForm.get('paymentDate')?.value,
          paymentMethodTitle: this.getPaymentMethodLabel(),
          paymentStatus: paymentStatusEnum,
          paymentStatusTitle: this.getPaymentStatusLabel(),
          note: this.paymentForm.get('note')?.value
        };
        
        // Show success with receipt option
        this.showSuccess = true;
        this.currentStep = 3; // Stay on confirmation step
        
        // Show receipt print option
        this.notification.showSuccess('تمت العملية بنجاح! يمكنك طباعة الإيصال.');
        
        // Auto print receipt for new payments (not for edit)
        if (!this.isEditMode) {
          setTimeout(() => {
            this.printReceipt(this.paymentResult, this.selectedEnrollment);
          }, 600);
        }
        
        // Close dialog after a delay if user doesn't interact
        setTimeout(() => {
          this.dialogRef.close(true);
        }, 10000); // Close after 10 seconds
      },
      error: (err) => {
        console.error('Error:', err);
        this.notification.showError(err.error?.messageEn || (this.isEditMode ? 'حدث خطأ في تحديث الدفعة' : 'حدث خطأ في إضافة الدفعة'));
        this.isSubmitting = false;
      }
    });
  }

  onCancel(): void {
    if (this.showSuccess) {
      this.dialogRef.close(true);
    } else {
      this.dialogRef.close(false);
    }
  }

  // ==========================================================================
  // RECEIPT BUTTON ACTIONS
  // ==========================================================================

  printReceiptFromSuccess(): void {
    if (this.paymentResult) {
      this.printReceipt(this.paymentResult, this.selectedEnrollment);
    }
  }

  closeAfterSuccess(): void {
    this.dialogRef.close(true);
  }
}