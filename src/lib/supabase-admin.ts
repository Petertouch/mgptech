import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bgapniabglowonophvaz.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnYXBuaWFiZ2xvd29ub3BodmF6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjY1NTA5OCwiZXhwIjoyMDg4MjMxMDk4fQ.gCfSx-ExWu_Qn2k3DxSCHHqfd2IviA0vILZTK8I6BUg';

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});
