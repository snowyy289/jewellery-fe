import axiosInstance from "../axiosInstance";
import { GenericResponse } from "@/types/auth";

export interface Voucher {
  _id: string;
  code: string;
  discount_type: 'percent' | 'fixed';
  discount_value: number;
  min_order_value: number;
  max_discount: number | null;
  start_date: string;
  end_date: string;
  description: string;
  usage_limit: number;
  used_count: number;
}

export interface VoucherListResponse extends GenericResponse {
  data: Voucher[];
}

export const voucherService = {
  // Get available public vouchers
  getAvailableVouchers: async (): Promise<VoucherListResponse> => {
    const response = await axiosInstance.get("/client/vouchers");
    return response.data;
  }
};
