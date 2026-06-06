import { Component } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  children?: NavItem[];
}

@Component({
  selector: 'app-main-layout',
  template: `
    <mat-sidenav-container class="sidenav-container">
      <!-- Sidebar -->
      <mat-sidenav mode="side" opened="true" class="sidenav">
        <div class="sidenav-header">
          <mat-icon class="logo-icon">sports_score</mat-icon>
          <span class="logo-text">الأكاديمية الأولمبية</span>
        </div>
        
        <!-- Scrollable nav list -->
        <div class="nav-scroll-wrapper">
          <mat-nav-list>
            <!-- القسم الرئيسي -->
            <a mat-list-item routerLink="/dashboard" routerLinkActive="active">
              <mat-icon>dashboard</mat-icon> لوحة التحكم
            </a>
            
            <!-- إدارة -->
            <div class="nav-section-title">الإدارة</div>
            <a mat-list-item routerLink="/departments" routerLinkActive="active">
              <mat-icon>business</mat-icon> الأقسام
            </a>
            <a mat-list-item routerLink="/courses" routerLinkActive="active">
              <mat-icon>school</mat-icon> الدورات
            </a>
            <a mat-list-item routerLink="/employees" routerLinkActive="active">
              <mat-icon>people</mat-icon> الموظفين
            </a>
            <a mat-list-item routerLink="/trainees" routerLinkActive="active">
              <mat-icon>groups</mat-icon> المتدربين
            </a>
            <a mat-list-item routerLink="/enrollments" routerLinkActive="active">
              <mat-icon>assignment_ind</mat-icon> التسجيلات
            </a>
            <a mat-list-item routerLink="/places" routerLinkActive="active">
              <mat-icon>location_on</mat-icon> المواقع
            </a>
            
            <!-- الحضور (Attendance) -->
            <div class="nav-section-title">الحضور</div>
            <a mat-list-item routerLink="/attendance/employee" routerLinkActive="active">
              <mat-icon>event_available</mat-icon> حضور الموظفين
            </a>
            <a mat-list-item routerLink="/trainees/attendance" routerLinkActive="active">
            <mat-icon>event_note</mat-icon> حضور المتدربين
            </a>
            
            <!-- التقارير (Reports) -->
            <div class="nav-section-title">التقارير</div>
            <a mat-list-item routerLink="/reports/attendance" routerLinkActive="active">
              <mat-icon>assessment</mat-icon> تقرير الحضور
            </a>
            <a mat-list-item routerLink="/reports/employee" routerLinkActive="active">
              <mat-icon>people_alt</mat-icon> تقرير الموظفين
            </a>
            <a mat-list-item routerLink="/reports/trainee" routerLinkActive="active">
              <mat-icon>school</mat-icon> تقرير المتدربين
            </a>
            <a mat-list-item routerLink="/reports/enrollment" routerLinkActive="active">
              <mat-icon>receipt</mat-icon> تقرير التسجيلات
            </a>
            <a mat-list-item routerLink="/reports/course" routerLinkActive="active">
              <mat-icon>menu_book</mat-icon> تقرير الدورات
            </a>
            <a mat-list-item routerLink="/reports/financial" routerLinkActive="active">
              <mat-icon>attach_money</mat-icon> تقرير مالي
            </a>
            
            <!-- الشؤون المالية -->
            <div class="nav-section-title">المالية</div>
            <a mat-list-item routerLink="/financial" routerLinkActive="active">
              <mat-icon>account_balance</mat-icon> الشؤون المالية
            </a>
          </mat-nav-list>
        </div>
        
        <!-- Footer fixed at bottom -->
        <div class="sidenav-footer">
          <button mat-button class="logout-btn" (click)="logout()">
            <mat-icon>logout</mat-icon> تسجيل الخروج
          </button>
        </div>
      </mat-sidenav>

      <!-- Main Content -->
      <mat-sidenav-content>
        <mat-toolbar class="toolbar">
          <span class="spacer"></span>
          <button mat-icon-button [matMenuTriggerFor]="userMenu">
            <mat-icon>person</mat-icon>
            <span class="user-name">{{ userName }}</span>
          </button>
          <mat-menu #userMenu="matMenu">
            <button mat-menu-item>
              <mat-icon>account_circle</mat-icon>
              <span>الملف الشخصي</span>
            </button>
            <button mat-menu-item>
              <mat-icon>settings</mat-icon>
              <span>الإعدادات</span>
            </button>
            <mat-divider></mat-divider>
            <button mat-menu-item (click)="logout()">
              <mat-icon>logout</mat-icon>
              <span>تسجيل الخروج</span>
            </button>
          </mat-menu>
        </mat-toolbar>
        
        <div class="content">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      height: 100vh;
    }
    
    .sidenav {
      width: 280px;
      background: white;
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    
    .sidenav-header {
      padding: 20px;
      text-align: center;
      border-bottom: 1px solid #e5e7eb;
      flex-shrink: 0;
    }
    
    .logo-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
      color: #2563eb;
    }
    
    .logo-text {
      display: block;
      font-size: 16px;
      font-weight: bold;
      color: #2563eb;
      margin-top: 8px;
    }
    
    /* Scrollable nav wrapper */
    .nav-scroll-wrapper {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
    }
    
    .nav-section-title {
      padding: 12px 16px 4px 16px;
      font-size: 12px;
      font-weight: 600;
      color: #6b7280;
      letter-spacing: 0.5px;
    }
    
    mat-nav-list a {
      margin: 4px 8px;
      border-radius: 8px;
    }
    
    mat-nav-list a.active {
      background-color: #eff6ff;
      color: #2563eb;
    }
    
    mat-nav-list a.active mat-icon {
      color: #2563eb;
    }
    
    /* Fixed footer */
    .sidenav-footer {
      flex-shrink: 0;
      padding: 16px;
      border-top: 1px solid #e5e7eb;
      background: white;
    }
    
    .logout-btn {
      width: 100%;
      color: #ef4444;
      text-align: right;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
    
    .logout-btn mat-icon {
      margin-left: 8px;
      margin-right: 0;
    }
    
    .toolbar {
      background: white;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    
    .spacer {
      flex: 1;
    }
    
    .content {
      padding: 24px;
      background: #f3f4f6;
      min-height: calc(100vh - 64px);
    }
    
    .user-name {
      margin-right: 8px;
      font-size: 14px;
    }
    
    /* RTL support */
    .nav-section-title,
    mat-nav-list a,
    .logout-btn {
      text-align: right;
    }
    
    mat-nav-list a mat-icon {
      margin-left: 12px;
      margin-right: 0;
    }
  `]
})
export class MainLayoutComponent {
  userName: string = '';

  constructor(private authService: AuthService) {
    this.userName = this.authService.currentUser?.fullName || 'المستخدم';
  }

  logout() {
    this.authService.logout();
  }
}