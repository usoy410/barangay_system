'use client';

import React, { useState } from 'react';
import { FileText, ShieldCheck, Award, CheckCircle } from 'lucide-react';
import CitizenBottomNav from '@/components/CitizenBottomNav';
import { submitServiceRequest } from '@/lib/requests';
import { getResidents } from '@/lib/residents';

export default function CitizenServices() {
  const [selectedService, setSelectedService] = useState<'Clearance' | 'Indigency' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  const [purpose, setPurpose] = useState('');
  const [fullName, setFullName] = useState('');

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { data: residents } = await getResidents({ limit: 1 });
      const residentId = residents[0]?.id;

      if (!residentId) throw new Error('No residents found.');

      const result = await submitServiceRequest({
        resident_id: residentId,
        type: selectedService!,
        purpose: purpose,
      });

      setTrackingId(result.id.slice(0, 8).toUpperCase());
      setIsSubmitting(false);
      setSubmitted(true);
    } catch (error) {
      console.error('Submission failed:', error);
      alert('Failed to submit request.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-atkinson pb-24 md:pb-0">
      <header className="bg-sky-700 text-white pt-12 pb-8 px-6 rounded-b-[2rem] shadow-md">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="w-8 h-8 opacity-80" />
          <h1 className="text-3xl font-bold">Services</h1>
        </div>
        <p className="text-sky-100 text-lg">Request official barangay documents online.</p>
      </header>

      <main className="flex-grow max-w-3xl w-full mx-auto px-6 py-8">
        {!selectedService ? (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Select a Document</h2>
            
            <button 
              onClick={() => setSelectedService('Clearance')}
              className="w-full text-left bg-white border-2 border-slate-200 p-6 rounded-2xl flex flex-col gap-4 hover:border-sky-500 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-sky-600" />
                <h3 className="text-xl font-bold text-slate-900">Barangay Clearance</h3>
              </div>
              <p className="text-slate-600 text-base">For employment, business, or official requirements.</p>
            </button>

            <button 
              onClick={() => setSelectedService('Indigency')}
              className="w-full text-left bg-white border-2 border-slate-200 p-6 rounded-2xl flex flex-col gap-4 hover:border-sky-500 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8 text-green-600" />
                <h3 className="text-xl font-bold text-slate-900">Certificate of Indigency</h3>
              </div>
              <p className="text-slate-600 text-base">For social services, scholarships, or medical assistance.</p>
            </button>
          </div>
        ) : (
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm">
            <button 
              onClick={() => {
                setSelectedService(null);
                setSubmitted(false);
              }}
              className="text-sky-700 font-bold mb-6 text-sm flex items-center cursor-pointer"
            >
              &larr; Back to Services
            </button>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Request {selectedService}</h2>
            <p className="text-slate-600 mb-6 font-medium">Please fill out your details to process the request.</p>
            
            {submitted ? (
              <div className="text-center py-10 space-y-6">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">Request Submitted!</h3>
                <div className="bg-slate-50 p-6 rounded-2xl border-2 border-dashed border-slate-200">
                  <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-1">Tracking Number</p>
                  <p className="text-3xl font-black text-sky-700 tracking-tighter">{trackingId}</p>
                </div>
                <p className="text-slate-500 font-medium px-4">
                  Please present this tracking number to the Barangay Office once your document is ready for pickup.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRequest} className="space-y-6">
                <div>
                  <label className="block text-slate-700 font-bold mb-2 text-lg">Full Name</label>
                  <input 
                    required 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full border-2 border-slate-300 p-4 rounded-xl text-lg text-slate-900 focus:border-sky-500 focus:outline-none" 
                    placeholder="Juan Dela Cruz" 
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-2 text-lg">Purpose</label>
                  <input 
                    required 
                    type="text" 
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full border-2 border-slate-300 p-4 rounded-xl text-lg text-slate-900 focus:border-sky-500 focus:outline-none" 
                    placeholder="e.g. Employment" 
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-slate-900 text-white font-bold py-5 rounded-xl text-xl hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50 min-h-[44px]"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </form>
            )}
          </div>
        )}
      </main>

      <CitizenBottomNav />
    </div>
  );
}
