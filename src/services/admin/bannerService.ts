import axiosInstance from "../axiosInstance";
import { Banner } from "@/types/banner";
import { Pagination } from "@/types/pagination";

interface BannerResponse {
  code: string;
  message?: string;
  banners: Banner[];
  pagination?: Pagination;
  filterStatus?: any;
}

interface SingleBannerResponse {
  code: string;
  message?: string;
  banner?: Banner;
}

interface GenericResponse {
  code: string;
  message?: string;
}

export const bannerService = {
  getBanners: async (params?: Record<string, string | number | boolean>) => {
    const response = await axiosInstance.get<BannerResponse>("/api/admin/banners", { params });
    return response.data;
  },

  getBannerDetail: async (id: string) => {
    const response = await axiosInstance.get<SingleBannerResponse>(`/api/admin/banners/detail/${id}`);
    return response.data;
  },

  createBanner: async (data: FormData) => {
    const response = await axiosInstance.post<GenericResponse>("/api/admin/banners/create", data);
    return response.data;
  },

  updateBanner: async (id: string, data: FormData) => {
    const response = await axiosInstance.patch<GenericResponse>(`/api/admin/banners/edit/${id}`, data);
    return response.data;
  },

  changeStatus: async (id: string, status: string) => {
    const response = await axiosInstance.patch<GenericResponse>(`/api/admin/banners/change-status/${id}`, { status });
    return response.data;
  },

  deleteBanner: async (id: string) => {
    const response = await axiosInstance.delete<GenericResponse>(`/api/admin/banners/delete/${id}`);
    return response.data;
  }
};
