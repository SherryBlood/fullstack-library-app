import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, itemName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white border border-orange-200 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">

        <div className="bg-red-50 p-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 shadow-inner">
            <AlertTriangle size={32} />
          </div>
          <h3 className="text-xl font-bold text-red-900">Are you sure?</h3>
          <p className="text-red-800/60 text-sm mt-1">
            You are about to delete <span className="font-bold text-red-700">"{itemName}"</span>. This action cannot be undone.
          </p>
        </div>

        <div className="p-6 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <X size={18} /> Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-200 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <Trash2 size={18} /> Delete Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;