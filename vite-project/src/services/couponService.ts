import { ApiResponse, Coupon } from '../types';
import { apiFetch } from './api';

export const couponService = {
  async validateCoupon(code: string, orderAmount: number): Promise<Coupon> {
    try {
      const res = await apiFetch<ApiResponse<Coupon>>('/coupons/validate', {
        method: 'POST',
        body: JSON.stringify({ code, orderAmount }),
      });
      return res.data;
    } catch {
      // Mock validation
      if (code.toUpperCase() === 'BIENVENIDO10') {
        const discount = orderAmount * 0.1;
        return {
          id: 'coup-1',
          code: 'BIENVENIDO10',
          description: '10% de descuento de bienvenida',
          discountType: 'percentage',
          discountValue: 10,
          calculatedDiscount: Math.round(discount * 100) / 100,
          isValid: true,
          validUntil: '2026-12-31T23:59:59Z',
        };
      } else if (code.toUpperCase() === 'ENVIOGRATIS') {
        return {
          id: 'coup-2',
          code: 'ENVIOGRATIS',
          description: '$15 de descuento en envío',
          discountType: 'fixed_amount',
          discountValue: 15,
          calculatedDiscount: 15,
          isValid: true,
          validUntil: '2026-12-31T23:59:59Z',
        };
      }
      throw new Error('El cupón no es válido o ha expirado');
    }
  },
};
