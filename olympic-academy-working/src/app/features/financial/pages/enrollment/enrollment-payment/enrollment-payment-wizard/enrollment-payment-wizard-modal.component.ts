// enrollment-payment-wizard-modal.component.ts - COMPLETE FIXED VERSION

import { Component, OnInit, Inject, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
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
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';

import { FinancialService } from '../../../../../../core/services/financial.service';
import { EnrollmentService } from '../../../../../../core/services/enrollment.service';
import { NotificationService } from '../../../../../../core/services/notification.service';
import { ReportService } from '../../../../../../core/services/report.service';
import {
  SearchableSelectComponent,
  SelectOption,
} from '../../../../../../shared/components/searchable-select/searchable-select.component';
import { PAYMENT_STATUSES } from '../../../../../../core/models/common.model';
import { Subject } from 'rxjs';
import { takeUntil, distinctUntilChanged, filter } from 'rxjs/operators';

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

interface PaymentResult {
  id: number;
  paidAmount: number;
  remainedValue: number;
  paymentDate: Date;
  paymentMethodTitle: string;
  paymentStatus: string | null;
  paymentStatusTitle: string;
  note: string;
  traineeNationalId?: string;
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
    MatChipsModule,
    MatBadgeModule,
    SearchableSelectComponent,
  ],
  templateUrl: './enrollment-payment-wizard-modal.component.html',
  styleUrls: ['./enrollment-payment-wizard-modal.component.css'],
})
export class EnrollmentPaymentWizardModalComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  // ==========================================================================
  // PUBLIC PROPERTIES
  // ==========================================================================

  paymentForm: FormGroup;
  isEditMode = false;
  paymentId?: number;
  isLoading = false;
  isSubmitting = false;
  showSuccess = false;
  paymentResult: PaymentResult | null = null;

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

  // ==========================================================================
  // BARCODE SCANNING PROPERTIES
  // ==========================================================================

  @ViewChild('barcodeInput') barcodeInput!: ElementRef<HTMLInputElement>;
  
  showBarcodeScanner = false;
  scannedtraineeNationalId: string = '';
  isSearchingBytraineeNationalId = false;
  filteredEnrollments: any[] = [];
  private allEnrollments: any[] = [];

  // ==========================================================================
  // PRIVATE PROPERTIES
  // ==========================================================================

  private destroy$ = new Subject<void>();

  // ==========================================================================
  // CONSTRUCTOR
  // ==========================================================================

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
      note: [''],
    });
  }

  // ==========================================================================
  // LIFECYCLE HOOKS
  // ==========================================================================

  ngOnInit(): void {
    this.initializeComponent();
  }

  ngAfterViewInit(): void {
    this.setupBarcodeInputListener();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ==========================================================================
  // INITIALIZATION
  // ==========================================================================

  private initializeComponent(): void {
    this.loadSelectOptions();
    this.loadEnrollmentsList();
    this.loadPaymentMethods();

    if (this.isEditMode) {
      this.loadPaymentData();
    }

    this.setupFormSubscriptions();
  }

  private setupFormSubscriptions(): void {
    // Subscribe to paid amount changes
    this.paymentForm
      .get('paidAmount')
      ?.valueChanges.pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.calculateNewRemaining();
      });

    // Subscribe to enrollment selection
    this.paymentForm
      .get('enrollmentId')
      ?.valueChanges.pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged(),
        filter((value) => value !== null && value !== undefined)
      )
      .subscribe(() => {
        this.onEnrollmentSelect();
      });
  }

  private setupBarcodeInputListener(): void {
    if (this.barcodeInput) {
      // ✅ ONLY handle Enter key - NO automatic search on typing
      this.barcodeInput.nativeElement.addEventListener('keydown', (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          const value = this.barcodeInput.nativeElement.value.trim();
          if (value.length > 0) {
            this.searchEnrollmentsBytraineeNationalId(value);
          } else {
            this.notification.showWarning('الرجاء إدخال قيمة للبحث');
          }
        }
      });

      // ✅ Handle blur (when user clicks away or presses tab)
      this.barcodeInput.nativeElement.addEventListener('blur', () => {
        // Do NOT search on blur - only on Enter
        // This prevents accidental searches
      });
    }
  }

  // ==========================================================================
  // DATA LOADING
  // ==========================================================================

  loadSelectOptions(): void {
    this.paymentStatusOptions = this.paymentStatuses.map((s) => ({
      value: s,
      label: s.title,
    }));
  }

  loadEnrollmentsList(): void {
    this.isLoading = true;
    this.enrollmentService.getAllEnrollmentsDetailsByFilter().subscribe({
      next: (res: any) => {
        this.allEnrollments = res.items || [];
        this.enrollments = this.allEnrollments;
        this.enrollmentOptions = this.mapEnrollmentsToOptions(this.allEnrollments);
        this.isLoading = false;
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل التسجيلات');
        this.isLoading = false;
      },
    });
  }

  loadPaymentMethods(): void {
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

  loadPaymentData(): void {
    this.isLoading = true;
    this.financialService.getEnrollmentPaymentById(this.paymentId!).subscribe({
      next: (res: any) => {
        const paymentStatusObj = this.paymentStatuses.find(
          (s) => s.id === res.paymentStatus?.id
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
          res.remainedValue
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

  // ==========================================================================
  // ENROLLMENT SELECTION
  // ==========================================================================

  onEnrollmentSelect(): void {
    const enrollmentId = this.paymentForm.get('enrollmentId')?.value;

    if (!enrollmentId) {
      this.clearEnrollmentSelection();
      return;
    }

    this.isLoadingEnrollment = true;
    this.enrollmentService.getEnrollmentById(enrollmentId).subscribe({
      next: (enrollment: any) => {
        this.processEnrollmentData(enrollment);
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

  private processEnrollmentData(enrollment: any): void {
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
  }

  private clearEnrollmentSelection(): void {
    this.selectedEnrollment = null;
    this.currentRemainingAmount = 0;
    this.paymentForm.patchValue({
      enrollmentValue: null,
      totalPaidAmount: null,
      currentRemaining: null,
      paidAmount: null,
      newRemainingValue: null,
    });
  }

  fetchFreshEnrollmentData(
    enrollmentId: number,
    currentPaidAmount?: number,
    currentRemainingValue?: number
  ): void {
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

  // ==========================================================================
  // BARCODE SCANNING - MANUAL SEARCH ONLY
  // ==========================================================================

  toggleBarcodeScanner(): void {
    this.showBarcodeScanner = !this.showBarcodeScanner;
    if (this.showBarcodeScanner) {
      setTimeout(() => {
        if (this.barcodeInput) {
          this.barcodeInput.nativeElement.focus();
          this.barcodeInput.nativeElement.value = '';
          this.scannedtraineeNationalId = '';
        }
      }, 100);
    } else {
      this.scannedtraineeNationalId = '';
      if (this.barcodeInput) {
        this.barcodeInput.nativeElement.value = '';
      }
    }
  }

  // ✅ Manual search - only called on Enter key press
  onBarcodeSearch(): void {
    if (this.barcodeInput) {
      const value = this.barcodeInput.nativeElement.value.trim();
      if (value.length > 0) {
        this.searchEnrollmentsBytraineeNationalId(value);
      } else {
        this.notification.showWarning('الرجاء إدخال قيمة للبحث');
      }
    }
  }

  // ✅ Manual search - only called on Enter key press
  searchEnrollmentsBytraineeNationalId(traineeNationalId: string): void {
    if (!traineeNationalId || traineeNationalId.trim().length === 0) {
      this.notification.showWarning('الرجاء إدخال قيمة للبحث');
      return;
    }

    if (this.isSearchingBytraineeNationalId) {
      return;
    }

    this.isSearchingBytraineeNationalId = true;

    const filterParams = {
      traineeNationalId: traineeNationalId.trim(),
      pageSize: 100,
    };

    this.enrollmentService.getAllEnrollmentsDetailsByFilter(filterParams).subscribe({
      next: (res: any) => {
        const enrollments = res.items || [];

        if (enrollments.length === 0) {
          this.notification.showWarning(
            `لا توجد تسجيلات للرقم القومي: ${traineeNationalId}`
          );
          this.isSearchingBytraineeNationalId = false;
          return;
        }

        this.filteredEnrollments = enrollments;
        this.enrollmentOptions = this.mapEnrollmentsToOptions(enrollments);

        this.notification.showSuccess(
          `تم العثور على ${enrollments.length} تسجيل(ات) للرقم القومي: ${traineeNationalId}`
        );

        if (enrollments.length === 1) {
          this.paymentForm.patchValue({
            enrollmentId: enrollments[0].id,
          });
          this.onEnrollmentSelect();
        }

        if (this.barcodeInput) {
          this.barcodeInput.nativeElement.value = '';
        }
        this.showBarcodeScanner = false;
        this.isSearchingBytraineeNationalId = false;
      },
      error: (err) => {
        console.error('Error searching by national ID:', err);
        this.notification.showError('حدث خطأ في البحث عن التسجيلات');
        this.isSearchingBytraineeNationalId = false;
      },
    });
  }

  resetEnrollmentFilter(): void {
    this.scannedtraineeNationalId = '';
    this.filteredEnrollments = [];
    this.enrollmentOptions = this.mapEnrollmentsToOptions(this.allEnrollments);
    this.paymentForm.patchValue({ enrollmentId: null });
    this.selectedEnrollment = null;
    this.currentRemainingAmount = 0;
    if (this.barcodeInput) {
      this.barcodeInput.nativeElement.value = '';
    }
    this.notification.showInfo('تم إلغاء التصفية وعرض جميع التسجيلات');
  }

  private mapEnrollmentsToOptions(enrollments: any[]): EnrollmentOption[] {
    return enrollments.map((e: any) => ({
      value: e.id,
      label: `${e.trainee?.fullName || 'غير محدد'} - ${e.course?.title || 'غير محدد'}`,
      enrollmentData: {
        trainee: e.trainee,
        course: e.course,
        startDate: e.startDate,
        finalSubscriptionValue: e.finalSubscriptionValue,
        remainedSubscriptionValue: e.remainedSubscriptionValue || 0,
        totalPaidAmount:
          (e.finalSubscriptionValue || 0) - (e.remainedSubscriptionValue || 0),
      },
    }));
  }

  // ==========================================================================
  // CALCULATIONS
  // ==========================================================================

  calculateNewRemaining(): void {
    const currentRemaining = this.paymentForm.get('currentRemaining')?.value || 0;
    const paidAmount = this.paymentForm.get('paidAmount')?.value || 0;

    if (paidAmount > currentRemaining && currentRemaining > 0) {
      this.paymentForm.get('paidAmount')?.setErrors({ exceedsRemaining: true });
      this.notification.showWarning(
        'المبلغ المدفوع لا يمكن أن يتجاوز المبلغ المتبقي'
      );
      return;
    } else {
      this.paymentForm.get('paidAmount')?.setErrors(null);
    }

    const newRemaining = Math.max(0, currentRemaining - paidAmount);
    this.paymentForm.get('newRemainingValue')?.setValue(newRemaining);

    this.autoSetPaymentStatus(paidAmount, currentRemaining, newRemaining);
  }

  private autoSetPaymentStatus(
    paidAmount: number,
    currentRemaining: number,
    newRemaining: number
  ): void {
    if (newRemaining === 0 && paidAmount > 0) {
      const paidStatus = this.paymentStatuses.find((s) => s.id === 2);
      if (paidStatus) {
        this.paymentForm.get('paymentStatusObj')?.setValue(paidStatus);
      }
    } else if (paidAmount > 0 && newRemaining > 0) {
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

  // ==========================================================================
  // STEP NAVIGATION
  // ==========================================================================

  goToStep(step: number): void {
    if (step <= this.currentStep || this.isStepValid(step - 1)) {
      this.currentStep = step;
    }
  }

  nextStep(): void {
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

  previousStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  isStepValid(step: number): boolean {
    switch (step) {
      case 0:
        return this.paymentForm.get('enrollmentId')?.valid === true;
      case 1: {
        const paidAmount = this.paymentForm.get('paidAmount')?.value;
        const currentRemaining = this.paymentForm.get('currentRemaining')?.value;
        return (
          this.paymentForm.get('paidAmount')?.valid === true &&
          this.paymentForm.get('paymentDate')?.valid === true &&
          (paidAmount <= currentRemaining || currentRemaining === 0)
        );
      }
      case 2:
        return (
          this.paymentForm.get('paymentMethodId')?.valid === true &&
          this.paymentForm.get('paymentStatusObj')?.valid === true
        );
      default:
        return true;
    }
  }

  markCurrentStepFieldsAsTouched(): void {
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

  // ==========================================================================
  // GETTERS
  // ==========================================================================

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

  get hasFilteredResults(): boolean {
    return this.filteredEnrollments.length > 0;
  }

  get filterInfo(): string {
    if (this.scannedtraineeNationalId) {
      return `معروض: ${this.filteredEnrollments.length} تسجيل للرقم القومي ${this.scannedtraineeNationalId}`;
    }
    return '';
  }

  // ==========================================================================
  // RECEIPT PRINTING
  // ==========================================================================

  printReceipt(paymentData: PaymentResult, enrollmentData: any): void {
    const printWindow = window.open(
      '',
      '_blank',
      'width=800,height=800,scrollbars=yes'
    );
    if (!printWindow) {
      this.notification.showError('تعذر فتح نافذة الطباعة');
      return;
    }

    const receiptHtml = this.generateReceiptHTML(paymentData, enrollmentData);
    printWindow.document.write(receiptHtml);
    printWindow.document.close();

    setTimeout(() => {
      printWindow.print();
    }, 500);

    this.notification.showSuccess('تم فتح الإيصال للطباعة');
  }

  private generateReceiptHTML(paymentData: PaymentResult, enrollmentData: any): string {
    const statusColors: { [key: string]: string } = {
      PAID: '#d1fae5',
      PARTIAL: '#fef3c7',
      PENDING: '#e0e7ff',
      FAILED: '#fecaca',
      REFUNDED: '#e5e7eb',
      CANCELLED: '#f3f4f6',
    };

    const statusTextColors: { [key: string]: string } = {
      PAID: '#065f46',
      PARTIAL: '#92400e',
      PENDING: '#3730a3',
      FAILED: '#991b1b',
      REFUNDED: '#4b5563',
      CANCELLED: '#6b7280',
    };

    const paymentStatus = paymentData.paymentStatus || 'PENDING';
    const statusColor = statusColors[paymentStatus] || '#f3f4f6';
    const statusTextColor = statusTextColors[paymentStatus] || '#374151';

    const paidAmount = paymentData.paidAmount || 0;
    const remainedValue = paymentData.remainedValue || 0;
    const totalPaid =
      (enrollmentData.finalSubscriptionValue || 0) - remainedValue;

    const formatDate = (dateValue: any): string => {
      if (!dateValue) return '-';
      let dateObj: Date;
      if (typeof dateValue === 'string') {
        dateObj = new Date(dateValue);
      } else if (dateValue instanceof Date) {
        dateObj = dateValue;
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

    const paymentDateFormatted = formatDate(paymentData.paymentDate);
    const enrollmentDateFormatted = formatDate(enrollmentData.startDate);
    const currentDateFormatted = formatDate(new Date());
    const traineeNationalId = paymentData.traineeNationalId || enrollmentData.trainee?.nationalId || '0000000000';
    const logoPath = window.location.origin + '/assets/images/simpleLogo.jpeg';

    return `
    <!DOCTYPE html>
    <html dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>إيصال دفع #${paymentData.id}</title>
      <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js"><\/script>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @page { size: 80mm auto; margin: 0mm; }
        html, body { margin: 0; padding: 0; background: white; width: 80mm; min-width: 80mm; max-width: 80mm; }
        .receipt-wrapper { width: 80mm; min-width: 80mm; max-width: 80mm; margin: 0; padding: 0; background: white; position: relative; overflow: hidden; }
        .receipt { width: 80mm; min-width: 80mm; max-width: 80mm; margin: 0; padding: 2.5mm 3mm 3mm 3mm; background: white; font-family: 'Arial', 'Tahoma', sans-serif; font-size: 9pt; line-height: 1.4; color: #000000; position: relative; overflow: hidden; }
        .receipt-watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-25deg) scale(1.6); opacity: 0.05; pointer-events: none; z-index: 0; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; }
        .receipt-watermark img { width: 100px; height: auto; object-fit: contain; opacity: 0.9; }
        .receipt-watermark-text { position: absolute; top: 56%; left: 50%; transform: translate(-50%, -50%) rotate(-25deg) scale(0.8); font-size: 20px; font-weight: 900; color: #2563eb; letter-spacing: 4px; text-transform: uppercase; white-space: nowrap; opacity: 0.03; pointer-events: none; z-index: 0; text-shadow: 0 2px 8px rgba(37, 99, 235, 0.1); }
        .receipt-content { position: relative; z-index: 1; }
        .logo-section { text-align: center; padding: 1mm 0 1mm 0; border-bottom: 2.5px solid #2563eb; margin-bottom: 2mm; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .logo-section img { width: 36px; height: 36px; object-fit: contain; border-radius: 50%; border: 2px solid #2563eb; padding: 2px; background: white; }
        .logo-section .academy-name { font-size: 13pt; font-weight: 700; color: #1a1a2e; display: block; }
        .logo-section .receipt-type { font-size: 7pt; color: #2563eb; font-weight: 600; display: block; margin-top: -1px; }
        .logo-text { display: flex; flex-direction: column; line-height: 1.2; }
        .receipt-title { text-align: center; padding: 0.5mm 0 1.5mm 0; border-bottom: 1px dashed #e5e7eb; margin-bottom: 2mm; }
        .receipt-title h1 { font-size: 14pt; font-weight: 700; color: #1e293b; margin: 0; }
        .receipt-title .receipt-number { font-size: 8pt; color: #6b7280; margin-top: 0.5mm; }
        .receipt-body { padding: 1mm 0; }
        .receipt-section { margin-bottom: 2mm; }
        .receipt-section:last-child { margin-bottom: 0; }
        .section-title { font-size: 8pt; font-weight: 600; color: #2563eb; margin-bottom: 1mm; padding-bottom: 0.5mm; border-bottom: 0.5pt solid #eef2f6; }
        .info-row { display: flex; justify-content: space-between; padding: 0.5mm 0; font-size: 8pt; border-bottom: 0.3pt dashed #f1f5f9; }
        .info-row:last-child { border-bottom: none; }
        .info-row .label { color: #6b7280; flex-shrink: 0; }
        .info-row .value { font-weight: 500; color: #1e293b; text-align: left; }
        .info-row .value.highlight { color: #059669; font-weight: 700; }
        .info-row .value.amount { font-size: 10pt; }
        .info-row .value.danger { color: #dc2626; font-weight: 700; }
        .payment-details { background: #f8fafc; border-radius: 1mm; padding: 1mm 2mm; margin-top: 0.5mm; }
        .payment-details .info-row { border-bottom-color: #e2e8f0; padding: 0.3mm 0; }
        .payment-details .info-row:last-child { border-bottom: none; }
        .status-badge { display: inline-block; padding: 0px 2mm; border-radius: 3mm; font-size: 7pt; font-weight: 600; }
        .divider-line { border: none; border-top: 0.5pt dashed #e2e8f0; margin: 1mm 0; }
        .barcode-section { text-align: center; padding: 2mm 0 1mm 0; border-top: 1px solid #e5e7eb; margin-top: 2mm; }
        .barcode-container { display: inline-block; background: white; padding: 0.5mm 1mm; border: 0.5pt solid #e5e7eb; border-radius: 1mm; }
        .barcode-container svg { max-width: 100%; height: 8mm; display: block; }
        .barcode-container .barcode-label { display: block; font-size: 5pt; color: #6b7280; margin-top: 0.5mm; }
        .receipt-footer { text-align: center; padding: 1mm 0 0 0; font-size: 6pt; color: #94a3b8; }
        .receipt-credit { text-align: center; font-size: 4.5px; color: #1a1a2e; font-weight: 500; opacity: 0.6; letter-spacing: 0.3px; direction: ltr; margin-top: 1mm; padding-top: 0.5mm; border-top: 0.5px dashed rgba(26, 26, 46, 0.15); }
        .note-text { font-size: 7pt; color: #4b5563; }
        .print-btn-container { text-align: center; padding: 2mm 0; background: white; }
        .print-btn { padding: 1mm 4mm; background: #2563eb; color: white; border: none; border-radius: 1mm; font-size: 8pt; font-weight: 600; cursor: pointer; }
        @media print {
          html, body { width: 80mm !important; min-width: 80mm !important; max-width: 80mm !important; margin: 0 !important; padding: 0 !important; }
          .receipt { width: 80mm !important; min-width: 80mm !important; max-width: 80mm !important; margin: 0 !important; padding: 2mm 2.5mm 2.5mm 2.5mm !important; }
          .print-btn-container { display: none !important; }
          .receipt-title, .status-badge, .payment-details, .logo-section, .receipt-watermark { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .logo-section img { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .receipt-watermark { opacity: 0.06 !important; }
          .receipt-watermark img { width: 90px !important; }
          .receipt-watermark-text { font-size: 18px !important; opacity: 0.04 !important; }
          .receipt-credit { opacity: 0.5 !important; color: #000000 !important; }
        }
      </style>
    </head>
    <body>
      <div class="receipt-wrapper">
        <div class="receipt">
          <div class="receipt-watermark">
            <img src="${logoPath}" alt="الأكاديمية الأولمبية لعلوم الرياضة">
          </div>
          <div class="receipt-watermark-text">الأكاديمية الأولمبية لعلوم الرياضة</div>
          <div class="receipt-content">
            <div class="logo-section">
              <img src="${logoPath}" alt="الأكاديمية الأولمبية لعلوم الرياضة" onerror="this.style.display='none'">
              <div class="logo-text">
                <span class="academy-name">🏛️ الأكاديمية الأولمبية لعلوم الرياضة</span>
                <span class="receipt-type">✦ إيصال دفع ✦</span>
              </div>
            </div>
            <div class="receipt-title">
              <h1>إيصال الدفع</h1>
              <div class="receipt-number">رقم الإيصال: #${paymentData.id || 'N/A'}</div>
            </div>
            <div class="receipt-body">
              <div class="receipt-section">
                <div class="section-title">📚 معلومات التسجيل</div>
                <div class="info-row">
                  <span class="label">المتدرب</span>
                  <span class="value">${enrollmentData.trainee?.fullName || '-'}</span>
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
            <div class="barcode-section">
              <div class="barcode-container">
                <svg id="barcode"></svg>
                <span class="barcode-label">${traineeNationalId}</span>
              </div>
            </div>
            <div class="receipt-footer">
              <div>🏛️ الأكاديمية الأولمبية لعلوم الرياضة</div>
              <div style="margin-top: 1px;">شكراً لثقتكم بنا</div>
              <div style="margin-top: 1px; font-size: 5pt;">${currentDateFormatted}</div>
            </div>
            <div class="receipt-credit">powered by CoreStack Solutions | 01069911181</div>
          </div>
        </div>
        <div class="print-btn-container">
          <button class="print-btn" onclick="window.print();">🖨️ طباعة</button>
        </div>
      </div>
      <script>
        window.onload = function() {
          setTimeout(function() {
            try {
              JsBarcode('#barcode', '${traineeNationalId}', {
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
  // SUBMIT
  // ==========================================================================

  onSubmit(): void {
    if (this.paymentForm.invalid) {
      this.notification.showWarning(
        'يرجى تعبئة جميع الحقول المطلوبة في الخطوات السابقة'
      );
      return;
    }

    const paidAmount = this.paymentForm.get('paidAmount')?.value;
    const currentRemaining = this.paymentForm.get('currentRemaining')?.value;

    if (paidAmount > currentRemaining && currentRemaining > 0) {
      this.notification.showWarning(
        'المبلغ المدفوع لا يمكن أن يتجاوز المبلغ المتبقي'
      );
      return;
    }

    const paymentStatusObj = this.paymentForm.get('paymentStatusObj')?.value;
    const paymentStatusEnum = this.mapPaymentStatus(paymentStatusObj);

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
            paymentData as any
          )
        : this.financialService.createEnrollmentPayment(paymentData as any);

    serviceCall.subscribe({
      next: (response: any) => {
        this.notification.showSuccess(
          this.isEditMode ? 'تم تحديث الدفعة بنجاح' : 'تم إضافة الدفعة بنجاح'
        );
        this.isSubmitting = false;

        this.paymentResult = {
          id: response.id || this.paymentId || 0,
          paidAmount: paidAmount,
          remainedValue: this.getNewRemaining(),
          paymentDate: this.paymentForm.get('paymentDate')?.value,
          paymentMethodTitle: this.getPaymentMethodLabel(),
          paymentStatus: paymentStatusEnum,
          paymentStatusTitle: this.getPaymentStatusLabel(),
          note: this.paymentForm.get('note')?.value,
          traineeNationalId: this.selectedEnrollment?.trainee?.nationalId,
        };

        this.showSuccess = true;
        this.currentStep = 3;
        this.notification.showSuccess('تمت العملية بنجاح! يمكنك طباعة الإيصال.');

        if (!this.isEditMode) {
          setTimeout(() => {
            if (this.paymentResult) {
              this.printReceipt(this.paymentResult, this.selectedEnrollment);
            }
          }, 600);
        }

        setTimeout(() => {
          this.dialogRef.close(true);
        }, 10000);
      },
      error: (err) => {
        console.error('Error:', err);
        this.notification.showError(
          err.error?.messageEn ||
            (this.isEditMode
              ? 'حدث خطأ في تحديث الدفعة'
              : 'حدث خطأ في إضافة الدفعة')
        );
        this.isSubmitting = false;
      },
    });
  }

  private mapPaymentStatus(statusObj: any): string | null {
    if (!statusObj) return null;
    const statusMap: { [key: number]: string } = {
      1: 'PENDING',
      2: 'PAID',
      3: 'FAILED',
      4: 'REFUNDED',
      5: 'CANCELLED',
      6: 'PARTIAL',
    };
    return statusMap[statusObj.id] || 'PENDING';
  }

  // ==========================================================================
  // DIALOG ACTIONS
  // ==========================================================================

  onCancel(): void {
    if (this.showSuccess) {
      this.dialogRef.close(true);
    } else {
      this.dialogRef.close(false);
    }
  }

  printReceiptFromSuccess(): void {
    if (this.paymentResult) {
      this.printReceipt(this.paymentResult, this.selectedEnrollment);
    }
  }

  closeAfterSuccess(): void {
    this.dialogRef.close(true);
  }
}