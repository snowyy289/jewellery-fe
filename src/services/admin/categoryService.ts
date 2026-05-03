import axiosInstance from "../axiosInstance";
import { CategoryResponse, SingleCategoryResponse } from "@/types/category";
import { GenericResponse } from "@/types/auth";

export const categoryService = {
    getCategories: async (params?: Record<string, string | number | boolean>) => {
        const response = await axiosInstance.get<CategoryResponse>("/api/admin/categories", { params });
        return response.data;
    },

    createCategory: async (data: FormData) => {
        const response = await axiosInstance.post<SingleCategoryResponse>("/api/admin/categories/create", data);
        return response.data;
    },

    updateCategory: async (id: string, data: FormData) => {
        const response = await axiosInstance.patch<SingleCategoryResponse>(`/api/admin/categories/edit/${id}`, data);
        return response.data;
    },

    deleteCategory: async (id: string) => {
        const response = await axiosInstance.delete<GenericResponse>(`/api/admin/categories/delete/${id}`);
        return response.data;
    }
};
