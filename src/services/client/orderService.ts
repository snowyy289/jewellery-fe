import axiosInstance from "../axiosInstance";
import { 
  OrderResponse, 
  OrderListResponse, 
  CreateOrderRequest,
  CancelOrderRequest,
  TrackingResponse
} from "@/types/order";

export const orderService = {
  // Create order from cart (checkout)
  createOrder: async (data: CreateOrderRequest): Promise<OrderResponse> => {
    const response = await axiosInstance.post("/client/orders/checkout", data);
    return response.data;
  },

  // Get user's orders with pagination
  getUserOrders: async (page: number = 1, limit: number = 10): Promise<OrderListResponse> => {
    const response = await axiosInstance.get("/client/orders", {
      params: { page, limit }
    });
    return response.data;
  },

  // Get order details by order code
  getOrderByCode: async (orderCode: string): Promise<OrderResponse> => {
    const response = await axiosInstance.get(`/client/orders/${orderCode}`);
    return response.data;
  },

  // Cancel order
  cancelOrder: async (orderCode: string, data: CancelOrderRequest): Promise<OrderResponse> => {
    const response = await axiosInstance.post(`/client/orders/${orderCode}/cancel`, data);
    return response.data;
  },

  // Track order (public endpoint - no auth required)
  trackOrder: async (orderCode: string): Promise<TrackingResponse> => {
    const response = await axiosInstance.get(`/client/orders/${orderCode}/track`);
    return response.data;
  }
};
