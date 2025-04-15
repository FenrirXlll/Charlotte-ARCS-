
import { createClient } from '@supabase/supabase-js';
import { ExtendedDatabase as Database } from '@/types/supabase';

// Project URL and anon key
const supabaseUrl = 'https://rjzhkazdkwgwphewtyna.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqemhrYXpka3dnd3BoZXd0eW5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMTUyODgsImV4cCI6MjA1OTc5MTI4OH0.hdoQ-frg9aob8y8ihesOUhqMzVX8OqP8_UBhZjkl9ow';

export const supabaseCustom = createClient<Database>(supabaseUrl, supabaseAnonKey);
