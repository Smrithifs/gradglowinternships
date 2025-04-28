
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { User, UserRole } from "@/types";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
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
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In a real app, this would check with Supabase
        const storedUser = localStorage.getItem("gradglow_user");
        
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Mock sign in function - would use Supabase in real implementation
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      // In a real app, this would call Supabase auth.signIn
      // Mocking authentication for demo purposes
      const mockUsers = [
        { id: "1", email: "student@example.com", password: "password", role: UserRole.STUDENT, name: "John Student" },
        { id: "2", email: "recruiter@example.com", password: "password", role: UserRole.RECRUITER, name: "Jane Recruiter" }
      ];

      const foundUser = mockUsers.find(u => u.email === email && u.password === password);
      
      if (!foundUser) {
        throw new Error("Invalid credentials");
      }
      
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      
      // Store user in localStorage for persistence
      localStorage.setItem("gradglow_user", JSON.stringify(userWithoutPassword));

      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });

      // Redirect based on role
      navigate(foundUser.role === UserRole.STUDENT ? "/dashboard" : "/recruiter-dashboard");
    } catch (error) {
      console.error("Error signing in:", error);
      toast({
        title: "Sign in failed",
        description: error instanceof Error ? error.message : "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Mock sign up function - would use Supabase in real implementation
  const signUp = async (email: string, password: string, role: UserRole, name: string) => {
    setLoading(true);
    
    try {
      // In a real app, this would call Supabase auth.signUp
      // For demo purposes, we'll pretend the signup was successful
      const newUser = {
        id: Math.random().toString(36).substring(2, 9),
        email,
        role,
        name
      };
      
      setUser(newUser);
      localStorage.setItem("gradglow_user", JSON.stringify(newUser));
      
      toast({
        title: "Account created!",
        description: "Your account has been successfully created.",
      });
      
      // Redirect based on role
      navigate(role === UserRole.STUDENT ? "/dashboard" : "/recruiter-dashboard");
    } catch (error) {
      console.error("Error signing up:", error);
      toast({
        title: "Sign up failed",
        description: error instanceof Error ? error.message : "An error occurred during sign up.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Mock sign out function
  const signOut = async () => {
    try {
      // In a real app, this would call Supabase auth.signOut
      setUser(null);
      localStorage.removeItem("gradglow_user");
      toast({
        title: "Signed out",
        description: "You've been successfully signed out.",
      });
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Sign out failed",
        description: "An error occurred while signing out.",
        variant: "destructive",
      });
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
