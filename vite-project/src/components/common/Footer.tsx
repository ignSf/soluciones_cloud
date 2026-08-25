import React from 'react';
import { ShoppingBag, ShieldCheck, Truck, RotateCcw, Headphones, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="footer-wrapper">
      {/* Sección de Beneficios / Ventajas */}
      <div className="footer-features-grid">
        <div className="feature-item">
          <div className="feature-icon-box">
            <Truck size={24} />
          </div>
          <div className="feature-text">
            <h4>Envío Rápido & Seguro</h4>
            <p>Gratis en compras superiores a $150</p>
          </div>
        </div>

        <div className="feature-item">
          <div className="feature-icon-box">
            <ShieldCheck size={24} />
          </div>
          <div className="feature-text">
            <h4>Pagos 100% Protegidos</h4>
            <p>Cifrado SSL y pasarelas certificadas</p>
          </div>
        </div>

        <div className="feature-item">
          <div className="feature-icon-box">
            <RotateCcw size={24} />
          </div>
          <div className="feature-text">
            <h4>Garantía Oficial</h4>
            <p>30 días de devolución sin cargo</p>
          </div>
        </div>

        <div className="feature-item">
          <div className="feature-icon-box">
            <Headphones size={24} />
          </div>
          <div className="feature-text">
            <h4>Soporte Especializado</h4>
            <p>Atención personalizada 24/7</p>
          </div>
        </div>
      </div>

      {/* Contenido Principal del Footer */}
      <div className="footer-main-content">
        <div className="footer-col brand-col">
          <div className="footer-brand">
            <ShoppingBag size={24} className="brand-icon" />
            <span className="brand-title">NOVA<span className="brand-highlight">STORE</span></span>
          </div>
          <p className="footer-description">
            Tu destino para la mejor tecnología de última generación, indumentaria urbana y equipamiento de alta calidad.
          </p>
          <div className="footer-coupons-badge">
            <span>🎟️ Cupones activos:</span>
            <code>BIENVENIDO10</code>
            <code>ENVIOGRATIS</code>
          </div>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Categorías Populares</h4>
          <ul className="footer-links">
            <li><a href="#electronica">Smartphones & 5G</a></li>
            <li><a href="#audio">Audio & Auriculares</a></li>
            <li><a href="#ropa">Indumentaria Urbana</a></li>
            <li><a href="#deportes">Smartwatches & Fitness</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Soporte & Ayuda</h4>
          <ul className="footer-links">
            <li><a href="#seguimiento">Seguimiento de Envío</a></li>
            <li><a href="#politicas">Políticas de Devolución</a></li>
            <li><a href="#terminos">Términos de Servicio</a></li>
            <li><a href="#faq">Preguntas Frecuentes</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Métodos de Pago</h4>
          <p className="footer-subtext">Aceptamos todas las tarjetas, billeteras y transferencias:</p>
          <div className="payment-badges-row">
            <span className="payment-badge">VISA</span>
            <span className="payment-badge">Mastercard</span>
            <span className="payment-badge">PayPal</span>
            <span className="payment-badge">Stripe</span>
          </div>
        </div>
      </div>

      {/* Barra Inferior */}
      <div className="footer-bottom-bar">
        <p className="copyright-text">
          © {new Date().getFullYear()} NovaStore E-Commerce. Todos los derechos reservados.
        </p>
        <p className="creator-text">
          Diseñado con <Heart size={14} className="heart-icon" /> para una experiencia premium.
        </p>
      </div>
    </footer>
  );
};
