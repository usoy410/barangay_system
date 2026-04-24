'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { DocumentRequestModal } from '@/components/services/DocumentRequestModal';
import { ServiceRequestQueue } from '@/components/services/ServiceRequestQueue';
import { DocumentPreviewer } from '@/components/services/DocumentPreviewer';
import { TemplateManager } from '@/components/admin/TemplateManager';
import { getResidents } from '@/lib/residents';
import { getServiceRequests, updateRequestStatus, getRequestCount, RequestWithResident } from '@/lib/requests';
import type { Resident, ClearanceRequest } from '@/types/database';
import { FileText, Award, ShieldCheck, Download, Users, Inbox, Loader2, Upload, X } from 'lucide-react';

const PAGE_SIZE = 10;

export default function ServicesPage() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [requests, setRequests] = useState<RequestWithResident[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
  const [selectedRequest, setSelectedRequest] = useState<RequestWithResident | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isQueueLoading, setIsQueueLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [counts, setCounts] = useState({ pending: 0, history: 0 });

  const observerTarget = useRef<HTMLDivElement>(null);

  const fetchCounts = useCallback(async () => {
    try {
      const pending = await getRequestCount('Pending');
      // History is Issued + Void. For simplicity, we can fetch them separately or if we have a way to fetch multiple.
      // Currently getRequestCount only takes one status.
      const issued = await getRequestCount('Issued');
      const voided = await getRequestCount('Void');
      setCounts({ pending, history: issued + voided });
    } catch (error) {
      console.error('Failed to fetch counts');
    }
  }, []);

  const fetchRequests = useCallback(async (pageNum: number, isInitial: boolean = false) => {
    if (isInitial) setIsQueueLoading(true);
    else setIsLoadingMore(true);

    try {
      const from = pageNum * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      
      // If pending, use Pending. If history, we need to handle multiple statuses.
      // Since our getServiceRequests only takes one status currently, let's update it or handle it.
      // Actually, if status is undefined, it fetches all. But we want specifically Issued/Void for history.
      
      // Let's assume for history we fetch without status filter and then filter in logic, 
      // OR better, update getServiceRequests to allow array of statuses. 
      // I'll stick to single status for now or filter.
      
      // For now, let's just fetch by status if pending, or all if history (and we'll refine the library later if needed).
      const status: ClearanceRequest['status'] | ClearanceRequest['status'][] | undefined = activeTab === 'pending' 
        ? 'Pending' 
        : ['Issued', 'Void'];
      
      const data = await getServiceRequests(status, from, to);

      if (isInitial) {
        setRequests(data);
      } else {
        setRequests(prev => [...prev, ...data]);
      }
      
      setHasMore(data.length === PAGE_SIZE);
    } catch (err) {
      console.error('Failed to fetch requests:', err);
    } finally {
      setIsQueueLoading(false);
      setIsLoadingMore(false);
    }
  }, [activeTab]);

  const fetchInitialData = async () => {
    try {
      const { data: resData } = await getResidents();
      setResidents(resData);
    } catch (err) {
      console.error('Failed to fetch residents:', err);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchCounts();
    setPage(0);
    fetchRequests(0, true);
  }, [activeTab, fetchRequests, fetchCounts]);

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isQueueLoading && !isLoadingMore) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchRequests(nextPage);
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isQueueLoading, isLoadingMore, page, fetchRequests]);

  const handleIssue = async (id: string) => {
    try {
      await updateRequestStatus(id, 'Issued'); 
      setSelectedRequest(null);
      fetchCounts();
      setPage(0);
      fetchRequests(0, true);
    } catch (err) {
      alert('Failed to issue document.');
    }
  };

  return (
    <React.Fragment>
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-cyan-100 text-cyan-700 rounded-xl">
                <FileText className="w-6 h-6" />
              </div>
              <h1 className="text-4xl font-lexend font-black text-slate-900 tracking-tight">Services & Documents</h1>
            </div>
            <p className="text-slate-500 font-medium max-w-2xl">
              Manage incoming citizen requests and issue official documents.
            </p>
          </div>

          <button 
            onClick={() => setIsTemplateModalOpen(true)}
            className="flex items-center gap-3 px-6 py-3 bg-white border-2 border-slate-200 rounded-2xl text-slate-600 font-bold hover:border-cyan-500 hover:text-cyan-600 transition-all shadow-sm cursor-pointer group"
          >
            <Upload className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
            <span>Upload Templates</span>
          </button>
        </div>

        {/* INCOMING REQUESTS QUEUE */}
        <div className="mb-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-3">
              <Inbox className="w-5 h-5 text-slate-400" />
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Service Queue</h2>
            </div>
            
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button 
                onClick={() => setActiveTab('pending')}
                className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'pending' ? 'bg-white text-cyan-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <span>Incoming</span>
                {counts.pending > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'pending' ? 'bg-cyan-100 text-cyan-700' : 'bg-slate-200 text-slate-500'}`}>
                    {counts.pending}
                  </span>
                )}
              </button>
              <button 
                onClick={() => setActiveTab('history')}
                className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'history' ? 'bg-white text-cyan-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <span>History</span>
                {counts.history > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'history' ? 'bg-cyan-100 text-cyan-700' : 'bg-slate-200 text-slate-500'}`}>
                    {counts.history}
                  </span>
                )}
              </button>
            </div>
          </div>

          <ServiceRequestQueue 
            requests={requests}
            isLoading={isQueueLoading}
            onViewRequest={setSelectedRequest}
          />

          {/* Observer Target */}
          <div ref={observerTarget} className="h-4 w-full" />

          {isLoadingMore && (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 text-cyan-600 animate-spin" />
            </div>
          )}

          {!hasMore && requests.length > 0 && (
            <p className="text-center text-slate-400 text-sm font-bold uppercase tracking-widest py-8">
              End of queue
            </p>
          )}
        </div>

        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-5 h-5 text-slate-400" />
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Manual Issuance</h2>
            <div className="h-px flex-grow bg-slate-100" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <ServiceCard 
            icon={<ShieldCheck className="w-8 h-8 text-cyan-600" />}
            title="Barangay Clearance"
            description="Official certification that a resident has no derogatory records in the community."
            onClick={() => setIsModalOpen(true)}
          />
          <ServiceCard 
            icon={<Award className="w-8 h-8 text-green-600" />}
            title="Certificate of Indigency"
            description="Certification for low-income residents to qualify for social services and scholarships."
            onClick={() => setIsModalOpen(true)}
          />
          <ServiceCard 
            icon={<Users className="w-8 h-8 text-purple-600" />}
            title="Residency Verification"
            description="Verification of residency status for various bureaucratic requirements."
            disabled
          />
        </div>

        <div className="bg-white rounded-[2.5rem] p-12 border border-slate-200 shadow-sm text-center mb-16">
          <h2 className="text-2xl font-black text-slate-900 mb-4">Need a custom certificate?</h2>
          <p className="text-slate-500 max-w-xl mx-auto mb-8 font-medium">
            The system currently supports standard templates. If you require a custom format, 
            please contact the technical support team for template integration.
          </p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => setActiveTab('history')}
              className="px-8 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all cursor-pointer"
            >
              View Request History
            </button>
          </div>
        </div>
      </main>

      {/* MODALS */}
      {isModalOpen && (
        <DocumentRequestModal 
          residents={residents} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}

      {selectedRequest && (
        <DocumentPreviewer 
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onIssue={handleIssue}
        />
      )}

      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsTemplateModalOpen(false)} />
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <TemplateManager />
            <button 
              onClick={() => setIsTemplateModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-white/50 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

const ServiceCard = ({ icon, title, description, onClick, disabled = false }: any) => (
  <div 
    onClick={!disabled ? onClick : undefined}
    className={`bg-white p-8 rounded-[2rem] border-2 transition-all duration-300 flex flex-col items-start ${
      disabled 
        ? 'opacity-50 grayscale cursor-not-allowed border-slate-100' 
        : 'border-transparent hover:border-cyan-200 hover:shadow-2xl hover:shadow-cyan-100 cursor-pointer shadow-sm group'
    }`}
  >
    <div className={`p-4 rounded-2xl mb-6 transition-all ${!disabled && 'group-hover:scale-110 bg-slate-50 group-hover:bg-cyan-50'}`}>
      {icon}
    </div>
    <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight">{title}</h3>
    <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-grow font-medium">
      {description}
    </p>
    {!disabled && (
      <div className="flex items-center gap-2 text-cyan-600 text-sm font-black uppercase tracking-widest">
        <span>Issue Now</span>
        <Download className="w-4 h-4" />
      </div>
    )}
  </div>
);
