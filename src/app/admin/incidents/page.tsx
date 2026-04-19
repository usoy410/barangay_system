'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { IncidentFeed } from '@/components/incidents/IncidentFeed';
import { getIncidents, updateIncidentStatus } from '@/lib/incidents';
import type { Incident } from '@/types/database';
import { AlertTriangle, Plus, ShieldAlert } from 'lucide-react';

/**
 * Main page for the Incident Reporting module.
 * Displays a feed of recent incidents and provides a mechanism for reporting and resolving issues.
 */
export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchIncidents = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getIncidents();
      setIncidents(data);
    } catch (error) {
      console.error('Failed to load incidents');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);



  const handleStatusUpdate = async (id: string, status: Incident['status']) => {
    await updateIncidentStatus(id, status);
    await fetchIncidents();
  };

  return (
    <React.Fragment>

      <main className="flex-grow max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-100 text-red-700 rounded-xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h1 className="text-4xl font-lexend font-black text-slate-900 tracking-tight">Security Feed</h1>
            </div>
            <p className="text-slate-500 font-medium">Real-time incident reporting and community safety monitoring.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Recent Reports</h2>
            <IncidentFeed 
              incidents={incidents} 
              isLoading={isLoading} 
              onStatusUpdate={handleStatusUpdate} 
            />
          </div>

          <div className="space-y-6">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Security Stats</h2>
            <div className="bg-slate-900 rounded-[2rem] p-8 text-white">
              <ShieldAlert className="w-10 h-10 text-red-500 mb-6" />
              <div className="space-y-4">
                <StatItem label="Pending" value={incidents.filter(i => i.status === 'Pending').length} color="text-amber-400" />
                <StatItem label="Active" value={incidents.filter(i => i.status === 'In Progress').length} color="text-blue-400" />
                <StatItem label="Resolved" value={incidents.filter(i => i.status === 'Resolved').length} color="text-green-400" />
              </div>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-[2rem] p-8">
              <h3 className="font-level text-slate-900 font-black mb-2">Safety Protocol</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                All reports are encrypted and sent directly to the Barangay command center. 
                Please provide accurate details to ensure effective response.
              </p>
            </div>
          </div>
        </div>
      </main>

    </React.Fragment>
  );
}

const StatItem = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="flex justify-between items-end border-b border-white/10 pb-2">
    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</span>
    <span className={`text-2xl font-black ${color}`}>{value}</span>
  </div>
);
