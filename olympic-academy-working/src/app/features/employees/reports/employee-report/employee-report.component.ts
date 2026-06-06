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

import { EmployeeService } from '../../../../core/services/employee.service';
import { ReportService } from '../../../../core/services/report.service';
import { NotificationService } from '../../../../core/services/notification.service';
import {EMPLOYEE_TYPES} from '../../../../core/models/employee.model';
import { GENDERS } from '../../../../core/models/common.model';
import { AttendanceReportComponent } from '../attendance-report/attendance-report.component';

@Component({
  selector: 'app-employee-report',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatIconModule],
  template: `
    <div class="report-container">
      <mat-card>
        <div class="report-header"><h2>تقارير الموظفين</h2></div>
        <div class="filters">
          <mat-form-field appearance="outline"><mat-label>بحث</mat-label><input matInput [(ngModel)]="searchText" (ngModelChange)="filterEmployees()" placeholder="اسم أو هوية"></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>نوع الموظف</mat-label><mat-select [(ngModel)]="typeFilter" (selectionChange)="filterEmployees()"><mat-option [value]="null">الكل</mat-option><mat-option *ngFor="let t of employeeTypes" [value]="t.id">{{ t.title }}</mat-option></mat-select></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>الجنس</mat-label><mat-select [(ngModel)]="genderFilter" (selectionChange)="filterEmployees()"><mat-option [value]="null">الكل</mat-option><mat-option *ngFor="let g of genders" [value]="g.id">{{ g.title }}</mat-option></mat-select></mat-form-field>
          <div class="actions"><button mat-raised-button color="primary" (click)="loadEmployees()"><mat-icon>search</mat-icon> عرض</button><button mat-raised-button color="accent" (click)="exportToExcel()"><mat-icon>table_chart</mat-icon> Excel</button><button mat-raised-button color="warn" (click)="exportToPDF()"><mat-icon>picture_as_pdf</mat-icon> PDF</button></div>
        </div>
        <div class="summary-cards"><div class="summary-card"><h3>إجمالي الموظفين</h3><p>{{ allEmployees.length }}</p></div><div class="summary-card success"><h3>مدربين</h3><p>{{ trainerCount }}</p></div><div class="summary-card warning"><h3>مديرين</h3><p>{{ managerCount }}</p></div></div>
        <div class="table-container"><table><thead><tr><th>#</th><th>الاسم</th><th>رقم الهوية</th><th>النوع</th><th>الجنس</th><th>تاريخ التوظيف</th><th>الأقسام</th><th>الحالة</th></tr></thead>
        <tbody><tr *ngFor="let e of filteredEmployees; let i=index"><td>{{ i+1 }}</td><td>{{ e.fullName }}</td><td>{{ e.nationalId }}<td>{{ e.employeeType?.title }}</td><td>{{ e.gender?.title }}</td><td>{{ e.hireDate | date }}</td><td><span *ngFor="let d of e.departments" class="dept-chip">{{ d.title }}</span></td><td><span class="badge" [class.active]="e.isActive">{{ e.isActive ? 'نشط' : 'غير نشط' }}</span></td></tr></tbody></table></div>
      </mat-card>
    </div>
  `,
  styles: [`
    .report-container { padding: 24px; max-width: 1200px; margin: 0 auto; }
    .filters { display: flex; flex-wrap: wrap; gap: 16px; align-items: center; margin-bottom: 24px; padding: 16px; background: #f9fafb; border-radius: 12px; }
    .filters mat-form-field { flex: 1; min-width: 150px; }
    .actions { display: flex; gap: 12px; }
    .summary-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 24px; }
    .summary-card { background: white; border-radius: 12px; padding: 20px; text-align: center; }
    .summary-card p { font-size: 24px; font-weight: bold; margin: 0; }
    .summary-card.success p { color: #10b981; }
    .summary-card.warning p { color: #f59e0b; }
    .table-container { overflow-x: auto; background: white; border-radius: 12px; padding: 16px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 12px; text-align: right; border-bottom: 1px solid #e5e7eb; }
    th { background: #f9fafb; font-weight: 600; }
    .dept-chip { display: inline-block; background: #e5e7eb; padding: 2px 8px; border-radius: 16px; margin: 2px; font-size: 12px; }
    .badge.active { background: #d1fae5; color: #065f46; padding: 4px 12px; border-radius: 20px; font-size: 12px; }
    .badge { background: #fee2e2; color: #991b1b; padding: 4px 12px; border-radius: 20px; font-size: 12px; }
  `]
})
export class EmployeeReportComponent implements OnInit {
  allEmployees: any[] = [];
  filteredEmployees: any[] = [];
  employeeTypes = EMPLOYEE_TYPES;
  genders = GENDERS;
  searchText = '';
  typeFilter: number | null = null;
  genderFilter: number | null = null;

  get trainerCount() { return this.allEmployees.filter(e => e.employeeType?.id === 1).length; }
  get managerCount() { return this.allEmployees.filter(e => e.employeeType?.id === 2).length; }

  constructor(private employeeService: EmployeeService, private reportService: ReportService, private notification: NotificationService) {}

  ngOnInit() { this.loadEmployees(); }

  loadEmployees() {
    this.employeeService.getAllEmployees().subscribe({
      next: (res: any) => { this.allEmployees = res.items; this.filterEmployees(); },
      error: () => this.notification.showError('حدث خطأ')
    });
  }

  filterEmployees() {
    this.filteredEmployees = this.allEmployees.filter(e => {
      const matchSearch = !this.searchText || e.fullName.includes(this.searchText) || e.nationalId.includes(this.searchText);
      const matchType = !this.typeFilter || e.employeeType?.id === this.typeFilter;
      const matchGender = !this.genderFilter || e.gender?.id === this.genderFilter;
      return matchSearch && matchType && matchGender;
    });
  }

  exportToExcel() {
    const data = this.filteredEmployees.map((e, i) => ({ '#': i + 1, 'الاسم': e.fullName, 'رقم الهوية': e.nationalId, 'النوع': e.employeeType?.title, 'الجنس': e.gender?.title, 'تاريخ التوظيف': e.hireDate, 'الأقسام': e.departments.map((d: any) => d.title).join(', '), 'الحالة': e.isActive ? 'نشط' : 'غير نشط' }));
    this.reportService.exportToExcel(data, 'employees-report', 'الموظفين');
    this.notification.showSuccess('تم تصدير التقرير بنجاح');
  }

exportToPDF() {
  const doc = new jsPDF('p', 'mm', 'a4');
  
  // إضافة نص بالعربية (يدعم RTL)
  doc.setFont('helvetica');
  doc.setFontSize(18);
  doc.text('تقرير الموظفين', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
  
  autoTable(doc, {
    head: [['#', 'الاسم', 'رقم الهوية', 'النوع', 'الجنس', 'تاريخ التوظيف', 'الأقسام', 'الحالة']],
    body: this.filteredEmployees.map((e, i) => [
      (i + 1).toString(),
      e.fullName || '-',
      e.nationalId || '-',
      e.employeeType?.title || '-',
      e.gender?.title || '-',
      e.hireDate || '-',
      e.departments.map((d: any) => d.title).join(', ') || '-',
      e.isActive ? 'نشط' : 'غير نشط'
    ]),
    startY: 35,
    styles: { halign: 'right', cellPadding: 3, font: 'helvetica' },
    headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], halign: 'right' },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 40 },
      2: { cellWidth: 35 },
      3: { cellWidth: 25 },
      4: { cellWidth: 20 },
      5: { cellWidth: 30 },
      6: { cellWidth: 50 },
      7: { cellWidth: 20 }
    }
  });
  
  doc.save('employees-report.pdf');
  this.notification.showSuccess('تم تصدير التقرير بنجاح');
}
}