// auth.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { NotificationService } from '../services/notification.service';
import { catchError, throwError, switchMap, of } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);
  
  // Public endpoints that don't require authentication
  const publicEndpoints = [
    '/auth/login', 
    '/auth/register', 
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/activate',
    '/auth/resend-activation'
  ];
  
  const isPublicEndpoint = publicEndpoints.some(endpoint => req.url.includes(endpoint));
  
  // Get token
  const token = authService.getToken();

  // Clone the request and add the authorization header
  let authReq = req;
  if (token && !isPublicEndpoint) {
    
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
        
        // Redirect to login only if not already on a public page
        const currentUrl = router.url;
        const isPublicPage = publicEndpoints.some(endpoint => currentUrl.includes(endpoint));
        
        if (!isPublicPage) {
          router.navigate(['/login'], { replaceUrl: true });
        }
      }
      
      // Check for 403 Forbidden
      if (error.status === 403) {
        notificationService.showError('غير مصرح لك بالوصول إلى هذه الصفحة');
      }
      
      // Handle 500 Internal Server Error
      if (error.status === 500) {
        notificationService.showError('حدث خطأ في الخادم، يرجى المحاولة مرة أخرى');
      }
      
      return throwError(() => error);
    })
  );
};