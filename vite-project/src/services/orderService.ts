import type { ApiResponse, Order, OrderCreateRequest, OrderStatus } from '../types';
import { apiFetch } from './api';
import { cartService } from './cartService';

const ORDERS_STORAGE_KEY = 'demo_orders_store';

const SEED_ORDERS: Order[] = [
  {
    id: '50000000-0000-0000-0000-000000000001',
    orderNumber: 'ORD-2026-00001',
    userId: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    status: 'processing',
    subtotalAmount: 799.99,
    discountAmount: 80.00,
    shippingAmount: 15.00,
    taxAmount: 0.00,
    totalAmount: 734.99,
    shippingAddress: {
      recipientName: 'Juan Pérez',
      streetAddress1: 'Av. Corrientes 1234, Piso 4B',
      city: 'Buenos Aires',
      stateProvince: 'CABA',
      postalCode: 'C1043',
      country: 'Argentina',
      recipientPhone: '+5491187654321',
    },
    billingAddress: {
      recipientName: 'Juan Pérez',
      streetAddress1: 'Av. Corrientes 1234, Piso 4B',
      city: 'Buenos Aires',
      stateProvince: 'CABA',
      postalCode: 'C1043',
      country: 'Argentina',
      recipientPhone: '+5491187654321',
    },
    shippingMethod: 'Envío Express a Domicilio',
    trackingNumber: 'TRK-ARG-987654321',
    paymentMethod: 'credit_card',
    paymentStatus: 'completed',
    items: [
      {
        id: 'ord-item-1',
        productId: '10000000-0000-0000-0000-000000000001',
        variantId: '20000000-0000-0000-0000-000000000001',
        productName: 'Smartphone Titan Pro 5G',
        variantName: '128GB / Negro Phantom',
        sku: 'TITAN-5G-128-BLK',
        unitPrice: 799.99,
        quantity: 1,
        totalPrice: 799.99,
      },
    ],
    createdAt: '2026-08-20T14:30:00Z',
  },
];

function getLocalOrders(): Order[] {
  const data = localStorage.getItem(ORDERS_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(SEED_ORDERS));
    return SEED_ORDERS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return SEED_ORDERS;
  }
}

function saveLocalOrders(orders: Order[]): void {
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
}

export const orderService = {
  async createOrder(request: OrderCreateRequest): Promise<Order> {
    try {
      const res = await apiFetch<ApiResponse<Order>>('/orders/checkout', {
        method: 'POST',
        body: JSON.stringify(request),
      });
      await cartService.clearCart();
      return res.data;
    } catch {
      // Mock Order creation
      const cart = await cartService.getCart();
      if (cart.items.length === 0) {
        throw new Error('El carrito está vacío');
      }

      const randomDigits = Math.floor(10000 + Math.random() * 90000);
      const orderNumber = `ORD-2026-${randomDigits}`;
      const trackingNumber = `TRK-ARG-${Date.now().toString().slice(-8)}`;

      let discountAmount = 0;
      if (request.couponCode) {
        if (request.couponCode.toUpperCase() === 'BIENVENIDO10') {
          discountAmount = Math.round(cart.subtotal * 0.1 * 100) / 100;
        } else if (request.couponCode.toUpperCase() === 'ENVIOGRATIS') {
          discountAmount = 15.0;
        }
      }

      const shippingAmount = discountAmount >= 15 && request.couponCode?.toUpperCase() === 'ENVIOGRATIS' ? 0 : 15.0;
      const totalAmount = Math.max(0, Math.round((cart.subtotal - discountAmount + shippingAmount) * 100) / 100);

      const cachedUser = localStorage.getItem('auth_user');
      const userId = cachedUser ? JSON.parse(cachedUser).userId : 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22';

      const newOrder: Order = {
        id: 'ord-' + Date.now(),
        orderNumber,
        userId,
        status: 'processing',
        subtotalAmount: cart.subtotal,
        discountAmount,
        shippingAmount,
        taxAmount: 0,
        totalAmount,
        shippingAddress: request.shippingAddress,
        billingAddress: request.billingAddress || request.shippingAddress,
        shippingMethod: request.shippingMethod || 'Envío Estándar',
        trackingNumber,
        paymentMethod: request.paymentMethod,
        paymentStatus: 'completed',
        items: cart.items.map((it) => ({
          id: 'ord-it-' + Math.random().toString(36).substring(2),
          productId: it.productId,
          variantId: it.variantId,
          productName: it.productName,
          variantName: it.variantName,
          sku: it.sku,
          unitPrice: it.unitPrice,
          quantity: it.quantity,
          totalPrice: it.subtotal,
        })),
        createdAt: new Date().toISOString(),
      };

      const orders = getLocalOrders();
      orders.unshift(newOrder);
      saveLocalOrders(orders);

      await cartService.clearCart();
      return newOrder;
    }
  },

  async getMyOrders(): Promise<Order[]> {
    try {
      const res = await apiFetch<ApiResponse<any>>('/orders/my-orders');
      return res.data.content || res.data || [];
    } catch {
      return getLocalOrders();
    }
  },

  async getOrderById(orderId: string): Promise<Order> {
    try {
      const res = await apiFetch<ApiResponse<Order>>(`/orders/${orderId}`);
      return res.data;
    } catch {
      const found = getLocalOrders().find((o) => o.id === orderId);
      if (found) return found;
      throw new Error('Pedido no encontrado');
    }
  },

  async getOrderByNumber(orderNumber: string): Promise<Order> {
    try {
      const res = await apiFetch<ApiResponse<Order>>(`/orders/number/${orderNumber}`);
      return res.data;
    } catch {
      const found = getLocalOrders().find((o) => o.orderNumber === orderNumber);
      if (found) return found;
      throw new Error('Pedido no encontrado');
    }
  },

  async getAllOrders(status?: OrderStatus): Promise<Order[]> {
    try {
      const url = status ? `/orders/admin/all?status=${status}` : '/orders/admin/all';
      const res = await apiFetch<ApiResponse<any>>(url);
      return res.data.content || res.data || [];
    } catch {
      let orders = getLocalOrders();
      if (status) {
        orders = orders.filter((o) => o.status === status);
      }
      return orders;
    }
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    try {
      const res = await apiFetch<ApiResponse<Order>>(`/orders/admin/${orderId}/status?status=${status}`, {
        method: 'PATCH',
      });
      return res.data;
    } catch {
      const orders = getLocalOrders();
      const idx = orders.findIndex((o) => o.id === orderId);
      if (idx === -1) throw new Error('Pedido no encontrado');
      orders[idx].status = status;
      saveLocalOrders(orders);
      return orders[idx];
    }
  },
};
