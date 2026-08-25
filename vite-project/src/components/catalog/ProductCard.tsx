import React from 'react';
import type { Product } from '../../types';
import { RatingStars } from '../common/RatingStars';
import { ShoppingBag, Eye, CheckCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { addToCart } = useCart();

  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.imageUrl ||
    product.images?.[0]?.imageUrl ||
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800';

  const hasDiscount = product.discountPrice !== undefined && product.discountPrice < product.basePrice;
  const discountPercent = hasDiscount
    ? Math.round(((product.basePrice - (product.discountPrice ?? product.basePrice)) / product.basePrice) * 100)
    : 0;

  const currentPrice = product.discountPrice ?? product.basePrice;
  const isOutOfStock = product.stockQuantity <= 0;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 5;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    // Si tiene variantes, abrimos el modal para que elija variante
    if (product.variants && product.variants.length > 0) {
      onSelect(product);
    } else {
      addToCart(product.id);
    }
  };

  return (
    <div className="product-card" onClick={() => onSelect(product)}>
      {/* Contenedor de Imagen y Badges */}
      <div className="product-image-container">
        <img
          src={primaryImage}
          alt={product.name}
          className="product-card-image"
          loading="lazy"
        />

        {/* Badges superiores */}
        <div className="card-top-badges">
          {hasDiscount && (
            <span className="discount-tag">-{discountPercent}%</span>
          )}
          {product.isFeatured && (
            <span className="featured-tag">Destacado</span>
          )}
        </div>

        {/* Botón flotante Vista Rápida */}
        <div className="card-overlay-actions">
          <button
            type="button"
            className="quick-view-btn"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            title="Vista rápida"
          >
            <Eye size={18} />
            <span>Ver detalles</span>
          </button>
        </div>
      </div>

      {/* Contenido de la Tarjeta */}
      <div className="product-card-info">
        {/* Marca y Categoría */}
        <div className="product-meta-row">
          <span className="product-brand-tag">{product.brand?.name || 'General'}</span>
          {isOutOfStock ? (
            <span className="stock-badge out-of-stock">Agotado</span>
          ) : isLowStock ? (
            <span className="stock-badge low-stock">¡Últimas {product.stockQuantity}!</span>
          ) : (
            <span className="stock-badge in-stock">
              <CheckCircle size={12} />
              <span>En stock</span>
            </span>
          )}
        </div>

        {/* Nombre del Producto */}
        <h3 className="product-card-title" title={product.name}>
          {product.name}
        </h3>

        {/* Calificación con estrellas */}
        <div className="product-rating-row">
          <RatingStars
            rating={product.averageRating || 4.8}
            size={14}
            showNumber
            reviewCount={product.averageRating ? 12 : undefined}
          />
        </div>

        {/* Resumen de Variantes si existen */}
        {product.variants && product.variants.length > 0 && (
          <div className="product-variants-pill">
            <span>{product.variants.length} variantes disponibles</span>
          </div>
        )}

        {/* Fila Inferior: Precios y Botón de Carrito */}
        <div className="product-card-footer">
          <div className="price-box">
            <span className="current-price">${currentPrice.toFixed(2)}</span>
            {hasDiscount && (
              <span className="old-price">${product.basePrice.toFixed(2)}</span>
            )}
          </div>

          <button
            type="button"
            disabled={isOutOfStock}
            className={`btn-add-cart ${isOutOfStock ? 'disabled' : ''}`}
            onClick={handleQuickAdd}
            aria-label="Agregar al carrito"
            title={product.variants?.length ? 'Ver opciones' : 'Agregar al carrito'}
          >
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
