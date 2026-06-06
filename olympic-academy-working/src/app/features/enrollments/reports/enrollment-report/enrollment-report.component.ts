import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { EnrollmentService } from '../../../../core/services/enrollment.service';
import { ReportService } from '../../../../core/services/report.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { TraineeService } from '../../../../core/services/trainee.service';
import { CourseService } from '../../../../core/services/course.service';
import { ENROLLMENT_STATUSES } from '../../../../core/models/enrollment.model';
import { PAYMENT_STATUSES} from '../../../../core/models/common.model';

@Component({
  selector: 'app-enrollment-report',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatDatepickerModule, MatNativeDateModule, MatButtonModule,
    MatSelectModule, MatIconModule, MatTabsModule
  ],
  template: `
    <div class="report-container">
      <mat-card>
        <div class="report-header">
          <h2>تقارير التسجيلات</h2>
        </div>

        <mat-tab-group>
          <!-- تبويب التسجيلات العامة -->
          <mat-tab label="جميع التسجيلات">
            <div class="filters">
              <mat-form-field appearance="outline">
                <mat-label>من تاريخ</mat-label>
                <input matInput [matDatepicker]="startPicker" [(ngModel)]="filters.startDate">
                <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
                <mat-datepicker #startPicker></mat-datepicker>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>إلى تاريخ</mat-label>
                <input matInput [matDatepicker]="endPicker" [(ngModel)]="filters.endDate">
                <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
                <mat-datepicker #endPicker></mat-datepicker>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>حالة التسجيل</mat-label>
                <mat-select [(ngModel)]="filters.enrollmentStatusId">
                  <mat-option [value]="null">الكل</mat-option>
                  <mat-option *ngFor="let s of enrollmentStatuses" [value]="s.id">{{ s.title }}</mat-option>
                </mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>حالة الدفع</mat-label>
                <mat-select [(ngModel)]="filters.paymentStatusId">
                  <mat-option [value]="null">الكل</mat-option>
                  <mat-option *ngFor="let s of paymentStatuses" [value]="s.id">{{ s.title }}</mat-option>
                </mat-select>
              </mat-form-field>
              <div class="actions">
                <button mat-raised-button color="primary" (click)="loadEnrollments()"><mat-icon>search</mat-icon> عرض</button>
                <button mat-raised-button color="accent" (click)="exportToExcel()"><mat-icon>table_chart</mat-icon> Excel</button>
                <button mat-raised-button color="warn" (click)="exportToPDF()"><mat-icon>picture_as_pdf</mat-icon> PDF</button>
              </div>
            </div>

            <div class="summary-cards" *ngIf="enrollments.length">
              <div class="summary-card"><h3>إجمالي التسجيلات</h3><p>{{ enrollments.length }}</p></div>
              <div class="summary-card success"><h3>المدفوع</h3><p>{{ paidCount }}</p></div>
              <div class="summary-card warning"><h3>قيد الانتظار</h3><p>{{ pendingCount }}</p></div>
              <div class="summary-card primary"><h3>إجمالي الإيرادات</h3><p>{{ totalRevenue | currency:'EGP ' }}</p></div>
            </div>

            <div class="table-container" *ngIf="enrollments.length">
                <table>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>المتدرب</th>
                        <th>الدورة</th>
                        <th>المدرب</th>
                        <th>تاريخ البدء</th>
                        <th>تاريخ الانتهاء</th>
                        <th>حالة التسجيل</th>
                        <th>حالة الدفع</th>
                        <th>المبلغ</th>
                        <th>المتبقي</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr *ngFor="let e of enrollments; let i = index">
                        <td>{{ i+1 }}</td>
                        <td>{{ e.trainee?.title || '-' }}</td>
                        <td>{{ e.course?.title || '-' }}</td>
                        <td>{{ e.trainer?.title || '-' }}</td>
                        <td>{{ e.startDate | date }}</td>
                        <td>{{ e.endDate ? (e.endDate | date) : '-' }}</td>
                        <td>
                        <span class="badge" [class.completed]="e.enrollmentStatus?.id === 2" [class.pending]="e.enrollmentStatus?.id === 1" [class.cancelled]="e.enrollmentStatus?.id === 3">
                            {{ e.enrollmentStatus?.title || '-' }}
                        </span>
                        </td>
                        <td>
                        <span class="status-badge" [class.paid]="e.paymentStatus?.id === 2" [class.pending]="e.paymentStatus?.id === 1">
                            {{ e.paymentStatus?.title || '-' }}
                        </span>
                        </td>
                        <td>{{ e.finalSubscriptionValue ? (e.finalSubscriptionValue | currency:'EGP ') : '-' }}</td>
                        <td>{{ e.remainedSubscriptionValue ? (e.remainedSubscriptionValue | currency:'EGP ') : '-' }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
          </mat-tab>

          <!-- تبويب حسب المتدرب -->
          <mat-tab label="حسب المتدرب">
            <div class="filters">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>اختر المتدرب</mat-label>
                <mat-select [(ngModel)]="selectedTraineeId" (selectionChange)="loadEnrollmentsByTrainee()">
                  <mat-option *ngFor="let t of trainees" [value]="t.id">{{ t.title }}</mat-option>
                </mat-select>
              </mat-form-field>
              <div class="actions">
                <button mat-raised-button color="accent" (click)="exportTraineeReportToExcel()"><mat-icon>table_chart</mat-icon> Excel</button>
                <button mat-raised-button color="warn" (click)="exportTraineeReportToPDF()"><mat-icon>picture_as_pdf</mat-icon> PDF</button>
              </div>
            </div>

            <div class="trainee-info" *ngIf="selectedTrainee">
              <h3>{{ selectedTrainee.title }}</h3>
              <p>إجمالي التسجيلات: {{ traineeEnrollments.length }} | إجمالي المدفوع: {{ traineeTotalPaid | currency:'EGP' }}</p>
            </div>

            <div class="table-container" *ngIf="traineeEnrollments.length">
                <table>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>الدورة</th>
                        <th>المدرب</th>
                        <th>تاريخ البدء</th>
                        <th>حالة الدفع</th>
                        <th>المبلغ</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr *ngFor="let e of traineeEnrollments; let i = index">
                        <td>{{ i+1 }}</td>
                        <td>{{ e.course?.title || '-' }}</td>
                        <td>{{ e.trainer?.title || '-' }}</td>
                        <td>{{ e.startDate ? (e.startDate | date) : '-' }}</td>
                        <td>{{ e.paymentStatus?.title || '-' }}</td>
                        <td>{{ e.finalSubscriptionValue ? (e.finalSubscriptionValue | currency:'ُEGP ') : '-' }}</td>
                    </tr>
                    </tbody>
                </table>
                </div>
          </mat-tab>

          <!-- تبويب حسب الدورة -->
          <mat-tab label="حسب الدورة">
            <div class="filters">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>اختر الدورة</mat-label>
                <mat-select [(ngModel)]="selectedCourseId" (selectionChange)="loadEnrollmentsByCourse()">
                  <mat-option *ngFor="let c of courses" [value]="c.id">{{ c.title }}</mat-option>
                </mat-select>
              </mat-form-field>
              <div class="actions">
                <button mat-raised-button color="accent" (click)="exportCourseReportToExcel()"><mat-icon>table_chart</mat-icon> Excel</button>
                <button mat-raised-button color="warn" (click)="exportCourseReportToPDF()"><mat-icon>picture_as_pdf</mat-icon> PDF</button>
              </div>
            </div>

            <div class="course-info" *ngIf="selectedCourse">
              <h3>{{ selectedCourse.title }}</h3>
              <p>عدد المسجلين: {{ courseEnrollments.length }} | إجمالي الإيرادات: {{ courseTotalRevenue | currency:'EGP' }}</p>
            </div>

           <div class="table-container" *ngIf="courseEnrollments.length">
                <table>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>المتدرب</th>
                        <th>المدرب</th>
                        <th>تاريخ التسجيل</th>
                        <th>حالة الدفع</th>
                        <th>المبلغ</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr *ngFor="let e of courseEnrollments; let i = index">
                        <td>{{ i+1 }}</td>
                        <td>{{ e.trainee?.title || '-' }}</td>
                        <td>{{ e.trainer?.title || '-' }}</td>
                        <td>{{ e.createdOn ? (e.createdOn | date) : '-' }}</td>
                        <td>{{ e.paymentStatus?.title || '-' }}</td>
                        <td>{{ e.finalSubscriptionValue ? (e.finalSubscriptionValue | currency:'SAR ') : '-' }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
          </mat-tab>
        </mat-tab-group>
      </mat-card>
    </div>
  `,
  styles: [`
    .report-container { padding: 24px; max-width: 1400px; margin: 0 auto; }
    .report-header { margin-bottom: 24px; }
    .report-header h2 { font-size: 24px; margin: 0; }
    .filters { display: flex; flex-wrap: wrap; gap: 16px; align-items: center; margin-bottom: 24px; padding: 16px; background: #f9fafb; border-radius: 12px; }
    .filters mat-form-field { flex: 1; min-width: 150px; }
    .full-width { width: 100%; }
    .actions { display: flex; gap: 12px; }
    .summary-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 24px; }
    .summary-card { background: white; border-radius: 12px; padding: 20px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .summary-card h3 { margin: 0 0 8px; font-size: 14px; color: #6b7280; }
    .summary-card p { font-size: 24px; font-weight: bold; margin: 0; }
    .summary-card.success p { color: #10b981; }
    .summary-card.warning p { color: #f59e0b; }
    .summary-card.primary p { color: #2563eb; }
    .table-container { overflow-x: auto; background: white; border-radius: 12px; padding: 16px; margin-top: 20px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 12px; text-align: right; border-bottom: 1px solid #e5e7eb; }
    th { background: #f9fafb; font-weight: 600; }
    .badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; }
    .badge.completed { background: #d1fae5; color: #065f46; }
    .badge.pending { background: #fef3c7; color: #92400e; }
    .badge.cancelled { background: #fee2e2; color: #991b1b; }
    .status-badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; }
    .status-badge.paid { background: #d1fae5; color: #065f46; }
    .status-badge.pending { background: #fef3c7; color: #92400e; }
    .trainee-info, .course-info { background: #eff6ff; padding: 16px; border-radius: 12px; margin-bottom: 20px; }
    .trainee-info h3, .course-info h3 { margin: 0 0 8px; color: #2563eb; }
  `]
})
export class EnrollmentReportComponent implements OnInit {
  enrollments: any[] = [];
  trainees: any[] = [];
  courses: any[] = [];
  enrollmentStatuses = ENROLLMENT_STATUSES;
  paymentStatuses = PAYMENT_STATUSES;
  
  filters = { startDate: '', endDate: '', enrollmentStatusId: null, paymentStatusId: null };
  selectedTraineeId: number | null = null;
  selectedCourseId: number | null = null;
  selectedTrainee: any = null;
  selectedCourse: any = null;
  traineeEnrollments: any[] = [];
  courseEnrollments: any[] = [];

  get paidCount() { return this.enrollments.filter(e => e.paymentStatus?.id === 2).length; }
  get pendingCount() { return this.enrollments.filter(e => e.paymentStatus?.id === 1).length; }
  get totalRevenue() { return this.enrollments.reduce((sum, e) => sum + (e.finalSubscriptionValue || 0), 0); }
  get traineeTotalPaid() { return this.traineeEnrollments.reduce((sum, e) => sum + (e.finalSubscriptionValue || 0), 0); }
  get courseTotalRevenue() { return this.courseEnrollments.reduce((sum, e) => sum + (e.finalSubscriptionValue || 0), 0); }

  constructor(
    private enrollmentService: EnrollmentService,
    private traineeService: TraineeService,
    private courseService: CourseService,
    private reportService: ReportService,
    private notification: NotificationService
  ) {}

  ngOnInit() {
    this.loadTrainees();
    this.loadCourses();
    this.loadEnrollments();
  }

  loadTrainees() { this.traineeService.getAllTraineesByFilter().subscribe((res: any) => this.trainees = res.items); }
  loadCourses() { this.courseService.getAllCourses().subscribe((res: any) => this.courses = res.items); }

  loadEnrollments() {
    const params: any = {};
    if (this.filters.startDate) params.startDateFrom = this.filters.startDate;
    if (this.filters.endDate) params.startDateTo = this.filters.endDate;
    if (this.filters.enrollmentStatusId) params.enrollmentStatus = this.filters.enrollmentStatusId;
    if (this.filters.paymentStatusId) params.paymentStatus = this.filters.paymentStatusId;
    this.enrollmentService.getAllEnrollmentsByFilter(params).subscribe({
      next: (res: any) => { this.enrollments = res.items; },
      error: () => this.notification.showError('حدث خطأ')
    });
  }

  loadEnrollmentsByTrainee() {
    if (!this.selectedTraineeId) return;
    this.selectedTrainee = this.trainees.find(t => t.id === this.selectedTraineeId);
    this.enrollmentService.getAllEnrollmentsByFilter({ traineeId: this.selectedTraineeId }).subscribe({
      next: (res: any) => { this.traineeEnrollments = res.items; }
    });
  }

  loadEnrollmentsByCourse() {
    if (!this.selectedCourseId) return;
    this.selectedCourse = this.courses.find(c => c.id === this.selectedCourseId);
    this.enrollmentService.getAllEnrollmentsByFilter({ courseId: this.selectedCourseId }).subscribe({
      next: (res: any) => { this.courseEnrollments = res.items; }
    });
  }

  exportToExcel() {
    const data = this.enrollments.map((e, i) => ({
      '#': i + 1, 'المتدرب': e.trainee?.title, 'الدورة': e.course?.title, 'المدرب': e.trainer?.title,
      'تاريخ البدء': e.startDate, 'تاريخ الانتهاء': e.endDate, 'حالة التسجيل': e.enrollmentStatus?.title,
      'حالة الدفع': e.paymentStatus?.title, 'المبلغ': e.finalSubscriptionValue, 'المتبقي': e.remainedSubscriptionValue
    }));
    this.reportService.exportToExcel(data, 'enrollments-report', 'التسجيلات');
    this.notification.showSuccess('تم تصدير التقرير بنجاح');
  }

exportToPDF() {
  const doc = new jsPDF('p', 'mm', 'a4');
  
  doc.setFontSize(18);
  doc.text('تقرير التسجيلات', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
  
  let filtersText = '';
  if (this.filters.startDate) filtersText += `من تاريخ: ${this.filters.startDate} `;
  if (this.filters.endDate) filtersText += `إلى تاريخ: ${this.filters.endDate} `;
  if (this.filters.paymentStatusId) {
    const status = this.paymentStatuses.find(s => s.id === this.filters.paymentStatusId);
    if (status) filtersText += `حالة الدفع: ${status.title}`;
  }
  
  if (filtersText) {
    doc.setFontSize(10);
    doc.text(filtersText, 14, 35);
  }
  
  const startY = filtersText ? 45 : 35;
  
  autoTable(doc, {
    head: [['#', 'المتدرب', 'الدورة', 'المدرب', 'تاريخ البدء', 'حالة الدفع', 'المبلغ']],
    body: this.enrollments.map((e, i) => [
      (i + 1).toString(),
      e.trainee?.title || '-',
      e.course?.title || '-',
      e.trainer?.title || '-',
      e.startDate || '-',
      e.paymentStatus?.title || '-',
      e.finalSubscriptionValue ? `${e.finalSubscriptionValue} جم` : '-'
    ]),
    startY: startY,
    styles: { halign: 'right', font: 'helvetica' },
    headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], halign: 'right' }
  });
  
  doc.save('enrollments-report.pdf');
  this.notification.showSuccess('تم تصدير التقرير بنجاح');
}


  exportTraineeReportToExcel() {
    const data = this.traineeEnrollments.map((e, i) => ({
      '#': i + 1, 'الدورة': e.course?.title, 'المدرب': e.trainer?.title,
      'تاريخ البدء': e.startDate, 'حالة الدفع': e.paymentStatus?.title, 'المبلغ': e.finalSubscriptionValue
    }));
    this.reportService.exportToExcel(data, `trainee-${this.selectedTrainee?.title}-report`, 'تسجيلات المتدرب');
    this.notification.showSuccess('تم تصدير التقرير بنجاح');
  }

exportTraineeReportToPDF() {
  if (!this.selectedTrainee) {
    this.notification.showWarning('يرجى اختيار متدرب أولاً');
    return;
  }
  
  const doc = new jsPDF('p', 'mm', 'a4');
  
  doc.setFontSize(18);
  doc.text(`تقرير تسجيلات المتدرب: ${this.selectedTrainee?.title}`, doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`إجمالي التسجيلات: ${this.traineeEnrollments.length} | إجمالي المدفوع: ${this.traineeTotalPaid} جم`, 14, 35);
  
  autoTable(doc, {
    head: [['الدورة', 'المدرب', 'تاريخ البدء', 'حالة الدفع', 'المبلغ']],
    body: this.traineeEnrollments.map(e => [
      e.course?.title || '-',
      e.trainer?.title || '-',
      e.startDate || '-',
      e.paymentStatus?.title || '-',
      `${e.finalSubscriptionValue || 0} جم`
    ]),
    startY: 45,
    styles: { halign: 'right', font: 'helvetica', cellPadding: 3 },
    headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], halign: 'right' }
  });
  
  const fileName = `trainee-${this.selectedTrainee?.title?.replace(/\s/g, '-')}-report.pdf`;
  doc.save(fileName);
  this.notification.showSuccess('تم تصدير التقرير بنجاح');
}

  exportCourseReportToExcel() {
    const data = this.courseEnrollments.map((e, i) => ({
      '#': i + 1, 'المتدرب': e.trainee?.title, 'المدرب': e.trainer?.title,
      'تاريخ التسجيل': e.createdOn, 'حالة الدفع': e.paymentStatus?.title, 'المبلغ': e.finalSubscriptionValue
    }));
    this.reportService.exportToExcel(data, `course-${this.selectedCourse?.title}-report`, 'تسجيلات الدورة');
    this.notification.showSuccess('تم تصدير التقرير بنجاح');
  }

 exportCourseReportToPDF() {
  if (!this.selectedCourse) {
    this.notification.showWarning('يرجى اختيار دورة أولاً');
    return;
  }
  
  const doc = new jsPDF('p', 'mm', 'a4');
  
  doc.setFontSize(18);
  doc.text(`تقرير تسجيلات الدورة: ${this.selectedCourse?.title}`, doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`عدد المسجلين: ${this.courseEnrollments.length} | إجمالي الإيرادات: ${this.courseTotalRevenue} جم`, 14, 35);
  
  autoTable(doc, {
    head: [['المتدرب', 'المدرب', 'تاريخ التسجيل', 'حالة الدفع', 'المبلغ']],
    body: this.courseEnrollments.map(e => [
      e.trainee?.title || '-',
      e.trainer?.title || '-',
      e.createdOn ? new Date(e.createdOn).toLocaleDateString('ar-EG') : '-',
      e.paymentStatus?.title || '-',
      `${e.finalSubscriptionValue || 0} جم`
    ]),
    startY: 45,
    styles: { halign: 'right', font: 'helvetica', cellPadding: 3 },
    headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], halign: 'right' }
  });
  
  const fileName = `course-${this.selectedCourse?.title?.replace(/\s/g, '-')}-report.pdf`;
  doc.save(fileName);
  this.notification.showSuccess('تم تصدير التقرير بنجاح');
}
}