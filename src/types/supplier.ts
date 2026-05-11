/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { GenericResponse } from "./auth";
import { Pagination } from "./pagination";

export interface Supplier {
  _id: string;
  name: string;
  code: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  tax_code?: string;
  status: "active" | "inactive";
  notes?: string;
  createBy?: { _id: string, fullName: string };
  updateBy?: { _id: string, fullName: string };
  createdAt?: string;
  updatedAt?: string;
  deleted?: boolean;
}

export interface SupplierResponse extends GenericResponse {
  suppliers?: Supplier[];
  data?: Supplier[];
  pagination?: Pagination;
  filterStatus?: any[];
}

export interface SingleSupplierResponse extends GenericResponse {
  supplier?: Supplier;
  data?: Supplier;
}

export interface SupplierCreateRequest {
  name: string;
  code: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  tax_code?: string;
  status: "active" | "inactive";
  notes?: string;
}

export interface SupplierEditRequest extends Partial<SupplierCreateRequest> {}
