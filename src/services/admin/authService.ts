import { AuthResponse, LoginRequest, ForgotPasswordRequest, OtpPasswordRequest, ResetPasswordRequest, GenericResponse } from "@/types/auth";
import axiosInstance from "../axiosInstance";

export const authService = {
  login: async (data: LoginRequest) => {
    const response = await axiosInstance.post<AuthResponse>("/admin/auth/login", data);
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordRequest) => {
    const response = await axiosInstance.post<GenericResponse>("/admin/auth/forgot-password", data);
    return response.data;
  },

  otpPassword: async (data: OtpPasswordRequest) => {
    const response = await axiosInstance.post<AuthResponse>("/admin/auth/otp-password", data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordRequest) => {
    const response = await axiosInstance.post<GenericResponse>("/admin/auth/reset-password", data);
    return response.data;
  },

  logout: async () => {
    const response = await axiosInstance.post<GenericResponse>("/admin/auth/logout");
    return response.data;
  }
};