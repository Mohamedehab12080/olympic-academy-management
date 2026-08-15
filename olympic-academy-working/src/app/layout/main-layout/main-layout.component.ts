// main-layout.component.ts - FIXED WITH PROPER MODAL HANDLING

import { Component, OnInit, OnDestroy, HostListener, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subject, takeUntil, catchError, of } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { TraineeService } from '../../core/services/trainee.service';
import { TraineeWizardModalComponent } from '../../../app/features/trainees/pages/trainee-wizard/trainee-wizard-modal.component';
import { TraineeDetailsModalComponent } from '../../../app/features/trainees/pages/trainee-details/trainee-details-modal.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule,
    MatTooltipModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  template: `
    <div class="app-container">
      <!-- Toolbar -->
      <mat-toolbar color="primary" class="app-toolbar">
        <button mat-icon-button (click)="sidenav.toggle()" class="menu-toggle">
          <mat-icon>menu</mat-icon>
        </button>
        
        <div class="toolbar-brand">
          <img src="assets/images/simpleLogo.jpeg" alt="Logo" class="brand-logo" (error)="onLogoError()">
          <span class="brand-name">الأكاديمية الأولمبية</span>
        </div>

        <span class="toolbar-spacer"></span>

        <!-- Trainee Profile Status Indicator -->
        <div class="profile-status" *ngIf="isTraineeRole">
          <div class="status-indicator" 
               [class.has-profile]="hasTraineeProfile" 
               [class.no-profile]="!hasTraineeProfile && !isLoadingProfile">
            <mat-icon>{{ hasTraineeProfile ? 'check_circle' : 'warning' }}</mat-icon>
            <span>{{ hasTraineeProfile ? 'الملف مكتمل' : 'الملف غير مكتمل' }}</span>
          </div>
          <mat-spinner diameter="20" *ngIf="isLoadingProfile"></mat-spinner>
        </div>

        <!-- User Menu -->
        <button mat-icon-button [matMenuTriggerFor]="userMenu" class="user-menu-btn">
          <mat-icon>account_circle</mat-icon>
        </button>
        <mat-menu #userMenu="matMenu">
          <button mat-menu-item (click)="openProfile()">
            <mat-icon>person</mat-icon>
            <span>{{ isTraineeRole ? 'ملفي الشخصي' : 'الملف الشخصي' }}</span>
          </button>
          <button mat-menu-item (click)="logout()">
            <mat-icon>exit_to_app</mat-icon>
            <span>تسجيل الخروج</span>
          </button>
        </mat-menu>
      </mat-toolbar>

      <!-- Sidenav -->
      <mat-sidenav-container class="sidenav-container">
        <mat-sidenav #sidenav mode="side" [opened]="isSidenavOpen" class="app-sidenav">
          <div class="sidenav-header">
            <div class="user-avatar">
              <mat-icon>account_circle</mat-icon>
            </div>
            <div class="user-info">
              <span class="user-name">{{ currentUser?.fullName || 'مستخدم' }}</span>
              <span class="user-role">{{ getUserRoleDisplay() }}</span>
            </div>
          </div>

          <mat-divider></mat-divider>

          <mat-nav-list class="sidenav-nav">
            <!-- ========== ADMIN/SUPER_ADMIN ITEMS ========== -->
            <ng-container *ngIf="isAdminRole || isSuperAdminRole">
              <a mat-list-item 
                 [routerLink]="'/dashboard'"
                 routerLinkActive="active-link"
                 #rla="routerLinkActive"
                 [activated]="rla.isActive"
                 (click)="sidenav.close()"
                 class="nav-item">
                <mat-icon matListItemIcon>dashboard</mat-icon>
                <span matListItemTitle>لوحة التحكم</span>
              </a>

              <a mat-list-item 
                 [routerLink]="'/trainees'"
                 routerLinkActive="active-link"
                 #rla1="routerLinkActive"
                 [activated]="rla1.isActive"
                 (click)="sidenav.close()"
                 class="nav-item">
                <mat-icon matListItemIcon>people</mat-icon>
                <span matListItemTitle>المتدربين</span>
              </a>

              <a mat-list-item 
                 [routerLink]="'/courses'"
                 routerLinkActive="active-link"
                 #rla2="routerLinkActive"
                 [activated]="rla2.isActive"
                 (click)="sidenav.close()"
                 class="nav-item">
                <mat-icon matListItemIcon>class</mat-icon>
                <span matListItemTitle>الدورات</span>
              </a>

              <a mat-list-item 
                 [routerLink]="'/trainers'"
                 routerLinkActive="active-link"
                 #rla3="routerLinkActive"
                 [activated]="rla3.isActive"
                 (click)="sidenav.close()"
                 class="nav-item">
                <mat-icon matListItemIcon>supervised_user_circle</mat-icon>
                <span matListItemTitle>المدربين</span>
              </a>

              <a mat-list-item 
                 [routerLink]="'/enrollments'"
                 routerLinkActive="active-link"
                 #rla4="routerLinkActive"
                 [activated]="rla4.isActive"
                 (click)="sidenav.close()"
                 class="nav-item">
                <mat-icon matListItemIcon>assignment</mat-icon>
                <span matListItemTitle>التسجيلات</span>
              </a>

              <a mat-list-item 
                 [routerLink]="'/attendances'"
                 routerLinkActive="active-link"
                 #rla5="routerLinkActive"
                 [activated]="rla5.isActive"
                 (click)="sidenav.close()"
                 class="nav-item">
                <mat-icon matListItemIcon>event_available</mat-icon>
                <span matListItemTitle>الحضور</span>
              </a>

              <a mat-list-item 
                 *ngIf="isSuperAdminRole"
                 [routerLink]="'/users'"
                 routerLinkActive="active-link"
                 #rla6="routerLinkActive"
                 [activated]="rla6.isActive"
                 (click)="sidenav.close()"
                 class="nav-item">
                <mat-icon matListItemIcon>admin_panel_settings</mat-icon>
                <span matListItemTitle>المستخدمين</span>
              </a>

              <a mat-list-item 
                 [routerLink]="'/reports'"
                 routerLinkActive="active-link"
                 #rla7="routerLinkActive"
                 [activated]="rla7.isActive"
                 (click)="sidenav.close()"
                 class="nav-item">
                <mat-icon matListItemIcon>bar_chart</mat-icon>
                <span matListItemTitle>التقارير</span>
              </a>

              <a mat-list-item 
                 [routerLink]="'/settings'"
                 routerLinkActive="active-link"
                 #rla8="routerLinkActive"
                 [activated]="rla8.isActive"
                 (click)="sidenav.close()"
                 class="nav-item">
                <mat-icon matListItemIcon>settings</mat-icon>
                <span matListItemTitle>الإعدادات</span>
              </a>
            </ng-container>

            <!-- ========== TRAINEE ITEMS ========== -->
            <ng-container *ngIf="isTraineeRole">
              <a mat-list-item 
                 (click)="openProfile(); sidenav.close()"
                 class="nav-item">
                <mat-icon matListItemIcon>person</mat-icon>
                <span matListItemTitle>ملفي الشخصي</span>
              </a>

              <a mat-list-item 
                 [routerLink]="'/trainee/attendance'"
                 routerLinkActive="active-link"
                 #rla10="routerLinkActive"
                 [activated]="rla10.isActive"
                 (click)="sidenav.close()"
                 class="nav-item">
                <mat-icon matListItemIcon>event_note</mat-icon>
                <span matListItemTitle>حضوري</span>
              </a>

              <a mat-list-item 
                 [routerLink]="'/trainee/courses'"
                 routerLinkActive="active-link"
                 #rla11="routerLinkActive"
                 [activated]="rla11.isActive"
                 (click)="sidenav.close()"
                 class="nav-item">
                <mat-icon matListItemIcon>school</mat-icon>
                <span matListItemTitle>دوراتي</span>
              </a>
            </ng-container>
          </mat-nav-list>

          <div class="sidenav-footer">
            <mat-divider></mat-divider>
            <div class="footer-actions">
              <button mat-button color="warn" (click)="logout()" class="logout-btn">
                <mat-icon>exit_to_app</mat-icon>
                تسجيل الخروج
              </button>
            </div>
          </div>
        </mat-sidenav>

        <!-- Main Content -->
        <mat-sidenav-content class="sidenav-content">
          <div class="page-content">
            <router-outlet></router-outlet>
          </div>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styles: [`
    .app-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .app-toolbar {
      flex-shrink: 0;
      padding: 0 16px;
      background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
      position: sticky;
      top: 0;
      z-index: 1000;
      height: 64px;
    }

    .menu-toggle {
      color: white;
      margin-right: 8px;
    }

    .toolbar-brand {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      user-select: none;
    }

    .brand-logo {
      height: 36px;
      width: 36px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid rgba(255, 255, 255, 0.3);
    }

    .brand-name {
      color: white;
      font-size: 20px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }

    .toolbar-spacer {
      flex: 1;
    }

    .profile-status {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 16px;
      padding: 4px 12px;
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(4px);
    }

    .status-indicator {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.8);
    }

    .status-indicator mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .status-indicator.has-profile mat-icon {
      color: #34d399;
    }

    .status-indicator.no-profile mat-icon {
      color: #fbbf24;
    }

    .user-menu-btn {
      color: white;
    }

    .sidenav-container {
      flex: 1;
      background: #f5f7fa;
    }

    .app-sidenav {
      width: 280px;
      background: white;
      border-left: 1px solid #e5e7eb;
      display: flex;
      flex-direction: column;
    }

    .sidenav-header {
      padding: 20px 16px 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      background: #f8fafc;
    }

    .user-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .user-avatar mat-icon {
      color: white;
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .user-name {
      font-size: 14px;
      font-weight: 600;
      color: #1f2937;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-role {
      font-size: 11px;
      color: #6b7280;
    }

    .sidenav-nav {
      flex: 1;
      padding: 8px 0;
      overflow-y: auto;
    }

    .nav-item {
      margin: 2px 8px;
      border-radius: 10px;
      transition: all 0.3s;
      cursor: pointer;
    }

    .nav-item:hover {
      background: #f3e8ff;
    }

    .nav-item.active-link {
      background: linear-gradient(135deg, #f3e8ff 0%, #ede9fe 100%);
      color: #6d28d9;
    }

    .nav-item.active-link mat-icon {
      color: #6d28d9;
    }

    .nav-item mat-icon {
      color: #6b7280;
      transition: color 0.3s;
    }

    .nav-item.active-link mat-icon {
      color: #6d28d9;
    }

    .sidenav-footer {
      flex-shrink: 0;
      padding: 8px 16px;
    }

    .footer-actions {
      display: flex;
      justify-content: center;
      padding: 8px 0;
    }

    .logout-btn {
      width: 100%;
      border-radius: 10px;
      transition: all 0.3s;
      font-weight: 600;
    }

    .logout-btn:hover {
      background: #fee2e2 !important;
      transform: translateY(-1px);
    }

    .logout-btn mat-icon {
      margin-left: 8px;
    }

    .sidenav-content {
      padding: 0;
      overflow-y: auto;
      background: #f5f7fa;
      min-height: calc(100vh - 64px);
    }

    .page-content {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    @media (max-width: 768px) {
      .app-sidenav {
        width: 260px;
      }

      .brand-name {
        font-size: 16px;
      }

      .brand-logo {
        height: 30px;
        width: 30px;
      }

      .profile-status {
        padding: 2px 8px;
        margin: 0 8px;
      }

      .profile-status .status-indicator span {
        display: none;
      }

      .page-content {
        padding: 16px;
      }
    }

    @media (max-width: 480px) {
      .app-sidenav {
        width: 100%;
        max-width: 300px;
      }

      .brand-name {
        font-size: 14px;
      }

      .brand-logo {
        height: 26px;
        width: 26px;
      }

      .sidenav-header {
        padding: 14px 12px;
      }

      .page-content {
        padding: 12px;
      }
    }
  `]
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // State
  isSidenavOpen = true;
  isLoadingProfile = false;
  hasTraineeProfile = false;
  traineeData: any = null;
  private initialized = false;

  // User
  currentUser: any = null;
  isTraineeRole = false;
  isAdminRole = false;
  isSuperAdminRole = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private traineeService: TraineeService,
    private notification: NotificationService,
    private dialog: MatDialog,
    private renderer: Renderer2
  ) {
    // Get current user
    this.currentUser = this.authService.currentUser;
    
    // Check role from the 'role' property
    const userRole = this.currentUser?.role || '';
    
    this.isTraineeRole = userRole === 'ROLE_TRAINEE';
    this.isAdminRole = userRole === 'ROLE_ADMIN';
    this.isSuperAdminRole = userRole === 'ROLE_SUPER_ADMIN';

    console.log('🔐 MainLayout - User Info:');
    console.log('  - currentUser:', this.currentUser);
    console.log('  - userRole:', userRole);
    console.log('  - isTraineeRole:', this.isTraineeRole);
    console.log('  - isAdminRole:', this.isAdminRole);
    console.log('  - isSuperAdminRole:', this.isSuperAdminRole);
  }

  ngOnInit(): void {
    // Prevent multiple initializations
    if (this.initialized) {
      return;
    }
    this.initialized = true;

    // FIX: Remove aria-hidden from app-root if it exists
    this.removeAriaHiddenFromRoot();

    this.checkSidenavState();

    // ============================================================
    // HANDLE INITIAL REDIRECT BASED ON ROLE
    // ============================================================
    const currentUrl = this.router.url;
    const isRoot = currentUrl === '/' || currentUrl === '' || currentUrl === '/login';

    if (this.isTraineeRole) {
      // Trainee: Check profile, then redirect to attendance
      this.checkTraineeProfile();
    } else if (this.isAdminRole || this.isSuperAdminRole) {
      // Admin/SuperAdmin: Redirect to dashboard only if on root
      if (isRoot) {
        console.log('🔄 Admin redirecting to dashboard');
        this.router.navigate(['/dashboard']);
      }
    } else {
      // Unknown role - logout
      console.warn('❌ Unknown role, logging out');
      this.authService.logout();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ============================================================
  // FIX: Remove aria-hidden from app-root
  // ============================================================
  
  private removeAriaHiddenFromRoot(): void {
    try {
      const appRoot = document.querySelector('app-root');
      if (appRoot) {
        const hasAriaHidden = appRoot.hasAttribute('aria-hidden');
        if (hasAriaHidden) {
          console.log('🔧 Removing aria-hidden from app-root');
          this.renderer.removeAttribute(appRoot, 'aria-hidden');
        }
      }
    } catch (error) {
      console.warn('Could not remove aria-hidden:', error);
    }
  }

  // ============================================================
  // CHECK TRAINEE PROFILE
  // ============================================================

  private checkTraineeProfile(): void {
    const userId = this.currentUser?.userId;
    if (!userId) {
      console.warn('No user ID found for trainee profile check');
      return;
    }

    this.isLoadingProfile = true;
    console.log('🔍 Checking trainee profile for user:', userId);

    this.traineeService.getTraineeUserById(userId)
      .pipe(
        takeUntil(this.destroy$),
        catchError((error) => {
          console.warn('No trainee profile found:', error);
          this.hasTraineeProfile = false;
          this.traineeData = null;
          this.isLoadingProfile = false;
          
          // Show wizard to create profile after a small delay
          setTimeout(() => {
            this.openTraineeWizard();
          }, 500);
          
          return of(null);
        })
      )
      .subscribe((data) => {
        if (data) {
          console.log('✅ Trainee profile found:', data);
          this.hasTraineeProfile = true;
          this.traineeData = data;
          this.isLoadingProfile = false;
          
          // ============================================================
          // CRITICAL: Redirect trainee to attendance page ONLY on root
          // ============================================================
          const currentUrl = this.router.url;
          const isRoot = currentUrl === '/' || currentUrl === '' || currentUrl === '/login';
          
          if (isRoot) {
            console.log('🔄 Redirecting trainee to attendance page');
            this.router.navigate(['/trainee/attendance']);
          } else {
            console.log('📍 Trainee already on: ', currentUrl);
          }
        }
      });
  }

  // ============================================================
  // OPEN TRAINEE WIZARD (Create/Complete Profile)
  // ============================================================

  openTraineeWizard(): void {
    // Don't open if already open
    const dialogs = this.dialog.openDialogs;
    if (dialogs.some(d => d.componentInstance instanceof TraineeWizardModalComponent)) {
      return;
    }

    console.log('🔄 Opening trainee wizard');
    const dialogRef = this.dialog.open(TraineeWizardModalComponent, {
      width: '900px',
      maxWidth: '95vw',
      disableClose: true,
      data: {
        isTraineeRole: true,
        traineeUserId: this.currentUser?.userId,
        isEditMode: this.hasTraineeProfile,
        traineeData: this.traineeData
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.success) {
        console.log('✅ Trainee profile created/updated successfully');
        this.hasTraineeProfile = true;
        // Reload trainee data
        this.checkTraineeProfile();
        this.notification.showSuccess('تم حفظ الملف الشخصي بنجاح');
      } else if (result === false) {
        console.log('Trainee wizard closed without success');
      }
      
      // FIX: Ensure aria-hidden is removed after dialog closes
      setTimeout(() => {
        this.removeAriaHiddenFromRoot();
      }, 100);
    });
  }

  // ============================================================
  // OPEN PROFILE
  // ============================================================

  openProfile(): void {
    console.log('📂 Opening profile, isTraineeRole:', this.isTraineeRole);
    console.log('  - hasTraineeProfile:', this.hasTraineeProfile);
    console.log('  - traineeData:', this.traineeData);
    
    if (this.isTraineeRole) {
      if (this.hasTraineeProfile && this.traineeData) {
        // Open trainee details modal
        console.log('✅ Opening trainee details modal');
        const dialogRef = this.dialog.open(TraineeDetailsModalComponent, {
          data: this.traineeData,
          width: '900px',
          maxWidth: '95vw'
        });

        dialogRef.afterClosed().subscribe(() => {
          // FIX: Ensure aria-hidden is removed after dialog closes
          setTimeout(() => {
            this.removeAriaHiddenFromRoot();
          }, 100);
        });
      } else {
        // Open wizard to create profile
        console.log('⚠️ No profile found, opening wizard');
        this.openTraineeWizard();
      }
    } else {
      // For admin/super_admin, navigate to profile page
      console.log('👤 Admin opening profile page');
      this.router.navigate(['/profile']);
    }
  }

  // ============================================================
  // SIDENAV STATE
  // ============================================================

  private checkSidenavState(): void {
    const isMobile = window.innerWidth <= 768;
    this.isSidenavOpen = !isMobile;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkSidenavState();
  }

  // ============================================================
  // HELPER METHODS
  // ============================================================

  getUserRoleDisplay(): string {
    if (this.isSuperAdminRole) return 'مدير النظام';
    if (this.isAdminRole) return 'مدير';
    if (this.isTraineeRole) return 'متدرب';
    return 'مستخدم';
  }

  onLogoError(): void {
    console.warn('Logo image failed to load');
  }

  // ============================================================
  // AUTH METHODS
  // ============================================================

  logout(): void {
    this.authService.logout();
  }
}