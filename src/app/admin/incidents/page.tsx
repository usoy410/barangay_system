'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { IncidentFeed } from '@/components/incidents/IncidentFeed';
import { getIncidents, updateIncidentStatus, getIncidentCount } from '@/lib/incidents';
import type { Incident } from '@/types/database';
import { AlertTriangle, ShieldAlert, Loader2 } from 'lucide-react';

const PAGE_SIZE = 10;

/**
 * Main page for the Incident Reporting module.
 * Displays a feed of recent incidents and provides a mechanism for reporting and resolving issues.
 */
export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [activeTab, setActiveTab] = useState<'active' | 'archive'>('active');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [stats, setStats] = useState({ pending: 0, active: 0, resolved: 0 });
  
  const observerTarget = useRef<HTMLDivElement>(null);

  const fetchStats = useCallback(async () => {
    try {
      const [pending, inProgress, resolved] = await Promise.all([
        getIncidentCount('Pending'),
        getIncidentCount('In Progress'),
        getIncidentCount('Resolved')
      ]);
      setStats({ pending, active: inProgress, resolved });
    } catch (error) {
      console.error('Failed to fetch stats');
    }
  }, []);

  const fetchIncidents = useCallback(async (pageNum: number, isInitial: boolean = false) => {
    if (isInitial) setIsLoading(true);
    else setIsLoadingMore(true);

    try {
      const statuses: Incident['status'][] = activeTab === 'active' 
        ? ['Pending', 'In Progress'] 
        : ['Resolved', 'Spam'];

      const from = pageNum * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      
      const data = await getIncidents(from, to, statuses);
      
      if (isInitial) {
        setIncidents(data);
      } else {
        setIncidents(prev => [...prev, ...data]);
      }
      
      setHasMore(data.length === PAGE_SIZE);
    } catch (error) {
      console.error('Failed to load incidents');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [activeTab]);

  // Initial fetch and stats
  useEffect(() => {
    fetchStats();
    setPage(0);
    fetchIncidents(0, true);
  }, [activeTab, fetchIncidents, fetchStats]);

  // Intersection Observer for Infinite Scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isLoading && !isLoadingMore) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchIncidents(nextPage);
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading, isLoadingMore, page, fetchIncidents]);

  const handleStatusUpdate = async (id: string, status: Incident['status']) => {
    await updateIncidentStatus(id, status);
    // Refresh stats and current page to reflect changes
    fetchStats();
    // We just refresh the first page for simplicity after an update, 
    // or we could optimistically update the local state.
    setPage(0);
    fetchIncidents(0, true);
  };

  return (
    <React.Fragment>
      <main className="flex-grow max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 font-lexend">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-100 text-red-700 rounded-xl shadow-sm">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Security Feed</h1>
            </div>
            <p className="text-slate-500 font-medium">Monitoring community safety and incident reports.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8 p-1.5 bg-slate-100 rounded-2xl">
              <button 
                onClick={() => setActiveTab('active')}
                className={`flex-1 py-3 font-black text-xs uppercase tracking-widest rounded-xl transition-all ${activeTab === 'active' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Active Feed
              </button>
              <button 
                onClick={() => setActiveTab('archive')}
                className={`flex-1 py-3 font-black text-xs uppercase tracking-widest rounded-xl transition-all ${activeTab === 'archive' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Archived History
              </button>
            </div>

            <IncidentFeed 
              incidents={incidents} 
              isLoading={isLoading} 
              onStatusUpdate={handleStatusUpdate} 
            />

            {/* Intersection Observer Target */}
            <div ref={observerTarget} className="h-4 w-full" />
            
            {isLoadingMore && (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 text-cyan-600 animate-spin" />
              </div>
            )}

            {!hasMore && incidents.length > 0 && (
              <p className="text-center text-slate-400 text-sm font-bold uppercase tracking-widest py-8">
                End of feed
              </p>
            )}
          </div>

          <div className="space-y-6">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Security Stats</h2>
            <div className="bg-slate-900 rounded-[2rem] p-8 text-white">
              <ShieldAlert className="w-10 h-10 text-red-500 mb-6" />
              <div className="space-y-4">
                <StatItem label="Pending" value={stats.pending} color="text-amber-400" />
                <StatItem label="Active" value={stats.active} color="text-blue-400" />
                <StatItem label="Resolved" value={stats.resolved} color="text-green-400" />
                
                <div className="pt-6 mt-6 border-t border-white/10">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Overall Count</span>
                    <span className="text-3xl font-black text-white leading-none">
                      {stats.pending + stats.active + stats.resolved}
                    </span>
                  </div>
                </div>
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
