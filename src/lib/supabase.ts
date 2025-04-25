
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mlmskaopfwczkgxrosqz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMjUwMjk5MCwiZXhwIjoxOTM4MDc4OTkwfQ.placeholder-key';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
