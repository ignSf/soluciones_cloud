import { ApiResponse, Category } from '../types';
import { apiFetch } from './api';
import { MOCK_CATEGORIES } from './mockData';

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    try {
      const res = await apiFetch<ApiResponse<Category[]>>('/categories');
      return res.data;
    } catch {
      return MOCK_CATEGORIES;
    }
  },

  async getCategoryTree(): Promise<Category[]> {
    try {
      const res = await apiFetch<ApiResponse<Category[]>>('/categories/tree');
      return res.data;
    } catch {
      return MOCK_CATEGORIES;
    }
  },
};
