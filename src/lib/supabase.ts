import { createClient } from '@supabase/supabase-js';

// Fallback to placeholders during build-time to prevent prerendering errors
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

/**
 * Initialize the Supabase client for client-side and server-side usage.
 * This client uses the anonymous key and is subject to Row Level Security (RLS).
 * 
 * @example
 * const { data, error } = await supabase.from('residents').select('*');
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
