
import { createClient } from '@supabase/supabase-js';

// Try to get from environment variables, otherwise use default values for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-project.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzZ2VjYWpmaG11cWJ5YmZ1bWhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTUwMDYxMjMsImV4cCI6MjAxMDU4MjEyM30.placeholder-key';

// Only throw error in production to allow development without proper env vars
if (import.meta.env.PROD && (!supabaseUrl || !supabaseKey)) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
