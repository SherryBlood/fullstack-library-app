import React from 'react';
import { User, BadgeCheck } from 'lucide-react';

const ClientFormModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  formData, 
  setFormData, 
  errors, 
  setErrors, 
  isEditing 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-orange-50 border border-orange-200 w-full max-w-md rounded-2xl p-8 shadow-2xl my-auto relative animate-in zoom-in duration-200">

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-orange-600 text-white rounded-xl flex items-center justify-center shadow-lg">
            {isEditing ? <BadgeCheck size={24} /> : <User size={24} />}
          </div>
          <h2 className="text-2xl font-bold text-orange-950">
            {isEditing ? 'Edit Profile' : 'New Client'}
          </h2>
        </div>
        
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-orange-900 mb-1 ml-1">First Name *</label>
            <input
              type="text"
              placeholder="First Name"
              className={`w-full p-3 rounded-xl border bg-white outline-none transition-all ${
                errors.firstName ? "border-red-500 bg-red-50" : "border-orange-200 focus:border-orange-500 shadow-sm"
              }`}
              value={formData.firstName}
              onChange={(e) => {
                setFormData({ ...formData, firstName: e.target.value });
                if (errors.firstName) setErrors({ ...errors, firstName: false });
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-orange-900 mb-1 ml-1">Last Name *</label>
            <input
              type="text"
              placeholder="Second Name"
              className={`w-full p-3 rounded-xl border bg-white outline-none transition-all ${
                errors.lastName ? "border-red-500 bg-red-50" : "border-orange-200 focus:border-orange-500 shadow-sm"
              }`}
              value={formData.lastName}
              onChange={(e) => {
                setFormData({ ...formData, lastName: e.target.value });
                if (errors.lastName) setErrors({ ...errors, lastName: false });
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-orange-900 mb-1 ml-1 flex items-center gap-1">
              Phone Number *
            </label>
            <input
              type="text"
              placeholder="+380..."
              className={`w-full p-3 rounded-xl border bg-white outline-none transition-all ${
                errors.phone ? "border-red-500 bg-red-50" : "border-orange-200 focus:border-orange-500 shadow-sm"
              }`}
              value={formData.phone}
              onChange={(e) => {
      const val = e.target.value.replace(/[^\d+]/g, ''); 
      setFormData({ ...formData, phone: val });
      if (errors.phone) setErrors({ ...errors, phone: false });
    }}
            />
          </div>

          <div className="flex gap-3 pt-6">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-3 border border-orange-200 text-orange-900 rounded-xl font-bold hover:bg-orange-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-shadow shadow-lg shadow-orange-200 cursor-pointer"
            >
              {isEditing ? 'Save Changes' : 'Create Card'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientFormModal;