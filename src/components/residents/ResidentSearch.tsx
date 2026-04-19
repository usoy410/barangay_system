'use client';

import React from 'react';
import { Search, Plus } from 'lucide-react';

interface ResidentSearchProps {
  onSearch: (term: string) => void;
  onAddClick: () => void;
}

/**
 * Search and action bar for the Resident Registry.
 * Provides a clean interface for filtering residents and triggering the creation form.
 * 
 * @param onSearch - Callback triggered on search input change.
 * @param onAddClick - Callback triggered when the "Add Resident" button is clicked.
 */
export const ResidentSearch: React.FC<ResidentSearchProps> = ({ 
  onSearch, 
  onAddClick 
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
      <div className="relative w-full md:max-w-md group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-cyan-600 transition-colors">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          placeholder="Search by name..."
          onChange={(e) => onSearch(e.target.value)}
          className="block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-cyan-100 focus:border-cyan-500 transition-all sm:text-sm"
        />
      </div>
      
      <button
        onClick={onAddClick}
        className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-xl shadow-lg shadow-cyan-200 transition-all active:scale-95 cursor-pointer"
      >
        <Plus className="w-5 h-5" />
        <span>Add Resident</span>
      </button>
    </div>
  );
};
