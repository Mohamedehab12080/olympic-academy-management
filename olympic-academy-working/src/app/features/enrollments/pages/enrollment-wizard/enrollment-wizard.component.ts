import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EnrollmentService } from '../../../../core/services/enrollment.service';
import { TraineeService } from '../../../../core/services/trainee.service';
import { CourseService } from '../../../../core/services/course.service';
import { EmployeeService } from '../../../../core/services/employee.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { PAYMENT_STATUSES } from '../../../../core/models/common.model';

@Component({
  selector: 'app-enrollment-wizard',
  template: `
    <div class="wizard-container">
      <mat-card>
        <h2>تسجيل جديد</h2>
        <mat-stepper [linear]="true" #stepper>
          <!-- Step 1: Select Trainee -->
          <mat-step [stepControl]="step1Form">
            <ng-template matStepLabel>اختيار المتدرب</ng-template>
            <form [formGroup]="step1Form">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>المتدرب</mat-label>
                <mat-select formControlName="traineeId">
                  <mat-option *ngFor="let t of trainees" [value]="t.id">{{ t.title }}</mat-option>
                </mat-select>
              </mat-form-field>
            </form>
            <div><button mat-button matStepperNext>التالي</button></div>
          </mat-step>

          <!-- Step 2: Select Course -->
          <mat-step [stepControl]="step2Form">
            <ng-template matStepLabel>اختيار الدورة</ng-template>
            <form [formGroup]="step2Form">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>الدورة</mat-label>
                <mat-select formControlName="courseId" (selectionChange)="onCourseSelect()">
                  <mat-option *ngFor="let c of courses" [value]="c.id">{{ c.title }} - {{ c.price }} جم</mat-option>
                </mat-select>
              </mat-form-field>
              <div *ngIf="selectedCourse">
                <p><strong>المدة:</strong> {{ selectedCourse.duration }} ساعة</p>
                <p><strong>السعر:</strong> {{ selectedCourse.price }} جم</p>
                <p><strong>الوصف:</strong> {{ selectedCourse.description }}</p>
              </div>
            </form>
            <div><button mat-button matStepperPrevious>السابق</button><button mat-button matStepperNext>التالي</button></div>
          </mat-step>

          <!-- Step 3: Select Trainer -->
          <mat-step [stepControl]="step3Form">
            <ng-template matStepLabel>اختيار المدرب</ng-template>
            <form [formGroup]="step3Form">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>المدرب</mat-label>
                <mat-select formControlName="trainerId">
                  <mat-option *ngFor="let t of trainers" [value]="t.id">{{ t.title }}</mat-option>
                </mat-select>
              </mat-form-field>
            </form>
            <div><button mat-button matStepperPrevious>السابق</button><button mat-button matStepperNext>التالي</button></div>
          </mat-step>

          <!-- Step 4: Payment -->
          <mat-step>
            <ng-template matStepLabel>الدفع</ng-template>
            <form [formGroup]="paymentForm">
              <mat-form-field appearance="outline" class="full-width"><mat-label>حالة الدفع</mat-label><mat-select formControlName="paymentStatus"><mat-option *ngFor="let s of paymentStatuses" [value]="s">{{ s.title }}</mat-option></mat-select></mat-form-field>
              <mat-form-field appearance="outline" class="full-width"><mat-label>المبلغ</mat-label><input matInput type="number" formControlName="finalSubscriptionValue"></mat-form-field>
              <mat-form-field appearance="outline" class="full-width"><mat-label>ملاحظات</mat-label><textarea matInput formControlName="note" rows="3"></textarea></mat-form-field>
            </form>
            <div><button mat-button matStepperPrevious>السابق</button><button mat-raised-button color="primary" (click)="submitEnrollment()">تأكيد التسجيل</button></div>
          </mat-step>
        </mat-stepper>
      </mat-card>
    </div>
  `,
  styles: [`
    .wizard-container { max-width: 800px; margin: 0 auto; padding: 24px; }
    .full-width { width: 100%; margin-bottom: 16px; }
  `]
})
export class EnrollmentWizardComponent implements OnInit {
  step1Form: FormGroup;
  step2Form: FormGroup;
  step3Form: FormGroup;
  paymentForm: FormGroup;
  trainees: any[] = [];
  courses: any[] = [];
  trainers: any[] = [];
  selectedCourse: any = null;
  paymentStatuses = PAYMENT_STATUSES;

  constructor(
    private fb: FormBuilder,
    private enrollmentService: EnrollmentService,
    private traineeService: TraineeService,
    private courseService: CourseService,
    private employeeService: EmployeeService,
    private notification: NotificationService,
    private router: Router
  ) {
    this.step1Form = this.fb.group({ traineeId: [null, Validators.required] });
    this.step2Form = this.fb.group({ courseId: [null, Validators.required] });
    this.step3Form = this.fb.group({ trainerId: [null, Validators.required] });
    this.paymentForm = this.fb.group({ paymentStatus: [null], finalSubscriptionValue: [null], note: [''] });
  }

  ngOnInit() {
    this.traineeService.getAllTraineesByFilter().subscribe((res: any) => this.trainees = res.items);
    this.courseService.getAllCourses().subscribe((res: any) => this.courses = res.items);
    this.employeeService.getAllTrainersLookup().subscribe((res: any) => this.trainers = res.list);
  }

  onCourseSelect() {
    const courseId = this.step2Form.get('courseId')?.value;
    this.selectedCourse = this.courses.find(c => c.id === courseId);
    if (this.selectedCourse) this.paymentForm.patchValue({ finalSubscriptionValue: this.selectedCourse.price });
  }

  submitEnrollment() {
    const enrollmentData = {
      traineeId: this.step1Form.get('traineeId')?.value,
      courseId: this.step2Form.get('courseId')?.value,
      trainerId: this.step3Form.get('trainerId')?.value,
      startDate: new Date().toISOString().split('T')[0],
      paymentStatus: this.paymentForm.get('paymentStatus')?.value,
      finalSubscriptionValue: this.paymentForm.get('finalSubscriptionValue')?.value,
      note: this.paymentForm.get('note')?.value
    };
    this.enrollmentService.createEnrollment(enrollmentData).subscribe({
      next: () => { this.notification.showSuccess('تم التسجيل بنجاح'); this.router.navigate(['/enrollments']); },
      error: () => this.notification.showError('حدث خطأ في التسجيل')
    });
  }
}