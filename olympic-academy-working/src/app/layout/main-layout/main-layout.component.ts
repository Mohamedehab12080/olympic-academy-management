import { Component, HostListener } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-main-layout',
  template: `
    <mat-sidenav-container class="sidenav-container">
      <!-- Sidebar -->
      <mat-sidenav
        mode="side"
        [opened]="sidebarOpen"
        [mode]="isMobile ? 'over' : 'side'"
        (closedStart)="sidebarOpen = false"
        class="sidenav"
        [class.collapsed]="!sidebarExpanded"
      >
        <div class="sidenav-header">
          <div class="logo-container">
            <!-- Logo Image - Blue Theme -->
            <div class="logo-wrapper">
              <img
                src="assets/images/mainLogoSvg.svg"
                alt="الأكاديمية الأولمبية"
                class="logo-image"
                [class.collapsed]="!sidebarExpanded"
              />
            </div>
            <span class="logo-text" *ngIf="sidebarExpanded"
              >الأكاديمية الأولمبية</span
            >
          </div>
        </div>

        <!-- Scrollable nav list -->
        <div class="nav-scroll-wrapper">
          <mat-nav-list>
            <a
              mat-list-item
              routerLink="/dashboard"
              routerLinkActive="active"
              [class.compact]="!sidebarExpanded"
            >
              <mat-icon>dashboard</mat-icon>
              <span *ngIf="sidebarExpanded">لوحة التحكم</span>
            </a>

            <!-- Management Section -->
            <div class="nav-section-title" *ngIf="sidebarExpanded">الإدارة</div>

            <a
              mat-list-item
              routerLink="/departments"
              routerLinkActive="active"
              [class.compact]="!sidebarExpanded"
            >
              <mat-icon>business</mat-icon>
              <span *ngIf="sidebarExpanded">الأقسام</span>
            </a>

            <a
              mat-list-item
              routerLink="/courses"
              routerLinkActive="active"
              [class.compact]="!sidebarExpanded"
            >
              <mat-icon>school</mat-icon>
              <span *ngIf="sidebarExpanded">الدورات</span>
            </a>

            <a
              mat-list-item
              routerLink="/sessions"
              routerLinkActive="active"
              [class.compact]="!sidebarExpanded"
            >
              <mat-icon>schedule</mat-icon>
              <span *ngIf="sidebarExpanded">جلسات الدورات</span>
            </a>

            <a
              mat-list-item
              routerLink="/employees"
              routerLinkActive="active"
              [class.compact]="!sidebarExpanded"
            >
              <mat-icon>people</mat-icon>
              <span *ngIf="sidebarExpanded">الموظفين</span>
            </a>

            <a
              mat-list-item
              routerLink="/trainees"
              routerLinkActive="active"
              [class.compact]="!sidebarExpanded"
            >
              <mat-icon>groups</mat-icon>
              <span *ngIf="sidebarExpanded">المتدربين</span>
            </a>

            <a
              mat-list-item
              routerLink="/enrollments"
              routerLinkActive="active"
              [class.compact]="!sidebarExpanded"
            >
              <mat-icon>assignment_ind</mat-icon>
              <span *ngIf="sidebarExpanded">التسجيلات</span>
            </a>

            <a
              mat-list-item
              routerLink="/places"
              routerLinkActive="active"
              [class.compact]="!sidebarExpanded"
            >
              <mat-icon>location_on</mat-icon>
              <span *ngIf="sidebarExpanded">المواقع</span>
            </a>

            <!-- Trainer Management Section -->
            <div class="nav-section-title" *ngIf="sidebarExpanded">
              إدارة المدربين
            </div>

            <a
              mat-list-item
              routerLink="/employees/trainer-departments"
              routerLinkActive="active"
              [class.compact]="!sidebarExpanded"
            >
              <mat-icon>business</mat-icon>
              <span *ngIf="sidebarExpanded">أقسام المدربين</span>
            </a>

            <a
              mat-list-item
              routerLink="/employees/trainer-courses"
              routerLinkActive="active"
              [class.compact]="!sidebarExpanded"
            >
              <mat-icon>school</mat-icon>
              <span *ngIf="sidebarExpanded">دورات المدربين</span>
            </a>

            <!-- Attendance Section -->
            <div class="nav-section-title" *ngIf="sidebarExpanded">الحضور</div>

            <a
              mat-list-item
              routerLink="/attendance/employee"
              routerLinkActive="active"
              [class.compact]="!sidebarExpanded"
            >
              <mat-icon>event_available</mat-icon>
              <span *ngIf="sidebarExpanded">حضور الموظفين</span>
            </a>

            <a
              mat-list-item
              routerLink="/trainees/attendance"
              routerLinkActive="active"
              [class.compact]="!sidebarExpanded"
            >
              <mat-icon>event_note</mat-icon>
              <span *ngIf="sidebarExpanded">حضور المتدربين</span>
            </a>

            <!-- Settings Section -->
            <div class="nav-section-title" *ngIf="sidebarExpanded">
              الإعدادات
            </div>

            <!-- Constants -->
            <a
              mat-list-item
              routerLink="/constants"
              routerLinkActive="active"
              [class.compact]="!sidebarExpanded"
            >
              <mat-icon>settings_applications</mat-icon>
              <span *ngIf="sidebarExpanded">الثوابت</span>
            </a>

            <!-- Reports Section -->
            <div class="nav-section-title" *ngIf="sidebarExpanded">
              التقارير
            </div>

            <a
              mat-list-item
              routerLink="/reports/financial"
              routerLinkActive="active"
              [class.compact]="!sidebarExpanded"
            >
              <mat-icon>attach_money</mat-icon>
              <span *ngIf="sidebarExpanded">تقرير مالي</span>
            </a>

            <!-- Financial Section -->
            <div class="nav-section-title" *ngIf="sidebarExpanded">المالية</div>

            <a
              mat-list-item
              routerLink="/financial"
              routerLinkActive="active"
              [class.compact]="!sidebarExpanded"
            >
              <mat-icon>account_balance</mat-icon>
              <span *ngIf="sidebarExpanded">الشؤون المالية</span>
            </a>
          </mat-nav-list>
        </div>

        <!-- Footer fixed at bottom -->
        <div class="sidenav-footer">
          <button
            mat-button
            class="logout-btn"
            (click)="logout()"
            [class.compact]="!sidebarExpanded"
          >
            <mat-icon>logout</mat-icon>
            <span *ngIf="sidebarExpanded">تسجيل الخروج</span>
          </button>
        </div>
      </mat-sidenav>

      <!-- Main Content -->
      <mat-sidenav-content>
        <mat-toolbar class="toolbar">
          <button mat-icon-button (click)="toggleSidebar()" class="menu-toggle">
            <mat-icon>menu</mat-icon>
          </button>

          <span class="spacer"></span>

          <!-- User Profile Section -->
          <div class="user-profile" [matMenuTriggerFor]="userMenu">
            <div class="user-avatar">
              <mat-icon>person</mat-icon>
            </div>
            <div class="user-info" *ngIf="!isMobile">
              <span class="user-name">{{ userName }}</span>
              <span class="user-role">{{ userRole }}</span>
            </div>
            <mat-icon class="dropdown-icon">arrow_drop_down</mat-icon>
          </div>

          <mat-menu #userMenu="matMenu" class="user-profile-menu">
            <div class="menu-header" *ngIf="!isMobile">
              <div class="menu-avatar">
                <mat-icon>person</mat-icon>
              </div>
              <div class="menu-user-info">
                <div class="menu-user-name">{{ userName }}</div>
                <div class="menu-user-email">{{ userEmail }}</div>
                <div class="menu-user-role">{{ userRole }}</div>
              </div>
            </div>
            <mat-divider></mat-divider>
            <button mat-menu-item routerLink="/profile">
              <mat-icon>account_circle</mat-icon>
              <span>الملف الشخصي</span>
            </button>
            <button mat-menu-item routerLink="/settings">
              <mat-icon>settings</mat-icon>
              <span>الإعدادات</span>
            </button>
            <mat-divider></mat-divider>
            <button mat-menu-item (click)="logout()" class="logout-menu-item">
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
  styles: [
    `
      /* Container */
      .sidenav-container {
        height: 100vh;
        background: #f5f7fa;
      }

      /* Sidebar */
      .sidenav {
        width: 280px;
        background: white;
        display: flex;
        flex-direction: column;
        height: 100%;
        border-right: 1px solid #e5e7eb;
        transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
      }

      .sidenav.collapsed {
        width: 80px;
      }

      /* Sidebar Header */
      .sidenav-header {
        padding: 20px 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid #e5e7eb;
        background: white;
        min-height: 80px;
      }

      .logo-container {
        display: flex;
        align-items: center;
        gap: 12px;
        overflow: visible;
        width: 100%;
        justify-content: center;
      }

      /* Logo Wrapper - Blue Theme (matching project colors) */
      .logo-wrapper {
        display: inline-block;
        filter: brightness(0) saturate(100%) invert(30%) sepia(100%)
          saturate(2000%) hue-rotate(210deg) brightness(95%);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .logo-image {
        width: 64px;
        height: 64px;
        border-radius: 0;
        object-fit: contain;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        flex-shrink: 0;
        background: transparent !important;
        box-shadow: none !important;
        border: none !important;
        display: block;
      }

      .logo-image.collapsed {
        width: 56px;
        height: 56px;
      }

      .logo-wrapper:hover {
        transform: scale(1.05);
        filter: brightness(0) saturate(100%) invert(30%) sepia(100%)
          saturate(2000%) hue-rotate(210deg) brightness(110%)
          drop-shadow(0 0 8px rgba(37, 99, 235, 0.3));
      }

      .logo-text {
        font-size: 18px;
        font-weight: 700;
        color: #1e293b;
        white-space: nowrap;
        transition: opacity 0.3s ease;
      }

      .sidenav.collapsed .logo-text {
        display: none;
      }

      /* Navigation Scroll Wrapper */
      .nav-scroll-wrapper {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 16px 0;
      }

      .nav-scroll-wrapper::-webkit-scrollbar {
        width: 5px;
      }

      .nav-scroll-wrapper::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
      }

      .nav-scroll-wrapper::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 10px;
      }

      .nav-scroll-wrapper::-webkit-scrollbar-thumb:hover {
        background: #94a3b8;
      }

      /* Section Title */
      .nav-section-title {
        padding: 16px 20px 8px 20px;
        font-size: 11px;
        font-weight: 700;
        color: #94a3b8;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      /* Navigation Items */
      mat-nav-list a {
        margin: 4px 12px;
        border-radius: 12px;
        transition: all 0.3s;
        height: 48px;
        color: #475569;
        font-weight: 500;
        position: relative;
      }

      mat-nav-list a:hover {
        background: #f1f5f9;
        transform: translateX(-4px);
      }

      mat-nav-list a.active {
        background: #eff6ff;
        color: #2563eb;
      }

      mat-nav-list a.active mat-icon {
        color: #2563eb;
      }

      mat-nav-list a.compact {
        justify-content: center;
        padding: 0;
      }

      mat-nav-list a mat-icon {
        margin-left: 12px;
        margin-right: 0;
        transition: all 0.3s;
        color: #64748b;
      }

      /* Sidebar Footer */
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
        justify-content: flex-start;
        gap: 12px;
        padding: 12px 16px;
        border-radius: 12px;
        transition: all 0.3s;
      }

      .logout-btn:hover {
        background: #fef2f2;
        transform: translateX(-4px);
      }

      .logout-btn.compact {
        justify-content: center;
        padding: 12px;
      }

      .logout-btn mat-icon {
        margin: 0;
        color: #ef4444;
      }

      /* Toolbar */
      .toolbar {
        background: white;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        padding: 0 24px;
        height: 70px;
        display: flex;
        align-items: center;
      }

      .menu-toggle {
        margin-left: 8px;
        transition: transform 0.3s;
        color: #475569;
      }

      .menu-toggle:hover {
        transform: scale(1.1);
        background: #f1f5f9;
      }

      .spacer {
        flex: 1;
      }

      /* User Profile Section */
      .user-profile {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 16px;
        border-radius: 40px;
        cursor: pointer;
        transition: all 0.3s;
        background: #f8fafc;
        border: 1px solid #e5e7eb;
      }

      .user-profile:hover {
        background: #f1f5f9;
        border-color: #cbd5e1;
      }

      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .user-avatar mat-icon {
        font-size: 22px;
        width: 22px;
        height: 22px;
        color: white;
      }

      .user-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .user-name {
        font-size: 14px;
        font-weight: 600;
        color: #1e293b;
      }

      .user-role {
        font-size: 11px;
        color: #64748b;
      }

      .dropdown-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
        color: #94a3b8;
      }

      /* User Profile Menu */
      ::ng-deep .user-profile-menu {
        margin-top: 8px;
      }

      ::ng-deep .user-profile-menu .mat-menu-content {
        padding: 0;
        min-width: 260px;
      }

      .menu-header {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px;
        background: #f8fafc;
      }

      .menu-avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .menu-avatar mat-icon {
        font-size: 28px;
        width: 28px;
        height: 28px;
        color: white;
      }

      .menu-user-info {
        flex: 1;
      }

      .menu-user-name {
        font-size: 14px;
        font-weight: 600;
        color: #1e293b;
        margin-bottom: 2px;
      }

      .menu-user-email {
        font-size: 11px;
        color: #64748b;
        margin-bottom: 2px;
      }

      .menu-user-role {
        font-size: 11px;
        color: #2563eb;
        font-weight: 500;
      }

      .logout-menu-item {
        color: #ef4444 !important;
      }

      .logout-menu-item mat-icon {
        color: #ef4444 !important;
      }

      /* Content Area */
      .content {
        padding: 24px;
        min-height: calc(100vh - 70px);
        background: #f5f7fa;
        animation: fadeIn 0.3s ease-out;
      }

      /* Animations */
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* RTL Support */
      .nav-section-title,
      mat-nav-list a,
      .logout-btn {
        text-align: right;
      }

      mat-nav-list a mat-icon {
        margin-left: 12px;
        margin-right: 0;
      }

      /* Responsive Design */
      @media (max-width: 1024px) {
        .sidenav {
          width: 260px;
        }

        .sidenav.collapsed {
          width: 72px;
        }

        .content {
          padding: 20px;
        }
      }

      @media (max-width: 768px) {
        .sidenav {
          position: fixed;
          z-index: 1000;
          height: 100%;
          width: 280px !important;
        }

        .sidenav.collapsed {
          width: 280px !important;
        }

        .content {
          padding: 16px;
        }

        .toolbar {
          padding: 0 16px;
          height: 60px;
        }

        .user-profile {
          padding: 6px 12px;
        }

        .user-info {
          display: none;
        }

        .user-avatar {
          width: 36px;
          height: 36px;
        }

        .user-avatar mat-icon {
          font-size: 20px;
          width: 20px;
          height: 20px;
        }

        mat-nav-list a {
          margin: 2px 8px;
          height: 44px;
        }

        .nav-section-title {
          padding: 12px 16px 4px 16px;
          font-size: 10px;
        }

        .logo-image {
          width: 56px;
          height: 56px;
        }
      }

      @media (max-width: 480px) {
        .content {
          padding: 12px;
        }

        .toolbar {
          height: 56px;
        }

        .user-profile {
          padding: 4px 10px;
        }

        .user-avatar {
          width: 32px;
          height: 32px;
        }

        .user-avatar mat-icon {
          font-size: 18px;
          width: 18px;
          height: 18px;
        }

        mat-nav-list a {
          height: 40px;
          font-size: 13px;
        }

        mat-nav-list a mat-icon {
          font-size: 20px;
          width: 20px;
          height: 20px;
        }

        .logo-image {
          width: 48px;
          height: 48px;
        }

        .logo-text {
          font-size: 14px;
        }

        .sidenav-header {
          padding: 16px 12px;
          min-height: 70px;
        }

        .sidenav {
          width: 260px !important;
        }

        .sidenav.collapsed {
          width: 260px !important;
        }
      }
    `,
  ],
})
export class MainLayoutComponent {
  userName: string = '';
  userEmail: string = '';
  userRole: string = '';
  sidebarOpen: boolean = true;
  sidebarExpanded: boolean = true;
  isMobile: boolean = false;

  constructor(private authService: AuthService) {
    const currentUser = this.authService.currentUser;
    this.userName = currentUser?.fullName || 'المستخدم';
    this.userEmail = currentUser?.email || '';

    // Format role for display
    const roles = currentUser?.roles || [];
    if (roles.includes('ADMIN') || roles.includes('SUPER_ADMIN')) {
      this.userRole = 'مدير النظام';
    } else if (roles.includes('MANAGER')) {
      this.userRole = 'مدير';
    } else if (roles.includes('TRAINER')) {
      this.userRole = 'مدرب';
    } else if (roles.includes('USER')) {
      this.userRole = 'مستخدم';
    } else {
      this.userRole = 'موظف';
    }

    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
    if (this.isMobile) {
      this.sidebarOpen = false;
      this.sidebarExpanded = true;
    } else {
      this.sidebarOpen = true;
      this.sidebarExpanded = true;
    }
  }

  toggleSidebar() {
    if (this.isMobile) {
      this.sidebarOpen = !this.sidebarOpen;
    } else {
      this.sidebarExpanded = !this.sidebarExpanded;
      if (!this.sidebarExpanded) {
        this.sidebarOpen = true;
      }
    }
  }

  logout() {
    this.authService.logout();
  }
}
