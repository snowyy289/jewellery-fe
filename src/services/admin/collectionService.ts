import axiosInstance from "../axiosInstance";

export const collectionService = {
  getCollections: async (query = "") => {
    const response = await axiosInstance.get(`/admin/collections${query}`);
    return response.data;
  },

  getCollection: async (id: string) => {
    const response = await axiosInstance.get(`/admin/collections/detail/${id}`);
    return response.data;
  },

  createCollection: async (data: FormData) => {
    const response = await axiosInstance.post(`/admin/collections/create`, data);
    return response.data;
  },

  updateCollection: async (id: string, data: FormData) => {
    const response = await axiosInstance.patch(`/admin/collections/edit/${id}`, data);
    return response.data;
  },

  deleteCollection: async (id: string) => {
    const response = await axiosInstance.delete(`/admin/collections/delete/${id}`);
    return response.data;
  },

  changeStatus: async (id: string, status: string) => {
    const response = await axiosInstance.patch(`/admin/collections/change-status/${id}`, { status });
    return response.data;
  }
};
