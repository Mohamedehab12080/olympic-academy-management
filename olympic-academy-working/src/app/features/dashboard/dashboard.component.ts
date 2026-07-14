// home.component.ts - Professional Dashboard with Enhanced UI/UX

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, delay, finalize } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { 
  animate, 
  style, 
  transition, 
  trigger, 
  state,
  query,
  stagger
} from '@angular/animations';
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
    MatProgressSpinnerModule,
    MatMenuModule
  ],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px) scale(0.98)' }),
        animate('500ms cubic-bezier(0.34, 1.56, 0.64, 1)', 
          style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
      ])
    ]),
    trigger('staggerFade', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger('60ms', [
            animate('400ms cubic-bezier(0.4, 0, 0.2, 1)',
              style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('cardHover', [
      state('default', style({
        transform: 'translateY(0) scale(1)',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)'
      })),
      state('hover', style({
        transform: 'translateY(-8px) scale(1.02)',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)'
      })),
      transition('default <=> hover', animate('300ms cubic-bezier(0.4, 0, 0.2, 1)'))
    ])
  ],
  template: `
    <div class="dashboard-container" id="dashboard-print-content">
      <!-- Modern Header -->
      <header class="dashboard-header" @fadeInUp>
        <div class="header-brand">
          <div class="brand-icon">
            <mat-icon>olympic</mat-icon>
          </div>
          <div class="brand-info">
            <h1 class="brand-title"> الأكاديمية الأولمبية لعلوم الرياضة</h1>
            <span class="brand-subtitle">لوحة التحكم الرئيسية</span>
          </div>
        </div>
        
        <div class="header-actions">
          <!-- Year Selector -->
          <div class="year-selector">
            <mat-icon class="year-icon">event</mat-icon>
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
          <div class="action-group">
            <button 
              class="action-btn refresh-btn"
              (click)="refreshData()"
              [disabled]="isLoading"
              matTooltip="تحديث البيانات"
              [matTooltipPosition]="'below'"
            >
              <mat-icon [class.spinning]="isLoading">refresh</mat-icon>
            </button>
            
            <button 
              class="action-btn print-btn"
              (click)="printDashboard()"
              matTooltip="طباعة لوحة التحكم"
              [matTooltipPosition]="'below'"
            >
              <mat-icon>print</mat-icon>
            </button>
            
            <button 
              class="action-btn settings-btn"
              [matMenuTriggerFor]="settingsMenu"
              matTooltip="الإعدادات"
              [matTooltipPosition]="'below'"
            >
              <mat-icon>more_vert</mat-icon>
            </button>
            <mat-menu #settingsMenu="matMenu">
              <button mat-menu-item (click)="exportData()">
                <mat-icon>file_download</mat-icon>
                <span>تصدير البيانات</span>
              </button>
              <button mat-menu-item (click)="toggleDarkMode()">
                <mat-icon>dark_mode</mat-icon>
                <span>الوضع الليلي</span>
              </button>
            </mat-menu>
          </div>
        </div>
      </header>

      <!-- Stats Grid with Stagger Animation -->
      <div class="stats-grid" *ngIf="!isLoading && data">
        <div 
          class="stat-card" 
          *ngFor="let stat of allStats; let i = index" 
          @fadeInUp
          [@cardHover]="hoverState"
          (mouseenter)="hoverState = 'hover'"
          (mouseleave)="hoverState = 'default'"
          [class]="stat.cardType"
          [style.animation-delay]="i * 50 + 'ms'"
        >
          <div class="stat-icon-wrapper" [class]="stat.iconClass">
            <mat-icon class="stat-icon">{{ stat.icon }}</mat-icon>
          </div>
          <div class="stat-content">
            <p class="stat-label">{{ stat.label }}</p>
            <h3 class="stat-value" [class]="stat.valueClass">
              {{ stat.isCurrency ? formatCurrency(stat.value) : stat.value }}
            </h3>
            <div class="stat-trend" *ngIf="stat.trend !== undefined">
              <mat-icon class="trend-icon" [class.up]="stat.trend > 0" [class.down]="stat.trend < 0">
                {{ stat.trend > 0 ? 'trending_up' : 'trending_down' }}
              </mat-icon>
              <span class="trend-value" [class.up]="stat.trend > 0" [class.down]="stat.trend < 0">
                {{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}%
              </span>
            </div>
          </div>
          <div class="stat-progress" *ngIf="stat.progress !== undefined">
            <div class="progress-bar" [style.width]="stat.progress + '%'"></div>
          </div>
        </div>
      </div>

      <!-- Enhanced Summary Section -->
      <div class="summary-section" *ngIf="!isLoading && data" @fadeInUp>
        <div class="summary-card">
          <div class="summary-header">
            <div class="summary-title">
              <mat-icon>analytics</mat-icon>
              <h3>ملخص الأداء المالي</h3>
            </div>
            <span class="summary-badge">تقرير {{ selectedYear }}</span>
          </div>
          
          <div class="summary-grid">
            <div class="summary-item revenue">
              <div class="item-icon">
                <mat-icon>arrow_upward</mat-icon>
              </div>
              <div class="item-content">
                <span class="item-label">إجمالي الإيرادات</span>
                <span class="item-value">{{ formatCurrency(getTotalRevenue()) }}</span>
              </div>
            </div>
            
            <div class="summary-item expenses">
              <div class="item-icon">
                <mat-icon>arrow_downward</mat-icon>
              </div>
              <div class="item-content">
                <span class="item-label">إجمالي المصروفات</span>
                <span class="item-value">{{ formatCurrency(getTotalExpenses()) }}</span>
              </div>
            </div>
            
            <div class="summary-item profit" [class.negative]="getNetProfit() < 0">
              <div class="item-icon">
                <mat-icon>{{ getNetProfit() >= 0 ? 'check_circle' : 'warning' }}</mat-icon>
              </div>
              <div class="item-content">
                <span class="item-label">صافي الربح</span>
                <span class="item-value">{{ formatCurrency(getNetProfit()) }}</span>
              </div>
            </div>
            
            <div class="summary-item active">
              <div class="item-icon">
                <mat-icon>group</mat-icon>
              </div>
              <div class="item-content">
                <span class="item-label">إجمالي النشطاء</span>
                <span class="item-value">{{ getTotalActive() }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Stats Cards -->
      <div class="quick-stats" *ngIf="!isLoading && data" @fadeInUp>
        <div class="quick-stat-card">
          <div class="quick-stat-icon active-icon">
            <mat-icon>check_circle</mat-icon>
          </div>
          <div class="quick-stat-info">
            <span class="quick-stat-label">نشط</span>
            <span class="quick-stat-value">{{ getTotalActive() }}</span>
          </div>
        </div>
        <div class="quick-stat-card">
          <div class="quick-stat-icon inactive-icon">
            <mat-icon>cancel</mat-icon>
          </div>
          <div class="quick-stat-info">
            <span class="quick-stat-label">غير نشط</span>
            <span class="quick-stat-value">{{ getTotalInactive() }}</span>
          </div>
        </div>
        <div class="quick-stat-card">
          <div class="quick-stat-icon total-icon">
            <mat-icon>people</mat-icon>
          </div>
          <div class="quick-stat-info">
            <span class="quick-stat-label">إجمالي</span>
            <span class="quick-stat-value">{{ getTotalActive() + getTotalInactive() }}</span>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <footer class="dashboard-footer" @fadeInUp>
        <div class="footer-info">
          <mat-icon>schedule</mat-icon>
          <span>آخر تحديث: {{ lastUpdated | date:'dd/MM/yyyy HH:mm:ss' }}</span>
        </div>
        <div class="footer-status">
          <span class="status-dot" [class.online]="!isLoading"></span>
          <span class="status-text">{{ isLoading ? 'جاري التحميل...' : 'متصل' }}</span>
        </div>
        <div class="footer-version">
          <span class="version-badge">v3.0</span>
        </div>
      </footer>
    </div>

    <!-- Loading Overlay -->
    <div class="loading-overlay" *ngIf="isLoading">
      <div class="loading-content">
        <mat-spinner diameter="56" color="accent"></mat-spinner>
        <p class="loading-text">جاري تحميل البيانات...</p>
        <div class="loading-progress">
          <div class="loading-bar"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* ============================================
       CSS VARIABLES & RESET
       ============================================ */
    :host {
      --primary: #667eea;
      --primary-dark: #5a67d8;
      --secondary: #764ba2;
      --success: #10b981;
      --warning: #f59e0b;
      --danger: #ef4444;
      --info: #06b6d4;
      --bg-primary: #f8fafc;
      --bg-card: #ffffff;
      --text-primary: #0f172a;
      --text-secondary: #475569;
      --text-muted: #94a3b8;
      --border-color: #e2e8f0;
      --shadow-sm: 0 2px 4px rgba(0,0,0,0.04);
      --shadow-md: 0 4px 12px rgba(0,0,0,0.06);
      --shadow-lg: 0 12px 40px rgba(0,0,0,0.08);
      --shadow-xl: 0 20px 60px rgba(0,0,0,0.12);
      --radius-sm: 12px;
      --radius-md: 16px;
      --radius-lg: 20px;
      --radius-xl: 24px;
      --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* ============================================
       CONTAINER
       ============================================ */
    .dashboard-container {
      padding: 24px;
      background: var(--bg-primary);
      min-height: 100vh;
      direction: rtl;
      position: relative;
    }

    /* ============================================
       HEADER
       ============================================ */
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--bg-card);
      padding: 16px 28px;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
      margin-bottom: 28px;
      border: 1px solid rgba(255,255,255,0.5);
      backdrop-filter: blur(12px);
      flex-wrap: wrap;
      gap: 12px;
    }

    .header-brand {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .brand-icon {
      width: 52px;
      height: 52px;
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 16px rgba(102, 126, 234, 0.35);
      transition: var(--transition);
    }

    .brand-icon:hover {
      transform: rotate(-8deg) scale(1.05);
    }

    .brand-icon mat-icon {
      font-size: 30px;
      width: 30px;
      height: 30px;
      color: white;
    }

    .brand-info h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 800;
      background: linear-gradient(135deg, var(--text-primary), #1e293b);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -0.5px;
    }

    .brand-subtitle {
      font-size: 12px;
      color: var(--text-muted);
      font-weight: 500;
      display: block;
      margin-top: -2px;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .year-selector {
      display: flex;
      align-items: center;
      gap: 8px;
      background: var(--bg-primary);
      padding: 4px 12px 4px 6px;
      border-radius: var(--radius-sm);
      border: 1px solid var(--border-color);
      transition: var(--transition);
    }

    .year-selector:focus-within {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
    }

    .year-icon {
      color: var(--primary);
      font-size: 20px;
    }

    .year-select {
      padding: 6px 8px;
      border: none;
      background: transparent;
      font-size: 14px;
      font-weight: 600;
      color: var(--text-primary);
      cursor: pointer;
      outline: none;
      min-width: 80px;
    }

    .year-select:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .action-group {
      display: flex;
      gap: 8px;
    }

    .action-btn {
      width: 44px;
      height: 44px;
      border: none;
      border-radius: var(--radius-sm);
      background: var(--bg-primary);
      color: var(--text-secondary);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: var(--transition);
      position: relative;
    }

    .action-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .action-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .action-btn.refresh-btn:hover:not(:disabled) {
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      color: white;
      box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
    }

    .action-btn.print-btn:hover:not(:disabled) {
      background: #1e293b;
      color: white;
    }

    .action-btn.settings-btn:hover:not(:disabled) {
      background: var(--bg-primary);
      color: var(--text-primary);
    }

    .spinning {
      animation: spin 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* ============================================
       STATS GRID
       ============================================ */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 20px;
      margin-bottom: 24px;
    }

    .stat-card {
      background: var(--bg-card);
      border-radius: var(--radius-md);
      padding: 20px 24px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      position: relative;
      overflow: hidden;
      transition: var(--transition);
      border: 1px solid var(--border-color);
    }

    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--primary), var(--secondary));
      opacity: 0;
      transition: var(--transition);
    }

    .stat-card:hover::before {
      opacity: 1;
    }

    .stat-card.financial::before {
      background: linear-gradient(90deg, var(--primary), var(--secondary));
    }

    .stat-card.active-card::before {
      background: linear-gradient(90deg, var(--success), #059669);
    }

    .stat-card.inactive-card::before {
      background: linear-gradient(90deg, var(--danger), #dc2626);
    }

    .stat-icon-wrapper {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: var(--transition);
    }

    .stat-icon-wrapper:hover {
      transform: scale(1.1) rotate(-4deg);
    }

    .stat-icon-wrapper .stat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
      color: white;
    }

    .stat-icon-wrapper.salary {
      background: linear-gradient(135deg, var(--primary), var(--secondary));
    }
    .stat-icon-wrapper.advance {
      background: linear-gradient(135deg, var(--warning), #f97316);
    }
    .stat-icon-wrapper.incentives {
      background: linear-gradient(135deg, #8b5cf6, #6d28d9);
    }
    .stat-icon-wrapper.rent {
      background: linear-gradient(135deg, var(--info), #0891b2);
    }
    .stat-icon-wrapper.enrollment {
      background: linear-gradient(135deg, var(--success), #059669);
    }
    .stat-icon-wrapper.expenses {
      background: linear-gradient(135deg, var(--danger), #dc2626);
    }
    .stat-icon-wrapper.active {
      background: linear-gradient(135deg, var(--success), #059669);
    }
    .stat-icon-wrapper.inactive {
      background: linear-gradient(135deg, var(--danger), #dc2626);
    }

    .stat-content {
      flex: 1;
      min-width: 0;
    }

    .stat-label {
      margin: 0 0 4px 0;
      font-size: 13px;
      color: var(--text-muted);
      font-weight: 500;
    }

    .stat-value {
      margin: 0;
      font-size: 28px;
      font-weight: 800;
      color: var(--text-primary);
      line-height: 1.2;
    }

    .stat-value.positive {
      color: var(--success);
    }

    .stat-value.negative {
      color: var(--danger);
    }

    .stat-trend {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-top: 4px;
    }

    .trend-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .trend-icon.up {
      color: var(--success);
    }

    .trend-icon.down {
      color: var(--danger);
    }

    .trend-value {
      font-size: 12px;
      font-weight: 600;
    }

    .trend-value.up {
      color: var(--success);
    }

    .trend-value.down {
      color: var(--danger);
    }

    .stat-progress {
      margin-top: 8px;
      height: 4px;
      background: var(--border-color);
      border-radius: 4px;
      overflow: hidden;
    }

    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, var(--primary), var(--secondary));
      border-radius: 4px;
      transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* ============================================
       SUMMARY SECTION
       ============================================ */
    .summary-section {
      margin-bottom: 24px;
    }

    .summary-card {
      background: var(--bg-card);
      border-radius: var(--radius-lg);
      padding: 24px 32px;
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--border-color);
    }

    .summary-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 2px solid var(--bg-primary);
    }

    .summary-title {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .summary-title mat-icon {
      color: var(--primary);
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .summary-title h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 700;
      color: var(--text-primary);
    }

    .summary-badge {
      padding: 4px 14px;
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      color: white;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
    }

    .summary-item {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 16px;
      border-radius: var(--radius-sm);
      background: var(--bg-primary);
      transition: var(--transition);
    }

    .summary-item:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .summary-item .item-icon {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .summary-item.revenue .item-icon {
      background: rgba(102, 126, 234, 0.12);
      color: var(--primary);
    }

    .summary-item.expenses .item-icon {
      background: rgba(239, 68, 68, 0.12);
      color: var(--danger);
    }

    .summary-item.profit .item-icon {
      background: rgba(16, 185, 129, 0.12);
      color: var(--success);
    }

    .summary-item.profit.negative .item-icon {
      background: rgba(239, 68, 68, 0.12);
      color: var(--danger);
    }

    .summary-item.active .item-icon {
      background: rgba(139, 92, 246, 0.12);
      color: #8b5cf6;
    }

    .summary-item .item-content {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .item-label {
      font-size: 12px;
      color: var(--text-muted);
      font-weight: 500;
    }

    .item-value {
      font-size: 20px;
      font-weight: 800;
      color: var(--text-primary);
    }

    .summary-item.revenue .item-value {
      color: var(--primary);
    }

    .summary-item.expenses .item-value {
      color: var(--danger);
    }

    .summary-item.profit .item-value {
      color: var(--success);
    }

    .summary-item.profit.negative .item-value {
      color: var(--danger);
    }

    .summary-item.active .item-value {
      color: #8b5cf6;
    }

    /* ============================================
       QUICK STATS
       ============================================ */
    .quick-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }

    .quick-stat-card {
      display: flex;
      align-items: center;
      gap: 14px;
      background: var(--bg-card);
      padding: 16px 20px;
      border-radius: var(--radius-sm);
      border: 1px solid var(--border-color);
      transition: var(--transition);
    }

    .quick-stat-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .quick-stat-icon {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .quick-stat-icon.active-icon {
      background: rgba(16, 185, 129, 0.12);
      color: var(--success);
    }

    .quick-stat-icon.inactive-icon {
      background: rgba(239, 68, 68, 0.12);
      color: var(--danger);
    }

    .quick-stat-icon.total-icon {
      background: rgba(102, 126, 234, 0.12);
      color: var(--primary);
    }

    .quick-stat-info {
      display: flex;
      flex-direction: column;
    }

    .quick-stat-label {
      font-size: 12px;
      color: var(--text-muted);
    }

    .quick-stat-value {
      font-size: 20px;
      font-weight: 800;
      color: var(--text-primary);
    }

    /* ============================================
       FOOTER
       ============================================ */
    .dashboard-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--bg-card);
      padding: 12px 24px;
      border-radius: var(--radius-sm);
      border: 1px solid var(--border-color);
      flex-wrap: wrap;
      gap: 8px;
    }

    .footer-info {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--text-muted);
      font-size: 13px;
    }

    .footer-info mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .footer-status {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--danger);
      transition: var(--transition);
    }

    .status-dot.online {
      background: var(--success);
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }

    .status-text {
      font-size: 13px;
      color: var(--text-secondary);
      font-weight: 500;
    }

    .version-badge {
      padding: 2px 12px;
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      color: white;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 700;
    }

    /* ============================================
       LOADING OVERLAY
       ============================================ */
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(248, 250, 252, 0.92);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .loading-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      background: var(--bg-card);
      padding: 48px 64px;
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-xl);
    }

    .loading-text {
      font-size: 16px;
      color: var(--text-secondary);
      font-weight: 500;
      margin: 0;
    }

    .loading-progress {
      width: 200px;
      height: 4px;
      background: var(--border-color);
      border-radius: 4px;
      overflow: hidden;
    }

    .loading-bar {
      height: 100%;
      background: linear-gradient(90deg, var(--primary), var(--secondary), var(--primary));
      background-size: 200% 100%;
      animation: loadingProgress 1.5s ease-in-out infinite;
      border-radius: 4px;
    }

    @keyframes loadingProgress {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    /* ============================================
       PRINT STYLES
       ============================================ */
    @media print {
      .dashboard-container {
        padding: 16px !important;
        background: white !important;
      }

      .dashboard-header {
        background: white !important;
        box-shadow: none !important;
        border: 1px solid var(--border-color) !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      .brand-icon {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      .stat-card {
        box-shadow: none !important;
        border: 1px solid var(--border-color) !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }

      .stat-card:hover {
        transform: none !important;
        box-shadow: none !important;
      }

      .stat-card::before {
        opacity: 1 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      .stat-icon-wrapper {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      .progress-bar {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      .summary-card {
        box-shadow: none !important;
        border: 1px solid var(--border-color) !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      .summary-badge {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      .dashboard-footer {
        background: white !important;
        box-shadow: none !important;
        border: 1px solid var(--border-color) !important;
      }

      .version-badge {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      .action-group {
        display: none !important;
      }

      .loading-overlay {
        display: none !important;
      }

      .quick-stats {
        display: grid !important;
      }

      .quick-stat-card {
        border: 1px solid var(--border-color) !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
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

      .stat-icon-wrapper {
        width: 40px !important;
        height: 40px !important;
      }

      .stat-icon-wrapper .stat-icon {
        font-size: 20px !important;
        width: 20px !important;
        height: 20px !important;
      }

      .summary-grid {
        gap: 12px !important;
      }

      .summary-item {
        padding: 12px !important;
      }

      .item-value {
        font-size: 16px !important;
      }
    }

    /* ============================================
       RESPONSIVE
       ============================================ */
    @media (max-width: 1200px) {
      .stats-grid {
        grid-template-columns: repeat(3, 1fr);
      }
      .summary-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      .quick-stats {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (max-width: 992px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 16px;
      }

      .dashboard-header {
        padding: 16px 20px;
        flex-direction: column;
        align-items: stretch;
      }

      .header-actions {
        justify-content: space-between;
        flex-wrap: wrap;
      }

      .brand-info h1 {
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

      .summary-card {
        padding: 16px 20px;
      }

      .quick-stats {
        grid-template-columns: 1fr;
      }

      .stat-card {
        padding: 16px 18px;
      }

      .stat-value {
        font-size: 22px;
      }

      .stat-icon-wrapper {
        width: 40px;
        height: 40px;
      }

      .stat-icon-wrapper .stat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }

      .dashboard-footer {
        flex-direction: column;
        gap: 8px;
        text-align: center;
        padding: 12px 16px;
      }

      .footer-info {
        justify-content: center;
      }

      .summary-item {
        padding: 12px 16px;
      }
    }

    @media (max-width: 480px) {
      .stat-card {
        padding: 14px 16px;
        gap: 10px;
      }

      .stat-value {
        font-size: 20px;
      }

      .stat-icon-wrapper {
        width: 36px;
        height: 36px;
      }

      .stat-icon-wrapper .stat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }

      .year-select {
        min-width: 60px;
        font-size: 12px;
      }

      .action-btn {
        width: 38px;
        height: 38px;
      }

      .loading-content {
        padding: 32px 40px;
      }

      .summary-header {
        flex-direction: column;
        gap: 8px;
        align-items: flex-start;
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
  hoverState: string = 'default';
  private destroy$ = new Subject<void>();

  allStats: any[] = [];

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
      .pipe(
        takeUntil(this.destroy$),
        delay(400),
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (response: FinancialTotalVTO) => {
          this.data = response;
          this.updateStats();
          this.lastUpdated = new Date();
          this.notification.showSuccess('تم تحديث البيانات بنجاح');
        },
        error: (error) => {
          console.error('Error loading financial data:', error);
          this.notification.showError('حدث خطأ في تحميل البيانات المالية');
        }
      });
  }

  updateStats(): void {
    if (!this.data) return;

    const totalActive = this.getTotalActive();
    const totalInactive = this.getTotalInactive();

    // Financial Stats
    const financialStats = [
      { 
        label: 'إجمالي الرواتب', 
        value: this.data.totalSalary || 0, 
        icon: 'payments', 
        iconClass: 'salary',
        cardType: 'financial',
        isCurrency: true,
        trend: 0
      },
      { 
        label: 'إجمالي السلف', 
        value: this.data.totalAdvance || 0, 
        icon: 'currency_exchange', 
        iconClass: 'advance',
        cardType: 'financial',
        isCurrency: true,
        trend: 0
      },
      { 
        label: 'إجمالي الحوافز', 
        value: this.data.totalIncentives || 0, 
        icon: 'card_giftcard', 
        iconClass: 'incentives',
        cardType: 'financial',
        isCurrency: true,
        trend: 0
      },
      { 
        label: 'إيجارات الأماكن', 
        value: this.data.totalPlacesRent || 0, 
        icon: 'apartment', 
        iconClass: 'rent',
        cardType: 'financial',
        isCurrency: true,
        trend: 0
      },
      { 
        label: 'مدفوعات التسجيل', 
        value: this.data.totalEnrollmentPayments || 0, 
        icon: 'school', 
        iconClass: 'enrollment',
        cardType: 'financial',
        isCurrency: true,
        trend: 0
      },
      { 
        label: 'استردادات التسجيل', 
        value: this.data.totalEnrollmentRefunds || 0, 
        icon: 'money_off', 
        iconClass: 'enrollment',
        cardType: 'financial',
        اجvalueClass: 'negative',
        isCurrency: true,
        trend: 0
      },
      { 
        label: 'مصروفات اخري', 
        value: this.data.totalExpenses || 0, 
        icon: 'money_off', 
        iconClass: 'expenses',
        cardType: 'financial',
        isCurrency: true,
        valueClass: 'negative',
        trend: 0
      }
    ];

    // Active Stats
    const activeStats = [
      { 
        label: 'الموظفين النشطين', 
        value: this.data.activeEmployeesCount || 0, 
        icon: 'people', 
        iconClass: 'active',
        cardType: 'active-card',
        progress: totalActive > 0 ? Math.round((this.data.activeEmployeesCount || 0) / totalActive * 100) : 0,
        valueClass: 'positive'
      },
      { 
        label: 'المتدربين النشطين', 
        value: this.data.activeTraineesCount || 0, 
        icon: 'person', 
        iconClass: 'active',
        cardType: 'active-card',
        progress: totalActive > 0 ? Math.round((this.data.activeTraineesCount || 0) / totalActive * 100) : 0,
        valueClass: 'positive'
      },
      { 
        label: 'الدورات النشطة', 
        value: this.data.activeCoursesCount || 0, 
        icon: 'book', 
        iconClass: 'active',
        cardType: 'active-card',
        progress: totalActive > 0 ? Math.round((this.data.activeCoursesCount || 0) / totalActive * 100) : 0,
        valueClass: 'positive'
      },
      { 
        label: 'التسجيلات النشطة', 
        value: this.data.activeEnrollmentsCount || 0, 
        icon: 'assignment', 
        iconClass: 'active',
        cardType: 'active-card',
        progress: totalActive > 0 ? Math.round((this.data.activeEnrollmentsCount || 0) / totalActive * 100) : 0,
        valueClass: 'positive'
      }
    ];

    // Inactive Stats
    const inactiveStats = [
      { 
        label: 'الموظفين غير النشطين', 
        value: this.data.inactiveEmployeesCount || 0, 
        icon: 'person_off', 
        iconClass: 'inactive',
        cardType: 'inactive-card',
        progress: totalInactive > 0 ? Math.round((this.data.inactiveEmployeesCount || 0) / totalInactive * 100) : 0,
        valueClass: 'negative'
      },
      { 
        label: 'المتدربين غير النشطين', 
        value: this.data.inactiveTraineesCount || 0, 
        icon: 'person_off', 
        iconClass: 'inactive',
        cardType: 'inactive-card',
        progress: totalInactive > 0 ? Math.round((this.data.inactiveTraineesCount || 0) / totalInactive * 100) : 0,
        valueClass: 'negative'
      },
      { 
        label: 'الدورات غير النشطة', 
        value: this.data.inactiveCoursesCount || 0, 
        icon: 'book_off', 
        iconClass: 'inactive',
        cardType: 'inactive-card',
        progress: totalInactive > 0 ? Math.round((this.data.inactiveCoursesCount || 0) / totalInactive * 100) : 0,
        valueClass: 'negative'
      },
      { 
        label: 'التسجيلات غير النشطة', 
        value: this.data.inactiveEnrollmentsCount || 0, 
        icon: 'assignment_off', 
        iconClass: 'inactive',
        cardType: 'inactive-card',
        progress: totalInactive > 0 ? Math.round((this.data.inactiveEnrollmentsCount || 0) / totalInactive * 100) : 0,
        valueClass: 'negative'
      }
    ];

    this.allStats = [...financialStats, ...activeStats, ...inactiveStats];
  }

  getTotalRevenue(): number {
    if (!this.data) return 0;
    return (this.data.totalEnrollmentPayments || 0) + 
           (this.data.totalIncentives || 0)
          }

  getTotalExpenses(): number {
    if (!this.data) return 0;
    return (this.data.totalSalary || 0) + 
           (this.data.totalAdvance || 0) + 
           (this.data.totalExpenses || 0)+
           (this.data.totalEnrollmentRefunds || 0)+
           (this.data.totalPlacesRent || 0);
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

  exportData(): void {
    this.notification.showSuccess('جاري تصدير البيانات...');
    // Implement export functionality
  }

  toggleDarkMode(): void {
    document.body.classList.toggle('dark-mode');
    this.notification.showSuccess('تم تغيير الوضع');
  }

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

    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>لوحة التحكم -  الأكاديمية الأولمبية لعلوم الرياضة</title>
        <style>
          * { font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif; box-sizing: border-box; margin: 0; padding: 0; }
          body { padding: 20px; background: white; direction: rtl; }
          .print-header { text-align: center; margin-bottom: 24px; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 12px; }
          .print-header h1 { margin: 0; font-size: 24px; }
          .print-header .subtitle { font-size: 14px; opacity: 0.9; margin-top: 4px; }
          .print-header .date { font-size: 12px; opacity: 0.8; margin-top: 8px; }
          .print-section { margin-bottom: 20px; }
          .print-section-title { font-size: 16px; font-weight: 700; color: #1a1a2e; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #e2e8f0; }
          .print-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; margin-bottom: 20px; }
          .print-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; }
          .print-card { background: #f8fafc; border-radius: 8px; padding: 16px; text-align: center; border: 1px solid #e2e8f0; }
          .print-card .card-label { font-size: 12px; color: #64748b; margin-bottom: 4px; }
          .print-card .card-value { font-size: 18px; font-weight: 700; color: #0f172a; }
          .print-card .card-value.financial { color: #667eea; }
          .print-card .card-value.expense { color: #ef4444; }
          .print-card .card-value.active { color: #10b981; }
          .print-card .card-value.inactive { color: #991b1b; }
          .print-summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; background: #f1f5f9; border-radius: 8px; padding: 16px; margin-top: 12px; }
          .print-summary-item { text-align: center; }
          .print-summary-item .summary-label { font-size: 12px; color: #64748b; }
          .print-summary-item .summary-value { font-size: 18px; font-weight: 700; }
          .print-footer { text-align: center; margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; }
          @media print { body { padding: 12px; } .no-print { display: none; } }
          @media (max-width: 768px) { .print-grid { grid-template-columns: repeat(3, 1fr); } .print-grid-4 { grid-template-columns: repeat(2, 1fr); } .print-summary { grid-template-columns: repeat(2, 1fr); } }
          @media (max-width: 480px) { .print-grid { grid-template-columns: repeat(2, 1fr); } }
        </style>
      </head>
      <body>
        <div class="print-header">
          <h1>🏊  الأكاديمية الأولمبية لعلوم الرياضة</h1>
          <div class="subtitle">لوحة التحكم الرئيسية - تقرير الأداء</div>
          <div class="date">التاريخ: ${today} | وقت الطباعة: ${now}</div>
          <div class="date" style="font-size: 11px; opacity: 0.7;">العام المالي: ${this.selectedYear}</div>
        </div>

        <div class="print-section">
          <div class="print-section-title">📊 البيانات المالية</div>
          <div class="print-grid">
            <div class="print-card"><div class="card-label">إجمالي الرواتب</div><div class="card-value financial">${this.formatCurrency(this.data?.totalSalary || 0)}</div></div>
            <div class="print-card"><div class="card-label">إجمالي السلف</div><div class="card-value financial">${this.formatCurrency(this.data?.totalAdvance || 0)}</div></div>
            <div class="print-card"><div class="card-label">إجمالي الحوافز</div><div class="card-value financial">${this.formatCurrency(this.data?.totalIncentives || 0)}</div></div>
            <div class="print-card"><div class="card-label">إيجارات الأماكن</div><div class="card-value financial">${this.formatCurrency(this.data?.totalPlacesRent || 0)}</div></div>
            <div class="print-card"><div class="card-label">مدفوعات التسجيل</div><div class="card-value financial">${this.formatCurrency(this.data?.totalEnrollmentPayments || 0)}</div></div>
            <div class="print-card"><div class="card-label">مصروفات اخري</div><div class="card-value expense">${this.formatCurrency(this.data?.totalExpenses || 0)}</div></div>
            <div class="print-card"><div class="card-label">استردادات التسجيل</div><div class="card-value expense">${this.formatCurrency(this.data?.totalEnrollmentRefunds || 0)}</div></div>
            </div>
        </div>

        <div class="print-section">
          <div class="print-section-title">✅ الإحصائيات النشطة</div>
          <div class="print-grid-4">
            <div class="print-card"><div class="card-label">الموظفين النشطين</div><div class="card-value active">${this.data?.activeEmployeesCount || 0}</div></div>
            <div class="print-card"><div class="card-label">المتدربين النشطين</div><div class="card-value active">${this.data?.activeTraineesCount || 0}</div></div>
            <div class="print-card"><div class="card-label">الدورات النشطة</div><div class="card-value active">${this.data?.activeCoursesCount || 0}</div></div>
            <div class="print-card"><div class="card-label">التسجيلات النشطة</div><div class="card-value active">${this.data?.activeEnrollmentsCount || 0}</div></div>
          </div>
        </div>

        <div class="print-section">
          <div class="print-section-title">❌ الإحصائيات غير النشطة</div>
          <div class="print-grid-4">
            <div class="print-card"><div class="card-label">الموظفين غير النشطين</div><div class="card-value inactive">${this.data?.inactiveEmployeesCount || 0}</div></div>
            <div class="print-card"><div class="card-label">المتدربين غير النشطين</div><div class="card-value inactive">${this.data?.inactiveTraineesCount || 0}</div></div>
            <div class="print-card"><div class="card-label">الدورات غير النشطة</div><div class="card-value inactive">${this.data?.inactiveCoursesCount || 0}</div></div>
            <div class="print-card"><div class="card-label">التسجيلات غير النشطة</div><div class="card-value inactive">${this.data?.inactiveEnrollmentsCount || 0}</div></div>
          </div>
        </div>

        <div class="print-section">
          <div class="print-section-title">📈 ملخص الأداء</div>
          <div class="print-summary">
            <div class="print-summary-item"><div class="summary-label">إجمالي الإيرادات</div><div class="summary-value" style="color: #667eea;">${this.formatCurrency(this.getTotalRevenue())}</div></div>
            <div class="print-summary-item"><div class="summary-label">إجمالي المصروفات</div><div class="summary-value" style="color: #ef4444;">${this.formatCurrency(this.getTotalExpenses())}</div></div>
            <div class="print-summary-item"><div class="summary-label">صافي الربح</div><div class="summary-value" style="color: ${this.getNetProfit() >= 0 ? '#10b981' : '#ef4444'};">${this.formatCurrency(this.getNetProfit())}</div></div>
            <div class="print-summary-item"><div class="summary-label">إجمالي النشطاء</div><div class="summary-value" style="color: #8b5cf6;">${this.getTotalActive()}</div></div>
          </div>
        </div>

        <div class="print-footer">تم التصدير من نظام إدارة  الأكاديمية الأولمبية لعلوم الرياضة | الإصدار 3.0</div>
        <div class="no-print" style="text-align: center; margin-top: 20px; padding: 10px;">
          <button onclick="window.print();" style="padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: 600;">🖨️ طباعة / حفظ كـ PDF</button>
        </div>
      </body>
      </html>
    `);

    printWindow.document.close();
    this.notification.showSuccess('تم فتح لوحة التحكم للطباعة');
  }
}