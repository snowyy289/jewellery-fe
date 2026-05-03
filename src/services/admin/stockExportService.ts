import axiosInstance from "../axiosInstance";
import { StockExportResponse, SingleStockExportResponse } from "@/types/stock-export";
import { GenericResponse } from "@/types/auth";

export const stockExportService = {
    getStockExports: async (params?: Record<string, string | number | boolean>) => {
        const response = await axiosInstance.get<StockExportResponse>("/api/admin/stock-exports", { params });
        return response.data;
    },

    getStockExportDetail: async (id: string) => {
        const response = await axiosInstance.get<SingleStockExportResponse>(`/api/admin/stock-exports/detail/${id}`);
        return response.data;
    },

    createStockExport: async (data: any) => {
        const response = await axiosInstance.post<GenericResponse>("/api/admin/stock-exports/create", data);
        return response.data;
    },

    updateStockExport: async (id: string, data: any) => {
        const response = await axiosInstance.patch<GenericResponse>(`/api/admin/stock-exports/edit/${id}`, data);
        return response.data;
    },

    confirmStockExport: async (id: string) => {
        const response = await axiosInstance.post<GenericResponse>(`/api/admin/stock-exports/confirm/${id}`);
        return response.data;
    },

    cancelStockExport: async (id: string) => {
        const response = await axiosInstance.post<GenericResponse>(`/api/admin/stock-exports/cancel/${id}`);
        return response.data;
    },

    deleteStockExport: async (id: string) => {
        const response = await axiosInstance.delete<GenericResponse>(`/api/admin/stock-exports/delete/${id}`);
        return response.data;
    }
};
