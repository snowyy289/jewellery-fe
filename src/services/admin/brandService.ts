import axiosInstance from "../axiosInstance";
import { BrandResponse, SingleBrandResponse } from "@/types/brand";
import { GenericResponse } from "@/types/auth";

export const brandService = {
    getBrands: async (params?: Record<string, string | number | boolean>) => {
        const response = await axiosInstance.get<BrandResponse>("/admin/brands", { params });
        return response.data;
    },

    createBrand: async (data: FormData) => {
        const response = await axiosInstance.post<SingleBrandResponse>("/admin/brands/create", data);
        return response.data;
    },

    updateBrand: async (id: string, data: FormData) => {
        const response = await axiosInstance.patch<SingleBrandResponse>(`/admin/brands/edit/${id}`, data);
        return response.data;
    },

    deleteBrand: async (id: string) => {
        const response = await axiosInstance.delete<GenericResponse>(`/admin/brands/delete/${id}`);
        return response.data;
    }
};
