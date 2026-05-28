import axiosInstance from "../axiosInstance";

export const collectionService = {
  getCollections: async () => {
    const response = await axiosInstance.get(`/client/collections`);
    return response.data;
  },

  getFeatured: async () => {
    const response = await axiosInstance.get(`/client/collections/featured`);
    return response.data;
  },

  getCollectionDetail: async (slug: string, query = "") => {
    const response = await axiosInstance.get(`/client/collections/detail/${slug}${query}`);
    return response.data;
  }
};
