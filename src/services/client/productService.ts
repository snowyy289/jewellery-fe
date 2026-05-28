import axiosInstance from "../axiosInstance";
import { ProductFilterParams, ProductResponse, SingleProductResponse } from "@/types/product";

export const productService = {
  getFeatured: async () => {
    const response = await axiosInstance.get("/client/products/featured");
    return response.data;
  },
  
  getNewest: async () => {
    // Sắp xếp theo ngày tạo giảm dần
    const response = await axiosInstance.get("/client/products?sortKey=createdAt&sortValue=desc&limit=8");
    return response.data;
  },

  getProducts: async (params?: ProductFilterParams): Promise<ProductResponse> => {
    const response = await axiosInstance.get("/client/products", { params });
    return response.data;
  },

  getProductBySlug: async (slug: string): Promise<SingleProductResponse> => {
    const response = await axiosInstance.get(`/client/products/slug/${slug}`);
    return response.data;
  }
};
