import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-financial-dashboard',
  standalone: false,
  template: `
    <div class="financial-dashboard">
      <div class="header">
        <h1>الشؤون المالية</h1>
        <p>إدارة جميع المعاملات المالية في الأكاديمية</p>
      </div>

      <div class="cards-grid">
        <!-- طرق الدفع -->
        <mat-card class="card" routerLink="/financial/payment-methods">
          <mat-icon class="card-icon">payment</mat-icon>
          <h3>طرق الدفع</h3>
          <p>إدارة طرق الدفع المتاحة</p>
        </mat-card>

        <!-- أنواع المصروفات -->
        <mat-card class="card" routerLink="/financial/expense-types">
          <mat-icon class="card-icon">category</mat-icon>
          <h3>أنواع المصروفات</h3>
          <p>إدارة أنواع المصروفات</p>
        </mat-card>

        <!-- أنواع الإيجار -->
        <mat-card class="card" routerLink="/financial/rent-types">
          <mat-icon class="card-icon">home_work</mat-icon>
          <h3>أنواع الإيجار</h3>
          <p>إدارة أنواع الإيجار</p>
        </mat-card>

        <!-- مدفوعات إيجار المواقع -->
        <mat-card class="card" routerLink="/financial/place-rent-payments">
          <mat-icon class="card-icon">real_estate_agent</mat-icon>
          <h3>مدفوعات الإيجار</h3>
          <p>تسجيل مدفوعات إيجار المواقع</p>
        </mat-card>

        <!-- المصروفات -->
        <mat-card class="card" routerLink="/financial/expenses">
          <mat-icon class="card-icon">receipt</mat-icon>
          <h3>المصروفات</h3>
          <p>تسجيل المصروفات اليومية</p>
        </mat-card>

        <!-- مدفوعات التسجيلات -->
        <mat-card class="card" routerLink="/financial/enrollment-payments">
          <mat-icon class="card-icon">school</mat-icon>
          <h3>مدفوعات التسجيلات</h3>
          <p>تسجيل مدفوعات المتدربين</p>
        </mat-card>

        <!-- استردادات التسجيلات -->
        <mat-card class="card" routerLink="/financial/enrollment-refunds">
          <mat-icon class="card-icon">currency_exchange</mat-icon>
          <h3>استردادات التسجيلات</h3>
          <p>إدارة استردادات المبالغ</p>
        </mat-card>

        <!-- حوافز الموظفين -->
        <mat-card class="card" routerLink="/financial/salary-incentives">
          <mat-icon class="card-icon">emoji_events</mat-icon>
          <h3>حوافز الموظفين</h3>
          <p>إدارة حوافز ومكافآت الموظفين</p>
        </mat-card>

        <!-- خصومات الموظفين -->
        <mat-card class="card" routerLink="/financial/salary-deductions">
          <mat-icon class="card-icon">remove_circle</mat-icon>
          <h3>خصومات الموظفين</h3>
          <p>إدارة خصومات الموظفين</p>
        </mat-card>

        <!-- التقارير المالية -->
        <mat-card class="card" routerLink="/financial/reports">
          <mat-icon class="card-icon">assessment</mat-icon>
          <h3>التقارير المالية</h3>
          <p>عرض التقارير والإحصائيات المالية</p>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .financial-dashboard {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }
    .header {
      margin-bottom: 32px;
    }
    .header h1 {
      font-size: 28px;
      font-weight: 700;
      margin: 0 0 8px 0;
      color: #1f2937;
    }
    .header p {
      color: #6b7280;
      margin: 0;
      font-size: 16px;
    }
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 24px;
    }
    .card {
      cursor: pointer;
      transition: all 0.3s ease;
      text-align: center;
      padding: 24px;
      border-radius: 16px;
    }
    .card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0,0,0,0.1);
      background: linear-gradient(135deg, #fff, #f8fafc);
    }
    .card-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #2563eb;
      margin-bottom: 16px;
    }
    .card h3 {
      font-size: 18px;
      font-weight: 600;
      margin: 0 0 8px 0;
      color: #1f2937;
    }
    .card p {
      font-size: 14px;
      color: #6b7280;
      margin: 0;
    }
  `]
})
export class FinancialDashboardComponent {}