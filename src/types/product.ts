import { GenericResponse } from "./auth";
import { Pagination } from "./pagination";

export interface Product {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  price: number;
  discountPercentage?: number;
  discountPrice?: number; // Calculated field
  stock: number;
  outOfStock?: boolean; // Calculated field
  sku: string;
  category_id: string | { _id: string, title: string, slug?: string };
  thumbnail?: string;
  images?: string[];
  featured: boolean;
  status: "active" | "inactive";
  position?: number;
  tags?: string[];
  createBy?: { _id: string, fullName: string };
  updateBy?: { _id: string, fullName: string };
  createdAt?: string;
  updatedAt?: string;
  deleted?: boolean;
}

export interface ProductResponse extends GenericResponse {
  products: Product[];
  pagination?: Pagination;
  filterStatus?: any[];
}

export interface SingleProductResponse extends GenericResponse {
  product: Product;
}

export interface ProductCreateRequest {
  title: string;
  description?: string;
  price: number;
  discountPercentage?: number;
  stock: number;
  sku: string;
  category_id: string;
  thumbnail?: File;
  images?: File[];
  featured?: boolean;
  status: "active" | "inactive";
  position?: number;
  tags?: string[];
}

export interface ProductEditRequest extends Partial<ProductCreateRequest> {}

export interface ProductFilterParams {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
  featured?: boolean;
  keyword?: string;
  minPrice?: number;
  maxPrice?: number;
  sortKey?: string;
  sortValue?: string;
}
