import React, { useState, useEffect, useMemo } from 'react';
import FilterBar from './comptransactions/FilterBar';
import TransactionCard from './comptransactions/TransactionCard';
import FineSettingsModal from './comptransactions/FineSettingsModal';

const Transactions = ({ history, setHistory, setBooks, refreshBooks }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortType, setSortType] = useState("all");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const [fineSettings, setFineSettings] = useState({
    fineAmount: 10, 
    gracePeriod: 7,
    currency: "$"
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/settings');
        if (response.ok) {
          const data = await response.json();
          if (data) setFineSettings(data);
        }
      } catch (err) {
        console.error("Error loading settings:", err);
      }
    };
    fetchSettings();
  }, []);

  const handleSaveSettings = async (newSettings) => {
    try {
      const response = await fetch('http://localhost:5000/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
      if (response.ok) {
        const savedData = await response.json();
        setFineSettings(savedData);
        setIsSettingsOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReturn = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/transactions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'returned', returnDate: new Date().toISOString() })
      });

      if (response.ok) {
        const updatedTx = await response.json();

        setBooks(prev => prev.map(book => 
          book._id === updatedTx.bookId 
            ? { ...book, available: book.available + updatedTx.quantity } 
            : book
        ));

        setHistory(prev => prev.map(t => t._id === id ? updatedTx : t));

        if (refreshBooks) refreshBooks();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = async (id) => {
    try {
      const txToDelete = history.find(t => t._id === id);
      
      const response = await fetch(`http://localhost:5000/api/transactions/${id}`, { method: 'DELETE' });
      
      if (response.ok) {
        if (txToDelete && txToDelete.status !== 'returned') {
          setBooks(prev => prev.map(book => 
            book._id === txToDelete.bookId 
              ? { ...book, available: book.available + txToDelete.quantity } 
              : book
          ));
        }

        setHistory(prev => prev.filter(t => t._id !== id));
        if (refreshBooks) refreshBooks();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleIssueReserved = async (id) => {
    const date = new Date();
    const issueDate = date.toISOString();
    date.setDate(date.getDate() + 14);
    const dueDate = date.toISOString();

    try {
      const response = await fetch(`http://localhost:5000/api/transactions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'borrowed', date: issueDate, dueDate: dueDate })
      });

      if (response.ok) {
        const updatedTx = await response.json();
        setHistory(prev => prev.map(t => t._id === id ? updatedTx : t));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const checkIsOverdue = (item) => {
    if (item.status !== 'borrowed' || !item.dueDate) return false;
    return new Date() > new Date(item.dueDate);
  };

  const filteredHistory = useMemo(() => {
    return (history || [])
      .filter(item => {
        const searchStr = `${item.clientName || ''} ${item.bookTitle || ''} ${item.phone || ''}`.toLowerCase();
        const matchesSearch = searchStr.includes(searchQuery.toLowerCase());
        if (!matchesSearch) return false;
        if (sortType === 'overdue') return checkIsOverdue(item);
        if (sortType === 'borrowed') return item.status === 'borrowed';
        if (sortType === 'reserved') return item.status === 'reserved';
        if (sortType === 'returned') return item.status === 'returned';
        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [history, searchQuery, sortType]);

  return (
    <div className="mx-auto w-full">
      <FilterBar 
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        sortType={sortType} setSortType={setSortType}
        onSettingsClick={() => setIsSettingsOpen(true)}
      />

      {filteredHistory.length === 0 ? (
        <div className="text-center py-20 rounded-3xl border border-dashed border-orange-200">
          <p className="text-orange-900/40 italic">No transactions matching your filters...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHistory.map(item => (
            <TransactionCard 
              key={item._id} 
              transaction={item} 
              fineSettings={fineSettings}
              onReturn={handleReturn}
              onCancel={handleCancel}
              onIssueReserved={handleIssueReserved}
            />
          ))}
        </div>
      )}

      <FineSettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={fineSettings}
        setSettings={setFineSettings}
        onSave={handleSaveSettings} 
      />
    </div>
  );
};

export default Transactions;