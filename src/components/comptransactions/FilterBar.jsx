import React from 'react';
import { Search, Settings, AlertCircle, Bookmark, BookOpen, LayoutGrid } from 'lucide-react';

const FilterBar = ({ searchQuery, setSearchQuery, sortType, setSortType, onSettingsClick }) => {
  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="relative w-full max-w-md h-full flex items-center gap-4">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-800/50 pointer-events-none flex items-center">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search by client, phone or book..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/50 border border-orange-300 text-orange-950 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block pl-10 p-2.5 outline-none transition-all placeholder:text-orange-800/40 focus:bg-white shadow-sm"
          />
          <button
            onClick={onSettingsClick}
            className="p-2.5 bg-white border border-orange-200 text-orange-600 rounded-lg hover:bg-orange-50 transition-all shadow-sm flex items-center gap-2 text-sm font-bold cursor-pointer whitespace-nowrap"
          >
            <Settings size={18} /> 
            <span className="hidden sm:inline">Fine</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="flex flex-wrap items-center gap-1 bg-white/30 p-1 rounded-xl border border-orange-200">

          <button
            onClick={() => setSortType('all')}
            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer flex items-center gap-1 ${
              sortType === 'all' ? 'bg-orange-600 text-white shadow-md' : 'text-orange-800 hover:bg-orange-100'
            }`}
          >
            <LayoutGrid size={12} /> All
          </button>

          <div className="w-px h-4 bg-orange-300 mx-1" />

          <button
            onClick={() => setSortType('borrowed')}
            className={`px-3 py-2 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer flex items-center gap-1 ${
              sortType === 'borrowed' ? 'bg-blue-600 text-white shadow-md' : 'text-blue-800 hover:bg-blue-50'
            }`}
          >
            <BookOpen size={12} /> Borrowed
          </button>

          <button
            onClick={() => setSortType('reserved')}
            className={`px-3 py-2 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer flex items-center gap-1 ${
              sortType === 'reserved' ? 'bg-amber-500 text-white shadow-md' : 'text-amber-700 hover:bg-amber-50'
            }`}
          >
            <Bookmark size={12} /> Reserved
          </button>

          <button
            onClick={() => setSortType('overdue')}
            className={`px-3 py-2 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer flex items-center gap-1 ${
              sortType === 'overdue' ? 'bg-red-600 text-white shadow-md' : 'text-red-700 hover:bg-red-50'
            }`}
          >
            <AlertCircle size={12} /> Overdue
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;