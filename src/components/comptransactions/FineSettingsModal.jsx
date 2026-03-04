import React from 'react';
import { Settings } from 'lucide-react';

const FineSettingsModal = ({ isOpen, onClose, settings, setSettings, onSave }) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave(settings);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-orange-50 border border-orange-200 w-full max-w-md rounded-2xl p-8 shadow-2xl my-auto relative animate-in zoom-in duration-200">

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-orange-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-orange-200">
            <Settings size={24} />
          </div>
          <h2 className="text-2xl font-bold text-orange-950">
            Fine Rules
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-orange-900 mb-1 ml-1">
              Fine per day ({settings.currency || '$'})
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              className="w-full p-3 rounded-xl border border-orange-200 bg-white outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all shadow-sm font-bold text-orange-950"
              value={settings.fineAmount || 0}
              onChange={(e) => setSettings({ ...settings, fineAmount: Number(e.target.value) })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-orange-900 mb-1 ml-1">
              Grace period (days)
            </label>
            <input
              type="number"
              min="0"
              className="w-full p-3 rounded-xl border border-orange-200 bg-white outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all shadow-sm font-bold text-orange-950"
              value={settings.gracePeriod || 0}
              onChange={(e) => setSettings({ ...settings, gracePeriod: Number(e.target.value) })}
            />
          </div>

          <p className="text-[11px] text-orange-800/60 italic px-1 pt-2 leading-relaxed">
            * Fines will be automatically calculated based on the <strong>due date</strong> stored in the database.
          </p>

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
              Apply Rules
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FineSettingsModal;