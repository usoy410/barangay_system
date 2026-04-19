'use client';

import React from 'react';
import { AlertTriangle, Clock, CheckCircle, ShieldAlert, MapPin } from 'lucide-react';
import type { Incident } from '@/types/database';

interface IncidentFeedProps {
  incidents: Incident[];
  onStatusUpdate: (id: string, status: Incident['status']) => void;
  isLoading?: boolean;
}

/**
 * A real-time incident feed for monitoring community reports.
 * Displays incidents as cards with status-colored indicators and quick actions for admins.
 * 
 * @param incidents - List of reported incidents.
 * @param onStatusUpdate - Callback to change the status of an incident.
 */
export const IncidentFeed: React.FC<IncidentFeedProps> = ({ 
  incidents, 
  onStatusUpdate,
  isLoading 
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  if (incidents.length === 0) {
    return (
      <div className="text-center py-20 bg-white border-2 border-dashed border-slate-200 rounded-3xl">
        <ShieldAlert className="w-16 h-16 mx-auto text-slate-200 mb-4" />
        <h3 className="text-xl font-bold text-slate-900">No Incidents Reported</h3>
        <p className="text-slate-500">The community is quiet and safe today.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
      {incidents.map((incident) => (
        <div 
          key={incident.id} 
          className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-xl transition-all duration-300 group"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex-grow">
              <div className="flex items-center gap-2 mb-2">
                <StatusBadge status={incident.status} />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {new Date(incident.created_at).toLocaleDateString()}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-cyan-700 transition-colors mb-2">
                {incident.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                {incident.description}
              </p>
              
              {incident.location && (
                <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-4">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{incident.location}</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
                  {incident.reporter_name[0]}
                </div>
                <span>Reported by {incident.reporter_name}</span>
              </div>
            </div>

            <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
              {['In Progress', 'Resolved', 'Spam'].map((s) => (
                <button
                  key={s}
                  onClick={() => onStatusUpdate(incident.id, s as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    incident.status === s 
                      ? 'bg-slate-900 text-white cursor-default' 
                      : 'bg-slate-50 text-slate-600 hover:bg-cyan-50 hover:text-cyan-700 cursor-pointer'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- Helper Badge ---

const StatusBadge = ({ status }: { status: Incident['status'] }) => {
  const configs = {
    'Pending': { icon: <AlertTriangle className="w-3 h-3" />, class: 'bg-amber-100 text-amber-700 border-amber-200' },
    'In Progress': { icon: <Clock className="w-3 h-3" />, class: 'bg-blue-100 text-blue-700 border-blue-200' },
    'Resolved': { icon: <CheckCircle className="w-3 h-3" />, class: 'bg-green-100 text-green-700 border-green-200' },
    'Spam': { icon: <ShieldAlert className="w-3 h-3" />, class: 'bg-slate-100 text-slate-500 border-slate-200' },
  };

  const config = configs[status];

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${config.class}`}>
      {config.icon}
      {status}
    </span>
  );
};
