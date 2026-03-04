import React, { useState, useEffect } from 'react';
import { BookA, Book, AlertTriangle, Plus } from 'lucide-react';

const BookFormModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  formData, 
  setFormData, 
  errors, 
  categories, 
  isEditing,
  bookedCount 
}) => {
  const [showLimitError, setShowLimitError] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [allCategories, setAllCategories] = useState([]);

  useEffect(() => {
    if (isOpen && categories) {
      const normalized = categories.map(c => typeof c === 'object' ? c.name : c);
      setAllCategories(normalized);
    }
  }, [categories, isOpen]);

  if (!isOpen) return null;

  const addNewCategory = async () => {
    const trimmed = newCategory.trim();
    if (!trimmed) return;

    if (allCategories.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
      alert("This category already exists!");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed })
      });

      if (response.ok) {
        const savedCat = await response.json();
        const catName = savedCat.name;

        setAllCategories(prev => [...prev, catName].sort());

        if (!formData.categories.includes(catName)) {
          setFormData(prev => ({
            ...prev,
            categories: [...prev.categories, catName]
          }));
        }
        
        setNewCategory(""); 
      } else {
        const errorText = await response.text();
        console.error("Server error raw:", errorText);
        alert("Server error. Make sure you added app.post('/api/categories') to server.js");
      }
    } catch (err) {
      console.error("Network error:", err);
      alert("Network error: Server is not responding");
    }
  };

  const handleSubmitInternal = (e) => {
    e.preventDefault();
    const totalNum = Number(formData.total);
    const bookedNum = Number(bookedCount);
    if (isEditing && totalNum < bookedNum) {
      setShowLimitError(true);
      return;
    }
    onSubmit(e);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-orange-50 border border-orange-200 w-full max-w-lg rounded-2xl p-8 shadow-2xl my-auto relative animate-in zoom-in duration-200">
        
        {showLimitError && (
          <div className="absolute inset-0 z-[160] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-orange-950/20 backdrop-blur-[2px] rounded-2xl" />
            <div className="bg-white border-2 border-red-200 p-6 rounded-2xl shadow-xl text-center z-10 animate-in zoom-in duration-200">
              <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="text-red-600" size={24} />
              </div>
              <h4 className="text-red-950 font-bold mb-2">Invalid Total!</h4>
              <p className="text-red-800/80 text-sm mb-6 leading-relaxed">
                You cannot set total less than <strong>{bookedCount}</strong>, 
                because those copies are currently borrowed or reserved.
              </p>
              <button 
                type="button"
                onClick={() => setShowLimitError(false)}
                className="w-full py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-800 transition-colors cursor-pointer"
              >
                I understand
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-orange-600 text-white rounded-xl flex items-center justify-center shadow-lg">
            {isEditing ? <BookA size={24} /> : <Book size={24} />}
          </div>
          <h2 className="text-2xl font-bold text-orange-950">
            {isEditing ? `Edit Book` : 'Add New Book'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmitInternal} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-orange-900 mb-1">Book Title *</label>
              <input
                type="text"
                className={`w-full p-2.5 rounded-lg border bg-white outline-none transition-all ${
                  errors.title ? "border-red-500 bg-red-50" : "border-orange-200 focus:border-orange-500"
                }`}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-orange-900 mb-1">Author *</label>
              <input
                type="text"
                className={`w-full p-2.5 rounded-lg border bg-white outline-none transition-all ${
                  errors.author ? "border-red-500 bg-red-50" : "border-orange-200 focus:border-orange-500"
                }`}
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-orange-900 mb-2">Categories *</label>
            
            <div className="flex gap-2 mb-3">
              <input 
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addNewCategory();
                  }
                }}
                placeholder="Add custom genre..."
                className="flex-1 px-3 py-2 text-xs border border-orange-200 rounded-lg outline-none focus:border-orange-500 bg-white"
              />
              <button 
                type="button"
                onClick={addNewCategory}
                className="px-3 py-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors flex items-center gap-1 text-xs font-bold"
              >
                <Plus size={14} /> Add
              </button>
            </div>

            <div className={`flex flex-wrap gap-2 p-3 bg-white/50 border rounded-lg max-h-40 overflow-y-auto ${
              errors.categories ? "border-red-500" : "border-orange-200"
            }`}>
              {allCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    const isSelected = formData.categories.includes(cat);
                    const newCats = isSelected
                      ? formData.categories.filter((c) => c !== cat)
                      : [...formData.categories, cat];
                    setFormData({ ...formData, categories: newCats });
                  }}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all border cursor-pointer ${
                    formData.categories.includes(cat)
                      ? "bg-orange-600 border-orange-600 text-white shadow-md shadow-orange-200"
                      : "bg-white border-orange-200 text-orange-800 hover:bg-orange-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            {errors.categories && <p className="text-[10px] text-red-500 mt-1 font-bold italic">Please select at least one category</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-orange-900 mb-1">Description</label>
            <textarea
              rows="3"
              className="w-full p-2.5 rounded-lg border border-orange-200 bg-white outline-none focus:border-orange-500 text-sm resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-orange-900 mb-1">Total Stock *</label>
              <input
                type="number"
                min="1"
                className={`w-full p-2.5 rounded-lg border bg-white outline-none ${
                  errors.total ? "border-red-500" : "border-orange-200"
                }`}
                value={formData.total}
                onChange={(e) => setFormData({ ...formData, total: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-orange-900 mb-1">Image URL</label>
              <input
                type="text"
                className="w-full p-2.5 rounded-lg border border-orange-200 bg-white outline-none"
                placeholder="https://..."
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-3 border border-orange-200 text-orange-900 rounded-xl font-bold hover:bg-orange-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 shadow-lg shadow-orange-200 transition-all cursor-pointer"
            >
              {isEditing ? 'Save Changes' : 'Create Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookFormModal;