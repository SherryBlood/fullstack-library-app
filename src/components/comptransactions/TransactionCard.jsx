import React from 'react';
import { User, Book, Calendar, Phone, AlertCircle, CheckCircle2, XCircle, ArrowRightCircle } from 'lucide-react';

const TransactionCard = ({ transaction, fineSettings, onReturn, onCancel, onIssueReserved }) => {
  const statusStyles = {
    borrowed: "bg-blue-100 text-blue-700 border-blue-200",
    reserved: "bg-amber-100 text-amber-700 border-amber-200",
    returned: "bg-emerald-100 text-emerald-700 border-emerald-200"
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const calculateFine = () => {
    if (transaction.status !== 'borrowed' || !transaction.dueDate || !fineSettings) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadline = new Date(transaction.dueDate);
    deadline.setHours(0, 0, 0, 0);
    
    if (today > deadline) {
      const diffTime = today - deadline;
      const overdueDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      const rate = fineSettings.fineAmount || fineSettings.finePerDay || 0;
      
      return { 
        amount: overdueDays * rate, 
        days: overdueDays 
      };
    }
    return null;
  };

  const fine = calculateFine();

  return (
    <div className="bg-white/70 backdrop-blur-sm border border-orange-200 rounded-2xl p-4 shadow-sm group relative overflow-hidden flex flex-col h-full">
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${
        transaction.status === 'borrowed' ? 'bg-blue-500' : transaction.status === 'reserved' ? 'bg-amber-500' : 'bg-emerald-500'
      }`} />

      <div className="flex flex-col gap-3 flex-grow">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><User size={16} /></div>
            <div>
              <h4 className="font-bold text-orange-950 text-sm leading-tight">{transaction.clientName}</h4>
              <div className="flex items-center gap-1 text-[11px] text-orange-700/70 font-medium mt-0.5">
                <Phone size={10} /><span>{transaction.phone}</span>
              </div>
            </div>
          </div>
          <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase border ${statusStyles[transaction.status]}`}>
            {transaction.status}
          </span>
        </div>

        <div className="flex items-center justify-between p-2 bg-orange-50/50 rounded-xl border border-orange-100/50">
          <div className="flex items-center gap-2">
            <Book size={16} className="text-orange-700" />
            <h4 className="font-bold text-orange-900 text-xs italic">"{transaction.bookTitle}" — {transaction.quantity}</h4>
          </div>
          {fine && (
            <div className="text-right text-red-600 animate-pulse">
              <div className="text-xs font-black">${fine.amount.toFixed(2)}</div>
              <div className="text-[8px] font-bold uppercase">{fine.days} d. overdue</div>
            </div>
          )}
        </div>

        <div className="space-y-2 mt-3 pt-3 border-t border-orange-100">
          <div className="flex items-center justify-between text-[10px] text-orange-800/60 font-medium">
            <div className="flex items-center gap-1">
              <Calendar size={12} className="text-orange-400" />
              <span>Issued: {formatDate(transaction.date)}</span>
            </div>
            <div className="font-mono opacity-50">#{transaction._id?.toString().slice(-4)}</div>
          </div>

          {transaction.status === 'borrowed' && transaction.dueDate && (
            <div className={`flex items-center justify-between p-2 rounded-lg mt-2 ${
              new Date() > new Date(transaction.dueDate) 
                ? "bg-red-50 text-red-700 border border-red-100" 
                : "bg-orange-100/50 text-orange-800"
            }`}>
              <div className="flex flex-col">
                <span className="text-[9px] uppercase font-black opacity-60">Return Deadline</span>
                <span className="text-xs font-bold">{formatDate(transaction.dueDate)}</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] uppercase font-black opacity-60">Period</span>
                <p className="text-xs font-bold">{transaction.days || '—'} days</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-2 pt-3 border-t border-orange-100 flex gap-2">
          {transaction.status === 'borrowed' && (
            <button 
              onClick={() => onReturn(transaction._id)}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-black uppercase flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-sm"
            >
              <CheckCircle2 size={14} /> Mark as Returned
            </button>
          )}

          {transaction.status === 'reserved' && (
            <>
              <button 
                onClick={() => onIssueReserved(transaction._id)}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[10px] font-black uppercase flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <ArrowRightCircle size={14} /> Issue
              </button>
              <button 
                onClick={() => onCancel(transaction._id)}
                className="flex-1 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-[10px] font-black uppercase flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <XCircle size={14} /> Cancel
              </button>
            </>
          )}
          
          {transaction.status === 'returned' && (
            <div className="w-full py-2 bg-gray-50 text-gray-400 rounded-lg text-[10px] font-black uppercase text-center border border-gray-100 italic">
              Book Returned
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;