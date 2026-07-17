// auth.guard.ts

import { Injectable, inject } from '@angular/core';
import { Router, CanActivateFn, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Injectable({ providedIn: 'root' })
export class AuthGuardService {
  constructor(
    private authService: AuthService,
    private router: Router,
    private notification: NotificationService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    // Get the URL path
    const url = state.url;
    console.log('🔍 AuthGuard checking URL:', url);
    
    // Check if this is a public route
    const isPublicRoute = 
      url.startsWith('/login') ||
      url.startsWith('/register') ||
      url.startsWith('/auth/activate') ||
      url.startsWith('/activate') ||
      url.startsWith('/forgot-password') ||
      url.startsWith('/reset-password');
    
    if (isPublicRoute) {
      console.log('✅ Public route, allowing access:', url);
      return true;
    }

    console.log('🔒 Protected route, checking authentication...');
    
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

export const AuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return inject(AuthGuardService).canActivate(route, state);
};