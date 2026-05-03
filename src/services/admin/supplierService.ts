import axiosInstance from "../axiosInstance";
import { SupplierResponse, SingleSupplierResponse } from "@/types/supplier";
import { GenericResponse } from "@/types/auth";

export const supplierService = {
    getSuppliers: async (params?: Record<string, string | number | boolean>) => {
        const response = await axiosInstance.get<SupplierResponse>("/api/admin/suppliers", { params });
        return response.data;
    },

    getSupplierDetail: async (id: string) => {
        const response = await axiosInstance.get<SingleSupplierResponse>(`/api/admin/suppliers/detail/${id}`);
        return response.data;
    },

    createSupplier: async (data: FormData) => {
        // Convert FormData to JSON since supplier doesn't need file upload
        const jsonData: Record<string, any> = {};
        data.forEach((value, key) => {
            jsonData[key] = value;
        });
        const response = await axiosInstance.post<GenericResponse>("/api/admin/suppliers/create", jsonData, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    },

    updateSupplier: async (id: string, data: FormData) => {
        // Convert FormData to JSON since supplier doesn't need file upload
        const jsonData: Record<string, any> = {};
        data.forEach((value, key) => {
            jsonData[key] = value;
        });
        const response = await axiosInstance.patch<GenericResponse>(`/api/admin/suppliers/edit/${id}`, jsonData, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    },

    deleteSupplier: async (id: string) => {
        const response = await axiosInstance.delete<GenericResponse>(`/api/admin/suppliers/delete/${id}`);
        return response.data;
    }
};
