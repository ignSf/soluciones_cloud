import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import {
  X,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Tag,
  Truck,
  Sparkles,
} from 'lucide-react';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToCheckout }) => {
  const {
    cart,
    itemsCount,
    subtotal,
    discountAmount,
    shippingFee,
    total,
    appliedCoupon,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  if (!isCartOpen) return null;

  const FREE_SHIPPING_GOAL = 150;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_GOAL - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_GOAL) * 100));

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    setIsApplyingCoupon(true);
    const success = await applyCoupon(couponCodeInput.trim());
    if (success) {
      setCouponCodeInput('');
    }
    setIsApplyingCoupon(false);
  };

  const handleQuickCoupon = async (code: string) => {
    setIsApplyingCoupon(true);
    await applyCoupon(code);
    setIsApplyingCoupon(false);
  };

  return (
    <div className="cart-drawer-overlay" onClick={() => setIsCartOpen(false)}>
      <div
        className="cart-drawer-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Cabecera del Drawer */}
        <div className="cart-drawer-header">
          <div className="cart-header-title">
            <ShoppingBag size={20} />
            <span>Mi Carrito</span>
            <span className="cart-items-pill">{itemsCount}</span>
          </div>

          <button
            type="button"
            className="cart-close-btn"
            onClick={() => setIsCartOpen(false)}
            aria-label="Cerrar carrito"
          >
            <X size={20} />
          </button>
        </div>

        {/* Barra de Progreso Envío Gratis */}
        <div className="shipping-progress-card">
          <div className="shipping-progress-text">
            <Truck size={16} className="truck-icon" />
            {remainingForFreeShipping > 0 ? (
              <span>
                Agrega <strong>${remainingForFreeShipping.toFixed(2)}</strong> más para obtener <strong>Envío Gratis</strong>
              </span>
            ) : (
              <span className="free-shipping-achieved">
                ¡Felicidades! Tienes <strong>Envío Gratis</strong> en esta compra 🎉
              </span>
            )}
          </div>
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Lista de Productos en el Carrito */}
        <div className="cart-items-scroll">
          {cart.items.length === 0 ? (
            <div className="empty-cart-view">
              <div className="empty-cart-icon-box">
                <ShoppingBag size={44} />
              </div>
              <h4>Tu carrito está vacío</h4>
              <p>Explora nuestro catálogo y encuentra los mejores productos al mejor precio.</p>
              <button
                type="button"
                className="btn-primary-md"
                onClick={() => setIsCartOpen(false)}
              >
                <span>Comenzar a Comprar</span>
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cart.items.map((item) => (
                <div key={item.id} className="cart-item-row">
                  <div className="cart-item-img-box">
                    <img
                      src={item.productImage || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800'}
                      alt={item.productName}
                    />
                  </div>

                  <div className="cart-item-info">
                    <div className="cart-item-header">
                      <h4 className="cart-item-title">{item.productName}</h4>
                      <button
                        type="button"
                        className="btn-remove-item"
                        onClick={() => removeFromCart(item.id)}
                        title="Eliminar producto"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {item.variantName && (
                      <span className="cart-item-variant">{item.variantName}</span>
                    )}

                    <div className="cart-item-pricing-row">
                      <div className="item-quantity-stepper">
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span className="qty-val">{item.quantity}</span>
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>

                      <div className="item-subtotal-box">
                        <span className="item-unit-price">${item.unitPrice.toFixed(2)} c/u</span>
                        <span className="item-subtotal-price">${item.subtotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer del Carrito con Cupones y Totales */}
        {cart.items.length > 0 && (
          <div className="cart-drawer-footer">
            {/* Input de Cupón */}
            <div className="cart-coupon-section">
              {appliedCoupon ? (
                <div className="applied-coupon-card">
                  <div className="coupon-info">
                    <Tag size={16} className="coupon-active-icon" />
                    <div>
                      <span className="applied-coupon-code">{appliedCoupon.code}</span>
                      <span className="applied-coupon-desc">{appliedCoupon.description}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-remove-coupon"
                    onClick={removeCoupon}
                    title="Remover cupón"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="coupon-input-form">
                  <input
                    type="text"
                    placeholder="Código de descuento..."
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value)}
                    className="coupon-input"
                  />
                  <button
                    type="submit"
                    disabled={isApplyingCoupon || !couponCodeInput.trim()}
                    className="btn-apply-coupon"
                  >
                    {isApplyingCoupon ? '...' : 'Aplicar'}
                  </button>
                </form>
              )}

              {/* Chips de cupones sugeridos */}
              {!appliedCoupon && (
                <div className="suggested-coupons-row">
                  <button
                    type="button"
                    className="suggested-chip"
                    onClick={() => handleQuickCoupon('BIENVENIDO10')}
                  >
                    <Sparkles size={12} />
                    <span>10% OFF: BIENVENIDO10</span>
                  </button>
                  <button
                    type="button"
                    className="suggested-chip"
                    onClick={() => handleQuickCoupon('ENVIOGRATIS')}
                  >
                    <Truck size={12} />
                    <span>Envío Gratis: ENVIOGRATIS</span>
                  </button>
                </div>
              )}
            </div>

            {/* Desglose de Costos */}
            <div className="cart-summary-breakdown">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="summary-row discount">
                  <span>Descuento cupón</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="summary-row">
                <span>Envío estimado</span>
                <span>{shippingFee === 0 ? <strong className="text-free">GRATIS</strong> : `$${shippingFee.toFixed(2)}`}</span>
              </div>

              <div className="summary-row total-row">
                <span>Total a pagar</span>
                <span className="total-amount">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Acciones Finales */}
            <div className="cart-actions-column">
              <button
                type="button"
                className="btn-checkout-primary btn-glow"
                onClick={() => {
                  setIsCartOpen(false);
                  onProceedToCheckout();
                }}
              >
                <span>Continuar al Pago</span>
                <ArrowRight size={18} />
              </button>

              <button
                type="button"
                className="btn-clear-cart"
                onClick={clearCart}
              >
                Vaciar carrito
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
