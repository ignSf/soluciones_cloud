import React from 'react';
import type { Brand, Category, ProductFilterState } from '../../types';
import { SlidersHorizontal, RotateCcw, Check } from 'lucide-react';

interface ProductFiltersProps {
  categories: Category[];
  brands: Brand[];
  filters: ProductFilterState;
  onFilterChange: (filters: Partial<ProductFilterState>) => void;
  onResetFilters: () => void;
  totalProducts: number;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  categories,
  brands,
  filters,
  onFilterChange,
  onResetFilters,
  totalProducts,
}) => {
  return (
    <aside className="filters-sidebar">
      {/* Cabecera del Panel de Filtros */}
      <div className="filters-header">
        <div className="filters-header-title">
          <SlidersHorizontal size={18} />
          <span>Filtros</span>
          <span className="products-count-badge">({totalProducts})</span>
        </div>
        <button
          type="button"
          className="btn-reset-filters"
          onClick={onResetFilters}
          title="Restablecer filtros"
        >
          <RotateCcw size={14} />
          <span>Limpiar</span>
        </button>
      </div>

      {/* Ordenamiento */}
      <div className="filter-group">
        <label className="filter-label">Ordenar por:</label>
        <select
          value={filters.sortBy}
          onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
          className="filter-select"
        >
          <option value="featured">Destacados primero</option>
          <option value="price-asc">Menor precio</option>
          <option value="price-desc">Mayor precio</option>
          <option value="rating">Mejor valorados</option>
          <option value="newest">Más recientes</option>
        </select>
      </div>

      {/* Filtro por Categorías */}
      <div className="filter-group">
        <label className="filter-label">Categoría</label>
        <div className="filter-options-list">
          <label className="filter-radio-label">
            <input
              type="radio"
              name="category"
              checked={!filters.categoryId}
              onChange={() => onFilterChange({ categoryId: undefined })}
            />
            <span>Todas las categorías</span>
          </label>
          {categories.map((cat) => (
            <label key={cat.id} className="filter-radio-label">
              <input
                type="radio"
                name="category"
                checked={filters.categoryId === cat.id}
                onChange={() => onFilterChange({ categoryId: cat.id })}
              />
              <span>{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Filtro por Marcas */}
      <div className="filter-group">
        <label className="filter-label">Marca</label>
        <div className="filter-options-list">
          <label className="filter-radio-label">
            <input
              type="radio"
              name="brand"
              checked={!filters.brandId}
              onChange={() => onFilterChange({ brandId: undefined })}
            />
            <span>Todas las marcas</span>
          </label>
          {brands.map((b) => (
            <label key={b.id} className="filter-radio-label">
              <input
                type="radio"
                name="brand"
                checked={filters.brandId === b.id}
                onChange={() => onFilterChange({ brandId: b.id })}
              />
              <span>{b.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Filtro por Rango de Precio */}
      <div className="filter-group">
        <label className="filter-label">Rango de Precio ($ USD)</label>
        <div className="price-inputs-row">
          <div className="price-input-box">
            <span className="currency-symbol">$</span>
            <input
              type="number"
              placeholder="Min"
              min={0}
              value={filters.minPrice ?? ''}
              onChange={(e) =>
                onFilterChange({
                  minPrice: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              className="price-num-input"
            />
          </div>
          <span className="price-separator">-</span>
          <div className="price-input-box">
            <span className="currency-symbol">$</span>
            <input
              type="number"
              placeholder="Max"
              min={0}
              value={filters.maxPrice ?? ''}
              onChange={(e) =>
                onFilterChange({
                  maxPrice: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              className="price-num-input"
            />
          </div>
        </div>
      </div>

      {/* Switches de Disponibilidad y Destacados */}
      <div className="filter-group toggles-group">
        <label className="filter-checkbox-label">
          <input
            type="checkbox"
            checked={!!filters.onlyInStock}
            onChange={(e) => onFilterChange({ onlyInStock: e.target.checked })}
          />
          <span className="custom-check-box">
            {filters.onlyInStock && <Check size={12} />}
          </span>
          <span>Solo en stock disponible</span>
        </label>

        <label className="filter-checkbox-label">
          <input
            type="checkbox"
            checked={!!filters.onlyFeatured}
            onChange={(e) => onFilterChange({ onlyFeatured: e.target.checked })}
          />
          <span className="custom-check-box">
            {filters.onlyFeatured && <Check size={12} />}
          </span>
          <span>Solo productos destacados</span>
        </label>
      </div>
    </aside>
  );
};
