import { supabase } from './supabase';
import type { Resident } from '@/types/database';

/**
 * Data access layer for Resident-related operations.
 * Handles fetching, creating, updating, and archiving residents.
 */

/**
 * Fetches a list of residents with optional filtering and pagination.
 * 
 * @param options - Filtering and pagination options.
 * @returns A promise resolving to an array of residents.
 */
export async function getResidents(options?: {
  search?: string;
  isArchived?: boolean;
  limit?: number;
  offset?: number;
}) {
  let query = supabase
    .from('residents')
    .select('*', { count: 'exact' });

  if (options?.search) {
    query = query.or(`first_name.ilike.%${options.search}%,last_name.ilike.%${options.search}%`);
  }

  if (options?.isArchived !== undefined) {
    query = query.eq('is_archived', options.isArchived);
  } else {
    query = query.eq('is_archived', false);
  }

  if (options?.limit) {
    const from = options.offset || 0;
    const to = from + options.limit - 1;
    query = query.range(from, to);
  }

  const { data, error, count } = await query.order('last_name', { ascending: true });

  if (error) {
    console.error('Error fetching residents:', error);
    throw error;
  }

  return { data: data as Resident[], count };
}

/**
 * Creates a new resident entry in the database.
 * 
 * @param resident - The resident data to insert.
 * @returns The newly created resident record.
 */
export async function createResident(resident: Omit<Resident, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('residents')
    .insert([resident])
    .select()
    .single();

  if (error) {
    console.error('Error creating resident:', error);
    throw error;
  }

  return data as Resident;
}

/**
 * Updates an existing resident's information.
 * 
 * @param id - The UUID of the resident.
 * @param updates - Partial resident object with updated fields.
 * @returns The updated resident record.
 */
export async function updateResident(id: string, updates: Partial<Resident>) {
  const { data, error } = await supabase
    .from('residents')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating resident:', error);
    throw error;
  }

  return data as Resident;
}

/**
 * Performs a soft delete (archive) on a resident.
 * 
 * @param id - The UUID of the resident to archive.
 */
export async function archiveResident(id: string) {
  const { error } = await supabase
    .from('residents')
    .update({ is_archived: true })
    .eq('id', id);

  if (error) {
    console.error('Error archiving resident:', error);
    throw error;
  }
}

/**
 * Fetches a single resident by their mobile number.
 */
export async function getResidentByMobile(mobile: string) {
  const { data, error } = await supabase
    .from('residents')
    .select('*')
    .eq('mobile_number', mobile)
    .single();

  if (error) {
    console.error('Error fetching resident by mobile:', error);
    return null;
  }

  return data as Resident;
}
