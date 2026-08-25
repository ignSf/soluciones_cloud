import type { ApiResponse, CartItem, Product, ShoppingCart } from '../types';
import { apiFetch } from './api';
import { productService } from './productService';

const CART_STORAGE_KEY = 'shopping_cart_data';

function getLocalCart(): ShoppingCart {
  const data = localStorage.getItem(CART_STORAGE_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      // Ignorar error de parseo
    }
  }
  const initialCart: ShoppingCart = {
    id: 'cart-' + Math.random().toString(36).substring(2),
    items: [],
    totalItems: 0,
    subtotal: 0,
  };
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(initialCart));
  return initialCart;
}

function saveLocalCart(cart: ShoppingCart): void {
  cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  cart.subtotal = Math.round(cart.items.reduce((sum, item) => sum + item.subtotal, 0) * 100) / 100;
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

export const cartService = {
  async getCart(): Promise<ShoppingCart> {
    try {
      const res = await apiFetch<ApiResponse<any>>('/cart');
      const data = res.data;
      const items: CartItem[] = (data.items || []).map((it: any) => ({
        id: it.id || it.itemId,
        productId: it.productId,
        productName: it.productName,
        productSlug: it.productSlug || '',
        productImage: it.productImage || '',
        variantId: it.variantId,
        variantName: it.variantName,
        sku: it.sku || '',
        unitPrice: Number(it.unitPrice),
        quantity: Number(it.quantity),
        subtotal: Number(it.subtotal || it.unitPrice * it.quantity),
      }));

      const cart: ShoppingCart = {
        id: data.id || 'cart-remote',
        items,
        totalItems: items.reduce((acc, i) => acc + i.quantity, 0),
        subtotal: Number(data.subtotalAmount || data.subtotal || 0),
      };
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      return cart;
    } catch {
      return getLocalCart();
    }
  },

  async addItem(productId: string, variantId?: string, quantity: number = 1): Promise<ShoppingCart> {
    try {
      const res = await apiFetch<ApiResponse<any>>('/cart/items', {
        method: 'POST',
        body: JSON.stringify({
          productId,
          variantId: variantId || null,
          quantity,
        }),
      });
      const data = res.data;
      return {
        id: data.id,
        items: (data.items || []).map((it: any) => ({
          id: it.id,
          productId: it.productId,
          productName: it.productName,
          productSlug: it.productSlug || '',
          productImage: it.productImage || '',
          variantId: it.variantId,
          variantName: it.variantName,
          sku: it.sku || '',
          unitPrice: Number(it.unitPrice),
          quantity: Number(it.quantity),
          subtotal: Number(it.subtotal),
        })),
        totalItems: (data.items || []).reduce((acc: number, i: any) => acc + i.quantity, 0),
        subtotal: Number(data.subtotalAmount || 0),
      };
    } catch {
      // Fallback local
      const cart = getLocalCart();
      let product: Product | null = null;
      try {
        product = await productService.getProductById(productId);
      } catch {
        // En caso de que se busque por id o slug
      }

      const existingIndex = cart.items.findIndex(
        (i) => i.productId === productId && (i.variantId === variantId || (!i.variantId && !variantId))
      );

      let unitPrice = product ? (product.discountPrice ?? product.basePrice) : 100;
      let variantName: string | undefined;
      let sku = product ? product.sku : 'SKU-ITEM';
      const productImage = product?.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800';

      if (product && variantId) {
        const variant = product.variants.find((v) => v.id === variantId);
        if (variant) {
          unitPrice += variant.priceModifier;
          variantName = variant.variantName;
          sku = variant.sku;
        }
      }

      if (existingIndex > -1) {
        cart.items[existingIndex].quantity += quantity;
        cart.items[existingIndex].subtotal =
          Math.round(cart.items[existingIndex].quantity * cart.items[existingIndex].unitPrice * 100) / 100;
      } else {
        cart.items.push({
          id: 'item-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
          productId,
          productName: product ? product.name : 'Producto',
          productSlug: product ? product.slug : '',
          productImage,
          variantId,
          variantName,
          sku,
          unitPrice,
          quantity,
          subtotal: Math.round(unitPrice * quantity * 100) / 100,
        });
      }

      saveLocalCart(cart);
      return cart;
    }
  },

  async updateQuantity(itemId: string, quantity: number): Promise<ShoppingCart> {
    if (quantity <= 0) {
      return this.removeItem(itemId);
    }
    try {
      const res = await apiFetch<ApiResponse<any>>(`/cart/items/${itemId}?quantity=${quantity}`, {
        method: 'PUT',
      });
      return {
        id: res.data.id,
        items: res.data.items,
        totalItems: res.data.items.reduce((acc: number, i: any) => acc + i.quantity, 0),
        subtotal: res.data.subtotalAmount,
      };
    } catch {
      const cart = getLocalCart();
      const item = cart.items.find((i) => i.id === itemId);
      if (item) {
        item.quantity = quantity;
        item.subtotal = Math.round(item.unitPrice * quantity * 100) / 100;
        saveLocalCart(cart);
      }
      return cart;
    }
  },

  async removeItem(itemId: string): Promise<ShoppingCart> {
    try {
      const res = await apiFetch<ApiResponse<any>>(`/cart/items/${itemId}`, {
        method: 'DELETE',
      });
      return {
        id: res.data.id,
        items: res.data.items,
        totalItems: res.data.items.reduce((acc: number, i: any) => acc + i.quantity, 0),
        subtotal: res.data.subtotalAmount,
      };
    } catch {
      const cart = getLocalCart();
      cart.items = cart.items.filter((i) => i.id !== itemId);
      saveLocalCart(cart);
      return cart;
    }
  },

  async clearCart(): Promise<void> {
    try {
      await apiFetch<ApiResponse<void>>('/cart/clear', {
        method: 'DELETE',
      });
    } catch {
      // ignore
    }
    const emptyCart: ShoppingCart = {
      id: 'cart-' + Math.random().toString(36).substring(2),
      items: [],
      totalItems: 0,
      subtotal: 0,
    };
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(emptyCart));
  },
};
