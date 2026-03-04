import React, { useState } from 'react';
import { X, Trash2, Tag } from 'lucide-react';
import DeleteConfirmModal from '../DeleteConfirm';

const ManageCategories = ({ isOpen, onClose, categories, onDeleteCategory }) => {
  const [catToDelete, setCatToDelete] = useState(null);

  if (!isOpen) return null;

  const handleDeleteClick = (catName) => {
    setCatToDelete(catName);
  };

  const handleConfirmDelete = () => {
    if (catToDelete) {
      onDeleteCategory(catToDelete);
      setCatToDelete(null);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-orange-50 border border-orange-200 w-full max-w-md rounded-2xl shadow-2xl animate-in zoom-in duration-200">

          <div className="flex items-center justify-between p-6 border-b border-orange-100">
            <div className="flex items-center gap-2">
              <Tag className="text-orange-600" size={20} />
              <h3 className="text-lg font-bold text-orange-950">Manage Categories</h3>
            </div>
            <button onClick={onClose} className="text-orange-900/50 hover:text-orange-900 transition-colors cursor-pointer">
              <X size={24} />
            </button>
          </div>

          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {categories.length === 0 ? (
              <p className="text-center text-orange-800/40 italic">No categories found...</p>
            ) : (
              <div className="space-y-2">
                {categories.map((cat) => (
                  <div 
                    key={cat._id} 
                    className="flex items-center justify-between bg-white p-3 rounded-xl border border-orange-100 group hover:border-orange-300 transition-all"
                  >
                    <span className="text-orange-900 font-medium">{cat.name}</span>
                    <button
                      onClick={() => handleDeleteClick(cat.name)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                      title="Delete category everywhere"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 bg-orange-100/50 rounded-b-2xl">
            <p className="text-[10px] text-orange-800/60 leading-tight uppercase font-bold tracking-wider">
              Warning: Deleting a category will remove it from all books currently associated with it.
            </p>
          </div>
        </div>
      </div>

      <DeleteConfirmModal 
        isOpen={!!catToDelete} 
        onClose={() => setCatToDelete(null)} 
        onConfirm={handleConfirmDelete} 
        itemName={catToDelete} 
      />
    </>
  );
};

export default ManageCategories;