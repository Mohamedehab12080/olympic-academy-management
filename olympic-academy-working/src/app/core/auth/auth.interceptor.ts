import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { NotificationService } from '../services/notification.service';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);
  const token = authService.getToken();

  // Clone the request and add the authorization header
  let authReq = req;
  if (token && !req.url.includes('/auth/login') && 
      !req.url.includes('/auth/register') && 
      !req.url.includes('/auth/forgot-password') &&
      !req.url.includes('/auth/reset-password') &&
      !req.url.includes('/auth/activate')) {
    
    // Check if token is expired before making the request
    if (authService.isTokenExpired(token)) {
      authService.clearSessionOnExpiration();
      notificationService.showError('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى');
      router.navigate(['/login']);
      return throwError(() => new Error('Token expired'));
    }
    
    authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
  }

  // Handle the request and catch errors
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Check for 401 Unauthorized error (token expired or invalid)
      if (error.status === 401) {
        // Clear session
        authService.clearSessionOnExpiration();
        
        // Show message
        notificationService.showError('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى');
        
        // Redirect to login
        router.navigate(['/login']);
      }
      
      // Check for 403 Forbidden
      if (error.status === 403) {
        notificationService.showError('غير مصرح لك بالوصول إلى هذه الصفحة');
      }
      
      return throwError(() => error);
    })
  );
};