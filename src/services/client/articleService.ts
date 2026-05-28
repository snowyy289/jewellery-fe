import axiosInstance from "../axiosInstance";
import { Article } from "@/types/article";

interface Pagination {
    currentPage: number;
    limitItems: number;
    skip: number;
    totalPage: number;
    totalItems?: number;
}

interface ArticleListResponse {
    code: string;
    articles: Article[];
    pagination: Pagination;
}

interface ArticleDetailResponse {
    code: string;
    article: Article;
    relatedArticles: Article[];
}

interface ArticleSimpleResponse {
    code: string;
    articles: Article[];
}

export const articleService = {
    getArticles: async (params?: any): Promise<ArticleListResponse> => {
        const response = await axiosInstance.get('/client/articles', { params });
        return response.data;
    },
    
    getFeaturedArticles: async (limit: number = 6): Promise<ArticleSimpleResponse> => {
        const response = await axiosInstance.get('/client/articles/featured', { params: { limit } });
        return response.data;
    },
    
    getPopularArticles: async (limit: number = 6): Promise<ArticleSimpleResponse> => {
        const response = await axiosInstance.get('/client/articles/popular', { params: { limit } });
        return response.data;
    },
    
    getArticleBySlug: async (slug: string): Promise<ArticleDetailResponse> => {
        const response = await axiosInstance.get(`/client/articles/detail/${slug}`);
        return response.data;
    }
};
