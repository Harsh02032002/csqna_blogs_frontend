export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'author';
  avatar?: string;
  bio?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author?: User;
  category?: Category;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  views: number;
  readTime: number;
  metaTitle?: string;
  metaDescription?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  total: number;
  published: number;
  draft: number;
  archived: number;
  totalViews: number;
}
