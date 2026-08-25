import type { ApiResponse, ProductReview, ReviewRequestDto } from '../types';
import { apiFetch } from './api';
import { MOCK_REVIEWS } from './mockData';

const REVIEWS_STORAGE_KEY = 'demo_reviews_store';

function getLocalReviews(): Record<string, ProductReview[]> {
  const data = localStorage.getItem(REVIEWS_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(MOCK_REVIEWS));
    return MOCK_REVIEWS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return MOCK_REVIEWS;
  }
}

function saveLocalReviews(reviews: Record<string, ProductReview[]>): void {
  localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
}

export const reviewService = {
  async getProductReviews(productId: string): Promise<ProductReview[]> {
    try {
      const res = await apiFetch<ApiResponse<any>>(`/reviews/product/${productId}`);
      return res.data.content || res.data || [];
    } catch {
      const all = getLocalReviews();
      return all[productId] || [];
    }
  },

  async addReview(request: ReviewRequestDto): Promise<ProductReview> {
    try {
      const res = await apiFetch<ApiResponse<ProductReview>>('/reviews', {
        method: 'POST',
        body: JSON.stringify(request),
      });
      return res.data;
    } catch {
      const all = getLocalReviews();
      const productReviews = all[request.productId] || [];

      const cachedUser = localStorage.getItem('auth_user');
      const user = cachedUser ? JSON.parse(cachedUser) : null;
      const userName = user ? `${user.firstName} ${user.lastName}` : 'Cliente Verificado';
      const userId = user ? user.userId : 'user-' + Date.now();

      const newReview: ProductReview = {
        id: 'rev-' + Date.now(),
        productId: request.productId,
        userId,
        userName,
        rating: request.rating,
        title: request.title,
        comment: request.comment,
        isVerifiedPurchase: true,
        createdAt: new Date().toISOString(),
      };

      productReviews.unshift(newReview);
      all[request.productId] = productReviews;
      saveLocalReviews(all);

      return newReview;
    }
  },

  async deleteReview(id: string): Promise<void> {
    try {
      await apiFetch<ApiResponse<void>>(`/reviews/${id}`, {
        method: 'DELETE',
      });
    } catch {
      const all = getLocalReviews();
      for (const prodId in all) {
        all[prodId] = all[prodId].filter((r) => r.id !== id);
      }
      saveLocalReviews(all);
    }
  },
};
