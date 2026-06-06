export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: number;
  fullName: string;
  email: string;
  roles: string[];
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterResponse {
  id: number;
  fullName: string;
  email: string;
  message: string;
}

export interface ActivationResponse {
  success: boolean;
  message: string;
  redirectUrl?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserDetails {
  id: number;
  fullName: string;
  email: string;
  isActive: boolean;
  roles: string[];
  createdOn: string;
}