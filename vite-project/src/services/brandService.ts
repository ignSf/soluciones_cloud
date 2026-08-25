import type { ApiResponse, Brand } from '../types';
import { apiFetch } from './api';
import { MOCK_BRANDS } from './mockData';

export const brandService = {
  async getAllBrands(): Promise<Brand[]> {
    try {
      const res = await apiFetch<ApiResponse<Brand[]>>('/brands');
      return res.data;
    } catch {
      return MOCK_BRANDS;
    }
  },

  async getBrandBySlug(slug: string): Promise<Brand> {
    try {
      const res = await apiFetch<ApiResponse<Brand>>(`/brands/${slug}`);
      return res.data;
    } catch {
      const brand = MOCK_BRANDS.find((b) => b.slug === slug);
      if (brand) return brand;
      throw new Error('Marca no encontrada');
    }
  },
};
