'use client';

import React from 'react';
import { X, Printer, Download, CheckCircle, Shield, FileText, FileDown, Loader2 } from 'lucide-react';
import type { RequestWithResident } from '@/lib/requests';
import { generateDocx } from '@/lib/doc-generator';
import { getTemplateUrl, checkTemplateExists } from '@/lib/storage';

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

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    const type = request.type;
    
    try {
      // 1. Check if template exists in cloud storage
      const exists = await checkTemplateExists(type);
      if (!exists) {
        throw new Error(
          `No template found in cloud storage for ${type}. Please upload one in the Template Settings section.`
        );
      }

      // 2. Get the Cloud URL and Fetch
      const cloudUrl = await getTemplateUrl(type);
      const response = await fetch(cloudUrl);
      
      if (!response.ok) throw new Error('Failed to download template from cloud.');

      const templateBuffer = await response.arrayBuffer();

      // 3. Prepare Data
      const data = {
        fullName: `${request.residents.first_name} ${request.residents.last_name}`,
        purpose: request.purpose,
        currentDate: new Date().toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }),
      };

      // 4. Generate
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

  const today = new Date().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-10">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={onClose} />
      
      {/* G-Drive Style Content Container */}
      <div className="relative w-full max-w-5xl h-full flex flex-col bg-[#F8F9FA] rounded-[1.5rem] shadow-2xl overflow-hidden border border-white/20 print:m-0 print:p-0 print:shadow-none print:rounded-none">
        
        {/* Toolbar (Hidden in Print) */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-slate-100 rounded-lg">
              <FileText className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 leading-tight">{request.type} - {request.residents.last_name}</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">Preview Mode</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handleDownload}
              disabled={isGenerating}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
              <span>Download Official (.docx)</span>
            </button>

            <button 
              onClick={handlePrint}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Print HTML Version"
            >
              <Printer className="w-5 h-5" />
            </button>
            <div className="w-px h-6 bg-slate-200 mx-1" />
            {request.status === 'Pending' && (
              <button 
                onClick={() => onIssue(request.id)}
                className="flex items-center gap-2 px-6 py-2 bg-cyan-600 text-white font-bold rounded-xl hover:bg-cyan-700 transition-all cursor-pointer shadow-lg shadow-cyan-600/20 active:scale-95"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Issue Document</span>
              </button>
            )}
            <button 
              onClick={onClose}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Area */}
        <div className="flex-grow overflow-y-auto p-4 md:p-12 flex justify-center bg-[#F1F3F4] print:bg-white print:p-0 print:overflow-visible">
          
          {/* THE OFFICIAL DOCUMENT PAPER */}
          <div id="printable-area" className="w-full max-w-[8.5in] min-h-[11in] bg-white shadow-lg p-[1in] flex flex-col font-serif text-slate-900 border border-slate-200 print:shadow-none print:border-none print:p-0 print:m-0">
            
            {/* Header */}
            <div className="text-center mb-16 border-b-2 border-slate-900 pb-8 flex flex-col items-center">
              <Shield className="w-16 h-16 text-slate-900 mb-4 print:w-12 print:h-12" />
              <p className="text-sm font-bold uppercase tracking-[0.3em] mb-1">Republic of the Philippines</p>
              <p className="text-xs uppercase tracking-widest mb-1">Province of Example</p>
              <p className="text-xs uppercase tracking-widest mb-4">Municipality of Example</p>
              <h1 className="text-2xl font-black uppercase tracking-[0.1em]">Office of the Barangay Captain</h1>
            </div>

            {/* Document Title */}
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold uppercase tracking-[0.1em] border-y-2 border-slate-100 py-4">
                {request.type === 'Clearance' ? 'BARANGAY CLEARANCE' : 'CERTIFICATE OF INDIGENCY'}
              </h2>
            </div>

            {/* Body */}
            <div className="flex-grow space-y-8 text-lg leading-relaxed text-justify">
              <p className="font-bold">TO WHOM IT MAY CONCERN:</p>
              
              {request.type === 'Clearance' ? (
                <p>
                  This is to certify that <span className="font-bold underline decoration-2 underline-offset-4">{request.residents.first_name} {request.residents.last_name}</span>, 
                  of legal age, resident of <span className="font-bold">{request.residents.address}</span>, is a person of good moral character 
                  and has no derogatory record files in this office as of this date.
                </p>
              ) : (
                <p>
                  This is to certify that <span className="font-bold underline decoration-2 underline-offset-4">{request.residents.first_name} {request.residents.last_name}</span>, 
                  of legal age, resident of <span className="font-bold">{request.residents.address}</span>, is one of those belonging to the 
                  indigent families in this Barangay.
                </p>
              )}

              <p>
                This certification is issued upon the request of the above-named person for <span className="font-bold italic">"{request.purpose}"</span> and 
                for whatever legal purpose it may serve.
              </p>

              <p>
                Given this <span className="font-bold">{today}</span> at the Barangay Hall of Example Municipality.
              </p>
            </div>

            {/* Signature Area */}
            <div className="mt-24 self-end text-center min-w-[300px]">
              <div className="w-full border-b-2 border-slate-900 mb-2" />
              <p className="font-black text-xl uppercase">Hon. Juan Dela Cruz</p>
              <p className="text-sm uppercase tracking-widest text-slate-500">Barangay Captain</p>
            </div>

            {/* Footer / Watermark Placeholder */}
            <div className="mt-auto pt-20 flex justify-between items-end opacity-20">
              <div className="text-[10px] font-mono">
                TRN: {request.id.slice(0, 12).toUpperCase()}<br />
                GEN-AUTO-BIS-2026
              </div>
              <Shield className="w-12 h-12" />
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-area, #printable-area * {
            visibility: visible;
          }
          #printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: auto;
            margin: 0;
            padding: 0;
          }
          @page {
            size: auto;
            margin: 1in;
          }
        }
      `}</style>
    </div>
  );
};
