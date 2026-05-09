'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Bell, Calendar, Tag, CheckCircle, XCircle, Search, Clock } from 'lucide-react';
import { getAnnouncements, deleteAnnouncement, updateAnnouncement } from '@/lib/announcements';
import { Announcement } from '@/types/database';
import { clsx } from 'clsx';

/**
 * Admin view for managing announcements.
 * Allows listing, searching, toggling status, and deleting announcements.
 */
export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadAnnouncements();
  }, []);

  async function loadAnnouncements() {
    try {
      const data = await getAnnouncements(false); // Fetch all including inactive
      setAnnouncements(data);
    } catch (error) {
      console.error('Failed to load announcements:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    try {
      await deleteAnnouncement(id);
      setAnnouncements(announcements.filter(a => a.id !== id));
    } catch (error) {
      alert('Failed to delete announcement');
    }
  };

  const handleToggleStatus = async (announcement: Announcement) => {
    try {
      const updated = await updateAnnouncement(announcement.id, { is_active: !announcement.is_active });
      setAnnouncements(announcements.map(a => a.id === announcement.id ? updated : a));
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const filteredAnnouncements = announcements.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-lexend font-black text-slate-900 mb-2">Announcements</h1>
          <p className="text-slate-500 font-medium">Broadcast news, events, and emergency alerts to residents.</p>
        </div>
        <Link 
          href="/admin/announcements/new" 
          className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-cyan-100 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Create Announcement
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm mb-8 flex items-center gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search announcements..." 
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-48 bg-slate-100 animate-pulse rounded-[2rem]" />
          ))}
        </div>
      ) : filteredAnnouncements.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-300">
          <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Bell className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No announcements found</h3>
          <p className="text-slate-500">Try adjusting your search or create a new announcement.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAnnouncements.map((announcement) => (
            <AnnouncementCard 
              key={announcement.id} 
              announcement={announcement} 
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const AnnouncementCard = ({ 
  announcement, 
  onDelete, 
  onToggleStatus 
}: { 
  announcement: Announcement; 
  onDelete: (id: string) => void;
  onToggleStatus: (a: Announcement) => void;
}) => {
  const categoryStyles = {
    Emergency: 'bg-red-50 text-red-600 border-red-100',
    Event: 'bg-blue-50 text-blue-600 border-blue-100',
    Holiday: 'bg-purple-50 text-purple-600 border-purple-100',
    General: 'bg-slate-50 text-slate-600 border-slate-100',
  };

  return (
    <div className={clsx(
      "bg-white rounded-[2rem] border transition-all duration-300 group hover:shadow-xl",
      announcement.is_active ? "border-slate-100" : "opacity-60 border-slate-200"
    )}>
      <div className="p-8">
        <div className="flex justify-between items-start mb-6">
          <span className={clsx(
            "px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border",
            categoryStyles[announcement.category]
          )}>
            {announcement.category}
          </span>
          <div className="flex gap-2">
            <Link 
              href={`/admin/announcements/${announcement.id}/edit`}
              className="p-2 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-xl transition-all"
            >
              <Edit className="w-5 h-5" />
            </Link>
            <button 
              onClick={() => onDelete(announcement.id)}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2">{announcement.title}</h3>
        <p className="text-slate-600 text-sm mb-6 line-clamp-3 leading-relaxed">{announcement.content}</p>

        <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-50">
          <div className="flex flex-col gap-2 text-slate-400 text-[10px] font-bold">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Created {new Date(announcement.created_at).toLocaleDateString()}
            </div>
            {announcement.starts_at && (
              <div className={clsx(
                "flex items-center gap-1.5",
                new Date(announcement.starts_at) > new Date() ? "text-amber-500" : "text-slate-400"
              )}>
                <Clock className="w-3.5 h-3.5" />
                Starts {new Date(announcement.starts_at).toLocaleString()}
                {new Date(announcement.starts_at) > new Date() && " (Scheduled)"}
              </div>
            )}
            {announcement.expires_at && (
              <div className={clsx(
                "flex items-center gap-1.5",
                new Date(announcement.expires_at) < new Date() ? "text-red-500" : "text-slate-400"
              )}>
                <Clock className="w-3.5 h-3.5" />
                Expires {new Date(announcement.expires_at).toLocaleString()}
                {new Date(announcement.expires_at) < new Date() && " (Expired)"}
              </div>
            )}
          </div>
          
          <button 
            onClick={() => onToggleStatus(announcement)}
            className={clsx(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0",
              announcement.is_active 
                ? "bg-green-50 text-green-700 hover:bg-green-100" 
                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            )}
          >
            {announcement.is_active ? (
              <><CheckCircle className="w-4 h-4" /> Active</>
            ) : (
              <><XCircle className="w-4 h-4" /> Inactive</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
