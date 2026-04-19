'use client';

import React, { useState, useEffect } from 'react';
import { FileText, ShieldCheck, Award, CheckCircle, AlertTriangle } from 'lucide-react';
import { submitServiceRequest } from '@/lib/requests';
import { getResidentByMobile } from '@/lib/residents';
import { getClientSession } from '@/lib/auth-demo';
import { useRouter } from 'next/navigation';

export default function CitizenServices() {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState<'Clearance' | 'Indigency' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  const [purpose, setPurpose] = useState('');
  const [residentId, setResidentId] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [isCheckingProfile, setIsCheckingProfile] = useState(false);
  const [noProfile, setNoProfile] = useState(false);

  useEffect(() => {
    async function checkProfile() {
      const session = getClientSession();
      if (!session) {
        // Not logged in or no session, but we'll deal with it on submit
        return;
      }

      setIsCheckingProfile(true);
      try {
        const resident = await getResidentByMobile(session.mobile);
        if (resident) {
          setResidentId(resident.id);
          setFullName(`${resident.first_name} ${resident.last_name}`);
        } else {
          setNoProfile(true);
        }
      } catch (error) {
        console.error('Error checking profile:', error);
      } finally {
        setIsCheckingProfile(false);
      }
    }

    checkProfile();
  }, []);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!residentId) {
      setNoProfile(true);
      return;
    }

    setIsSubmitting(true);
    
    try {
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
      alert('Failed to submit request. Please try again later.');
      setIsSubmitting(false);
    }
  };

  if (noProfile) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center font-atkinson">
        <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mb-6 shadow-sm">
          <AlertTriangle className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 mb-2">Registration Required</h1>
        <p className="text-slate-500 max-w-sm mb-8 font-medium">
          You need a verified resident profile to request official documents online.
        </p>
        <button 
          onClick={() => router.push('/register')}
          className="bg-slate-900 text-white font-black py-4 px-8 rounded-2xl hover:bg-slate-800 transition-all"
        >
          Complete my Registration
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-atkinson">
      <header className="bg-sky-700 text-white pt-12 pb-8 md:pt-32 md:pb-12 px-6 rounded-b-[2rem] shadow-md">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="w-8 h-8 opacity-80" />
          <h1 className="text-3xl font-bold">Services</h1>
        </div>
        <p className="text-sky-100 text-lg">Request official barangay documents online.</p>
      </header>

      <main className="flex-grow max-w-3xl w-full mx-auto px-6 py-8">
        {!selectedService ? (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800 mb-6 font-lexend">Select a Document</h2>
            
            <button 
              onClick={() => setSelectedService('Clearance')}
              className="w-full text-left bg-white border-2 border-slate-200 p-6 rounded-2xl flex flex-col gap-4 hover:border-sky-500 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-sky-50 text-sky-600 rounded-xl group-hover:bg-sky-600 group-hover:text-white transition-colors">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Barangay Clearance</h3>
              </div>
              <p className="text-slate-600 text-base">For employment, business, or official requirements.</p>
            </button>

            <button 
              onClick={() => setSelectedService('Indigency')}
              className="w-full text-left bg-white border-2 border-slate-200 p-6 rounded-2xl flex flex-col gap-4 hover:border-sky-500 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Certificate of Indigency</h3>
              </div>
              <p className="text-slate-600 text-base">For social services, scholarships, or medical assistance.</p>
            </button>
          </div>
        ) : (
          <div className="bg-white border-2 border-slate-200 rounded-[2rem] p-8 shadow-sm">
            <button 
              onClick={() => {
                setSelectedService(null);
                setSubmitted(false);
              }}
              className="text-sky-700 font-bold mb-6 text-sm flex items-center cursor-pointer hover:underline"
            >
              &larr; Back to Services
            </button>
            <h2 className="text-3xl font-black text-slate-900 mb-2 font-lexend">Request {selectedService}</h2>
            <p className="text-slate-500 mb-8 font-medium">Please verify your details to process the request.</p>
            
            {submitted ? (
              <div className="text-center py-10 space-y-6">
                <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-[2rem] flex items-center justify-center mx-auto mb-4 shadow-inner">
                  <CheckCircle className="w-12 h-12" />
                </div>
                <h3 className="text-3xl font-black text-slate-900">Request Submitted!</h3>
                <div className="bg-slate-50 p-8 rounded-[2rem] border-2 border-dashed border-slate-200">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-2">Tracking Number</p>
                  <p className="text-4xl font-black text-sky-700 tracking-tighter uppercase">{trackingId}</p>
                </div>
                <p className="text-slate-500 font-medium px-4 leading-relaxed">
                  Your request is now being processed. You can track its status in your <span className="text-sky-600 font-bold cursor-pointer" onClick={() => router.push('/account')}>account dashboard</span>.
                </p>
                <button 
                  onClick={() => router.push('/account')}
                  className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-slate-800 transition-all"
                >
                  Go to Dashboard
                </button>
              </div>
            ) : (
              <form onSubmit={handleRequest} className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1">Applying for</p>
                    <p className="text-slate-900 font-bold">{fullName || 'Checking profile...'}</p>
                  </div>
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <ShieldCheck className="w-5 h-5 text-sky-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-black mb-2 text-sm uppercase tracking-widest">Purpose of Request</label>
                  <input 
                    required 
                    type="text" 
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full border-2 border-slate-200 p-4 rounded-2xl text-lg text-slate-900 focus:border-sky-500 focus:outline-none bg-white transition-all shadow-inner" 
                    placeholder="e.g. Employment, Scholarship, etc." 
                  />
                </div>

                <div className="bg-sky-50 p-4 rounded-2xl flex items-start gap-4">
                  <AlertTriangle className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-sky-800 font-medium leading-relaxed">
                    Once submitted, your request will be reviewed by the Barangay Officials. You will need to show your ID during pickup.
                  </p>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting || isCheckingProfile}
                  className="w-full bg-slate-900 text-white font-black py-5 rounded-[2rem] text-xl hover:bg-slate-800 transition-all cursor-pointer disabled:opacity-50 shadow-xl shadow-slate-200 active:scale-[0.98] min-h-[44px]"
                >
                  {isSubmitting ? 'Sending Request...' : 'Submit Request'}
                </button>
              </form>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
