import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import type { Order, OrderStatus } from '../../types';
import { useToast } from '../../context/ToastContext';
import {
  User as UserIcon,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
  XCircle,
  Copy,
  MapPin
} from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'profile' | 'orders';
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'profile',
}) => {
  const { user, authUser, logout } = useAuth();
  const { showToast } = useToast();
  const [tab, setTab] = useState<'profile' | 'orders'>(initialTab);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (isOpen && tab === 'orders') {
      fetchOrders();
    }
  }, [isOpen, tab]);

  const fetchOrders = async () => {
    try {
      setIsLoadingOrders(true);
      const list = await orderService.getMyOrders();
      setOrders(list);
    } catch {
      setOrders([]);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handleCopyTracking = (tracking: string) => {
    navigator.clipboard?.writeText(tracking);
    showToast('Copiado', `Código de seguimiento ${tracking} copiado al portapapeles.`, 'info');
  };

  const renderStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="order-badge delivered">
            <CheckCircle2 size={12} />
            <span>Entregado</span>
          </span>
        );
      case 'shipped':
        return (
          <span className="order-badge shipped">
            <Truck size={12} />
            <span>Enviado</span>
          </span>
        );
      case 'processing':
        return (
          <span className="order-badge processing">
            <Clock size={12} />
            <span>En preparación</span>
          </span>
        );
      case 'pending':
        return (
          <span className="order-badge pending">
            <AlertCircle size={12} />
            <span>Pendiente de pago</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="order-badge cancelled">
            <XCircle size={12} />
            <span>Cancelado</span>
          </span>
        );
      default:
        return <span className="order-badge">{status}</span>;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Mi Cuenta" maxWidth="2xl">
      <div className="profile-modal-layout">
        {/* Pestañas */}
        <div className="profile-tabs-nav">
          <button
            type="button"
            className={`profile-tab-btn ${tab === 'profile' ? 'active' : ''}`}
            onClick={() => setTab('profile')}
          >
            <UserIcon size={16} />
            <span>Datos Personales</span>
          </button>

          <button
            type="button"
            className={`profile-tab-btn ${tab === 'orders' ? 'active' : ''}`}
            onClick={() => setTab('orders')}
          >
            <Package size={16} />
            <span>Historial de Pedidos</span>
          </button>
        </div>

        {/* Pestaña: Perfil */}
        {tab === 'profile' && (
          <div className="profile-content-box">
            <div className="profile-header-card">
              <div className="profile-big-avatar">
                {(authUser?.firstName || user?.firstName || 'U')[0].toUpperCase()}
              </div>
              <div className="profile-header-info">
                <h3>
                  {user?.firstName || authUser?.firstName} {user?.lastName || authUser?.lastName}
                </h3>
                <span className="profile-email">{user?.email || authUser?.email}</span>
                <span className="profile-role-pill">
                  Rol: {authUser?.role === 'admin' ? 'Administrador' : 'Cliente'}
                </span>
              </div>
            </div>

            <div className="profile-details-grid">
              <div className="detail-item">
                <span className="label">ID de Usuario:</span>
                <span className="value font-mono text-sm">{user?.id || authUser?.userId}</span>
              </div>
              <div className="detail-item">
                <span className="label">Teléfono:</span>
                <span className="value">{user?.phone || '+54 9 11 8765-4321'}</span>
              </div>
              <div className="detail-item">
                <span className="label">Estado de la cuenta:</span>
                <span className="value text-success font-semibold">Activa & Verificada</span>
              </div>
            </div>

            <div className="profile-address-card">
              <div className="address-card-header">
                <MapPin size={16} />
                <h4>Dirección Predeterminada de Envío</h4>
              </div>
              <p>Av. Corrientes 1234, Piso 4B</p>
              <p>Buenos Aires, CABA (C1043) - Argentina</p>
            </div>

            <div className="profile-actions-footer">
              <button
                type="button"
                className="btn-outline-md text-danger"
                onClick={() => {
                  logout();
                  onClose();
                }}
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        )}

        {/* Pestaña: Pedidos */}
        {tab === 'orders' && (
          <div className="orders-history-content">
            {isLoadingOrders ? (
              <div className="orders-loading">Cargando tus pedidos...</div>
            ) : orders.length === 0 ? (
              <div className="no-orders-box">
                <Package size={40} />
                <p>Aún no has realizado pedidos en la tienda.</p>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map((ord) => (
                  <div key={ord.id} className="order-history-card">
                    <div className="order-card-top">
                      <div>
                        <span className="order-number-title">Pedido {ord.orderNumber}</span>
                        <span className="order-date-text">
                          {new Date(ord.createdAt).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <div>{renderStatusBadge(ord.status)}</div>
                    </div>

                    {ord.trackingNumber && (
                      <div className="order-tracking-strip">
                        <Truck size={14} />
                        <span>Tracking: <strong>{ord.trackingNumber}</strong></span>
                        <button
                          type="button"
                          className="btn-copy-mini"
                          onClick={() => handleCopyTracking(ord.trackingNumber!)}
                          title="Copiar código"
                        >
                          <Copy size={12} />
                        </button>
                      </div>
                    )}

                    <div className="order-items-preview">
                      {ord.items.map((item, idx) => (
                        <div key={idx} className="order-item-mini-row">
                          <span>
                            {item.quantity}x {item.productName} {item.variantName ? `(${item.variantName})` : ''}
                          </span>
                          <span>${item.totalPrice.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="order-card-bottom">
                      <span className="order-payment-method">
                        Pago: {ord.paymentMethod.replace('_', ' ')}
                      </span>
                      <span className="order-total-price">
                        Total: <strong>${ord.totalAmount.toFixed(2)}</strong>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
