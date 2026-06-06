import { Component } from '@angular/core';

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
        
        <mat-nav-list>
          <a mat-list-item routerLink="/dashboard" routerLinkActive="active">
            <mat-icon>dashboard</mat-icon> لوحة التحكم
          </a>
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
          <a mat-list-item routerLink="/financial" routerLinkActive="active">
            <mat-icon>attach_money</mat-icon> الشؤون المالية
          </a>
        </mat-nav-list>
        
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
          </button>
          <mat-menu #userMenu="matMenu">
            <button mat-menu-item>الملف الشخصي</button>
            <button mat-menu-item>الإعدادات</button>
            <mat-divider></mat-divider>
            <button mat-menu-item (click)="logout()">تسجيل الخروج</button>
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
      width: 260px;
      background: white;
    }
    .sidenav-header {
      padding: 20px;
      text-align: center;
      border-bottom: 1px solid #e5e7eb;
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
    .sidenav-footer {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 16px;
      border-top: 1px solid #e5e7eb;
    }
    .logout-btn {
      width: 100%;
      color: #ef4444;
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
  `]
})
export class MainLayoutComponent {
  logout() {
    console.log('تسجيل الخروج');
  }
}