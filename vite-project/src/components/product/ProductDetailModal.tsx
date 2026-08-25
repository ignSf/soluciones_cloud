import React, { useState, useEffect } from 'react';
import type { Product, ProductVariant } from '../../types';
import { Modal } from '../common/Modal';
import { RatingStars } from '../common/RatingStars';
import { ProductReviews } from './ProductReviews';
import { useCart } from '../../context/CartContext';
import { ShoppingBag, Zap, CheckCircle, AlertTriangle, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onInstantBuy: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onInstantBuy,
}) => {
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');

  useEffect(() => {
    if (product) {
      if (product.variants && product.variants.length > 0) {
        setSelectedVariant(product.variants[0]);
      } else {
        setSelectedVariant(null);
      }
      setSelectedImageIndex(0);
      setQuantity(1);
      setActiveTab('desc');
    }
  }, [product]);

  if (!product) return null;

  const images = product.images && product.images.length > 0
    ? product.images
    : [
        {
          id: 'def-img',
          imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800',
          altText: product.name,
          isPrimary: true,
          displayOrder: 1,
        },
      ];

  const currentImage = images[selectedImageIndex] || images[0];

  const basePrice = product.discountPrice ?? product.basePrice;
  const variantModifier = selectedVariant ? selectedVariant.priceModifier : 0;
  const unitPrice = basePrice + variantModifier;
  const originalUnitPrice = product.basePrice + variantModifier;
  const hasDiscount = product.discountPrice !== undefined && product.discountPrice < product.basePrice;

  const currentStock = selectedVariant ? selectedVariant.stockQuantity : product.stockQuantity;
  const isOutOfStock = currentStock <= 0;

  const handleAddToCart = async () => {
    if (isOutOfStock) return;
    await addToCart(product.id, selectedVariant?.id, quantity);
    onClose();
  };

  const handleBuyNow = async () => {
    if (isOutOfStock) return;
    await addToCart(product.id, selectedVariant?.id, quantity);
    onClose();
    onInstantBuy();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="4xl">
      <div className="product-detail-layout">
        {/* Columna Izquierda: Galería de Imágenes */}
        <div className="product-detail-gallery">
          <div className="main-image-wrapper">
            <img
              src={currentImage.imageUrl}
              alt={currentImage.altText || product.name}
              className="main-product-image"
            />
            {hasDiscount && (
              <span className="gallery-discount-badge">
                OFERTA ESPECIAL
              </span>
            )}
          </div>

          {images.length > 1 && (
            <div className="thumbnails-row">
              {images.map((img, idx) => (
                <button
                  type="button"
                  key={img.id || idx}
                  className={`thumbnail-btn ${selectedImageIndex === idx ? 'active' : ''}`}
                  onClick={() => setSelectedImageIndex(idx)}
                >
                  <img src={img.imageUrl} alt={img.altText || 'Miniatura'} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Columna Derecha: Información y Opciones de Compra */}
        <div className="product-detail-info">
          {/* Marca, Categoría y SKU */}
          <div className="detail-meta-header">
            <span className="detail-brand-badge">{product.brand?.name || 'Marca Oficial'}</span>
            <span className="detail-sku-badge">SKU: {selectedVariant?.sku || product.sku}</span>
          </div>

          {/* Título */}
          <h2 className="detail-product-title">{product.name}</h2>

          {/* Rating */}
          <div className="detail-rating-box">
            <RatingStars rating={product.averageRating || 4.9} size={16} showNumber />
            <button
              type="button"
              className="link-btn-reviews"
              onClick={() => setActiveTab('reviews')}
            >
              Ver opiniones de clientes
            </button>
          </div>

          {/* Precio y Descuento */}
          <div className="detail-price-box">
            <div className="price-display">
              <span className="price-main">${unitPrice.toFixed(2)}</span>
              {hasDiscount && (
                <span className="price-struck">${originalUnitPrice.toFixed(2)}</span>
              )}
            </div>
            {hasDiscount && (
              <span className="save-badge">
                Ahorras ${(originalUnitPrice - unitPrice).toFixed(2)}
              </span>
            )}
          </div>

          {/* Selector de Variantes (si tiene) */}
          {product.variants && product.variants.length > 0 && (
            <div className="detail-variants-section">
              <label className="variants-label">
                Opciones disponibles: <strong>{selectedVariant?.variantName}</strong>
              </label>
              <div className="variants-buttons-grid">
                {product.variants.map((v) => {
                  const isSelected = selectedVariant?.id === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      className={`variant-option-btn ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedVariant(v)}
                    >
                      <span className="variant-btn-name">{v.variantName}</span>
                      {v.priceModifier > 0 && (
                        <span className="variant-btn-price">+${v.priceModifier}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Indicador de Stock */}
          <div className="detail-stock-row">
            {isOutOfStock ? (
              <span className="stock-indicator out">
                <AlertTriangle size={16} />
                <span>Producto temporalmente agotado</span>
              </span>
            ) : currentStock <= 5 ? (
              <span className="stock-indicator low">
                <AlertTriangle size={16} />
                <span>¡Quedan solo {currentStock} unidades en stock!</span>
              </span>
            ) : (
              <span className="stock-indicator in">
                <CheckCircle size={16} />
                <span>En stock ({currentStock} unidades disponibles)</span>
              </span>
            )}
          </div>

          {/* Selector de Cantidad y Botones de Compra */}
          <div className="detail-actions-section">
            <div className="quantity-stepper">
              <button
                type="button"
                className="step-btn"
                disabled={quantity <= 1 || isOutOfStock}
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <span className="step-count">{quantity}</span>
              <button
                type="button"
                className="step-btn"
                disabled={quantity >= currentStock || isOutOfStock}
                onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
              >
                +
              </button>
            </div>

            <div className="action-buttons-group">
              <button
                type="button"
                disabled={isOutOfStock}
                className="btn-add-cart-lg"
                onClick={handleAddToCart}
              >
                <ShoppingBag size={18} />
                <span>Agregar al Carrito</span>
              </button>

              <button
                type="button"
                disabled={isOutOfStock}
                className="btn-buy-now-lg btn-glow"
                onClick={handleBuyNow}
              >
                <Zap size={18} />
                <span>Comprar Ahora</span>
              </button>
            </div>
          </div>

          {/* Beneficios de Compra Rápidos */}
          <div className="detail-perks-list">
            <div className="perk-item">
              <Truck size={16} />
              <span>Envío gratis a partir de $150</span>
            </div>
            <div className="perk-item">
              <ShieldCheck size={16} />
              <span>Garantía oficial de 12 meses</span>
            </div>
            <div className="perk-item">
              <RotateCcw size={16} />
              <span>Devolución gratuita hasta 30 días</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pestañas Inferiores: Descripción, Especificaciones y Reseñas */}
      <div className="detail-tabs-section">
        <div className="tabs-header">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'desc' ? 'active' : ''}`}
            onClick={() => setActiveTab('desc')}
          >
            Descripción
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
            onClick={() => setActiveTab('specs')}
          >
            Especificaciones
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reseñas y Opiniones
          </button>
        </div>

        <div className="tab-content-panel">
          {activeTab === 'desc' && (
            <div className="desc-tab-content">
              <p>{product.description || product.shortDescription}</p>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="specs-tab-content">
              <table className="specs-table">
                <tbody>
                  <tr>
                    <th>Marca</th>
                    <td>{product.brand?.name || 'Estándar'}</td>
                  </tr>
                  <tr>
                    <th>SKU Base</th>
                    <td>{product.sku}</td>
                  </tr>
                  {product.weightKg && (
                    <tr>
                      <th>Peso</th>
                      <td>{product.weightKg} kg</td>
                    </tr>
                  )}
                  {selectedVariant && selectedVariant.attributes && (
                    Object.entries(selectedVariant.attributes).map(([k, v]) => (
                      <tr key={k}>
                        <th style={{ textTransform: 'capitalize' }}>{k}</th>
                        <td>{String(v)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'reviews' && (
            <ProductReviews productId={product.id} />
          )}
        </div>
      </div>
    </Modal>
  );
};
