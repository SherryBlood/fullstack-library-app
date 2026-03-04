import React from 'react';
import { GitCompare, Edit2, Trash2 } from 'lucide-react';

const BookCard = ({ book, onShowDesc, onEdit, onDelete, isInComparison, onCompare }) => {
  const bookId = book._id || book.id;

  return (
    <div className="relative group">
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onCompare();
        }}
        className={`absolute top-3 left-3 z-10 p-2 rounded-xl transition-all shadow-lg cursor-pointer ${
          isInComparison 
            ? 'bg-orange-600 text-white scale-110' 
            : 'bg-white/90 text-orange-900 hover:bg-orange-600 hover:text-white'
        }`}
      >
        <GitCompare size={18} />
      </button>

      <div className="bg-white/60 backdrop-blur-md border border-orange-300 rounded-2xl overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow h-full">
        <div className="h-48 w-full bg-orange-100 overflow-hidden">
          <img 
            src={book.image || 'https://via.placeholder.com/400x600?text=No+Cover'} 
            alt={book.title} 
            className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-500" 
          />
        </div>
        
        <div className="p-4 flex-1 flex flex-col">
          <div className="mb-2">
            <h3 className="font-bold text-orange-950 text-lg leading-tight truncate">{book.title}</h3>
            <p className="text-orange-800/70 text-sm italic">{book.author}</p>
          </div>
          
          <div onClick={() => onShowDesc(book)} className="cursor-pointer hover:bg-orange-100/50 p-1 -m-1 rounded-lg transition-colors mb-4">
            <p className="text-orange-900/60 text-[12px] leading-relaxed line-clamp-2 italic">
              {book.description || "No description available..."}
            </p>
          </div>

          <div className="flex flex-wrap gap-1 mb-4">
            {(book.categories || []).map((cat, index) => (
              <span 
                key={index} 
                className="text-[10px] px-2 py-0.5 bg-orange-200 text-orange-800 rounded-md border border-orange-300"
              >
                {cat}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2 py-3 border-y border-orange-200 mb-4 text-center text-[11px] font-bold uppercase tracking-tighter">
            <div>
              <div className="text-orange-900">{book.total}</div>
              <div className="text-orange-800/50">Total</div>
            </div>
            <div>
              <div className="text-orange-600">
                {book.booked !== undefined ? book.booked : (book.total - book.available)}
              </div>
              <div className="text-orange-800/50">Booked</div>
            </div>
            <div>
              <div className={book.available > 0 ? "text-green-600" : "text-red-500"}>
                {book.available}
              </div>
              <div className="text-orange-800/50">Free</div>
            </div>
          </div>

          <div className="flex gap-2 mt-auto">
            <button 
              onClick={() => onEdit(book)} 
              className="flex-1 py-2 bg-orange-100 hover:bg-orange-200 text-orange-900 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Edit2 size={14} /> Edit
            </button>
            <button 
              onClick={() => onDelete(bookId)}
              className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;