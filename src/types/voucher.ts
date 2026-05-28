export interface Voucher {
    _id: string;
    code: string;
    discount_type: 'percent' | 'fixed';
    discount_value: number;
    min_order_value: number;
    max_discount: number | null;
    start_date: string;
    end_date: string;
    usage_limit: number;
    used_count: number;
    status: 'active' | 'inactive';
    description: string;
    applicable_category: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface VoucherListResponse {
    code: string | number;
    message: string;
    data: Voucher[];
    pagination: {
        currentPage: number;
        totalItems: number;
        totalPages: number;
        limitItems: number;
    };
}

export interface VoucherDetailResponse {
    code: string | number;
    message: string;
    data: Voucher;
}
