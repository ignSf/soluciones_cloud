import React from 'react';
import { Sparkles, ArrowRight, Tag } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface HeroBannerProps {
  onExploreClick: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onExploreClick }) => {
  const { showToast } = useToast();

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard?.writeText(code);
    showToast('Cupón copiado', `Usa el código "${code}" en el carrito para obtener tu descuento.`, 'success');
  };

  return (
    <section className="hero-section">
      <div className="hero-glow-sphere glow-left" />
      <div className="hero-glow-sphere glow-right" />

      <div className="hero-content">
        <div className="hero-badge">
          <Sparkles size={16} className="sparkle-icon" />
          <span>Nueva Colección 2026 • Innovación & Estilo</span>
        </div>

        <h1 className="hero-headline">
          Tecnología de Vanguardia & <span className="text-gradient">Diseño Exclusivo</span>
        </h1>

        <p className="hero-description">
          Descubre los mejores smartphones 5G, auriculares con cancelación de ruido y prendas streetwear premium. Envíos a todo el país y garantía oficial.
        </p>

        <div className="hero-cta-group">
          <button
            type="button"
            className="btn-primary-lg btn-glow"
            onClick={onExploreClick}
          >
            <span>Explorar Catálogo</span>
            <ArrowRight size={18} />
          </button>

          <button
            type="button"
            className="hero-coupon-pill"
            onClick={() => handleCopyCoupon('BIENVENIDO10')}
            title="Haz clic para copiar cupón"
          >
            <Tag size={16} className="coupon-icon" />
            <span>Cupón 10% OFF: <strong>BIENVENIDO10</strong></span>
          </button>
        </div>

        <div className="hero-stats-row">
          <div className="stat-card">
            <span className="stat-value">100%</span>
            <span className="stat-label">Garantía Oficial</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-card">
            <span className="stat-value">&lt; 24h</span>
            <span className="stat-label">Despacho Rápido</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-card">
            <span className="stat-value">4.9 ★</span>
            <span className="stat-label">+2,500 Reseñas</span>
          </div>
        </div>
      </div>
    </section>
  );
};
