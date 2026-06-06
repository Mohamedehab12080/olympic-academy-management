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

import { FinancialService } from '../../../../core/services/financial.service';
import { ReportService } from '../../../../core/services/report.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-financial-report',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatDatepickerModule, MatNativeDateModule, MatButtonModule,
    MatSelectModule, MatIconModule, MatTabsModule
  ],
  template: `
    <div class="report-container">
      <mat-card>
        <div class="report-header">
          <h2>التقارير المالية</h2>
        </div>

        <mat-tab-group>
          <!-- تبويب الإيرادات -->
          <mat-tab label="الإيرادات">
            <div class="filters">
              <mat-form-field appearance="outline">
                <mat-label>من تاريخ</mat-label>
                <input matInput [matDatepicker]="startPicker" [(ngModel)]="revenueFilters.startDate">
                <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
                <mat-datepicker #startPicker></mat-datepicker>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>إلى تاريخ</mat-label>
                <input matInput [matDatepicker]="endPicker" [(ngModel)]="revenueFilters.endDate">
                <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
                <mat-datepicker #endPicker></mat-datepicker>
              </mat-form-field>
              <div class="actions">
                <button mat-raised-button color="primary" (click)="loadRevenueReport()">
                  <mat-icon>search</mat-icon> عرض
                </button>
                <button mat-raised-button color="accent" (click)="exportRevenueToExcel()">
                  <mat-icon>table_chart</mat-icon> Excel
                </button>
                <button mat-raised-button color="warn" (click)="exportRevenueToPDF()">
                  <mat-icon>picture_as_pdf</mat-icon> PDF
                </button>
              </div>
            </div>

            <div class="summary-cards" *ngIf="revenueData.length">
              <div class="summary-card">
                <h3>إجمالي الإيرادات</h3>
                <p class="amount">{{ totalRevenue | currency:'EGP' }}</p>
              </div>
              <div class="summary-card">
                <h3>عدد المعاملات</h3>
                <p class="count">{{ revenueData.length }}</p>
              </div>
              <div class="summary-card">
                <h3>متوسط الإيرادات</h3>
                <p class="amount">{{ avgRevenue | currency:'EGP' }}</p>
              </div>
            </div>

            <div class="table-container" *ngIf="revenueData.length">
              <table>
                <thead>
                  <tr><th>#</th><th>التسجيل</th><th>المبلغ المدفوع</th><th>تاريخ الدفع</th><th>طريقة الدفع</th><th>الحالة</th></tr>
                </thead>
                <tbody>
                  <tr *ngFor="let item of revenueData; let i = index">
                    <td>{{ i+1 }}</td>
                    <td>{{ item.enrollment?.title }}</td>
                    <td>{{ item.paidAmount | currency:'EGP' }}</td>
                    <td>{{ item.paymentDate | date }}</td>
                    <td>{{ item.paymentMethod?.title }}</td>
                    <td><span class="status-badge">{{ item.paymentStatus?.title }}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="no-data" *ngIf="!revenueData.length && revenueLoaded">
              <p>لا توجد بيانات</p>
            </div>
          </mat-tab>

          <!-- تبويب المصروفات -->
          <mat-tab label="المصروفات">
            <div class="filters">
              <mat-form-field appearance="outline">
                <mat-label>من تاريخ</mat-label>
                <input matInput [matDatepicker]="expStartPicker" [(ngModel)]="expenseFilters.startDate">
                <mat-datepicker-toggle matSuffix [for]="expStartPicker"></mat-datepicker-toggle>
                <mat-datepicker #expStartPicker></mat-datepicker>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>إلى تاريخ</mat-label>
                <input matInput [matDatepicker]="expEndPicker" [(ngModel)]="expenseFilters.endDate">
                <mat-datepicker-toggle matSuffix [for]="expEndPicker"></mat-datepicker-toggle>
                <mat-datepicker #expEndPicker></mat-datepicker>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>نوع المصروف</mat-label>
                <mat-select [(ngModel)]="expenseFilters.expenseTypeId">
                  <mat-option [value]="null">الكل</mat-option>
                  <mat-option *ngFor="let type of expenseTypes" [value]="type.id">{{ type.title }}</mat-option>
                </mat-select>
              </mat-form-field>
              <div class="actions">
                <button mat-raised-button color="primary" (click)="loadExpenseReport()">
                  <mat-icon>search</mat-icon> عرض
                </button>
                <button mat-raised-button color="accent" (click)="exportExpenseToExcel()">
                  <mat-icon>table_chart</mat-icon> Excel
                </button>
                <button mat-raised-button color="warn" (click)="exportExpenseToPDF()">
                  <mat-icon>picture_as_pdf</mat-icon> PDF
                </button>
              </div>
            </div>

            <div class="summary-cards" *ngIf="expenseData.length">
              <div class="summary-card">
                <h3>إجمالي المصروفات</h3>
                <p class="amount">{{ totalExpense | currency:'EGP' }}</p>
              </div>
              <div class="summary-card">
                <h3>عدد المصروفات</h3>
                <p class="count">{{ expenseData.length }}</p>
              </div>
            </div>

            <div class="table-container" *ngIf="expenseData.length">
              <table>
                <thead><tr><th>#</th><th>النوع</th><th>المبلغ</th><th>التاريخ</th><th>طريقة الدفع</th><th>ملاحظات</th></tr></thead>
                <tbody>
                  <tr *ngFor="let item of expenseData; let i = index">
                    <td>{{ i+1 }}</td>
                    <td>{{ item.expenseType?.title }}</td>
                    <td>{{ item.amountExpensed | currency:'EGP' }}</td>
                    <td>{{ item.expenseDate | date }}</td>
                    <td>{{ item.paymentMethod?.title }}</td>
                    <td>{{ item.note || '-' }}</td>
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
    .actions { display: flex; gap: 12px; }
    .summary-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 24px; }
    .summary-card { background: white; border-radius: 12px; padding: 20px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .summary-card h3 { margin: 0 0 8px; font-size: 14px; color: #6b7280; }
    .summary-card .amount { font-size: 24px; font-weight: bold; color: #10b981; margin: 0; }
    .summary-card .count { font-size: 24px; font-weight: bold; color: #2563eb; margin: 0; }
    .table-container { overflow-x: auto; background: white; border-radius: 12px; padding: 16px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 12px; text-align: right; border-bottom: 1px solid #e5e7eb; }
    th { background: #f9fafb; font-weight: 600; }
    .status-badge { padding: 4px 8px; border-radius: 20px; font-size: 12px; background: #d1fae5; color: #065f46; }
    .no-data { text-align: center; padding: 40px; color: #6b7280; }
  `]
})
export class FinancialReportComponent implements OnInit {
  revenueData: any[] = [];
  expenseData: any[] = [];
  expenseTypes: any[] = [];
  revenueLoaded = false;
  
  revenueFilters = { startDate: '', endDate: '' };
  expenseFilters = { startDate: '', endDate: '', expenseTypeId: null };
  
  get totalRevenue() { return this.revenueData.reduce((sum, i) => sum + (i.paidAmount || 0), 0); }
  get avgRevenue() { return this.revenueData.length ? this.totalRevenue / this.revenueData.length : 0; }
  get totalExpense() { return this.expenseData.reduce((sum, i) => sum + (i.amountExpensed || 0), 0); }

  constructor(
    private financialService: FinancialService,
    private reportService: ReportService,
    private notification: NotificationService
  ) {}

  ngOnInit() {
    this.loadExpenseTypes();
  }

  loadExpenseTypes() {
    this.financialService.getAllExpenseTypesLookup().subscribe((res: any) => this.expenseTypes = res.list);
  }

  loadRevenueReport() {
    const params: any = {};
    if (this.revenueFilters.startDate) params.paymentDateFrom = this.revenueFilters.startDate;
    if (this.revenueFilters.endDate) params.paymentDateTo = this.revenueFilters.endDate;
    this.financialService.getAllEnrollmentPaymentsByFilter(params).subscribe({
      next: (res: any) => { this.revenueData = res.items; this.revenueLoaded = true; },
      error: () => this.notification.showError('حدث خطأ')
    });
  }

  loadExpenseReport() {
    const params: any = {};
    if (this.expenseFilters.startDate) params.expenseDateFrom = this.expenseFilters.startDate;
    if (this.expenseFilters.endDate) params.expenseDateTo = this.expenseFilters.endDate;
    if (this.expenseFilters.expenseTypeId) params.expenseTypeId = this.expenseFilters.expenseTypeId;
    this.financialService.getAllExpensesByFilter(params).subscribe({
      next: (res: any) => { this.expenseData = res.items; },
      error: () => this.notification.showError('حدث خطأ')
    });
  }

  exportRevenueToExcel() {
    const data = this.revenueData.map((item, i) => ({
      '#': i + 1,
      'التسجيل': item.enrollment?.title,
      'المبلغ': item.paidAmount,
      'التاريخ': item.paymentDate,
      'طريقة الدفع': item.paymentMethod?.title,
      'الحالة': item.paymentStatus?.title
    }));
    this.reportService.exportToExcel(data, 'revenue-report', 'الإيرادات');
    this.notification.showSuccess('تم تصدير التقرير بنجاح');
  }

exportRevenueToPDF() {
  const doc = new jsPDF('p', 'mm', 'a4');
  
  doc.setFontSize(18);
  doc.text('تقرير الإيرادات', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
  doc.setFontSize(12);
  doc.text(`إجمالي الإيرادات: ${this.totalRevenue} جم`, 14, 35);
  doc.text(`عدد المعاملات: ${this.revenueData.length}`, 14, 42);
  
  autoTable(doc, {
    head: [['#', 'التسجيل', 'المبلغ', 'تاريخ الدفع', 'طريقة الدفع', 'الحالة']],
    body: this.revenueData.map((item, i) => [
      (i + 1).toString(),
      item.enrollment?.title || '-',
      `${item.paidAmount || 0} جم`,
      item.paymentDate || '-',
      item.paymentMethod?.title || '-',
      item.paymentStatus?.title || '-'
    ]),
    startY: 55,
    styles: { halign: 'right', font: 'helvetica' },
    headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], halign: 'right' }
  });
  
  doc.save('revenue-report.pdf');
  this.notification.showSuccess('تم تصدير التقرير بنجاح');
}

  exportExpenseToExcel() {
    const data = this.expenseData.map((item, i) => ({
      '#': i + 1,
      'النوع': item.expenseType?.title,
      'المبلغ': item.amountExpensed,
      'التاريخ': item.expenseDate,
      'طريقة الدفع': item.paymentMethod?.title,
      'ملاحظات': item.note
    }));
    this.reportService.exportToExcel(data, 'expense-report', 'المصروفات');
    this.notification.showSuccess('تم تصدير التقرير بنجاح');
  }

  exportExpenseToPDF() {
  const doc = new jsPDF('p', 'mm', 'a4');
  
  doc.setFontSize(18);
  doc.text('تقرير المصروفات', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
  doc.setFontSize(12);
  doc.text(`إجمالي المصروفات: ${this.totalExpense} جم`, 14, 35);
  doc.text(`عدد المصروفات: ${this.expenseData.length}`, 14, 42);
  
  autoTable(doc, {
    head: [['#', 'النوع', 'المبلغ', 'التاريخ', 'طريقة الدفع', 'ملاحظات']],
    body: this.expenseData.map((item, i) => [
      (i + 1).toString(),
      item.expenseType?.title || '-',
      `${item.amountExpensed || 0} جم`,
      item.expenseDate || '-',
      item.paymentMethod?.title || '-',
      item.note || '-'
    ]),
    startY: 55,
    styles: { halign: 'right', font: 'helvetica' },
    headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], halign: 'right' }
  });
  
  doc.save('expense-report.pdf');
  this.notification.showSuccess('تم تصدير التقرير بنجاح');
}

}