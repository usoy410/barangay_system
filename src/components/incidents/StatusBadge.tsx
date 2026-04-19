import React from 'react';
import { AlertTriangle, Clock, CheckCircle, ShieldAlert } from 'lucide-react';
import type { Incident } from '@/types/database';

interface StatusBadgeProps {
  /** The current status of the incident */
  status: Incident['status'];
}

/**
 * A badge component that displays the status of an incident with color-coded styling and icons.
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
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
