import axiosInstance from "../axiosInstance";

export interface PaymentFilters {
  page?: number;
  limit?: number;
  payment_method?: string;
  payment_status?: string;
  search?: string;
  from_date?: string;
  to_date?: string;
}

export const paymentService = {
  // Get all payments
  getAllPayments: async (filters: PaymentFilters = {}) => {
    const response = await axiosInstance.get("/admin/payments", { params: filters });
    return response.data;
  },

  // Get payment by ID
  getPaymentById: async (id: string) => {
    const response = await axiosInstance.get(`/admin/payments/${id}`);
    return response.data;
  },

  // Confirm COD payment
  confirmCODPayment: async (id: string) => {
    const response = await axiosInstance.post(`/admin/payments/${id}/confirm-cod`);
    return response.data;
  },

  // Get payment statistics
  getPaymentStatistics: async (from_date?: string, to_date?: string) => {
    const response = await axiosInstance.get("/admin/payments/statistics", {
      params: { from_date, to_date }
    });
    return response.data;
  },

  // Export payments
  exportPayments: async (filters: PaymentFilters = {}) => {
    const response = await axiosInstance.get("/admin/payments/export", {
      params: filters,
      responseType: 'blob'
    });
    return response.data;
  }
};
