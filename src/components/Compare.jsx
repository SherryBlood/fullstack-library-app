import React from 'react';
import BookCard from './compbooks/BookCard';
import { GitCompare } from 'lucide-react';

const Compare = ({ comparisonList, onCompare, onShowDesc, onEdit, onDelete }) => {
  return (
    <div className="mx-auto w-full">
      {comparisonList && comparisonList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {comparisonList.map((book) => (
            <BookCard 
              key={book._id || book.id} 
              book={book} 
              isInComparison={true}
              onCompare={() => onCompare(book)}
              onShowDesc={onShowDesc}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 rounded-[32px] border-2 border-dashed border-orange-200">
          <div className="w-20 h-20 bg-orange-100 text-orange-300 rounded-full flex items-center justify-center mb-4">
            <GitCompare size={40} />
          </div>
          <p className="text-orange-900 font-bold text-xl">Empty Comparison Shelf</p>
          <p className="text-orange-800/50 max-w-xs text-center mt-2">
            Go back to the catalog and click the comparison icon on any book to see it here.
          </p>
        </div>
      )}
    </div>
  );
};

export default Compare;