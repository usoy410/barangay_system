'use client';

import React from 'react';
import Link from 'next/link';
import { LogOut, ArrowRight, FileText, AlertTriangle, Bell } from 'lucide-react';
import { clearDemoSession } from '@/lib/auth-demo';
import { useRouter } from 'next/navigation';

export default function CitizenHome() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-atkinson">
      {/* Mobile-first Header */}
      <header className="bg-slate-900 text-white pt-12 pb-8 md:pt-32 md:pb-12 px-6 rounded-b-[2rem] shadow-md relative">
        <h1 className="text-3xl font-bold mb-2">Magandang Araw!</h1>
        <p className="text-slate-300 text-lg">Welcome to the Barangay Information Portal.</p>
      </header>

      <main className="flex-grow max-w-3xl w-full mx-auto px-6 py-8 space-y-8">

        {/* Important Notice */}
        <div className="bg-amber-100 border-l-4 border-amber-500 rounded-lg p-5">
          <div className="flex items-start gap-4">
            <Bell className="w-8 h-8 text-amber-700 shrink-0" />
            <div>
              <h2 className="font-bold text-amber-900 text-lg mb-1">Community Assembly</h2>
              <p className="text-amber-800 text-base">
                Join us this Saturday at 9:00 AM at the Barangay Plaza. Everyone is welcome.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4">

            <Link href="/services" className="bg-white border-2 border-sky-100 p-6 rounded-2xl flex items-center justify-between hover:bg-sky-50 transition-colors shadow-sm cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="bg-sky-100 p-4 rounded-full text-sky-700">
                  <FileText className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Request Documents</h3>
                  <p className="text-slate-600 text-sm">Clearance, Indigency</p>
                </div>
              </div>
              <ArrowRight className="w-6 h-6 text-slate-400" />
            </Link>

            <Link href="/incidents" className="bg-white border-2 border-red-100 p-6 rounded-2xl flex items-center justify-between hover:bg-red-50 transition-colors shadow-sm cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="bg-red-100 p-4 rounded-full text-red-700">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Report an Incident</h3>
                  <p className="text-slate-600 text-sm">Emergencies, concerns</p>
                </div>
              </div>
              <ArrowRight className="w-6 h-6 text-slate-400" />
            </Link>

          </div>
        </section>
      </main>
    </div>
  );
}
