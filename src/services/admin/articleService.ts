/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "../axiosInstance";
import { Article, ArticleCategory } from "@/types/article";
import { Pagination } from "@/types/pagination";

interface ArticleCategoryResponse {
  code: string | number;
  message?: string;
  categories?: ArticleCategory[];
  data?: ArticleCategory[];
  pagination?: Pagination;
  filterStatus?: any;
}

interface SingleArticleCategoryResponse {
  code: string | number;
  message?: string;
  category?: ArticleCategory;
  data?: ArticleCategory;
}

interface ArticleResponse {
  code: string | number;
  message?: string;
  articles?: Article[];
  data?: Article[];
  pagination?: Pagination;
  filterStatus?: any;
}

interface SingleArticleResponse {
  code: string | number;
  message?: string;
  article?: Article;
  data?: Article;
}

interface GenericResponse {
  code: string | number;
  message?: string;
}

export const articleCategoryService = {
  getCategories: async (params?: Record<string, string | number | boolean>) => {
    const response = await axiosInstance.get<ArticleCategoryResponse>("/admin/article-categories", { params });
    return response.data;
  },

  getCategoryDetail: async (id: string) => {
    const response = await axiosInstance.get<SingleArticleCategoryResponse>(`/admin/article-categories/detail/${id}`);
    return response.data;
  },

  createCategory: async (data: FormData) => {
    const response = await axiosInstance.post<GenericResponse>("/admin/article-categories/create", data);
    return response.data;
  },

  updateCategory: async (id: string, data: FormData) => {
    const response = await axiosInstance.patch<GenericResponse>(`/admin/article-categories/edit/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id: string) => {
    const response = await axiosInstance.delete<GenericResponse>(`/admin/article-categories/delete/${id}`);
    return response.data;
  }
};

export const articleService = {
  getArticles: async (params?: Record<string, string | number | boolean>) => {
    const response = await axiosInstance.get<ArticleResponse>("/admin/articles", { params });
    return response.data;
  },

  getArticleDetail: async (id: string) => {
    const response = await axiosInstance.get<SingleArticleResponse>(`/admin/articles/detail/${id}`);
    return response.data;
  },

  createArticle: async (data: FormData) => {
    const response = await axiosInstance.post<GenericResponse>("/admin/articles/create", data);
    return response.data;
  },

  updateArticle: async (id: string, data: FormData) => {
    const response = await axiosInstance.patch<GenericResponse>(`/admin/articles/edit/${id}`, data);
    return response.data;
  },

  changeStatus: async (id: string, status: string) => {
    const response = await axiosInstance.patch<GenericResponse>(`/admin/articles/change-status/${id}`, { status });
    return response.data;
  },

  deleteArticle: async (id: string) => {
    const response = await axiosInstance.delete<GenericResponse>(`/admin/articles/delete/${id}`);
    return response.data;
  }
};
