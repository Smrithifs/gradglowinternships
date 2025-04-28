
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Internship, InternshipCategory, Application, ApplicationStatus } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "./AuthContext";

// Sample internships data
const MOCK_INTERNSHIPS: Internship[] = [
  {
    id: "1",
    title: "Frontend Developer Intern",
    company: "Google",
    location: "Bangalore, India",
    category: InternshipCategory.TECH,
    description: "Join our team to work on exciting web projects using React, TypeScript, and modern web technologies.",
    requirements: ["Knowledge of React", "Basic TypeScript", "Understanding of HTML/CSS", "Good communication skills"],
    salary: "₹40,000/month",
    duration: "6 months",
    website: "https://google.com",
    logo_url: "https://logo.clearbit.com/google.com",
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    is_remote: false,
    recruiter_id: "2",
    company_description: "Google is a global technology leader focused on improving the ways people connect with information."
  },
  {
    id: "2",
    title: "UI/UX Design Intern",
    company: "Microsoft",
    location: "Hyderabad, India",
    category: InternshipCategory.DESIGN,
    description: "Design beautiful and intuitive user interfaces for our products used by millions around the world.",
    requirements: ["Proficiency with Figma or Adobe XD", "Understanding of UX principles", "Portfolio showcasing design work", "Attention to detail"],
    salary: "₹35,000/month",
    duration: "3 months",
    website: "https://microsoft.com",
    logo_url: "https://logo.clearbit.com/microsoft.com",
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    is_remote: false,
    recruiter_id: "2",
    company_description: "Microsoft is a multinational technology company that develops, manufactures, licenses, supports, and sells computer software, consumer electronics, personal computers, and related services."
  },
  {
    id: "3",
    title: "Data Science Intern",
    company: "Amazon",
    location: "Remote",
    category: InternshipCategory.TECH,
    description: "Work with big data and help develop machine learning models to improve our product recommendations.",
    requirements: ["Knowledge of Python", "Understanding of ML algorithms", "Statistical analysis skills", "Experience with data visualization"],
    salary: "₹45,000/month",
    duration: "6 months",
    website: "https://amazon.in",
    logo_url: "https://logo.clearbit.com/amazon.com",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    is_remote: true,
    recruiter_id: "2",
    company_description: "Amazon.com, Inc. is an American multinational technology company focusing on e-commerce, cloud computing, digital streaming, and artificial intelligence."
  },
  {
    id: "4",
    title: "Digital Marketing Intern",
    company: "Flipkart",
    location: "Bengaluru, India",
    category: InternshipCategory.MARKETING,
    description: "Help us grow our online presence through various digital marketing channels and campaigns.",
    requirements: ["Knowledge of SEO/SEM", "Experience with social media marketing", "Basic analytics understanding", "Creative thinking"],
    salary: "₹25,000/month",
    duration: "4 months",
    website: "https://flipkart.com",
    logo_url: "https://logo.clearbit.com/flipkart.com",
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    is_remote: false,
    recruiter_id: "2",
    company_description: "Flipkart is an Indian e-commerce company headquartered in Bengaluru, Karnataka, India. It was founded in 2007 by Sachin Bansal and Binny Bansal."
  },
  {
    id: "5",
    title: "Backend Engineer Intern",
    company: "Uber",
    location: "Hyderabad, India",
    category: InternshipCategory.ENGINEERING,
    description: "Build robust and scalable backend systems that power our global transportation network.",
    requirements: ["Knowledge of Node.js or Go", "Understanding of databases", "API design experience", "Problem-solving skills"],
    salary: "₹50,000/month",
    duration: "6 months",
    website: "https://uber.com",
    logo_url: "https://logo.clearbit.com/uber.com",
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    is_remote: false,
    recruiter_id: "2",
    company_description: "Uber Technologies, Inc. is an American technology company. Its services include ride-hailing, food delivery, package delivery, couriers, freight transportation, and more."
  },
  {
    id: "6",
    title: "Finance Analyst Intern",
    company: "HDFC Bank",
    location: "Mumbai, India",
    category: InternshipCategory.FINANCE,
    description: "Analyze financial data and prepare reports to help guide business decisions.",
    requirements: ["Finance or Accounting background", "Excel proficiency", "Analytical mindset", "Attention to detail"],
    salary: "₹30,000/month",
    duration: "3 months",
    website: "https://hdfcbank.com",
    logo_url: "https://logo.clearbit.com/hdfcbank.com",
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    is_remote: false,
    recruiter_id: "2",
    company_description: "HDFC Bank Limited is an Indian banking and financial services company headquartered in Mumbai, Maharashtra."
  },
  {
    id: "7",
    title: "Product Management Intern",
    company: "Airbnb",
    location: "Remote",
    category: InternshipCategory.BUSINESS,
    description: "Help shape our product roadmap and work closely with engineering and design teams to build amazing user experiences.",
    requirements: ["Basic product management knowledge", "Strong communication skills", "Data-driven decision making", "User empathy"],
    salary: "$3000/month",
    duration: "4 months",
    website: "https://airbnb.com",
    logo_url: "https://logo.clearbit.com/airbnb.com",
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
    is_remote: true,
    recruiter_id: "2",
    company_description: "Airbnb is an American company that operates an online marketplace for lodging, primarily homestays for vacation rentals, and tourism activities."
  },
  {
    id: "8",
    title: "Mobile App Developer Intern",
    company: "Swiggy",
    location: "Bangalore, India",
    category: InternshipCategory.TECH,
    description: "Develop features for our Android and iOS applications used by millions of customers every day.",
    requirements: ["Knowledge of React Native or Flutter", "Basic understanding of mobile development", "Problem-solving skills", "Team player"],
    salary: "₹35,000/month",
    duration: "5 months",
    website: "https://swiggy.com",
    logo_url: "https://logo.clearbit.com/swiggy.in",
    created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    is_remote: false,
    recruiter_id: "2",
    company_description: "Swiggy is India's largest online food ordering and delivery platform, founded in 2014."
  },
  {
    id: "9",
    title: "Healthcare Researcher Intern",
    company: "Apollo Hospitals",
    location: "Chennai, India",
    category: InternshipCategory.HEALTHCARE,
    description: "Assist in medical research projects and help analyze healthcare data to improve patient outcomes.",
    requirements: ["Medical or Life Sciences background", "Research methodology knowledge", "Data analysis skills", "Attention to detail"],
    salary: "₹25,000/month",
    duration: "6 months",
    website: "https://apollohospitals.com",
    logo_url: "https://logo.clearbit.com/apollohospitals.com",
    created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    is_remote: false,
    recruiter_id: "2",
    company_description: "Apollo Hospitals Enterprise Limited is an Indian multinational healthcare group headquartered in Chennai."
  },
  {
    id: "10",
    title: "Graphic Design Intern",
    company: "Netflix",
    location: "Remote (India)",
    category: InternshipCategory.DESIGN,
    description: "Create engaging visual content for our social media channels, marketing materials, and platform.",
    requirements: ["Proficiency in Adobe Creative Suite", "Strong portfolio", "Understanding of design principles", "Creative thinking"],
    salary: "₹40,000/month",
    duration: "3 months",
    website: "https://netflix.com",
    logo_url: "https://logo.clearbit.com/netflix.com",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString(),
    is_remote: true,
    recruiter_id: "2",
    company_description: "Netflix, Inc. is an American subscription video on-demand over-the-top streaming service."
  },
  {
    id: "11",
    title: "Machine Learning Intern",
    company: "Tesla",
    location: "Remote (Global)",
    category: InternshipCategory.TECH,
    description: "Work on cutting-edge machine learning models for autonomous driving and energy solutions.",
    requirements: ["ML/AI knowledge", "Python proficiency", "Understanding of neural networks", "Mathematics background"],
    salary: "$4000/month",
    duration: "6 months",
    website: "https://tesla.com",
    logo_url: "https://logo.clearbit.com/tesla.com",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    is_remote: true,
    recruiter_id: "2",
    company_description: "Tesla, Inc. is an American electric vehicle and clean energy company based in Austin, Texas."
  },
];

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
  const [internships, setInternships] = useState<Internship[]>(MOCK_INTERNSHIPS);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Mock loading data from Supabase
  useEffect(() => {
    const loadData = () => {
      try {
        // In a real app, this would fetch from Supabase
        const storedApplications = localStorage.getItem("gradglow_applications");
        const storedInternships = localStorage.getItem("gradglow_internships");
        
        if (storedApplications) {
          setApplications(JSON.parse(storedApplications));
        }
        
        if (storedInternships) {
          // Merge with mock data to ensure we always have sample data
          const savedInternships = JSON.parse(storedInternships);
          setInternships([...MOCK_INTERNSHIPS, ...savedInternships.filter((i: Internship) => 
            !MOCK_INTERNSHIPS.some(mi => mi.id === i.id)
          )]);
        } else {
          // Initialize with mock data
          setInternships(MOCK_INTERNSHIPS);
          localStorage.setItem("gradglow_internships", JSON.stringify(MOCK_INTERNSHIPS));
        }
      } catch (error) {
        console.error("Error loading internship data:", error);
      }
    };

    loadData();
  }, []);

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
      
      // Create application
      const newApplication: Application = {
        id: Math.random().toString(36).substring(2, 9),
        internship_id: internshipId,
        student_id: user.id,
        status: ApplicationStatus.PENDING,
        created_at: new Date().toISOString(),
        ...applicationData,
      };
      
      const updatedApplications = [...applications, newApplication];
      setApplications(updatedApplications);
      localStorage.setItem("gradglow_applications", JSON.stringify(updatedApplications));
      
      toast({
        title: "Application submitted!",
        description: "Your application has been successfully submitted.",
      });
    } catch (error) {
      console.error("Error applying for internship:", error);
      toast({
        title: "Application failed",
        description: error instanceof Error ? error.message : "An error occurred while applying.",
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
      
      // Create internship
      const newInternship: Internship = {
        id: Math.random().toString(36).substring(2, 9),
        created_at: new Date().toISOString(),
        recruiter_id: user.id,
        ...internship,
      };
      
      const updatedInternships = [...internships, newInternship];
      setInternships(updatedInternships);
      localStorage.setItem("gradglow_internships", JSON.stringify(updatedInternships));
      
      toast({
        title: "Internship posted!",
        description: "Your internship has been successfully posted.",
      });
    } catch (error) {
      console.error("Error creating internship:", error);
      toast({
        title: "Posting failed",
        description: error instanceof Error ? error.message : "An error occurred while posting the internship.",
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
      
      const updatedApplications = applications.map(app => 
        app.id === applicationId ? { ...app, status } : app
      );
      
      setApplications(updatedApplications);
      localStorage.setItem("gradglow_applications", JSON.stringify(updatedApplications));
      
      toast({
        title: "Status updated",
        description: `Application status has been updated to ${status}.`,
      });
    } catch (error) {
      console.error("Error updating application status:", error);
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "An error occurred while updating the status.",
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
