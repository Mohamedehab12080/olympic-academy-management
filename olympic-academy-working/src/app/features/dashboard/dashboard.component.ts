// home.component.ts - Professional Dashboard with Print Support

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { animate, style, transition, trigger } from '@angular/animations';
import { FinancialService } from '../../core/services/financial.service';
import { FinancialTotalVTO } from '../../core/models/financial.model';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('400ms cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ],
  template: `
    <div class="dashboard-wrapper" id="dashboard-print-content">
      <!-- Modern Header -->
      <div class="dashboard-header" @fadeInUp>
        <div class="header-left">
          <div class="header-logo">
            <div class="logo-icon">
              <mat-icon>emoji_events</mat-icon>
            </div>
            <div class="logo-text">
              <h1>الأكاديمية الأولمبية</h1>
              <span>لوحة التحكم الرئيسية</span>
            </div>
          </div>
        </div>
        
        <div class="header-right">
          <!-- Year Selector -->
          <div class="year-selector-wrapper">
            <mat-icon class="calendar-icon">calendar_today</mat-icon>
            <select 
              class="year-select"
              [(ngModel)]="selectedYear"
              (change)="onYearChange()"
              [disabled]="isLoading"
            >
              <option *ngFor="let year of years" [value]="year">
                {{ year }}
              </option>
            </select>
          </div>
          
          <!-- Quick Actions -->
          <button 
            class="action-btn print-btn"
            (click)="printDashboard()"
            matTooltip="طباعة لوحة التحكم"
          >
            <mat-icon>print</mat-icon>
          </button>
          
          <button 
            class="action-btn refresh-btn"
            (click)="refreshData()"
            [disabled]="isLoading"
            matTooltip="تحديث البيانات"
          >
            <mat-icon [class.spinning]="isLoading">refresh</mat-icon>
          </button>
        </div>
      </div>

      <!-- Loading Overlay -->
      <div class="loading-overlay" *ngIf="isLoading">
        <mat-spinner diameter="48" color="accent"></mat-spinner>
        <p>جاري تحميل البيانات...</p>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid" *ngIf="!isLoading && data">
        <!-- Financial Stats -->
        <div class="stat-card financial-card" *ngFor="let stat of financialStats" @fadeInUp>
          <div class="stat-icon" [class]="stat.iconClass">
            <mat-icon>{{ stat.icon }}</mat-icon>
          </div>
          <div class="stat-content">
            <h3 class="stat-value">{{ formatCurrency(stat.value) }}</h3>
            <p class="stat-label">{{ stat.label }}</p>
          </div>
        </div>

        <!-- Active Counts -->
        <div class="stat-card count-card" *ngFor="let stat of activeStats" @fadeInUp>
          <div class="stat-icon active-icon">
            <mat-icon>{{ stat.icon }}</mat-icon>
          </div>
          <div class="stat-content">
            <h3 class="stat-value">{{ stat.value }}</h3>
            <p class="stat-label">{{ stat.label }}</p>
            <div class="stat-progress">
              <div class="progress-bar" [style.width]="stat.percentage + '%'"></div>
            </div>
          </div>
        </div>

        <!-- Inactive Counts -->
        <div class="stat-card count-card inactive" *ngFor="let stat of inactiveStats" @fadeInUp>
          <div class="stat-icon inactive-icon">
            <mat-icon>{{ stat.icon }}</mat-icon>
          </div>
          <div class="stat-content">
            <h3 class="stat-value">{{ stat.value }}</h3>
            <p class="stat-label">{{ stat.label }}</p>
            <div class="stat-progress">
              <div class="progress-bar warning" [style.width]="stat.percentage + '%'"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary Section -->
      <div class="summary-section" *ngIf="!isLoading && data" @fadeInUp>
        <div class="summary-card">
          <div class="summary-header">
            <mat-icon>assessment</mat-icon>
            <h3>ملخص الأداء</h3>
          </div>
          <div class="summary-grid">
            <div class="summary-item">
              <span class="summary-label">إجمالي الإيرادات</span>
              <span class="summary-value revenue">
                {{ formatCurrency(getTotalRevenue()) }}
              </span>
            </div>
            <div class="summary-item">
              <span class="summary-label">إجمالي المصروفات</span>
              <span class="summary-value expense">
                {{ formatCurrency(getTotalExpenses()) }}
              </span>
            </div>
            <div class="summary-item">
              <span class="summary-label">صافي الربح</span>
              <span class="summary-value profit" [class.negative]="getNetProfit() < 0">
                {{ formatCurrency(getNetProfit()) }}
              </span>
            </div>
            <div class="summary-item">
              <span class="summary-label">إجمالي النشطاء</span>
              <span class="summary-value active">
                {{ getTotalActive() }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="dashboard-footer" @fadeInUp>
        <div class="footer-left">
          <mat-icon>update</mat-icon>
          <span>آخر تحديث: {{ lastUpdated | date:'dd/MM/yyyy HH:mm:ss' }}</span>
        </div>
        <div class="footer-right">
          <span class="footer-badge">الإصدار 2.0</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-wrapper {
      padding: 24px;
      background: linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%);
      min-height: 100vh;
      direction: rtl;
    }

    /* ========== HEADER ========== */
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      padding: 16px 32px;
      border-radius: 20px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
      margin-bottom: 28px;
      flex-wrap: wrap;
      gap: 16px;
      border: 1px solid rgba(255, 255, 255, 0.5);
    }

    .header-left {
      display: flex;
      align-items: center;
    }

    .header-logo {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .logo-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .logo-icon mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
      color: white;
    }

    .logo-text h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      background: linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .logo-text span {
      font-size: 12px;
      color: #94a3b8;
      font-weight: 500;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .year-selector-wrapper {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #f1f5f9;
      padding: 4px 12px 4px 4px;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
    }

    .calendar-icon {
      color: #667eea;
      font-size: 20px;
    }

    .year-select {
      padding: 6px 8px;
      border: none;
      background: transparent;
      font-size: 14px;
      font-weight: 600;
      color: #1e293b;
      cursor: pointer;
      outline: none;
      min-width: 80px;
    }

    .year-select:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .action-btn {
      width: 42px;
      height: 42px;
      border: none;
      border-radius: 12px;
      background: #f1f5f9;
      color: #475569;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
    }

    .action-btn:hover:not(:disabled) {
      background: #e2e8f0;
      transform: translateY(-2px);
    }

    .action-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .refresh-btn:hover:not(:disabled) {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .print-btn:hover:not(:disabled) {
      background: #1e293b;
      color: white;
    }

    .spinning {
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* ========== LOADING ========== */
    .loading-overlay {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px;
      gap: 16px;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 20px;
    }

    .loading-overlay p {
      color: #64748b;
      font-size: 14px;
      margin: 0;
      font-weight: 500;
    }

    /* ========== STATS GRID ========== */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 24px;
    }

    .stat-card {
      background: white;
      border-radius: 18px;
      padding: 20px 24px;
      display: flex;
      align-items: center;
      gap: 18px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: default;
      position: relative;
      overflow: hidden;
    }

    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 4px;
      height: 100%;
      border-radius: 0 4px 4px 0;
    }

    .stat-card.financial-card::before {
      background: linear-gradient(180deg, #667eea, #764ba2);
    }

    .stat-card.count-card::before {
      background: linear-gradient(180deg, #10b981, #059669);
    }

    .stat-card.count-card.inactive::before {
      background: linear-gradient(180deg, #ef4444, #dc2626);
    }

    .stat-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
    }

    .stat-card:hover .stat-icon {
      transform: scale(1.05) rotate(-5deg);
    }

    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: transform 0.3s;
    }

    .stat-icon mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
      color: white;
    }

    .stat-icon.salary-icon {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .stat-icon.advance-icon {
      background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
    }

    .stat-icon.incentives-icon {
      background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
    }

    .stat-icon.rent-icon {
      background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
    }

    .stat-icon.enrollment-icon {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    }

    .stat-icon.expenses-icon {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    }

    .stat-icon.active-icon {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    }

    .stat-icon.inactive-icon {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    }

    .stat-content {
      flex: 1;
      min-width: 0;
    }

    .stat-value {
      margin: 0;
      font-size: 26px;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.2;
    }

    .stat-label {
      margin: 4px 0 0;
      font-size: 13px;
      color: #94a3b8;
      font-weight: 500;
    }

    .stat-progress {
      margin-top: 8px;
      height: 4px;
      background: #e2e8f0;
      border-radius: 4px;
      overflow: hidden;
    }

    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, #10b981, #059669);
      border-radius: 4px;
      transition: width 0.8s ease;
    }

    .progress-bar.warning {
      background: linear-gradient(90deg, #ef4444, #dc2626);
    }

    .stat-card.count-card.inactive .stat-value {
      color: #991b1b;
    }

    /* ========== SUMMARY SECTION ========== */
    .summary-section {
      margin-bottom: 24px;
    }

    .summary-card {
      background: white;
      border-radius: 18px;
      padding: 24px 32px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    }

    .summary-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
    }

    .summary-header mat-icon {
      color: #667eea;
      font-size: 24px;
    }

    .summary-header h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 700;
      color: #0f172a;
    }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
    }

    .summary-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .summary-label {
      font-size: 13px;
      color: #94a3b8;
      font-weight: 500;
    }

    .summary-value {
      font-size: 22px;
      font-weight: 800;
    }

    .summary-value.revenue {
      color: #667eea;
    }

    .summary-value.expense {
      color: #ef4444;
    }

    .summary-value.profit {
      color: #10b981;
    }

    .summary-value.profit.negative {
      color: #ef4444;
    }

    .summary-value.active {
      color: #8b5cf6;
    }

    /* ========== FOOTER ========== */
    .dashboard-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      padding: 14px 24px;
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.5);
    }

    .footer-left {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #94a3b8;
      font-size: 13px;
    }

    .footer-left mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .footer-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .footer-badge {
      padding: 4px 12px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
    }

    /* ========== PRINT STYLES ========== */
    @media print {
      .dashboard-wrapper {
        padding: 16px !important;
        background: white !important;
      }

      .dashboard-header {
        background: white !important;
        box-shadow: none !important;
        border: 1px solid #e2e8f0 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      .logo-icon {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      .stat-card {
        box-shadow: none !important;
        border: 1px solid #e2e8f0 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }

      .stat-card:hover {
        transform: none !important;
        box-shadow: none !important;
      }

      .stat-icon {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      .stat-icon mat-icon {
        color: white !important;
      }

      .progress-bar {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      .summary-card {
        box-shadow: none !important;
        border: 1px solid #e2e8f0 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      .dashboard-footer {
        background: white !important;
        box-shadow: none !important;
        border: 1px solid #e2e8f0 !important;
      }

      .footer-badge {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      .header-right .action-btn {
        display: none !important;
      }

      .loading-overlay {
        display: none !important;
      }

      .stats-grid {
        gap: 12px !important;
      }

      .stat-card {
        padding: 16px !important;
      }

      .stat-value {
        font-size: 20px !important;
      }

      .stat-icon {
        width: 44px !important;
        height: 44px !important;
      }

      .stat-icon mat-icon {
        font-size: 22px !important;
        width: 22px !important;
        height: 22px !important;
      }

      .summary-grid {
        gap: 16px !important;
      }

      .summary-value {
        font-size: 18px !important;
      }
    }

    /* ========== RESPONSIVE ========== */
    @media (max-width: 1200px) {
      .stats-grid {
        grid-template-columns: repeat(3, 1fr);
      }
      .summary-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 992px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .dashboard-wrapper {
        padding: 16px;
      }

      .dashboard-header {
        padding: 16px 20px;
        flex-direction: column;
        align-items: stretch;
      }

      .header-right {
        justify-content: space-between;
      }

      .logo-text h1 {
        font-size: 20px;
      }

      .stats-grid {
        grid-template-columns: 1fr;
        gap: 12px;
      }

      .summary-grid {
        grid-template-columns: 1fr;
        gap: 12px;
      }

      .stat-card {
        padding: 16px 18px;
      }

      .stat-value {
        font-size: 20px;
      }

      .stat-icon {
        width: 44px;
        height: 44px;
      }

      .stat-icon mat-icon {
        font-size: 22px;
        width: 22px;
        height: 22px;
      }

      .dashboard-footer {
        flex-direction: column;
        gap: 8px;
        text-align: center;
        padding: 12px 16px;
      }

      .footer-left {
        justify-content: center;
      }

      .summary-card {
        padding: 16px 20px;
      }
    }

    @media (max-width: 480px) {
      .stat-card {
        padding: 12px 14px;
        gap: 12px;
      }

      .stat-value {
        font-size: 18px;
      }

      .stat-icon {
        width: 38px;
        height: 38px;
      }

      .stat-icon mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }

      .year-select {
        min-width: 60px;
        font-size: 12px;
      }

      .action-btn {
        width: 36px;
        height: 36px;
      }
    }
  `]
})
export class HomeComponent implements OnInit, OnDestroy {
  data: FinancialTotalVTO | null = null;
  isLoading = false;
  lastUpdated: Date = new Date();
  selectedYear: number = new Date().getFullYear();
  years: number[] = [];
  private destroy$ = new Subject<void>();

  financialStats: any[] = [];
  activeStats: any[] = [];
  inactiveStats: any[] = [];

  constructor(
    private financialService: FinancialService,
    private notification: NotificationService
  ) {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= currentYear - 5; year--) {
      this.years.push(year);
    }
  }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadData(): void {
    this.isLoading = true;
    
    this.financialService.getAllMainTotalsOfFinancials(String(this.selectedYear))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: FinancialTotalVTO) => {
          this.data = response;
          console.log(response)
          this.updateStats();
          this.lastUpdated = new Date();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading financial data:', error);
          this.notification.showError('حدث خطأ في تحميل البيانات المالية');
          this.isLoading = false;
        }
      });
  }

  updateStats(): void {
    if (!this.data) return;

    // Financial Stats - Added totalAdvance
    this.financialStats = [
      { 
        label: 'إجمالي الرواتب', 
        value: this.data.totalSalary || 0, 
        icon: 'payments', 
        iconClass: 'salary-icon' 
      },
      { 
        label: 'إجمالي السلف', 
        value: this.data.totalAdvance || 0, 
        icon: 'currency_exchange', 
        iconClass: 'advance-icon' 
      },
      { 
        label: 'إجمالي الحوافز', 
        value: this.data.totalIncentives || 0, 
        icon: 'card_giftcard', 
        iconClass: 'incentives-icon' 
      },
      { 
        label: 'إيجارات الأماكن', 
        value: this.data.totalPlacesRent || 0, 
        icon: 'apartment', 
        iconClass: 'rent-icon' 
      },
      { 
        label: 'مدفوعات التسجيل', 
        value: this.data.totalEnrollmentPayments || 0, 
        icon: 'school', 
        iconClass: 'enrollment-icon' 
      },
      { 
        label: 'إجمالي المصروفات', 
        value: this.data.totalExpenses || 0, 
        icon: 'money_off', 
        iconClass: 'expenses-icon' 
      }
    ];

    const totalActive = this.getTotalActive();
    const totalInactive = this.getTotalInactive();

    this.activeStats = [
      { 
        label: 'الموظفين النشطين', 
        value: this.data.activeEmployeesCount || 0, 
        icon: 'people',
        percentage: totalActive > 0 ? Math.round((this.data.activeEmployeesCount || 0) / totalActive * 100) : 0 
      },
      { 
        label: 'المتدربين النشطين', 
        value: this.data.activeTraineesCount || 0, 
        icon: 'person',
        percentage: totalActive > 0 ? Math.round((this.data.activeTraineesCount || 0) / totalActive * 100) : 0 
      },
      { 
        label: 'الدورات النشطة', 
        value: this.data.activeCoursesCount || 0, 
        icon: 'book',
        percentage: totalActive > 0 ? Math.round((this.data.activeCoursesCount || 0) / totalActive * 100) : 0 
      },
      { 
        label: 'التسجيلات النشطة', 
        value: this.data.activeEnrollmentsCount || 0, 
        icon: 'assignment',
        percentage: totalActive > 0 ? Math.round((this.data.activeEnrollmentsCount || 0) / totalActive * 100) : 0 
      }
    ];

    this.inactiveStats = [
      { 
        label: 'الموظفين غير النشطين', 
        value: this.data.inactiveEmployeesCount || 0, 
        icon: 'person_off',
        percentage: totalInactive > 0 ? Math.round((this.data.inactiveEmployeesCount || 0) / totalInactive * 100) : 0 
      },
      { 
        label: 'المتدربين غير النشطين', 
        value: this.data.inactiveTraineesCount || 0, 
        icon: 'person_off',
        percentage: totalInactive > 0 ? Math.round((this.data.inactiveTraineesCount || 0) / totalInactive * 100) : 0 
      },
      { 
        label: 'الدورات غير النشطة', 
        value: this.data.inactiveCoursesCount || 0, 
        icon: 'book_off',
        percentage: totalInactive > 0 ? Math.round((this.data.inactiveCoursesCount || 0) / totalInactive * 100) : 0 
      },
      { 
        label: 'التسجيلات غير النشطة', 
        value: this.data.inactiveEnrollmentsCount || 0, 
        icon: 'assignment_off',
        percentage: totalInactive > 0 ? Math.round((this.data.inactiveEnrollmentsCount || 0) / totalInactive * 100) : 0 
      }
    ];
  }

  getTotalRevenue(): number {
    if (!this.data) return 0;
    // Revenue includes: enrollment payments + incentives + places rent
    return (this.data.totalEnrollmentPayments || 0);
  }

  /**
   * Get total expenses including all costs
   * totalExpenses = totalSalary + totalIncentives + totalAdvance + totalPlacesRent + totalExpenses
   */
  getTotalExpenses(): number {
    if (!this.data) return 0;
    return (this.data.totalSalary || 0) + 
           (this.data.totalIncentives || 0) + 
           (this.data.totalAdvance || 0) + 
           (this.data.totalPlacesRent || 0) + 
           (this.data.totalExpenses || 0);
  }

  getNetProfit(): number {
    if (!this.data) return 0;
    return this.getTotalRevenue() - this.getTotalExpenses();
  }

  getTotalActive(): number {
    if (!this.data) return 0;
    return (this.data.activeEmployeesCount || 0) + 
           (this.data.activeTraineesCount || 0) + 
           (this.data.activeCoursesCount || 0) + 
           (this.data.activeEnrollmentsCount || 0);
  }

  getTotalInactive(): number {
    if (!this.data) return 0;
    return (this.data.inactiveEmployeesCount || 0) + 
           (this.data.inactiveTraineesCount || 0) + 
           (this.data.inactiveCoursesCount || 0) + 
           (this.data.inactiveEnrollmentsCount || 0);
  }

  onYearChange(): void {
    this.loadData();
  }

  refreshData(): void {
    this.loadData();
  }

  formatCurrency(amount: number): string {
    if (amount === 0) return '0 ج.م';
    return amount.toLocaleString('ar-EG') + ' ج.م';
  }

  /**
   * Print the dashboard
   */
  printDashboard(): void {
    const printContent = document.getElementById('dashboard-print-content');
    if (!printContent) {
      this.notification.showError('تعذر طباعة لوحة التحكم');
      return;
    }

    const printWindow = window.open('', '_blank', 'width=1200,height=800,scrollbars=yes');
    if (!printWindow) {
      this.notification.showError('تعذر فتح نافذة الطباعة');
      return;
    }

    const today = new Date().toLocaleDateString('ar-EG');
    const now = new Date().toLocaleString('ar-EG');

    // Get the current data
    const data = this.data;
    const totalRevenue = this.getTotalRevenue();
    const totalExpenses = this.getTotalExpenses();
    const netProfit = this.getNetProfit();
    const totalActive = this.getTotalActive();

    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>لوحة التحكم - الأكاديمية الأولمبية</title>
        <style>
          * {
            font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif;
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          
          body {
            padding: 20px;
            background: white;
            direction: rtl;
          }
          
          .print-header {
            text-align: center;
            margin-bottom: 24px;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 12px;
          }
          
          .print-header h1 {
            margin: 0;
            font-size: 24px;
          }
          
          .print-header .subtitle {
            font-size: 14px;
            opacity: 0.9;
            margin-top: 4px;
          }
          
          .print-header .date {
            font-size: 12px;
            opacity: 0.8;
            margin-top: 8px;
          }
          
          .print-section {
            margin-bottom: 20px;
          }
          
          .print-section-title {
            font-size: 16px;
            font-weight: 700;
            color: #1a1a2e;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 2px solid #e2e8f0;
          }
          
          .print-grid {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 12px;
            margin-bottom: 20px;
          }
          
          .print-grid-4 {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
            margin-bottom: 20px;
          }
          
          .print-card {
            background: #f8fafc;
            border-radius: 8px;
            padding: 16px;
            text-align: center;
            border: 1px solid #e2e8f0;
          }
          
          .print-card .card-label {
            font-size: 12px;
            color: #64748b;
            margin-bottom: 4px;
          }
          
          .print-card .card-value {
            font-size: 18px;
            font-weight: 700;
            color: #0f172a;
          }
          
          .print-card .card-value.financial {
            color: #667eea;
          }
          
          .print-card .card-value.expense {
            color: #ef4444;
          }
          
          .print-card .card-value.active {
            color: #10b981;
          }
          
          .print-card .card-value.inactive {
            color: #991b1b;
          }
          
          .print-card .card-value.revenue {
            color: #667eea;
          }
          
          .print-card .card-value.profit {
            color: #10b981;
          }
          
          .print-card .card-value.profit.negative {
            color: #ef4444;
          }
          
          .print-summary {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
            background: #f1f5f9;
            border-radius: 8px;
            padding: 16px;
            margin-top: 12px;
          }
          
          .print-summary-item {
            text-align: center;
          }
          
          .print-summary-item .summary-label {
            font-size: 12px;
            color: #64748b;
          }
          
          .print-summary-item .summary-value {
            font-size: 18px;
            font-weight: 700;
          }
          
          .print-footer {
            text-align: center;
            margin-top: 24px;
            padding-top: 16px;
            border-top: 1px solid #e2e8f0;
            font-size: 11px;
            color: #94a3b8;
          }
          
          @media print {
            body { padding: 12px; }
            .no-print { display: none; }
            .print-card { break-inside: avoid; }
          }
          
          @media (max-width: 768px) {
            .print-grid {
              grid-template-columns: repeat(3, 1fr);
            }
            .print-grid-4 {
              grid-template-columns: repeat(2, 1fr);
            }
            .print-summary {
              grid-template-columns: repeat(2, 1fr);
            }
          }
          
          @media (max-width: 480px) {
            .print-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }
        </style>
      </head>
      <body>
        <!-- Header -->
        <div class="print-header">
          <h1>🏊 الأكاديمية الأولمبية</h1>
          <div class="subtitle">لوحة التحكم الرئيسية - تقرير الأداء</div>
          <div class="date">التاريخ: ${today} | وقت الطباعة: ${now}</div>
          <div class="date" style="font-size: 11px; opacity: 0.7;">العام المالي: ${this.selectedYear}</div>
        </div>

        <!-- Financial Stats -->
        <div class="print-section">
          <div class="print-section-title">📊 البيانات المالية</div>
          <div class="print-grid">
            <div class="print-card">
              <div class="card-label">إجمالي الرواتب</div>
              <div class="card-value financial">${this.formatCurrency(data?.totalSalary || 0)}</div>
            </div>
            <div class="print-card">
              <div class="card-label">إجمالي السلف</div>
              <div class="card-value financial">${this.formatCurrency(data?.totalAdvance || 0)}</div>
            </div>
            <div class="print-card">
              <div class="card-label">إجمالي الحوافز</div>
              <div class="card-value financial">${this.formatCurrency(data?.totalIncentives || 0)}</div>
            </div>
            <div class="print-card">
              <div class="card-label">إيجارات الأماكن</div>
              <div class="card-value financial">${this.formatCurrency(data?.totalPlacesRent || 0)}</div>
            </div>
            <div class="print-card">
              <div class="card-label">مدفوعات التسجيل</div>
              <div class="card-value financial">${this.formatCurrency(data?.totalEnrollmentPayments || 0)}</div>
            </div>
            <div class="print-card">
              <div class="card-label">إجمالي المصروفات</div>
              <div class="card-value expense">${this.formatCurrency(data?.totalExpenses || 0)}</div>
            </div>
          </div>
        </div>

        <!-- Active Counts -->
        <div class="print-section">
          <div class="print-section-title">✅ الإحصائيات النشطة</div>
          <div class="print-grid-4">
            <div class="print-card">
              <div class="card-label">الموظفين النشطين</div>
              <div class="card-value active">${data?.activeEmployeesCount || 0}</div>
            </div>
            <div class="print-card">
              <div class="card-label">المتدربين النشطين</div>
              <div class="card-value active">${data?.activeTraineesCount || 0}</div>
            </div>
            <div class="print-card">
              <div class="card-label">الدورات النشطة</div>
              <div class="card-value active">${data?.activeCoursesCount || 0}</div>
            </div>
            <div class="print-card">
              <div class="card-label">التسجيلات النشطة</div>
              <div class="card-value active">${data?.activeEnrollmentsCount || 0}</div>
            </div>
          </div>
        </div>

        <!-- Inactive Counts -->
        <div class="print-section">
          <div class="print-section-title">❌ الإحصائيات غير النشطة</div>
          <div class="print-grid-4">
            <div class="print-card">
              <div class="card-label">الموظفين غير النشطين</div>
              <div class="card-value inactive">${data?.inactiveEmployeesCount || 0}</div>
            </div>
            <div class="print-card">
              <div class="card-label">المتدربين غير النشطين</div>
              <div class="card-value inactive">${data?.inactiveTraineesCount || 0}</div>
            </div>
            <div class="print-card">
              <div class="card-label">الدورات غير النشطة</div>
              <div class="card-value inactive">${data?.inactiveCoursesCount || 0}</div>
            </div>
            <div class="print-card">
              <div class="card-label">التسجيلات غير النشطة</div>
              <div class="card-value inactive">${data?.inactiveEnrollmentsCount || 0}</div>
            </div>
          </div>
        </div>

        <!-- Summary -->
        <div class="print-section">
          <div class="print-section-title">📈 ملخص الأداء</div>
          <div class="print-summary">
            <div class="print-summary-item">
              <div class="summary-label">إجمالي الإيرادات</div>
              <div class="summary-value" style="color: #667eea;">${this.formatCurrency(totalRevenue)}</div>
            </div>
            <div class="print-summary-item">
              <div class="summary-label">إجمالي المصروفات</div>
              <div class="summary-value" style="color: #ef4444;">${this.formatCurrency(totalExpenses)}</div>
            </div>
            <div class="print-summary-item">
              <div class="summary-label">صافي الربح</div>
              <div class="summary-value" style="color: ${netProfit >= 0 ? '#10b981' : '#ef4444'};">${this.formatCurrency(netProfit)}</div>
            </div>
            <div class="print-summary-item">
              <div class="summary-label">إجمالي النشطاء</div>
              <div class="summary-value" style="color: #8b5cf6;">${totalActive}</div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="print-footer">
          تم التصدير من نظام إدارة الأكاديمية الأولمبية | الإصدار 2.0
        </div>

        <div class="no-print" style="text-align: center; margin-top: 20px; padding: 10px;">
          <button onclick="window.print();" style="padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: 600;">
            🖨️ طباعة / حفظ كـ PDF
          </button>
        </div>
      </body>
      </html>
    `);

    printWindow.document.close();
    this.notification.showSuccess('تم فتح لوحة التحكم للطباعة');
  }
}