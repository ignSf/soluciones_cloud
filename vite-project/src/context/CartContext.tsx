import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Coupon, ShoppingCart } from '../types';
import { cartService } from '../services/cartService';
import { couponService } from '../services/couponService';
import { useToast } from './ToastContext';

interface CartContextType {
  cart: ShoppingCart;
  itemsCount: number;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  total: number;
  appliedCoupon: Coupon | null;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (productId: string, variantId?: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 150;
const STANDARD_SHIPPING_FEE = 15;

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<ShoppingCart>({
    id: 'cart-init',
    items: [],
    totalItems: 0,
    subtotal: 0,
  });
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { showToast } = useToast();

  const refreshCart = useCallback(async () => {
    try {
      const c = await cartService.getCart();
      setCart(c);
    } catch {
      // Ignorar
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (productId: string, variantId?: string, quantity: number = 1) => {
    try {
      const updated = await cartService.addItem(productId, variantId, quantity);
      setCart(updated);
      showToast('Añadido al carrito', 'El producto se agregó a tu pedido', 'success');
    } catch (err: any) {
      showToast('Error', err.message || 'No se pudo agregar el producto', 'error');
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      const updated = await cartService.updateQuantity(itemId, quantity);
      setCart(updated);
    } catch (err: any) {
      showToast('Error', err.message || 'No se pudo actualizar la cantidad', 'error');
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      const updated = await cartService.removeItem(itemId);
      setCart(updated);
      showToast('Producto eliminado', 'El ítem se quitó del carrito', 'info');
    } catch (err: any) {
      showToast('Error', err.message || 'No se pudo eliminar el ítem', 'error');
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      setCart({
        id: 'cart-empty',
        items: [],
        totalItems: 0,
        subtotal: 0,
      });
      setAppliedCoupon(null);
    } catch (err: any) {
      showToast('Error', err.message || 'No se pudo vaciar el carrito', 'error');
    }
  };

  const applyCoupon = async (code: string): Promise<boolean> => {
    if (!code.trim()) {
      showToast('Cupón inválido', 'Por favor ingresa un código', 'warning');
      return false;
    }
    try {
      const validCoupon = await couponService.validateCoupon(code.trim(), cart.subtotal);
      setAppliedCoupon(validCoupon);
      showToast('¡Cupón Aplicado!', validCoupon.description || `Descuento activado: ${validCoupon.code}`, 'success');
      return true;
    } catch (err: any) {
      showToast('Cupón no válido', err.message || 'Código inválido o expirado', 'error');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Cupón removido', 'Se ha quitado el descuento del pedido', 'info');
  };

  // Cálculos de montos
  const subtotal = cart.subtotal;
  let discountAmount = 0;

  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discountAmount = Math.round((subtotal * appliedCoupon.discountValue) / 100 * 100) / 100;
    } else {
      discountAmount = appliedCoupon.discountValue;
    }
    if (appliedCoupon.maxDiscountAmount && discountAmount > appliedCoupon.maxDiscountAmount) {
      discountAmount = appliedCoupon.maxDiscountAmount;
    }
  }

  // Si tiene cupón ENVIOGRATIS o subtotal supera FREE_SHIPPING_THRESHOLD
  let shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : STANDARD_SHIPPING_FEE;
  if (appliedCoupon?.code === 'ENVIOGRATIS') {
    shippingFee = 0;
    discountAmount = 0; // El cupón cubrió el envío
  }

  const total = Math.max(0, Math.round((subtotal - discountAmount + shippingFee) * 100) / 100);

  return (
    <CartContext.Provider
      value={{
        cart,
        itemsCount: cart.totalItems,
        subtotal,
        discountAmount,
        shippingFee,
        total,
        appliedCoupon,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
