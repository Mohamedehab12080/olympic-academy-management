import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../auth.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-reset-password',
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
    MatProgressSpinnerModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  isLoading = false;
  isSuccess = false;
  hidePassword = true;
  hideConfirmPassword = true;
  token: string = '';
  isValidToken = false;
  isVerifying = true;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private notification: NotificationService
  ) {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('newPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams['token'];
    if (!this.token) {
      this.notification.showError('رابط إعادة التعيين غير صالح');
      this.router.navigate(['/forgot-password']);
      return;
    }
    this.verifyToken();
  }

  verifyToken(): void {
    this.authService.verifyResetToken(this.token).subscribe({
      next: (response) => {
        this.isValidToken = true;
        this.isVerifying = false;
        this.notification.showSuccess(response.message || 'الرابط صالح');
      },
      error: (error) => {
        this.isValidToken = false;
        this.isVerifying = false;
        this.notification.showError(error.error?.messageEn || 'رابط إعادة التعيين غير صالح أو منتهي الصلاحية');
      }
    });
  }

  onSubmit(): void {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      if (this.resetForm.hasError('passwordMismatch')) {
        this.notification.showWarning('كلمة المرور غير متطابقة');
      } else {
        this.notification.showWarning('يرجى إدخال كلمة مرور صحيحة');
      }
      return;
    }

    this.isLoading = true;
    const newPassword = this.resetForm.get('newPassword')?.value;
    const confirmPassword = this.resetForm.get('confirmPassword')?.value;

    this.authService.resetPassword(this.token, newPassword, confirmPassword).subscribe({
      next: (response) => {
        this.isSuccess = true;
        this.notification.showSuccess(response.message || 'تم إعادة تعيين كلمة المرور بنجاح');
        this.isLoading = false;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (error) => {
        this.notification.showError(error.error?.messageEn || 'فشل إعادة تعيين كلمة المرور');
        this.isLoading = false;
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}