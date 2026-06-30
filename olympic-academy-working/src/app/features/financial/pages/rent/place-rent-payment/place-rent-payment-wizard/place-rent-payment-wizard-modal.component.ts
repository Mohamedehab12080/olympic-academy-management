import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
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
import { Subject, takeUntil, debounceTime, distinctUntilChanged, forkJoin } from 'rxjs';

import { FinancialService } from '../../../../../../core/services/financial.service';
import { PlaceService } from '../../../../../../core/services/place.service';
import { NotificationService } from '../../../../../../core/services/notification.service';
import { SearchableSelectComponent, SelectOption } from '../../../../../../shared/components/searchable-select/searchable-select.component';
import { PlaceListItem, PlaceResultSet } from '../../../../../../core/models/place.model';

interface PlaceOption extends SelectOption {
  placeData?: {
    id: number;
    title: string;
    rentValue: number;
    remainedValue: number;
    address?: string;
    phoneNumber?: string;
  };
}

interface WizardStep {
  label: string;
  icon: string;
  completed: boolean;
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
export class PlaceRentPaymentWizardModalComponent implements OnInit, OnDestroy {
  
  // ==========================================================================
  // FORM
  // ==========================================================================

  paymentForm: FormGroup;
  
  // ==========================================================================
  // STATE
  // ==========================================================================

  isEditMode = false;
  paymentId?: number;
  isLoading = false;
  isSubmitting = false;
  currentStep = 0;
  private destroy$ = new Subject<void>();
  
  // ==========================================================================
  // DATA COLLECTIONS
  // ==========================================================================

  places: PlaceListItem[] = [];
  rentTypes: any[] = [];
  paymentMethods: any[] = [];
  
  // ==========================================================================
  // OPTIONS FOR SELECTS
  // ==========================================================================

  placeOptions: PlaceOption[] = [];
  rentTypeOptions: SelectOption[] = [];
  paymentMethodOptions: SelectOption[] = [];
  
  // ==========================================================================
  // SELECTED DATA
  // ==========================================================================

  selectedPlace: PlaceListItem | null = null;
  maxPayableAmount: number = 0;
  
  // ==========================================================================
  // WIZARD STEPS
  // ==========================================================================

  steps: WizardStep[] = [
    { label: 'اختر الموقع', icon: 'location_on', completed: false },
    { label: 'تفاصيل الدفعة', icon: 'payments', completed: false },
    { label: 'معلومات الدفع', icon: 'credit_card', completed: false },
    { label: 'تأكيد', icon: 'check_circle', completed: false }
  ];

  // ==========================================================================
  // CONSTRUCTOR
  // ==========================================================================

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
    
    this.paymentForm = this.createForm();
  }

  // ==========================================================================
  // LIFECYCLE HOOKS
  // ==========================================================================

  ngOnInit() {
    this.loadRentTypes();
    this.loadPaymentMethods();
    this.setupFormSubscriptions();
    
    if (this.isEditMode) {
      // Load places and payment data together
      this.loadEditData();
    } else {
      // Just load places for new mode
      this.loadPlaces();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ==========================================================================
  // FORM CREATION
  // ==========================================================================

  private createForm(): FormGroup {
    return this.fb.group({
      placeId: [null, Validators.required],
      placeTitle: [{ value: null, disabled: true }],
      placeAddress: [{ value: null, disabled: true }],
      placeRemainedRent: [{ value: null, disabled: true }],
      rentAmount: [{ value: null, disabled: true }],
      payedAmount: [null, [Validators.required, Validators.min(1)]],
      remainedAmount: [{ value: null, disabled: true }],
      rentTypeId: [null],
      paymentDate: [new Date(), Validators.required],
      paymentMethodId: [null, Validators.required],
      note: ['']
    });
  }

  // ==========================================================================
  // FORM SUBSCRIPTIONS
  // ==========================================================================

  private setupFormSubscriptions(): void {
    // Subscribe to payed amount changes
    this.paymentForm.get('payedAmount')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.calculateRemained();
      });
  }

  // ==========================================================================
  // DATA LOADING
  // ==========================================================================

  loadPlaces() {
    this.isLoading = true;
    this.placeService.getAllPlacesDetailsByFilter({})
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: PlaceResultSet) => {
          this.places = res.items || [];
          this.placeOptions = this.places.map((p: PlaceListItem) => ({ 
            value: p.id, 
            label: `${p.title} - (الإيجار: ${p.rentValue || 0} جم / المتبقي: ${p.remainedValue || 0} جم)`,
            placeData: {
              id: p.id,
              title: p.title,
              rentValue: p.rentValue || 0,
              remainedValue: p.remainedValue || 0,
              address: p.address,
              phoneNumber: p.phoneNumber
            }
          }));
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading places:', err);
          this.notification.showError('حدث خطأ في تحميل المواقع');
          this.isLoading = false;
        }
      });
  }

  loadRentTypes() {
    this.financialService.getAllRentTypesLookup()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
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
    this.financialService.getAllPaymentMethodsLookup()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
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

  // ==========================================================================
  // LOAD EDIT DATA (Edit Mode)
  // ==========================================================================

  private loadEditData(): void {
    this.isLoading = true;
    
    // Load places first, then load payment data
    this.placeService.getAllPlacesDetailsByFilter({})
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: PlaceResultSet) => {
          this.places = res.items || [];
          this.placeOptions = this.places.map((p: PlaceListItem) => ({ 
            value: p.id, 
            label: `${p.title} - (الإيجار: ${p.rentValue || 0} جم / المتبقي: ${p.remainedValue || 0} جم)`,
            placeData: {
              id: p.id,
              title: p.title,
              rentValue: p.rentValue || 0,
              remainedValue: p.remainedValue || 0,
              address: p.address,
              phoneNumber: p.phoneNumber
            }
          }));
          
          // Now load payment data
          this.loadPaymentData();
        },
        error: (err) => {
          console.error('Error loading places for edit:', err);
          this.notification.showError('حدث خطأ في تحميل المواقع');
          this.isLoading = false;
        }
      });
  }

  private loadPaymentData(): void {
    this.financialService.getPlaceRentPaymentById(this.paymentId!)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          console.log('Payment data loaded:', res);
          
          // Find the place from the loaded places list
          const place = this.places.find(p => p.id === res.place?.id);
          
          if (place) {
            this.selectedPlace = place;
            this.maxPayableAmount = place.remainedValue || 0;
            
            // Set all form values including the placeId
            this.paymentForm.patchValue({
              placeId: place.id,
              placeTitle: place.title,
              placeAddress: place.address || '',
              placeRemainedRent: place.remainedValue || 0,
              rentAmount: place.rentValue || 0,
              payedAmount: res.payedAmount,
              remainedAmount: res.remainedAmount,
              rentTypeId: res.rentType?.id,
              paymentDate: new Date(res.paymentDate),
              paymentMethodId: res.paymentMethod?.id,
              note: res.note || ''
            });
            
            // Set max validator for payed amount
            const payedControl = this.paymentForm.get('payedAmount');
            if (payedControl) {
              payedControl.setValidators([
                Validators.required,
                Validators.min(1),
                Validators.max(this.maxPayableAmount || 0)
              ]);
              payedControl.updateValueAndValidity();
            }
          } else {
            // If place not found in the list, try to use the data from the payment response
            this.selectedPlace = {
              id: res.place?.id || 0,
              title: res.place?.title || 'غير محدد',
              rentValue: res.rentAmount || 0,
              remainedValue: res.remainedAmount || 0,
              address: res.place?.address || '',
              phoneNumber: res.place?.phoneNumber || ''
            };
            
            this.maxPayableAmount = res.remainedAmount || 0;
            
            this.paymentForm.patchValue({
              placeId: res.place?.id,
              placeTitle: res.place?.title || 'غير محدد',
              placeAddress: res.place?.address || '',
              placeRemainedRent: res.remainedAmount || 0,
              rentAmount: res.rentAmount || 0,
              payedAmount: res.payedAmount,
              remainedAmount: res.remainedAmount,
              rentTypeId: res.rentType?.id,
              paymentDate: new Date(res.paymentDate),
              paymentMethodId: res.paymentMethod?.id,
              note: res.note || ''
            });
          }
          
          // Mark steps as completed for edit mode
          this.steps.forEach(step => step.completed = true);
          this.currentStep = 3;
          
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading payment data:', err);
          this.notification.showError('حدث خطأ في تحميل بيانات الدفعة');
          this.isLoading = false;
        }
      });
  }

  // ==========================================================================
  // PLACE SELECTION
  // ==========================================================================

  onPlaceSelect() {
    const placeId = this.paymentForm.get('placeId')?.value;
    const selected = this.placeOptions.find(p => p.value === placeId);
    
    if (selected && selected.placeData) {
      this.selectedPlace = {
        id: selected.placeData.id,
        title: selected.placeData.title,
        rentValue: selected.placeData.rentValue,
        remainedValue: selected.placeData.remainedValue,
        address: selected.placeData.address,
        phoneNumber: selected.placeData.phoneNumber
      };
      
      this.maxPayableAmount = selected.placeData.remainedValue || 0;
      
      // Check if remained rent is zero
      if (this.maxPayableAmount === 0) {
        this.notification.showWarning('لا يوجد إيجار متبقي لهذا الموقع - لا يمكن إجراء دفعة');
      }
      
      // Auto-fill rent amount and place details
      this.paymentForm.patchValue({
        placeTitle: selected.placeData.title,
        placeAddress: selected.placeData.address || '',
        placeRemainedRent: selected.placeData.remainedValue || 0,
        rentAmount: selected.placeData.rentValue || 0,
        payedAmount: null,
        remainedAmount: selected.placeData.remainedValue || 0
      });
      
      // Set max validator for payed amount
      const payedControl = this.paymentForm.get('payedAmount');
      if (payedControl) {
        payedControl.setValidators([
          Validators.required,
          Validators.min(1),
          Validators.max(this.maxPayableAmount || 0)
        ]);
        payedControl.updateValueAndValidity();
      }
      
      this.calculateRemained();
    } else {
      this.clearPlaceSelection();
    }
  }

  private clearPlaceSelection(): void {
    this.selectedPlace = null;
    this.maxPayableAmount = 0;
    this.paymentForm.patchValue({
      placeTitle: null,
      placeAddress: null,
      placeRemainedRent: null,
      rentAmount: null,
      payedAmount: null,
      remainedAmount: null
    });
  }

  // ==========================================================================
  // CALCULATIONS
  // ==========================================================================

  calculateRemained() {
    const rentAmount = this.paymentForm.get('rentAmount')?.value || 0;
    const payedAmount = this.paymentForm.get('payedAmount')?.value || 0;
    const remainedRent = this.paymentForm.get('placeRemainedRent')?.value || 0;
    
    // Check if payed amount exceeds remaining rent
    if (payedAmount > remainedRent && remainedRent > 0) {
      this.paymentForm.get('payedAmount')?.setErrors({ exceedsRemained: true });
      this.notification.showWarning(`المبلغ المدفوع لا يمكن أن يتجاوز الإيجار المتبقي (${remainedRent} جم)`);
      return;
    }
    
    // Check if payed amount exceeds rent amount (should be prevented by remained check)
    if (payedAmount > rentAmount && rentAmount > 0) {
      this.paymentForm.get('payedAmount')?.setErrors({ exceedsRent: true });
      this.notification.showWarning('المبلغ المدفوع لا يمكن أن يتجاوز قيمة الإيجار');
      return;
    } else {
      this.paymentForm.get('payedAmount')?.setErrors(null);
    }
    
    const remained = remainedRent - payedAmount;
    this.paymentForm.get('remainedAmount')?.setValue(remained >= 0 ? remained : 0);
  }

  // ==========================================================================
  // CHECK IF PAYMENT IS ALLOWED
  // ==========================================================================

  isPaymentAllowed(): boolean {
    return this.maxPayableAmount > 0;
  }

  // ==========================================================================
  // STEP NAVIGATION
  // ==========================================================================

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
        return this.paymentForm.get('placeId')?.valid === true && this.isPaymentAllowed();
      case 1:
        const payedAmount = this.paymentForm.get('payedAmount')?.value;
        const remainedRent = this.paymentForm.get('placeRemainedRent')?.value;
        return this.paymentForm.get('payedAmount')?.valid === true && 
               this.paymentForm.get('paymentDate')?.valid === true &&
               payedAmount <= remainedRent;
      case 2:
        return this.paymentForm.get('paymentMethodId')?.valid === true;
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
        this.paymentForm.get('payedAmount')?.markAsTouched();
        this.paymentForm.get('paymentDate')?.markAsTouched();
        break;
      case 2:
        this.paymentForm.get('paymentMethodId')?.markAsTouched();
        break;
    }
  }

  // ==========================================================================
  // GETTER METHODS
  // ==========================================================================

  getRentAmount(): number {
    return this.paymentForm.get('rentAmount')?.value || 0;
  }

  getPayedAmount(): number {
    return this.paymentForm.get('payedAmount')?.value || 0;
  }

  getRemainedAmount(): number {
    return this.paymentForm.get('remainedAmount')?.value || 0;
  }

  getPlaceRemainedRent(): number {
    return this.paymentForm.get('placeRemainedRent')?.value || 0;
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

  getPlaceName(): string {
    return this.selectedPlace?.title || '';
  }

  getPlaceAddress(): string {
    return this.selectedPlace?.address || '';
  }

  getPlacePhone(): string {
    return this.selectedPlace?.phoneNumber || '';
  }

  // ==========================================================================
  // SUBMIT
  // ==========================================================================

  onSubmit(): void {
    if (this.paymentForm.invalid) {
      this.notification.showWarning('يرجى تعبئة جميع الحقول المطلوبة في الخطوات السابقة');
      return;
    }

    const payedAmount = this.paymentForm.get('payedAmount')?.value;
    const remainedRent = this.paymentForm.get('placeRemainedRent')?.value;
    
    if (payedAmount > remainedRent && remainedRent > 0) {
      this.notification.showWarning(`المبلغ المدفوع لا يمكن أن يتجاوز الإيجار المتبقي (${remainedRent} جم)`);
      return;
    }
    
    if (!this.isPaymentAllowed()) {
      this.notification.showWarning('لا يمكن إجراء دفعة حيث أن الإيجار المتبقي صفر');
      return;
    }
    
    const paymentData = this.buildPaymentData();
    console.log('Submitting payment data:', paymentData);

    this.isSubmitting = true;

    const request$ = this.isEditMode && this.paymentId
      ? this.financialService.updatePlaceRentPayment(this.paymentId, paymentData)
      : this.financialService.createPlaceRentPayment(paymentData);

    request$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        const message = this.isEditMode 
          ? 'تم تحديث دفعة الإيجار بنجاح' 
          : 'تم إضافة دفعة الإيجار بنجاح';
        this.notification.showSuccess(message);
        this.dialogRef.close(true);
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('Submit error:', err);
        this.notification.showError(err.error?.messageEn || 'حدث خطأ في حفظ دفعة الإيجار');
        this.isSubmitting = false;
      }
    });
  }

  private buildPaymentData(): any {
    const paymentDate = this.paymentForm.get('paymentDate')?.value;
    
    return {
      placeId: this.paymentForm.get('placeId')?.value,
      rentAmount: this.paymentForm.get('rentAmount')?.value,
      payedAmount: this.paymentForm.get('payedAmount')?.value,
      remainedAmount: this.getRemainedAmount(),
      rentTypeId: this.paymentForm.get('rentTypeId')?.value,
      paymentDate: this.formatDate(paymentDate),
      paymentMethodId: this.paymentForm.get('paymentMethodId')?.value,
      note: this.paymentForm.get('note')?.value
    };
  }

  private formatDate(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // ==========================================================================
  // CANCEL
  // ==========================================================================

  onCancel(): void {
    this.dialogRef.close(false);
  }
}