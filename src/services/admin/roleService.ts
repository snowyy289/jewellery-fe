import axiosInstance from "../axiosInstance";
import { RoleResponse, PermissionResponse, SingleRoleResponse, Role } from "@/types/role";
import { GenericResponse } from "@/types/auth";

export const roleService = {
    getRoles: async (params?: Record<string, string | number | boolean>) => {
        const response = await axiosInstance.get<RoleResponse>("/admin/roles", { params });
        return response.data;
    },

    getPermissions: async () => {
        const response = await axiosInstance.get<PermissionResponse>("/admin/roles/permissions");
        return response.data;
    },

    createRole: async (data: Partial<Role>) => {
        const response = await axiosInstance.post<SingleRoleResponse>("/admin/roles/create", data);
        return response.data;
    },

    updateRole: async (id: string, data: Partial<Role>) => {
        const response = await axiosInstance.patch<SingleRoleResponse>(`/admin/roles/edit/${id}`, data);
        return response.data;
    },

    deleteRole: async (id: string) => {
        const response = await axiosInstance.delete<GenericResponse>(`/admin/roles/delete/${id}`);
        return response.data;
    }
};
