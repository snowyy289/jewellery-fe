import { GenericResponse } from "./auth";
import { Product } from "./product";

export interface CartItem {
  product_id: Product | string;
  quantity: number;
  price: number;
  discount_percentage: number;
  selected: boolean;
}

export interface Cart {
  _id: string;
  user_id?: string;
  session_id: string;
  items: CartItem[];
  subtotal: number;
  discount_amount: number;
  voucher_code?: string;
  total: number;
  expires_at: string;
  merged: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartResponse extends GenericResponse {
  data: Cart;
  session_id?: string;
}

export interface AddToCartRequest {
  product_id: string;
  quantity: number;
}

export interface UpdateCartRequest {
  quantity: number;
}

export interface MergeCartRequest {
  guest_session_id: string;
}

export interface StockValidationResult {
  valid: boolean;
  unavailable_items: {
    product_id: string;
    product_title: string;
    reason: string;
    available_stock?: number;
    requested_quantity?: number;
  }[];
}

export interface StockValidationResponse extends GenericResponse {
  data: StockValidationResult;
}
