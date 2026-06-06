import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { EmployeeService } from '../../../../core/services/employee.service';
import { ReportService } from '../../../../core/services/report.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-attendance-report',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatDatepickerModule, MatNativeDateModule, MatButtonModule, MatIconModule
  ],
  template: `
    <div class="report-container">
      <mat-card>
        <div class="report-header"><h2>تقرير الحضور اليومي</h2></div>
        <div class="filters">
          <mat-form-field appearance="outline">
            <mat-label>اختر التاريخ</mat-label>
            <input matInput [matDatepicker]="datePicker" [(ngModel)]="selectedDate">
            <mat-datepicker-toggle matSuffix [for]="datePicker"></mat-datepicker-toggle>
            <mat-datepicker #datePicker></mat-datepicker>
          </mat-form-field>
          <div class="actions">
            <button mat-raised-button color="primary" (click)="loadReport()"><mat-icon>search</mat-icon> عرض</button>
            <button mat-raised-button color="accent" (click)="exportToExcel()"><mat-icon>table_chart</mat-icon> Excel</button>
            <button mat-raised-button color="warn" (click)="exportToPDF()"><mat-icon>picture_as_pdf</mat-icon> PDF</button>
          </div>
        </div>

        <div class="summary-cards" *ngIf="reportData">
          <div class="summary-card"><h3>إجمالي الموظفين</h3><p>{{ reportData.totalEmployees }}</p></div>
          <div class="summary-card success"><h3>الحضور</h3><p>{{ reportData.present }}</p></div>
          <div class="summary-card danger"><h3>الغياب</h3><p>{{ reportData.absent }}</p></div>
          <div class="summary-card warning"><h3>التأخير</h3><p>{{ reportData.late }}</p></div>
          <div class="summary-card info"><h3>المعذورين</h3><p>{{ reportData.excused }}</p></div>
          <div class="summary-card primary"><h3>نسبة الحضور</h3><p>{{ reportData.attendanceRate }}%</p></div>
        </div>

        <div class="table-container" *ngIf="reportData?.details?.length">
          <table><thead><tr><th>#</th><th>الموظف</th><th>حالة الحضور</th><th>وقت الدخول</th><th>وقت الخروج</th><th>وقت التأخير</th></tr></thead>
          <tbody><tr *ngFor="let item of reportData.details; let i=index"><td>{{ i+1 }}</td><td>{{ item.employee?.fullName }}</td><td>{{ item.status?.title }}</td><td>{{ item.checkInTime }}</td><td>{{ item.checkOutTime || '-' }}</td><td>{{ item.lateTime ? item.lateTime + ' دقيقة' : '-' }}</td></tr></tbody>
          </table>
        </div>
        <div class="no-data" *ngIf="reportData && !reportData.details?.length"><p>لا توجد بيانات للحضور في هذا التاريخ</p></div>
      </mat-card>
    </div>
  `,
  styles: [`
    .report-container { padding: 24px; max-width: 1200px; margin: 0 auto; }
    .filters { display: flex; flex-wrap: wrap; gap: 16px; align-items: center; margin-bottom: 24px; padding: 16px; background: #f9fafb; border-radius: 12px; }
    .filters mat-form-field { width: 250px; }
    .actions { display: flex; gap: 12px; }
    .summary-cards { display: grid; grid-template-columns: repeat(6, 1fr); gap: 16px; margin-bottom: 24px; }
    .summary-card { background: white; border-radius: 12px; padding: 16px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .summary-card h3 { margin: 0 0 8px; font-size: 14px; color: #6b7280; }
    .summary-card p { font-size: 24px; font-weight: bold; margin: 0; }
    .summary-card.success p { color: #10b981; }
    .summary-card.danger p { color: #ef4444; }
    .summary-card.warning p { color: #f59e0b; }
    .summary-card.info p { color: #3b82f6; }
    .summary-card.primary p { color: #2563eb; }
    .table-container { overflow-x: auto; background: white; border-radius: 12px; padding: 16px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 12px; text-align: right; border-bottom: 1px solid #e5e7eb; }
    th { background: #f9fafb; font-weight: 600; }
    .no-data { text-align: center; padding: 40px; color: #6b7280; }
  `]
})
export class AttendanceReportComponent {
  selectedDate = new Date().toISOString().split('T')[0];
  reportData: any = null;

  constructor(
    private employeeService: EmployeeService,
    private reportService: ReportService,
    private notification: NotificationService
  ) {}

  loadReport() {
    this.employeeService.getDailyAttendanceReport(this.selectedDate).subscribe({
      next: (res) => { this.reportData = res; },
      error: () => this.notification.showError('حدث خطأ')
    });
  }

  exportToExcel() {
    const data = this.reportData.details.map((item: any, i: number) => ({
      '#': i + 1,
      'الموظف': item.employee?.fullName,
      'حالة الحضور': item.status?.title,
      'وقت الدخول': item.checkInTime,
      'وقت الخروج': item.checkOutTime || '-',
      'وقت التأخير': item.lateTime ? `${item.lateTime} دقيقة` : '-'
    }));
    this.reportService.exportToExcel(data, `attendance-${this.selectedDate}`, 'الحضور');
    this.notification.showSuccess('تم تصدير التقرير بنجاح');
  }

exportToPDF() {
  if (!this.reportData?.details) { this.notification.showWarning('لا توجد بيانات'); return; }
  
  const doc = new jsPDF('p', 'mm', 'a4');
  
  doc.setFontSize(18);
  doc.text(`تقرير الحضور اليومي - ${this.selectedDate}`, doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
  doc.setFontSize(12);
  doc.text(`إجمالي الموظفين: ${this.reportData.totalEmployees}`, 14, 35);
  doc.text(`الحضور: ${this.reportData.present}`, 14, 42);
  doc.text(`الغياب: ${this.reportData.absent}`, 14, 49);
  doc.text(`التأخير: ${this.reportData.late}`, 14, 56);
  doc.text(`المعذورين: ${this.reportData.excused}`, 14, 63);
  doc.text(`نسبة الحضور: ${this.reportData.attendanceRate}%`, 14, 70);
  
  autoTable(doc, {
    head: [['#', 'الموظف', 'حالة الحضور', 'وقت الدخول', 'وقت الخروج', 'وقت التأخير']],
    body: this.reportData.details.map((item: any, i: number) => [
      (i + 1).toString(),
      item.employee?.fullName || '-',
      item.status?.title || '-',
      item.checkInTime || '-',
      item.checkOutTime || '-',
      item.lateTime ? `${item.lateTime} دقيقة` : '-'
    ]),
    startY: 80,
    styles: { halign: 'right', font: 'helvetica' },
    headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], halign: 'right' }
  });
  
  doc.save(`attendance-report-${this.selectedDate}.pdf`);
  this.notification.showSuccess('تم تصدير التقرير بنجاح');
}
}