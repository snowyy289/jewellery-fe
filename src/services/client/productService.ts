import axiosInstance from "../axiosInstance";

export const productService = {
  getFeatured: async () => {
    const response = await axiosInstance.get("/client/products/featured");
    return response.data;
  },
  
  getNewest: async () => {
    // Sắp xếp theo ngày tạo giảm dần
    const response = await axiosInstance.get("/client/products?sortKey=createdAt&sortValue=desc&limit=8");
    return response.data;
  }
};
