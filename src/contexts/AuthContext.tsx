
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { User, UserRole } from "@/types";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session, AuthResponse } from "@supabase/supabase-js";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (email: string, password: string, role: UserRole, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up the auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session);
        setSession(session);
        
        if (session?.user) {
          // Fetch the user profile from profiles table
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    const initSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error getting session:", error);
        setLoading(false);
      }
    };

    initSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user profile:', error);
        setLoading(false);
        return;
      }

      if (data) {
        console.log("User profile fetched:", data);
        
        setUser({
          id: userId,
          email: session?.user?.email || '',
          role: data.role === UserRole.STUDENT ? UserRole.STUDENT : UserRole.RECRUITER,
          name: data.name || undefined,
          avatar_url: data.avatar_url || undefined
        });
      } else {
        console.error('No profile found for user:', userId);
        toast.error('No profile found. Please sign out and sign up again.');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error in profile fetch:', error);
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<AuthResponse> => {
    setLoading(true);
    
    try {
      console.log("Signing in with:", email);
      const response = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (response.error) {
        toast.error(response.error.message);
        setLoading(false);
        throw response.error;
      }

      return response;
    } catch (error: any) {
      console.error("Error signing in:", error);
      setLoading(false);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, role: UserRole, name: string) => {
    setLoading(true);
    
    try {
      console.log("Signing up with:", { email, role, name });
      // First, create the auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role,
            name
          },
          emailRedirectTo: window.location.origin
        }
      });

      if (error) {
        toast.error(error.message);
        setLoading(false);
        throw error;
      }
      
      // After signup, manually create the profile entry
      if (data.user) {
        const profileData = {
          id: data.user.id,
          role: role,
          name: name,
          email: email
        };
        
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([profileData]);
          
        if (profileError) {
          console.error("Error creating profile:", profileError);
          toast.error("Account created but profile setup failed. Please sign in again.");
        } else {
          // Sign in the user automatically after signup
          await signIn(email, password);
          toast.success("Account created successfully!");
        }
      }
    } catch (error: any) {
      console.error("Error signing up:", error);
      toast.error(error.message || "An error occurred during sign up.");
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setSession(null);
      
      toast.success("You've been successfully signed out.");
      navigate("/");
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast.error(error.message || "An error occurred while signing out.");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
