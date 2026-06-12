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
import { PlaceService } from '../../../../../../core/services/place.service';
import { NotificationService } from '../../../../../../core/services/notification.service';
import { SearchableSelectComponent, SelectOption } from '../../../../../../shared/components/searchable-select/searchable-select.component';

interface PlaceOption extends SelectOption {
  placeData?: {
    title: string;
    rentValue?: number;
  };
}

@Component({
  selector: 'app-place-rent-payment-wizard-modal',
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
  templateUrl: './place-rent-payment-wizard-modal.component.html',
  styleUrls: ['./place-rent-payment-wizard-modal.component.css']
})
export class PlaceRentPaymentWizardModalComponent implements OnInit {
  paymentForm: FormGroup;
  isEditMode = false;
  paymentId?: number;
  isLoading = false;
  isSubmitting = false;
  
  // Data collections
  places: any[] = [];
  rentTypes: any[] = [];
  paymentMethods: any[] = [];
  
  // Options for selects
  placeOptions: PlaceOption[] = [];
  rentTypeOptions: SelectOption[] = [];
  paymentMethodOptions: SelectOption[] = [];
  
  // Selected data for display
  selectedPlace: any = null;
  
  // Wizard steps
  currentStep = 0;
  steps = [
    { label: 'اختر الموقع', icon: 'location_on', completed: false },
    { label: 'تفاصيل الدفعة', icon: 'payments', completed: false },
    { label: 'معلومات الدفع', icon: 'credit_card', completed: false },
    { label: 'تأكيد', icon: 'check_circle', completed: false }
  ];

  constructor(
    private fb: FormBuilder,
    private financialService: FinancialService,
    private placeService: PlaceService,
    private notification: NotificationService,
    private dialogRef: MatDialogRef<PlaceRentPaymentWizardModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.paymentId = data?.paymentId;
    this.isEditMode = !!this.paymentId;
    
    this.paymentForm = this.fb.group({
      placeId: [null, Validators.required],
      placeTitle: [{ value: null, disabled: true }],
      rentAmount: [null, [Validators.required, Validators.min(1)]],
      payedAmount: [null, [Validators.required, Validators.min(1)]],
      remainedAmount: [{ value: null, disabled: true }],
      rentTypeId: [null],
      paymentDate: [new Date(), Validators.required],
      paymentMethodId: [null],
      note: ['']
    });
  }

  ngOnInit() {
    this.loadPlaces();
    this.loadRentTypes();
    this.loadPaymentMethods();
    
    if (this.isEditMode) {
      this.loadPaymentData();
    }
    
    // Subscribe to payed amount changes
    this.paymentForm.get('payedAmount')?.valueChanges.subscribe(() => {
      this.calculateRemained();
    });
  }

  loadPlaces() {
    this.isLoading = true;
    this.placeService.getAllPlacesLookup().subscribe({
      next: (res: any) => {
        this.places = res.list || [];
        this.placeOptions = this.places.map((p: any) => ({ 
          value: p.id, 
          label: p.title,
          placeData: {
            title: p.title,
            rentValue: p.rentValue
          }
        }));
        this.isLoading = false;
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل المواقع');
        this.isLoading = false;
      }
    });
  }

  loadRentTypes() {
    this.financialService.getAllRentTypesLookup().subscribe({
      next: (res: any) => {
        this.rentTypes = res.list || [];
        this.rentTypeOptions = [
          { value: null, label: '-- اختر --' },
          ...this.rentTypes.map((r: any) => ({ value: r.id, label: r.title }))
        ];
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل أنواع الإيجار');
      }
    });
  }

  loadPaymentMethods() {
    this.financialService.getAllPaymentMethodsLookup().subscribe({
      next: (res: any) => {
        this.paymentMethods = res.list || [];
        this.paymentMethodOptions = [
          { value: null, label: '-- اختر --' },
          ...this.paymentMethods.map((p: any) => ({ value: p.id, label: p.title }))
        ];
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل طرق الدفع');
      }
    });
  }

  loadPaymentData() {
    this.isLoading = true;
    this.financialService.getPlaceRentPaymentById(this.paymentId!).subscribe({
      next: (res: any) => {
        this.paymentForm.patchValue({
          placeId: res.place?.id,
          placeTitle: res.place?.title,
          rentAmount: res.rentAmount,
          payedAmount: res.payedAmount,
          remainedAmount: res.remainedAmount,
          rentTypeId: res.rentType?.id,
          paymentDate: new Date(res.paymentDate),
          paymentMethodId: res.paymentMethod?.id,
          note: res.note
        });
        
        // Find selected place
        const selected = this.placeOptions.find(p => p.value === res.place?.id);
        if (selected && selected.placeData) {
          this.selectedPlace = {
            title: selected.placeData.title,
            rentValue: selected.placeData.rentValue
          };
        }
        
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

  onPlaceSelect() {
    const placeId = this.paymentForm.get('placeId')?.value;
    const selected = this.placeOptions.find(p => p.value === placeId);
    
    if (selected && selected.placeData) {
      this.selectedPlace = {
        title: selected.placeData.title,
        rentValue: selected.placeData.rentValue
      };
      
      // Auto-fill rent amount if available
      if (selected.placeData.rentValue) {
        this.paymentForm.patchValue({ 
          rentAmount: selected.placeData.rentValue 
        });
      }
      this.calculateRemained();
    } else {
      this.selectedPlace = null;
      this.paymentForm.patchValue({ 
        rentAmount: null
      });
    }
  }

  calculateRemained() {
    const rentAmount = this.paymentForm.get('rentAmount')?.value || 0;
    const payedAmount = this.paymentForm.get('payedAmount')?.value || 0;
    
    // Validate that payed amount doesn't exceed rent amount
    if (payedAmount > rentAmount && rentAmount > 0) {
      this.paymentForm.get('payedAmount')?.setErrors({ exceedsRent: true });
      this.notification.showWarning('المبلغ المدفوع لا يمكن أن يتجاوز قيمة الإيجار');
      return;
    } else {
      this.paymentForm.get('payedAmount')?.setErrors(null);
    }
    
    const remained = rentAmount - payedAmount;
    this.paymentForm.get('remainedAmount')?.setValue(remained >= 0 ? remained : 0);
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
        return this.paymentForm.get('placeId')?.valid === true;
      case 1:
        return this.paymentForm.get('rentAmount')?.valid === true && 
               this.paymentForm.get('payedAmount')?.valid === true &&
               this.paymentForm.get('paymentDate')?.valid === true;
      default:
        return true;
    }
  }

  markCurrentStepFieldsAsTouched() {
    switch(this.currentStep) {
      case 0:
        this.paymentForm.get('placeId')?.markAsTouched();
        break;
      case 1:
        this.paymentForm.get('rentAmount')?.markAsTouched();
        this.paymentForm.get('payedAmount')?.markAsTouched();
        this.paymentForm.get('paymentDate')?.markAsTouched();
        break;
      case 2:
        this.paymentForm.get('paymentMethodId')?.markAsTouched();
        break;
    }
  }

  getRentAmount(): number {
    return this.paymentForm.get('rentAmount')?.value || 0;
  }

  getPayedAmount(): number {
    return this.paymentForm.get('payedAmount')?.value || 0;
  }

  getRemainedAmount(): number {
    return this.paymentForm.get('remainedAmount')?.value || 0;
  }

  getPaymentMethodLabel(): string {
    const methodId = this.paymentForm.get('paymentMethodId')?.value;
    const method = this.paymentMethods.find(m => m.id === methodId);
    return method?.title || 'غير محدد';
  }

  getRentTypeLabel(): string {
    const rentTypeId = this.paymentForm.get('rentTypeId')?.value;
    const rentType = this.rentTypes.find(r => r.id === rentTypeId);
    return rentType?.title || 'غير محدد';
  }

  onSubmit(): void {
    if (this.paymentForm.invalid) {
      this.notification.showWarning('يرجى تعبئة جميع الحقول المطلوبة في الخطوات السابقة');
      return;
    }

    const payedAmount = this.paymentForm.get('payedAmount')?.value;
    const rentAmount = this.paymentForm.get('rentAmount')?.value;
    
    if (payedAmount > rentAmount && rentAmount > 0) {
      this.notification.showWarning('المبلغ المدفوع لا يمكن أن يتجاوز قيمة الإيجار');
      return;
    }
    
    const paymentData = {
      placeId: this.paymentForm.get('placeId')?.value,
      rentAmount: rentAmount,
      payedAmount: payedAmount,
      remainedAmount: this.getRemainedAmount(),
      rentTypeId: this.paymentForm.get('rentTypeId')?.value,
      paymentDate: this.paymentForm.get('paymentDate')?.value,
      paymentMethodId: this.paymentForm.get('paymentMethodId')?.value,
      note: this.paymentForm.get('note')?.value
    };

    console.log('Submitting payment data:', paymentData);

    this.isSubmitting = true;

    if (this.isEditMode && this.paymentId) {
      this.financialService.updatePlaceRentPayment(this.paymentId, paymentData as any).subscribe({
        next: () => {
          this.notification.showSuccess('تم تحديث دفعة الإيجار بنجاح');
          this.dialogRef.close(true);
          this.isSubmitting = false;
        },
        error: (err) => {
          console.error('Update error:', err);
          this.notification.showError(err.error?.messageEn || 'حدث خطأ في تحديث دفعة الإيجار');
          this.isSubmitting = false;
        }
      });
    } else {
      this.financialService.createPlaceRentPayment(paymentData as any).subscribe({
        next: () => {
          this.notification.showSuccess('تم إضافة دفعة الإيجار بنجاح');
          this.dialogRef.close(true);
          this.isSubmitting = false;
        },
        error: (err) => {
          console.error('Create error:', err);
          this.notification.showError(err.error?.messageEn || 'حدث خطأ في إضافة دفعة الإيجار');
          this.isSubmitting = false;
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}