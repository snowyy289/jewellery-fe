import axiosInstance from "../axiosInstance";
import { CategoryResponse } from "@/types/category";

export const categoryService = {
    getCategories: async () => {
        const response = await axiosInstance.get<CategoryResponse>("/client/categories");
        return response.data;
    }
};
