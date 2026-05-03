import { User } from "./auth";
import { Product } from "./product";

export interface StockExportItem {
    product_id: Product | string;
    quantity: number;
    export_price: number;
    total: number;
}

export interface StockExport {
    _id: string;
    export_code: string;
    export_type: 'order' | 'return' | 'damaged' | 'other';
    order_id?: string | null;
    export_date: string;
    status: 'draft' | 'confirmed' | 'cancelled';
    items: StockExportItem[];
    total_quantity: number;
    total_amount: number;
    notes?: string;
    createBy?: User;
    updateBy?: User;
    createdAt?: string;
    updatedAt?: string;
}

export interface StockExportResponse {
    code: string;
    message: string;
    stockExports: StockExport[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface SingleStockExportResponse {
    code: string;
    message: string;
    stockExport: StockExport;
}
