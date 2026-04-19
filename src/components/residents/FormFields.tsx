import React from 'react';

/**
 * A standard text or date input field with consistent styling.
 */
export const InputField = ({ label, ...props }: any) => (
  <div>
    <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
    <input
      {...props}
      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-cyan-100 focus:border-cyan-500 outline-none transition-all text-slate-900"
    />
  </div>
);

/**
 * A standard dropdown select field with consistent styling.
 */
export const SelectField = ({ label, options, ...props }: any) => (
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
