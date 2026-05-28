import axiosInstance from "../axiosInstance";

export const clientAuthService = {
  login: async (data: any) => {
    const response = await axiosInstance.post(`/client/auth/login`, data);
    return response.data;
  },

  register: async (data: any) => {
    const response = await axiosInstance.post(`/client/auth/register`, data);
    return response.data;
  },

  getMe: async () => {
    const response = await axiosInstance.get(`/client/auth/me`);
    return response.data;
  },

  updateProfile: async (data: FormData) => {
    const response = await axiosInstance.patch(`/client/auth/profile`, data, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return response.data;
  }
};
