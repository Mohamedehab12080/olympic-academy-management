import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ActivationResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  UserDetails
} from './models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = environment.apiUrl;

  private currentUserValue: LoginResponse | null = null;
  private isAuthenticatedValue: boolean = false;

  get currentUser(): LoginResponse | null {
    return this.currentUserValue;
  }

  get isAuthenticated(): boolean {
    return this.isAuthenticatedValue;
  }

  constructor() {
    this.checkAuthStatus();
  }

  // ==================== مصادقة المستخدم ====================

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          this.setSession(response);
          this.isAuthenticatedValue = true;
          this.currentUserValue = response;
        })
      );
  }

  register(userData: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/auth/register`, userData);
  }

  logout(): void {
    this.http.post(`${this.apiUrl}/auth/logout`, {}).subscribe({
      next: () => {
        this.clearSession();
      },
      error: () => {
        this.clearSession();
      }
    });
  }

  private clearSession(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.isAuthenticatedValue = false;
    this.currentUserValue = null;
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private setSession(authResult: LoginResponse): void {
    localStorage.setItem('token', authResult.token);
    localStorage.setItem('user', JSON.stringify(authResult));
  }

  private checkAuthStatus(): void {
    const token = this.getToken();
    const user = localStorage.getItem('user');
    
    if (token && user) {
      this.isAuthenticatedValue = true;
      this.currentUserValue = JSON.parse(user);
    }
  }

  // ==================== تفعيل الحساب ====================

  verifyActivationToken(token: string): Observable<ActivationResponse> {
    return this.http.get<ActivationResponse>(`${this.apiUrl}/auth/activate/verify?token=${token}`);
  }

  activateAccount(token: string): Observable<ActivationResponse> {
    return this.http.get<ActivationResponse>(`${this.apiUrl}/auth/activate?token=${token}`);
  }

  resendActivationEmail(email: string): Observable<ActivationResponse> {
    return this.http.post<ActivationResponse>(`${this.apiUrl}/auth/resend-activation?email=${email}`, {});
  }

  // ==================== إعادة تعيين كلمة المرور ====================

  forgotPassword(email: string): Observable<ActivationResponse> {
    const request: ForgotPasswordRequest = { email };
    return this.http.post<ActivationResponse>(`${this.apiUrl}/auth/forgot-password`, request);
  }

  verifyResetToken(token: string): Observable<ActivationResponse> {
    return this.http.get<ActivationResponse>(`${this.apiUrl}/auth/reset-verify?token=${token}`);
  }

  resetPassword(token: string, newPassword: string, confirmPassword: string): Observable<ActivationResponse> {
    const request: ResetPasswordRequest = { token, newPassword, confirmPassword };
    return this.http.post<ActivationResponse>(`${this.apiUrl}/auth/reset-password`, request);
  }

  // ==================== إدارة المستخدمين (Super Admin) ====================

  getAllAdmins(): Observable<UserDetails[]> {
    return this.http.get<UserDetails[]>(`${this.apiUrl}/super-admin/admins`);
  }

  getAdminById(id: number): Observable<UserDetails> {
    return this.http.get<UserDetails>(`${this.apiUrl}/super-admin/admins/${id}`);
  }

  createAdmin(userData: RegisterRequest): Observable<UserDetails> {
    return this.http.post<UserDetails>(`${this.apiUrl}/super-admin/admins`, userData);
  }

  updateAdmin(adminId: number, userData: Partial<UserDetails>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/super-admin/admins/${adminId}`, userData);
  }

  activateAdmin(adminId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/super-admin/admins/${adminId}/activate`, {});
  }

  deactivateAdmin(adminId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/super-admin/admins/${adminId}/deactivate`, {});
  }

  // ==================== دوال مساعدة ====================

  hasRole(role: string): boolean {
    const user = this.currentUserValue;
    return user?.roles?.includes(role) || false;
  }

  getUserRole(): string | null {
    const user = this.currentUserValue;
    return user?.roles?.[0] || null;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticatedValue;
  }
}