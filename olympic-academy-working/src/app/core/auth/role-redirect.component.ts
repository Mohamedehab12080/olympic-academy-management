// core/auth/components/role-redirect/role-redirect.component.ts

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-role-redirect',
  template: `<div class="loading-spinner">Redirecting...</div>`,
  styles: [`
    .loading-spinner {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      font-size: 18px;
      color: #666;
    }
  `]
})
export class RoleRedirectComponent implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const user = this.authService.currentUser;
    
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    // Redirect based on role - Check all roles in the array
    const roles = user.roles || [];
    let redirectUrl = '/dashboard'; // Default for admin/super_admin

    // Check if user has TRAINEE role
    const isTrainee = roles.some(role => role === 'ROLE_TRAINEE' || role === 'TRAINEE');
    
    // Check if user has ADMIN or SUPER_ADMIN role
    const isAdmin = roles.some(role => 
      role === 'ROLE_ADMIN' || role === 'ADMIN' || 
      role === 'ROLE_SUPER_ADMIN' || role === 'SUPER_ADMIN'
    );

    if (isTrainee && !isAdmin) {
      // If only trainee, go to trainee attendance
      redirectUrl = '/trainee/attendance';
    } else if (isAdmin) {
      // If admin or super_admin, go to dashboard
      redirectUrl = '/dashboard';
    } else {
      // Fallback for unknown roles
      redirectUrl = '/dashboard';
    }

    this.router.navigate([redirectUrl]);
  }
}