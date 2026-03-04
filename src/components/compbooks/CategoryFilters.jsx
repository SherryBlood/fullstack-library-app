import React from 'react';

const CategoryFilters = ({ categories = [], selectedCategories = [], toggleCategory }) => {

  if (!categories || categories.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {categories.map((category) => {
        const isSelected = selectedCategories?.includes(category);
        
        return (
          <button
            key={category}
            onClick={() => toggleCategory(category)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all border cursor-pointer ${
              isSelected
                ? "bg-orange-600 border-orange-600 text-white shadow-sm"
                : "bg-white/30 border-orange-300 text-orange-900 hover:bg-orange-300/50"
            }`}
          >
            {category}
            {isSelected && <span className="ml-2">✕</span>}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilters;