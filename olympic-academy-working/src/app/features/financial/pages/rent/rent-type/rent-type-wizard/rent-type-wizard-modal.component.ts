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
import { MatDividerModule } from '@angular/material/divider';

import { FinancialService } from '../../../../../../core/services/financial.service';
import { NotificationService } from '../../../../../../core/services/notification.service';

@Component({
  selector: 'app-rent-type-wizard-modal',
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
    MatDividerModule
  ],
  templateUrl: './rent-type-wizard-modal.component.html',
  styleUrls: ['./rent-type-wizard-modal.component.css']
})
export class RentTypeWizardModalComponent implements OnInit {
  typeForm: FormGroup;
  isEditMode = false;
  typeId?: number;
  isLoading = false;
  isSubmitting = false;
  typeName: string = '';

  // Wizard steps
  currentStep = 0;
  steps = [
    { label: 'معلومات النوع', icon: 'info', completed: false },
    { label: 'تأكيد', icon: 'check_circle', completed: false }
  ];

  constructor(
    private fb: FormBuilder,
    private financialService: FinancialService,
    private notification: NotificationService,
    private dialogRef: MatDialogRef<RentTypeWizardModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.typeId = data?.typeId;
    this.isEditMode = !!this.typeId;
    
    this.typeForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      description: ['']
    });
  }

  ngOnInit() {
    if (this.isEditMode) {
      this.loadTypeData();
    }
  }

  loadTypeData() {
    this.isLoading = true;
    this.financialService.getRentTypeById(this.typeId!).subscribe({
      next: (res: any) => {
        this.typeForm.patchValue({
          title: res.title,
          description: res.description
        });
        this.typeName = res.title;
        
        // Mark steps as completed for edit mode
        this.steps.forEach(step => step.completed = true);
        this.currentStep = 1;
        
        this.isLoading = false;
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل بيانات النوع');
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
        return this.typeForm.get('title')?.valid === true;
      default:
        return true;
    }
  }

  markCurrentStepFieldsAsTouched() {
    switch(this.currentStep) {
      case 0:
        this.typeForm.get('title')?.markAsTouched();
        break;
    }
  }

  getTitle(): string {
    return this.typeForm.get('title')?.value || '';
  }

  getDescription(): string {
    return this.typeForm.get('description')?.value || '';
  }

  onSubmit(): void {
    if (this.typeForm.invalid) {
      this.notification.showWarning('يرجى تعبئة جميع الحقول المطلوبة');
      return;
    }

    const typeData = {
      title: this.typeForm.get('title')?.value,
      description: this.typeForm.get('description')?.value
    };

    console.log('Submitting type data:', typeData);

    this.isSubmitting = true;

    if (this.isEditMode && this.typeId) {
      this.financialService.updateRentType(this.typeId, typeData as any).subscribe({
        next: () => {
          this.notification.showSuccess('تم تحديث نوع الإيجار بنجاح');
          this.dialogRef.close(true);
          this.isSubmitting = false;
        },
        error: (err) => {
          console.error('Update error:', err);
          this.notification.showError(err.error?.messageEn || 'حدث خطأ في تحديث نوع الإيجار');
          this.isSubmitting = false;
        }
      });
    } else {
      this.financialService.createRentType(typeData as any).subscribe({
        next: () => {
          this.notification.showSuccess('تم إضافة نوع الإيجار بنجاح');
          this.dialogRef.close(true);
          this.isSubmitting = false;
        },
        error: (err) => {
          console.error('Create error:', err);
          this.notification.showError(err.error?.messageEn || 'حدث خطأ في إضافة نوع الإيجار');
          this.isSubmitting = false;
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}