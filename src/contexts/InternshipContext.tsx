import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Internship, UserRole, Application, ApplicationStatus } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

// Define types for database results to avoid deep type instantiation issues
type DbInternshipRow = {
  id: string;
  title: string;
  company: string;
  location: string;
  category: string; // Will be cast to enum
  description: string;
  requirements: string[];
  salary: string | null;
  duration: string;
  website: string | null;
  logo_url: string | null;
  created_at: string;
  deadline: string;
  is_remote: boolean;
  company_description: string | null;
  recruiter_id: string;
};

type DbApplicationRow = {
  id: string;
  student_id: string;
  created_at: string;
  portfolio_url: string | null;
  why_interested: string | null;
  relevant_experience: string | null;
  status: string;
  student_name: string | null;
  internship_title: string;
  internship_company: string;
  resume_url: string | null;
  cover_letter: string | null;
  linkedin_url: string | null;
};

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
  getInternshipById: (id: string) => Internship | null;
  hasApplied: (internshipId: string) => boolean;
  applyForInternship: (internshipId: string, applicationData: { resume_url?: string, cover_letter?: string, additional_questions?: Record<string, string> }) => Promise<void>;
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

  // Helper function to transform database internship to app internship
  const mapDbInternshipToInternship = (item: DbInternshipRow): Internship => ({
    id: item.id,
    title: item.title,
    company: item.company,
    location: item.location,
    category: item.category as any, // Cast to enum
    description: item.description,
    requirements: item.requirements,
    salary: item.salary,
    duration: item.duration,
    website: item.website,
    logo_url: item.logo_url,
    created_at: item.created_at,
    deadline: item.deadline,
    is_remote: item.is_remote,
    company_description: item.company_description,
    recruiter_id: item.recruiter_id
  });

  // Helper function to transform database application to app application
  const mapDbApplicationToApplication = (dbApp: DbApplicationRow): Application => ({
    id: dbApp.id,
    student_id: dbApp.student_id,
    internship_id: "", // Will be populated when needed
    status: dbApp.status as ApplicationStatus,
    resume_url: dbApp.resume_url || undefined,
    cover_letter: dbApp.cover_letter || undefined,
    created_at: dbApp.created_at,
    additional_questions: {
      linkedIn: dbApp.linkedin_url || undefined,
      portfolio: dbApp.portfolio_url || undefined,
      whyInterested: dbApp.why_interested || undefined,
      relevantExperience: dbApp.relevant_experience || undefined,
      internshipTitle: dbApp.internship_title,
      company: dbApp.internship_company
    }
  });

  const fetchInternships = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('internship_listings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform to our application model
      const transformedInternships: Internship[] = data.map((item: DbInternshipRow) => 
        mapDbInternshipToInternship(item)
      );
      
      setInternships(transformedInternships);
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
      
      // Transform to our application model
      const transformedInternships: Internship[] = data.map((item: DbInternshipRow) => 
        mapDbInternshipToInternship(item)
      );
      
      setRecruiterInternships(transformedInternships);
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

      // Transform applications for student view
      const transformedApplications: Application[] = data.map((app: DbApplicationRow) => 
        mapDbApplicationToApplication(app)
      );
      
      setStudentApplications(transformedApplications);
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
      
      // In a real app, you'd use internship_id to join with applications
      // For now, we'll just return all applications the recruiter would see
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform applications for recruiter view
      const transformedApplications: Application[] = data.map((app: DbApplicationRow) => 
        mapDbApplicationToApplication(app)
      );
      
      setRecruiterApplications(transformedApplications);
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
      const transformedInternship: Internship = mapDbInternshipToInternship({
        ...data,
        recruiter_id: user.id
      });
      
      setRecruiterInternships(prev => [transformedInternship, ...prev]);
      setInternships(prev => [transformedInternship, ...prev]);
      
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

  // Implement getInternshipById function
  const getInternshipById = (id: string): Internship | null => {
    return internships.find(internship => internship.id === id) || null;
  };

  // Implement hasApplied function
  const hasApplied = (internshipId: string): boolean => {
    return studentApplications.some(app => app.internship_id === internshipId);
  };

  // Implement applyForInternship function
  const applyForInternship = async (
    internshipId: string, 
    applicationData: { 
      resume_url?: string, 
      cover_letter?: string, 
      additional_questions?: Record<string, string> 
    }
  ) => {
    if (!user || user.role !== UserRole.STUDENT) {
      toast({
        title: "Permission Denied",
        description: "Only students can apply for internships.",
        variant: "destructive",
      });
      throw new Error("Only students can apply for internships");
    }

    const internship = getInternshipById(internshipId);
    if (!internship) {
      toast({
        title: "Error",
        description: "Internship not found.",
        variant: "destructive",
      });
      throw new Error("Internship not found");
    }

    setLoading(true);
    try {
      // Map to database structure
      const applicationRecord = {
        student_id: user.id,
        student_name: user.name || null,
        internship_company: internship.company,
        internship_title: internship.title,
        resume_url: applicationData.resume_url || null,
        cover_letter: applicationData.cover_letter || null,
        status: ApplicationStatus.PENDING,
        linkedin_url: applicationData.additional_questions?.linkedIn || null,
        portfolio_url: applicationData.additional_questions?.portfolio || null,
        why_interested: applicationData.additional_questions?.whyInterested || null,
        relevant_experience: applicationData.additional_questions?.relevantExperience || null,
      };

      const { data, error } = await supabase
        .from('applications')
        .insert([applicationRecord])
        .select()
        .single();

      if (error) throw error;

      // Add to local state
      const newApplication: Application = {
        id: data.id,
        internship_id: internshipId,
        student_id: user.id,
        status: ApplicationStatus.PENDING,
        resume_url: applicationData.resume_url,
        cover_letter: applicationData.cover_letter,
        created_at: data.created_at,
        additional_questions: applicationData.additional_questions
      };

      setStudentApplications(prev => [newApplication, ...prev]);

      toast({
        title: "Application Submitted",
        description: "Your application has been successfully submitted.",
      });

    } catch (err) {
      console.error("Error applying for internship:", err);
      setError(err as Error);
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
      throw err;
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
        deleteInternship,
        getInternshipById,
        hasApplied,
        applyForInternship
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
