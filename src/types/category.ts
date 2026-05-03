import { GenericResponse } from "./auth";
import { Pagination } from "./pagination";

export interface Category {
  _id: string;
  title: string;
  parent_id?: string | { _id: string, title: string };
  description?: string;
  thumbnail?: string;
  status: "active" | "inactive";
  position?: number;
  slug?: string;
  deleted?: boolean;
  createBy?: { _id: string, fullName: string };
  updateBy?: { _id: string, fullName: string };
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryResponse extends GenericResponse {
  categories: Category[];
  pagination?: Pagination;
}

export interface SingleCategoryResponse extends GenericResponse {
  category: Category;
}
