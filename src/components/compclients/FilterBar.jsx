import React from 'react';
import { Search, UserPlus, SortAsc, SortDesc, AlertCircle } from 'lucide-react';

const FilterBar = ({ searchQuery, setSearchQuery, onAddClick, sortType, setSortType }) => {
  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="relative w-full max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-orange-800/50">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/50 border border-orange-300 text-orange-950 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block pl-10 p-2.5 outline-none transition-all placeholder:text-orange-800/40 focus:bg-white shadow-sm"
          />
        </div>

        <button
          onClick={onAddClick}
          className="bg-orange-600 hover:bg-orange-500 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-md active:scale-95 whitespace-nowrap cursor-pointer font-bold text-sm"
        >
          <UserPlus size={20} /> Add Client
        </button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-orange-900/50 uppercase tracking-wider mr-2">Sort by:</span>
        
        <button
          onClick={() => setSortType('az')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border ${
            sortType === 'az'
              ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
              : 'bg-white text-orange-800 border-orange-200 hover:border-orange-400'
          }`}
        >
          <SortAsc size={16} /> A-Z
        </button>

        <button
          onClick={() => setSortType('za')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border ${
            sortType === 'za'
              ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
              : 'bg-white text-orange-800 border-orange-200 hover:border-orange-400'
          }`}
        >
          <SortDesc size={16} /> Z-A
        </button>

        <button
  onClick={() => setSortType('fines')}
  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border ${
    sortType === 'fines'
      ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
      : 'bg-white text-orange-800 border-orange-200 hover:border-orange-400'
  }`}
>
  <AlertCircle size={16} /> Fines First
</button>
      </div>
    </div>
  );
};

export default FilterBar;