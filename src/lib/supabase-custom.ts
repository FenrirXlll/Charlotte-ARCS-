
import { createClient } from '@supabase/supabase-js';
import { ExtendedDatabase as Database } from '@/types/supabase';

// Project URL and anon key
const supabaseUrl = 'https://rjzhkazdkwgwphewtyna.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqemhrYXpka3dnd3BoZXd0eW5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMTUyODgsImV4cCI6MjA1OTc5MTI4OH0.hdoQ-frg9aob8y8ihesOUhqMzVX8OqP8_UBhZjkl9ow';

export const supabaseCustom = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Enhanced authentication functions
export const authFunctions = {
  // Sign up a new user
  signUp: async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabaseCustom.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Error al registrarse:', error.message);
      return { data: null, error };
    }
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    try {
      const { data, error } = await supabaseCustom.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error.message);
      return { data: null, error };
    }
  },

  // Sign out the current user
  signOut: async () => {
    try {
      const { error } = await supabaseCustom.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      console.error('Error al cerrar sesión:', error.message);
      return { error };
    }
  },

  // Get the current session
  getSession: async () => {
    try {
      const { data, error } = await supabaseCustom.auth.getSession();
      if (error) throw error;
      return { session: data.session, error: null };
    } catch (error: any) {
      console.error('Error al obtener la sesión:', error.message);
      return { session: null, error };
    }
  },

  // Check if a user is an admin
  checkAdminAccess: async (email: string) => {
    try {
      // Here you can implement your admin checking logic
      // For example, checking against a whitelist or a database role
      return email === 'admin@charlotte.mx';
    } catch (error) {
      console.error('Error checking admin access:', error);
      return false;
    }
  }
};
