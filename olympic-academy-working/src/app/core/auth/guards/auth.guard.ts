// auth.guard.ts
import { Injectable, inject } from '@angular/core';
import { Router, CanActivateFn, UrlTree } from '@angular/router';
import { AuthService } from '../auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Injectable({ providedIn: 'root' })
export class AuthGuardService {
  constructor(
    private authService: AuthService,
    private router: Router,
    private notification: NotificationService
  ) {}

  canActivate(): boolean | UrlTree {
    // Check if user is authenticated
    if (!this.authService.isAuthenticated) {
      this.notification.showWarning('يرجى تسجيل الدخول أولاً');
      return this.router.createUrlTree(['/login']);
    }
    
    // Check if token is expired
    if (this.authService.isTokenExpired()) {
      this.authService.clearSessionOnExpiration();
      this.notification.showError('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى');
      return this.router.createUrlTree(['/login']);
    }
    
    return true;
  }
}

export const AuthGuard: CanActivateFn = () => {
  return inject(AuthGuardService).canActivate();
};