'use client';

import React, { useState } from 'react';
import { ShieldAlert, X } from 'lucide-react';
import type { Incident } from '@/types/database';
import { IncidentCard } from './IncidentCard';

interface IncidentFeedProps {
  /** Array of incident reports to display */
  incidents: Incident[];
  /** Callback to update the status of an incident */
  onStatusUpdate: (id: string, status: Incident['status']) => void;
  /** Whether the feed is currently fetching data */
  isLoading?: boolean;
}

/**
 * A real-time incident feed for monitoring community reports.
 * Displays incidents as cards with quick actions for admins and a image lightbox.
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
          <IncidentCard 
            key={incident.id}
            incident={incident}
            onStatusUpdate={onStatusUpdate}
            onViewImage={setSelectedImage}
          />
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
