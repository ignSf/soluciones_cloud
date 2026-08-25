import React from 'react';
import type { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { PackageOpen, RotateCcw } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  onSelectProduct: (product: Product) => void;
  onResetFilters: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading,
  onSelectProduct,
  onResetFilters,
}) => {
  if (isLoading) {
    return (
      <div className="products-grid-skeleton">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="skeleton-card">
            <div className="skeleton-image" />
            <div className="skeleton-line title" />
            <div className="skeleton-line meta" />
            <div className="skeleton-line price" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="products-empty-state">
        <div className="empty-icon-box">
          <PackageOpen size={48} />
        </div>
        <h3 className="empty-title">No se encontraron productos</h3>
        <p className="empty-description">
          Intenta ajustar los términos de búsqueda o remover los filtros aplicados para ver más resultados.
        </p>
        <button
          type="button"
          className="btn-primary-md"
          onClick={onResetFilters}
        >
          <RotateCcw size={16} />
          <span>Restablecer Filtros</span>
        </button>
      </div>
    );
  }

  return (
    <div className="products-grid-container">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onSelect={onSelectProduct}
        />
      ))}
    </div>
  );
};
