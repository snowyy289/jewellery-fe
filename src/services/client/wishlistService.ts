import axiosInstance from "../axiosInstance";
import { Product } from "@/types/product";

export interface WishlistProduct {
  product_id: Product;
  added_at: string;
}

export const wishlistService = {
  getWishlist: async () => {
    try {
      const response = await axiosInstance.get('/client/wishlist');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  toggleWishlist: async (product_id: string) => {
    try {
      const response = await axiosInstance.post('/client/wishlist/toggle', { product_id });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
