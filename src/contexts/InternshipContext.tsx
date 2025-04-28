
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Internship, InternshipCategory, Application, ApplicationStatus } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "./AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface InternshipContextType {
  internships: Internship[];
  userApplications: Application[];
  recruiterInternships: Internship[];
  recruiterApplications: Application[];
  getInternshipById: (id: string) => Internship | undefined;
  applyForInternship: (internshipId: string, applicationData: Partial<Application>) => Promise<void>;
  createInternship: (internship: Omit<Internship, 'id' | 'created_at' | 'recruiter_id'>) => Promise<void>;
  updateApplicationStatus: (applicationId: string, status: ApplicationStatus) => Promise<void>;
  hasApplied: (internshipId: string) => boolean;
  loading: boolean;
}

const InternshipContext = createContext<InternshipContextType | undefined>(undefined);

export const useInternships = () => {
  const context = useContext(InternshipContext);
  if (!context) {
    throw new Error("useInternships must be used within an InternshipProvider");
  }
  return context;
};

export const InternshipProvider = ({ children }: { children: ReactNode }) => {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    fetchInternships();

    if (isAuthenticated && user) {
      fetchApplications();
    }
  }, [isAuthenticated, user]);

  const fetchInternships = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('internships')
        .select('*');
      
      if (error) {
        console.error("Error fetching internships:", error);
        return;
      }

      if (data) {
        setInternships(data as unknown as Internship[]);
      }
    } catch (error) {
      console.error("Error fetching internships:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      let query;
      
      if (user.role === 'student') {
        query = supabase
          .from('applications')
          .select('*')
          .eq('student_id', user.id);
      } else {
        // For recruiters, get all applications for their internships
        const { data: recruiterInterns } = await supabase
          .from('internships')
          .select('id')
          .eq('recruiter_id', user.id);
          
        if (recruiterInterns && recruiterInterns.length > 0) {
          const internshipIds = recruiterInterns.map(intern => intern.id);
          
          query = supabase
            .from('applications')
            .select('*')
            .in('internship_id', internshipIds);
        } else {
          setApplications([]);
          setLoading(false);
          return;
        }
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching applications:", error);
        return;
      }

      if (data) {
        setApplications(data as unknown as Application[]);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get internship by ID
  const getInternshipById = (id: string) => {
    return internships.find(internship => internship.id === id);
  };

  // Filter user applications
  const userApplications = applications.filter(app => 
    user?.role === "student" && app.student_id === user?.id
  );

  // Filter recruiter internships
  const recruiterInternships = internships.filter(internship => 
    user?.role === "recruiter" && internship.recruiter_id === user?.id
  );

  // Get applications for recruiter's internships
  const recruiterApplications = applications.filter(app => {
    if (user?.role !== "recruiter") return false;
    
    // Check if this application is for one of the recruiter's internships
    const internship = internships.find(i => i.id === app.internship_id);
    return internship && internship.recruiter_id === user.id;
  });

  // Check if user has already applied to an internship
  const hasApplied = (internshipId: string) => {
    if (!user || user.role !== "student") return false;
    
    return applications.some(
      app => app.internship_id === internshipId && app.student_id === user.id
    );
  };

  // Apply for internship
  const applyForInternship = async (internshipId: string, applicationData: Partial<Application>) => {
    setLoading(true);
    
    try {
      if (!user || user.role !== "student") {
        throw new Error("You must be logged in as a student to apply");
      }
      
      // Check if already applied
      if (hasApplied(internshipId)) {
        throw new Error("You have already applied for this internship");
      }
      
      // Create application in Supabase
      const { data, error } = await supabase
        .from('applications')
        .insert([{
          internship_id: internshipId,
          student_id: user.id,
          resume_url: applicationData.resume_url,
          cover_letter: applicationData.cover_letter,
          additional_questions: applicationData.additional_questions
        }])
        .select();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        const newApplication = data[0] as unknown as Application;
        setApplications([...applications, newApplication]);
        
        toast({
          title: "Application submitted!",
          description: "Your application has been successfully submitted. We'll be in touch soon!",
        });
      }
    } catch (error: any) {
      console.error("Error applying for internship:", error);
      toast({
        title: "Application failed",
        description: error.message || "An error occurred while applying.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Create new internship
  const createInternship = async (internship: Omit<Internship, 'id' | 'created_at' | 'recruiter_id'>) => {
    setLoading(true);
    
    try {
      if (!user || user.role !== "recruiter") {
        throw new Error("You must be logged in as a recruiter to post internships");
      }
      
      // Create internship in Supabase
      const { data, error } = await supabase
        .from('internships')
        .insert([{
          ...internship,
          recruiter_id: user.id
        }])
        .select();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        const newInternship = data[0] as unknown as Internship;
        setInternships([...internships, newInternship]);
        
        toast({
          title: "Internship posted!",
          description: "Your internship has been successfully posted.",
        });
      }
    } catch (error: any) {
      console.error("Error creating internship:", error);
      toast({
        title: "Posting failed",
        description: error.message || "An error occurred while posting the internship.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Update application status
  const updateApplicationStatus = async (applicationId: string, status: ApplicationStatus) => {
    setLoading(true);
    
    try {
      if (!user || user.role !== "recruiter") {
        throw new Error("You must be logged in as a recruiter to update application status");
      }
      
      // Update status in Supabase
      const { data, error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', applicationId)
        .select();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        // Update local state
        const updatedApplications = applications.map(app => 
          app.id === applicationId ? { ...app, status } : app
        );
        
        setApplications(updatedApplications);
        
        toast({
          title: "Status updated",
          description: `Application status has been updated to ${status}.`,
        });
      }
    } catch (error: any) {
      console.error("Error updating application status:", error);
      toast({
        title: "Update failed",
        description: error.message || "An error occurred while updating the status.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <InternshipContext.Provider
      value={{
        internships,
        userApplications,
        recruiterInternships,
        recruiterApplications,
        getInternshipById,
        applyForInternship,
        createInternship,
        updateApplicationStatus,
        hasApplied,
        loading,
      }}
    >
      {children}
    </InternshipContext.Provider>
  );
};
