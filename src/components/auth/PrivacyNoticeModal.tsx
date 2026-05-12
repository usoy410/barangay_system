'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Info, CheckCircle2, AlertCircle, X } from 'lucide-react';

interface PrivacyNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  isLoading?: boolean;
}

/**
 * PrivacyNoticeModal Component
 * Displays a mandatory privacy notice and terms of use before account creation.
 * Ensures the user agrees to data usage, data integrity, and residency.
 */
export default function PrivacyNoticeModal({ isOpen, onClose, onAccept, isLoading }: PrivacyNoticeModalProps) {
  const [agreements, setAgreements] = useState({
    dataUsage: false,
    realData: false,
    resident: false,
  });

  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsAnimating(true), 10);
      document.body.style.overflow = 'hidden';
    } else {
      setIsAnimating(false);
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const allChecked = agreements.dataUsage && agreements.realData && agreements.resident;

  const toggleAgreement = (key: keyof typeof agreements) => {
    setAgreements(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}>
      <div 
        className={`bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh] transition-all duration-500 ease-out ${isAnimating ? 'translate-y-0 scale-100' : 'translate-y-8 scale-[0.98]'}`}
      >
        {/* Header */}
        <div className="bg-cyan-700 p-8 text-white relative flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-lexend font-bold flex items-center gap-3">
              <ShieldCheck className="w-8 h-8" />
              Privacy & Residency Notice
            </h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-cyan-100 font-atkinson font-medium">Pakibasa at tanggapin ang aming mga kondisyon bago magpatuloy.</p>
        </div>

        {/* Content */}
        <div className="p-8 md:p-10 overflow-y-auto space-y-8 font-atkinson">
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-cyan-700 font-lexend font-black text-xs uppercase tracking-widest">
              <Info className="w-4 h-4" />
              How we use your data
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-slate-600 text-sm leading-relaxed space-y-3">
              <p>
                Ang iyong personal na impormasyon (Pangalan, Tirahan, Contact Number, atbp.) ay gagamitin lamang para sa mga sumusunod:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Pagpapatunay ng iyong pagkakakilanlan bilang opisyal na residente ng barangay.</li>
                <li>Pagproseso ng mga dokumento (Clearance, Indigency, atbp.) na iyong hihilingin sa pamamagitan ng portal.</li>
                <li>Pagpapadala ng mahahalagang anunsyo at abiso tungkol sa mga serbisyo ng barangay.</li>
                <li>Pag-monitor at pagtugon sa mga incident reports na iyong isusumite.</li>
              </ul>
              <p className="font-bold text-slate-700">
                Kami ay sumusunod sa Data Privacy Act of 2012. Ang iyong data ay ligtas at hindi ibabahagi sa ibang organisasyon nang walang pahintulot.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-400 font-lexend font-black text-xs uppercase tracking-widest">
              <CheckCircle2 className="w-4 h-4" />
              Agreements
            </div>
            
            <div className="space-y-3">
              {/* Data Usage Agreement */}
              <label 
                className={`flex items-start gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer group ${
                  agreements.dataUsage ? 'border-cyan-500 bg-cyan-50/50' : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                <div className="relative flex items-center justify-center mt-1">
                  <input 
                    type="checkbox"
                    checked={agreements.dataUsage}
                    onChange={() => toggleAgreement('dataUsage')}
                    className="sr-only"
                  />
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                    agreements.dataUsage ? 'bg-cyan-500 border-cyan-500' : 'border-slate-300 group-hover:border-slate-400'
                  }`}>
                    {agreements.dataUsage && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800 text-base leading-tight font-lexend">
                    Naiintindihan ko at tinatanggap kung paano gagamitin ang aking data.
                  </p>
                  <p className="text-slate-500 text-sm mt-1">I accept and understand how this data will be used.</p>
                </div>
              </label>

              {/* Real Data Agreement */}
              <label 
                className={`flex items-start gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer group ${
                  agreements.realData ? 'border-cyan-500 bg-cyan-50/50' : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                <div className="relative flex items-center justify-center mt-1">
                  <input 
                    type="checkbox"
                    checked={agreements.realData}
                    onChange={() => toggleAgreement('realData')}
                    className="sr-only"
                  />
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                    agreements.realData ? 'bg-cyan-500 border-cyan-500' : 'border-slate-300 group-hover:border-slate-400'
                  }`}>
                    {agreements.realData && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800 text-base leading-tight font-lexend">
                    Pinapatunayan ko na ang lahat ng impormasyong aking ibibigay ay totoo.
                  </p>
                  <p className="text-slate-500 text-sm mt-1">I will provide real and accurate data.</p>
                </div>
              </label>

              {/* Residency Agreement */}
              <label 
                className={`flex items-start gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer group ${
                  agreements.resident ? 'border-cyan-500 bg-cyan-50/50' : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                <div className="relative flex items-center justify-center mt-1">
                  <input 
                    type="checkbox"
                    checked={agreements.resident}
                    onChange={() => toggleAgreement('resident')}
                    className="sr-only"
                  />
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                    agreements.resident ? 'bg-cyan-500 border-cyan-500' : 'border-slate-300 group-hover:border-slate-400'
                  }`}>
                    {agreements.resident && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800 text-base leading-tight font-lexend">
                    Ako ay kasalukuyang residente ng barangay na ito.
                  </p>
                  <p className="text-slate-500 text-sm mt-1">I am a bona fide resident of this barangay.</p>
                </div>
              </label>
            </div>
          </section>

          {!allChecked && (
            <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl text-amber-700 text-sm font-medium animate-in fade-in slide-in-from-bottom-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              Kailangang tanggapin ang lahat ng kondisyon bago mag-rehistro.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex-shrink-0">
          <button
            onClick={onAccept}
            disabled={!allChecked || isLoading}
            className={`w-full py-5 rounded-2xl text-xl font-black font-lexend transition-all flex items-center justify-center gap-3 ${
              allChecked 
                ? 'bg-slate-900 text-white hover:bg-slate-800 cursor-pointer active:scale-[0.98]' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                Processing...
              </>
            ) : (
              'Agree & Proceed to Registration'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
