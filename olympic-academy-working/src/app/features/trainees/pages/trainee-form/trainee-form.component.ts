import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TraineeService } from '../../../../core/services/trainee.service';
import { CourseService } from '../../../../core/services/course.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { GENDERS, CONTACT_TYPES } from '../../../../core/models/common.model';

@Component({
  selector: 'app-trainee-form',
  template: `
    <div class="form-container">
      <mat-card>
        <div class="form-header">
          <button mat-icon-button routerLink="/trainees"><mat-icon>arrow_forward</mat-icon></button>
          <h2>{{ isEditMode ? 'تعديل متدرب' : 'إضافة متدرب جديد' }}</h2>
        </div>

        <form [formGroup]="traineeForm" (ngSubmit)="onSubmit()">
          <mat-tab-group>
            <mat-tab label="المعلومات الأساسية">
              <div class="form-grid">
                <mat-form-field appearance="outline"><mat-label>الاسم الكامل *</mat-label><input matInput formControlName="fullName"></mat-form-field>
                <mat-form-field appearance="outline"><mat-label>رقم الهوية *</mat-label><input matInput formControlName="nationalId" maxlength="14"></mat-form-field>
                <mat-form-field appearance="outline"><mat-label>السنة الدراسية</mat-label><input matInput formControlName="academicYear"></mat-form-field>
                <mat-form-field appearance="outline"><mat-label>تاريخ الميلاد</mat-label><input matInput [matDatepicker]="birthPicker" formControlName="birthDate"><mat-datepicker-toggle matSuffix [for]="birthPicker"></mat-datepicker-toggle><mat-datepicker #birthPicker></mat-datepicker></mat-form-field>
                <mat-form-field appearance="outline"><mat-label>الجنس</mat-label><mat-select formControlName="gender"><mat-option *ngFor="let g of genders" [value]="g">{{ g.title }}</mat-option></mat-select></mat-form-field>
                <mat-form-field appearance="outline"><mat-label>العنوان</mat-label><input matInput formControlName="address"></mat-form-field>
              </div>
            </mat-tab>

            <mat-tab label="جهات الاتصال">
              <div formArrayName="contacts">
                <div *ngFor="let contact of contacts.controls; let i=index" [formGroupName]="i" class="contact-row">
                  <mat-form-field appearance="outline"><mat-label>النوع</mat-label><mat-select formControlName="contactType"><mat-option *ngFor="let ct of contactTypes" [value]="ct">{{ ct.title }}</mat-option></mat-select></mat-form-field>
                  <mat-form-field appearance="outline"><mat-label>القيمة</mat-label><input matInput formControlName="contactValue"></mat-form-field>
                  <button mat-icon-button color="warn" (click)="removeContact(i)"><mat-icon>delete</mat-icon></button>
                </div>
                <button mat-stroked-button type="button" (click)="addContact()"><mat-icon>add</mat-icon> إضافة جهة اتصال</button>
              </div>
            </mat-tab>

            <mat-tab label="الشهادات">
              <div formArrayName="certificates">
                <div *ngFor="let cert of certificates.controls; let i=index" [formGroupName]="i" class="certificate-row">
                  <mat-form-field appearance="outline"><mat-label>اسم الشهادة</mat-label><input matInput formControlName="certificateName"></mat-form-field>
                  <mat-form-field appearance="outline"><mat-label>رقم الشهادة</mat-label><input matInput formControlName="certificateNumber"></mat-form-field>
                  <mat-form-field appearance="outline"><mat-label>الدورة</mat-label><mat-select formControlName="courseId"><mat-option *ngFor="let c of courses" [value]="c.id">{{ c.title }}</mat-option></mat-select></mat-form-field>
                  <mat-form-field appearance="outline"><mat-label>تاريخ الإصدار</mat-label><input matInput [matDatepicker]="issuePicker" formControlName="issueDate"><mat-datepicker-toggle matSuffix [for]="issuePicker"></mat-datepicker-toggle><mat-datepicker #issuePicker></mat-datepicker></mat-form-field>
                  <mat-form-field appearance="outline"><mat-label>الدرجة</mat-label><input matInput formControlName="grade"></mat-form-field>
                  <button mat-icon-button color="warn" (click)="removeCertificate(i)"><mat-icon>delete</mat-icon></button>
                </div>
                <button mat-stroked-button type="button" (click)="addCertificate()"><mat-icon>add</mat-icon> إضافة شهادة</button>
              </div>
            </mat-tab>

            <mat-tab label="الحالات الصحية">
              <div formArrayName="healthConditions">
                <div *ngFor="let condition of healthConditions.controls; let i=index" [formGroupName]="i" class="condition-row">
                  <mat-form-field appearance="outline"><mat-label>العنوان</mat-label><input matInput formControlName="title"></mat-form-field>
                  <mat-form-field appearance="outline"><mat-label>الوصف</mat-label><input matInput formControlName="description"></mat-form-field>
                  <mat-form-field appearance="outline"><mat-label>العلاج</mat-label><input matInput formControlName="medication"></mat-form-field>
                  <mat-form-field appearance="outline"><mat-label>ملاحظات</mat-label><input matInput formControlName="note"></mat-form-field>
                  <button mat-icon-button color="warn" (click)="removeHealthCondition(i)"><mat-icon>delete</mat-icon></button>
                </div>
                <button mat-stroked-button type="button" (click)="addHealthCondition()"><mat-icon>add</mat-icon> إضافة حالة صحية</button>
              </div>
            </mat-tab>
          </mat-tab-group>

          <div class="form-actions">
            <button mat-raised-button color="primary" type="submit" [disabled]="traineeForm.invalid"><mat-icon>save</mat-icon> {{ isEditMode ? 'تحديث' : 'حفظ' }}</button>
            <button mat-stroked-button type="button" routerLink="/trainees">إلغاء</button>
          </div>
        </form>
      </mat-card>
    </div>
  `,
  styles: [`
    .form-container { max-width: 1000px; margin: 0 auto; padding: 24px; }
    .form-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
    .form-header h2 { margin: 0; }
    .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; padding: 20px 0; }
    .contact-row, .certificate-row, .condition-row { display: grid; grid-template-columns: 1fr 2fr auto; gap: 16px; align-items: center; margin-bottom: 16px; }
    .form-actions { display: flex; gap: 16px; margin-top: 24px; justify-content: flex-end; }
  `]
})
export class TraineeFormComponent implements OnInit {
  traineeForm: FormGroup;
  isEditMode = false;
  traineeId?: number;
  genders = GENDERS;
  contactTypes = CONTACT_TYPES;
  courses: any[] = [];

  constructor(
    private fb: FormBuilder,
    private traineeService: TraineeService,
    private courseService: CourseService,
    private notification: NotificationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.traineeForm = this.fb.group({
      fullName: ['', Validators.required],
      nationalId: ['', Validators.required],
      academicYear: [''],
      birthDate: [''],
      gender: [null],
      address: [''],
      contacts: this.fb.array([]),
      certificates: this.fb.array([]),
      healthConditions: this.fb.array([])
    });
  }

  get contacts() { return this.traineeForm.get('contacts') as FormArray; }
  get certificates() { return this.traineeForm.get('certificates') as FormArray; }
  get healthConditions() { return this.traineeForm.get('healthConditions') as FormArray; }

  addContact() { this.contacts.push(this.fb.group({ contactType: [null], contactValue: [''] })); }
  removeContact(i: number) { this.contacts.removeAt(i); }
  addCertificate() { this.certificates.push(this.fb.group({ certificateName: [''], certificateNumber: [''], courseId: [null], issueDate: [''], grade: [''] })); }
  removeCertificate(i: number) { this.certificates.removeAt(i); }
  addHealthCondition() { this.healthConditions.push(this.fb.group({ title: [''], description: [''], medication: [''], note: [''] })); }
  removeHealthCondition(i: number) { this.healthConditions.removeAt(i); }

  ngOnInit() {
    this.loadCourses();
    this.addContact();
    this.traineeId = this.route.snapshot.params['id'];
    if (this.traineeId) { this.isEditMode = true; this.loadTrainee(); }
  }

  loadCourses() { this.courseService.getAllCourses().subscribe((res: any) => this.courses = res.items); }

  loadTrainee() {
    this.traineeService.getTraineeById(this.traineeId!).subscribe((t: any) => {
      this.traineeForm.patchValue(t);
      if (t.contacts?.length) { while (this.contacts.length) this.contacts.removeAt(0); t.contacts.forEach((c: any) => this.contacts.push(this.fb.group({ contactType: [c.contactType], contactValue: [c.contactValue] }))); }
      if (t.certificates?.length) { while (this.certificates.length) this.certificates.removeAt(0); t.certificates.forEach((c: any) => this.certificates.push(this.fb.group({ certificateName: [c.certificateName], certificateNumber: [c.certificateNumber], courseId: [c.course?.id], issueDate: [c.issueDate], grade: [c.grade] }))); }
      if (t.healthConditions?.length) { while (this.healthConditions.length) this.healthConditions.removeAt(0); t.healthConditions.forEach((h: any) => this.healthConditions.push(this.fb.group({ title: [h.title], description: [h.description], medication: [h.medication], note: [h.note] }))); }
    });
  }

  onSubmit() {
    if (this.traineeForm.invalid) return;
    const formData = this.traineeForm.value;
    if (this.isEditMode) {
      this.traineeService.updateTrainee(this.traineeId!, formData).subscribe({
        next: () => { this.notification.showSuccess('تم تحديث المتدرب'); this.router.navigate(['/trainees']); }
      });
    } else {
      this.traineeService.createTrainee(formData).subscribe({
        next: () => { this.notification.showSuccess('تم إضافة المتدرب'); this.router.navigate(['/trainees']); }
      });
    }
  }
}