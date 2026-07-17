// auth.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, BehaviorSubject, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ActivationResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  UserDetails,
  RoleLookup
} from './models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = environment.apiUrl;

  // Use BehaviorSubject for reactive state
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private currentUserSubject = new BehaviorSubject<LoginResponse | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private rolesSubject = new BehaviorSubject<RoleLookup[]>([]);
  public roles$ = this.rolesSubject.asObservable();

  // Public getters for synchronous access
  get isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  get currentUser(): LoginResponse | null {
    return this.currentUserSubject.value;
  }

  get availableRoles(): RoleLookup[] {
    return this.rolesSubject.value;
  }

  constructor() {
    this.checkAuthStatus();
    this.loadRoles();
  }

  // ==================== Load Roles ====================
  
  loadRoles(): void {
    this.http.get<{ total: number; list: RoleLookup[] }>(`${this.apiUrl}/auth/lookups/roles`)
      .pipe(
        map(response => response.list || [])
      )
      .subscribe({
        next: (roles) => {
          this.rolesSubject.next(roles);
          console.log('✅ Roles loaded:', roles);
        },
        error: (error) => {
          console.error('❌ Failed to load roles:', error);
          this.rolesSubject.next([]);
        }
      });
  }

  getRoles(): Observable<RoleLookup[]> {
    return this.roles$;
  }

  // ==================== Authentication Methods ====================

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          console.log('🔐 Login successful, setting session...');
          this.setSession(response);
          this.isAuthenticatedSubject.next(true);
          this.currentUserSubject.next(response);
          console.log('✅ Session set, isAuthenticated:', this.isAuthenticated);
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
        this.router.navigate(['/login']);
      },
      error: () => {
        this.clearSession();
        this.router.navigate(['/login']);
      }
    });
  }

  clearSessionAndNavigate(): void {
    this.clearSession();
    console.log('🔀 Navigating to login page...');
    this.router.navigate(['/login']).then((success) => {
      if (success) {
        console.log('✅ Navigation to login successful');
      } else {
        console.log('❌ Navigation to login failed, using fallback');
        window.location.href = '/login';
      }
    });
  }

  clearSession(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
    console.log('🧹 Session cleared');
  }

  clearSessionAndRedirect(): void {
    this.clearSession();
    this.router.navigate(['/login']);
  }

  clearSessionOnExpiration(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
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
    
    console.log('🔍 Checking auth status...');
    
    if (token && user) {
      if (this.isTokenExpired(token)) {
        console.log('⏰ Token expired, clearing session');
        this.clearSession();
      } else {
        console.log('✅ User is authenticated');
        this.isAuthenticatedSubject.next(true);
        this.currentUserSubject.next(JSON.parse(user));
      }
    } else {
      console.log('ℹ️ No token found, not authenticated');
      this.isAuthenticatedSubject.next(false);
      this.currentUserSubject.next(null);
    }
  }

  isTokenExpired(token?: string): boolean {
    const checkToken = token || this.getToken();
    if (!checkToken) return true;
    
    try {
      const parts = checkToken.split('.');
      if (parts.length !== 3) return true;
      
      const payload = JSON.parse(atob(parts[1]));
      
      if (!payload.exp) return true;
      
      const expirationDate = new Date(payload.exp * 1000);
      const now = new Date();
      
      return expirationDate.getTime() < now.getTime() - 5000;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }

  getTokenExpirationTime(): Date | null {
    const token = this.getToken();
    if (!token) return null;
    
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      
      const payload = JSON.parse(atob(parts[1]));
      
      if (!payload.exp) return null;
      
      return new Date(payload.exp * 1000);
    } catch (error) {
      console.error('Error getting token expiration time:', error);
      return null;
    }
  }

  // ==================== Account Activation ====================

  verifyActivationToken(token: string): Observable<ActivationResponse> {
    return this.http.get<ActivationResponse>(`${this.apiUrl}/auth/activate/verify?token=${token}`);
  }

  activateAccount(token: string): Observable<ActivationResponse> {
    return this.http.get<ActivationResponse>(`${this.apiUrl}/auth/activate?token=${token}`);
  }

  resendActivationEmail(email: string): Observable<ActivationResponse> {
    return this.http.post<ActivationResponse>(`${this.apiUrl}/auth/resend-activation?email=${email}`, {});
  }

  // ==================== Password Reset ====================

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

  // ==================== User Management (Super Admin) ====================

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

  // ==================== Helper Functions ====================

  hasRole(role: string): boolean {
    const user = this.currentUser;
    return user?.roles?.includes(role) || false;
  }

  getUserRole(): string | null {
    const user = this.currentUser;
    return user?.roles?.[0] || null;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated && !this.isTokenExpired();
  }
}