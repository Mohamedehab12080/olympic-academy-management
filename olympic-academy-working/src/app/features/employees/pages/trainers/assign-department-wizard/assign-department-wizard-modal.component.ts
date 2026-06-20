// assign-department-wizard-modal.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';

import { EmployeeService } from '../../../../../core/services/employee.service';
import { DepartmentService } from '../../../../../core/services/department.service';
import { NotificationService } from '../../../../../core/services/notification.service'; 
import { SearchableSelectComponent, SelectOption } from '../../../../../shared/components/searchable-select/searchable-select.component';
import { AssignDepartmentDTO } from '../../../../../core/models/employee.model';

@Component({
  selector: 'app-assign-department-wizard-modal',
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
    MatProgressSpinnerModule,
    MatDividerModule,
    MatCardModule,
    MatStepperModule,
    SearchableSelectComponent
  ],
  template: `
    <div class="wizard-container">
      <div class="wizard-header">
        <div class="header-title">
          <mat-icon>business</mat-icon>
          <div>
            <h2>إسناد قسم للمدرب</h2>
            <p>اختر المدرب والقسم الذي سيتم إسناده</p>
          </div>
        </div>
        <button mat-icon-button (click)="close()" class="close-btn">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-divider></mat-divider>

      <div class="wizard-content">
        <form [formGroup]="assignForm">
          <!-- Trainer Selection -->
          <div class="form-section">
            <div class="section-label">
              <mat-icon>person</mat-icon>
              <span>المدرب</span>
            </div>
            <div class="form-field full-width">
              <app-searchable-select
                [ngModel]="assignForm.get('trainerId')?.value"
                (ngModelChange)="assignForm.get('trainerId')?.setValue($event)"
                label="اختر المدرب *"
                [options]="trainerOptions"
                [required]="true"
                [ngModelOptions]="{standalone: true}">
              </app-searchable-select>
            </div>
          </div>

          <!-- Department Selection -->
          <div class="form-section">
            <div class="section-label">
              <mat-icon>category</mat-icon>
              <span>القسم</span>
            </div>
            <div class="form-field full-width">
              <app-searchable-select
                [ngModel]="assignForm.get('departmentId')?.value"
                (ngModelChange)="assignForm.get('departmentId')?.setValue($event)"
                label="اختر القسم *"
                [options]="departmentOptions"
                [required]="true"
                [ngModelOptions]="{standalone: true}">
              </app-searchable-select>
            </div>
          </div>

          <!-- Preview Section -->
          <div class="preview-section" *ngIf="selectedTrainer && selectedDepartment">
            <mat-divider></mat-divider>
            <div class="preview-card">
              <h4>تأكيد الإسناد</h4>
              <div class="preview-details">
                <div class="preview-item">
                  <span class="preview-label">المدرب:</span>
                  <span class="preview-value">{{ selectedTrainer.label }}</span>
                </div>
                <div class="preview-item">
                  <span class="preview-label">القسم:</span>
                  <span class="preview-value">{{ selectedDepartment.label }}</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div class="wizard-actions">
        <button mat-button (click)="close()">إلغاء</button>
        <button 
          mat-raised-button 
          color="primary" 
          (click)="submit()" 
          [disabled]="assignForm.invalid || isSubmitting">
          <mat-spinner diameter="20" *ngIf="isSubmitting"></mat-spinner>
          <span *ngIf="!isSubmitting">إسناد القسم</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .wizard-container {
      padding: 24px;
      min-width: 500px;
      max-width: 600px;
      background: white;
      border-radius: 24px;
    }

    .wizard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .header-title {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .header-title mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
      color: #f59e0b;
    }

    .header-title h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: #0f172a;
    }

    .header-title p {
      margin: 4px 0 0;
      font-size: 13px;
      color: #64748b;
    }

    .close-btn {
      color: #94a3b8;
    }

    .close-btn:hover {
      color: #ef4444;
    }

    .wizard-content {
      padding: 20px 0;
      max-height: 60vh;
      overflow-y: auto;
    }

    .form-section {
      margin-bottom: 24px;
    }

    .section-label {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      font-weight: 600;
      color: #0f172a;
      font-size: 15px;
    }

    .section-label mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: #f59e0b;
    }

    .full-width {
      width: 100%;
    }

    .preview-section {
      margin-top: 16px;
    }

    .preview-card {
      background: #f8fafc;
      padding: 16px;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      margin-top: 16px;
    }

    .preview-card h4 {
      margin: 0 0 12px;
      color: #0f172a;
      font-size: 16px;
    }

    .preview-details {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .preview-item {
      display: flex;
      gap: 8px;
    }

    .preview-label {
      font-weight: 600;
      color: #475569;
      min-width: 80px;
    }

    .preview-value {
      color: #0f172a;
    }

    .wizard-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 20px;
      padding-top: 16px;
      border-top: 1px solid #e2e8f0;
    }

    .wizard-actions button {
      min-width: 120px;
    }

    @media (max-width: 640px) {
      .wizard-container {
        min-width: 300px;
        padding: 16px;
      }

      .wizard-actions {
        flex-direction: column-reverse;
      }

      .wizard-actions button {
        width: 100%;
      }
    }
  `]
})
export class AssignDepartmentWizardModalComponent implements OnInit {
  assignForm: FormGroup;
  trainerOptions: SelectOption[] = [];
  departmentOptions: SelectOption[] = [];
  selectedTrainer: SelectOption | null = null;
  selectedDepartment: SelectOption | null = null;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AssignDepartmentWizardModalComponent>,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private notification: NotificationService
  ) {
    this.assignForm = this.fb.group({
      trainerId: [null, Validators.required],
      departmentId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadTrainers();
    this.loadDepartments();

    this.assignForm.get('trainerId')?.valueChanges.subscribe((value) => {
      this.selectedTrainer = this.trainerOptions.find(opt => opt.value === value) || null;
    });

    this.assignForm.get('departmentId')?.valueChanges.subscribe((value) => {
      this.selectedDepartment = this.departmentOptions.find(opt => opt.value === value) || null;
    });
  }

  loadTrainers(): void {
    this.employeeService.getAllTrainersLookup().subscribe({
      next: (res) => {
        this.trainerOptions = (res.list || []).map((item: any) => ({
          value: item.id,
          label: item.title || item.fullName
        }));
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل المدربين');
      }
    });
  }

  loadDepartments(): void {
    this.departmentService.getAllDepartmentsLookup().subscribe({
      next: (res) => {
        this.departmentOptions = (res.list || []).map((item: any) => ({
          value: item.id,
          label: item.title
        }));
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل الأقسام');
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  submit(): void {
    if (this.assignForm.invalid) {
      this.notification.showWarning('يرجى اختيار المدرب والقسم');
      return;
    }

    this.isSubmitting = true;
    const trainerId = this.assignForm.get('trainerId')?.value;
    const departmentId = this.assignForm.get('departmentId')?.value;
    
    // IMPORTANT: Send departmentId as an array, even if it's a single value
    const data: AssignDepartmentDTO = {
      departmentId: [departmentId]  // Wrap in array
    };

    this.employeeService.assignDepartmentToTrainer(trainerId, data).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Error assigning department:', err);
        this.notification.showError(err.error?.messageEn || 'حدث خطأ في إسناد القسم');
        this.isSubmitting = false;
      }
    });
  }
}