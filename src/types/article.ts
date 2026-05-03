export interface ArticleCategory {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  thumbnail?: string;
  parent_id?: ArticleCategory | string | null;
  status: 'active' | 'inactive';
  position: number;
  meta_title?: string;
  meta_description?: string;
  createBy?: {
    _id: string;
    fullName: string;
  };
  updateBy?: {
    _id: string;
    fullName: string;
  };
  createdAt?: string;
  updatedAt?: string;
  deleted: boolean;
  level?: number;
}

export interface Article {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  content: string;
  thumbnail?: string;
  images?: string[];
  category_id?: ArticleCategory | string | null;
  author_id: {
    _id: string;
    fullName: string;
    email?: string;
  };
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  position: number;
  tags?: string[];
  published_at?: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  createBy?: {
    _id: string;
    fullName: string;
  };
  updateBy?: {
    _id: string;
    fullName: string;
  };
  createdAt?: string;
  updatedAt?: string;
  deleted: boolean;
}

export interface ArticleFormData {
  title: string;
  description?: string;
  content: string;
  thumbnail?: File;
  images?: File[];
  category_id?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  status: string;
  featured?: boolean;
  position?: number;
  tags?: string;
}
