import axiosInstance from "../axiosInstance";

export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  link: string;
  isRead: boolean;
  createdAt: string;
}

export const notificationService = {
  getNotifications: async (params?: { page?: number; limit?: number; isRead?: boolean }) => {
    try {
      const response = await axiosInstance.get('/admin/notifications', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  markAsRead: async (id: string) => {
    try {
      const response = await axiosInstance.patch(`/admin/notifications/${id}/read`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  markAllAsRead: async () => {
    try {
      const response = await axiosInstance.patch('/admin/notifications/read-all');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
