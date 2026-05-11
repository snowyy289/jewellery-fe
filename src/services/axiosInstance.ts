import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 300000, // 5 phút (300 giây) cho upload file
});

console.log("API Base URL:", process.env.NEXT_PUBLIC_API_URL);

// ======================
// REQUEST INTERCEPTOR
// ======================
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Chỉ chạy ở client
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (token) {
        // đảm bảo headers tồn tại
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// ======================
// RESPONSE INTERCEPTOR
// ======================
axiosInstance.interceptors.response.use(
  (response) => {
    // Có thể xử lý chung data ở đây nếu muốn
    return response;
  },
  (error: AxiosError) => {
    // Xử lý lỗi global
    if (typeof window !== "undefined") {
      const status = error.response?.status;
      const requestUrl = error.config?.url || "";

      // Token hết hạn hoặc không hợp lệ
      if (status === 401) {
        console.warn("Unauthorized - Token hết hạn hoặc sai");

        // KHÔNG redirect nếu đang ở trang login hoặc auth endpoints
        const isAuthEndpoint = requestUrl.includes("/auth/login") || 
                               requestUrl.includes("/auth/forgot-password") ||
                               requestUrl.includes("/auth/otp-password") ||
                               requestUrl.includes("/auth/reset-password");
        
        if (!isAuthEndpoint) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          document.cookie = "token=; path=/; max-age=0";

          // Redirect về admin login nếu đang ở admin area
          if (window.location.pathname.startsWith("/admin")) {
            window.location.href = "/admin/login";
          } else {
            window.location.href = "/login";
          }
        }
      }

      // Server error
      if (status === 500) {
        console.error("Server error");
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;