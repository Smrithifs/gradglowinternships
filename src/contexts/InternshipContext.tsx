
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Internship, UserRole, Application, ApplicationStatus } from "@/types";
import { InternshipContextProps } from "@/types/context";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { 
  fetchAllInternships, 
  fetchRecruiterInternships as fetchRecruiterInternshipsService,
  fetchStudentApplications,
  fetchRecruiterApplications as fetchRecruiterApplicationsService,
  createInternship as createInternshipService,
  deleteInternship as deleteInternshipService,
  updateApplicationStatus as updateApplicationStatusService,
  applyForInternship as applyForInternshipService
} from "@/services/internshipService";

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
      const data = await fetchAllInternships();
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
      const data = await fetchRecruiterInternshipsService(user.id);
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
      const data = await fetchStudentApplications(user.id);
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
      // In a real app, you'd fetch applications for this recruiter's internships
      const data = await fetchRecruiterApplicationsService();
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
      const newInternship = await createInternshipService(internshipData, user.id);
      
      setRecruiterInternships(prev => [newInternship, ...prev]);
      setInternships(prev => [newInternship, ...prev]);
      
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
      await deleteInternshipService(id, user.id);
      
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
      await updateApplicationStatusService(applicationId, status);
      
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

  // Get internship by ID
  const getInternshipById = (id: string): Internship | null => {
    return internships.find(internship => internship.id === id) || null;
  };

  // Check if student has applied to an internship
  const hasApplied = (internshipId: string): boolean => {
    return studentApplications.some(app => app.internship_id === internshipId);
  };

  // Apply for an internship
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
      const newApplication = await applyForInternshipService(
        internship,
        user.id,
        user.name || null,
        applicationData
      );

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
