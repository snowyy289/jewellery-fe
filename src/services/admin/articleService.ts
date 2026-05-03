import axiosInstance from "../axiosInstance";
import { Article, ArticleCategory } from "@/types/article";
import { Pagination } from "@/types/pagination";

interface ArticleCategoryResponse {
  code: string;
  message?: string;
  categories: ArticleCategory[];
  pagination?: Pagination;
  filterStatus?: any;
}

interface SingleArticleCategoryResponse {
  code: string;
  message?: string;
  category?: ArticleCategory;
}

interface ArticleResponse {
  code: string;
  message?: string;
  articles: Article[];
  pagination?: Pagination;
  filterStatus?: any;
}

interface SingleArticleResponse {
  code: string;
  message?: string;
  article?: Article;
}

interface GenericResponse {
  code: string;
  message?: string;
}

export const articleCategoryService = {
  getCategories: async (params?: Record<string, string | number | boolean>) => {
    const response = await axiosInstance.get<ArticleCategoryResponse>("/api/admin/article-categories", { params });
    return response.data;
  },

  getCategoryDetail: async (id: string) => {
    const response = await axiosInstance.get<SingleArticleCategoryResponse>(`/api/admin/article-categories/detail/${id}`);
    return response.data;
  },

  createCategory: async (data: FormData) => {
    const response = await axiosInstance.post<GenericResponse>("/api/admin/article-categories/create", data);
    return response.data;
  },

  updateCategory: async (id: string, data: FormData) => {
    const response = await axiosInstance.patch<GenericResponse>(`/api/admin/article-categories/edit/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id: string) => {
    const response = await axiosInstance.delete<GenericResponse>(`/api/admin/article-categories/delete/${id}`);
    return response.data;
  }
};

export const articleService = {
  getArticles: async (params?: Record<string, string | number | boolean>) => {
    const response = await axiosInstance.get<ArticleResponse>("/api/admin/articles", { params });
    return response.data;
  },

  getArticleDetail: async (id: string) => {
    const response = await axiosInstance.get<SingleArticleResponse>(`/api/admin/articles/detail/${id}`);
    return response.data;
  },

  createArticle: async (data: FormData) => {
    const response = await axiosInstance.post<GenericResponse>("/api/admin/articles/create", data);
    return response.data;
  },

  updateArticle: async (id: string, data: FormData) => {
    const response = await axiosInstance.patch<GenericResponse>(`/api/admin/articles/edit/${id}`, data);
    return response.data;
  },

  changeStatus: async (id: string, status: string) => {
    const response = await axiosInstance.patch<GenericResponse>(`/api/admin/articles/change-status/${id}`, { status });
    return response.data;
  },

  deleteArticle: async (id: string) => {
    const response = await axiosInstance.delete<GenericResponse>(`/api/admin/articles/delete/${id}`);
    return response.data;
  }
};
