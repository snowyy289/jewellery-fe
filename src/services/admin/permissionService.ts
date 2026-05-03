import axiosInstance from "../axiosInstance";
import { Permission } from "@/types/permission";

const PREFIX = "/api/admin/permissions";

export const permissionService = {
    getPermissions: async () => {
        const res = await axiosInstance.get(PREFIX);
        return res.data;
    },
    createPermission: async (data: Partial<Permission>) => {
        const res = await axiosInstance.post(`${PREFIX}/create`, data);
        return res.data;
    },
    updatePermission: async (id: string, data: Partial<Permission>) => {
        const res = await axiosInstance.patch(`${PREFIX}/edit/${id}`, data);
        return res.data;
    },
    deletePermission: async (id: string) => {
        const res = await axiosInstance.delete(`${PREFIX}/delete/${id}`);
        return res.data;
    },
    syncPermissions: async () => {
        const res = await axiosInstance.post(`${PREFIX}/sync`);
        return res.data;
    }
};
