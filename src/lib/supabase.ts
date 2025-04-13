
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rjzhkazdkwgwphewtyna.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqemhrYXpka3dnd3BoZXd0eW5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE5MDM2OTQsImV4cCI6MjAzNzQ3OTY5NH0.z6TrDn-04QdxwpGgtpYIxK5l4YINP4JHANqf1nSvBdw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
