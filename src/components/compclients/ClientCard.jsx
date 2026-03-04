import React from 'react';
import { User, Phone, CreditCard, Edit2, Trash2, Bookmark, BookPlus, AlertCircle, DollarSign } from 'lucide-react';

const ClientCard = ({ client, onEdit, onDelete, onIssue, onReserve, onPayFine }) => {
  const clientId = client._id || client.id;

  return (
    <div className="bg-white/60 backdrop-blur-md border border-orange-300 rounded-2xl p-5 flex flex-col shadow-sm hover:shadow-md transition-all group h-full">

      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center shadow-inner">
            <User size={24} />
          </div>
          <div>
            <h3 className="font-bold text-orange-950 text-lg leading-tight">
              {client.firstName} {client.lastName}
            </h3>
            <div className="flex items-center gap-1 text-orange-800/60 text-xs mt-1">
              <Phone size={12} />
              <span>{client.phone}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={`mb-5 p-3 rounded-xl border flex items-center justify-between ${
        client.hasFine 
          ? 'bg-red-50 border-red-200 text-red-700' 
          : 'bg-green-50 border-green-200 text-green-700'
      }`}>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
          {client.hasFine ? <AlertCircle size={14} /> : <CreditCard size={14} />}
          <span>{client.hasFine ? 'Fine Pending' : 'No Fines'}</span>
        </div>
        <span className="font-bold text-sm">
          ${(client.fineAmount || 0).toFixed(2)}
        </span>
      </div>

      <div className="flex flex-col gap-4 mt-auto">

        <div className="flex gap-2">
          <button
            onClick={() => onIssue(client)}
            className="flex-1 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <BookPlus size={16} /> Issue
          </button>

          <button
            onClick={() => onReserve(client)}
            className="flex-1 py-2 bg-amber-500 hover:bg-amber-400 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Bookmark size={16} /> Reserve
          </button>
        </div>

        {client.hasFine && (
          <button
            onClick={() => onPayFine(clientId)}
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all animate-in zoom-in duration-300 cursor-pointer shadow-sm shadow-emerald-200"
          >
            <DollarSign size={16} /> Pay Fine
          </button>
        )}

        <div className="flex gap-2 pt-2 border-t border-orange-200/50">
          <button
            onClick={() => onEdit(client)}
            className="flex-1 py-2 bg-orange-100 hover:bg-orange-200 text-orange-900 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Edit2 size={14} /> Edit
          </button>
          <button
            onClick={() => onDelete(clientId)}
            className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientCard;