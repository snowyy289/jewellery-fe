import { GenericResponse } from "./auth";
import { Pagination } from "./pagination";

export interface Brand {
  _id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  status: "active" | "inactive";
  position?: number;
  slug?: string;
  productCount?: number;
  deleted?: boolean;
  createBy?: { _id: string, fullName: string };
  updateBy?: { _id: string, fullName: string };
  createdAt?: string;
  updatedAt?: string;
}

export interface BrandResponse extends GenericResponse {
  brands: Brand[];
  pagination?: Pagination;
}

export interface SingleBrandResponse extends GenericResponse {
  brand: Brand;
}
