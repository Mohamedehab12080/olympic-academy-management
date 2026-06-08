import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PlaceService } from '../../../../core/services/place.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-place-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <div class="form-header">
          <button mat-icon-button routerLink="/places">
            <mat-icon>arrow_forward</mat-icon>
          </button>
          <h2>{{ isEditMode ? 'تعديل موقع' : 'إضافة موقع جديد' }}</h2>
        </div>

        <form [formGroup]="placeForm" (ngSubmit)="onSubmit()">
          <div class="form-body">
            <div class="form-grid">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>اسم الموقع *</mat-label>
                <input matInput formControlName="title" placeholder="أدخل اسم الموقع">
                <mat-error *ngIf="placeForm.get('title')?.hasError('required')">
                  اسم الموقع مطلوب
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>العنوان</mat-label>
                <input matInput formControlName="address" placeholder="أدخل عنوان الموقع">
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>رقم الهاتف</mat-label>
                <input matInput formControlName="phoneNumber" placeholder="أدخل رقم الهاتف">
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>قيمة الإيجار</mat-label>
                <input matInput type="number" formControlName="rentValue" placeholder="أدخل قيمة الإيجار">
                <span matSuffix>جم</span>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>القيمة المتبقية</mat-label>
                <input matInput type="number" formControlName="remainedValue" placeholder="أدخل القيمة المتبقية">
                <span matSuffix>جم</span>
              </mat-form-field>
            </div>
          </div>

          <div class="form-actions">
            <button mat-raised-button color="primary" type="submit" [disabled]="placeForm.invalid || isLoading">
              <mat-icon>save</mat-icon> {{ isEditMode ? 'تحديث' : 'حفظ' }}
            </button>
            <button mat-stroked-button type="button" routerLink="/places">
              <mat-icon>close</mat-icon> إلغاء
            </button>
          </div>
        </form>

        <div class="loading-overlay" *ngIf="isLoading">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .form-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 24px;
    }

    .form-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
      padding: 0 16px;
    }

    .form-header h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }

    .form-body {
      padding: 0 16px;
    }

    .form-grid {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .full-width {
      width: 100%;
    }

    .form-actions {
      display: flex;
      gap: 16px;
      margin-top: 32px;
      padding: 16px;
      justify-content: flex-end;
      border-top: 1px solid #e5e7eb;
    }

    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 16px;
    }

    @media (max-width: 768px) {
      .form-container {
        padding: 16px;
      }
      
      .form-actions {
        flex-direction: column-reverse;
      }
      
      .form-actions button {
        width: 100%;
      }
    }
  `]
})
export class PlaceFormComponent implements OnInit {
  placeForm: FormGroup;
  isEditMode = false;
  placeId?: number;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private placeService: PlaceService,
    private notification: NotificationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.placeForm = this.fb.group({
      title: ['', Validators.required],
      address: [''],
      phoneNumber: [''],
      rentValue: [null],
      remainedValue: [null]
    });
  }

  ngOnInit(): void {
    this.placeId = this.route.snapshot.params['id'];
    if (this.placeId) {
      this.isEditMode = true;
      this.loadPlace();
    }
  }

  loadPlace(): void {
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
        this.isLoading = false;
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل بيانات الموقع');
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.placeForm.invalid) {
      this.notification.showWarning('يرجى تعبئة جميع الحقول المطلوبة');
      return;
    }

    this.isLoading = true;
    const formData = this.placeForm.value;

    if (this.isEditMode) {
      this.placeService.updatePlace(this.placeId!, formData).subscribe({
        next: () => {
          this.notification.showSuccess('تم تحديث الموقع بنجاح');
          this.router.navigate(['/places']);
          this.isLoading = false;
        },
        error: () => {
          this.notification.showError('حدث خطأ في تحديث الموقع');
          this.isLoading = false;
        }
      });
    } else {
      this.placeService.createPlace(formData).subscribe({
        next: () => {
          this.notification.showSuccess('تم إضافة الموقع بنجاح');
          this.router.navigate(['/places']);
          this.isLoading = false;
        },
        error: () => {
          this.notification.showError('حدث خطأ في إضافة الموقع');
          this.isLoading = false;
        }
      });
    }
  }
}