export interface User {
  id: string;
  fullName: string;
  email: string;
  role: "admin" | "user"; 
  avatar?: string;
  phone?: string;
}

export interface AuthResponse {
  token: string;
  user?: User;
  code: string;
  message: string;
}

export interface LoginRequest {
  email: string;
  password?: string;
  rememberPassword?: boolean;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface OtpPasswordRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordRequest {
  password?: string;
  confirmPassword?: string;
}

export interface GenericResponse {
    code: string | number; // Backend trả về number (200, 201) nhưng một số chỗ dùng string
    message: string;
}