import axiosInstance from "../axiosInstance";

export interface OrderFilters {
  page?: number;
  limit?: number;
  status?: string;
  payment_status?: string;
  payment_method?: string;
  search?: string;
  from_date?: string;
  to_date?: string;
}

export const orderService = {
  // Get all orders
  getAllOrders: async (filters: OrderFilters = {}) => {
    const response = await axiosInstance.get("/admin/orders", { params: filters });
    return response.data;
  },

  // Get order by ID
  getOrderById: async (id: string) => {
    const response = await axiosInstance.get(`/admin/orders/${id}`);
    return response.data;
  },

  // Update order status
  updateOrderStatus: async (id: string, status: string, note: string) => {
    const response = await axiosInstance.put(`/admin/orders/${id}/status`, { status, note });
    return response.data;
  },

  // Update tracking
  updateTracking: async (id: string, tracking_number: string, estimated_delivery?: string) => {
    const response = await axiosInstance.put(`/admin/orders/${id}/tracking`, {
      tracking_number,
      estimated_delivery
    });
    return response.data;
  },

  // Add admin note
  addAdminNote: async (id: string, admin_note: string) => {
    const response = await axiosInstance.put(`/admin/orders/${id}/note`, { admin_note });
    return response.data;
  },

  // Get order statistics
  getOrderStatistics: async (from_date?: string, to_date?: string) => {
    const response = await axiosInstance.get("/admin/orders/statistics", {
      params: { from_date, to_date }
    });
    return response.data;
  },

  // Export orders
  exportOrders: async (filters: OrderFilters = {}) => {
    const response = await axiosInstance.get("/admin/orders/export", {
      params: filters,
      responseType: 'blob'
    });
    return response.data;
  },

  // Get revenue chart data
  getRevenueChartData: async (from_date?: string, to_date?: string, group_by?: 'day' | 'month' | 'year') => {
    const response = await axiosInstance.get("/admin/orders/revenue/chart", {
      params: { from_date, to_date, group_by }
    });
    return response.data;
  }
};
