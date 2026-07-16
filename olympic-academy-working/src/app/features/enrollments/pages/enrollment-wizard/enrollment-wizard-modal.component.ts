// enrollment-wizard-modal.component.ts

import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule, MatStepper } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { EnrollmentService } from '../../../../core/services/enrollment.service';
import { TraineeService } from '../../../../core/services/trainee.service';
import { CourseService } from '../../../../core/services/course.service';
import { EmployeeService } from '../../../../core/services/employee.service';
import { FinancialService } from '../../../../core/services/financial.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { FileService } from '../../../../core/services/file.service';
import { PAYMENT_STATUSES } from '../../../../core/models/common.model';
import { ENROLLMENT_STATUSES } from '../../../../core/models/enrollment.model';
import {
  SearchableSelectComponent,
  SelectOption,
} from '../../../../shared/components/searchable-select/searchable-select.component';

interface TraineeLookup {
  id: number;
  title: string;
  nationalId: string;
  imageUrl: string;
  imagePreviewUrl?: string;
  academicYear?: string;
}

export interface EnrollmentWizardData {
  enrollmentId?: number;
  traineeId?: number;
}

@Component({
  selector: 'app-enrollment-wizard-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatStepperModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatCardModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatChipsModule,
    MatSlideToggleModule,
    SearchableSelectComponent,
  ],
  templateUrl: './enrollment-wizard-modal.component.html',
  styleUrls: ['./enrollment-wizard-modal.component.css'],
})
export class EnrollmentWizardModalComponent implements OnInit {
  @ViewChild('stepper') stepper!: MatStepper;
  @ViewChild('barcodeInput') barcodeInput!: ElementRef<HTMLInputElement>;

  step1Form: FormGroup;
  step2Form: FormGroup;
  step3Form: FormGroup;
  enrollmentForm: FormGroup;

  trainees: TraineeLookup[] = [];
  courses: any[] = [];
  trainers: any[] = [];
  enrollmentTypes: any[] = [];
  paymentStatuses = PAYMENT_STATUSES;
  enrollmentStatuses = ENROLLMENT_STATUSES;
  paymentMethods: any[] = [];

  traineeOptions: SelectOption[] = [];
  courseOptions: SelectOption[] = [];
  trainerOptions: SelectOption[] = [];
  paymentMethodOptions: SelectOption[] = [];

  selectedCourse: any = null;
  selectedTrainee: TraineeLookup | null = null;
  isLoading = false;
  isSubmitting = false;
  isEditMode = false;
  enrollmentId: number | null = null;
  preSelectedTraineeId: number | null = null;
  showPaymentSection: boolean = false;
  makePaymentDirectly: boolean = false;

  constructor(
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<EnrollmentWizardModalComponent>,
    @Inject(MAT_DIALOG_DATA) private data: EnrollmentWizardData,
    private fb: FormBuilder,
    private enrollmentService: EnrollmentService,
    private traineeService: TraineeService,
    private courseService: CourseService,
    private employeeService: EmployeeService,
    private financialService: FinancialService,
    private notification: NotificationService,
    private fileService: FileService,
    private cdr: ChangeDetectorRef,
  ) {
    this.isEditMode = !!data?.enrollmentId;
    this.enrollmentId = data?.enrollmentId || null;
    this.preSelectedTraineeId = data?.traineeId || null;

    this.step1Form = this.fb.group({ traineeId: [null, Validators.required] });
    this.step2Form = this.fb.group({ courseId: [null, Validators.required] });
    this.step3Form = this.fb.group({ trainerId: [null, Validators.required] });
    this.enrollmentForm = this.fb.group({
      enrollmentTypeId: [null],
      startDate: [null, [Validators.required]],
      endDate: [null],
      enrollmentStatus: [null],
      paymentStatus: [null, Validators.required],
      subscriptionValue: [null],
      discountAmount: [null],
      discountPercentage: [null],
      finalSubscriptionValue: [{ value: null, disabled: true }],
      isActive: [true],
      isAutoUpdate: [false], // ✅ Added isAutoUpdate field
      note: [''],
    });
  }

  ngOnInit(): void {
    console.log('Enrollment Statuses:', ENROLLMENT_STATUSES);
    this.loadLookupData();
    this.loadPaymentMethods();

    this.enrollmentForm
      .get('enrollmentTypeId')
      ?.valueChanges.subscribe((value) => {
        if (value === 'new') {
          this.openAddEnrollmentTypeDialog();
        }
      });

    if (this.isEditMode && this.enrollmentId) {
      this.loadEnrollmentData();
    } else if (this.preSelectedTraineeId) {
      this.selectPreSelectedTrainee();
    }
  }
  

  selectPreSelectedTrainee(): void {
    if (this.trainees.length > 0 && this.preSelectedTraineeId) {
      const trainee = this.trainees.find(
        (t) => t.id === this.preSelectedTraineeId,
      );
      if (trainee) {
        this.step1Form.patchValue({ traineeId: trainee.id });
        this.selectedTrainee = trainee;
        if (trainee.imageUrl) {
          this.loadTraineeImage(trainee);
        }
        this.notification.showSuccess(`تم اختيار المتدرب: ${trainee.title}`);
      }
    }
  }

  loadLookupData(): void {
    this.isLoading = true;

    this.traineeService.getAllTraineesLookup().subscribe({
      next: (res: any) => {
        this.trainees = res.list || [];
        this.traineeOptions = this.trainees.map((t) => ({
          value: t.id,
          label: t.title,
        }));

        if (this.preSelectedTraineeId && this.trainees.length > 0) {
          this.selectPreSelectedTrainee();
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading trainees:', err);
        this.notification.showError('حدث خطأ في تحميل المتدربين');
        this.isLoading = false;
      },
    });

    this.courseService.getAllCourses().subscribe({
      next: (res: any) => {
        this.courses = res.items || [];
        this.courseOptions = this.courses.map((c) => ({
          value: c.id,
          label: c.title,
        }));
      },
      error: () => this.notification.showError('حدث خطأ في تحميل الدورات'),
    });

    this.employeeService.getAllTrainersLookup().subscribe({
      next: (res: any) => {
        this.trainers = res.list || [];
        this.trainerOptions = this.trainers.map((t) => ({
          value: t.id,
          label: t.title,
        }));
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل المدربين');
      },
    });

    this.loadEnrollmentTypes();
  }

  loadEnrollmentTypes(): void {
    this.enrollmentService.getAllEnrollmentTypes().subscribe({
      next: (res: any) => {
        this.enrollmentTypes = res.items || [];
      },
      error: () =>
        this.notification.showError('حدث خطأ في تحميل أنواع التسجيل'),
    });
  }

  onTraineeSelect(): void {
    const traineeId = this.step1Form.get('traineeId')?.value;
    this.selectedTrainee =
      this.trainees.find((t) => t.id === traineeId) || null;
    if (this.selectedTrainee && this.selectedTrainee.imageUrl) {
      this.loadTraineeImage(this.selectedTrainee);
    }
  }

  searchByNationalId(nationalId: string): void {
    if (!nationalId || nationalId.trim().length === 0) {
      this.notification.showWarning('يرجى إدخال رقم الهوية');
      return;
    }

    this.isLoading = true;
    const trainee = this.trainees.find(
      (t) => t.nationalId === nationalId.trim(),
    );

    if (trainee) {
      this.selectedTrainee = trainee;
      this.step1Form.patchValue({ traineeId: trainee.id });
      this.notification.showSuccess(`تم العثور على المتدرب: ${trainee.title}`);
      if (this.barcodeInput) {
        this.barcodeInput.nativeElement.value = '';
      }
      if (trainee.imageUrl) {
        this.loadTraineeImage(trainee);
      }
    } else {
      this.notification.showWarning('لم يتم العثور على متدرب بهذا الرقم');
    }
    this.isLoading = false;
  }

  loadTraineeImage(trainee: TraineeLookup): void {
    if (trainee.imageUrl && /^\d{15}(\d{3})?$/.test(trainee.imageUrl)) {
      this.fileService.downloadFile(trainee.imageUrl).subscribe({
        next: (blob) => {
          const blobUrl = URL.createObjectURL(blob);
          const index = this.trainees.findIndex((t) => t.id === trainee.id);
          if (index !== -1) {
            this.trainees[index] = {
              ...this.trainees[index],
              imagePreviewUrl: blobUrl,
            };
          }
          if (this.selectedTrainee && this.selectedTrainee.id === trainee.id) {
            this.selectedTrainee = this.trainees[index] || null;
          }
          this.selectedTrainee = { ...this.selectedTrainee } as TraineeLookup;
          this.cdr.detectChanges();
        },
        error: () => {
          trainee.imagePreviewUrl = '';
        },
      });
    }
  }

  get allEnrollmentStatuses() {
  return this.enrollmentStatuses;
}

  openAddEnrollmentTypeDialog(): void {
    const dialogRef = this.dialog.open(AddEnrollmentTypeDialogComponent, {
      width: '500px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.success) {
        this.loadEnrollmentTypes();
        setTimeout(() => {
          const newType = this.enrollmentTypes.find(
            (t) => t.title === result.title,
          );
          if (newType) {
            this.enrollmentForm.patchValue({ enrollmentTypeId: newType.id });
            this.notification.showSuccess('تم إضافة نوع التسجيل بنجاح');
          }
        }, 500);
      } else {
        this.enrollmentForm.patchValue({ enrollmentTypeId: null });
      }
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
      error: () => this.notification.showError('حدث خطأ في تحميل طرق الدفع'),
    });
  }

loadEnrollmentData(): void {
  this.isLoading = true;
  this.enrollmentService.getEnrollmentById(this.enrollmentId!).subscribe({
    next: (enrollment: any) => {
      console.log('📋 Loading enrollment data:', enrollment);

      // ---- STEP 1: Trainee ----
      const traineeId = enrollment.trainee?.id;
      if (traineeId) {
        this.step1Form.patchValue({ traineeId: traineeId });
        this.selectedTrainee =
          this.trainees.find((t) => t.id === traineeId) || null;
        if (this.selectedTrainee && this.selectedTrainee.imageUrl) {
          this.loadTraineeImage(this.selectedTrainee);
        }
      }

      // ---- STEP 2: Course ----
      const courseId = enrollment.course?.id;
      if (courseId) {
        this.step2Form.patchValue({ courseId: courseId });
        this.selectedCourse =
          this.courses.find((c) => c.id === courseId) || null;
        if (this.selectedCourse) {
          this.setDateValidators();
        }
      }

      // ---- STEP 3: Trainer ----
      const trainerId = enrollment.trainer?.id;
      if (trainerId) {
        this.step3Form.patchValue({ trainerId: trainerId });
      }

      // ---- STEP 4: Enrollment Details ----
      let enrollmentStatusObj = null;
      if (enrollment.enrollmentStatus) {
        const statusValue =
          typeof enrollment.enrollmentStatus === 'string'
            ? enrollment.enrollmentStatus
            : enrollment.enrollmentStatus.title ||
              enrollment.enrollmentStatus;

        // ✅ Added FINISHED (4) mapping
        switch (statusValue) {
          case 'PENDING':
          case 'قيد الانتظار':
            enrollmentStatusObj = ENROLLMENT_STATUSES.find((s) => s.id === 1);
            break;
          case 'COMPLETED':
          case 'مكتمل':
            enrollmentStatusObj = ENROLLMENT_STATUSES.find((s) => s.id === 2);
            break;
          case 'CANCELLED':
          case 'ملغي':
            enrollmentStatusObj = ENROLLMENT_STATUSES.find((s) => s.id === 3);
            break;
          case 'FINISHED':
          case 'منتهي':
            enrollmentStatusObj = ENROLLMENT_STATUSES.find((s) => s.id === 4);
            break;
          default:
            enrollmentStatusObj = ENROLLMENT_STATUSES.find((s) => s.id === 1);
        }
      }

      let paymentStatusObj = null;
      if (enrollment.paymentStatus) {
        const statusValue =
          typeof enrollment.paymentStatus === 'string'
            ? enrollment.paymentStatus
            : enrollment.paymentStatus.title || enrollment.paymentStatus;

        const statusMap: { [key: string]: number } = {
          PENDING: 1,
          'قيد الانتظار': 1,
          PAID: 2,
          'تم الدفع': 2,
          FAILED: 3,
          فشل: 3,
          REFUNDED: 4,
          'تم استرداد المبلغ': 4,
          CANCELLED: 5,
          'تم الالغاء': 5,
          PARTIAL: 6,
          جزئي: 6,
        };
        const statusId = statusMap[statusValue];
        if (statusId) {
          paymentStatusObj = this.paymentStatuses.find(
            (s) => s.id === statusId,
          );
        }
      }

      let enrollmentTypeId = null;
      if (enrollment.enrollmentType?.id) {
        enrollmentTypeId = enrollment.enrollmentType.id;
      }

      // ✅ FIX: Ensure isAutoUpdate is properly set with default false
      const isActiveValue = enrollment.isActive !== undefined && enrollment.isActive !== null 
        ? enrollment.isActive 
        : true;
      
      const isAutoUpdateValue = enrollment.isAutoUpdate !== undefined && enrollment.isAutoUpdate !== null 
        ? enrollment.isAutoUpdate 
        : false;

      this.enrollmentForm.patchValue({
        enrollmentTypeId: enrollmentTypeId,
        startDate: enrollment.startDate
          ? new Date(enrollment.startDate)
          : null,
        endDate: enrollment.endDate ? new Date(enrollment.endDate) : null,
        enrollmentStatus: enrollmentStatusObj,
        paymentStatus: paymentStatusObj,
        subscriptionValue: enrollment.subscriptionValue || null,
        discountAmount: enrollment.discountAmount || null,
        discountPercentage: enrollment.discountPercentage || null,
        isActive: isActiveValue,
        isAutoUpdate: isAutoUpdateValue, // ✅ Properly set with default false
        note: enrollment.note || '',
      });

      this.calculateFinalValue();

      console.log('✅ Enrollment data loaded successfully');
      this.isLoading = false;
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('❌ Error loading enrollment:', err);
      this.notification.showError('حدث خطأ في تحميل بيانات التسجيل');
      this.isLoading = false;
    },
  });
}

  onCourseSelect(): void {
    const courseId = this.step2Form.get('courseId')?.value;
    this.selectedCourse = this.courses.find((c) => c.id === courseId);
    if (this.selectedCourse) {
      this.enrollmentForm.patchValue({
        subscriptionValue: this.selectedCourse.price,
      });
      const currentStartDate = this.enrollmentForm.get('startDate')?.value;
      if (!currentStartDate && this.selectedCourse.startDate) {
        this.enrollmentForm.patchValue({
          startDate: this.selectedCourse.startDate,
        });
      }
      this.setDateValidators();
      this.calculateFinalValue();
    }
  }

  setDateValidators(): void {
    if (!this.selectedCourse) return;

    const courseStartDate = new Date(this.selectedCourse.startDate);
    const courseEndDate = new Date(this.selectedCourse.endDate);

    const startDateValidator = (
      control: AbstractControl,
    ): ValidationErrors | null => {
      if (!control.value) return null;
      const selectedDate = new Date(control.value);
      if (selectedDate < courseStartDate) return { beforeCourseStart: true };
      if (selectedDate > courseEndDate) return { afterCourseEnd: true };
      return null;
    };

    const endDateValidator = (
      control: AbstractControl,
    ): ValidationErrors | null => {
      if (!control.value) return null;
      const selectedDate = new Date(control.value);
      const startDate = this.enrollmentForm.get('startDate')?.value;
      if (selectedDate > courseEndDate) return { afterCourseEnd: true };
      if (startDate && selectedDate < new Date(startDate))
        return { beforeStartDate: true };
      return null;
    };

    this.enrollmentForm
      .get('startDate')
      ?.setValidators([Validators.required, startDateValidator]);
    this.enrollmentForm.get('endDate')?.setValidators([endDateValidator]);
    this.enrollmentForm.get('startDate')?.updateValueAndValidity();
    this.enrollmentForm.get('endDate')?.updateValueAndValidity();
  }

  validateDates(): void {
    this.enrollmentForm.get('startDate')?.updateValueAndValidity();
    this.enrollmentForm.get('endDate')?.updateValueAndValidity();
  }

  onDiscountAmountChange(): void {
    const subscriptionValue =
      this.enrollmentForm.get('subscriptionValue')?.value || 0;
    const discountAmount =
      this.enrollmentForm.get('discountAmount')?.value || 0;

    if (subscriptionValue > 0 && discountAmount > 0) {
      const discountPercentage = (discountAmount / subscriptionValue) * 100;
      this.enrollmentForm.patchValue(
        { discountPercentage: Math.round(discountPercentage * 100) / 100 },
        { emitEvent: false },
      );
    } else if (discountAmount === 0) {
      this.enrollmentForm.patchValue(
        { discountPercentage: null },
        { emitEvent: false },
      );
    }
    this.calculateFinalValue();
  }

  onDiscountPercentageChange(): void {
    const subscriptionValue =
      this.enrollmentForm.get('subscriptionValue')?.value || 0;
    const discountPercentage =
      this.enrollmentForm.get('discountPercentage')?.value || 0;

    if (subscriptionValue > 0 && discountPercentage > 0) {
      const discountAmount = (subscriptionValue * discountPercentage) / 100;
      this.enrollmentForm.patchValue(
        { discountAmount: Math.round(discountAmount * 100) / 100 },
        { emitEvent: false },
      );
    } else if (discountPercentage === 0) {
      this.enrollmentForm.patchValue(
        { discountAmount: null },
        { emitEvent: false },
      );
    }
    this.calculateFinalValue();
  }

  calculateFinalValue(): void {
    const subscriptionValue =
      this.enrollmentForm.get('subscriptionValue')?.value || 0;
    const discountAmount =
      this.enrollmentForm.get('discountAmount')?.value || 0;
    const discountPercentage =
      this.enrollmentForm.get('discountPercentage')?.value || 0;

    let finalValue = subscriptionValue;
    if (discountAmount > 0) {
      finalValue = subscriptionValue - discountAmount;
    } else if (discountPercentage > 0) {
      finalValue =
        subscriptionValue - (subscriptionValue * discountPercentage) / 100;
    }
    finalValue = Math.max(0, finalValue);
    this.enrollmentForm.patchValue(
      { finalSubscriptionValue: finalValue },
      { emitEvent: false },
    );
  }

  onPaymentOptionChange(event: any): void {
    this.makePaymentDirectly = event.checked;
    this.showPaymentSection = event.checked;
  }

  getPaymentStatusColor(statusId: number): string {
    const colors: { [key: number]: string } = {
      1: '#f59e0b',
      2: '#10b981',
      3: '#ef4444',
      4: '#8b5cf6',
      5: '#6b7280',
      6: '#3b82f6',
    };
    return colors[statusId] || '#6b7280';
  }

  // ==========================================================================
  // PRINT PREVIEW WITH WATERMARK AND LOGO
  // ==========================================================================

  printPreview(): void {
    const traineeId = this.step1Form.get('traineeId')?.value;
    const trainee = this.trainees.find((t) => t.id === traineeId);
    const courseId = this.step2Form.get('courseId')?.value;
    const course = this.courses.find((c) => c.id === courseId);
    const trainerId = this.step3Form.get('trainerId')?.value;
    const trainer = this.trainers.find((t) => t.id === trainerId);
    const paymentStatus = this.enrollmentForm.get('paymentStatus')?.value;

    const previewData = {
      id: this.enrollmentId || 'جديد',
      trainee,
      course,
      trainer,
      enrollmentType: this.enrollmentTypes.find(
        (t) => t.id === this.enrollmentForm.get('enrollmentTypeId')?.value,
      ),
      startDate: this.enrollmentForm.get('startDate')?.value,
      endDate: this.enrollmentForm.get('endDate')?.value,
      enrollmentStatus: this.enrollmentForm.get('enrollmentStatus')?.value,
      paymentStatus: paymentStatus,
      subscriptionValue: this.enrollmentForm.get('subscriptionValue')?.value,
      discountAmount: this.enrollmentForm.get('discountAmount')?.value,
      discountPercentage: this.enrollmentForm.get('discountPercentage')?.value,
      finalSubscriptionValue: this.enrollmentForm.get('finalSubscriptionValue')
        ?.value,
      isActive: this.enrollmentForm.get('isActive')?.value,
      isAutoUpdate: this.enrollmentForm.get('isAutoUpdate')?.value, // ✅ Add to preview data
      note: this.enrollmentForm.get('note')?.value,
      isNewEnrollment: !this.isEditMode,
    };

    this.generatePrintDocument(previewData);
  }

  private generatePrintDocument(data: any): void {
    const logoPath = 'assets/images/mainLogo.jpeg';
    const today = new Date().toLocaleDateString('ar-EG');
    const applicationNumber = data.isNewEnrollment
      ? `NEW-${Date.now()}`
      : `ENR-${data.id}`;

    const paymentStatusDisplay = data.paymentStatus?.title || '-';
    const enrollmentStatusDisplay = data.enrollmentStatus?.title || '-';

    const printContainer = document.createElement('div');
    printContainer.style.direction = 'rtl';
    printContainer.style.fontFamily = 'Cairo, "Segoe UI", Tahoma, sans-serif';
    printContainer.style.padding = '0';
    printContainer.style.backgroundColor = 'white';
    printContainer.style.position = 'relative';
    printContainer.style.width = '100%';

    // ✅ Get auto update display text
    const autoUpdateDisplay = data.isAutoUpdate ? 'مفعل' : 'غير مفعل';

    printContainer.innerHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>طلب تسجيل - ${data.trainee?.title || 'جديد'}</title>
        <style>
          * { 
            font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif; 
            margin: 0; 
            padding: 0; 
            box-sizing: border-box; 
          }
          
          html, body {
            width: 100%;
            min-height: 100vh;
            background: white;
            margin: 0;
            padding: 0;
          }
          
          @page { 
            size: A4 portrait; 
            margin: 10mm;
          }
          
          .page-container {
            position: relative;
            width: 100%;
            min-height: 100vh;
            background: white;
            overflow: hidden;
          }
          
          .watermark-wrapper {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 60%;
            height: 60%;
            pointer-events: none;
            z-index: 0;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .watermark-container {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            opacity: 0.08;
            transform: rotate(-25deg);
          }
          
          .watermark-container img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            filter: grayscale(0%) sepia(20%) saturate(150%) hue-rotate(220deg);
          }
          
          .watermark-text {
            position: absolute;
            top: 58%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-25deg);
            font-size: 40px;
            font-weight: 900;
            color: #0f3460;
            letter-spacing: 6px;
            text-transform: uppercase;
            white-space: nowrap;
            opacity: 0.04;
            pointer-events: none;
            z-index: 0;
          }
          
          .content {
            position: relative;
            z-index: 1;
            padding: 30px 40px;
            background: transparent;
            min-height: 100vh;
          }
          
          @media print {
            html, body {
              width: 100%;
              height: 100%;
              margin: 0;
              padding: 0;
            }
            .no-print { display: none !important; }
            .watermark-container {
              opacity: 0.10 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .watermark-container img {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .watermark-text {
              opacity: 0.05 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .logo-section {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .header {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .status-badge {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          }
          
          .logo-section {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 16px 0;
            margin-bottom: 20px;
            border-bottom: 3px solid #0f3460;
          }
          
          .logo-section img {
            width: 60px;
            height: 60px;
            object-fit: contain;
            border-radius: 8px;
          }
          
          .logo-section .logo-text {
            display: flex;
            flex-direction: column;
          }
          
          .logo-section .logo-text .academy-name {
            font-size: 20px;
            font-weight: 700;
            color: #0f3460;
            letter-spacing: 1px;
          }
          
          .logo-section .logo-text .academy-sub {
            font-size: 12px;
            color: #64748b;
          }
          
          .header {
            text-align: center;
            margin-bottom: 24px;
            padding: 20px;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            color: white;
            border-radius: 12px;
          }
          .header h1 { 
            margin: 0; 
            font-size: 22px; 
            font-weight: 700;
            letter-spacing: 1px;
          }
          .header p { 
            margin: 6px 0 0 0; 
            font-size: 13px; 
            opacity: 0.85;
          }
          
          .section-title {
            color: #0f3460;
            border-bottom: 2px solid #0f3460;
            padding-bottom: 8px;
            margin-top: 24px;
            margin-bottom: 16px;
            font-size: 17px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .section-title .title-icon {
            font-size: 20px;
          }
          
          .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px 24px;
            margin-bottom: 16px;
          }
          .info-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #f1f5f9;
          }
          .info-label {
            font-weight: 600;
            color: #475569;
            font-size: 14px;
          }
          .info-value {
            color: #1e293b;
            font-size: 14px;
            font-weight: 500;
          }
          .info-value.amount {
            color: #0f3460;
            font-weight: 700;
            font-size: 16px;
          }
          .info-value.remaining {
            color: #d97706;
            font-weight: 600;
          }
          .info-value.remaining-zero {
            color: #10b981;
            font-weight: 600;
          }
          
          .full-width {
            grid-column: span 2;
          }
          
          .status-badge {
            display: inline-block;
            padding: 4px 14px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
          }
          .status-badge.paid {
            background: #d1fae5;
            color: #065f46;
          }
          .status-badge.pending {
            background: #fef3c7;
            color: #92400e;
          }
          .status-badge.failed {
            background: #fee2e2;
            color: #991b1b;
          }
          .status-badge.partial {
            background: #dbeafe;
            color: #1e40af;
          }
          .status-badge.finished {
            background: #f3e8ff;
            color: #6d28d9;
          }
          .status-badge.completed {
            background: #d1fae5;
            color: #065f46;
          }
          .status-badge.cancelled {
            background: #fee2e2;
            color: #991b1b;
          }
          .status-badge.active {
            background: #d1fae5;
            color: #065f46;
          }
          .status-badge.inactive {
            background: #fee2e2;
            color: #991b1b;
          }
          
          .note-section {
            margin-top: 16px;
            padding: 16px;
            background: #fffbeb;
            border-radius: 8px;
            border: 1px solid rgba(217, 119, 6, 0.15);
          }
          .note-section .note-label {
            font-weight: 600;
            color: #92400e;
          }
          .note-section .note-value {
            color: #78350f;
            margin-top: 4px;
          }
          
          .footer {
            text-align: center;
            margin-top: 30px;
            padding: 16px;
            font-size: 10px;
            color: #94a3b8;
            border-top: 1px solid #e5e7eb;
          }
          
          .draft-watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-30deg);
            font-size: 80px;
            font-weight: 900;
            color: #ef4444;
            opacity: 0.06;
            pointer-events: none;
            white-space: nowrap;
            letter-spacing: 10px;
          }
          
          @media (max-width: 600px) {
            .content { padding: 16px; }
            .info-grid { grid-template-columns: 1fr; }
            .full-width { grid-column: span 1; }
            .logo-section img { width: 40px; height: 40px; }
            .logo-section .logo-text .academy-name { font-size: 16px; }
            .header h1 { font-size: 18px; }
          }
        </style>
      </head>
      <body>
        <div class="page-container">
          <!-- Watermark -->
          <div class="watermark-wrapper">
            <div class="watermark-container">
              <img src="${logoPath}" alt=" الأكاديمية الأولمبية لعلوم الرياضة">
            </div>
            <div class="watermark-text"> الأكاديمية الأولمبية لعلوم الرياضة</div>
          </div>
          
          ${data.isNewEnrollment ? '<div class="draft-watermark">مسودة</div>' : ''}
          
          <div class="content">
            <!-- Logo Section -->
            <div class="logo-section">
              <img src="${logoPath}" alt=" الأكاديمية الأولمبية لعلوم الرياضة">
              <div class="logo-text">
                <span class="academy-name"> الأكاديمية الأولمبية لعلوم الرياضة</span>
                <span class="academy-sub">نظام إدارة  الأكاديمية الأولمبية لعلوم الرياضة</span>
              </div>
            </div>
            
            <!-- Header -->
            <div class="header">
              <h1>📋 طلب تسجيل في دورة تدريبية</h1>
              <p>${applicationNumber} | تاريخ الإصدار: ${today}</p>
            </div>
            
            <!-- Trainee Info -->
            <div class="section-title">
              <span class="title-icon">👤</span>
              معلومات المتدرب
            </div>
            <div class="info-grid">
              <div class="info-item"><span class="info-label">الاسم الكامل</span><span class="info-value">${data.trainee?.title || '-'}</span></div>
              <div class="info-item"><span class="info-label">رقم الهوية</span><span class="info-value">${data.trainee?.nationalId || '-'}</span></div>
              ${data.trainee?.academicYear ? `<div class="info-item"><span class="info-label">السنة الدراسية</span><span class="info-value">${data.trainee.academicYear}</span></div>` : ''}
            </div>
            
            <!-- Course Info -->
            <div class="section-title">
              <span class="title-icon">📚</span>
              معلومات الدورة
            </div>
            <div class="info-grid">
              <div class="info-item"><span class="info-label">الدورة</span><span class="info-value">${data.course?.title || '-'}</span></div>
              <div class="info-item"><span class="info-label">المدرب</span><span class="info-value">${data.trainer?.title || '-'}</span></div>
              <div class="info-item"><span class="info-label">تاريخ البدء</span><span class="info-value">${data.startDate ? new Date(data.startDate).toLocaleDateString('ar-EG') : '-'}</span></div>
              <div class="info-item"><span class="info-label">تاريخ الانتهاء</span><span class="info-value">${data.endDate ? new Date(data.endDate).toLocaleDateString('ar-EG') : '-'}</span></div>
              ${data.enrollmentType?.title ? `<div class="info-item"><span class="info-label">نوع التسجيل</span><span class="info-value">${data.enrollmentType.title}</span></div>` : ''}
            </div>
            
            <!-- Payment Details -->
            <div class="section-title">
              <span class="title-icon">💰</span>
              تفاصيل الدفع
            </div>
            <div class="info-grid">
              <div class="info-item"><span class="info-label">قيمة الاشتراك</span><span class="info-value amount">${(data.subscriptionValue || 0).toLocaleString('ar-EG')} جم</span></div>
              ${data.discountAmount ? `<div class="info-item"><span class="info-label">قيمة الخصم</span><span class="info-value">${data.discountAmount.toLocaleString('ar-EG')} جم</span></div>` : ''}
              ${data.discountPercentage ? `<div class="info-item"><span class="info-label">نسبة الخصم</span><span class="info-value">${data.discountPercentage}%</span></div>` : ''}
              <div class="info-item"><span class="info-label">المبلغ النهائي</span><span class="info-value amount">${(data.finalSubscriptionValue || 0).toLocaleString('ar-EG')} جم</span></div>
              <div class="info-item"><span class="info-label">حالة الدفع</span>
                <span class="info-value">
                  <span class="status-badge ${data.paymentStatus?.id === 2 ? 'paid' : data.paymentStatus?.id === 1 ? 'pending' : data.paymentStatus?.id === 3 ? 'failed' : data.paymentStatus?.id === 6 ? 'partial' : ''}">
                    ${paymentStatusDisplay}
                  </span>
                </span>
              </div>
              <div class="info-item"><span class="info-label">حالة التسجيل</span>
                <span class="info-value">
                  <span class="status-badge ${data.enrollmentStatus?.id === 2 ? 'completed' : data.enrollmentStatus?.id === 1 ? 'pending' : data.enrollmentStatus?.id === 3 ? 'cancelled' : data.enrollmentStatus?.id === 4 ? 'finished' : ''}">
                    ${enrollmentStatusDisplay}
                  </span>
                </span>
              </div>
              <div class="info-item"><span class="info-label">حالة النشاط</span>
                <span class="info-value">
                  <span class="status-badge ${data.isActive ? 'active' : 'inactive'}">
                    ${data.isActive !== undefined ? (data.isActive ? '✅ نشط' : '⛔ غير نشط') : '✅ نشط'}
                  </span>
                </span>
              </div>
              <!-- ✅ Added isAutoUpdate field -->
              <div class="info-item"><span class="info-label">تحديث تلقائي</span>
                <span class="info-value">
                  <span class="status-badge ${data.isAutoUpdate ? 'active' : 'inactive'}">
                    ${data.isAutoUpdate ? '✅ مفعل' : '⛔ غير مفعل'}
                  </span>
                </span>
              </div>
            </div>
            
            <!-- Notes -->
            ${
              data.note
                ? `
              <div class="section-title">
                <span class="title-icon">📝</span>
                ملاحظات
              </div>
              <div class="note-section">
                <div class="note-label">ملاحظات إضافية</div>
                <div class="note-value">${data.note}</div>
              </div>
            `
                : ''
            }
            
            <!-- Footer -->
            <div class="footer">
              <strong>🏛️  الأكاديمية الأولمبية لعلوم الرياضة</strong><br>
              تم التصدير بواسطة النظام الآلي للأكاديمية الأولمبية
            </div>
          </div>
        </div>
        
        <div class="no-print" style="text-align: center; margin-top: 10px; padding: 10px; position: fixed; bottom: 0; left: 0; right: 0; background: white; box-shadow: 0 -2px 10px rgba(0,0,0,0.1); z-index: 9999;">
          <button onclick="window.print();" style="padding: 8px 24px; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600; box-shadow: 0 2px 10px rgba(15, 52, 96, 0.3);">
            🖨️ طباعة / PDF
          </button>
          <button onclick="window.close();" style="padding: 8px 24px; background: #f1f5f9; color: #475569; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600; margin-right: 10px;">
            ✖ إغلاق
          </button>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open(
      '',
      '_blank',
      'width=900,height=850,scrollbars=yes',
    );
    if (printWindow) {
      printWindow.document.write(printContainer.innerHTML);
      printWindow.document.close();
      this.notification.showSuccess('تم فتح نموذج الطلب للطباعة');
    }
  }

  openPaymentModal(enrollmentId: number, finalAmount: number): void {
    this.dialogRef.close(true);
    setTimeout(() => {
      import('../../../financial/pages/enrollment/enrollment-payment/enrollment-payment-wizard/enrollment-payment-wizard-modal.component')
        .then((module) => {
          const paymentDialog = this.dialog.open(
            module.EnrollmentPaymentWizardModalComponent,
            {
              width: '800px',
              maxWidth: '90vw',
              data: { enrollmentId: enrollmentId },
            },
          );
          paymentDialog.afterClosed().subscribe((result: any) => {
            if (result) this.notification.showSuccess('تم إضافة الدفعة بنجاح');
          });
        })
        .catch((error) => {
          console.error('Error loading payment modal:', error);
          this.notification.showError('حدث خطأ في فتح نافذة الدفع');
        });
    }, 100);
  }

submitEnrollment(): void {
  if (
    this.step1Form.invalid ||
    this.step2Form.invalid ||
    this.step3Form.invalid
  ) {
    this.notification.showWarning(
      'يرجى تعبئة جميع الحقول المطلوبة في الخطوات السابقة',
    );
    return;
  }
  if (this.enrollmentForm.invalid) {
    this.notification.showWarning('يرجى التحقق من صحة التواريخ وحالة الدفع');
    return;
  }

  this.isSubmitting = true;

  const enrollmentStatusObj =
    this.enrollmentForm.get('enrollmentStatus')?.value;
  let enrollmentStatusEnum = null;
  if (enrollmentStatusObj) {
    // ✅ Added FINISHED (4) mapping
    switch (enrollmentStatusObj.id) {
      case 1:
        enrollmentStatusEnum = 'PENDING';
        break;
      case 2:
        enrollmentStatusEnum = 'COMPLETED';
        break;
      case 3:
        enrollmentStatusEnum = 'CANCELLED';
        break;
      case 4:
        enrollmentStatusEnum = 'FINISHED';
        break;
      default:
        enrollmentStatusEnum = 'PENDING';
    }
  }

  const paymentStatusObj = this.enrollmentForm.get('paymentStatus')?.value;
  let paymentStatusEnum = null;
  if (paymentStatusObj) {
    const statusMap: { [key: number]: string } = {
      1: 'PENDING',
      2: 'PAID',
      3: 'FAILED',
      4: 'REFUNDED',
      5: 'CANCELLED',
      6: 'PARTIAL',
    };
    paymentStatusEnum = statusMap[paymentStatusObj.id] || 'PENDING';
  }

  const finalSubscriptionValue =
    this.enrollmentForm.get('finalSubscriptionValue')?.value || 0;
  const enrollmentTypeId = this.enrollmentForm.get('enrollmentTypeId')?.value;
  
  // ✅ FIX: Ensure isActive is always a boolean (never null)
  const isActiveValue = this.enrollmentForm.get('isActive')?.value;
  const isActive = isActiveValue !== undefined && isActiveValue !== null ? isActiveValue : true;
  
  // ✅ FIX: Ensure isAutoUpdate is always a boolean (never null)
  const isAutoUpdateValue = this.enrollmentForm.get('isAutoUpdate')?.value;
  const isAutoUpdate = isAutoUpdateValue !== undefined && isAutoUpdateValue !== null ? isAutoUpdateValue : false;

  const enrollmentData = {
    traineeId: this.step1Form.get('traineeId')?.value,
    courseId: this.step2Form.get('courseId')?.value,
    trainerId: this.step3Form.get('trainerId')?.value,
    enrollmentTypeId:
      enrollmentTypeId && enrollmentTypeId !== 'new'
        ? Number(enrollmentTypeId)
        : null,
    startDate: this.enrollmentForm.get('startDate')?.value,
    endDate: this.enrollmentForm.get('endDate')?.value,
    enrollmentStatus: enrollmentStatusEnum,
    paymentStatus: paymentStatusEnum,
    subscriptionValue: this.enrollmentForm.get('subscriptionValue')?.value,
    discountAmount: this.enrollmentForm.get('discountAmount')?.value,
    discountPercentage: this.enrollmentForm.get('discountPercentage')?.value,
    finalSubscriptionValue: finalSubscriptionValue,
    remainedSubscriptionValue: finalSubscriptionValue,
    isActive: isActive, // ✅ Always a boolean
    isAutoUpdate: isAutoUpdate, // ✅ Always a boolean (default: false)
    note: this.enrollmentForm.get('note')?.value,
  };

  console.log('Submitting enrollment data:', enrollmentData);

  if (this.isEditMode && this.enrollmentId) {
    this.enrollmentService
      .updateEnrollment(this.enrollmentId, enrollmentData as any)
      .subscribe({
        next: () => {
          this.notification.showSuccess('تم تحديث التسجيل بنجاح');
          if (this.makePaymentDirectly && finalSubscriptionValue > 0) {
            this.openPaymentModal(this.enrollmentId!, finalSubscriptionValue);
          } else {
            this.dialogRef.close(true);
          }
          this.isSubmitting = false;
        },
        error: (err) => {
          console.error('Update error:', err);
          this.notification.showError(
            err.error?.messageEn || 'حدث خطأ في تحديث التسجيل',
          );
          this.isSubmitting = false;
        },
      });
  } else {
    this.enrollmentService.createEnrollment(enrollmentData as any).subscribe({
      next: (res: any) => {
        this.notification.showSuccess('تم إضافة التسجيل بنجاح');
        if (this.makePaymentDirectly && finalSubscriptionValue > 0) {
          this.openPaymentModal(res.id, finalSubscriptionValue);
        } else {
          this.dialogRef.close(true);
        }
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('Create error:', err);
        this.notification.showError(
          err.error?.messageEn || 'حدث خطأ في إضافة التسجيل',
        );
        this.isSubmitting = false;
      },
    });
  }
}
}

// Dialog component for adding new enrollment type
@Component({
  selector: 'app-add-enrollment-type-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatDividerModule,
  ],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <mat-icon>add_circle</mat-icon>
        <h2>إضافة نوع تسجيل جديد</h2>
      </div>
      <mat-divider></mat-divider>
      <div class="dialog-content">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>نوع التسجيل</mat-label>
          <input
            matInput
            [(ngModel)]="title"
            placeholder="مثال: تسجيل عادي, تسجيل مميز, ..."
          />
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>الوصف (اختياري)</mat-label>
          <textarea
            matInput
            [(ngModel)]="description"
            rows="3"
            placeholder="وصف نوع التسجيل..."
          ></textarea>
        </mat-form-field>
      </div>
      <div class="dialog-actions">
        <button mat-button (click)="cancel()">إلغاء</button>
        <button
          mat-raised-button
          color="primary"
          [disabled]="!title || isSubmitting"
          (click)="save()"
        >
          <mat-spinner diameter="20" *ngIf="isSubmitting"></mat-spinner>
          <span *ngIf="!isSubmitting">حفظ</span>
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .dialog-container {
        padding: 24px;
        min-width: 400px;
        background: white;
        border-radius: 24px;
      }
      .dialog-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 20px;
      }
      .dialog-header mat-icon {
        font-size: 28px;
        width: 28px;
        height: 28px;
        color: #0f3460;
      }
      .dialog-header h2 {
        margin: 0;
        font-size: 20px;
        font-weight: 600;
        color: #1e293b;
      }
      .dialog-content {
        padding: 16px 0;
      }
      .full-width {
        width: 100%;
        margin-bottom: 16px;
      }
      .dialog-actions {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        margin-top: 20px;
        padding-top: 16px;
        border-top: 1px solid #e2e8f0;
      }
      .dialog-actions button {
        min-width: 100px;
      }
      @media (max-width: 500px) {
        .dialog-container {
          min-width: 300px;
          padding: 16px;
        }
        .dialog-actions {
          flex-direction: column-reverse;
        }
        .dialog-actions button {
          width: 100%;
        }
      }
    `,
  ],
})
export class AddEnrollmentTypeDialogComponent {
  title: string = '';
  description: string = '';
  isSubmitting: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<AddEnrollmentTypeDialogComponent>,
    private enrollmentService: EnrollmentService,
    private notification: NotificationService,
  ) {}

  cancel(): void {
    this.dialogRef.close({ success: false });
  }

  save(): void {
    if (!this.title) {
      this.notification.showWarning('يرجى إدخال نوع التسجيل');
      return;
    }
    this.isSubmitting = true;
    this.enrollmentService
      .createEnrollmentType({
        title: this.title,
        description: this.description,
      })
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.dialogRef.close({ success: true, title: this.title });
        },
        error: (err) => {
          console.error('Error creating enrollment type:', err);
          this.notification.showError(
            err.error?.messageEn || 'حدث خطأ في إضافة نوع التسجيل',
          );
          this.isSubmitting = false;
        },
      });
  }
}