
import { createClient } from '@supabase/supabase-js';
import type { ExtendedDatabase } from '@/types/supabase';

const SUPABASE_URL = "https://rjzhkazdkwgwphewtyna.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqemhrYXpka3dnd3BoZXd0eW5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMTUyODgsImV4cCI6MjA1OTc5MTI4OH0.hdoQ-frg9aob8y8ihesOUhqMzVX8OqP8_UBhZjkl9ow";

// Crear un cliente con tipos extendidos
export const supabaseCustom = createClient<ExtendedDatabase>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);
