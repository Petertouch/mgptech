import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bgapniabglowonophvaz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnYXBuaWFiZ2xvd29ub3BodmF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2NTUwOTgsImV4cCI6MjA4ODIzMTA5OH0.taNMPV-fZTR-lMpuSdwcidtV1-ldBklPqnz5aVbpY9w';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
