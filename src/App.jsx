import React, { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Books from './components/Books';
import Compare from './components/Compare';
import Clients from './components/Clients';
import Transactions from './components/Transactions';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('books');
  const [comparisonList, setComparisonList] = useState([]);
  const [selectedBookForDesc, setSelectedBookForDesc] = useState(null);

  const [books, setBooks] = useState([]);
  const [clients, setClients] = useState([]);
  const [history, setHistory] = useState([]);

  const refreshBooks = async () => {
    try {
      const res = await fetch(`${API_URL}/books`);
      const data = await res.json();
      setBooks(data);
    } catch (err) {
      console.error("Error refreshing books:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksRes, clientsRes, transRes] = await Promise.all([
          fetch(`${API_URL}/books`),
          fetch(`${API_URL}/clients`),
          fetch(`${API_URL}/transactions`)
        ]);

        const booksData = await booksRes.json();
        const clientsData = await clientsRes.json();
        const transData = await transRes.json();

        setBooks(booksData);
        setClients(clientsData);
        setHistory(transData);
      } catch (err) {
        console.error("Critical loading error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleIssueSubmit = async (client, data) => {
    if (!client || !data.bookId) {
      alert("Error: Client or Book info is missing!");
      return;
    }

    try {
      let dueDate = null;
      if (data.mode === 'borrowed' && data.days) {
        const date = new Date();
        date.setDate(date.getDate() + data.days);
        dueDate = date.toISOString();
      }

      const transactionData = {
        clientId: client._id,
        bookId: data.bookId,
        clientName: `${client.firstName} ${client.lastName}`,
        bookTitle: data.bookTitle,
        phone: client.phone,
        quantity: data.quantity,
        days: data.days,
        date: new Date().toISOString(),
        dueDate: dueDate,
        status: data.mode
      };

      const response = await fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionData)
      });

      if (response.ok) {
        const savedTx = await response.json();
        setHistory(prev => [savedTx, ...prev]);

        setBooks(prev => prev.map(book => 
          book._id === data.bookId 
            ? { ...book, available: book.available - data.quantity } 
            : book
        ));

        setActiveTab('transactions');
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full bg-orange-950 flex flex-col items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-orange-600 rounded-full blur-2xl opacity-20 animate-pulse"></div>
          <div className="relative bg-orange-600 p-6 rounded-3xl shadow-2xl animate-bounce">
            <BookOpen size={64} color="white" strokeWidth={2.5} />
          </div>
        </div>
        <h1 className="mt-8 text-white text-3xl font-bold tracking-tighter animate-pulse">
          Library <span className="text-orange-500">System</span>
        </h1>
      </div>
    );
  }

  const toggleComparison = (book) => {
    setComparisonList(prev => 
      prev.find(b => b._id === book._id) ? prev.filter(b => b._id !== book._id) : [...prev, book]
    );
  };

  return (
    <div className="flex h-screen bg-orange-200 text-orange-950">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} comparisonCount={comparisonList.length} />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 shadow-sm flex items-center px-8 bg-orange-200 border-b border-orange-600/10">
          <h2 className="text-lg font-semibold text-orange-950 capitalize">{activeTab}</h2>
        </header>

        <section className="p-8 overflow-y-auto flex-1">
          {activeTab === 'books' && (
  <Books 
    books={books} 
    setBooks={setBooks} 
    onCompare={toggleComparison} 
    comparisonList={comparisonList} 
    setSelectedBookForDesc={setSelectedBookForDesc}
    refreshBooks={refreshBooks}
  />
)}

          {activeTab === 'comparison' && (
            <Compare comparisonList={comparisonList} onCompare={toggleComparison} onShowDesc={setSelectedBookForDesc} />
          )}

          {activeTab === 'clients' && (
            <Clients books={books} clients={clients} setClients={setClients} onIssueSubmit={handleIssueSubmit} />
          )}

          {activeTab === 'transactions' && (
            <Transactions 
              history={history} 
              setHistory={setHistory} 
              setBooks={setBooks} 
              refreshBooks={refreshBooks} 
            />
          )}
        </section>

        {selectedBookForDesc && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-orange-50 border border-orange-200 w-full max-w-lg rounded-2xl p-6 shadow-2xl">
              <h3 className="text-lg font-bold text-orange-950 mb-2 italic">"{selectedBookForDesc.title}"</h3>
              <p className="text-orange-400 text-[10px] font-black uppercase mb-4 tracking-widest">Full Description</p>
              <div className="text-orange-900/80 text-sm leading-relaxed mb-6 max-h-[40vh] overflow-y-auto">{selectedBookForDesc.description || "No description available."}</div>
              <button onClick={() => setSelectedBookForDesc(null)} className="w-full py-4 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 shadow-lg shadow-orange-200 transition-all cursor-pointer">Close Details</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;