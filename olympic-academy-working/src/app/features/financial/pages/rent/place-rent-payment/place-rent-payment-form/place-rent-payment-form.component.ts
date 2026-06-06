import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FinancialService } from '../../../../../../core/services/financial.service';
import { PlaceService } from '../../../../../../core/services/place.service';
import { NotificationService } from '../../../../../../core/services/notification.service';

@Component({
  selector: 'app-place-rent-payment-form',
  standalone: false,
  template: `
    <div class="form-container">
      <mat-card>
        <div class="form-header">
          <button mat-icon-button routerLink="/financial/place-rent-payments"><mat-icon>arrow_forward</mat-icon></button>
          <h2>{{ isEditMode ? 'تعديل دفعة إيجار' : 'إضافة دفعة إيجار جديدة' }}</h2>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-grid">
            <mat-form-field appearance="outline"><mat-label>الموقع *</mat-label><mat-select formControlName="placeId" (selectionChange)="onPlaceSelect()"><mat-option *ngFor="let p of places" [value]="p.id">{{ p.title }}</mat-option><\/mat-select><\/mat-form-field>
            <mat-form-field appearance="outline"><mat-label>قيمة الإيجار *</mat-label><input matInput type="number" formControlName="rentAmount"><\/mat-form-field>
            <mat-form-field appearance="outline"><mat-label>المبلغ المدفوع *</mat-label><input matInput type="number" formControlName="payedAmount" (input)="calculateRemained()"><\/mat-form-field>
            <mat-form-field appearance="outline"><mat-label>المتبقي</mat-label><input matInput type="number" formControlName="remainedAmount" readonly><\/mat-form-field>
            <mat-form-field appearance="outline"><mat-label>نوع الإيجار</mat-label><mat-select formControlName="rentTypeId"><mat-option *ngFor="let rt of rentTypes" [value]="rt.id">{{ rt.title }}</mat-option><\/mat-select><\/mat-form-field>
            <mat-form-field appearance="outline"><mat-label>تاريخ الدفع *</mat-label><input matInput [matDatepicker]="datePicker" formControlName="paymentDate"><mat-datepicker-toggle matSuffix [for]="datePicker"><\/mat-datepicker-toggle><mat-datepicker #datePicker><\/mat-datepicker><\/mat-form-field>
            <mat-form-field appearance="outline"><mat-label>طريقة الدفع</mat-label><mat-select formControlName="paymentMethodId"><mat-option *ngFor="let pm of paymentMethods" [value]="pm.id">{{ pm.title }}</mat-option><\/mat-select><\/mat-form-field>
          <\/div>
          <div class="form-actions"><button mat-raised-button color="primary" type="submit"><mat-icon>save</mat-icon> {{ isEditMode ? 'تحديث' : 'حفظ' }}<\/button><button mat-stroked-button type="button" routerLink="/financial/place-rent-payments">إلغاء<\/button><\/div>
        <\/form>
      <\/mat-card>
    <\/div>
  `,
  styles: [`
    .form-container { max-width: 800px; margin: 0 auto; padding: 24px; }
    .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
    .form-actions { display: flex; gap: 16px; justify-content: flex-end; margin-top: 24px; }
  `]
})
export class PlaceRentPaymentFormComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  itemId?: number;
  places: any[] = [];
  rentTypes: any[] = [];
  paymentMethods: any[] = [];

  constructor(
    private fb: FormBuilder,
    private financialService: FinancialService,
    private placeService: PlaceService,
    private notification: NotificationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      placeId: [null, Validators.required],
      rentAmount: [null, Validators.required],
      payedAmount: [null, Validators.required],
      remainedAmount: [{ value: null, disabled: true }],
      rentTypeId: [null],
      paymentDate: [null, Validators.required],
      paymentMethodId: [null]
    });
  }

  ngOnInit() {
    this.loadPlaces();
    this.loadRentTypes();
    this.loadPaymentMethods();
    this.itemId = this.route.snapshot.params['id'];
    if (this.itemId) {
      this.isEditMode = true;
      this.financialService.getPlaceRentPaymentById(this.itemId).subscribe({
        next: (res: any) => { this.form.patchValue(res); this.calculateRemained(); },
        error: () => { this.notification.showError('حدث خطأ'); this.router.navigate(['/financial/place-rent-payments']); }
      });
    }
  }

  loadPlaces() { this.placeService.getAllPlacesLookup().subscribe((res: any) => this.places = res.list); }
  loadRentTypes() { this.financialService.getAllRentTypesLookup().subscribe((res: any) => this.rentTypes = res.list); }
  loadPaymentMethods() { this.financialService.getAllPaymentMethodsLookup().subscribe((res: any) => this.paymentMethods = res.list); }

  onPlaceSelect() {
    const placeId = this.form.get('placeId')?.value;
    const place = this.places.find(p => p.id === placeId);
    if (place && place.rentValue) { this.form.patchValue({ rentAmount: place.rentValue }); this.calculateRemained(); }
  }

  calculateRemained() {
    const rentAmount = this.form.get('rentAmount')?.value || 0;
    const payedAmount = this.form.get('payedAmount')?.value || 0;
    this.form.get('remainedAmount')?.setValue(rentAmount - payedAmount);
  }

  onSubmit() {
    if (this.form.invalid) return;
    const formValue = { ...this.form.value, remainedAmount: this.form.get('remainedAmount')?.value };
    if (this.isEditMode && this.itemId) {
      this.financialService.updatePlaceRentPayment(this.itemId, formValue).subscribe({
        next: () => { this.notification.showSuccess('تم التحديث'); this.router.navigate(['/financial/place-rent-payments']); },
        error: () => this.notification.showError('حدث خطأ')
      });
    } else {
      this.financialService.createPlaceRentPayment(formValue).subscribe({
        next: () => { this.notification.showSuccess('تم الإضافة'); this.router.navigate(['/financial/place-rent-payments']); },
        error: () => this.notification.showError('حدث خطأ')
      });
    }
  }
}