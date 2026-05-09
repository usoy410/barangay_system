'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Announcement } from '@/types/database';
import { createAnnouncement, updateAnnouncement } from '@/lib/announcements';
import { Bell, ArrowLeft, Save, Loader2, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

interface AnnouncementFormProps {
  initialData?: Announcement;
  isEditing?: boolean;
}

/**
 * Reusable form for creating and editing announcements.
 */
export function AnnouncementForm({ initialData, isEditing }: AnnouncementFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    category: initialData?.category || 'General' as Announcement['category'],
    image_url: initialData?.image_url || '',
    is_active: initialData?.is_active ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing && initialData) {
        await updateAnnouncement(initialData.id, formData);
      } else {
        await createAnnouncement(formData);
      }
      router.push('/admin/announcements');
      router.refresh();
    } catch (error) {
      console.error('Error saving announcement:', error);
      alert('Failed to save announcement. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link 
        href="/admin/announcements" 
        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 transition-colors font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Announcements
      </Link>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
        <div className="bg-slate-900 p-10 text-white relative">
          <div className="relative z-10">
            <h1 className="text-3xl font-lexend font-black mb-2">
              {isEditing ? 'Edit Announcement' : 'Create New Announcement'}
            </h1>
            <p className="text-slate-400 font-medium">
              {isEditing ? 'Update the details of your announcement.' : 'Fill in the details to broadcast a new announcement.'}
            </p>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Title</label>
              <input 
                type="text" 
                required
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none transition-all font-medium"
                placeholder="e.g. Community Assembly 2026"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Category</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {['General', 'Emergency', 'Event', 'Holiday'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat as Announcement['category'] })}
                    className={`px-4 py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                      formData.category === cat 
                        ? 'border-cyan-600 bg-cyan-50 text-cyan-700' 
                        : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Image URL (Optional)</label>
              <div className="relative">
                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="url" 
                  className="w-full pl-12 pr-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none transition-all font-medium"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                />
              </div>
              <p className="mt-2 text-slate-400 text-xs">Recommended: High quality landscape image (16:9)</p>
            </div>

            {/* Content */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">Content</label>
                <span className={`text-xs font-bold px-3 py-1 rounded-full transition-all ${
                  formData.content.trim().split(/\s+/).filter(Boolean).length >= 30 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  {formData.content.trim().split(/\s+/).filter(Boolean).length} / 30 words
                </span>
              </div>
              <textarea 
                required
                rows={6}
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none transition-all font-medium resize-none"
                placeholder="Write the full announcement details here (max 30 words)..."
                value={formData.content}
                onChange={(e) => {
                  const val = e.target.value;
                  const words = val.trim().split(/\s+/).filter(Boolean);
                  if (words.length <= 30 || val.length < formData.content.length) {
                    setFormData({ ...formData, content: val });
                  }
                }}
              />
              <p className="mt-2 text-slate-400 text-xs italic">
                Pro-tip: Include a link (http/https) to automatically show a "More Information" button.
              </p>
            </div>

            {/* Active Toggle */}
            <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
              <input 
                type="checkbox" 
                id="is_active"
                className="w-5 h-5 accent-cyan-600 rounded-lg"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              />
              <label htmlFor="is_active" className="text-slate-700 font-bold cursor-pointer">
                Publish immediately
                <span className="block text-slate-400 text-xs font-medium">Inactive announcements won't be shown on the resident dashboard.</span>
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-5 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-300 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-cyan-100 flex items-center justify-center gap-3 active:scale-[0.98]"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <Save className="w-6 h-6" />
                {isEditing ? 'Save Changes' : 'Publish Announcement'}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
