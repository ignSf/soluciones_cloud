import React from 'react';
import { Modal } from '../common/Modal';
import type { Order } from '../../types';
import { CheckCircle2, PackageCheck, Truck, ShoppingBag } from 'lucide-react';

interface OrderSuccessModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onViewOrders: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  isOpen,
  onClose,
  onViewOrders,
}) => {
  if (!order) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
      <div className="order-success-layout">
        <div className="success-icon-wrapper">
          <CheckCircle2 size={54} className="success-icon" />
        </div>

        <h2 className="success-title">¡Pedido Realizado con Éxito!</h2>
        <p className="success-subtitle">
          Hemos recibido tu orden y ya nos encontramos preparando tus productos para el despacho.
        </p>

        {/* Tarjeta de Resumen de Pedido */}
        <div className="success-order-card">
          <div className="success-card-header">
            <div>
              <span className="label">Número de Pedido:</span>
              <span className="order-num-text">{order.orderNumber}</span>
            </div>
            {order.trackingNumber && (
              <div className="tracking-badge">
                <Truck size={14} />
                <span>Tracking: {order.trackingNumber}</span>
              </div>
            )}
          </div>

          <div className="success-items-list">
            {order.items.map((item, idx) => (
              <div key={idx} className="success-item-row">
                <span className="item-qty">{item.quantity}x</span>
                <span className="item-name">{item.productName} {item.variantName ? `(${item.variantName})` : ''}</span>
                <span className="item-price">${item.totalPrice.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="success-totals-box">
            <div className="row">
              <span>Total Pagado:</span>
              <span className="total-val">${order.totalAmount.toFixed(2)}</span>
            </div>
            <div className="row sub">
              <span>Método:</span>
              <span style={{ textTransform: 'capitalize' }}>{order.paymentMethod.replace('_', ' ')} (Aprobado)</span>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="success-actions-row">
          <button
            type="button"
            className="btn-outline-md"
            onClick={() => {
              onClose();
              onViewOrders();
            }}
          >
            <PackageCheck size={18} />
            <span>Ver en Mis Pedidos</span>
          </button>

          <button
            type="button"
            className="btn-primary-md btn-glow"
            onClick={onClose}
          >
            <ShoppingBag size={18} />
            <span>Seguir Comprando</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
