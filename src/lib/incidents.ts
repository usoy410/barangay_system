import { supabase } from './supabase';
import type { Incident } from '@/types/database';

/**
 * Data access layer for Incident Reporting.
 * Handles fetching, reporting, and status updates for incidents.
 */

/**
 * Fetches the feed of incidents.
 * 
 * @returns A promise resolving to an array of incident records.
 */
export async function getIncidents() {
  const { data, error } = await supabase
    .from('incidents')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching incidents:', error);
    throw error;
  }

  return data as Incident[];
}

/**
 * Submits a new incident report.
 * 
 * @param report - Incident details (title, description, reporter_name, resident_id).
 */
export async function reportIncident(report: Omit<Incident, 'id' | 'status' | 'created_at'>) {
  const { data, error } = await supabase
    .from('incidents')
    .insert([report])
    .select()
    .single();

  if (error) {
    console.error('Error reporting incident:', error);
    throw error;
  }

  return data as Incident;
}

/**
 * Fetches incidents reported by a specific resident.
 * 
 * @param residentId - The UUID of the resident.
 */
export async function getResidentIncidents(residentId: string) {
  const { data, error } = await supabase
    .from('incidents')
    .select('*')
    .eq('resident_id', residentId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching resident incidents:', error);
    return [];
  }

  return data as Incident[];
}

/**
 * Updates the resolution status of an incident.
 * 
 * @param id - The UUID of the incident.
 * @param status - The new status (e.g., 'In Progress', 'Resolved').
 */
export async function updateIncidentStatus(id: string, status: Incident['status']) {
  const { data, error } = await supabase
    .from('incidents')
    .update({ status })
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating incident status:', error);
    throw error;
  }

  if (!data || data.length === 0) {
    const err = new Error('No incident found with this ID or update was blocked by security policies.');
    console.error(err.message);
    throw err;
  }

  return data[0] as Incident;
}
