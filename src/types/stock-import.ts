import { GenericResponse } from "./auth";
import { Pagination } from "./pagination";
import { Product } from "./product";
import { Supplier } from "./supplier";

export interface StockImportItem {
  product_id: string | Product;
  quantity: number;
  import_price: number;
  total: number;
}

export interface StockImport {
  _id: string;
  import_code: string;
  supplier_id: string | Supplier;
  import_date: string;
  status: "draft" | "confirmed" | "cancelled";
  items: StockImportItem[];
  total_quantity: number;
  total_amount: number;
  notes?: string;
  createBy?: { _id: string, fullName: string };
  updateBy?: { _id: string, fullName: string };
  confirmedBy?: { _id: string, fullName: string };
  confirmedAt?: string;
  cancelledBy?: { _id: string, fullName: string };
  cancelledAt?: string;
  createdAt?: string;
  updatedAt?: string;
  deleted?: boolean;
}

export interface StockImportResponse extends GenericResponse {
  imports: StockImport[];
  pagination?: Pagination;
}

export interface SingleStockImportResponse extends GenericResponse {
  stockImport: StockImport;
}

export interface StockImportCreateRequest {
  supplier_id: string;
  import_date: string;
  items: StockImportItem[];
  total_quantity: number;
  total_amount: number;
  notes?: string;
}

export interface StockImportEditRequest extends Partial<StockImportCreateRequest> {}
