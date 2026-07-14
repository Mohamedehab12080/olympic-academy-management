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
  private readonly TOKEN_CHECK_INTERVAL = 6000000; // Check every minute

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
        
        // Don't redirect if already on login page
        const currentUrl = this.router.url;
        if (!currentUrl.includes('/login') && 
            !currentUrl.includes('/register') && 
            !currentUrl.includes('/forgot-password') &&
            !currentUrl.includes('/reset-password') &&
            !currentUrl.includes('/activate')) {
          this.router.navigate(['/login']);
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