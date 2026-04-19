'use client';

import React, { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, Info, Trash2 } from 'lucide-react';
import { uploadTemplate, checkTemplateExists, deleteTemplate } from '@/lib/storage';

export const TemplateManager: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isGuideExpanded, setIsGuideExpanded] = useState(false);
  const [statuses, setStatuses] = useState({
    Clearance: false,
    Indigency: false,
  });
  const [error, setError] = useState<string | null>(null);

  const fetchStatuses = async () => {
    const clearanceExists = await checkTemplateExists('Clearance');
    const indigencyExists = await checkTemplateExists('Indigency');
    setStatuses({
      Clearance: clearanceExists,
      Indigency: indigencyExists,
    });
  };

  useEffect(() => {
    fetchStatuses();
  }, []);

  const handleDelete = async (type: 'Clearance' | 'Indigency') => {
    if (!confirm(`Are you sure you want to delete the ${type} template?`)) return;
    
    try {
      await deleteTemplate(type);
      await fetchStatuses();
    } catch (err) {
      alert('Failed to delete template.');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Validate File Type
    if (!file.name.endsWith('.docx')) {
      setError('Only .docx files (Microsoft Word) are supported.');
      return;
    }

    // 2. Automated Type Identification
    let type: 'Clearance' | 'Indigency' | null = null;
    const fileNameLower = file.name.toLowerCase();
    
    if (fileNameLower.includes('clearance')) {
      type = 'Clearance';
    } else if (fileNameLower.includes('indigency')) {
      type = 'Indigency';
    }

    if (!type) {
      setError('Please rename your file to include "Clearance" or "Indigency" so the system can identify it.');
      return;
    }

    // 3. Upload
    setIsUploading(true);
    setError(null);
    try {
      await uploadTemplate(file, type);
      await fetchStatuses();
      alert(`Success! ${type} template updated.`);
    } catch (err) {
      setError('Failed to upload template. Ensure the "document-templates" bucket exists in Supabase.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
      <div className="bg-slate-900 p-8 text-white flex items-center justify-between">
        <div>
          <h3 className="text-xl font-black tracking-tight">Template Settings</h3>
          <p className="text-slate-400 text-sm font-medium mt-1">Manage official barangay document templates.</p>
        </div>
        <FileText className="w-10 h-10 text-slate-700" />
      </div>

      <div className="p-8">
        {/* 1. TAG GUIDE (Expandable) */}
        <div className={`mb-10 pb-8 border-b border-slate-100 transition-all duration-500 overflow-hidden ${isGuideExpanded ? 'max-h-[2000px]' : 'max-h-[140px]'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-cyan-600" />
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Template Tag Guide</h4>
            </div>
            <button 
              onClick={() => setIsGuideExpanded(!isGuideExpanded)}
              className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer"
            >
              {isGuideExpanded ? 'Minimize Guide' : 'Expand Full Guide'}
            </button>
          </div>
          
          <p className="text-sm text-slate-500 mb-6 font-medium leading-relaxed">
            Open your Microsoft Word document and type these exact tags where you want information to appear. 
            The system will automatically find and replace them with the actual resident data.
          </p>

          <div className="mb-8 p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-3">
            <div className="p-1.5 bg-amber-100 rounded-lg">
              <CheckCircle className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <p className="text-xs font-black text-amber-900 uppercase tracking-tight mb-1">Styling Tip: Making Text Bold</p>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                To make a value appear **BOLD** in the final document, simply **bold the tag itself** in your Word template (e.g. <strong>{'{fullName}'}</strong>). The system inherits the style you apply to the placeholder.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {/* Core Tags */}
            <TagItem tag="{fullName}" label="Resident's Name" />
            <TagItem tag="{age}" label="Current Age" />
            <TagItem tag="{birthday}" label="Month Day, Year" />
            <TagItem tag="{civilStatus}" label="Resident Status" />
            <TagItem tag="{gender}" label="Resident Gender" />
            <TagItem tag="{occupation}" label="Resident's Job" />
            <TagItem tag="{address}" label="Home Address" />
            <TagItem tag="{phoneNo}" label="Mobile Number" />
            
            {/* Context Tags */}
            <TagItem tag="{purpose}" label="Reason for Request" />
            <TagItem tag="{currentDate}" label="Complete Date" />
            <TagItem tag="{day}" label="Day (e.g. 18th)" />
            <TagItem tag="{month}" label="Full Month" />
            <TagItem tag="{year}" label="Full Year" />
            <TagItem tag="{barangay}" label="Barangay Name" />
          </div>
        </div>

        {/* 2. CURRENT STATUS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <StatusCard 
            label="Barangay Clearance" 
            isActive={statuses.Clearance} 
            filename="Clearance_Template.docx" 
            onDelete={() => handleDelete('Clearance')}
          />
          <StatusCard 
            label="Certificate of Indigency" 
            isActive={statuses.Indigency} 
            filename="Indigency_Template.docx" 
            onDelete={() => handleDelete('Indigency')}
          />
        </div>

        {/* 3. UPLOAD AREA */}
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center relative group hover:border-cyan-500 transition-all">
          <input 
            type="file" 
            accept=".docx" 
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          
          <div className="space-y-4">
            <div className="w-20 h-20 bg-white shadow-xl rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              {isUploading ? (
                <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
              ) : (
                <Upload className="w-10 h-10 text-slate-400 group-hover:text-cyan-600 transition-colors" />
              )}
            </div>
            <div>
              <p className="text-lg font-black text-slate-900">
                {isUploading ? 'Uploading Template...' : 'Upload New Template'}
              </p>
              <p className="text-slate-500 font-medium">Click or drag a .docx file here</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-6 flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 font-bold text-sm">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        <div className="mt-8 pt-8 border-t border-slate-100">
          <p className="text-[10px] leading-relaxed font-medium text-slate-400 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <strong>Naming Convention:</strong> The system identifies documents by their name. 
            Make sure your file contains the word <strong>"Clearance"</strong> or <strong>"Indigency"</strong>.
            Uploading a new file will automatically replace the existing version.
          </p>
        </div>
      </div>
    </div>
  );
};

const TagItem = ({ tag, label, isImage = false }: { tag: string; label: string; isImage?: boolean }) => (
  <div className={`bg-slate-50 border p-3 rounded-xl transition-colors ${isImage ? 'border-purple-200 bg-purple-50/30' : 'border-slate-200 hover:border-cyan-300'}`}>
    <code className={`text-xs font-black block mb-1 ${isImage ? 'text-purple-700' : 'text-cyan-700'}`}>{tag}</code>
    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{label}</span>
  </div>
);

const StatusCard = ({ label, isActive, filename, onDelete }: { label: string; isActive: boolean; filename: string; onDelete: () => void }) => (
  <div className={`p-6 rounded-[1.5rem] border-2 flex items-center justify-between ${isActive ? 'bg-emerald-50/50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-xl ${isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
        {isActive ? <CheckCircle className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
      </div>
      <div>
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{isActive ? 'Ready' : 'Missing'}</p>
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
