'use client';

import React, { useState, useEffect } from 'react';
import { getResidents } from '@/lib/residents';
import { getIncidents } from '@/lib/incidents';
import { getRequestCount } from '@/lib/requests';
import { Users, FileText, AlertTriangle, ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';

/**
 * Main application dashboard.
 * Provides a high-level overview of Barangay status, statistics, and quick navigation.
 */
export default function Dashboard() {
  const [stats, setStats] = useState({ residents: 0, incidents: 0, issued: 0, pending: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const { count: resCount } = await getResidents();
        const incData = await getIncidents();
        const issuedCount = await getRequestCount('Issued');
        const pendingCount = await getRequestCount('Pending');
        
        setStats({
          residents: resCount || 0,
          incidents: incData.length,
          issued: issuedCount,
          pending: pendingCount
        });
      } catch (error) {
        console.error('Failed to fetch stats');
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <React.Fragment>
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[3rem] p-12 mb-12 relative overflow-hidden text-white shadow-2xl shadow-slate-200">
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-5xl font-lexend font-black mb-6 leading-tight tracking-tight">
              Good Morning, <span className="text-cyan-400">Admin</span>.
            </h1>
            <p className="text-slate-300 text-lg mb-8 font-medium">
              You have <span className="text-white font-bold">{stats.pending} pending requests</span> and <span className="text-white font-bold">{stats.incidents} active reports</span> that require your attention today.
            </p>
            <div className="flex gap-4">
              <Link href="/admin/services" className="px-8 py-4 bg-cyan-600 hover:bg-cyan-700 rounded-2xl font-bold transition-all flex items-center gap-2">
                Manage Services <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/admin/residents" className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-bold transition-all">
                Resident Registry
              </Link>
            </div>
          </div>
          
          {/* Abstract Shape Decor */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-green-600/10 rounded-full blur-3xl -mr-32 -mb-32" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <StatCard 
            icon={<Users className="w-6 h-6" />}
            label="Total Residents"
            value={isLoading ? '...' : stats.residents}
            color="bg-blue-50 text-blue-600"
          />
          <StatCard 
            icon={<AlertTriangle className="w-6 h-6" />}
            label="Active Incidents"
            value={isLoading ? '...' : stats.incidents}
            color="bg-red-50 text-red-600"
          />
          <StatCard 
            icon={<FileText className="w-6 h-6" />}
            label="Documents Issued"
            value={isLoading ? '...' : stats.issued}
            color="bg-green-50 text-green-600"
          />
          <StatCard 
            icon={<Clock className="w-6 h-6" />}
            label="Pending Requests"
            value={isLoading ? '...' : stats.pending}
            color="bg-amber-50 text-amber-600"
          />
        </div>

        <div className="bg-white rounded-[2.5rem] p-12 border border-slate-200 shadow-sm text-center">
          <h2 className="text-2xl font-black text-slate-900 mb-4">Barangay Overview Ready</h2>
          <p className="text-slate-500 max-w-xl mx-auto font-medium">
            All systems are operational. You can manage templates, handle resident requests, and track incidents 
            using the navigation menu above.
          </p>
        </div>
      </main>

      <footer className="py-10 text-center text-slate-400 text-sm">
        &copy; 2026 Barangay Information System. Developed with precision & care.
      </footer>
    </React.Fragment>
  );
}

const StatCard = ({ icon, label, value, color }: any) => (
  <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
    <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mb-6`}>
      {icon}
    </div>
    <p className="text-slate-400 font-black uppercase tracking-widest text-[10px] mb-2">{label}</p>
    <h3 className="text-4xl font-lexend font-black text-slate-900 leading-none">{value}</h3>
  </div>
);
