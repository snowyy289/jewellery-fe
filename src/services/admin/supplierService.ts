/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "../axiosInstance";
import { SupplierResponse, SingleSupplierResponse } from "@/types/supplier";
import { GenericResponse } from "@/types/auth";

export const supplierService = {
    getSuppliers: async (params?: Record<string, string | number | boolean>) => {
        const response = await axiosInstance.get<SupplierResponse>("/admin/suppliers", { params });
        return response.data;
    },

    getSupplierDetail: async (id: string) => {
        const response = await axiosInstance.get<SingleSupplierResponse>(`/admin/suppliers/detail/${id}`);
        return response.data;
    },

    createSupplier: async (data: FormData) => {
        // Convert FormData to JSON since supplier doesn't need file upload
        const jsonData: Record<string, any> = {};
        data.forEach((value, key) => {
            jsonData[key] = value;
        });
        const response = await axiosInstance.post<GenericResponse>("/admin/suppliers/create", jsonData, {
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
        const response = await axiosInstance.patch<GenericResponse>(`/admin/suppliers/edit/${id}`, jsonData, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    },

    deleteSupplier: async (id: string) => {
        const response = await axiosInstance.delete<GenericResponse>(`/admin/suppliers/delete/${id}`);
        return response.data;
    }
};
