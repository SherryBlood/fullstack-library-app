import React from 'react';
import { Search, PlusCircle, SortAsc, SortDesc, Flame, CheckCircle, Tag } from 'lucide-react'; 

const FilterBar = ({ searchQuery, setSearchQuery, onAddClick, sortType, setSortType, onManageCategoriesClick }) => {
  const sortOptions = [
    { id: 'az', icon: <SortAsc size={16} />, label: 'A-Z' },
    { id: 'za', icon: <SortDesc size={16} />, label: 'Z-A' },
    { id: 'popular', icon: <Flame size={18} />, label: 'Popular' },
    { id: 'available', icon: <CheckCircle size={18} />, label: 'Available' },
  ];

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="relative w-full max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-orange-800/50">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/50 border border-orange-300 text-orange-950 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block pl-10 p-2.5 outline-none transition-all placeholder:text-orange-800/40 focus:bg-white shadow-sm"
          />
        </div>

        <button
          className="bg-white border border-orange-300 hover:bg-orange-50 text-orange-700 px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-sm active:scale-95 whitespace-nowrap cursor-pointer font-bold text-sm"
          onClick={onManageCategoriesClick}
        >
          <Tag size={18} /> Manage Categories
        </button>

        <button
          className="bg-orange-600 hover:bg-orange-500 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-md active:scale-95 whitespace-nowrap cursor-pointer font-bold text-sm"
          onClick={onAddClick}
        >
          <PlusCircle size={20} /> Add Book
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 pb-2 md:pb-0">
        <span className="text-xs font-bold text-orange-900/50 uppercase tracking-wider mr-2">Sort by:</span>
        {sortOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setSortType(option.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border ${
              sortType === option.id
                ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                : 'bg-white text-orange-800 border-orange-200 hover:border-orange-400'
            }`}
          >
            {option.icon}
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;