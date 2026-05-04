import axiosInstance from "../axiosInstance";
import { StockImportResponse, SingleStockImportResponse } from "@/types/stock-import";
import { GenericResponse } from "@/types/auth";

export const stockImportService = {
    getStockImports: async (params?: Record<string, string | number | boolean>) => {
        const response = await axiosInstance.get<StockImportResponse>("/admin/stock-imports", { params });
        return response.data;
    },

    getStockImportDetail: async (id: string) => {
        const response = await axiosInstance.get<SingleStockImportResponse>(`/api/admin/stock-imports/detail/${id}`);
        return response.data;
    },

    createStockImport: async (data: any) => {
        const response = await axiosInstance.post<GenericResponse>("/admin/stock-imports/create", data);
        return response.data;
    },

    updateStockImport: async (id: string, data: any) => {
        const response = await axiosInstance.patch<GenericResponse>(`/api/admin/stock-imports/edit/${id}`, data);
        return response.data;
    },

    confirmStockImport: async (id: string) => {
        const response = await axiosInstance.post<GenericResponse>(`/api/admin/stock-imports/confirm/${id}`);
        return response.data;
    },

    cancelStockImport: async (id: string) => {
        const response = await axiosInstance.post<GenericResponse>(`/api/admin/stock-imports/cancel/${id}`);
        return response.data;
    },

    deleteStockImport: async (id: string) => {
        const response = await axiosInstance.delete<GenericResponse>(`/api/admin/stock-imports/delete/${id}`);
        return response.data;
    }
};
