import { ApiResponse, Product } from '../types';
import { apiFetch } from './api';
import { MOCK_PRODUCTS } from './mockData';

export const productService = {
  async getProducts(params?: {
    search?: string;
    categoryId?: string;
    brandId?: string;
    page?: number;
    size?: number;
  }): Promise<{ content: Product[]; totalElements: number; totalPages: number }> {
    try {
      const searchParams = new URLSearchParams();
      if (params?.search) searchParams.append('search', params.search);
      if (params?.categoryId) searchParams.append('categoryId', params.categoryId);
      if (params?.brandId) searchParams.append('brandId', params.brandId);
      if (params?.page !== undefined) searchParams.append('page', params.page.toString());
      if (params?.size !== undefined) searchParams.append('size', params.size.toString());

      const res = await apiFetch<ApiResponse<any>>(`/products?${searchParams.toString()}`);
      return {
        content: res.data.content || [],
        totalElements: res.data.totalElements || 0,
        totalPages: res.data.totalPages || 1,
      };
    } catch {
      // Fallback a mock data local
      let filtered = [...MOCK_PRODUCTS];
      if (params?.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (p) => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)
        );
      }
      if (params?.categoryId) {
        filtered = filtered.filter((p) => p.categories.some((c) => c.id === params.categoryId));
      }
      return {
        content: filtered,
        totalElements: filtered.length,
        totalPages: 1,
      };
    }
  },

  async getProductBySlug(slug: string): Promise<Product> {
    try {
      const res = await apiFetch<ApiResponse<Product>>(`/products/${slug}`);
      return res.data;
    } catch {
      const found = MOCK_PRODUCTS.find((p) => p.slug === slug);
      if (found) return found;
      throw new Error('Producto no encontrado');
    }
  },
};
