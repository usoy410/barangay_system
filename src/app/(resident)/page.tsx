'use client';

import React from 'react';
import Link from 'next/link';
import { LogOut, ArrowRight, FileText, AlertTriangle, Bell } from 'lucide-react';
import { clearDemoSession } from '@/lib/auth-demo';
import { useRouter } from 'next/navigation';
import { BotHeader } from '@/components/ui/BotHeader';
import { OfficialDirectory } from '@/components/services/OfficialDirectory';
import { getOfficials } from '@/lib/residents';
import { getAnnouncements } from '@/lib/announcements';
import { Resident, Announcement } from '@/types/database';
import { AnnouncementCarousel } from '@/components/announcements/AnnouncementCarousel';

export default function CitizenHome() {
  const router = useRouter();
  const [officials, setOfficials] = React.useState<Resident[]>([]);
  const [announcements, setAnnouncements] = React.useState<Announcement[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      try {
        const [officialsData, announcementsData] = await Promise.all([
          getOfficials(),
          getAnnouncements(true)
        ]);
        setOfficials(officialsData);
        setAnnouncements(announcementsData);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="flex flex-col font-atkinson relative overflow-hidden">
      {/* Mobile-first Header */}
      <BotHeader 
        title="Magandang Araw!"
        message={<>Maligayang pagdating! Ako ang inyong AI assistant. <b>Konektado Kita.</b></>}
      />

      <main className="grow max-w-3xl w-full mx-auto px-6 py-8 space-y-8">

        {/* Announcements Carousel */}
        <section>
          {loading ? (
            <div className="h-48 bg-slate-100 animate-pulse rounded-[2.5rem]" />
          ) : announcements.length > 0 ? (
            <AnnouncementCarousel announcements={announcements} />
          ) : null}
        </section>

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
                  <p className="text-slate-600 text-sm">Clearance, Indigency, at iba pa</p>
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
                  <p className="text-slate-600 text-sm">Mga emergency at reklamo</p>
                </div>
              </div>
              <ArrowRight className="w-6 h-6 text-slate-400" />
            </Link>

          </div>
        </section>

        {/* Barangay Directory Section */}
        <section className="pb-12">
          {loading ? (
            <div className="h-40 bg-slate-100 animate-pulse rounded-2xl" />
          ) : (
            <OfficialDirectory officials={officials} />
          )}
        </section>
      </main>
    </div>
  );
}
