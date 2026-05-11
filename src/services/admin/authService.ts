/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthResponse, LoginRequest, ForgotPasswordRequest, OtpPasswordRequest, ResetPasswordRequest, GenericResponse } from "@/types/auth";
import axiosInstance from "../axiosInstance";

export const authService = {
  login: async (data: LoginRequest) => {
    console.log("🌐 [API] Calling login API:", { email: data.email });
    try {
      const response = await axiosInstance.post<AuthResponse>("/admin/auth/login", data);
      console.log("🌐 [API] Login API response:", response.data);
      console.log("🌐 [API] Response code:", response.data.code, "Type:", typeof response.data.code);
      return response.data;
    } catch (error: any) {
      console.error("🌐 [API] Login API error:", error);
      console.error("🌐 [API] Error response:", error.response?.data);
      console.error("🌐 [API] Error status:", error.response?.status);
      throw error;
    }
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