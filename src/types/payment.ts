/* eslint-disable @typescript-eslint/no-explicit-any */
import { GenericResponse } from "./auth";

export type PaymentMethod = 'cod' | 'vnpay' | 'momo' | 'zalopay';
export type PaymentStatus = 'pending' | 'processing' | 'success' | 'failed' | 'refunded' | 'cancelled';

export interface Payment {
  _id: string;
  order_id: string;
  order_code: string;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  amount: number;
  currency: string;
  transaction_id?: string;
  gateway_transaction_id?: string;
  gateway_response?: any;
  payment_url?: string;
  return_url?: string;
  cancel_url?: string;
  signature?: string;
  signature_verified: boolean;
  refund_amount?: number;
  refund_reason?: string;
  refunded_at?: string;
  refund_transaction_id?: string;
  paid_at?: string;
  expired_at?: string;
  metadata?: any;
  error_message?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentRequest {
  order_id: string;
  payment_method: PaymentMethod;
}

export interface CreatePaymentResponse extends GenericResponse {
  data: {
    payment: Payment;
    paymentUrl?: string;
    deeplink?: string;
    qrCodeUrl?: string;
    message?: string;
  };
}

export interface PaymentResponse extends GenericResponse {
  data: Payment;
}

export interface PaymentStatusResponse extends GenericResponse {
  data: {
    transaction_id: string;
    payment_status: PaymentStatus;
    amount: number;
    paid_at?: string;
    error_message?: string;
  };
}
