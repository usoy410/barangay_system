'use client';

import React from 'react';
import { Shield, FileText, Loader2 } from 'lucide-react';
import type { RequestWithResident } from '@/lib/requests';
import { generateDocx, generateDocxBlob } from '@/lib/doc-generator';
import { getTemplateUrl, checkTemplateExists, uploadPreviewDoc } from '@/lib/storage';
import { prepareTemplateData } from '@/lib/utils/doc-utils';
import { PreviewToolbar } from './PreviewToolbar';

interface DocumentPreviewerProps {
  /** The full request object including resident details */
  request: RequestWithResident;
  /** Callback to close the preview modal */
  onClose: () => void;
  /** Callback to handle document issuance */
  onIssue: (id: string) => void;
}

/**
 * A modal component that generates and displays a high-fidelity preview of a .docx document.
 * Leverages Google Docs Viewer for embedding and Docxtemplater for server-side-less generation.
 */
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
        const response = await fetch(cloudUrl, { cache: 'no-store' });
        
        if (!response.ok) {
          throw new Error(`Failed to download template: ${response.statusText}`);
        }

        const templateBuffer = await response.arrayBuffer();
        
        // ZIP Signature Check: Every .docx must start with 'PK' (0x50 0x4B)
        const signature = new Uint8Array(templateBuffer.slice(0, 2));
        if (signature[0] !== 0x50 || signature[1] !== 0x4B) {
          throw new Error('The template file in Supabase is corrupted or access was denied. Please re-upload it.');
        }

        const data = prepareTemplateData(request);
        const blob = await generateDocxBlob(templateBuffer, data);
        const url = await uploadPreviewDoc(blob, `preview_${request.id}.docx`);
        
        setPreviewUrl(`https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`);
      } catch (err: any) {
        setPreviewError('Failed to generate real-time preview. Please check your internet connection.');
      }
    };

    generatePreview();
  }, [request]);

  /**
   * Finalizes the document and triggers a browser download.
   */
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
      alert(error.message || 'An error occurred during document generation.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-10">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-5xl h-full flex flex-col bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-white/20">
        
        <PreviewToolbar 
          documentType={request.type}
          isGenerating={isGenerating}
          status={request.status}
          requestId={request.id}
          onClose={onClose}
          onHandleDownload={handleDownload}
          onIssue={onIssue}
        />

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
