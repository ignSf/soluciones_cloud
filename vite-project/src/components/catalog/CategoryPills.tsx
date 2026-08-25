import React from 'react';
import type { Category } from '../../types';
import { Layers, Smartphone, Headphones, Shirt, Home, Trophy, Sparkles } from 'lucide-react';

interface CategoryPillsProps {
  categories: Category[];
  selectedCategoryId: string | undefined;
  onSelectCategory: (categoryId: string | undefined) => void;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
}) => {
  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'electronica':
        return <Smartphone size={16} />;
      case 'audio-y-sonido':
        return <Headphones size={16} />;
      case 'ropa-y-calzado':
        return <Shirt size={16} />;
      case 'hogar-y-confort':
        return <Home size={16} />;
      case 'deportes-y-outdoor':
        return <Trophy size={16} />;
      default:
        return <Sparkles size={16} />;
    }
  };

  return (
    <div className="category-pills-wrapper">
      <div className="category-pills-scroll">
        <button
          type="button"
          className={`category-pill ${!selectedCategoryId ? 'active' : ''}`}
          onClick={() => onSelectCategory(undefined)}
        >
          <Layers size={16} />
          <span>Todos los Productos</span>
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`category-pill ${selectedCategoryId === cat.id ? 'active' : ''}`}
            onClick={() => onSelectCategory(cat.id === selectedCategoryId ? undefined : cat.id)}
          >
            {getCategoryIcon(cat.slug)}
            <span>{cat.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
