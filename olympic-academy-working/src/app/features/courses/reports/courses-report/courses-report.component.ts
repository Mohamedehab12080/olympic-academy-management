import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { CourseService } from '../../../../core/services/course.service';
import { EnrollmentService } from '../../../../core/services/enrollment.service';
import { ReportService } from '../../../../core/services/report.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { COURSE_TYPES } from '../../../../core/models/course.model';

@Component({
  selector: 'app-course-report',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatIconModule],
  template: `
    <div class="report-container">
      <mat-card>
        <div class="report-header"><h2>تقارير الدورات</h2></div>
        <div class="filters">
          <mat-form-field appearance="outline"><mat-label>بحث</mat-label><input matInput [(ngModel)]="searchText" (ngModelChange)="filterCourses()" placeholder="اسم الدورة"></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>نوع الدورة</mat-label><mat-select [(ngModel)]="typeFilter" (selectionChange)="filterCourses()"><mat-option [value]="null">الكل</mat-option><mat-option *ngFor="let t of courseTypes" [value]="t.id">{{ t.title }}</mat-option></mat-select></mat-form-field>
          <div class="actions"><button mat-raised-button color="primary" (click)="loadCourses()"><mat-icon>search</mat-icon> عرض</button><button mat-raised-button color="accent" (click)="exportToExcel()"><mat-icon>table_chart</mat-icon> Excel</button><button mat-raised-button color="warn" (click)="exportToPDF()"><mat-icon>picture_as_pdf</mat-icon> PDF</button></div>
        </div>
        <div class="summary-cards"><div class="summary-card"><h3>إجمالي الدورات</h3><p>{{ allCourses.length }}</p></div><div class="summary-card success"><h3>تأهيل</h3><p>{{ qualCount }}</p></div><div class="summary-card warning"><h3>تدريب</h3><p>{{ trainCount }}</p></div><div class="summary-card primary"><h3>إجمالي الإيرادات</h3><p>{{ totalRevenue | currency:'EGP' }}</p></div></div>
        <div class="table-container"><table><thead><tr><th>#</th><th>اسم الدورة</th><th>القسم</th><th>النوع</th><th>المدة</th><th>السعر</th><th>عدد المسجلين</th><th>الإيرادات</th><th>الحالة</th></tr></thead>
        <tbody><tr *ngFor="let c of filteredCourses; let i=index"><td>{{ i+1 }}</td><td>{{ c.title }}</td><td>{{ c.department?.title }}</td><td>{{ c.courseType?.title }}</td><td>{{ c.duration }} ساعة</td><td>{{ c.price | currency:'EGP' }}</td><td>{{ c.enrollmentsCount || 0 }}</td><td>{{ c.totalRevenue || 0 | currency:'EGP' }}</td><td><span class="badge" [class.active]="c.isActive">{{ c.isActive ? 'نشطة' : 'غير نشطة' }}</span></td></tr></tbody></table></div>
      </mat-card>
    </div>
  `,
  styles: [`
    .report-container { padding: 24px; max-width: 1200px; margin: 0 auto; }
    .filters { display: flex; flex-wrap: wrap; gap: 16px; align-items: center; margin-bottom: 24px; padding: 16px; background: #f9fafb; border-radius: 12px; }
    .filters mat-form-field { flex: 1; min-width: 200px; }
    .actions { display: flex; gap: 12px; }
    .summary-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 24px; }
    .summary-card { background: white; border-radius: 12px; padding: 20px; text-align: center; }
    .summary-card p { font-size: 24px; font-weight: bold; margin: 0; }
    .summary-card.success p { color: #10b981; }
    .summary-card.warning p { color: #f59e0b; }
    .summary-card.primary p { color: #2563eb; }
    .table-container { overflow-x: auto; background: white; border-radius: 12px; padding: 16px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 12px; text-align: right; border-bottom: 1px solid #e5e7eb; }
    th { background: #f9fafb; font-weight: 600; }
    .badge.active { background: #d1fae5; color: #065f46; padding: 4px 12px; border-radius: 20px; font-size: 12px; }
  `]
})
export class CourseReportComponent implements OnInit {
  allCourses: any[] = [];
  filteredCourses: any[] = [];
  courseTypes = COURSE_TYPES;
  searchText = '';
  typeFilter: number | null = null;

  get qualCount() { return this.allCourses.filter(c => c.courseType?.id === 1).length; }
  get trainCount() { return this.allCourses.filter(c => c.courseType?.id === 2).length; }
  get totalRevenue() { return this.allCourses.reduce((sum, c) => sum + (c.totalRevenue || 0), 0); }

  constructor(private courseService: CourseService, private enrollmentService: EnrollmentService, private reportService: ReportService, private notification: NotificationService) {}

  ngOnInit() { this.loadCourses(); }

  loadCourses() {
    this.courseService.getAllCourses().subscribe({
      next: (res: any) => {
        this.allCourses = res.items;
        this.allCourses.forEach(course => {
          this.enrollmentService.getAllEnrollmentsByFilter({ courseId: course.id }).subscribe((enrollments: any) => {
            course.enrollmentsCount = enrollments.items.length;
            course.totalRevenue = enrollments.items.reduce((sum: number, e: any) => sum + (e.finalSubscriptionValue || 0), 0);
            this.filterCourses();
          });
        });
      },
      error: () => this.notification.showError('حدث خطأ')
    });
  }

  filterCourses() {
    this.filteredCourses = this.allCourses.filter(c => {
      const matchSearch = !this.searchText || c.title.includes(this.searchText);
      const matchType = !this.typeFilter || c.courseType?.id === this.typeFilter;
      return matchSearch && matchType;
    });
  }

  exportToExcel() {
    const data = this.filteredCourses.map((c, i) => ({ '#': i + 1, 'اسم الدورة': c.title, 'القسم': c.department?.title, 'النوع': c.courseType?.title, 'المدة': `${c.duration} ساعة`, 'السعر': c.price, 'عدد المسجلين': c.enrollmentsCount || 0, 'الإيرادات': c.totalRevenue || 0, 'الحالة': c.isActive ? 'نشطة' : 'غير نشطة' }));
    this.reportService.exportToExcel(data, 'courses-report', 'الدورات');
    this.notification.showSuccess('تم تصدير التقرير بنجاح');
  }

 exportToPDF() {
  const doc = new jsPDF('p', 'mm', 'a4');
  
  doc.setFontSize(18);
  doc.text('تقرير الدورات', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
  
  autoTable(doc, {
    head: [['#', 'اسم الدورة', 'القسم', 'النوع', 'المدة', 'السعر', 'عدد المسجلين', 'الإيرادات', 'الحالة']],
    body: this.filteredCourses.map((c, i) => [
      (i + 1).toString(),
      c.title || '-',
      c.department?.title || '-',
      c.courseType?.title || '-',
      `${c.duration || 0} ساعة`,
      `${c.price || 0} جم`,
      (c.enrollmentsCount || 0).toString(),
      `${c.totalRevenue || 0} جم`,
      c.isActive ? 'نشطة' : 'غير نشطة'
    ]),
    startY: 35,
    styles: { halign: 'right', font: 'helvetica', cellPadding: 3 },
    headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], halign: 'right' }
  });
  
  doc.save('courses-report.pdf');
  this.notification.showSuccess('تم تصدير التقرير بنجاح');
}
}