// enrollment-payment-wizard-modal.component.ts - FIXED TYPE ISSUE

import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
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
import {
  SearchableSelectComponent,
  SelectOption,
} from '../../../../../../shared/components/searchable-select/searchable-select.component';
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
    SearchableSelectComponent,
  ],
  templateUrl: './enrollment-payment-wizard-modal.component.html',
  styleUrls: ['./enrollment-payment-wizard-modal.component.css'],
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
    { label: 'تأكيد', icon: 'check_circle', completed: false },
  ];

  constructor(
    private fb: FormBuilder,
    private financialService: FinancialService,
    private enrollmentService: EnrollmentService,
    private notification: NotificationService,
    private reportService: ReportService,
    private dialogRef: MatDialogRef<EnrollmentPaymentWizardModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
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
      note: [''],
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
    this.paymentStatusOptions = this.paymentStatuses.map((s) => ({
      value: s,
      label: s.title,
    }));
  }

  loadEnrollmentsList() {
    this.isLoading = true;
    this.enrollmentService.getAllEnrollmentsDetailsByFilter().subscribe({
      next: (res: any) => {
        this.enrollments = res.items || [];
        this.enrollmentOptions = this.enrollments.map((e: any) => ({
          value: e.id,
          label: `${e.trainee?.fullName || 'غير محدد'} - ${e.course?.title || 'غير محدد'}`,
          enrollmentData: {
            trainee: e.trainee,
            course: e.course,
            startDate: e.startDate,
            finalSubscriptionValue: e.finalSubscriptionValue,
            remainedSubscriptionValue: e.remainedSubscriptionValue || 0,
            totalPaidAmount:
              (e.finalSubscriptionValue || 0) -
              (e.remainedSubscriptionValue || 0),
          },
        }));
        this.isLoading = false;
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل التسجيلات');
        this.isLoading = false;
      },
    });
  }

  loadPaymentMethods() {
    this.financialService.getAllPaymentMethodsLookup().subscribe({
      next: (res: any) => {
        this.paymentMethods = res.list || [];
        this.paymentMethodOptions = this.paymentMethods.map((p: any) => ({
          value: p.id,
          label: p.title,
        }));
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل طرق الدفع');
      },
    });
  }

  loadPaymentData() {
    this.isLoading = true;
    this.financialService.getEnrollmentPaymentById(this.paymentId!).subscribe({
      next: (res: any) => {
        const paymentStatusObj = this.paymentStatuses.find(
          (s) => s.id === res.paymentStatus?.id,
        );

        this.paymentForm.patchValue({
          enrollmentId: res.enrollment?.id,
          enrollmentValue: res.enrollmentValue,
          paidAmount: res.paidAmount,
          newRemainingValue: res.remainedValue,
          paymentDate: new Date(res.paymentDate),
          paymentMethodId: res.paymentMethod?.id,
          paymentStatusObj: paymentStatusObj,
          note: res.note,
        });

        this.fetchFreshEnrollmentData(
          res.enrollment?.id,
          res.paidAmount,
          res.remainedValue,
        );

        this.steps.forEach((step) => (step.completed = true));
        this.currentStep = 3;

        this.isLoading = false;
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل بيانات الدفعة');
        this.isLoading = false;
      },
    });
  }

  fetchFreshEnrollmentData(
    enrollmentId: number,
    currentPaidAmount?: number,
    currentRemainingValue?: number,
  ) {
    this.isLoadingEnrollment = true;
    this.enrollmentService.getEnrollmentById(enrollmentId).subscribe({
      next: (enrollment: any) => {
        const realRemainingValue = enrollment.remainedSubscriptionValue || 0;

        if (
          this.isEditMode &&
          currentPaidAmount !== undefined &&
          currentRemainingValue !== undefined
        ) {
          const previousRemaining = realRemainingValue + currentPaidAmount;
          this.currentRemainingAmount = previousRemaining;

          this.paymentForm.patchValue({
            currentRemaining: previousRemaining,
            totalPaidAmount:
              (enrollment.finalSubscriptionValue || 0) - previousRemaining,
          });
        } else {
          this.currentRemainingAmount = realRemainingValue;
          this.paymentForm.patchValue({
            currentRemaining: realRemainingValue,
            totalPaidAmount:
              (enrollment.finalSubscriptionValue || 0) - realRemainingValue,
          });
        }

        this.selectedEnrollment = {
          trainee: enrollment.trainee,
          course: enrollment.course,
          startDate: enrollment.startDate,
          finalSubscriptionValue: enrollment.finalSubscriptionValue,
          remainedSubscriptionValue: realRemainingValue,
          totalPaidAmount:
            (enrollment.finalSubscriptionValue || 0) - realRemainingValue,
        };

        this.paymentForm.patchValue({
          enrollmentValue: enrollment.finalSubscriptionValue,
        });

        this.isLoadingEnrollment = false;
      },
      error: (err) => {
        console.error('Error fetching enrollment:', err);
        this.notification.showError('حدث خطأ في تحميل بيانات التسجيل');
        this.isLoadingEnrollment = false;
      },
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
        newRemainingValue: null,
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
          totalPaidAmount:
            (enrollment.finalSubscriptionValue || 0) - realRemainingValue,
        };

        this.paymentForm.patchValue({
          enrollmentValue: enrollment.finalSubscriptionValue,
          totalPaidAmount:
            (enrollment.finalSubscriptionValue || 0) - realRemainingValue,
          currentRemaining: realRemainingValue,
          paidAmount: null,
          newRemainingValue: null,
        });

        this.isLoadingEnrollment = false;
        this.calculateNewRemaining();
      },
      error: (err) => {
        console.error('Error fetching enrollment:', err);
        this.notification.showError('حدث خطأ في تحميل بيانات التسجيل');
        this.isLoadingEnrollment = false;
      },
    });
  }

  calculateNewRemaining() {
    const currentRemaining =
      this.paymentForm.get('currentRemaining')?.value || 0;
    const paidAmount = this.paymentForm.get('paidAmount')?.value || 0;

    if (paidAmount > currentRemaining && currentRemaining > 0) {
      this.paymentForm.get('paidAmount')?.setErrors({ exceedsRemaining: true });
      this.notification.showWarning(
        'المبلغ المدفوع لا يمكن أن يتجاوز المبلغ المتبقي',
      );
      return;
    } else {
      this.paymentForm.get('paidAmount')?.setErrors(null);
    }

    const newRemaining = currentRemaining - paidAmount;
    const finalNewRemaining = newRemaining >= 0 ? newRemaining : 0;
    this.paymentForm.get('newRemainingValue')?.setValue(finalNewRemaining);

    // Auto-set payment status based on new remaining amount
    if (finalNewRemaining === 0 && paidAmount > 0) {
      const paidStatus = this.paymentStatuses.find((s) => s.id === 2);
      if (paidStatus) {
        this.paymentForm.get('paymentStatusObj')?.setValue(paidStatus);
      }
    } else if (paidAmount > 0 && finalNewRemaining > 0) {
      const partialStatus = this.paymentStatuses.find((s) => s.id === 6);
      if (partialStatus) {
        this.paymentForm.get('paymentStatusObj')?.setValue(partialStatus);
      }
    } else if (paidAmount === 0 && currentRemaining > 0) {
      const pendingStatus = this.paymentStatuses.find((s) => s.id === 1);
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
    switch (step) {
      case 0:
        return this.paymentForm.get('enrollmentId')?.valid === true;
      case 1:
        const paidAmount = this.paymentForm.get('paidAmount')?.value;
        const currentRemaining =
          this.paymentForm.get('currentRemaining')?.value;
        return (
          this.paymentForm.get('paidAmount')?.valid === true &&
          this.paymentForm.get('paymentDate')?.valid === true &&
          (paidAmount <= currentRemaining || currentRemaining === 0)
        );
      case 2:
        return (
          this.paymentForm.get('paymentMethodId')?.valid === true &&
          this.paymentForm.get('paymentStatusObj')?.valid === true
        );
      default:
        return true;
    }
  }

  markCurrentStepFieldsAsTouched() {
    switch (this.currentStep) {
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
    const method = this.paymentMethods.find((m) => m.id === methodId);
    return method?.title || 'غير محدد';
  }

  // ==========================================================================
  // RECEIPT PRINTING
  // ==========================================================================

  printReceipt(paymentData: any, enrollmentData: any): void {
    const printWindow = window.open(
      '',
      '_blank',
      'width=800,height=800,scrollbars=yes',
    );
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

  // In the generateReceiptHTML method - UPDATED TO MATCH DETAILS MODAL
  private generateReceiptHTML(paymentData: any, enrollmentData: any): string {
    const statusColors: { [key: string]: string } = {
      PAID: '#d1fae5',
      PARTIAL: '#fef3c7',
      PENDING: '#e0e7ff',
    };

    const statusTextColors: { [key: string]: string } = {
      PAID: '#065f46',
      PARTIAL: '#92400e',
      PENDING: '#3730a3',
    };

    const paymentStatus = paymentData.paymentStatus || 'PENDING';
    const statusColor = statusColors[paymentStatus] || '#f3f4f6';
    const statusTextColor = statusTextColors[paymentStatus] || '#374151';

    const paidAmount = paymentData.paidAmount || 0;
    const remainedValue = paymentData.remainedValue || 0;
    const totalPaid =
      (enrollmentData.finalSubscriptionValue || 0) - remainedValue;

    // Format date properly
    const formatDate = (dateValue: any): string => {
      if (!dateValue) return '-';

      let dateObj: Date;
      if (typeof dateValue === 'string') {
        dateObj = new Date(dateValue);
      } else if (dateValue instanceof Date) {
        dateObj = dateValue;
      } else if (
        dateValue &&
        typeof dateValue === 'object' &&
        dateValue.toDate
      ) {
        dateObj = dateValue.toDate();
      } else {
        return '-';
      }

      if (isNaN(dateObj.getTime())) return '-';

      const days = [
        'الأحد',
        'الإثنين',
        'الثلاثاء',
        'الأربعاء',
        'الخميس',
        'الجمعة',
        'السبت',
      ];
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

    const logoPath = window.location.origin + '/assets/images/mainLogo.jpeg';

    return `
    <!DOCTYPE html>
    <html dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>إيصال دفع #${paymentData.id}</title>
      <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js"><\/script>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        @page {
          size: 80mm auto;
          margin: 0mm;
        }

        html, body {
          margin: 0;
          padding: 0;
          background: white;
          width: 80mm;
          min-width: 80mm;
          max-width: 80mm;
        }

        .receipt-wrapper {
          width: 80mm;
          min-width: 80mm;
          max-width: 80mm;
          margin: 0;
          padding: 0;
          background: white;
          position: relative;
          overflow: hidden;
        }

        .receipt {
          width: 80mm;
          min-width: 80mm;
          max-width: 80mm;
          margin: 0;
          padding: 2.5mm 3mm 3mm 3mm;
          background: white;
          font-family: 'Arial', 'Tahoma', sans-serif;
          font-size: 9pt;
          line-height: 1.4;
          color: #000000;
          position: relative;
          overflow: hidden;
        }

        /* ===== WATERMARK - Behind content ===== */
        .receipt-watermark {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-25deg) scale(1.6);
          opacity: 0.05;
          pointer-events: none;
          z-index: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }
        
        .receipt-watermark img {
          width: 100px;
          height: auto;
          object-fit: contain;
          opacity: 0.9;
        }
        
        .receipt-watermark-text {
          position: absolute;
          top: 56%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-25deg) scale(0.8);
          font-size: 20px;
          font-weight: 900;
          color: #2563eb;
          letter-spacing: 4px;
          text-transform: uppercase;
          white-space: nowrap;
          opacity: 0.03;
          pointer-events: none;
          z-index: 0;
          text-shadow: 0 2px 8px rgba(37, 99, 235, 0.1);
        }

        /* ===== CONTENT - Above watermark ===== */
        .receipt-content {
          position: relative;
          z-index: 1;
        }

        /* ===== LOGO SECTION ===== */
        .logo-section {
          text-align: center;
          padding: 1mm 0 1mm 0;
          border-bottom: 2.5px solid #2563eb;
          margin-bottom: 2mm;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        
        .logo-section img {
          width: 36px;
          height: 36px;
          object-fit: contain;
          border-radius: 50%;
          border: 2px solid #2563eb;
          padding: 2px;
          background: white;
        }
        
        .logo-section .academy-name {
          font-size: 13pt;
          font-weight: 700;
          color: #1a1a2e;
          display: block;
        }
        
        .logo-section .receipt-type {
          font-size: 7pt;
          color: #2563eb;
          font-weight: 600;
          display: block;
          margin-top: -1px;
        }

        .logo-text {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
        }

        /* ===== RECEIPT TITLE ===== */
        .receipt-title {
          text-align: center;
          padding: 0.5mm 0 1.5mm 0;
          border-bottom: 1px dashed #e5e7eb;
          margin-bottom: 2mm;
        }
        .receipt-title h1 {
          font-size: 14pt;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }
        .receipt-title .receipt-number {
          font-size: 8pt;
          color: #6b7280;
          margin-top: 0.5mm;
        }

        /* ===== BODY ===== */
        .receipt-body {
          padding: 1mm 0;
        }

        .receipt-section {
          margin-bottom: 2mm;
        }
        .receipt-section:last-child { margin-bottom: 0; }

        .section-title {
          font-size: 8pt;
          font-weight: 600;
          color: #2563eb;
          margin-bottom: 1mm;
          padding-bottom: 0.5mm;
          border-bottom: 0.5pt solid #eef2f6;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 0.5mm 0;
          font-size: 8pt;
          border-bottom: 0.3pt dashed #f1f5f9;
        }
        .info-row:last-child { border-bottom: none; }

        .info-row .label {
          color: #6b7280;
          flex-shrink: 0;
        }
        .info-row .value {
          font-weight: 500;
          color: #1e293b;
          text-align: left;
        }
        .info-row .value.highlight {
          color: #059669;
          font-weight: 700;
        }
        .info-row .value.amount {
          font-size: 10pt;
        }
        .info-row .value.danger {
          color: #dc2626;
          font-weight: 700;
        }

        .payment-details {
          background: #f8fafc;
          border-radius: 1mm;
          padding: 1mm 2mm;
          margin-top: 0.5mm;
        }
        .payment-details .info-row {
          border-bottom-color: #e2e8f0;
          padding: 0.3mm 0;
        }
        .payment-details .info-row:last-child { border-bottom: none; }

        .status-badge {
          display: inline-block;
          padding: 0px 2mm;
          border-radius: 3mm;
          font-size: 7pt;
          font-weight: 600;
        }

        .divider-line {
          border: none;
          border-top: 0.5pt dashed #e2e8f0;
          margin: 1mm 0;
        }

        /* ===== BARCODE AT BOTTOM ===== */
        .barcode-section {
          text-align: center;
          padding: 2mm 0 1mm 0;
          border-top: 1px solid #e5e7eb;
          margin-top: 2mm;
        }
        .barcode-container {
          display: inline-block;
          background: white;
          padding: 0.5mm 1mm;
          border: 0.5pt solid #e5e7eb;
          border-radius: 1mm;
        }
        .barcode-container svg {
          max-width: 100%;
          height: 8mm;
          display: block;
        }
        .barcode-container .barcode-label {
          display: block;
          font-size: 5pt;
          color: #6b7280;
          margin-top: 0.5mm;
        }

        .receipt-footer {
          text-align: center;
          padding: 1mm 0 0 0;
          font-size: 6pt;
          color: #94a3b8;
        }

        /* ===== COPYRIGHT CREDIT - Inside receipt at bottom ===== */
        .receipt-credit {
          text-align: center;
          font-size: 4.5px;
          color: #1a1a2e;
          font-weight: 500;
          opacity: 0.6;
          letter-spacing: 0.3px;
          direction: ltr;
          margin-top: 1mm;
          padding-top: 0.5mm;
          border-top: 0.5px dashed rgba(26, 26, 46, 0.15);
        }

        .note-text {
          font-size: 7pt;
          color: #4b5563;
        }

        .print-btn-container {
          text-align: center;
          padding: 2mm 0;
          background: white;
        }
        .print-btn {
          padding: 1mm 4mm;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 1mm;
          font-size: 8pt;
          font-weight: 600;
          cursor: pointer;
        }

        @media print {
          html, body {
            width: 80mm !important;
            min-width: 80mm !important;
            max-width: 80mm !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .receipt {
            width: 80mm !important;
            min-width: 80mm !important;
            max-width: 80mm !important;
            margin: 0 !important;
            padding: 2mm 2.5mm 2.5mm 2.5mm !important;
          }
          .print-btn-container {
            display: none !important;
          }
          .receipt-title,
          .status-badge,
          .payment-details,
          .logo-section,
          .receipt-watermark {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .logo-section img {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .receipt-watermark {
            opacity: 0.06 !important;
          }
          .receipt-watermark img {
            width: 90px !important;
          }
          .receipt-watermark-text {
            font-size: 18px !important;
            opacity: 0.04 !important;
          }
          .receipt-credit {
            opacity: 0.5 !important;
            color: #000000 !important;
          }
        }

        @media (max-width: 60mm) {
          html, body {
            width: 58mm !important;
            min-width: 58mm !important;
            max-width: 58mm !important;
          }
          .receipt {
            width: 58mm !important;
            min-width: 58mm !important;
            max-width: 58mm !important;
            padding: 1.5mm 2mm 2mm 2mm !important;
            font-size: 7pt !important;
          }
          .logo-section img { width: 28px !important; height: 28px !important; }
          .logo-section .academy-name { font-size: 10pt !important; }
          .logo-section .receipt-type { font-size: 5.5pt !important; }
          .receipt-title h1 { font-size: 11pt !important; }
          .receipt-body { padding: 0.5mm 0 !important; }
          .section-title { font-size: 6.5pt !important; }
          .info-row { font-size: 6.5pt !important; padding: 0.3mm 0 !important; }
          .info-row .value.amount { font-size: 8pt !important; }
          .payment-details { padding: 0.5mm 1mm !important; }
          .status-badge { font-size: 5.5pt !important; padding: 0px 1mm !important; }
          .barcode-container svg { height: 6mm !important; }
          .barcode-container .barcode-label { font-size: 3.5pt !important; }
          .note-text { font-size: 5.5pt !important; }
          .receipt-footer { font-size: 4.5pt !important; }
          .receipt-watermark img { width: 70px !important; }
          .receipt-watermark-text { font-size: 14px !important; }
          .receipt-credit { font-size: 3.5px !important; }
        }
      </style>
    </head>
    <body>
      <div class="receipt-wrapper">
        <div class="receipt">
          <!-- ===== WATERMARK - Behind content ===== -->
          <div class="receipt-watermark">
            <img src="${logoPath}" alt="الأكاديمية الأولمبية">
          </div>
          <div class="receipt-watermark-text">الأكاديمية الأولمبية</div>

          <!-- ===== CONTENT ===== -->
          <div class="receipt-content">
            <!-- LOGO AND ACADEMY NAME -->
            <div class="logo-section">
              <img src="${logoPath}" alt="الأكاديمية الأولمبية" onerror="this.style.display='none'">
              <div class="logo-text">
                <span class="academy-name">🏛️ الأكاديمية الأولمبية</span>
                <span class="receipt-type">✦ إيصال دفع ✦</span>
              </div>
            </div>

            <!-- RECEIPT TITLE -->
            <div class="receipt-title">
              <h1>إيصال الدفع</h1>
              <div class="receipt-number">رقم الإيصال: #${paymentData.id || 'N/A'}</div>
            </div>

            <!-- BODY -->
            <div class="receipt-body">
              <!-- Enrollment Info -->
              <div class="receipt-section">
                <div class="section-title">📚 معلومات التسجيل</div>
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
                  <span class="value">${(enrollmentData.finalSubscriptionValue || 0).toLocaleString('ar-EG')} جم</span>
                </div>
              </div>

              <hr class="divider-line">

              <!-- Payment Details -->
              <div class="receipt-section">
                <div class="section-title">💰 تفاصيل الدفعة</div>
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
                    <span class="value ${remainedValue === 0 ? 'highlight' : 'danger'}">${remainedValue.toLocaleString('ar-EG')} جم</span>
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
              ${
                paymentData.note
                  ? `
                <hr class="divider-line">
                <div class="receipt-section">
                  <div class="section-title">📝 ملاحظات</div>
                  <div class="info-row" style="border-bottom: none;">
                    <span class="note-text">${paymentData.note}</span>
                  </div>
                </div>
              `
                  : ''
              }
            </div>

            <!-- BARCODE AT BOTTOM -->
            <div class="barcode-section">
              <div class="barcode-container">
                <svg id="barcode"></svg>
                <span class="barcode-label">${paymentData.nationalId || enrollmentData.trainee?.nationalId || '0000000000'}</span>
              </div>
            </div>

            <!-- FOOTER -->
            <div class="receipt-footer">
              <div>🏛️ الأكاديمية الأولمبية</div>
              <div style="margin-top: 1px;">شكراً لثقتكم بنا</div>
              <div style="margin-top: 1px; font-size: 5pt;">${currentDateFormatted}</div>
            </div>

            <!-- ===== COPYRIGHT CREDIT - Inside receipt at bottom ===== -->
            <div class="receipt-credit">powered by CoreStack Solutions | 01069911181</div>
          </div>
        </div>

        <!-- PRINT BUTTON -->
        <div class="print-btn-container">
          <button class="print-btn" onclick="window.print();">🖨️ طباعة</button>
        </div>
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() {
            try {
              JsBarcode('#barcode', '${paymentData.nationalId || enrollmentData.trainee?.nationalId || '0000000000'}', {
                format: 'CODE128',
                lineColor: '#000000',
                width: 1.5,
                height: 30,
                displayValue: false,
                fontSize: 5,
                font: 'monospace',
                textAlign: 'center',
                margin: 1,
                background: '#ffffff'
              });
            } catch(e) {
              console.error('Barcode error:', e);
            }
          }, 300);
        };
      <\/script>
    </body>
    </html>
  `;
  }

  // ==========================================================================
  // SUBMIT WITH RECEIPT OPTION
  // ==========================================================================

  onSubmit(): void {
    if (this.paymentForm.invalid) {
      this.notification.showWarning(
        'يرجى تعبئة جميع الحقول المطلوبة في الخطوات السابقة',
      );
      return;
    }

    const paidAmount = this.paymentForm.get('paidAmount')?.value;
    const currentRemaining = this.paymentForm.get('currentRemaining')?.value;

    if (paidAmount > currentRemaining && currentRemaining > 0) {
      this.notification.showWarning(
        'المبلغ المدفوع لا يمكن أن يتجاوز المبلغ المتبقي',
      );
      return;
    }

    const paymentStatusObj = this.paymentForm.get('paymentStatusObj')?.value;

    // FIXED: Explicitly type paymentStatusEnum as string | null
    let paymentStatusEnum: string | null = null;
    if (paymentStatusObj) {
      switch (paymentStatusObj.id) {
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
      note: this.paymentForm.get('note')?.value,
    };

    console.log('Submitting payment data:', paymentData);

    this.isSubmitting = true;

    const serviceCall =
      this.isEditMode && this.paymentId
        ? this.financialService.updateEnrollmentPayment(
            this.paymentId,
            paymentData as any,
          )
        : this.financialService.createEnrollmentPayment(paymentData as any);

    serviceCall.subscribe({
      next: (response: any) => {
        this.notification.showSuccess(
          this.isEditMode ? 'تم تحديث الدفعة بنجاح' : 'تم إضافة الدفعة بنجاح',
        );
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
          note: this.paymentForm.get('note')?.value,
        };

        // Show success with receipt option
        this.showSuccess = true;
        this.currentStep = 3; // Stay on confirmation step

        // Show receipt print option
        this.notification.showSuccess(
          'تمت العملية بنجاح! يمكنك طباعة الإيصال.',
        );

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
        this.notification.showError(
          err.error?.messageEn ||
            (this.isEditMode
              ? 'حدث خطأ في تحديث الدفعة'
              : 'حدث خطأ في إضافة الدفعة'),
        );
        this.isSubmitting = false;
      },
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
