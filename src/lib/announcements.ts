import { supabase } from './supabase';
import type { Announcement } from '@/types/database';

/**
 * Data access layer for Barangay Announcements.
 * Handles fetching, creating, updating, and deleting announcements.
 */

/**
 * Fetches all active announcements or all announcements for admin view.
 * 
 * @param activeOnly - If true, only fetches announcements where is_active is true.
 * @returns A promise resolving to an array of announcement records.
 */
export async function getAnnouncements(activeOnly: boolean = true) {
  let query = supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false });

  if (activeOnly) {
    const now = new Date().toISOString();
    query = query
      .eq('is_active', true)
      .or(`starts_at.lte.${now},starts_at.is.null`)
      .or(`expires_at.gt.${now},expires_at.is.null`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching announcements:', error);
    throw error;
  }

  return data as Announcement[];
}

/**
 * Fetches a single announcement by ID.
 * 
 * @param id - The UUID of the announcement.
 */
export async function getAnnouncementById(id: string) {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching announcement by ID:', error);
    throw error;
  }

  return data as Announcement;
}

/**
 * Creates a new announcement.
 * 
 * @param announcement - Announcement details (title, content, category, image_url).
 * @param adminId - The UUID of the admin/official performing the creation for auditing.
 */
export async function createAnnouncement(announcement: Omit<Announcement, 'id' | 'created_at' | 'updated_at'>, adminId?: string) {
  if (adminId) {
    await supabase.rpc('set_app_user_id', { user_id: adminId });
  }

  const { data, error } = await supabase
    .from('announcements')
    .insert([announcement])
    .select()
    .single();

  if (error) {
    console.error('Error creating announcement:', error);
    throw error;
  }

  return data as Announcement;
}

/**
 * Updates an existing announcement.
 * 
 * @param id - The UUID of the announcement.
 * @param updates - Fields to update.
 * @param adminId - The UUID of the admin/official performing the update for auditing.
 */
export async function updateAnnouncement(id: string, updates: Partial<Omit<Announcement, 'id' | 'created_at' | 'updated_at'>>, adminId?: string) {
  if (adminId) {
    await supabase.rpc('set_app_user_id', { user_id: adminId });
  }

  const { data, error } = await supabase
    .from('announcements')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating announcement:', error);
    throw error;
  }

  return data as Announcement;
}

/**
 * Deletes an announcement.
 * 
 * @param id - The UUID of the announcement.
 * @param adminId - The UUID of the admin/official performing the deletion for auditing.
 */
export async function deleteAnnouncement(id: string, adminId?: string) {
  if (adminId) {
    await supabase.rpc('set_app_user_id', { user_id: adminId });
  }

  const { error } = await supabase
    .from('announcements')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting announcement:', error);
    throw error;
  }

  return true;
}
