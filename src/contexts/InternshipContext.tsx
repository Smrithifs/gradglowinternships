
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Internship, UserRole, Application, ApplicationStatus } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface InternshipContextProps {
  loading: boolean;
  error: Error | null;
  internships: Internship[];
  studentApplications: Application[];
  recruiterInternships: Internship[];
  recruiterApplications: Application[];
  createInternship: (internshipData: Omit<Internship, "id" | "created_at" | "recruiter_id">) => Promise<void>;
  updateApplicationStatus: (applicationId: string, status: ApplicationStatus) => Promise<void>;
  fetchInternships: () => Promise<void>;
  fetchRecruiterInternships: () => Promise<void>;
  fetchApplications: () => Promise<void>;
  fetchRecruiterApplications: () => Promise<void>;
  deleteInternship: (id: string) => Promise<void>;
}

const InternshipContext = createContext<InternshipContextProps | undefined>(undefined);

export const InternshipProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [studentApplications, setStudentApplications] = useState<Application[]>([]);
  const [recruiterInternships, setRecruiterInternships] = useState<Internship[]>([]);
  const [recruiterApplications, setRecruiterApplications] = useState<Application[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchInternships = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('internship_listings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInternships(data);
    } catch (err) {
      console.error("Error fetching internships:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecruiterInternships = async () => {
    if (!user || user.role !== UserRole.RECRUITER) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('internship_listings')
        .select('*')
        .eq('recruiter_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecruiterInternships(data);
    } catch (err) {
      console.error("Error fetching recruiter internships:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    if (!user || user.role !== UserRole.STUDENT) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('student_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStudentApplications(data);
    } catch (err) {
      console.error("Error fetching applications:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecruiterApplications = async () => {
    if (!user || user.role !== UserRole.RECRUITER) return;
    
    setLoading(true);
    try {
      const { data: internshipsData, error: internshipsError } = await supabase
        .from('internship_listings')
        .select('id')
        .eq('recruiter_id', user.id);

      if (internshipsError) throw internshipsError;
      
      if (internshipsData.length === 0) {
        setRecruiterApplications([]);
        setLoading(false);
        return;
      }
      
      const internshipIds = internshipsData.map(listing => listing.id);
      
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .in('internship_id', internshipIds)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecruiterApplications(data);
    } catch (err) {
      console.error("Error fetching recruiter applications:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const createInternship = async (internshipData: Omit<Internship, "id" | "created_at" | "recruiter_id">) => {
    if (!user || user.role !== UserRole.RECRUITER) {
      toast({
        title: "Permission Denied",
        description: "Only recruiters can post internships.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    try {
      const newInternship = {
        ...internshipData,
        recruiter_id: user.id
      };
      
      const { data, error } = await supabase
        .from('internship_listings')
        .insert([newInternship])
        .select()
        .single();

      if (error) throw error;
      
      // Update the local state with the new internship
      setRecruiterInternships(prev => [data, ...prev]);
      setInternships(prev => [data, ...prev]);
      
      toast({
        title: "Internship Posted",
        description: "Your internship has been successfully posted.",
      });
    } catch (err) {
      console.error("Error creating internship:", err);
      setError(err as Error);
      toast({
        title: "Error",
        description: "Failed to post internship. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteInternship = async (id: string) => {
    if (!user || user.role !== UserRole.RECRUITER) {
      toast({
        title: "Permission Denied",
        description: "Only recruiters can delete internships.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('internship_listings')
        .delete()
        .eq('id', id)
        .eq('recruiter_id', user.id);

      if (error) throw error;
      
      // Update local state
      setRecruiterInternships(prev => prev.filter(internship => internship.id !== id));
      setInternships(prev => prev.filter(internship => internship.id !== id));
      
      toast({
        title: "Internship Deleted",
        description: "Your internship has been successfully deleted.",
      });
    } catch (err) {
      console.error("Error deleting internship:", err);
      setError(err as Error);
      toast({
        title: "Error",
        description: "Failed to delete internship. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: ApplicationStatus) => {
    if (!user || user.role !== UserRole.RECRUITER) {
      toast({
        title: "Permission Denied",
        description: "Only recruiters can update application status.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', applicationId);

      if (error) throw error;
      
      // Update local state
      setRecruiterApplications(prev => 
        prev.map(app => 
          app.id === applicationId ? { ...app, status } : app
        )
      );
      
      toast({
        title: "Application Updated",
        description: `Application status updated to ${status}.`,
      });
    } catch (err) {
      console.error("Error updating application:", err);
      setError(err as Error);
      toast({
        title: "Error",
        description: "Failed to update application status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Initialize data fetching when user changes
  useEffect(() => {
    if (user) {
      fetchInternships();
      
      if (user.role === UserRole.STUDENT) {
        fetchApplications();
      } else if (user.role === UserRole.RECRUITER) {
        fetchRecruiterInternships();
        fetchRecruiterApplications();
      }
    }
  }, [user]);

  return (
    <InternshipContext.Provider
      value={{
        loading,
        error,
        internships,
        studentApplications,
        recruiterInternships,
        recruiterApplications,
        createInternship,
        updateApplicationStatus,
        fetchInternships,
        fetchRecruiterInternships,
        fetchApplications,
        fetchRecruiterApplications,
        deleteInternship
      }}
    >
      {children}
    </InternshipContext.Provider>
  );
};

export const useInternships = () => {
  const context = useContext(InternshipContext);
  if (!context) {
    throw new Error("useInternships must be used within an InternshipProvider");
  }
  return context;
};
