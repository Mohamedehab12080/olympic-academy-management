// login.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  FormsModule, 
  ReactiveFormsModule, 
  FormBuilder, 
  FormGroup, 
  Validators 
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { AuthService } from '../../auth.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatTooltipModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  isLoading = false;
  hidePassword = true;
  showPasswordStrength = false;
  passwordStrength = 0;
  passwordStrengthText = '';
  currentYear = new Date().getFullYear();
  logoPath = 'assets/images/simpleLogo.jpeg';
  
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notification: NotificationService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });

    // Check if already authenticated
    if (this.authService.isAuthenticated) {
      console.log('🔐 Already authenticated, redirecting to dashboard...');
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnInit(): void {
    // Check for expired token
    if (this.authService.getToken() && this.authService.isTokenExpired()) {
      this.authService.clearSessionOnExpiration();
    }

    // Password strength checker
    this.loginForm.get('password')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((password: string) => {
        if (password && password.length > 0) {
          this.showPasswordStrength = true;
          this.calculatePasswordStrength(password);
        } else {
          this.showPasswordStrength = false;
        }
      });

    // Load saved email
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      this.loginForm.patchValue({ email: savedEmail, rememberMe: true });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private calculatePasswordStrength(password: string): void {
    let strength = 0;
    const checks = {
      length: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    const validChecks = Object.values(checks).filter(Boolean).length;
    strength = (validChecks / 5) * 100;
    this.passwordStrength = Math.min(strength, 100);

    if (this.passwordStrength < 25) {
      this.passwordStrengthText = 'ضعيفة';
    } else if (this.passwordStrength < 50) {
      this.passwordStrengthText = 'متوسطة';
    } else if (this.passwordStrength < 75) {
      this.passwordStrengthText = 'قوية';
    } else {
      this.passwordStrengthText = 'قوية جداً';
    }
  }

  getPasswordStrengthColor(): string {
    if (this.passwordStrength < 25) return '#ef4444';
    if (this.passwordStrength < 50) return '#f59e0b';
    if (this.passwordStrength < 75) return '#10b981';
    return '#8b5cf6';
  }

  getPasswordStrengthWidth(): number {
    return this.passwordStrength;
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.notification.showWarning('يرجى إدخال البريد الإلكتروني وكلمة المرور بشكل صحيح');
      return;
    }

    this.isLoading = true;
    const { email, password, rememberMe } = this.loginForm.value;

    if (rememberMe) {
      localStorage.setItem('rememberedEmail', email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }

    console.log('🔄 Attempting login for:', email);

    this.authService.login({ email, password }).subscribe({
      next: (response) => {
        console.log('✅ Login successful! Response:', response);
        
        // Show success message
        this.notification.showSuccess(`مرحباً ${response.fullName || 'مستخدم'}!`);
        
        // Reset loading state
        this.isLoading = false;
        
        // Navigate to dashboard with a small delay to ensure state is updated
        setTimeout(() => {
          console.log('🔀 Navigating to dashboard...');
          console.log('🔄 Auth state - isAuthenticated:', this.authService.isAuthenticated);
          console.log('🔄 Auth state - currentUser:', this.authService.currentUser);
          
          this.router.navigate(['/dashboard']).then((success) => {
            if (success) {
              console.log('✅ Navigation successful');
            } else {
              console.log('❌ Navigation failed');
              // Fallback: try with skipLocationChange
              this.router.navigate(['/dashboard'], { skipLocationChange: true }).then((s) => {
                if (!s) {
                  // Ultimate fallback
                  window.location.href = '/dashboard';
                }
              });
            }
          }).catch((err) => {
            console.error('❌ Navigation error:', err);
            // Ultimate fallback
            window.location.href = '/dashboard';
          });
        }, 300);
      },
      error: (error) => {
        console.error('❌ Login error:', error);
        this.isLoading = false;
        const errorMessage = error.error?.messageEn || error.error?.message || 'فشل تسجيل الدخول';
        this.notification.showError(errorMessage);
      }
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
}