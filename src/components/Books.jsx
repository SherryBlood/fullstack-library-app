import React, { useState, useEffect, useMemo, useCallback } from "react";
import FilterBar from "./compbooks/FilterBar";
import CategoryFilters from "./compbooks/CategoryFilters";
import BookCard from "./compbooks/BookCard";
import BookFormModal from "./compbooks/BookFormModal";
import DeleteConfirm from "./DeleteConfirm";
import ManageCategories from "./compbooks/ManageCategories"; 

const Books = ({ 
  books = [], 
  setBooks, 
  onCompare, 
  comparisonList, 
  setSelectedBookForDesc,
  refreshBooks 
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortType, setSortType] = useState('az');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [dbCategories, setDbCategories] = useState([]); 

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    title: "", author: "", total: "", description: "", categories: [], image: "",
  });

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:5000/api/categories');
      if (res.ok) {
        const data = await res.json();
        setDbCategories(data);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const categories = useMemo(() => {
    const defaultCats = [];
    const catsFromBooks = books.flatMap(b => b.categories || []);
    const catsFromDb = dbCategories.map(c => c.name || c);

    const all = [...new Set([...defaultCats, ...catsFromBooks, ...catsFromDb])];
    return all.filter(cat => typeof cat === 'string' && cat.trim() !== "").sort();
  }, [books, dbCategories]);

  const sortedAndFilteredBooks = useMemo(() => {
    return [...books]
      .filter((book) => {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          book.title?.toLowerCase().includes(query) || 
          book.author?.toLowerCase().includes(query);
        const matchesCategory = 
          selectedCategories.length === 0 || 
          book.categories?.some(cat => selectedCategories.includes(cat));
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortType === 'az') return a.title.localeCompare(b.title);
        if (sortType === 'za') return b.title.localeCompare(a.title);
        if (sortType === 'popular') {
          const issuedA = (Number(a.total) || 0) - (Number(a.available) || 0);
          const issuedB = (Number(b.total) || 0) - (Number(b.available) || 0);
          return issuedB - issuedA;
        }
        if (sortType === 'available') return (Number(b.available) || 0) - (Number(a.available) || 0);
        return 0;
      });
  }, [books, searchQuery, selectedCategories, sortType]);

  const handleDeleteCategory = async (catName) => {
    try {
      const res = await fetch(`http://localhost:5000/api/categories/${catName}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setDbCategories(prev => prev.filter(c => (c.name || c) !== catName));
        if (refreshBooks) await refreshBooks(); 
      }
    } catch (err) {
      console.error(err);
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.title?.trim()) newErrors.title = true;
    if (!formData.author?.trim()) newErrors.author = true;
    if (!formData.total || Number(formData.total) <= 0) newErrors.total = true;
    if (!formData.description?.trim()) newErrors.description = true;
    if (!formData.categories || formData.categories.length === 0) newErrors.categories = true;
    if (!formData.image?.trim()) newErrors.image = true;
    
    const currentlyIssued = editingBook ? (Number(editingBook.total) - Number(editingBook.available)) : 0;
    if (Number(formData.total) < currentlyIssued) {
       alert(`Cannot set total less than issued books (${currentlyIssued})`);
       newErrors.total = true;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const url = editingBook 
        ? `http://localhost:5000/api/books/${editingBook._id}` 
        : 'http://localhost:5000/api/books';
      
      const method = editingBook ? 'PUT' : 'POST';
      const issued = editingBook ? (Number(editingBook.total) - Number(editingBook.available)) : 0;
      
      const finalData = {
        ...formData,
        total: Number(formData.total),
        available: Number(formData.total) - issued
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData)
      });

      if (response.ok) {
        const savedBook = await response.json();
        if (editingBook) {
          setBooks(prev => prev.map(b => b._id === savedBook._id ? savedBook : b));
        } else {
          setBooks(prev => [savedBook, ...prev]);
        }
        
        await fetchCategories(); 
        setIsModalOpen(false);
        setEditingBook(null);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save book.");
    }
  };

  const confirmDelete = async () => {
    if (!bookToDelete) return;
    try {
      const response = await fetch(`http://localhost:5000/api/books/${bookToDelete._id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setBooks(prev => prev.filter(b => b._id !== bookToDelete._id));
        setIsDeleteModalOpen(false);
        setBookToDelete(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-auto">
      <FilterBar 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        onAddClick={() => {
            setEditingBook(null);
            setFormData({ title: "", author: "", total: "", description: "", categories: [], image: "" });
            setErrors({});
            setIsModalOpen(true);
        }}
        onManageCategoriesClick={() => setIsCatModalOpen(true)}
        sortType={sortType}
        setSortType={setSortType}
      />

      <CategoryFilters 
        categories={categories} 
        selectedCategories={selectedCategories} 
        toggleCategory={(cat) => setSelectedCategories(prev => 
          prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
        )} 
      />

      {sortedAndFilteredBooks.length === 0 ? (
        <div className="text-center py-20 text-orange-800/40 italic">
          No books found...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {sortedAndFilteredBooks.map((book) => (
            <BookCard 
              key={book._id} 
              book={book} 
              onShowDesc={() => setSelectedBookForDesc(book)} 
              onEdit={() => {
                setEditingBook(book);
                setFormData(book);
                setErrors({});
                setIsModalOpen(true);
              }}
              onDelete={() => {
                setBookToDelete(book);
                setIsDeleteModalOpen(true);
              }}
              onCompare={() => onCompare(book)} 
              isInComparison={comparisonList.some(b => b._id === book._id)}
            />
          ))}
        </div>
      )}

      <ManageCategories 
        isOpen={isCatModalOpen}
        onClose={async () => {
          setIsCatModalOpen(false);
          await fetchCategories();
        }}
        categories={dbCategories}
        onDeleteCategory={handleDeleteCategory}
      />

      <DeleteConfirm 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={bookToDelete?.title}
      />

      <BookFormModal 
        isOpen={isModalOpen}
        onClose={async () => {
          setIsModalOpen(false);
          setEditingBook(null);
          await fetchCategories();        
        }}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        setErrors={setErrors}
        categories={categories}
        isEditing={!!editingBook}
        bookedCount={editingBook ? (Number(editingBook.total) - Number(editingBook.available)) : 0}
      />
    </div>
  );
};

export default Books;