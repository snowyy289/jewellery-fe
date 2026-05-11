/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "../axiosInstance";
import { StockExportResponse, SingleStockExportResponse } from "@/types/stock-export";
import { GenericResponse } from "@/types/auth";

export const stockExportService = {
    getStockExports: async (params?: Record<string, string | number | boolean>) => {
        const response = await axiosInstance.get<StockExportResponse>("/admin/stock-exports", { params });
        return response.data;
    },

    getStockExportDetail: async (id: string) => {
        const response = await axiosInstance.get<SingleStockExportResponse>(`/admin/stock-exports/detail/${id}`);
        return response.data;
    },

    createStockExport: async (data: any) => {
        const response = await axiosInstance.post<GenericResponse>("/admin/stock-exports/create", data);
        return response.data;
    },

    updateStockExport: async (id: string, data: any) => {
        const response = await axiosInstance.patch<GenericResponse>(`/admin/stock-exports/edit/${id}`, data);
        return response.data;
    },

    confirmStockExport: async (id: string) => {
        const response = await axiosInstance.post<GenericResponse>(`/admin/stock-exports/confirm/${id}`);
        return response.data;
    },

    cancelStockExport: async (id: string) => {
        const response = await axiosInstance.post<GenericResponse>(`/admin/stock-exports/cancel/${id}`);
        return response.data;
    },

    deleteStockExport: async (id: string) => {
        const response = await axiosInstance.delete<GenericResponse>(`/admin/stock-exports/delete/${id}`);
        return response.data;
    }
};
