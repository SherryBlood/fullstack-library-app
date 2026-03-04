import React, { useState, useEffect } from 'react';
import { X, Search, Book, Check, BookPlus, Bookmark, AlertTriangle } from 'lucide-react';

const IssueBookModal = ({ isOpen, onClose, onSubmit, books, client, mode }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showError, setShowError] = useState(false);
  const [days, setDays] = useState(14);

  useEffect(() => {
    if (!isOpen) {
      setShowError(false);
      setQuantity(1);
      setSelectedBook(null);
      setSearchQuery("");
      setDays(14);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredBooks = (books || []).filter(book => 
    book.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConfirm = () => {
    if (!selectedBook) return;

    const availableCount = selectedBook.available ?? 0;

    if (quantity > availableCount) {
      setShowError(true);
      return;
    }

    onSubmit({
      bookId: selectedBook._id,
      bookTitle: selectedBook.title,
      quantity: quantity,
      days: mode === 'borrowed' ? days : null,
      mode: mode 
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-orange-50 border border-orange-200 w-full max-w-2xl rounded-2xl p-8 shadow-2xl my-auto relative animate-in zoom-in duration-200">
        
        {showError && (
          <div className="absolute inset-0 z-[160] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-orange-950/40 backdrop-blur-[2px] rounded-2xl" />
            <div className="bg-white border-2 border-red-200 p-6 rounded-2xl shadow-xl text-center z-10 animate-in zoom-in duration-200 max-w-[85%]">
              <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="text-red-600" size={24} />
              </div>
              <h4 className="text-red-950 font-bold mb-2">Invalid Quantity!</h4>
              <p className="text-red-800/80 text-sm mb-6 leading-relaxed">
                You cannot issue <strong>{quantity}</strong> copies, 
                because only <strong>{selectedBook?.available ?? 0}</strong> are currently available.
              </p>
              <button 
                onClick={() => setShowError(false)}
                className="w-full py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-800 transition-colors cursor-pointer"
              >
                I will fix it
              </button>
            </div>
          </div>
        )}

        <button onClick={onClose} className="absolute top-6 right-6 text-orange-400 hover:text-orange-600 cursor-pointer">
          <X size={24} />
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-orange-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-orange-200">
            {mode === 'borrowed' ? <BookPlus size={24} /> : <Bookmark size={24} />}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-orange-950">
              {mode === 'borrowed' ? 'Issue Book' : 'Reserve Book'}
            </h2>
            <p className="text-orange-800/60 text-xs font-bold uppercase tracking-widest">
              For: {client?.firstName} {client?.lastName}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400" size={18} />
              <input 
                type="text"
                placeholder="Find book..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-orange-200 bg-white outline-none focus:border-orange-500 shadow-sm text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="h-[300px] overflow-y-auto border border-orange-100 rounded-xl bg-white/50 p-2 space-y-2 custom-scrollbar">
              {filteredBooks.map(book => (
                <div 
                  key={book._id}
                  onClick={() => setSelectedBook(book)}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all flex items-center justify-between ${
                    selectedBook?._id === book._id 
                    ? "border-orange-500 bg-orange-50" 
                    : "border-transparent hover:bg-orange-100/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Book size={16} className="text-orange-600" />
                    <div>
                      <p className="text-sm font-bold text-orange-950 leading-tight">{book.title}</p>
                      <p className="text-[10px] text-orange-800/60 font-medium italic">Available: {book.available ?? 0}</p>
                    </div>
                  </div>
                  {selectedBook?._id === book._id && <Check size={16} className="text-orange-600" />}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/40 border border-orange-200 rounded-2xl p-6 flex flex-col justify-between">
            {selectedBook ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                <div className="text-center pb-4 border-b border-orange-100">
                  <p className="text-[10px] font-black uppercase text-orange-400 mb-1 tracking-tighter">Selected Book</p>
                  <h3 className="font-bold text-orange-950 italic">"{selectedBook.title}"</h3>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-orange-400 mb-2">Quantity</label>
                  <input 
                    type="number" 
                    min="1"
                    className={`w-full p-3 rounded-xl border bg-white font-bold outline-none transition-colors ${
                      quantity > (selectedBook.available ?? 0) ? "border-red-500 text-red-600" : "border-orange-200"
                    }`}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  />
                  <p className="text-[9px] mt-2 text-orange-800/60 font-bold">
                    * Max available: {selectedBook.available ?? 0}
                  </p>
                </div>

                {mode === 'borrowed' && (
                  <div className="mt-4 animate-in slide-in-from-top-2">
                    <label className="block text-[10px] font-black uppercase text-orange-400 mb-2">Rental Period (Days)</label>
                    <input 
                      type="number" 
                      min="1"
                      className="w-full p-3 rounded-xl border border-orange-200 bg-white font-bold outline-none"
                      value={days}
                      onChange={(e) => setDays(Number(e.target.value))}
                    />
                  </div>
                )}

                <div className="pt-4">
                  <button 
                    onClick={handleConfirm}
                    className="w-full py-4 bg-orange-600 text-white rounded-xl font-black uppercase tracking-widest hover:bg-orange-500 shadow-lg shadow-orange-200 transition-all cursor-pointer"
                  >
                    Confirm {mode === 'borrowed' ? 'Issue' : 'Reserve'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-center p-8 opacity-40">
                <p className="text-sm font-bold text-orange-900">Please select a book from the list to continue</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueBookModal;