'use client';

import React, { useState } from 'react';
import { Phone, MessageSquare, Copy, Check, ChevronDown, User } from 'lucide-react';
import { Resident } from '@/types/database';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for Tailwind class merging
 */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface OfficialDirectoryProps {
  officials: Resident[];
}

/**
 * OfficialDirectory Component
 * Displays a list of barangay officials with contact options and Tagalog templates.
 */
export const OfficialDirectory: React.FC<OfficialDirectoryProps> = ({ officials }) => {
  const [selectedOfficial, setSelectedOfficial] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const templates = [
    {
      title: "Pagtatanong (General Inquiry)",
      text: (name: string) => `Magandang araw po, ${name}. Nais ko po sanang mag-inquire tungkol sa [Paksa]. Maraming salamat po!`,
      short: "Magandang araw po..."
    },
    {
      title: "Pag-ulat ng Problema (Report a Problem)",
      text: (name: string) => `Magandang araw po, ${name}. Nais ko po sanang i-ulat ang tungkol sa [Problema/Insidente] sa aming lugar. Salamat po.`,
      short: "Nais ko po sanang i-ulat..."
    },
    {
      title: "Hingi ng Dokumento (Document Status)",
      text: (name: string) => `Magandang araw po, ${name}. Itatanong ko po sana kung maaari nang makuha ang aking requested [Dokumento]. Salamat po.`,
      short: "Itatanong ko po sana..."
    }
  ];

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <User className="w-6 h-6 text-sky-600" />
          Opisyal ng Barangay
        </h2>
        <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded-full uppercase tracking-wider">
          Konektado Kita
        </span>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {officials.length === 0 ? (
          <div className="bg-white p-10 rounded-3xl border-2 border-dashed border-slate-200 text-center space-y-2">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
              <User className="w-8 h-8" />
            </div>
            <p className="text-slate-500 font-medium">Kasalukuyang walang nakatalagang opisyal sa listahan.</p>
          </div>
        ) : (
          officials.map((official) => (
            <div 
              key={official.id} 
              className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-sky-50 rounded-full flex items-center justify-center text-sky-600 border border-sky-100 overflow-hidden">
                    {official.profile_url ? (
                      <img src={official.profile_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 leading-tight">
                      {official.first_name} {official.last_name}
                    </h3>
                    <p className="text-sky-600 text-sm font-medium uppercase tracking-wider">
                      {official.occupation || (official.role === 'Admin' ? 'Administrator' : 'Barangay Official')}
                    </p>
                  </div>
                </div>
                
                <button 
                  onClick={() => setSelectedOfficial(selectedOfficial === official.id ? null : official.id)}
                  className={cn(
                    "p-2 rounded-full transition-colors",
                    selectedOfficial === official.id ? "bg-slate-100 text-slate-600" : "bg-sky-50 text-sky-600"
                  )}
                >
                  <ChevronDown className={cn("w-6 h-6 transition-transform", selectedOfficial === official.id && "rotate-180")} />
                </button>
              </div>

              {selectedOfficial === official.id && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-50 bg-slate-50/50 animate-in slide-in-from-top-2 duration-200">
                  <div className="flex flex-col gap-4 mt-2">
                    {/* Contact Actions */}
                    <div className="grid grid-cols-2 gap-3">
                      <a 
                        href={`tel:${official.mobile_number}`}
                        className="flex items-center justify-center gap-2 bg-white border border-slate-200 p-3 rounded-xl hover:border-sky-300 hover:text-sky-600 transition-all font-semibold shadow-sm"
                      >
                        <Phone className="w-5 h-5" />
                        Tawagan
                      </a>
                      <a 
                        href={`sms:${official.mobile_number}`}
                        className="flex items-center justify-center gap-2 bg-sky-600 text-white p-3 rounded-xl hover:bg-sky-700 transition-all font-semibold shadow-sm"
                      >
                        <MessageSquare className="w-5 h-5" />
                        Mag-text
                      </a>
                    </div>

                    <div className="space-y-3">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Tagalog Text Templates</p>
                      {templates.map((template, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-2">
                          <div className="flex justify-between items-start">
                            <h4 className="text-sm font-bold text-slate-800">{template.title}</h4>
                            <button 
                              onClick={() => handleCopy(template.text(`${official.first_name}`), idx)}
                              className="text-slate-400 hover:text-sky-600 transition-colors"
                            >
                              {copiedIndex === idx ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                          <p className="text-sm text-slate-600 italic">
                            "{template.text(official.first_name)}"
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
