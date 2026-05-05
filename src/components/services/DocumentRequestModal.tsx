'use client';

import React, { useState } from 'react';
import { FileText, X, AlertCircle, Search, PlusCircle } from 'lucide-react';
import { submitServiceRequest } from '@/lib/requests';
import type { Resident } from '@/types/database';
import { SuccessVideoModal } from '../ui/SuccessVideoModal';

interface DocumentRequestModalProps {
  residents: Resident[];
  onClose: () => void;
  onRequestAdded: () => void;
}

/**
 * Modal component for requesting and generating official documents.
 * Allows users to search for a resident, specify a purpose, and download the PDF.
 * 
 * @param residents - Array of residents to search from.
 * @param onClose - Callback to close the modal.
 */
export const DocumentRequestModal: React.FC<DocumentRequestModalProps> = ({ residents, onClose, onRequestAdded }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
  const [docType, setDocType] = useState<'Clearance' | 'Indigency'>('Clearance');
  const [purpose, setPurpose] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const filteredResidents = residents.filter(r => 
    `${r.first_name} ${r.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 5);

  const handleSubmit = async () => {
    if (!selectedResident || !purpose) return;

    setIsGenerating(true);
    try {
      await submitServiceRequest({
        resident_id: selectedResident.id,
        type: docType,
        purpose,
      });
      
      onRequestAdded();
      setShowSuccess(true);
    } catch (error) {
      console.error('Failed to submit request', error);
      alert('Failed to add request to the queue.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <SuccessVideoModal 
        isOpen={showSuccess} 
        onClose={onClose}
        title="Document Queued!"
        message={`${docType} request for ${selectedResident?.first_name} has been added to the processing queue.`}
      />
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Issue Document</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Resident Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Search Resident</label>
            {!selectedResident ? (
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Type name..."
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-cyan-100 focus:border-cyan-500 outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 shadow-xl rounded-xl z-10 overflow-hidden">
                    {filteredResidents.map(r => (
                      <button
                        key={r.id}
                        className="w-full px-4 py-2.5 text-left hover:bg-cyan-50 flex items-center gap-3 transition-colors"
                        onClick={() => setSelectedResident(r)}
                      >
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold">
                          {r.first_name[0]}{r.last_name[0]}
                        </div>
                        <span className="text-sm font-medium">{r.first_name} {r.last_name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-cyan-50 border border-cyan-100 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold">
                    {selectedResident.first_name[0]}{selectedResident.last_name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-cyan-900">{selectedResident.first_name} {selectedResident.last_name}</p>
                    <p className="text-xs text-cyan-700">{selectedResident.address}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedResident(null)} className="text-xs font-semibold text-cyan-600 hover:underline">Change</button>
              </div>
            )}
          </div>

          {/* Document Type */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setDocType('Clearance')}
              className={`py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                docType === 'Clearance' ? 'border-cyan-600 bg-cyan-50 text-cyan-700' : 'border-slate-100 text-slate-500 grayscale'
              }`}
            >
              Barangay Clearance
            </button>
            <button
              onClick={() => setDocType('Indigency')}
              className={`py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                docType === 'Indigency' ? 'border-cyan-600 bg-cyan-50 text-cyan-700' : 'border-slate-100 text-slate-500 grayscale'
              }`}
            >
              Indigency Cert.
            </button>
          </div>

          {/* Purpose */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Purpose of Request</label>
            <textarea
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-cyan-100 focus:border-cyan-500 outline-none h-24 resize-none"
              placeholder="e.g. For employment, scholarship, etc."
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            disabled={!selectedResident || !purpose || isGenerating}
            onClick={handleSubmit}
            className="flex items-center gap-2 px-8 py-3 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-cyan-100 transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{isGenerating ? 'Adding to Queue...' : 'Add to Queue'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
