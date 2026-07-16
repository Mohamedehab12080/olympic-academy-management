// app.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { AuthService } from './core/auth/auth.service';
import { NotificationService } from './core/services/notification.service';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'نظام إدارة  الأكاديمية الأولمبية لعلوم الرياضة';
  private tokenCheckSubscription?: Subscription;
  private readonly TOKEN_CHECK_INTERVAL = 60000; // Check every minute (was 6000000 - too long!)

  constructor(
    private authService: AuthService,
    private router: Router,
    private notification: NotificationService
  ) {}

  ngOnInit() {
    // Check token on route changes
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.checkTokenAndRedirect();
      }
    });

    // Periodic token check
    this.tokenCheckSubscription = interval(this.TOKEN_CHECK_INTERVAL).subscribe(() => {
      this.checkTokenAndRedirect();
    });
  }

  private checkTokenAndRedirect(): void {
    // Only check if user is supposedly authenticated
    if (this.authService.isAuthenticated && this.authService.getToken()) {
      if (this.authService.isTokenExpired()) {
        this.authService.clearSessionOnExpiration();
        this.notification.showError('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى');
        
        // Don't redirect if already on public pages
        const currentUrl = this.router.url;
        const publicPages = ['/login', '/register', '/forgot-password', '/reset-password', '/activate'];
        const isPublicPage = publicPages.some(page => currentUrl.includes(page));
        
        if (!isPublicPage) {
          // Force navigation with { replaceUrl: true } to prevent back button issues
          this.router.navigate(['/login'], { replaceUrl: true });
        }
      } else {
        // Optional: Show warning before token expires
        this.showTokenExpirationWarning();
      }
    }
  }

  private showTokenExpirationWarning(): void {
    const expirationTime = this.authService.getTokenExpirationTime();
    if (expirationTime) {
      const timeUntilExpiry = expirationTime.getTime() - new Date().getTime();
      const fiveMinutes = 5 * 60 * 1000; // 5 minutes
      const oneMinute = 60 * 1000; // 1 minute
      
      // Show warning 5 minutes before expiration
      if (timeUntilExpiry <= fiveMinutes && timeUntilExpiry > oneMinute) {
        const minutesLeft = Math.ceil(timeUntilExpiry / 60000);
        this.notification.showWarning(`ستنتهي صلاحية الجلسة بعد ${minutesLeft} دقائق`, {
          duration: 10000
        });
      }
      
      // Show urgent warning 1 minute before expiration
      if (timeUntilExpiry <= oneMinute && timeUntilExpiry > 0) {
        const secondsLeft = Math.ceil(timeUntilExpiry / 1000);
        this.notification.showWarning(`ستنتهي صلاحية الجلسة بعد ${secondsLeft} ثواني`, {
          duration: 5000
        });
      }
    }
  }

  ngOnDestroy() {
    this.tokenCheckSubscription?.unsubscribe();
  }
}