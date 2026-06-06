import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

export const RoleGuard = (allowedRoles: string[]) => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const hasRole = allowedRoles.some(role => authService.hasRole(role));
    
    if (hasRole) {
      return true;
    }

    return router.parseUrl('/dashboard');
  };
};