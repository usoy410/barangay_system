"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getClientSession, clearDemoSession } from '@/lib/auth-demo';
import { getResidentByMobile } from '@/lib/residents';
import { getResidentRequests } from '@/lib/requests';
import { User, MapPin, Phone, Calendar, LogOut, ChevronRight, Clock, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import type { Resident, ClearanceRequest } from '@/types/database';

export default function AccountPage() {
  const router = useRouter();
  const [resident, setResident] = useState<Resident | null>(null);
  const [requests, setRequests] = useState<ClearanceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      const session = getClientSession();
      if (!session) {
        router.push('/login');
        return;
      }

      try {
        const profile = await getResidentByMobile(session.mobile);
        if (profile) {
          setResident(profile);
          const history = await getResidentRequests(profile.id);
          setRequests(history);
        }
      } catch (error) {
        console.error('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [router]);

  const handleLogout = () => {
    clearDemoSession();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!resident) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center font-atkinson pb-32">
        <div className="w-24 h-24 bg-amber-50 text-amber-500 rounded-[2rem] flex items-center justify-center mb-6 shadow-xl shadow-amber-900/10 border border-amber-100">
          <AlertCircle className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 mb-2">Profile Not Found</h1>
        <p className="text-slate-500 max-w-sm mb-8 font-medium">
          We couldn't find a registered resident profile for this mobile number. You may need to complete your registration first.
        </p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button 
            onClick={() => router.push('/register')}
            className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
          >
            Create My Profile
          </button>
          <button 
            onClick={handleLogout}
            className="w-full bg-white border border-slate-200 text-slate-600 font-bold py-4 rounded-2xl hover:bg-slate-50 transition-all"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-atkinson">
      {/* Header Profile Section */}
      <div className="bg-slate-900 pt-32 pb-20 px-6 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-2xl mx-auto flex items-center gap-6">
          <div className="w-24 h-24 bg-cyan-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-cyan-900/50">
            <User className="w-12 h-12 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">{resident?.first_name} {resident?.last_name}</h1>
            <p className="text-slate-400 font-medium flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              Verified Resident
            </p>
          </div>
        </div>
        
        {/* Abstract Background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
      </div>

      <div className="max-w-2xl mx-auto px-6 -mt-10 relative z-20 space-y-6 pb-20">
        {/* Info Card */}
        <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col gap-6">
          <InfoItem icon={<Phone className="w-5 h-5" />} label="Mobile Number" value={resident?.mobile_number || ''} />
          <InfoItem icon={<MapPin className="w-5 h-5" />} label="Permanent Address" value={resident?.address || ''} />
          <InfoItem icon={<Calendar className="w-5 h-5" />} label="Member Since" value={new Date(resident?.created_at || '').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} />
        </div>

        {/* Document Tracking Section */}
        <div>
          <h2 className="text-xl font-black text-slate-900 mb-4 px-2">Document Tracking</h2>
          <div className="space-y-4">
            {requests.length === 0 ? (
              <div className="bg-white rounded-[2rem] p-10 text-center border border-slate-100">
                <FileText className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">No active document requests.</p>
                <button 
                  onClick={() => router.push('/services')}
                  className="mt-4 text-cyan-600 font-bold text-sm hover:underline"
                >
                  Request one now
                </button>
              </div>
            ) : (
              requests.map((req) => (
                <RequestStatusCard key={req.id} request={req} />
              ))
            )}
          </div>
        </div>

        {/* Actions */}
        <button 
          onClick={handleLogout}
          className="w-full bg-white border border-red-100 text-red-500 py-6 rounded-[2rem] font-black flex items-center justify-center gap-3 hover:bg-red-50 transition-all active:scale-95 shadow-sm"
        >
          <LogOut className="w-5 h-5" />
          Sign Out of Portal
        </button>
      </div>
    </div>
  );
}

const InfoItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-start gap-4">
    <div className="p-3 bg-slate-50 rounded-xl text-slate-400">
      {icon}
    </div>
    <div>
      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1">{label}</p>
      <p className="text-slate-900 font-bold leading-tight">{value}</p>
    </div>
  </div>
);

const RequestStatusCard = ({ request }: { request: ClearanceRequest }) => {
  const isIssued = request.status === 'Issued';
  const isVoid = request.status === 'Void';

  return (
    <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className={`p-4 rounded-2xl ${isIssued ? 'bg-emerald-50 text-emerald-600' : isVoid ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
          {isIssued ? <CheckCircle2 className="w-6 h-6" /> : isVoid ? <AlertCircle className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
        </div>
        <div>
          <h4 className="font-black text-slate-900 leading-none mb-1">Barangay {request.type}</h4>
          <p className="text-xs text-slate-400 font-medium">{new Date(request.created_at).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tight ${isIssued ? 'bg-emerald-100 text-emerald-700' : isVoid ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
          {request.status}
        </span>
        <ChevronRight className="w-5 h-5 text-slate-300" />
      </div>
    </div>
  );
};


