import React from 'react';
import { X, FileText, FileDown, CheckCircle, Loader2 } from 'lucide-react';

interface PreviewToolbarProps {
  /** The type of document being previewed */
  documentType: string;
  /** Whether the document is currently being generated/downloaded */
  isGenerating: boolean;
  /** The status of the request (e.g., "Pending") */
  status: string;
  /** ID of the request */
  requestId: string;
  /** Callback to close the previewer */
  onClose: () => void;
  /** Callback to handle document download */
  onHandleDownload: () => void;
  /** Callback to handle document issuance */
  onIssue: (id: string) => void;
}

/**
 * Toolbar component for the Document Previewer.
 * Displays document title, download action, and issuance action.
 */
export const PreviewToolbar: React.FC<PreviewToolbarProps> = ({
  documentType,
  isGenerating,
  status,
  requestId,
  onClose,
  onHandleDownload,
  onIssue,
}) => (
  <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-100">
    <div className="flex items-center gap-4">
      <div className="p-2 bg-blue-50 rounded-xl">
        <FileText className="w-5 h-5 text-blue-600" />
      </div>
      <div>
        <h3 className="font-bold text-slate-900 leading-tight truncate max-w-[200px] sm:max-w-none">
          {documentType} Preview
        </h3>
        <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest leading-none mt-1">
          Real Word Document
        </p>
      </div>
    </div>
    
    <div className="flex items-center gap-2">
      <button 
        onClick={onHandleDownload}
        disabled={isGenerating}
        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all disabled:opacity-50"
      >
        {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
        <span className="hidden sm:inline">Download DOCX</span>
      </button>

      {status === 'Pending' && (
        <button 
          onClick={() => onIssue(requestId)}
          className="flex items-center gap-2 px-6 py-2 bg-cyan-600 text-white font-bold rounded-xl hover:bg-cyan-700 transition-all shadow-lg shadow-cyan-600/20"
        >
          <CheckCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Issue</span>
        </button>
      )}
      
      <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block" />
      
      <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
        <X className="w-6 h-6" />
      </button>
    </div>
  </div>
);
