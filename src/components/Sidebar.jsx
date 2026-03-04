import React from 'react';
import {BookOpen, Book, Users, Repeat, GitCompare, LogOut } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, comparisonCount = 0 }) => {
  const menuItems = [
    { id: 'books', label: 'Books', icon: <Book size={20} /> },
    { id: 'comparison', label: 'Comparison', icon: <GitCompare size={20} /> },
    { id: 'clients', label: 'Clients', icon: <Users size={20} /> },
    { id: 'transactions', label: 'Transactions', icon: <Repeat size={20} /> },
  ];

  return (
    <aside className="w-64 bg-orange-950 flex flex-col border-r border-black/20">
      <div className="p-6 text-xl font-bold text-white flex items-center gap-2">
        <div className="w-10 h-10 bg-orange-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
          <BookOpen size={24} strokeWidth={2.5} /> 
        </div>
        <span className="tracking-tight">Library</span>
      </div>
      
      <nav className="flex-1 px-3">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md mb-1 transition-all cursor-pointer ${
              activeTab === item.id 
                ? 'bg-orange-400 text-white shadow-sm' 
                : 'hover:bg-orange-500 text-orange-200 hover:text-gray-200'
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>

            {item.id === 'comparison' && comparisonCount > 0 && (
              <span className="ml-auto bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                {comparisonCount}
              </span>
            )}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;