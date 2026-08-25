import type { ApiResponse, Product, ProductRequestDto } from '../types';
import { apiFetch } from './api';
import { MOCK_BRANDS, MOCK_CATEGORIES, MOCK_PRODUCTS } from './mockData';

const PRODUCTS_STORAGE_KEY = 'demo_products_store';

function getLocalProducts(): Product[] {
  const data = localStorage.getItem(PRODUCTS_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(MOCK_PRODUCTS));
    return MOCK_PRODUCTS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return MOCK_PRODUCTS;
  }
}

function saveLocalProducts(products: Product[]): void {
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
}

export const productService = {
  async getProducts(params?: {
    search?: string;
    categoryId?: string;
    brandId?: string;
    minPrice?: number;
    maxPrice?: number;
    onlyFeatured?: boolean;
    onlyInStock?: boolean;
    sortBy?: string;
    direction?: string;
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
      if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
      if (params?.direction) searchParams.append('direction', params.direction);

      const res = await apiFetch<ApiResponse<any>>(`/products?${searchParams.toString()}`);
      return {
        content: res.data.content || [],
        totalElements: res.data.totalElements || 0,
        totalPages: res.data.totalPages || 1,
      };
    } catch {
      // Fallback a almacenamiento local enriquecido
      let filtered = [...getLocalProducts()];

      if (params?.search) {
        const q = params.search.toLowerCase().trim();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q) ||
            p.shortDescription?.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q)
        );
      }

      if (params?.categoryId) {
        filtered = filtered.filter((p) =>
          p.categories.some((c) => c.id === params.categoryId || c.parentId === params.categoryId)
        );
      }

      if (params?.brandId) {
        filtered = filtered.filter((p) => p.brand?.id === params.brandId);
      }

      if (params?.minPrice !== undefined && params.minPrice > 0) {
        filtered = filtered.filter((p) => (p.discountPrice ?? p.basePrice) >= (params.minPrice ?? 0));
      }

      if (params?.maxPrice !== undefined && params.maxPrice > 0) {
        filtered = filtered.filter((p) => (p.discountPrice ?? p.basePrice) <= (params.maxPrice ?? Infinity));
      }

      if (params?.onlyFeatured) {
        filtered = filtered.filter((p) => p.isFeatured);
      }

      if (params?.onlyInStock) {
        filtered = filtered.filter((p) => p.stockQuantity > 0);
      }

      // Ordenamiento
      if (params?.sortBy) {
        if (params.sortBy === 'price') {
          const isAsc = params.direction === 'asc';
          filtered.sort((a, b) => {
            const priceA = a.discountPrice ?? a.basePrice;
            const priceB = b.discountPrice ?? b.basePrice;
            return isAsc ? priceA - priceB : priceB - priceA;
          });
        } else if (params.sortBy === 'rating') {
          filtered.sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0));
        } else if (params.sortBy === 'name') {
          filtered.sort((a, b) => a.name.localeCompare(b.name));
        }
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
      const found = getLocalProducts().find((p) => p.slug === slug);
      if (found) return found;
      throw new Error('Producto no encontrado');
    }
  },

  async getProductById(id: string): Promise<Product> {
    try {
      const res = await apiFetch<ApiResponse<Product>>(`/products/id/${id}`);
      return res.data;
    } catch {
      const found = getLocalProducts().find((p) => p.id === id);
      if (found) return found;
      throw new Error('Producto no encontrado');
    }
  },

  async createProduct(request: ProductRequestDto): Promise<Product> {
    try {
      const res = await apiFetch<ApiResponse<Product>>('/products', {
        method: 'POST',
        body: JSON.stringify(request),
      });
      return res.data;
    } catch {
      const local = getLocalProducts();
      const brand = MOCK_BRANDS.find((b) => b.id === request.brandId) || MOCK_BRANDS[0];
      const categories = request.categoryIds
        ? MOCK_CATEGORIES.filter((c) => request.categoryIds?.includes(c.id))
        : [MOCK_CATEGORIES[0]];

      const slug = (request.slug || request.name)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const newProd: Product = {
        id: 'prod-' + Date.now(),
        name: request.name,
        slug,
        shortDescription: request.shortDescription || request.name,
        description: request.description || request.name,
        sku: request.sku || 'SKU-' + Date.now(),
        basePrice: request.basePrice,
        discountPrice: request.discountPrice,
        stockQuantity: request.stockQuantity || 10,
        isFeatured: request.isFeatured ?? true,
        isActive: request.isActive ?? true,
        averageRating: 5.0,
        brand,
        categories,
        images: (request.images && request.images.length > 0)
          ? request.images.map((img, idx) => ({
              id: 'img-' + Date.now() + '-' + idx,
              imageUrl: img.imageUrl,
              altText: img.altText || request.name,
              isPrimary: idx === 0,
              displayOrder: idx + 1,
            }))
          : [
              {
                id: 'img-' + Date.now(),
                imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800',
                altText: request.name,
                isPrimary: true,
                displayOrder: 1,
              },
            ],
        variants: request.variants
          ? request.variants.map((v, idx) => ({
              id: 'var-' + Date.now() + '-' + idx,
              sku: v.sku,
              variantName: v.variantName,
              priceModifier: v.priceModifier,
              stockQuantity: v.stockQuantity,
              attributes: v.attributes || {},
              isActive: true,
            }))
          : [],
        createdAt: new Date().toISOString(),
      };

      local.unshift(newProd);
      saveLocalProducts(local);
      return newProd;
    }
  },

  async updateProduct(id: string, request: ProductRequestDto): Promise<Product> {
    try {
      const res = await apiFetch<ApiResponse<Product>>(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(request),
      });
      return res.data;
    } catch {
      const local = getLocalProducts();
      const idx = local.findIndex((p) => p.id === id);
      if (idx === -1) throw new Error('Producto no encontrado');

      const current = local[idx];
      const updated: Product = {
        ...current,
        name: request.name ?? current.name,
        shortDescription: request.shortDescription ?? current.shortDescription,
        description: request.description ?? current.description,
        basePrice: request.basePrice ?? current.basePrice,
        discountPrice: request.discountPrice !== undefined ? request.discountPrice : current.discountPrice,
        stockQuantity: request.stockQuantity ?? current.stockQuantity,
        isFeatured: request.isFeatured ?? current.isFeatured,
        isActive: request.isActive ?? current.isActive,
      };

      local[idx] = updated;
      saveLocalProducts(local);
      return updated;
    }
  },

  async deleteProduct(id: string): Promise<void> {
    try {
      await apiFetch<ApiResponse<void>>(`/products/${id}`, {
        method: 'DELETE',
      });
    } catch {
      const local = getLocalProducts().filter((p) => p.id !== id);
      saveLocalProducts(local);
    }
  },
};
