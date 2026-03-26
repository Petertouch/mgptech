import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ngklmluckyetcshnzpgv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5na2xtbHVja3lldGNzaG56cGd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NTcyOTEsImV4cCI6MjA5MDEzMzI5MX0.Gax424G3QueolbPjTkfmVGOZbBfVVDnpLacZ15KolKA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
