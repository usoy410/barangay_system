'use client';

import React from 'react';
import { User, Edit2, Archive, Phone } from 'lucide-react';
import type { Resident } from '@/types/database';

interface ResidentTableProps {
  residents: Resident[];
  onEdit: (resident: Resident) => void;
  onArchive: (id: string) => void;
  isLoading?: boolean;
}

/**
 * A professional, accessible table for displaying resident records.
 * Follows the "Accessible & Ethical" design pattern with high contrast and readable text.
 * 
 * @param residents - Array of resident records to display.
 * @param onEdit - Callback when the edit button is clicked.
 * @param onArchive - Callback when the archive button is clicked.
 */
export const ResidentTable: React.FC<ResidentTableProps> = ({ 
  residents, 
  onEdit, 
  onArchive,
  isLoading 
}) => {
  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center animate-pulse bg-slate-50 rounded-lg">
        <p className="text-slate-400 font-medium">Loading resident registry...</p>
      </div>
    );
  }

  if (residents.length === 0) {
    return (
      <div className="w-full py-12 text-center bg-white border-2 border-dashed border-slate-200 rounded-xl">
        <User className="w-12 h-12 mx-auto text-slate-300 mb-4" />
        <h3 className="text-lg font-semibold text-slate-900">No Residents Found</h3>
        <p className="text-slate-500">Try adjusting your search or add a new resident.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
      <table className="w-full text-left border-collapse bg-white">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="px-6 py-4 text-sm font-semibold text-slate-900">Full Name</th>
            <th className="px-6 py-4 text-sm font-semibold text-slate-900">Civil Status</th>
            <th className="px-6 py-4 text-sm font-semibold text-slate-900">Occupation</th>
            <th className="px-6 py-4 text-sm font-semibold text-slate-900">Address</th>
            <th className="px-6 py-4 text-sm font-semibold text-slate-900 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {residents.map((resident) => (
            <tr 
              key={resident.id} 
              className="hover:bg-cyan-50/50 transition-colors duration-200 group"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-700 font-bold">
                    {resident.first_name[0]}{resident.last_name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">
                      {resident.last_name}, {resident.first_name} {resident.middle_name || ''}
                    </div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider">
                      ID: {resident.id.slice(0, 8)}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                  {resident.civil_status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  resident.occupation === 'Student' ? 'bg-blue-100 text-blue-800' :
                  resident.occupation === 'Employed' ? 'bg-emerald-100 text-emerald-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {resident.occupation || 'N/A'}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">
                {resident.address}
              </td>
              <td className="px-6 py-4 text-right space-x-2">
                <button
                  onClick={() => onEdit(resident)}
                  className="p-2 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-all duration-200 cursor-pointer"
                  title="Edit Resident"
                  aria-label={`Edit ${resident.first_name}`}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onArchive(resident.id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 cursor-pointer"
                  title="Archive Resident"
                  aria-label={`Archive ${resident.first_name}`}
                >
                  <Archive className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
