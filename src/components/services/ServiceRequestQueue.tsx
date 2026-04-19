'use client';

import React from 'react';
import { Clock, CheckCircle, XCircle, FileText, ArrowRight } from 'lucide-react';
import type { RequestWithResident } from '@/lib/requests';

interface ServiceRequestQueueProps {
  requests: RequestWithResident[];
  isLoading: boolean;
  onViewRequest: (request: RequestWithResident) => void;
}

export const ServiceRequestQueue: React.FC<ServiceRequestQueueProps> = ({ 
  requests, 
  isLoading, 
  onViewRequest 
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-slate-100 animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2rem] p-12 text-center">
        <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8" />
        </div>
        <p className="text-slate-500 font-medium">No pending service requests.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <div 
          key={request.id}
          className="group bg-white border border-slate-200 p-5 rounded-2xl hover:border-cyan-500 hover:shadow-xl hover:shadow-cyan-100 transition-all cursor-pointer flex items-center justify-between"
          onClick={() => onViewRequest(request)}
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${request.type === 'Clearance' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 group-hover:text-cyan-700 transition-colors">
                {request.residents.first_name} {request.residents.last_name}
              </h4>
              <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(request.created_at).toLocaleDateString()}
                </span>
                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                <span className="bg-slate-100 px-2 py-0.5 rounded-md text-slate-600 text-[10px] uppercase tracking-tighter font-black">
                  {request.type}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Purpose</p>
              <p className="text-sm font-bold text-slate-700 truncate max-w-[150px]">{request.purpose}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-cyan-600 group-hover:text-white transition-all">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
