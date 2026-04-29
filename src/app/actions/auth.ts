'use server';

import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';
import type { Resident } from '@/types/database';

/**
 * Authenticates a user by their mobile number and plain text password.
 * Checks against bcrypt hash, and falls back to plain text check for backwards compatibility.
 * If a plain text password matches, it automatically migrates the user to a hashed password.
 * 
 * @param mobile - The user's 11-digit mobile number.
 * @param passwordPlain - The plain text password entered by the user.
 * @returns The authenticated resident data.
 * @throws Error if the user is not found or password does not match.
 */
export async function loginUser(mobile: string, passwordPlain: string) {
  const { data, error } = await supabase
    .from('residents')
    .select('*')
    .eq('mobile_number', mobile)
    .single();

  if (error || !data) {
    throw new Error('Invalid mobile number or password.');
  }

  // Handle plain text passwords for existing users (backwards compatibility)
  // or check against hash
  let isValid = false;
  // Use regex to detect any bcrypt hash version ($2a$, $2b$, $2y$, $2x$)
  // Why: Postgres crypt() or different bcrypt libraries may use prefixes other than $2a$
  if (data.password_hash && /^\$2[abyx]\$/.test(data.password_hash)) {
    isValid = await bcrypt.compare(passwordPlain, data.password_hash);
  } else {
    // Fallback for plaintext passwords during transition
    isValid = passwordPlain === data.password_hash;
    
    // Auto-migrate to hash (optional, but good practice)
    if (isValid) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(passwordPlain, salt);
      await supabase.from('residents').update({ password_hash: hash }).eq('id', data.id);
    }
  }

  if (!isValid) {
    throw new Error('Invalid mobile number or password.');
  }

  return data as Resident;
}

/**
 * Verifies the password of an admin user before allowing sensitive operations.
 * 
 * @param mobile - The admin's mobile number.
 * @param passwordPlain - The plain text password entered by the admin.
 * @returns True if the password is valid.
 * @throws Error if the admin is not found, unauthorized, or password does not match.
 */
export async function verifyAdminPassword(mobile: string, passwordPlain: string) {
  const { data, error } = await supabase
    .from('residents')
    .select('password_hash, role')
    .eq('mobile_number', mobile)
    .single();

  if (error || !data) {
    throw new Error('Admin not found.');
  }

  // Consider Admin or Official as valid for this lock
  if (data.role !== 'Admin' && data.role !== 'Official') {
    throw new Error('Unauthorized role.');
  }

  let isValid = false;
  // Use regex to detect any bcrypt hash version
  // Why: To ensure admin passwords hashed with different bcrypt versions are correctly validated
  if (data.password_hash && /^\$2[abyx]\$/.test(data.password_hash)) {
    isValid = await bcrypt.compare(passwordPlain, data.password_hash);
  } else {
    isValid = passwordPlain === data.password_hash;
  }

  if (!isValid) {
    throw new Error('Invalid admin password.');
  }

  return true;
}

/**
 * Generates a bcrypt hash for a given plain text password.
 * 
 * @param passwordPlain - The plain text password to hash.
 * @returns The resulting bcrypt hash string.
 */
export async function hashPassword(passwordPlain: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(passwordPlain, salt);
}
