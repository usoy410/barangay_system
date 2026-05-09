'use client';

import React, { useEffect, useState } from 'react';
import { AnnouncementForm } from '@/components/announcements/AnnouncementForm';
import { getAnnouncementById } from '@/lib/announcements';
import { Announcement } from '@/types/database';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function EditAnnouncementPage() {
  const { id } = useParams();
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadAnnouncement();
    }
  }, [id]);

  async function loadAnnouncement() {
    try {
      const data = await getAnnouncementById(id as string);
      setAnnouncement(data);
    } catch (error) {
      console.error('Failed to load announcement:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-cyan-600" />
      </div>
    );
  }

  if (!announcement) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-slate-500">
        <h2 className="text-2xl font-bold">Announcement not found</h2>
      </div>
    );
  }

  return <AnnouncementForm initialData={announcement} isEditing />;
}
