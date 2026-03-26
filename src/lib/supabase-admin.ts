import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ngklmluckyetcshnzpgv.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5na2xtbHVja3lldGNzaG56cGd2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDU1NzI5MSwiZXhwIjoyMDkwMTMzMjkxfQ.k-n1P77CQoNY7yysWQWEijyWST4qRFQin0vRoUmenYE';

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});
