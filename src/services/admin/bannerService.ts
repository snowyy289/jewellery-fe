/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "../axiosInstance";
import { Banner } from "@/types/banner";
import { Pagination } from "@/types/pagination";

interface BannerResponse {
  code: string | number;
  message?: string;
  banners?: Banner[];
  data?: Banner[];
  pagination?: Pagination;
  filterStatus?: any;
}

interface SingleBannerResponse {
  code: string | number;
  message?: string;
  banner?: Banner;
  data?: Banner;
}

interface GenericResponse {
  code: string | number;
  message?: string;
}

export const bannerService = {
  getBanners: async (params?: Record<string, string | number | boolean>) => {
    const response = await axiosInstance.get<BannerResponse>("/admin/banners", { params });
    return response.data;
  },

  getBannerDetail: async (id: string) => {
    const response = await axiosInstance.get<SingleBannerResponse>(`/admin/banners/detail/${id}`);
    return response.data;
  },

  createBanner: async (data: FormData) => {
    const response = await axiosInstance.post<GenericResponse>("/admin/banners/create", data);
    return response.data;
  },

  updateBanner: async (id: string, data: FormData) => {
    const response = await axiosInstance.patch<GenericResponse>(`/admin/banners/edit/${id}`, data);
    return response.data;
  },

  changeStatus: async (id: string, status: string) => {
    const response = await axiosInstance.patch<GenericResponse>(`/admin/banners/change-status/${id}`, { status });
    return response.data;
  },

  deleteBanner: async (id: string) => {
    const response = await axiosInstance.delete<GenericResponse>(`/admin/banners/delete/${id}`);
    return response.data;
  }
};
