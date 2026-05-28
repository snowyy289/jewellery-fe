import axiosInstance from "../axiosInstance";
import { VoucherListResponse, VoucherDetailResponse } from "@/types/voucher";

export const voucherService = {
  getVouchers: async (params?: any) => {
    const response = await axiosInstance.get<VoucherListResponse>("/admin/vouchers", { params });
    return response.data;
  },

  getVoucherDetail: async (id: string) => {
    const response = await axiosInstance.get<VoucherDetailResponse>(`/admin/vouchers/detail/${id}`);
    return response.data;
  },

  createVoucher: async (data: any) => {
    const response = await axiosInstance.post("/admin/vouchers/create", data);
    return response.data;
  },

  updateVoucher: async (id: string, data: any) => {
    const response = await axiosInstance.patch(`/admin/vouchers/edit/${id}`, data);
    return response.data;
  },

  deleteVoucher: async (id: string) => {
    const response = await axiosInstance.delete(`/admin/vouchers/delete/${id}`);
    return response.data;
  }
};
