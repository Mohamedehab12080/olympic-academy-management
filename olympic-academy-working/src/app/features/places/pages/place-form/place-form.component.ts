import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PlaceService } from '../../../../core/services/place.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-place-form',
  template: `
    <div class="form-container"><mat-card><div class="form-header"><button mat-icon-button routerLink="/places"><mat-icon>arrow_forward</mat-icon></button><h2>{{ isEditMode ? 'تعديل موقع' : 'إضافة موقع جديد' }}</h2></div>
    <form [formGroup]="placeForm" (ngSubmit)="onSubmit()"><div class="form-grid"><mat-form-field appearance="outline"><mat-label>اسم الموقع *</mat-label><input matInput formControlName="title"></mat-form-field>
    <mat-form-field appearance="outline"><mat-label>العنوان</mat-label><input matInput formControlName="address"></mat-form-field>
    <mat-form-field appearance="outline"><mat-label>رقم الهاتف</mat-label><input matInput formControlName="phoneNumber"></mat-form-field>
    <mat-form-field appearance="outline"><mat-label>قيمة الإيجار</mat-label><input matInput type="number" formControlName="rentValue"></mat-form-field>
    <mat-form-field appearance="outline" class="full-width"><mat-label>المبلغ المتبقي</mat-label><input matInput type="number" formControlName="remainedValue"></mat-form-field></div>
    <div class="form-actions"><button mat-raised-button color="primary" type="submit" [disabled]="placeForm.invalid"><mat-icon>save</mat-icon> {{ isEditMode ? 'تحديث' : 'حفظ' }}</button><button mat-stroked-button type="button" routerLink="/places">إلغاء</button></div></form></mat-card></div>
  `,
  styles: [`.form-container { max-width: 600px; margin: 0 auto; padding: 24px; } .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; } .full-width { grid-column: span 2; } .form-actions { display: flex; gap: 16px; margin-top: 24px; justify-content: flex-end; }`]
})
export class PlaceFormComponent implements OnInit {
  placeForm: FormGroup; isEditMode = false; placeId?: number;
  constructor(private fb: FormBuilder, private placeService: PlaceService, private notification: NotificationService, private route: ActivatedRoute, private router: Router) { this.placeForm = this.fb.group({ title: ['', Validators.required], address: [''], phoneNumber: [''], rentValue: [null], remainedValue: [null] }); }
  ngOnInit() { this.placeId = this.route.snapshot.params['id']; if (this.placeId) { this.isEditMode = true; this.loadPlace(); } }
  loadPlace() { this.placeService.getPlaceById(this.placeId!).subscribe((p: any) => this.placeForm.patchValue(p)); }
  onSubmit() { if (this.placeForm.invalid) return; const data = this.placeForm.value; if (this.isEditMode) { this.placeService.updatePlace(this.placeId!, data).subscribe(() => { this.notification.showSuccess('تم التحديث'); this.router.navigate(['/places']); }); } else { this.placeService.createPlace(data).subscribe(() => { this.notification.showSuccess('تم الإضافة'); this.router.navigate(['/places']); }); } }
}