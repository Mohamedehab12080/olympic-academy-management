// register.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  FormsModule, 
  ReactiveFormsModule, 
  FormBuilder, 
  FormGroup, 
  Validators, 
  AbstractControl, 
  ValidationErrors 
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { AuthService } from '../../auth.service';
import { NotificationService } from '../../../services/notification.service';
import { RoleLookup } from '../../models/auth.model';

@Component({
  selector: 'app-register',
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
    MatTooltipModule,
    MatSelectModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  isLoading = false;
  hidePassword = true;
  hideConfirmPassword = true;
  showPasswordStrength = false;
  passwordStrength = 0;
  passwordStrengthText = '';
  currentYear = new Date().getFullYear();
  logoPath = 'assets/images/simpleLogo.jpeg';
  roles: RoleLookup[] = [];
  
  private destroy$ = new Subject<void>();

  private readonly strengthColors = {
    weak: '#ef4444',
    medium: '#f59e0b',
    strong: '#10b981',
    veryStrong: '#8b5cf6'
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notification: NotificationService
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      role: ['', [Validators.required]] // No default value - will be set from backend
    }, { validators: this.passwordMatchValidator });

    // Redirect if already logged in
    if (this.authService.isAuthenticated && !this.authService.isTokenExpired()) {
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnInit(): void {
    // Load roles from service
    this.authService.roles$
      .pipe(takeUntil(this.destroy$))
      .subscribe(roles => {
        this.roles = roles;
        // Set default role to the first role from backend
        if (this.roles.length > 0 && !this.registerForm.get('role')?.value) {
          this.registerForm.patchValue({ role: this.roles[0].title });
        }
      });

    // Password strength listener
    this.registerForm.get('password')?.valueChanges
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
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
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
    if (this.passwordStrength < 25) return this.strengthColors.weak;
    if (this.passwordStrength < 50) return this.strengthColors.medium;
    if (this.passwordStrength < 75) return this.strengthColors.strong;
    return this.strengthColors.veryStrong;
  }

  getPasswordStrengthWidth(): number {
    return this.passwordStrength;
  }

  // Form getters
  get fullName() { return this.registerForm.get('fullName'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
  get role() { return this.registerForm.get('role'); }

  // Simply return the role title as is from backend
  getRoleDisplayName(role: RoleLookup): string {
    return role.title; // Use exactly what the backend returns
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      
      if (this.registerForm.hasError('passwordMismatch')) {
        this.notification.showWarning('كلمة المرور وتأكيد كلمة المرور غير متطابقين');
        return;
      }
      
      this.notification.showWarning('يرجى تعبئة جميع الحقول بشكل صحيح');
      return;
    }

    this.isLoading = true;
    const { fullName, email, password, confirmPassword, role } = this.registerForm.value;

    // Optional: You can add validation here to restrict certain roles
    // For example, prevent users from selecting ADMIN roles during public registration
    // This check can be removed or modified based on your business rules
    const adminRoles = this.roles
      .filter(r => r.title.includes('ADMIN'))
      .map(r => r.title);
    
    if (adminRoles.includes(role)) {
      this.notification.showWarning('لا يمكن التسجيل بدور إداري من خلال هذا النموذج');
      this.isLoading = false;
      return;
    }

    this.authService.register({ fullName, email, password, confirmPassword, role }).subscribe({
      next: (response) => {
        this.notification.showSuccess(
          response.message || 'تم إنشاء الحساب بنجاح! يرجى تفعيل حسابك عبر البريد الإلكتروني'
        );
        this.isLoading = false;
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Register error:', error);
        this.notification.showError(error.error?.messageEn || 'فشل إنشاء الحساب');
        this.isLoading = false;
      }
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }
}