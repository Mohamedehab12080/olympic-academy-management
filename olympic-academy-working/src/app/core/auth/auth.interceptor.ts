// auth.interceptor.ts - Updated with backend error messages

import { HttpInterceptorFn, HttpErrorResponse, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { NotificationService } from '../services/notification.service';
import { catchError, throwError } from 'rxjs';

// Public endpoints that don't require authentication
const publicEndpoints = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/resend-activation',
  '/auth/activate',
  '/auth/activate/verify',
  '/auth/reset-verify',
  '/lookups/roles',
];

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const injector = inject(Injector);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  let authService: AuthService | null = null;

  // Check if endpoint is public
  const isPublic = publicEndpoints.some(endpoint => req.url.includes(endpoint));

  console.log(`🔍 Interceptor: ${req.url} - Public: ${isPublic}`);

  // Only try to get AuthService for non-public endpoints
  if (!isPublic) {
    try {
      authService = injector.get(AuthService);
    } catch (error) {
      console.warn('AuthService not available yet:', error);
    }
  }

  // Handle public endpoints - just pass through
  if (isPublic) {
    return next(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // Get error message from backend or use default
        const errorMessage = error.error?.messageEn || error.error?.message || 'حدث خطأ في الخادم، يرجى المحاولة مرة أخرى';
        notificationService.showError(errorMessage);
        return throwError(() => error.error || error);
      })
    );
  }

  // Handle protected endpoints
  const token = authService?.getToken();

  let authReq = req;
  if (token && authService) {
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

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Get error data from backend
      const errorData = error.error;
      const errorMessage = errorData?.messageEn || errorData?.message || error.message;

      if (error.status === 401) {
        authService?.clearSessionOnExpiration();
        notificationService.showError(errorMessage || 'انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى');

        const currentUrl = router.url;
        const isPublicPage = publicEndpoints.some(endpoint => currentUrl.includes(endpoint));

        if (!isPublicPage) {
          router.navigate(['/login'], { replaceUrl: true });
        }
      }

      if (error.status === 403) {
        notificationService.showError(errorMessage || 'غير مصرح لك بالوصول إلى هذه الصفحة');
      }

      if (error.status === 500) {
        notificationService.showError(errorMessage || 'حدث خطأ في الخادم، يرجى المحاولة مرة أخرى');
      }

      // Return the backend error object so components can use it
      return throwError(() => errorData || error);
    })
  );
};
