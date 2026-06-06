import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FinancialService } from '../../../../../core/services/financial.service';
import { NotificationService } from '../../../../../core/services/notification.service';

@Component({
  selector: 'app-payment-method-form',
  standalone: false,
  template: `
    <div class="form-container">
      <mat-card>
        <div class="form-header">
          <button mat-icon-button routerLink="/financial/payment-methods"><mat-icon>arrow_forward</mat-icon></button>
          <h2>{{ isEditMode ? 'تعديل طريقة دفع' : 'إضافة طريقة دفع جديدة' }}</h2>
        </div>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>اسم طريقة الدفع *</mat-label>
            <input matInput formControlName="title" placeholder="مثال: كاش, بنك, فيزا">
            <mat-error *ngIf="form.get('title')?.hasError('required')">الاسم مطلوب</mat-error>
          </mat-form-field>
          <div class="form-actions">
            <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid"><mat-icon>save</mat-icon> {{ isEditMode ? 'تحديث' : 'حفظ' }}</button>
            <button mat-stroked-button type="button" routerLink="/financial/payment-methods">إلغاء</button>
          </div>
        </form>
      </mat-card>
    </div>
  `,
  styles: [`
    .form-container { max-width: 600px; margin: 0 auto; padding: 24px; }
    .form-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
    .full-width { width: 100%; margin-bottom: 16px; }
    .form-actions { display: flex; gap: 16px; justify-content: flex-end; margin-top: 24px; }
  `]
})
export class PaymentMethodFormComponent implements OnInit {
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
    this.form = this.fb.group({ title: ['', Validators.required] });
  }

  ngOnInit() {
    this.itemId = this.route.snapshot.params['id'];
    if (this.itemId) {
      this.isEditMode = true;
      this.financialService.getPaymentMethodById(this.itemId).subscribe({
        next: (res: any) => { this.form.patchValue(res); },
        error: () => { this.notification.showError('حدث خطأ'); this.router.navigate(['/financial/payment-methods']); }
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) return;
    const data = this.form.value;
    if (this.isEditMode && this.itemId) {
      this.financialService.updatePaymentMethod(this.itemId, data).subscribe({
        next: () => { this.notification.showSuccess('تم التحديث بنجاح'); this.router.navigate(['/financial/payment-methods']); },
        error: () => { this.notification.showError('حدث خطأ'); }
      });
    } else {
      this.financialService.createPaymentMethod(data).subscribe({
        next: () => { this.notification.showSuccess('تم الإضافة بنجاح'); this.router.navigate(['/financial/payment-methods']); },
        error: () => { this.notification.showError('حدث خطأ'); }
      });
    }
  }
}