import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard">
      <h1 class="title">لوحة التحكم</h1>
      <p class="subtitle">مرحباً بك في نظام إدارة الأكاديمية الأولمبية</p>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon blue">📚</div>
          <div class="stat-info">
            <h3>24</h3>
            <p>الدورات</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon green">👥</div>
          <div class="stat-info">
            <h3>156</h3>
            <p>المتدربين</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon purple">👨‍🏫</div>
          <div class="stat-info">
            <h3>18</h3>
            <p>الموظفين</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon orange">💰</div>
          <div class="stat-info">
            <h3>28,450</h3>
            <p>الإيرادات</p>
          </div>
        </div>
      </div>

      <div class="welcome-card">
        <h2>نظام إدارة الأكاديمية الأولمبية</h2>
        <p>تم تشغيل النظام بنجاح! يمكنك الآن البدء في إدارة الأقسام والدورات والمتدربين.</p>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      max-width: 1200px;
      margin: 0 auto;
    }
    .title {
      font-size: 28px;
      font-weight: bold;
      margin: 0 0 8px 0;
      color: #1f2937;
    }
    .subtitle {
      color: #6b7280;
      margin-bottom: 32px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 32px;
    }
    .stat-card {
      background: white;
      border-radius: 16px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .stat-icon {
      width: 50px;
      height: 50px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }
    .stat-icon.blue { background: #eff6ff; }
    .stat-icon.green { background: #d1fae5; }
    .stat-icon.purple { background: #ede9fe; }
    .stat-icon.orange { background: #fed7aa; }
    .stat-info h3 {
      font-size: 24px;
      font-weight: bold;
      margin: 0;
      color: #1f2937;
    }
    .stat-info p {
      margin: 4px 0 0;
      color: #6b7280;
      font-size: 14px;
    }
    .welcome-card {
      background: linear-gradient(135deg, #2563eb, #1e40af);
      border-radius: 16px;
      padding: 32px;
      color: white;
      text-align: center;
    }
    .welcome-card h2 {
      margin: 0 0 16px;
      font-size: 24px;
    }
    .welcome-card p {
      margin: 0;
      opacity: 0.9;
    }
    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
      }
      .title {
        font-size: 22px;
      }
    }
  `]
})
export class DashboardComponent {}