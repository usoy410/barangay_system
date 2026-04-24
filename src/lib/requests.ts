import { supabase } from './supabase';
import type { ClearanceRequest, Resident } from '@/types/database';

export type RequestWithResident = ClearanceRequest & {
  residents: Pick<Resident, 'first_name' | 'last_name' | 'address' | 'birth_date' | 'civil_status' | 'gender' | 'occupation' | 'mobile_number'>;
};

/**
 * Fetches all document requests, ideally joined with resident data.
 * 
 * @param status - Filter by request status or statuses.
 * @param from - Start index (0-based).
 * @param to - End index (0-based).
 */
export async function getServiceRequests(status?: ClearanceRequest['status'] | ClearanceRequest['status'][], from?: number, to?: number) {
  let query = supabase
    .from('clearance_requests')
    .select('*, residents(first_name, last_name, address, birth_date, civil_status, gender, occupation, mobile_number)');

  if (status) {
    if (Array.isArray(status)) {
      query = query.in('status', status);
    } else {
      query = query.eq('status', status);
    }
  }

  if (from !== undefined && to !== undefined) {
    query = query.range(from, to);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching service requests:', error);
    throw error;
  }

  return data as unknown as RequestWithResident[];
}

/**
 * Submits a new document request.
 */
export async function submitServiceRequest(request: Omit<ClearanceRequest, 'id' | 'created_at' | 'status' | 'issued_at' | 'issued_by'>) {
  const { data, error } = await supabase
    .from('clearance_requests')
    .insert([
      {
        ...request,
        status: 'Pending',
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error submitting service request:', error);
    throw error;
  }

  return data as ClearanceRequest;
}

/**
 * Updates the status of a request (e.g., mark as Issued).
 */
export async function updateRequestStatus(id: string, status: ClearanceRequest['status'], issuedBy?: string) {
  const updates: Partial<ClearanceRequest> = { status };
  
  if (status === 'Issued') {
    updates.issued_at = new Date().toISOString();
    
    // Defensive check: Ensure issuedBy is a valid UUID before sending to Supabase
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    updates.issued_by = (issuedBy && uuidRegex.test(issuedBy)) ? issuedBy : null;
  }

  const { data, error } = await supabase
    .from('clearance_requests')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating request status:', error);
    throw error;
  }

  return data as ClearanceRequest;
}

/**
 * Gets a count of requests by status.
 */
export async function getRequestCount(status?: ClearanceRequest['status']) {
  let query = supabase
    .from('clearance_requests')
    .select('*', { count: 'exact', head: true });

  if (status) {
    query = query.eq('status', status);
  }

  const { count, error } = await query;

  if (error) {
    console.error('Error getting request count:', error);
    return 0;
  }

  return count || 0;
}

/**
 * Fetches all document requests for a specific resident.
 */
export async function getResidentRequests(residentId: string) {
  const { data, error } = await supabase
    .from('clearance_requests')
    .select('*')
    .eq('resident_id', residentId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching resident requests:', error);
    return [];
  }

  return data as ClearanceRequest[];
}
