import axiosInstance from "../axiosInstance";
import { ReviewResponse, CreateReviewRequest } from "@/types/review";

export const reviewService = {
    getReviewsForProduct: async (productId: string) => {
        const response = await axiosInstance.get<ReviewResponse>(`/client/reviews/product/${productId}`);
        return response.data;
    },

    createReview: async (data: CreateReviewRequest) => {
        const response = await axiosInstance.post<{ code: number | string; message: string; data: any }>("/client/reviews/create", data);
        return response.data;
    }
};
