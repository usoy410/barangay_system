'use client';

import React, { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import type { Resident } from '@/types/database';

interface ResidentFormProps {
  initialData?: Partial<Resident>;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  title: string;
}

/**
 * A comprehensive form for adding or editing residents.
 * Includes basic validation and a clean, split-column layout for readability.
 * 
 * @param initialData - Existing data if editing, or empty for new resident.
 * @param onSubmit - Async callback when the form is submitted.
 * @param onCancel - Callback when the form is closed/cancelled.
 * @param title - Form title (e.g., "Add New Resident").
 */
export const ResidentForm: React.FC<ResidentFormProps> = ({ 
  initialData = {}, 
  onSubmit, 
  onCancel,
  title 
}) => {
  const [formData, setFormData] = useState({
    first_name: initialData.first_name || '',
    middle_name: initialData.middle_name || '',
    last_name: initialData.last_name || '',
    birth_date: initialData.birth_date || '',
    gender: initialData.gender || 'Male',
    civil_status: initialData.civil_status || 'Single',
    address: initialData.address || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(formData);
      onCancel(); // Close form on success
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving the resident.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0">
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          <button onClick={onCancel} className="p-2 hover:bg-slate-100 rounded-full transition-colors cursor-pointer">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-800 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} required />
            <InputField label="Middle Name" name="middle_name" value={formData.middle_name} onChange={handleChange} />
            <InputField label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} required />
            <InputField label="Birth Date" name="birth_date" type="date" value={formData.birth_date} onChange={handleChange} required />
            
            <SelectField 
              label="Gender" 
              name="gender" 
              value={formData.gender} 
              onChange={handleChange} 
              options={['Male', 'Female', 'Other']} 
            />
            
            <SelectField 
              label="Civil Status" 
              name="civil_status" 
              value={formData.civil_status} 
              onChange={handleChange} 
              options={['Single', 'Married', 'Widowed', 'Separated']} 
            />

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Home Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-cyan-100 focus:border-cyan-500 outline-none transition-all resize-none h-24 text-slate-900"
                placeholder="Zone, Street, Barangay, City/Municipality"
              />
            </div>
          </div>

          <div className="mt-8 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-8 py-2.5 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white font-semibold rounded-xl shadow-lg shadow-cyan-100 transition-all active:scale-95 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : 'Save Resident'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Helper Components ---

const InputField = ({ label, ...props }: any) => (
  <div>
    <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
    <input
      {...props}
      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-cyan-100 focus:border-cyan-500 outline-none transition-all text-slate-900"
    />
  </div>
);

const SelectField = ({ label, options, ...props }: any) => (
  <div>
    <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
    <select
      {...props}
      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-cyan-100 focus:border-cyan-500 outline-none transition-all bg-white text-slate-900"
    >
      {options.map((opt: string) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);
