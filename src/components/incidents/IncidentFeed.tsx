'use client';

import React, { useState } from 'react';
import { AlertTriangle, Clock, CheckCircle, ShieldAlert, MapPin, X, Maximize2 } from 'lucide-react';
import type { Incident } from '@/types/database';

interface IncidentFeedProps {
  incidents: Incident[];
  onStatusUpdate: (id: string, status: Incident['status']) => void;
  isLoading?: boolean;
}

/**
 * A real-time incident feed for monitoring community reports.
 * Displays incidents as cards with status-colored indicators and quick actions for admins.
 */
export const IncidentFeed: React.FC<IncidentFeedProps> = ({ 
  incidents, 
  onStatusUpdate,
  isLoading 
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 text-atkinson">
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

                {incident.image_url && (
                  <div 
                    onClick={() => setSelectedImage(incident.image_url!)}
                    className="relative mb-4 rounded-2xl overflow-hidden border border-slate-100 shadow-sm cursor-zoom-in group/img"
                  >
                    <img 
                      src={incident.image_url} 
                      alt="Incident Report" 
                      className="w-full h-48 object-cover group-hover/img:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-slate-900/0 group-hover/img:bg-slate-900/10 transition-colors flex items-center justify-center">
                      <div className="bg-white/90 p-2 rounded-full opacity-0 group-hover/img:opacity-100 transition-all transform translate-y-2 group-hover/img:translate-y-0 shadow-lg text-slate-900">
                        <Maximize2 className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
                    {incident.reporter_name[0]}
                  </div>
                  <span>Reported by {incident.reporter_name}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 w-full sm:w-auto self-start">
                {['Pending', 'In Progress', 'Resolved', 'Spam'].map((s) => {
                  const isActive = incident.status === s;
                  const isPending = s === 'Pending';
                  
                  // Hide Pending button as a selection option, it's the default state
                  if (isPending && !isActive) return null;

                  return (
                    <button
                      key={s}
                      onClick={() => !isActive && onStatusUpdate(incident.id, s as any)}
                      className={`
                        px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-200
                        ${isActive 
                          ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' 
                          : 'bg-slate-50 text-slate-400 hover:bg-white hover:text-cyan-600 hover:shadow-md cursor-pointer border border-transparent hover:border-slate-100'
                        }
                      `}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/95 backdrop-blur-sm p-4 md:p-12 animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-all border border-white/10"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="relative max-w-5xl w-full h-full flex items-center justify-center">
            <img 
              src={selectedImage} 
              alt="Incident Full Preview" 
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl animate-in zoom-in-95 duration-300"
              onClick={(e) => e.stopPropagation()} 
            />
          </div>
        </div>
      )}
    </>
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
