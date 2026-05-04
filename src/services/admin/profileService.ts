import axiosInstance from "../axiosInstance";
import { User, GenericResponse } from "@/types/auth";

export const profileService = {
    getProfile: async () => {
        const response = await axiosInstance.get<{ code: string; user: User }>("/admin/my-profile");
        return response.data;
    },

    updateProfile: async (data: FormData) => {
        const response = await axiosInstance.patch<GenericResponse>("/admin/my-profile/update", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },

    changePassword: async (data: Record<string, string>) => {
        const response = await axiosInstance.patch<GenericResponse>("/admin/my-profile/change-password", data);
        return response.data;
    }
};
