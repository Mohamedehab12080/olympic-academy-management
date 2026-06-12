import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDividerModule } from '@angular/material/divider';

import { PlaceService } from '../../../../core/services/place.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-place-wizard-modal',
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
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatStepperModule,
    MatDividerModule
  ],
  templateUrl: './place-wizard-modal.component.html',
  styleUrls: ['./place-wizard-modal.component.css']
})
export class PlaceWizardModalComponent implements OnInit {
  placeForm: FormGroup;
  isEditMode = false;
  placeId?: number;
  isLoading = false;
  isSubmitting = false;
  
  // Wizard steps
  currentStep = 0;
  steps = [
    { label: 'المعلومات الأساسية', icon: 'info', completed: false },
    { label: 'المعلومات المالية', icon: 'payments', completed: false },
    { label: 'تأكيد', icon: 'check_circle', completed: false }
  ];

  constructor(
    private fb: FormBuilder,
    private placeService: PlaceService,
    private notification: NotificationService,
    private dialogRef: MatDialogRef<PlaceWizardModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.placeId = data?.placeId;
    this.isEditMode = !!this.placeId;
    
    this.placeForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      address: [''],
      phoneNumber: ['', Validators.pattern(/^[0-9+\-\s]+$/)],
      rentValue: [null, [Validators.min(0)]],
      remainedValue: [null, [Validators.min(0)]]
    });
  }

  ngOnInit() {
    if (this.isEditMode) {
      this.loadPlaceData();
    }
  }

  loadPlaceData() {
    this.isLoading = true;
    this.placeService.getPlaceById(this.placeId!).subscribe({
      next: (place: any) => {
        this.placeForm.patchValue({
          title: place.title,
          address: place.address,
          phoneNumber: place.phoneNumber,
          rentValue: place.rentValue,
          remainedValue: place.remainedValue
        });
        
        // Mark steps as completed for edit mode
        this.steps.forEach(step => step.completed = true);
        this.currentStep = 2;
        
        this.isLoading = false;
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل بيانات الموقع');
        this.isLoading = false;
      }
    });
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
        return this.placeForm.get('title')?.valid === true;
      case 1:
        return true; // Financial info is optional
      default:
        return true;
    }
  }

  markCurrentStepFieldsAsTouched() {
    switch(this.currentStep) {
      case 0:
        this.placeForm.get('title')?.markAsTouched();
        break;
    }
  }

  getTitle(): string {
    return this.placeForm.get('title')?.value || '';
  }

  getAddress(): string {
    return this.placeForm.get('address')?.value || '';
  }

  getPhoneNumber(): string {
    return this.placeForm.get('phoneNumber')?.value || '';
  }

  getRentValue(): number {
    return this.placeForm.get('rentValue')?.value || 0;
  }

  getRemainedValue(): number {
    return this.placeForm.get('remainedValue')?.value || 0;
  }

  onSubmit(): void {
    if (this.placeForm.invalid) {
      this.notification.showWarning('يرجى تعبئة جميع الحقول المطلوبة');
      return;
    }

    const formData = {
      title: this.placeForm.get('title')?.value,
      address: this.placeForm.get('address')?.value,
      phoneNumber: this.placeForm.get('phoneNumber')?.value,
      rentValue: this.placeForm.get('rentValue')?.value,
      remainedValue: this.placeForm.get('remainedValue')?.value
    };

    this.isSubmitting = true;

    if (this.isEditMode && this.placeId) {
      this.placeService.updatePlace(this.placeId, formData).subscribe({
        next: () => {
          this.notification.showSuccess('تم تحديث الموقع بنجاح');
          this.dialogRef.close(true);
          this.isSubmitting = false;
        },
        error: () => {
          this.notification.showError('حدث خطأ في تحديث الموقع');
          this.isSubmitting = false;
        }
      });
    } else {
      this.placeService.createPlace(formData).subscribe({
        next: () => {
          this.notification.showSuccess('تم إضافة الموقع بنجاح');
          this.dialogRef.close(true);
          this.isSubmitting = false;
        },
        error: () => {
          this.notification.showError('حدث خطأ في إضافة الموقع');
          this.isSubmitting = false;
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}