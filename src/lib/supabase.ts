
import { createClient } from '@supabase/supabase-js';

// Use the correct Supabase URL and anon key
const supabaseUrl = 'https://mlmskaopfwczkgxrosqz.supabase.co';
// Replace placeholder key with actual key (this is a placeholder format for demo purposes)
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sbXNrYW9wZndjemsrZ3hyb3NxeiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjIyNTAyOTkwLCJleHAiOjE5MzgwNzg5OTB9.7oLyV2CqkQTP6ahWYcNdlYlbQEENuzWCnS615Iyu3ZU';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
