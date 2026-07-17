// activate-account.component.ts - COMPLETE

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../auth.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-activate-account',
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
    MatDividerModule
  ],
  templateUrl: './activate-account.component.html',
  styleUrls: ['./activate-account.component.css']
})
export class ActivateAccountComponent implements OnInit {
  isLoading = true;
  isSuccess = false;
  isError = false;
  isExpired = false;
  message = '';
  countdown = 3;
  showResendForm = false;
  resendForm: FormGroup;
  isResending = false;
  tokenEmail: string = '';
  token: string = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private notification: NotificationService,
    private fb: FormBuilder
  ) {
    console.log('🚀 ActivateAccountComponent CONSTRUCTOR called!');
    this.resendForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    console.log('🚀 ActivateAccountComponent ngOnInit STARTED!');
    
    this.token = this.route.snapshot.queryParams['token'];
    this.tokenEmail = this.route.snapshot.queryParams['email'] || '';
    
    console.log('📝 Token:', this.token);
    console.log('📝 Email:', this.tokenEmail);
    console.log('📝 Full URL:', window.location.href);

    if (!this.token) {
      console.log('❌ No token found!');
      this.isLoading = false;
      this.isError = true;
      this.isExpired = true;
      this.message = 'رابط التفعيل غير صالح';
      this.notification.showError('رابط التفعيل غير صالح');
      return;
    }

    console.log('✅ Token found, calling activateAccount...');
    this.activateAccount(this.token);
  }

  // ============================================
  // ACTIVATE ACCOUNT
  // ============================================
  
  activateAccount(token: string): void {
    console.log('📡 Calling activateAccount with:', token);
    
    this.authService.activateAccount(token).subscribe({
      next: (response) => {
        console.log('✅ activateAccount response:', response);
        this.isLoading = false;
        if (response.success) {
          this.isSuccess = true;
          this.message = response.message || 'تم تفعيل حسابك بنجاح!';
          this.notification.showSuccess(this.message);
          this.startCountdownAndRedirect();
        } else {
          this.isError = true;
          this.message = response.message || 'فشل تفعيل الحساب';
          this.notification.showError(this.message);
        }
      },
      error: (error) => {
        console.error('❌ activateAccount error:', error);
        this.isLoading = false;
        this.isError = true;
        this.message = error.error?.messageEn || 'فشل تفعيل الحساب. الرابط قد يكون منتهي الصلاحية';
        this.notification.showError(this.message);
        if (this.message.toLowerCase().includes('expired')) {
          this.isExpired = true;
        }
      }
    });
  }

  // ============================================
  // RESEND ACTIVATION EMAIL
  // ============================================
  
  toggleResendForm(): void {
    this.showResendForm = !this.showResendForm;
    if (this.tokenEmail) {
      this.resendForm.patchValue({ email: this.tokenEmail });
    }
  }

  resendActivationEmail(): void {
    if (this.resendForm.invalid) {
      this.resendForm.markAllAsTouched();
      this.notification.showWarning('يرجى إدخال بريد إلكتروني صحيح');
      return;
    }

    const email = this.resendForm.get('email')?.value;
    this.isResending = true;

    this.authService.resendActivationEmail(email).subscribe({
      next: (response) => {
        this.isResending = false;
        this.showResendForm = false;
        this.notification.showSuccess(response.message || 'تم إرسال بريد التفعيل بنجاح');
        this.resendForm.reset();
        // Optionally close the form after success
        this.showResendForm = false;
      },
      error: (error) => {
        this.isResending = false;
        this.notification.showError(error.error?.messageEn || 'فشل إرسال بريد التفعيل');
      }
    });
  }

  // ============================================
  // HELPERS
  // ============================================
  
  startCountdownAndRedirect(): void {
    const interval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(interval);
        this.router.navigate(['/login']);
      }
    }, 1000);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}