import { GenericResponse } from "./auth";
import { Pagination } from "./pagination";

export interface AdminUser {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  password?: string;
  status: "active" | "inactive";
  role_id?: string | { _id: string; name: string };
  deleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
  createBy?: string;
  updateBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserResponse extends GenericResponse {
  users: AdminUser[];
  pagination?: Pagination;
}

export interface SingleUserResponse extends GenericResponse {
  user: AdminUser;
}
