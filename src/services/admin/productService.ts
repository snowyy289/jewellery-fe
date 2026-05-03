import axiosInstance from "../axiosInstance";
import { ProductResponse, SingleProductResponse } from "@/types/product";
import { GenericResponse } from "@/types/auth";

export const productService = {
    getProducts: async (params?: Record<string, string | number | boolean>) => {
        const response = await axiosInstance.get<ProductResponse>("/api/admin/products", { params });
        return response.data;
    },

    getProductDetail: async (id: string) => {
        const response = await axiosInstance.get<SingleProductResponse>(`/api/admin/products/detail/${id}`);
        return response.data;
    },

    createProduct: async (data: FormData) => {
        const response = await axiosInstance.post<GenericResponse>("/api/admin/products/create", data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    updateProduct: async (id: string, data: FormData) => {
        const response = await axiosInstance.patch<GenericResponse>(`/api/admin/products/edit/${id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    deleteProduct: async (id: string) => {
        const response = await axiosInstance.delete<GenericResponse>(`/api/admin/products/delete/${id}`);
        return response.data;
    }
};
