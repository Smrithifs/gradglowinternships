
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://vbkttodkbqbjcahequrt.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZia3R0b2RrYnFiamNhaGVxdXJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4MzM3MjksImV4cCI6MjA2MTQwOTcyOX0.iJhOvSJmfI8uOX9chJXsmwMlX8INboukZjeRp6RxXlo";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: localStorage
  },
  global: {
    headers: {
      'X-Client-Info': 'lovable-internship-app'
    }
  },
  db: {
    schema: 'public'
  }
});

// Helper function to check connection status
export const checkSupabaseConnection = async () => {
  try {
    // Use resume_links table instead of applications which no longer exists
    const { data, error } = await supabase
      .from('resume_links')
      .select('*')
      .limit(1)
      .maybeSingle();
      
    if (error) {
      console.error('Supabase connection error:', error);
      return false;
    }
    console.log('Supabase connection successful');
    return true;
  } catch (err) {
    console.error('Failed to connect to Supabase:', err);
    return false;
  }
};

// Call this function to verify the connection
checkSupabaseConnection();
