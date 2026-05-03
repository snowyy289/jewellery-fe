import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 300000, // 5 phút (300 giây) cho upload file
});

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

      // Token hết hạn hoặc không hợp lệ
      if (status === 401) {
        console.warn("Unauthorized - Token hết hạn hoặc sai");

        localStorage.removeItem("token");

        // redirect về login
        window.location.href = "/login";
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