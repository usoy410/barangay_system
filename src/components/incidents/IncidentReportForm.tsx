'use client';

import React, { useState } from 'react';
import { ShieldAlert, Save, X } from 'lucide-react';

interface IncidentReportFormProps {
  onSubmit: (data: { reporter_name: string; title: string; description: string }) => Promise<void>;
  onCancel: () => void;
}

/**
 * A specialized form for reporting incidents to the Barangay.
 * Focused on speed and clarity to encourage reporting.
 */
export const IncidentReportForm: React.FC<IncidentReportFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    reporter_name: '',
    title: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onCancel();
    } catch (error) {
      console.error('Report submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 text-red-600 rounded-2xl">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Report Incident</h2>
            </div>
            <button onClick={onCancel} className="p-2 hover:bg-slate-50 rounded-full transition-colors cursor-pointer">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Reporter Name</label>
              <input
                required
                type="text"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-red-50 focus:border-red-500 outline-none transition-all font-semibold"
                placeholder="Your full name"
                value={formData.reporter_name}
                onChange={(e) => setFormData({ ...formData, reporter_name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Issue Title</label>
              <input
                required
                type="text"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-red-50 focus:border-red-500 outline-none transition-all font-semibold"
                placeholder="Brief summary of the issue"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Details</label>
              <textarea
                required
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-red-50 focus:border-red-500 outline-none transition-all h-32 resize-none font-medium"
                placeholder="Describe what happened, where, and when..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-black rounded-2xl shadow-xl shadow-red-200 transition-all active:scale-95 cursor-pointer"
            >
              <Save className="w-5 h-5" />
              <span>{isSubmitting ? 'SUBMITTING...' : 'SUBMIT REPORT'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
