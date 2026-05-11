import { GenericResponse } from "./auth";
import { Product } from "./product";
import { Pagination } from "./pagination";

export interface OrderItem {
  product_id: Product | string;
  product_title: string;
  product_sku: string;
  product_thumbnail?: string;
  quantity: number;
  price: number;
  discount_percentage: number;
  subtotal: number;
}

export interface ShippingAddress {
  full_name: string;
  phone: string;
  email?: string;
  address_line: string;
  ward?: string;
  district?: string;
  province: string;
  postal_code?: string;
}

export interface StatusHistory {
  status: OrderStatus;
  note?: string;
  changed_by?: string;
  changed_at: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipping' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'cod' | 'vnpay' | 'momo' | 'zalopay';

export interface Order {
  _id: string;
  order_code: string;
  user_id: string;
  items: OrderItem[];
  subtotal: number;
  discount_amount: number;
  shipping_fee: number;
  total: number;
  shipping_address: ShippingAddress;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  payment_id?: string;
  status: OrderStatus;
  status_history: StatusHistory[];
  tracking_number?: string;
  estimated_delivery?: string;
  delivered_at?: string;
  voucher_code?: string;
  voucher_discount: number;
  customer_note?: string;
  admin_note?: string;
  cancellation_reason?: string;
  stock_reserved: boolean;
  stock_released: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  shipping_address: ShippingAddress;
  payment_method: PaymentMethod;
  customer_note?: string;
}

export interface CancelOrderRequest {
  reason: string;
}

export interface OrderResponse extends GenericResponse {
  data: Order;
}

export interface OrderListResponse extends GenericResponse {
  data: Order[];
  pagination?: Pagination;
}

export interface TrackingInfo {
  order_code: string;
  status: OrderStatus;
  status_history: StatusHistory[];
  tracking_number?: string;
  estimated_delivery?: string;
  delivered_at?: string;
  createdAt: string;
}

export interface TrackingResponse extends GenericResponse {
  data: TrackingInfo;
}
