import React from 'react';
import type { Category } from '../types';

interface CategoryFiltersProps {
  activeCategory: string;
  onCategoryClick: (label: string) => void;
  categories: Category[];
}

const CategoryFilters: React.FC<CategoryFiltersProps> = ({ activeCategory, onCategoryClick, categories }) => {
  return (
    <div className="flex items-center space-x-2 overflow-x-auto pb-4 -mx-8 px-8" style={{ scrollbarWidth: 'none' }}>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onCategoryClick(cat.label)}
          className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
            activeCategory === cat.label
              ? 'bg-violet-600 text-white shadow-lg'
              : 'bg-black/5 dark:bg-white/10 text-neutral-600 dark:text-neutral-300 hover:bg-black/10 dark:hover:bg-white/20 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          {cat.label}
        </button>
      ))}
      <div className="flex-shrink-0 w-8 h-full"></div>
    </div>
  );
};

export default CategoryFilters;