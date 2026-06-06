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

import { TraineeService } from '../../../../core/services/trainee.service';
import { ReportService } from '../../../../core/services/report.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { GENDERS } from '../../../../core/models/common.model';
import { EnrollmentService } from '../../../../core/services/enrollment.service';

@Component({
  selector: 'app-trainee-report',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, MatButtonModule, MatSelectModule, MatIconModule, MatTabsModule],
  template: `
    <div class="report-container">
      <mat-card>
        <div class="report-header"><h2>تقارير المتدربين</h2></div>
        <mat-tab-group>
          <!-- قائمة المتدربين -->
          <mat-tab label="قائمة المتدربين">
            <div class="filters">
              <mat-form-field appearance="outline"><mat-label>بحث</mat-label><input matInput [(ngModel)]="searchText" (ngModelChange)="filterTrainees()" placeholder="اسم أو رقم هوية"></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>الجنس</mat-label><mat-select [(ngModel)]="genderFilter" (selectionChange)="filterTrainees()"><mat-option [value]="null">الكل</mat-option><mat-option *ngFor="let g of genders" [value]="g.id">{{ g.title }}</mat-option></mat-select></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>الحالة</mat-label><mat-select [(ngModel)]="statusFilter" (selectionChange)="filterTrainees()"><mat-option [value]="null">الكل</mat-option><mat-option [value]="true">نشط</mat-option><mat-option [value]="false">غير نشط</mat-option></mat-select></mat-form-field>
              <div class="actions"><button mat-raised-button color="primary" (click)="loadTrainees()"><mat-icon>search</mat-icon> عرض</button><button mat-raised-button color="accent" (click)="exportToExcel()"><mat-icon>table_chart</mat-icon> Excel</button><button mat-raised-button color="warn" (click)="exportToPDF()"><mat-icon>picture_as_pdf</mat-icon> PDF</button></div>
            </div>
            <div class="summary-cards"><div class="summary-card"><h3>إجمالي المتدربين</h3><p>{{ allTrainees.length }}</p></div><div class="summary-card success"><h3>نشط</h3><p>{{ activeCount }}</p></div><div class="summary-card warning"><h3>غير نشط</h3><p>{{ inactiveCount }}</p></div></div>
            <div class="table-container"><table><thead><tr><th>#</th><th>الاسم</th><th>رقم الهوية</th><th>السنة الدراسية</th><th>الجنس</th><th>الحالة</th><th>عدد الشهادات</th><th>عدد التسجيلات</th></tr></thead>
            <tbody><tr *ngFor="let t of filteredTrainees; let i=index"><td>{{ i+1 }}</td><td>{{ t.fullName }}</td><td>{{ t.nationalId }}</td><td>{{ t.academicYear || '-' }}</td><td>{{ t.gender?.title }}</td><td><span class="badge" [class.active]="t.isActive">{{ t.isActive ? 'نشط' : 'غير نشط' }}</span></td><td>{{ t.certificates?.length || 0 }}</td><td>{{ t.enrollmentsCount || 0 }}</td></tr></tbody></table></div>
          </mat-tab>

          <!-- تفاصيل متدرب -->
          <mat-tab label="تفاصيل متدرب">
            <div class="filters"><mat-form-field appearance="outline" class="full-width"><mat-label>اختر المتدرب</mat-label><mat-select [(ngModel)]="selectedTraineeId" (selectionChange)="loadTraineeDetails()"><mat-option *ngFor="let t of allTrainees" [value]="t.id">{{ t.fullName }} - {{ t.nationalId }}</mat-option></mat-select></mat-form-field></div>
            <div class="trainee-details" *ngIf="selectedTraineeDetails">
              <div class="details-card"><h3>{{ selectedTraineeDetails.fullName }}</h3><p><strong>رقم الهوية:</strong> {{ selectedTraineeDetails.nationalId }}</p><p><strong>السنة الدراسية:</strong> {{ selectedTraineeDetails.academicYear || '-' }}</p><p><strong>الجنس:</strong> {{ selectedTraineeDetails.gender?.title }}</p><p><strong>العنوان:</strong> {{ selectedTraineeDetails.address || '-' }}</p><p><strong>تاريخ الميلاد:</strong> {{ selectedTraineeDetails.birthDate | date }}</p><p><strong>الحالة:</strong> <span class="badge" [class.active]="selectedTraineeDetails.isActive">{{ selectedTraineeDetails.isActive ? 'نشط' : 'غير نشط' }}</span></p></div>
              <div class="details-card"><h4>جهات الاتصال</h4><p *ngFor="let c of selectedTraineeDetails.contacts">{{ c.contactType?.title }}: {{ c.contactValue }}</p></div>
              <div class="details-card"><h4>الشهادات</h4><div class="table-container"><table><thead><tr><th>اسم الشهادة</th><th>رقم الشهادة</th><th>الدورة</th><th>تاريخ الإصدار</th><th>الدرجة</th></tr></thead><tbody><tr *ngFor="let cert of selectedTraineeDetails.certificates"><td>{{ cert.certificateName }}</td><td>{{ cert.certificateNumber }}</td><td>{{ cert.course?.title }}</td><td>{{ cert.issueDate | date }}</td><td>{{ cert.grade }}</td></tr></tbody></table></div></div>
              <div class="details-card"><h4>الحالات الصحية</h4><div class="table-container"><table><thead><tr><th>العنوان</th><th>الوصف</th><th>العلاج</th><th>ملاحظات</th></tr></thead><tbody><tr *ngFor="let h of selectedTraineeDetails.healthConditions"><td>{{ h.title }}</td><td>{{ h.description }}</td><td>{{ h.medication }}</td><td>{{ h.note }}</td></tr></tbody></table></div></div>
              <div class="details-card"><h4>التسجيلات</h4><div class="table-container"><table><thead><tr><th>الدورة</th><th>المدرب</th><th>تاريخ البدء</th><th>حالة الدفع</th><th>المبلغ</th></tr></thead><tbody><tr *ngFor="let e of traineeEnrollments"><td>{{ e.course?.title }}</td><td>{{ e.trainer?.title }}</td><td>{{ e.startDate | date }}</td><td>{{ e.paymentStatus?.title }}</td><td>{{ e.finalSubscriptionValue | currency:'EGP' }}</td></tr></tbody></table></div></div>
            </div>
          </mat-tab>
        </mat-tab-group>
      </mat-card>
    </div>
  `,
  styles: [`
    .report-container { padding: 24px; max-width: 1400px; margin: 0 auto; }
    .filters { display: flex; flex-wrap: wrap; gap: 16px; align-items: center; margin-bottom: 24px; padding: 16px; background: #f9fafb; border-radius: 12px; }
    .filters mat-form-field { flex: 1; min-width: 150px; }
    .full-width { width: 100%; }
    .actions { display: flex; gap: 12px; }
    .summary-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 24px; }
    .summary-card { background: white; border-radius: 12px; padding: 20px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .summary-card h3 { margin: 0 0 8px; font-size: 14px; color: #6b7280; }
    .summary-card p { font-size: 24px; font-weight: bold; margin: 0; }
    .summary-card.success p { color: #10b981; }
    .table-container { overflow-x: auto; background: white; border-radius: 12px; padding: 16px; margin-top: 16px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 12px; text-align: right; border-bottom: 1px solid #e5e7eb; }
    th { background: #f9fafb; font-weight: 600; }
    .badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; background: #fee2e2; color: #991b1b; }
    .badge.active { background: #d1fae5; color: #065f46; }
    .trainee-details { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 20px; margin-top: 20px; }
    .details-card { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .details-card h3, .details-card h4 { margin-top: 0; color: #2563eb; }
    .details-card p { margin: 8px 0; }
  `]
})
export class TraineeReportComponent implements OnInit {
  allTrainees: any[] = [];
  filteredTrainees: any[] = [];
  selectedTraineeDetails: any = null;
  traineeEnrollments: any[] = [];
  genders = GENDERS;
  searchText = '';
  genderFilter: number | null = null;
  statusFilter: boolean | null = null;
  selectedTraineeId: number | null = null;

  get activeCount() { return this.allTrainees.filter(t => t.isActive).length; }
  get inactiveCount() { return this.allTrainees.filter(t => !t.isActive).length; }

  constructor(private traineeService: TraineeService, private enrollmentService: EnrollmentService, private reportService: ReportService, private notification: NotificationService) {}

  ngOnInit() { this.loadTrainees(); }

  loadTrainees() {
    this.traineeService.getAllTraineesByFilter().subscribe({
      next: (res: any) => { this.allTrainees = res.items; this.filterTrainees(); },
      error: () => this.notification.showError('حدث خطأ')
    });
  }

  filterTrainees() {
    this.filteredTrainees = this.allTrainees.filter(t => {
      const matchSearch = !this.searchText || t.fullName.includes(this.searchText) || t.nationalId.includes(this.searchText);
      const matchGender = !this.genderFilter || t.gender?.id === this.genderFilter;
      const matchStatus = this.statusFilter === null || t.isActive === this.statusFilter;
      return matchSearch && matchGender && matchStatus;
    });
  }

  loadTraineeDetails() {
    if (!this.selectedTraineeId) return;
    this.traineeService.getTraineeById(this.selectedTraineeId).subscribe({
      next: (res: any) => { this.selectedTraineeDetails = res; },
      error: () => this.notification.showError('حدث خطأ')
    });
    this.enrollmentService.getAllEnrollmentsByFilter({ traineeId: this.selectedTraineeId }).subscribe({
      next: (res: any) => { this.traineeEnrollments = res.items; }
    });
  }

  exportToExcel() {
    const data = this.filteredTrainees.map((t, i) => ({ '#': i + 1, 'الاسم': t.fullName, 'رقم الهوية': t.nationalId, 'السنة الدراسية': t.academicYear, 'الجنس': t.gender?.title, 'الحالة': t.isActive ? 'نشط' : 'غير نشط', 'عدد الشهادات': t.certificates?.length || 0 }));
    this.reportService.exportToExcel(data, 'trainees-report', 'المتدربين');
    this.notification.showSuccess('تم تصدير التقرير بنجاح');
  }

exportToPDF() {
  const doc = new jsPDF('p', 'mm', 'a4');
  
  doc.setFontSize(18);
  doc.text('تقرير المتدربين', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
  
  autoTable(doc, {
    head: [['#', 'الاسم', 'رقم الهوية', 'السنة الدراسية', 'الجنس', 'الحالة', 'عدد الشهادات']],
    body: this.filteredTrainees.map((t, i) => [
      (i + 1).toString(),
      t.fullName || '-',
      t.nationalId || '-',
      t.academicYear || '-',
      t.gender?.title || '-',
      t.isActive ? 'نشط' : 'غير نشط',
      (t.certificates?.length || 0).toString()
    ]),
    startY: 35,
    styles: { halign: 'right', font: 'helvetica' },
    headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], halign: 'right' }
  });
  
  doc.save('trainees-report.pdf');
  this.notification.showSuccess('تم تصدير التقرير بنجاح');
}
}