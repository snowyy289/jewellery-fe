import { GenericResponse } from "./auth";
import { Pagination } from "./pagination";

import { Permission } from "./permission";

export interface Role {
  _id: string;
  name: string;
  description?: string;
  permissions: string[];
  deleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface RoleResponse extends GenericResponse {
  roles?: Role[];
  data?: Role[];
  pagination?: Pagination;
}

export interface SingleRoleResponse extends GenericResponse {
  role: Role;
}

export interface PermissionResponse extends GenericResponse {
  permissionList: Permission[];
}
