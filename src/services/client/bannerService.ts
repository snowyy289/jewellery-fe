import axiosInstance from "../axiosInstance";

export const bannerService = {
  getAll: async (position?: string) => {
    const response = await axiosInstance.get("/client/banners", {
      params: { position }
    });
    return response.data;
  },
  
  trackView: async (id: string) => {
    return await axiosInstance.post(`/client/banners/track-view/${id}`);
  },
  
  trackClick: async (id: string) => {
    return await axiosInstance.post(`/client/banners/track-click/${id}`);
  }
};
