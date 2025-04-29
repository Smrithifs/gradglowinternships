
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Internship, InternshipCategory, Application, ApplicationStatus } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "./AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

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

const dummyInternships: Partial<Internship>[] = [
  {
    title: "Software Development Intern",
    company: "Google",
    location: "Bangalore, India",
    description: "Join Google's dynamic engineering team and work on cutting-edge technologies. You'll collaborate with experienced developers on real-world projects that impact millions of users globally.",
    requirements: ["Pursuing B.Tech/M.Tech in Computer Science or related field", "Knowledge of Java, Python, or JavaScript", "Strong problem-solving skills", "Good communication skills"],
    category: InternshipCategory.SOFTWARE_DEVELOPMENT,
    duration: "3 months",
    salary: "₹60,000/month",
    deadline: new Date(2025, 6, 30).toISOString(),
    is_remote: false,
    website: "https://careers.google.com",
    logo_url: "https://logo.clearbit.com/google.com",
    company_description: "Google is a global technology leader focused on improving the ways people connect with information."
  },
  {
    title: "Data Science Intern",
    company: "Microsoft",
    location: "Hyderabad, India",
    description: "Work with our data science team to analyze large datasets and develop machine learning models that solve real business problems.",
    requirements: ["Pursuing Masters in Statistics, Mathematics, or Computer Science", "Experience with Python, R, or SQL", "Knowledge of machine learning algorithms", "Strong analytical skills"],
    category: InternshipCategory.DATA_SCIENCE,
    duration: "6 months",
    salary: "₹50,000/month",
    deadline: new Date(2025, 7, 15).toISOString(),
    is_remote: true,
    website: "https://careers.microsoft.com",
    logo_url: "https://logo.clearbit.com/microsoft.com",
    company_description: "Microsoft is a technology company that develops, licenses, supports, and sells computer software, consumer electronics, and personal computers."
  },
  {
    title: "Product Management Intern",
    company: "Amazon",
    location: "New Delhi, India",
    description: "Join our product team to help define and launch new features. You'll work closely with engineers, designers, and other product managers.",
    requirements: ["Pursuing MBA or equivalent", "Strong analytical skills", "Excellent communication", "Interest in e-commerce"],
    category: InternshipCategory.PRODUCT_MANAGEMENT,
    duration: "3 months",
    salary: "₹55,000/month",
    deadline: new Date(2025, 5, 20).toISOString(),
    is_remote: false,
    website: "https://amazon.jobs",
    logo_url: "https://logo.clearbit.com/amazon.com",
    company_description: "Amazon is guided by four principles: customer obsession rather than competitor focus, passion for invention, commitment to operational excellence, and long-term thinking."
  },
  {
    title: "UX/UI Design Intern",
    company: "Flipkart",
    location: "Bangalore, India",
    description: "Design user interfaces for Flipkart's web and mobile applications. Work with product managers and engineers to implement your designs.",
    requirements: ["Knowledge of design tools like Figma or Adobe XD", "Understanding of UX principles", "Basic HTML/CSS skills", "Portfolio of previous work"],
    category: InternshipCategory.DESIGN,
    duration: "4 months",
    salary: "₹40,000/month",
    deadline: new Date(2025, 8, 10).toISOString(),
    is_remote: true,
    website: "https://www.flipkartcareers.com",
    logo_url: "https://logo.clearbit.com/flipkart.com",
    company_description: "Flipkart is India's leading e-commerce marketplace with over 80 million products across 80+ categories."
  },
  {
    title: "Marketing Intern",
    company: "Netflix",
    location: "Mumbai, India",
    description: "Join our marketing team to develop and implement marketing strategies for Netflix in India. Work on social media campaigns, content marketing, and brand partnerships.",
    requirements: ["Pursuing degree in Marketing or Communications", "Creative mindset", "Excellent writing skills", "Knowledge of digital marketing"],
    category: InternshipCategory.MARKETING,
    duration: "6 months",
    salary: "₹45,000/month",
    deadline: new Date(2025, 6, 5).toISOString(),
    is_remote: false,
    website: "https://jobs.netflix.com",
    logo_url: "https://logo.clearbit.com/netflix.com",
    company_description: "Netflix is one of the world's leading entertainment services with millions of subscribers in over 190 countries."
  },
  {
    title: "Finance Intern",
    company: "Goldman Sachs",
    location: "Bangalore, India",
    description: "Work with financial analysts to support various finance functions including financial planning, reporting, and analysis.",
    requirements: ["Pursuing degree in Finance, Economics, or Accounting", "Strong analytical skills", "Proficiency in Excel", "Attention to detail"],
    category: InternshipCategory.FINANCE,
    duration: "3 months",
    salary: "₹50,000/month",
    deadline: new Date(2025, 7, 25).toISOString(),
    is_remote: false,
    website: "https://www.goldmansachs.com/careers",
    logo_url: "https://logo.clearbit.com/goldmansachs.com",
    company_description: "Goldman Sachs is a leading global investment banking, securities and investment management firm."
  },
  {
    title: "Frontend Developer Intern",
    company: "Adobe",
    location: "Noida, India",
    description: "Develop user interfaces for Adobe's creative software products. Work with modern JavaScript frameworks to build responsive and accessible web applications.",
    requirements: ["Knowledge of HTML, CSS, and JavaScript", "Experience with React or Vue", "Understanding of responsive design", "Passion for web development"],
    category: InternshipCategory.SOFTWARE_DEVELOPMENT,
    duration: "6 months",
    salary: "₹45,000/month",
    deadline: new Date(2025, 9, 15).toISOString(),
    is_remote: true,
    website: "https://www.adobe.com/careers",
    logo_url: "https://logo.clearbit.com/adobe.com",
    company_description: "Adobe is the global leader in digital media and digital marketing solutions."
  },
  {
    title: "Machine Learning Intern",
    company: "IBM",
    location: "Hyderabad, India",
    description: "Research and develop machine learning algorithms and applications. Implement and test ML models for various use cases.",
    requirements: ["Pursuing Masters or PhD in Computer Science or related field", "Knowledge of ML frameworks like TensorFlow or PyTorch", "Strong programming skills", "Experience with data analysis"],
    category: InternshipCategory.DATA_SCIENCE,
    duration: "6 months",
    salary: "₹40,000/month",
    deadline: new Date(2025, 8, 30).toISOString(),
    is_remote: false,
    website: "https://www.ibm.com/careers",
    logo_url: "https://logo.clearbit.com/ibm.com",
    company_description: "IBM is a global technology and innovation company headquartered in Armonk, NY."
  }
];

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
        .from('internship_listings')
        .select('*');
      
      if (error) {
        console.error("Error fetching internships:", error);
        if (dummyInternships.length > 0) {
          console.log("Using dummy internship data instead");
          populateDummyInternships();
        }
        return;
      }

      if (data && data.length > 0) {
        const typedData = data.map(item => ({
          ...item,
          id: item.id,
          title: item.title,
          company: item.company,
          location: item.location,
          category: item.category as InternshipCategory,
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
          recruiter_id: "" // We don't track recruiter_id in new schema
        })) as Internship[];
        
        setInternships(typedData);
      } else if (dummyInternships.length > 0) {
        console.log("No internships found in database. Using dummy internship data");
        populateDummyInternships();
      }
    } catch (error) {
      console.error("Error fetching internships:", error);
      if (dummyInternships.length > 0) {
        populateDummyInternships();
      }
    } finally {
      setLoading(false);
    }
  };

  const populateDummyInternships = async () => {
    const localDummyInternships = dummyInternships.map((intern, index) => ({
      ...intern,
      id: `dummy-${index}`,
      created_at: new Date().toISOString(),
      recruiter_id: 'dummy-recruiter'
    })) as Internship[];
    
    setInternships(localDummyInternships);
    
    // Only try to populate real database if we're connected to Supabase
    if (!user) return;
    
    for (const internship of dummyInternships) {
      try {
        const internshipToInsert = {
          title: internship.title!,
          company: internship.company!,
          location: internship.location!,
          category: internship.category!.toString(),
          description: internship.description!,
          requirements: internship.requirements!,
          salary: internship.salary || null,
          duration: internship.duration!,
          website: internship.website || null,
          logo_url: internship.logo_url || null,
          deadline: internship.deadline!,
          is_remote: internship.is_remote!,
          company_description: internship.company_description || null
        };
        
        const { error } = await supabase
          .from('internship_listings')
          .upsert([internshipToInsert]);
          
        if (error) {
          console.error("Error inserting dummy internship:", error);
        }
      } catch (error) {
        console.error("Error inserting dummy internship:", error);
      }
    }
    
    fetchInternships();
  };

  const fetchApplications = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      if (user.role === 'student') {
        const { data, error } = await supabase
          .from('applications')
          .select('*')
          .eq('student_id', user.id);
          
        if (error) {
          console.error("Error fetching applications:", error);
          return;
        }

        if (data) {
          // Transform data to match our Application type
          const transformedData = data.map(app => ({
            id: app.id,
            internship_id: app.internship_title, // Using title as a reference
            student_id: app.student_id,
            status: app.status as ApplicationStatus,
            resume_url: app.resume_url || undefined,
            cover_letter: app.cover_letter || undefined,
            created_at: app.created_at,
            additional_questions: {
              linkedIn: app.linkedin_url || "",
              portfolio: app.portfolio_url || "",
              whyInterested: app.why_interested || "",
              relevantExperience: app.relevant_experience || "",
              internshipTitle: app.internship_title || "",
              company: app.internship_company || "",
            }
          })) as Application[];
          
          setApplications(transformedData);
        }
      } else {
        // For recruiters, we're now using a different approach since there's no recruiter_id
        // This is simplified for now - further implementation would be needed for a full recruiter view
        setApplications([]);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const getInternshipById = (id: string) => {
    return internships.find(internship => internship.id === id);
  };

  const userApplications = applications.filter(app => 
    user?.role === "student" && app.student_id === user?.id
  );

  const recruiterInternships = internships.filter(internship => 
    user?.role === "recruiter" && internship.recruiter_id === user?.id
  );

  const recruiterApplications = applications.filter(app => {
    if (user?.role !== "recruiter") return false;
    
    const internship = internships.find(i => i.id === app.internship_id);
    return internship && internship.recruiter_id === user.id;
  });

  const hasApplied = (internshipId: string) => {
    if (!user || user.role !== "student") return false;
    
    // For dummy internships
    if (internshipId.startsWith('dummy-')) {
      const internship = internships.find(i => i.id === internshipId);
      if (!internship) return false;
      
      return applications.some(app => 
        app.student_id === user.id && 
        app.additional_questions?.internshipTitle === internship.title
      );
    }
    
    return applications.some(app => 
      app.student_id === user.id && app.internship_id === internshipId
    );
  };

  const applyForInternship = async (internshipId: string, applicationData: Partial<Application>) => {
    setLoading(true);
    
    try {
      if (!user || user.role !== "student") {
        throw new Error("You must be logged in as a student to apply");
      }
      
      if (hasApplied(internshipId)) {
        throw new Error("You have already applied for this internship");
      }
      
      console.log("Submitting application data:", {
        internship_id: internshipId,
        student_id: user!.id,
        ...applicationData
      });
      
      // Get the internship details to include them in the application
      const internship = getInternshipById(internshipId);
      if (!internship) {
        throw new Error("Internship not found");
      }
      
      // Extract the additional questions data
      const additionalQuestions = applicationData.additional_questions || {};
      
      // Store application locally if it's a dummy internship
      if (internshipId.startsWith('dummy-')) {
        console.log("Handling dummy internship application");
        // Create a local application with a UUID
        const newApplication: Application = {
          id: uuidv4(),
          internship_id: internshipId,
          student_id: user!.id,
          resume_url: applicationData.resume_url || undefined,
          cover_letter: applicationData.cover_letter || undefined,
          additional_questions: additionalQuestions,
          status: ApplicationStatus.PENDING,
          created_at: new Date().toISOString(),
        };
        
        // Add to local state
        setApplications(prev => [...prev, newApplication]);
        
        toast({
          title: "Application submitted!",
          description: "Your application has been successfully submitted. We'll be in touch soon!",
        });
        
        setLoading(false);
        return;
      }
      
      // For real internships, submit to Supabase with the new schema
      const applicationToSubmit = {
        student_id: user!.id,
        student_name: user!.name || null,
        internship_title: internship.title,
        internship_company: internship.company,
        resume_url: applicationData.resume_url || null,
        cover_letter: applicationData.cover_letter || null,
        linkedin_url: additionalQuestions.linkedIn || null,
        portfolio_url: additionalQuestions.portfolio || null,
        why_interested: additionalQuestions.whyInterested || null,
        relevant_experience: additionalQuestions.relevantExperience || null,
        status: ApplicationStatus.PENDING
      };
      
      const { data, error } = await supabase
        .from('applications')
        .insert([applicationToSubmit])
        .select();
      
      if (error) {
        console.error("Supabase error when applying:", error);
        throw error;
      }
      
      if (data) {
        // Transform to our Application interface format
        const newApplication: Application = {
          id: data[0].id,
          internship_id: internship.id,
          student_id: user!.id,
          status: ApplicationStatus.PENDING,
          resume_url: applicationData.resume_url,
          cover_letter: applicationData.cover_letter,
          created_at: data[0].created_at,
          additional_questions: additionalQuestions
        };
        
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
      throw error; // Re-throw so the form can handle it
    } finally {
      setLoading(false);
    }
  };

  const createInternship = async (internship: Omit<Internship, 'id' | 'created_at' | 'recruiter_id'>) => {
    setLoading(true);
    
    try {
      if (!user || user.role !== "recruiter") {
        throw new Error("You must be logged in as a recruiter to post internships");
      }
      
      // Prepare the internship data for the new schema
      const internshipToInsert = {
        title: internship.title,
        company: internship.company,
        location: internship.location,
        category: internship.category.toString(),
        description: internship.description,
        requirements: internship.requirements,
        salary: internship.salary || null,
        duration: internship.duration,
        website: internship.website || null,
        logo_url: internship.logo_url || null,
        deadline: internship.deadline,
        is_remote: internship.is_remote,
        company_description: internship.company_description || null
      };
      
      const { data, error } = await supabase
        .from('internship_listings')
        .insert([internshipToInsert])
        .select();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        const newInternship: Internship = {
          ...internship,
          id: data[0].id,
          created_at: data[0].created_at,
          recruiter_id: user.id // Keep for compatibility with interface
        };
        
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

  const updateApplicationStatus = async (applicationId: string, status: ApplicationStatus) => {
    setLoading(true);
    
    try {
      if (!user || user.role !== "recruiter") {
        throw new Error("You must be logged in as a recruiter to update application status");
      }
      
      const { data, error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', applicationId)
        .select();
      
      if (error) {
        throw error;
      }
      
      if (data) {
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
