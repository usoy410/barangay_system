/**
 * Represents a Household entity in the database.
 */
export interface Household {
  id: string;
  household_name: string;
  address: string;
  created_at: string;
}

/**
 * Represents a Resident entity in the database.
 * includes basic demographic and census information.
 */
export interface Resident {
  id: string;
  household_id: string | null;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  birth_date: string;
  gender: 'Male' | 'Female' | 'Other';
  civil_status: 'Single' | 'Married' | 'Widowed' | 'Separated';
  address: string;
  mobile_number: string;
  password_hash: string | null;
  role: 'Resident' | 'Official' | 'Admin';
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Represents a request for official documents (Clearance or Indigency).
 */
export interface ClearanceRequest {
  id: string;
  resident_id: string;
  type: 'Clearance' | 'Indigency';
  purpose: string;
  status: 'Pending' | 'Issued' | 'Void';
  issued_at: string | null;
  issued_by: string | null;
  created_at: string;
}

/**
 * Represents an incident report submitted by residents or officials.
 */
export interface Incident {
  id: string;
  reporter_name: string;
  title: string;
  description: string;
  location: string;
  status: 'Pending' | 'In Progress' | 'Resolved' | 'Spam';
  created_at: string;
}
