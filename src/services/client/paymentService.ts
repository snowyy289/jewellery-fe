import axiosInstance from "../axiosInstance";
import { 
  CreatePaymentRequest,
  CreatePaymentResponse,
  PaymentResponse,
  PaymentStatusResponse
} from "@/types/payment";

export const paymentService = {
  // Create payment for order
  createPayment: async (data: CreatePaymentRequest): Promise<CreatePaymentResponse> => {
    const response = await axiosInstance.post("/client/payment/create", data);
    return response.data;
  },

  // Get payment by order code
  getPaymentByOrderCode: async (orderCode: string): Promise<PaymentResponse> => {
    const response = await axiosInstance.get(`/client/payment/${orderCode}`);
    return response.data;
  },

  // Get payment status by transaction ID
  getPaymentStatus: async (transactionId: string): Promise<PaymentStatusResponse> => {
    const response = await axiosInstance.get(`/client/payment/status/${transactionId}`);
    return response.data;
  }
};
