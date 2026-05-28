export interface Review {
    _id: string;
    product_id: string;
    user_id: {
        _id: string;
        fullName: string;
        avatar?: string;
    } | string;
    order_id: string;
    rating: number;
    comment: string;
    images?: string[];
    createdAt: string;
    updatedAt: string;
}

export interface CreateReviewRequest {
    product_id: string;
    order_id: string;
    rating: number;
    comment: string;
    images?: string[];
}

export interface ReviewResponse {
    code: number | string;
    message: string;
    data?: Review[];
}
