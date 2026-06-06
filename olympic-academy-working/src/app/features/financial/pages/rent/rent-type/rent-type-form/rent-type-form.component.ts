import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FinancialService } from '../../../../../../core/services/financial.service';
import { NotificationService } from '../../../../../../core/services/notification.service';

@Component({
  selector: 'app-rent-type-form',
  standalone: false,
  template: `
    <div class="form-container">
      <mat-card>
        <div class="form-header">
          <button mat-icon-button routerLink="/financial/rent-types"><mat-icon>arrow_forward</mat-icon></button>
          <h2>{{ isEditMode ? 'تعديل نوع إيجار' : 'إضافة نوع إيجار جديد' }}</h2>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>اسم نوع الإيجار *</mat-label>
            <input matInput formControlName="title" placeholder="مثال: شهري, سنوي, ربع سنوي">
            <mat-error *ngIf="form.get('title')?.hasError('required')">الاسم مطلوب</mat-error>
          <\/mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>الوصف</mat-label>
            <textarea matInput formControlName="description" rows="3" placeholder="وصف نوع الإيجار..."><\/textarea>
          <\/mat-form-field>

          <div class="form-actions">
            <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">
              <mat-icon>save</mat-icon> {{ isEditMode ? 'تحديث' : 'حفظ' }}
            <\/button>
            <button mat-stroked-button type="button" routerLink="/financial/rent-types">إلغاء<\/button>
          <\/div>
        <\/form>
      <\/mat-card>
    <\/div>
  `,
  styles: [`
    .form-container { max-width: 600px; margin: 0 auto; padding: 24px; }
    .form-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
    .full-width { width: 100%; margin-bottom: 16px; }
    .form-actions { display: flex; gap: 16px; justify-content: flex-end; margin-top: 24px; }
  `]
})
export class RentTypeFormComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  itemId?: number;

  constructor(
    private fb: FormBuilder,
    private financialService: FinancialService,
    private notification: NotificationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit() {
    this.itemId = this.route.snapshot.params['id'];
    if (this.itemId) {
      this.isEditMode = true;
      this.financialService.getRentTypeById(this.itemId).subscribe({
        next: (res: any) => { this.form.patchValue(res); },
        error: () => { this.notification.showError('حدث خطأ'); this.router.navigate(['/financial/rent-types']); }
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) return;
    const data = this.form.value;
    if (this.isEditMode && this.itemId) {
      this.financialService.updateRentType(this.itemId, data).subscribe({
        next: () => { this.notification.showSuccess('تم التحديث بنجاح'); this.router.navigate(['/financial/rent-types']); },
        error: () => { this.notification.showError('حدث خطأ'); }
      });
    } else {
      this.financialService.createRentType(data).subscribe({
        next: () => { this.notification.showSuccess('تم الإضافة بنجاح'); this.router.navigate(['/financial/rent-types']); },
        error: () => { this.notification.showError('حدث خطأ'); }
      });
    }
  }
}