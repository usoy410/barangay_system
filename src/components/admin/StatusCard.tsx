import React from 'react';
import { CheckCircle, AlertCircle, Trash2 } from 'lucide-react';

interface StatusCardProps {
  /** The name of the document type */
  label: string;
  /** Whether the template is currently active/uploaded */
  isActive: boolean;
  /** The filename of the current template */
  filename: string;
  /** Callback for when the delete button is clicked */
  onDelete: () => void;
}

/**
 * A card displaying the status of a document template (Ready or Missing).
 */
export const StatusCard: React.FC<StatusCardProps> = ({ 
  label, 
  isActive, 
  filename, 
  onDelete 
}) => (
  <div className={`p-6 rounded-[1.5rem] border-2 flex items-center justify-between ${
    isActive ? 'bg-emerald-50/50 border-emerald-100' : 'bg-slate-50 border-slate-100'
  }`}>
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-xl ${
        isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
      }`}>
        {isActive ? <CheckCircle className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
      </div>
      <div>
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
          {isActive ? 'Ready' : 'Missing'}
        </p>
        <h4 className="font-bold text-slate-900">{label}</h4>
        {isActive && <p className="text-[10px] text-slate-500 font-mono mt-1">{filename}</p>}
      </div>
    </div>

    {isActive && (
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
        title="Delete Template"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    )}
  </div>
);
