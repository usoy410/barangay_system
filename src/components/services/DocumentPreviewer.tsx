'use client';

import React from 'react';
import { X, Printer, Download, CheckCircle, Shield, FileText, FileDown, Loader2 } from 'lucide-react';
import type { RequestWithResident } from '@/lib/requests';
import { generateDocx, generateDocxBlob } from '@/lib/doc-generator';
import { getTemplateUrl, checkTemplateExists, uploadPreviewDoc } from '@/lib/storage';

interface DocumentPreviewerProps {
  request: RequestWithResident;
  onClose: () => void;
  onIssue: (id: string) => void;
}

export const DocumentPreviewer: React.FC<DocumentPreviewerProps> = ({ 
  request, 
  onClose, 
  onIssue 
}) => {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [previewError, setPreviewError] = React.useState<string | null>(null);

  // Auto-generate preview on mount
  React.useEffect(() => {
    const generatePreview = async () => {
      try {
        const type = request.type;
        const exists = await checkTemplateExists(type);
        if (!exists) {
          setPreviewError(`Template for ${type} not found in cloud storage.`);
          return;
        }

        const cloudUrl = await getTemplateUrl(type);
        // Remove query param to ensure Supabase doesn't misinterpret the filename
        const response = await fetch(cloudUrl, { cache: 'no-store' });
        
        if (!response.ok) {
          throw new Error(`Failed to download template: ${response.statusText}`);
        }

        const templateBuffer = await response.arrayBuffer();
        
        // ZIP Signature Check: Every .docx must start with 'PK' (0x50 0x4B)
        const signature = new Uint8Array(templateBuffer.slice(0, 2));
        if (signature[0] !== 0x50 || signature[1] !== 0x4B) {
          const textContent = new TextDecoder().decode(templateBuffer.slice(0, 200));
          console.error('INVALID DOCX SIGNATURE. Received:', textContent);
          throw new Error('The template file in Supabase is corrupted or access was denied. Please re-upload it.');
        }

        const data = prepareTemplateData(request);

        const blob = await generateDocxBlob(templateBuffer, data);
        const url = await uploadPreviewDoc(blob, `preview_${request.id}.docx`);
        
        // Construct Google Viewer URL
        setPreviewUrl(`https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`);
      } catch (err: any) {
        console.error('Preview error:', err);
        setPreviewError('Failed to generate real-time preview. Please check your internet connection.');
      }
    };

    generatePreview();
  }, [request]);

  const handleDownload = async () => {
    setIsGenerating(true);
    const type = request.type;
    
    try {
      const cloudUrl = await getTemplateUrl(type);
      const response = await fetch(cloudUrl, { cache: 'no-store' });
      
      if (!response.ok) {
        throw new Error(`Failed to download template: ${response.statusText}`);
      }

      const templateBuffer = await response.arrayBuffer();

      // ZIP Signature Check
      const signature = new Uint8Array(templateBuffer.slice(0, 2));
      if (signature[0] !== 0x50 || signature[1] !== 0x4B) {
        throw new Error('The template file in Supabase is corrupted. Please re-upload it.');
      }

      const data = prepareTemplateData(request);

      await generateDocx(
        templateBuffer, 
        data, 
        `${type}_Official_${request.residents.last_name}.docx`
      );
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'An error occurred during document generation.');
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Helper to format data for use in .docx templates.
   */
  const prepareTemplateData = (req: RequestWithResident) => {
    const now = new Date();
    const day = now.getDate();
    const month = now.toLocaleDateString('en-US', { month: 'long' });
    const year = now.getFullYear();

    const getOrdinal = (n: number) => {
      const s = ['th', 'st', 'nd', 'rd'];
      const v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    return {
      fullName: `${req.residents.first_name} ${req.residents.last_name}`,
      purpose: req.purpose,
      day: getOrdinal(day),
      month: month,
      year: year,
      barangay: 'San Juan', // You can change this to your actual Barangay name
      currentDate: `${month} ${day}, ${year}`,
    };
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-10">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={onClose} />
      
      {/* Container */}
      <div className="relative w-full max-w-5xl h-full flex flex-col bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-white/20">
        
        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-50 rounded-xl">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 leading-tight truncate max-w-[200px] sm:max-w-none">
                {request.type} Preview
              </h3>
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest leading-none mt-1">Real Word Document</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handleDownload}
              disabled={isGenerating}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all disabled:opacity-50"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
              <span className="hidden sm:inline">Download DOCX</span>
            </button>

            {request.status === 'Pending' && (
              <button 
                onClick={() => onIssue(request.id)}
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

        {/* Real-time Preview Area */}
        <div className="flex-grow bg-slate-100 flex items-center justify-center relative">
          {previewUrl ? (
            <iframe 
              src={previewUrl}
              className="w-full h-full border-none"
              title="Official Document Preview"
            />
          ) : previewError ? (
            <div className="text-center p-8">
              <Shield className="w-16 h-16 mx-auto text-red-200 mb-4" />
              <p className="text-slate-500 font-bold">{previewError}</p>
              {/* Fallback to Download */}
              <button 
                onClick={handleDownload}
                className="mt-4 text-blue-600 font-bold hover:underline"
              >
                Download directly to check layout
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-slate-200 border-t-cyan-600 rounded-full animate-spin" />
                <FileText className="absolute inset-0 m-auto w-8 h-8 text-cyan-600" />
              </div>
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest animate-pulse">
                Preparing High-Fidelity Preview...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
