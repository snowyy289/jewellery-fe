import axiosInstance from "../axiosInstance";
import { UserResponse, SingleUserResponse } from "@/types/user";
import { GenericResponse } from "@/types/auth";

const PREFIX = "/admin/users";

export const userService = {
    getUsers: async (params?: Record<string, string | number | boolean>) => {
        const res = await axiosInstance.get<UserResponse>(PREFIX, { params });
        return res.data;
    },

    getUserDetail: async (id: string) => {
        const res = await axiosInstance.get<SingleUserResponse>(`${PREFIX}/detail/${id}`);
        return res.data;
    },

    createUser: async (data: FormData) => {
        const res = await axiosInstance.post<GenericResponse>(`${PREFIX}/create`, data);
        return res.data;
    },

    updateUser: async (id: string, data: FormData) => {
        const res = await axiosInstance.patch<GenericResponse>(`${PREFIX}/edit/${id}`, data);
        return res.data;
    },

    deleteUser: async (id: string) => {
        const res = await axiosInstance.delete<GenericResponse>(`${PREFIX}/delete/${id}`);
        return res.data;
    },
};
