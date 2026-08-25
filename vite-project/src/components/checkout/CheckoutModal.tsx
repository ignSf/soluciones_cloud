import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { orderService } from '../../services/orderService';
import type { Order, OrderCreateRequest, PaymentMethod } from '../../types';
import {
  CreditCard,
  Truck,
  ShieldCheck,
  MapPin,
  Lock,
  ArrowRight,
  Wallet
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCompleted: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderCompleted,
}) => {
  const { cart, subtotal, discountAmount, shippingFee, total, appliedCoupon } = useCart();
  const { user, authUser } = useAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form states
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [streetAddress1, setStreetAddress1] = useState('');
  const [city, setCity] = useState('Buenos Aires');
  const [stateProvince, setStateProvince] = useState('CABA');
  const [postalCode, setPostalCode] = useState('C1043');
  const country = 'Argentina';

  const [shippingMethod, setShippingMethod] = useState('Envío Estándar a Domicilio');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');

  // Mock Card Details
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('123');

  useEffect(() => {
    if (user || authUser) {
      const u = user || authUser;
      if (u) {
        setRecipientName(`${u.firstName} ${u.lastName}`.trim());
        setRecipientPhone(user?.phone || '+54 9 11 8765-4321');
        setStreetAddress1('Av. Corrientes 1234, Piso 4B');
      }
    }
  }, [user, authUser]);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!recipientName.trim() || !streetAddress1.trim() || !city.trim() || !recipientPhone.trim()) {
        showToast('Campos requeridos', 'Por favor completa todos los datos de envío', 'warning');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      setIsProcessing(true);

      const request: OrderCreateRequest = {
        shippingAddress: {
          recipientName: recipientName.trim(),
          recipientPhone: recipientPhone.trim(),
          streetAddress1: streetAddress1.trim(),
          city: city.trim(),
          stateProvince: stateProvince.trim(),
          postalCode: postalCode.trim(),
          country: country.trim(),
        },
        billingAddress: {
          recipientName: recipientName.trim(),
          recipientPhone: recipientPhone.trim(),
          streetAddress1: streetAddress1.trim(),
          city: city.trim(),
          stateProvince: stateProvince.trim(),
          postalCode: postalCode.trim(),
          country: country.trim(),
        },
        couponCode: appliedCoupon?.code,
        paymentMethod,
        shippingMethod,
      };

      const newOrder = await orderService.createOrder(request);
      showToast('¡Pedido Confirmado!', `Tu orden #${newOrder.orderNumber} ha sido generada con éxito`, 'success');
      onClose();
      onOrderCompleted(newOrder);
    } catch (err: any) {
      showToast('Error al procesar pedido', err.message || 'No se pudo completar la compra', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Finalizar Compra" maxWidth="2xl">
      <div className="checkout-modal-layout">
        {/* Pasos / Indicador de Progreso */}
        <div className="checkout-stepper-header">
          <div className={`step-node ${step >= 1 ? 'active' : ''}`}>
            <span className="step-num">1</span>
            <span className="step-title">Envío</span>
          </div>
          <div className={`step-line ${step >= 2 ? 'active' : ''}`} />
          <div className={`step-node ${step >= 2 ? 'active' : ''}`}>
            <span className="step-num">2</span>
            <span className="step-title">Método & Pago</span>
          </div>
          <div className={`step-line ${step >= 3 ? 'active' : ''}`} />
          <div className={`step-node ${step >= 3 ? 'active' : ''}`}>
            <span className="step-num">3</span>
            <span className="step-title">Confirmación</span>
          </div>
        </div>

        {/* Paso 1: Dirección de Envío */}
        {step === 1 && (
          <form onSubmit={handleNextStep} className="checkout-step-form">
            <h3 className="section-title">
              <MapPin size={18} />
              <span>Dirección y Destinatario de Entrega</span>
            </h3>

            <div className="form-grid-2">
              <div className="form-field-group">
                <label className="field-label">Nombre y Apellido Destinatario *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Juan Pérez"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="text-input"
                />
              </div>

              <div className="form-field-group">
                <label className="field-label">Teléfono de Contacto *</label>
                <input
                  type="tel"
                  required
                  placeholder="+54 9 11 ..."
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  className="text-input"
                />
              </div>
            </div>

            <div className="form-field-group">
              <label className="field-label">Calle y Altura (o Piso/Depto) *</label>
              <input
                type="text"
                required
                placeholder="Av. Corrientes 1234, 4° B"
                value={streetAddress1}
                onChange={(e) => setStreetAddress1(e.target.value)}
                className="text-input"
              />
            </div>

            <div className="form-grid-3">
              <div className="form-field-group">
                <label className="field-label">Ciudad *</label>
                <input
                  type="text"
                  required
                  placeholder="Buenos Aires"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="text-input"
                />
              </div>

              <div className="form-field-group">
                <label className="field-label">Provincia/Estado *</label>
                <input
                  type="text"
                  required
                  placeholder="CABA"
                  value={stateProvince}
                  onChange={(e) => setStateProvince(e.target.value)}
                  className="text-input"
                />
              </div>

              <div className="form-field-group">
                <label className="field-label">Código Postal *</label>
                <input
                  type="text"
                  required
                  placeholder="C1043"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="text-input"
                />
              </div>
            </div>

            <div className="checkout-actions-row">
              <button
                type="button"
                className="btn-outline-md"
                onClick={onClose}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-primary-md btn-glow"
              >
                <span>Continuar a Pago</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </form>
        )}

        {/* Paso 2: Método de Envío y Forma de Pago */}
        {step === 2 && (
          <form onSubmit={handleNextStep} className="checkout-step-form">
            <h3 className="section-title">
              <Truck size={18} />
              <span>Opciones de Envío</span>
            </h3>

            <div className="shipping-options-list">
              <label className={`option-card ${shippingMethod.includes('Estándar') ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="shippingOption"
                  checked={shippingMethod.includes('Estándar')}
                  onChange={() => setShippingMethod('Envío Estándar a Domicilio')}
                />
                <div className="option-info">
                  <span className="option-name">Envío Estándar a Domicilio</span>
                  <span className="option-desc">Entrega en 3 a 5 días hábiles</span>
                </div>
                <span className="option-price">{shippingFee === 0 ? 'GRATIS' : `$${shippingFee.toFixed(2)}`}</span>
              </label>

              <label className={`option-card ${shippingMethod.includes('Express') ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="shippingOption"
                  checked={shippingMethod.includes('Express')}
                  onChange={() => setShippingMethod('Envío Express Prioritario 24h')}
                />
                <div className="option-info">
                  <span className="option-name">Envío Express Prioritario 24h</span>
                  <span className="option-desc">Entrega garantizada en el siguiente día hábil</span>
                </div>
                <span className="option-price">$25.00</span>
              </label>
            </div>

            <h3 className="section-title mt-4">
              <CreditCard size={18} />
              <span>Método de Pago</span>
            </h3>

            <div className="payment-methods-grid">
              <button
                type="button"
                className={`payment-method-card ${paymentMethod === 'credit_card' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('credit_card')}
              >
                <CreditCard size={20} />
                <span>Tarjeta de Crédito / Débito</span>
              </button>

              <button
                type="button"
                className={`payment-method-card ${paymentMethod === 'paypal' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('paypal')}
              >
                <Wallet size={20} />
                <span>PayPal Express</span>
              </button>

              <button
                type="button"
                className={`payment-method-card ${paymentMethod === 'bank_transfer' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('bank_transfer')}
              >
                <ShieldCheck size={20} />
                <span>Transferencia Bancaria</span>
              </button>

              <button
                type="button"
                className={`payment-method-card ${paymentMethod === 'cash_on_delivery' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('cash_on_delivery')}
              >
                <Truck size={20} />
                <span>Pago contra Entrega</span>
              </button>
            </div>

            {/* Si eligió tarjeta de crédito */}
            {paymentMethod === 'credit_card' && (
              <div className="credit-card-mock-box">
                <div className="form-field-group">
                  <label className="field-label">Número de Tarjeta</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="text-input font-mono"
                  />
                </div>
                <div className="form-grid-2">
                  <div className="form-field-group">
                    <label className="field-label">Vencimiento</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="text-input"
                    />
                  </div>
                  <div className="form-field-group">
                    <label className="field-label">CVV / Código</label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="text-input"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="checkout-actions-row">
              <button
                type="button"
                className="btn-outline-md"
                onClick={() => setStep(1)}
              >
                Volver
              </button>
              <button
                type="submit"
                className="btn-primary-md btn-glow"
              >
                <span>Revisar Pedido</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </form>
        )}

        {/* Paso 3: Revisión Final y Confirmación */}
        {step === 3 && (
          <div className="checkout-step-form">
            <h3 className="section-title">
              <ShieldCheck size={18} />
              <span>Resumen Final de tu Pedido</span>
            </h3>

            <div className="review-order-box">
              <div className="review-section">
                <h4>Destinatario & Dirección:</h4>
                <p><strong>{recipientName}</strong> ({recipientPhone})</p>
                <p>{streetAddress1}, {city}, {stateProvince} ({postalCode}) - {country}</p>
              </div>

              <div className="review-section">
                <h4>Método de Entrega:</h4>
                <p>{shippingMethod}</p>
              </div>

              <div className="review-section">
                <h4>Forma de Pago:</h4>
                <p style={{ textTransform: 'capitalize' }}>
                  {paymentMethod.replace('_', ' ')}
                </p>
              </div>

              <div className="review-items-list">
                <h4>Artículos ({cart.items.length}):</h4>
                {cart.items.map((it) => (
                  <div key={it.id} className="review-item-mini">
                    <span>{it.quantity}x {it.productName} {it.variantName ? `(${it.variantName})` : ''}</span>
                    <span>${it.subtotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="review-totals-breakdown">
                <div className="row">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="row text-discount">
                    <span>Descuento cupón ({appliedCoupon?.code})</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="row">
                  <span>Envío</span>
                  <span>{shippingFee === 0 ? 'GRATIS' : `$${shippingFee.toFixed(2)}`}</span>
                </div>
                <div className="row total">
                  <span>Total Final</span>
                  <span className="amount">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="checkout-actions-row">
              <button
                type="button"
                disabled={isProcessing}
                className="btn-outline-md"
                onClick={() => setStep(2)}
              >
                Volver
              </button>
              <button
                type="button"
                disabled={isProcessing}
                className="btn-primary-lg btn-glow"
                onClick={handlePlaceOrder}
              >
                <Lock size={18} />
                <span>{isProcessing ? 'Procesando Pago...' : `Confirmar y Pagar $${total.toFixed(2)}`}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
