import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { FinancialService } from '../../../../core/services/financial.service';
import { ReportService } from '../../../../core/services/report.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { FinancialTotalVTO } from '../../../../core/models/financial.model';

@Component({
  selector: 'app-financial-report',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="report-container">
      <mat-card>
        <div class="report-header">
          <h2>التقارير المالية</h2>
          <p class="subtitle">إحصائيات وملخصات المعاملات المالية</p>
        </div>

        <!-- Date Filter -->
        <div class="filters-section">
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
            <div class="actions">
              <button mat-raised-button color="primary" (click)="loadTotals()" [disabled]="isLoading">
                <mat-icon>search</mat-icon> عرض
              </button>
              <button mat-raised-button color="accent" (click)="exportToExcel()" [disabled]="!financialTotals">
                <mat-icon>table_chart</mat-icon> Excel
              </button>
              <button mat-raised-button color="accent" (click)="printReport()" [disabled]="!financialTotals">
                <mat-icon>print</mat-icon> طباعة
              </button>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div class="loading-container" *ngIf="isLoading">
          <mat-spinner diameter="40"></mat-spinner>
          <p>جاري تحميل البيانات...</p>
        </div>

        <!-- Financial Summary Cards -->
        <div class="summary-section" *ngIf="financialTotals && !isLoading">
          <div class="summary-grid">
            <div class="summary-card revenue">
              <div class="card-icon">💰</div>
              <div class="card-details">
                <span class="label">إجمالي الإيرادات</span>
                <span class="value">{{ getTotalRevenue() | number }} جم</span>
              </div>
            </div>
            <div class="summary-card expense">
              <div class="card-icon">📉</div>
              <div class="card-details">
                <span class="label">إجمالي المصروفات</span>
                <span class="value">{{ getTotalExpenses() | number }} جم</span>
              </div>
              <div class="card-details">
                <span class="label">اجمالي الاستردادات</span>
                <span class="value">{{ getTotalEnrollmentRefunds() | number }} جم</span>
              </div>
            </div>
            <div class="summary-card profit">
              <div class="card-icon">📊</div>
              <div class="card-details">
                <span class="label">صافي الربح</span>
                <span class="value">{{ getNetProfit() | number }} جم</span>
              </div>
            </div>
          </div>

          <div class="details-grid">
            <div class="details-card">
              <h3>📋 الإيرادات</h3>
              <div class="detail-row">
                <span>مدفوعات التسجيلات</span>
                <strong>{{ financialTotals.totalEnrollmentPayments | number }} جم</strong>
              </div>
              <div class="detail-row">
                <span>إيجارات الأماكن (إيراد)</span>
                <strong>{{ financialTotals.totalPlacesGained | number }} جم</strong>
              </div>
            </div>

            <div class="details-card">
              <h3>💸 المصروفات</h3>
              <div class="detail-row">
                <span>الرواتب</span>
                <strong>{{ financialTotals.totalSalary | number }} جم</strong>
              </div>
              <div class="detail-row">
                <span>الحوافز</span>
                <strong>{{ financialTotals.totalIncentives | number }} جم</strong>
              </div>
              <div class="detail-row">
                <span>إيجار المواقع (مصروف)</span>
                <strong>{{ financialTotals.totalPlacesRent | number }} جم</strong>
              </div>
              <div class="detail-row">
                <span>استردادات التسجيلات</span>
                <strong>{{ financialTotals.totalEnrollmentRefunds | number }} جم</strong>
              </div>
              <div class="detail-row">
                <span>المصروفات الأخرى</span>
                <strong>{{ financialTotals.totalExpenses | number }} جم</strong>
              </div>
            </div>

            <div class="details-card">
              <h3>📈 إحصائيات النشطة</h3>
              <div class="stat-row">
                <span>التسجيلات النشطة:</span>
                <strong>{{ financialTotals.activeEnrollmentsCount || 0 }}</strong>
              </div>
              <div class="stat-row">
                <span>الدورات النشطة:</span>
                <strong>{{ financialTotals.activeCoursesCount || 0 }}</strong>
              </div>
              <div class="stat-row">
                <span>المتدربين النشطين:</span>
                <strong>{{ financialTotals.activeTraineesCount || 0 }}</strong>
              </div>
              <div class="stat-row">
                <span>الموظفين النشطين:</span>
                <strong>{{ financialTotals.activeEmployeesCount || 0 }}</strong>
              </div>
            </div>

            <div class="details-card">
              <h3>⭕ إحصائيات غير النشطة</h3>
              <div class="stat-row">
                <span>التسجيلات غير النشطة:</span>
                <strong>{{ financialTotals.inactiveEnrollmentsCount || 0 }}</strong>
              </div>
              <div class="stat-row">
                <span>الدورات غير النشطة:</span>
                <strong>{{ financialTotals.inactiveCoursesCount || 0 }}</strong>
              </div>
              <div class="stat-row">
                <span>المتدربين غير النشطين:</span>
                <strong>{{ financialTotals.inactiveTraineesCount || 0 }}</strong>
              </div>
              <div class="stat-row">
                <span>الموظفين غير النشطين:</span>
                <strong>{{ financialTotals.inactiveEmployeesCount || 0 }}</strong>
              </div>
            </div>
          </div>
        </div>

        <!-- No Data Message -->
        <div class="no-data" *ngIf="!financialTotals && !isLoading">
          <mat-icon>bar_chart</mat-icon>
          <p>لا توجد بيانات</p>
          <button mat-raised-button color="primary" (click)="loadTotals()">عرض الإحصائيات</button>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .report-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
      background: #f5f7fa;
      min-height: calc(100vh - 64px);
    }

    .report-header {
      margin-bottom: 24px;
    }

    .report-header h2 {
      font-size: 24px;
      margin: 0 0 8px 0;
      color: #1f2937;
      font-weight: 700;
    }

    .report-header .subtitle {
      color: #6b7280;
      margin: 0;
      font-size: 14px;
    }

    .filters-section {
      background: white;
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 24px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .filters {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      align-items: flex-start;
    }

    .filters mat-form-field {
      flex: 1;
      min-width: 180px;
    }

    .actions {
      display: flex;
      gap: 12px;
    }

    .actions button {
      height: 56px;
      padding: 0 24px;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px;
      gap: 16px;
    }

    .loading-container p {
      color: #6b7280;
    }

    .summary-section {
      animation: fadeIn 0.3s ease-in;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 24px;
    }

    .summary-card {
      background: white;
      border-radius: 16px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .card-icon {
      font-size: 40px;
    }

    .card-details {
      flex: 1;
    }

    .card-details .label {
      font-size: 13px;
      color: #6b7280;
      display: block;
      margin-bottom: 4px;
    }

    .card-details .value {
      font-size: 24px;
      font-weight: 700;
    }

    .summary-card.revenue .card-details .value { color: #10b981; }
    .summary-card.expense .card-details .value { color: #ef4444; }
    .summary-card.profit .card-details .value { color: #3b82f6; }

    .details-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }

    .details-card {
      background: white;
      border-radius: 16px;
      padding: 20px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .details-card h3 {
      margin: 0 0 16px 0;
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 8px;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #f1f5f9;
    }

    .detail-row:last-child {
      border-bottom: none;
    }

    .detail-row span {
      font-size: 14px;
      color: #64748b;
    }

    .detail-row strong {
      font-size: 16px;
      color: #1f2937;
    }

    .stat-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #f1f5f9;
    }

    .stat-row:last-child {
      border-bottom: none;
    }

    .stat-row span {
      font-size: 14px;
      color: #64748b;
    }

    .stat-row strong {
      font-size: 18px;
      color: #3b82f6;
      font-weight: 700;
    }

    .no-data {
      text-align: center;
      padding: 60px;
      color: #9ca3af;
    }

    .no-data mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 16px;
      color: #d1d5db;
    }

    .no-data p {
      margin-bottom: 20px;
      font-size: 16px;
    }

    @media (max-width: 1024px) {
      .summary-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }
      .details-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .report-container {
        padding: 16px;
      }
      .filters {
        flex-direction: column;
      }
      .filters mat-form-field {
        width: 100%;
      }
      .actions {
        width: 100%;
        flex-direction: column;
      }
      .actions button {
        width: 100%;
      }
    }
  `]
})
export class FinancialReportComponent implements OnInit {
  financialTotals: FinancialTotalVTO | null = null;
  isLoading = false;
  
  filters = {
    startDate: null as Date | null,
    endDate: null as Date | null
  };

  constructor(
    private financialService: FinancialService,
    private reportService: ReportService,
    private notification: NotificationService
  ) {}

  ngOnInit() {
    this.loadTotals();
  }

  private formatDateToIso(date: Date | null): string | undefined {
    if (!date) return undefined;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private formatDateToArabic(date: Date | null): string {
    if (!date) return 'بداية';
    return date.toLocaleDateString('ar-EG');
  }

  loadTotals() {
    this.isLoading = true;
    
    const startDate = this.formatDateToIso(this.filters.startDate);
    const endDate = this.formatDateToIso(this.filters.endDate);
    
    this.financialService.getAllTotalsOfFinancials(startDate, endDate).subscribe({
      next: (res: FinancialTotalVTO) => {
        this.financialTotals = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading totals:', err);
        this.notification.showError('حدث خطأ في تحميل الإحصائيات');
        this.isLoading = false;
      }
    });
  }

  getTotalEnrollmentRefunds(): number {
    if(!this.financialTotals) return 0;
    return this.financialTotals.totalEnrollmentRefunds || 0;
  }

  getTotalRevenue(): number {
    if (!this.financialTotals) return 0;
    return (this.financialTotals.totalEnrollmentPayments || 0) + 
           (this.financialTotals.totalPlacesGained || 0);
  }

  getTotalExpenses(): number {
    if (!this.financialTotals) return 0;
    return (this.financialTotals.totalSalary || 0) + 
           (this.financialTotals.totalIncentives || 0) + 
           (this.financialTotals.totalPlacesRent || 0) +
           (this.financialTotals.totalExpenses || 0);
  }

  getNetProfit(): number {
    if (!this.financialTotals) return 0;
    return this.getTotalRevenue() - this.getTotalExpenses();
  }

  exportToExcel() {
    if (!this.financialTotals) {
      this.notification.showWarning('لا توجد بيانات لتصديرها');
      return;
    }

    const exportData = [
      { 'العنصر': 'إجمالي الإيرادات', 'القيمة': `${this.getTotalRevenue()} جم` },
      { 'العنصر': 'مدفوعات التسجيلات', 'القيمة': `${this.financialTotals.totalEnrollmentPayments || 0} جم` },
      { 'العنصر': 'إيجارات الأماكن (إيراد)', 'القيمة': `${this.financialTotals.totalPlacesGained || 0} جم` },
      { 'العنصر': '', 'القيمة': '' },
      { 'العنصر': 'إجمالي المصروفات', 'القيمة': `${this.getTotalExpenses()} جم` },
      { 'العنصر': 'إجمالي الاستردادات', 'القيمة': `${this.getTotalEnrollmentRefunds()} جم` },
      { 'العنصر': 'الرواتب', 'القيمة': `${this.financialTotals.totalSalary || 0} جم` },
      { 'العنصر': 'الحوافز', 'القيمة': `${this.financialTotals.totalIncentives || 0} جم` },
      { 'العنصر': 'إيجار المواقع (مصروف)', 'القيمة': `${this.financialTotals.totalPlacesRent || 0} جم` },
      { 'العنصر': 'الاستردادات', 'القيمة': `${this.financialTotals.totalEnrollmentRefunds || 0} جم` },
      { 'العنصر': 'المصروفات الأخرى', 'القيمة': `${this.financialTotals.totalExpenses || 0} جم` },
      { 'العنصر': '', 'القيمة': '' },
      { 'العنصر': 'صافي الربح', 'القيمة': `${this.getNetProfit()} جم` },
      { 'العنصر': '', 'القيمة': '' },
      { 'العنصر': 'التسجيلات النشطة', 'القيمة': `${this.financialTotals.activeEnrollmentsCount || 0}` },
      { 'العنصر': 'الدورات النشطة', 'القيمة': `${this.financialTotals.activeCoursesCount || 0}` },
      { 'العنصر': 'المتدربين النشطين', 'القيمة': `${this.financialTotals.activeTraineesCount || 0}` },
      { 'العنصر': 'الموظفين النشطين', 'القيمة': `${this.financialTotals.activeEmployeesCount || 0}` },
      { 'العنصر': 'التسجيلات غير النشطة', 'القيمة': `${this.financialTotals.inactiveEnrollmentsCount || 0}` },
      { 'العنصر': 'الدورات غير النشطة', 'القيمة': `${this.financialTotals.inactiveCoursesCount || 0}` },
      { 'العنصر': 'المتدربين غير النشطين', 'القيمة': `${this.financialTotals.inactiveTraineesCount || 0}` },
      { 'العنصر': 'الموظفين غير النشطين', 'القيمة': `${this.financialTotals.inactiveEmployeesCount || 0}` }
    ];

    this.reportService.exportToExcel(exportData, 'financial-totals-report', 'التقرير المالي الشامل');
    this.notification.showSuccess('تم تصدير التقرير بنجاح');
  }

  printReport() {
    if (!this.financialTotals) {
      this.notification.showWarning('لا توجد بيانات للطباعة');
      return;
    }

    const printWindow = window.open('', '_blank', 'width=900,height=700,scrollbars=yes,toolbar=yes,menubar=yes');
    
    if (!printWindow) {
      this.notification.showError('الرجاء السماح للنوافذ المنبثقة في المتصفح');
      return;
    }

    const startDateStr = this.formatDateToArabic(this.filters.startDate);
    const endDateStr = this.formatDateToArabic(this.filters.endDate);
    const dateRangeText = (this.filters.startDate || this.filters.endDate) 
      ? `الفترة: ${startDateStr} - ${endDateStr}`
      : 'الفترة: جميع الفترات';
    
    const totalRevenue = this.getTotalRevenue();
    const totalExpenses = this.getTotalExpenses();
    const totalEnrollmentRefunds = this.getTotalEnrollmentRefunds();
    const netProfit = this.getNetProfit();
    const totalPlacesGained = this.financialTotals.totalPlacesGained || 0;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>التقرير المالي الشامل</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif;
          }
          @page {
            size: A4 portrait;
            margin: 12mm;
          }
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            .no-print {
              display: none;
            }
          }
          body {
            background: white;
            padding: 20px;
            direction: rtl;
          }
          .report-container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
            padding: 15px;
            background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
            color: white;
            border-radius: 10px;
          }
          .header h1 {
            margin: 0;
            font-size: 20px;
          }
          .header p {
            margin: 5px 0 0 0;
            font-size: 11px;
            opacity: 0.8;
          }
          .date-range {
            text-align: center;
            margin-bottom: 15px;
            padding: 6px;
            background: #f3f4f6;
            border-radius: 6px;
            font-size: 11px;
          }
          .summary-grid {
            display: flex;
            gap: 15px;
            margin-bottom: 20px;
            justify-content: center;
          }
          .summary-card {
            flex: 1;
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            border-radius: 10px;
            padding: 15px;
            text-align: center;
            border: 1px solid #e2e8f0;
          }
          .summary-card h3 {
            font-size: 13px;
            color: #64748b;
            margin-bottom: 8px;
          }
          .summary-card .amount {
            font-size: 22px;
            font-weight: bold;
          }
          .summary-card.revenue .amount { color: #10b981; }
          .summary-card.expense .amount { color: #ef4444; }
          .summary-card.profit .amount { color: #3b82f6; }
          
          .info-grid {
            display: flex;
            gap: 15px;
            margin-bottom: 15px;
          }
          .info-card {
            flex: 1;
            background: white;
            border-radius: 10px;
            padding: 12px;
            border: 1px solid #e5e7eb;
          }
          .info-card h4 {
            font-size: 14px;
            font-weight: 600;
            color: #1f2937;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 6px;
            margin-bottom: 10px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
            font-size: 12px;
          }
          .info-row span:first-child {
            color: #64748b;
          }
          .info-row span:last-child {
            font-weight: 600;
            color: #1f2937;
          }
          .stat-value {
            color: #3b82f6;
            font-size: 16px;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            padding: 10px;
            font-size: 9px;
            color: #9ca3af;
            border-top: 1px solid #e5e7eb;
          }
          .print-btn {
            text-align: center;
            margin-top: 15px;
            padding: 8px;
          }
          .print-btn button {
            padding: 8px 20px;
            background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 12px;
          }
          @media (max-width: 700px) {
            .summary-grid, .info-grid {
              flex-direction: column;
            }
          }
        </style>
      </head>
      <body>
        <div class="report-container">
          <div class="header">
            <h1>التقرير المالي الشامل</h1>
            <p>نظام إدارة  الأكاديمية الأولمبية لعلوم الرياضة</p>
          </div>
          
          <div class="date-range">
            ${dateRangeText} | تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}
          </div>
          
          <div class="summary-grid">
            <div class="summary-card revenue">
              <h3>إجمالي الإيرادات</h3>
              <div class="amount">${totalRevenue.toLocaleString('ar-EG')} جم</div>
            </div>
            <div class="summary-card expense">
              <h3>إجمالي الاستردادات</h3>
              <div class="amount">${totalEnrollmentRefunds.toLocaleString('ar-EG')} جم</div>
            </div>
            <div class="summary-card expense">
              <h3>إجمالي المصروفات</h3>
              <div class="amount">${totalExpenses.toLocaleString('ar-EG')} جم</div>
            </div>
            <div class="summary-card profit">
              <h3>صافي الربح</h3>
              <div class="amount">${netProfit.toLocaleString('ar-EG')} جم</div>
            </div>
          </div>
          
          <div class="info-grid">
            <div class="info-card">
              <h4>📋 الإيرادات</h4>
              <div class="info-row">
                <span>مدفوعات التسجيلات:</span>
                <span>${(this.financialTotals.totalEnrollmentPayments || 0).toLocaleString('ar-EG')} جم</span>
              </div>
              <div class="info-row">
                <span>إيجارات الأماكن (إيراد):</span>
                <span>${(this.financialTotals.totalPlacesGained || 0).toLocaleString('ar-EG')} جم</span>
              </div>
            </div>
            
            <div class="info-card">
              <h4>💸 المصروفات</h4>
              <div class="info-row">
                <span>الرواتب:</span>
                <span>${(this.financialTotals.totalSalary || 0).toLocaleString('ar-EG')} جم</span>
              </div>
              <div class="info-row">
                <span>الحوافز:</span>
                <span>${(this.financialTotals.totalIncentives || 0).toLocaleString('ar-EG')} جم</span>
              </div>
              <div class="info-row">
                <span>إيجار المواقع (مصروف):</span>
                <span>${(this.financialTotals.totalPlacesRent || 0).toLocaleString('ar-EG')} جم</span>
              </div>
              <div class="info-row">
                <span>الاستردادات:</span>
                <span>${(this.financialTotals.totalEnrollmentRefunds || 0).toLocaleString('ar-EG')} جم</span>
              </div>
              <div class="info-row">
                <span>المصروفات الأخرى:</span>
                <span>${(this.financialTotals.totalExpenses || 0).toLocaleString('ar-EG')} جم</span>
              </div>
            </div>
          </div>
          
          <div class="info-grid">
            <div class="info-card">
              <h4>📈 إحصائيات النشطة</h4>
              <div class="info-row">
                <span>التسجيلات النشطة:</span>
                <span class="stat-value">${this.financialTotals.activeEnrollmentsCount || 0}</span>
              </div>
              <div class="info-row">
                <span>الدورات النشطة:</span>
                <span class="stat-value">${this.financialTotals.activeCoursesCount || 0}</span>
              </div>
              <div class="info-row">
                <span>المتدربين النشطين:</span>
                <span class="stat-value">${this.financialTotals.activeTraineesCount || 0}</span>
              </div>
              <div class="info-row">
                <span>الموظفين النشطين:</span>
                <span class="stat-value">${this.financialTotals.activeEmployeesCount || 0}</span>
              </div>
            </div>
            
            <div class="info-card">
              <h4>⭕ إحصائيات غير النشطة</h4>
              <div class="info-row">
                <span>التسجيلات غير النشطة:</span>
                <span class="stat-value">${this.financialTotals.inactiveEnrollmentsCount || 0}</span>
              </div>
              <div class="info-row">
                <span>الدورات غير النشطة:</span>
                <span class="stat-value">${this.financialTotals.inactiveCoursesCount || 0}</span>
              </div>
              <div class="info-row">
                <span>المتدربين غير النشطين:</span>
                <span class="stat-value">${this.financialTotals.inactiveTraineesCount || 0}</span>
              </div>
              <div class="info-row">
                <span>الموظفين غير النشطين:</span>
                <span class="stat-value">${this.financialTotals.inactiveEmployeesCount || 0}</span>
              </div>
            </div>
          </div>
          
          <div class="footer">
            تم التصدير من نظام إدارة  الأكاديمية الأولمبية لعلوم الرياضة
          </div>
          
          <div class="print-btn no-print">
            <button onclick="window.print();">🖨️ طباعة التقرير</button>
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 500);
            };
          </script>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    this.notification.showSuccess('تم فتح التقرير - جاري تحضير الطباعة...');
  }
}