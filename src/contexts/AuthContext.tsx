
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabaseCustom, authFunctions } from '@/lib/supabase-custom';
import { User } from '@supabase/supabase-js';
import { toast as sonnerToast } from 'sonner';

interface UserProfile {
  id: string;
  full_name?: string;
  avatar_url?: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      
      // Check for existing session
      const { session, error } = await authFunctions.getSession();
      
      if (session?.user) {
        setUser(session.user);
        
        // Load user profile
        await loadUserProfile(session.user.id);
        
        // Check if user is admin
        const isUserAdmin = await authFunctions.checkAdminAccess(session.user.email || '');
        setIsAdmin(isUserAdmin);
      }
      
      // Set up auth state change subscription
      const { data } = supabaseCustom.auth.onAuthStateChange(async (event, newSession) => {
        if (event === 'SIGNED_IN' && newSession?.user) {
          setUser(newSession.user);
          await loadUserProfile(newSession.user.id);
          const isUserAdmin = await authFunctions.checkAdminAccess(newSession.user.email || '');
          setIsAdmin(isUserAdmin);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
          setIsAdmin(false);
        }
      });
      
      setLoading(false);
      
      // Cleanup subscription
      return () => {
        data.subscription.unsubscribe();
      };
    };
    
    initAuth();
  }, []);
  
  // Load user profile from database
  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabaseCustom
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) throw error;
      
      setProfile(data);
    } catch (error) {
      console.error('Error loading user profile:', error);
      setProfile(null);
    }
  };
  
  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await authFunctions.signIn(email, password);
      
      if (error) throw error;
      
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || 'Error al iniciar sesión. Inténtalo de nuevo.' 
      };
    }
  };
  
  // Sign up new user
  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await authFunctions.signUp(email, password, fullName);
      
      if (error) throw error;
      
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || 'Error al registrarse. Inténtalo de nuevo.' 
      };
    }
  };
  
  // Sign out
  const signOut = async () => {
    try {
      await authFunctions.signOut();
      setUser(null);
      setProfile(null);
      setIsAdmin(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Error al cerrar sesión. Inténtalo de nuevo.',
        variant: 'destructive',
      });
    }
  };
  
  // Update user profile
  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) {
      return { 
        success: false, 
        error: 'Usuario no autenticado' 
      };
    }
    
    try {
      const { error } = await supabaseCustom
        .from('profiles')
        .update(data)
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Refresh profile data
      await loadUserProfile(user.id);
      
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || 'Error al actualizar el perfil. Inténtalo de nuevo.' 
      };
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        profile, 
        isAdmin, 
        loading, 
        signIn, 
        signUp, 
        signOut, 
        updateProfile 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
