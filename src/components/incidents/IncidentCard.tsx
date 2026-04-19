import React from 'react';
import { MapPin, Maximize2 } from 'lucide-react';
import type { Incident } from '@/types/database';
import { StatusBadge } from './StatusBadge';

interface IncidentCardProps {
  /** The incident data to display */
  incident: Incident;
  /** Callback to update the status of the incident */
  onStatusUpdate: (id: string, status: Incident['status']) => void;
  /** Callback to view an image in a lightbox */
  onViewImage: (url: string) => void;
}

/**
 * A card component representing a single community incident report.
 */
export const IncidentCard: React.FC<IncidentCardProps> = ({
  incident,
  onStatusUpdate,
  onViewImage,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-xl transition-all duration-300 group">
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
              onClick={() => onViewImage(incident.image_url!)}
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
  );
};
