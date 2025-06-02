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
  },
  {
    title: "Human Resources Intern",
    company: "Deloitte",
    location: "Mumbai, India",
    description: "Join our HR team to gain hands-on experience in talent acquisition, employee engagement, and organizational development. Learn how HR functions support business strategy.",
    requirements: ["Pursuing degree in HR Management or related field", "Strong interpersonal skills", "Excellent communication", "Basic knowledge of HR practices"],
    category: InternshipCategory.HUMAN_RESOURCES,
    duration: "4 months",
    salary: "₹35,000/month",
    deadline: new Date(2025, 6, 15).toISOString(),
    is_remote: false,
    website: "https://www2.deloitte.com/in/en/careers.html",
    logo_url: "https://logo.clearbit.com/deloitte.com",
    company_description: "Deloitte is a leading global provider of audit and assurance, consulting, financial advisory, risk advisory, tax, and related services."
  },
  {
    title: "Supply Chain Management Intern",
    company: "Tata Steel",
    location: "Jamshedpur, India",
    description: "Work with our supply chain team to optimize logistics operations, inventory management, and supplier relationships. Gain practical experience in one of India's largest manufacturing companies.",
    requirements: ["Pursuing degree in Supply Chain Management or Operations", "Analytical mindset", "Knowledge of Excel", "Understanding of supply chain concepts"],
    category: InternshipCategory.OPERATIONS,
    duration: "6 months",
    salary: "₹40,000/month",
    deadline: new Date(2025, 8, 5).toISOString(),
    is_remote: false,
    website: "https://www.tatasteel.com/careers/",
    logo_url: "https://logo.clearbit.com/tatasteel.com",
    company_description: "Tata Steel is one of the world's most geographically diversified steel producers, with operations and commercial presence across the world."
  },
  {
    title: "Healthcare Administration Intern",
    company: "Apollo Hospitals",
    location: "Chennai, India",
    description: "Gain exposure to healthcare management practices including patient services, medical records management, and healthcare operations. Learn from industry leaders in healthcare administration.",
    requirements: ["Pursuing degree in Healthcare Administration or related field", "Strong organizational skills", "Detail-oriented", "Interest in healthcare industry"],
    category: InternshipCategory.HEALTHCARE,
    duration: "3 months",
    salary: "₹30,000/month",
    deadline: new Date(2025, 7, 10).toISOString(),
    is_remote: false,
    website: "https://www.apollohospitals.com/careers",
    logo_url: "https://logo.clearbit.com/apollohospitals.com",
    company_description: "Apollo Hospitals is one of the most respected healthcare groups in Asia, with hospitals across India and international locations."
  },
  {
    title: "Legal Research Intern",
    company: "Cyril Amarchand Mangaldas",
    location: "Delhi, India",
    description: "Work with our legal team on research projects, case preparation, and legal document drafting. Get mentored by experienced legal professionals in one of India's top law firms.",
    requirements: ["Pursuing law degree", "Strong research skills", "Attention to detail", "Good writing ability"],
    category: InternshipCategory.LEGAL,
    duration: "3 months",
    salary: "₹25,000/month",
    deadline: new Date(2025, 6, 25).toISOString(),
    is_remote: true,
    website: "https://www.cyrilshroff.com/careers/",
    logo_url: "https://logo.clearbit.com/cyrilshroff.com",
    company_description: "Cyril Amarchand Mangaldas is one of India's largest full-service law firms, with expertise across various practice areas."
  },
  {
    title: "Architectural Design Intern",
    company: "Morphogenesis",
    location: "Bangalore, India",
    description: "Join our architectural design team to work on real-world projects. Develop your skills in design conceptualization, 3D modeling, and sustainable architecture practices.",
    requirements: ["Pursuing degree in Architecture", "Knowledge of AutoCAD and Revit", "Creative mindset", "Portfolio of previous work"],
    category: InternshipCategory.ARCHITECTURE,
    duration: "5 months",
    salary: "₹35,000/month",
    deadline: new Date(2025, 7, 30).toISOString(),
    is_remote: false,
    website: "https://www.morphogenesis.org/careers",
    logo_url: "https://logo.clearbit.com/morphogenesis.org",
    company_description: "Morphogenesis is one of India's leading architectural practices with a focus on sustainable design and innovation."
  },
  {
    title: "Education Technology Intern",
    company: "BYJU'S",
    location: "Bangalore, India",
    description: "Work with our product team to develop innovative educational content and improve learning experiences. Contribute to the future of online education.",
    requirements: ["Pursuing degree in Education or Computer Science", "Interest in education technology", "Creative thinking", "Good communication skills"],
    category: InternshipCategory.EDUCATION,
    duration: "4 months",
    salary: "₹45,000/month",
    deadline: new Date(2025, 8, 15).toISOString(),
    is_remote: true,
    website: "https://byjus.com/careers/",
    logo_url: "https://logo.clearbit.com/byjus.com",
    company_description: "BYJU'S is a leading educational technology company providing personalized learning programs for students across age groups."
  },
  {
    title: "Culinary Arts Intern",
    company: "Taj Hotels",
    location: "Mumbai, India",
    description: "Train under experienced chefs in one of India's luxury hotel chains. Learn about food preparation, menu planning, and kitchen management in a professional setting.",
    requirements: ["Pursuing degree in Culinary Arts or Hospitality", "Basic cooking skills", "Knowledge of food safety", "Passion for cuisine"],
    category: InternshipCategory.HOSPITALITY,
    duration: "6 months",
    salary: "₹30,000/month",
    deadline: new Date(2025, 7, 5).toISOString(),
    is_remote: false,
    website: "https://www.tajhotels.com/en-in/careers/",
    logo_url: "https://logo.clearbit.com/tajhotels.com",
    company_description: "Taj Hotels is a chain of luxury hotels and resorts headquartered in Mumbai, India, and is part of the Tata Group."
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
        // Query resume_links table to get base application data
        const { data: resumeData, error: resumeError } = await supabase
          .from('resume_links')
          .select('*')
          .eq('student_id', user.id);
          
        if (resumeError) {
          console.error("Error fetching resume links:", resumeError);
          setLoading(false);
          return;
        }

        // Query other simplified tables for additional application components
        const { data: coverLetterData } = await supabase
          .from('cover_letters')
          .select('*')
          .eq('student_id', user.id);
          
        const { data: linkedinData } = await supabase
          .from('linkedin_profiles')
          .select('*')
          .eq('student_id', user.id);
          
        const { data: portfolioData } = await supabase
          .from('portfolio_links')
          .select('*')
          .eq('student_id', user.id);
          
        const { data: interestData } = await supabase
          .from('interest_statements')
          .select('*')
          .eq('student_id', user.id);
          
        const { data: experienceData } = await supabase
          .from('experience_descriptions')
          .select('*')
          .eq('student_id', user.id);

        if (resumeData) {
          // Create a map to efficiently lookup data from other tables by resume ID
          const coverLetterMap = new Map(coverLetterData?.map(item => [item.id, item]) || []);
          const linkedinMap = new Map(linkedinData?.map(item => [item.id, item]) || []);
          const portfolioMap = new Map(portfolioData?.map(item => [item.id, item]) || []);
          const interestMap = new Map(interestData?.map(item => [item.id, item]) || []);
          const experienceMap = new Map(experienceData?.map(item => [item.id, item]) || []);
          
          // Transform data to match our Application type
          const transformedData = resumeData.map(resume => {
            // For simplified structure, we'll match by student_id instead of internship_title
            const coverLetter = coverLetterData?.find(item => item.student_id === resume.student_id);
            const linkedin = linkedinData?.find(item => item.student_id === resume.student_id);
            const portfolio = portfolioData?.find(item => item.student_id === resume.student_id);
            const interest = interestData?.find(item => item.student_id === resume.student_id);
            const experience = experienceData?.find(item => item.student_id === resume.student_id);
            
            return {
              id: resume.id,
              internship_id: resume.internship_title, // Using title as a reference
              student_id: resume.student_id,
              status: resume.status as ApplicationStatus,
              resume_url: resume.resume_url || undefined,
              cover_letter: coverLetter?.cover_letter || undefined,
              created_at: resume.created_at,
              additional_questions: {
                linkedIn: linkedin?.linkedin_url || "",
                portfolio: portfolio?.portfolio_url || "",
                whyInterested: interest?.why_interested || "",
                relevantExperience: experience?.relevant_experience || "",
                internshipTitle: resume.internship_title || "",
                company: resume.internship_company || "",
              }
            } as Application;
          });
          
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
      
      // For real internships, submit to Supabase with the new simplified schema
      
      // 1. Resume Links (main application record)
      const { data: resumeData, error: resumeError } = await supabase
        .from('resume_links')
        .insert([{
          student_id: user.id,
          student_name: user.name || null,
          internship_title: internship.title,
          internship_company: internship.company,
          resume_url: applicationData.resume_url || null,
          status: ApplicationStatus.PENDING
        }])
        .select();
      
      if (resumeError) {
        console.error("Error submitting resume:", resumeError);
        throw resumeError;
      }
      
      // 2. Cover Letters (simplified structure)
      if (applicationData.cover_letter) {
        const { error: coverLetterError } = await supabase
          .from('cover_letters')
          .insert([{
            student_id: user.id,
            cover_letter: applicationData.cover_letter
          }]);
        
        if (coverLetterError) {
          console.error("Error submitting cover letter:", coverLetterError);
        }
      }
      
      // 3. LinkedIn Profile (simplified structure)
      if (additionalQuestions.linkedIn) {
        const { error: linkedinError } = await supabase
          .from('linkedin_profiles')
          .insert([{
            student_id: user.id,
            linkedin_url: additionalQuestions.linkedIn
          }]);
        
        if (linkedinError) {
          console.error("Error submitting LinkedIn profile:", linkedinError);
        }
      }
      
      // 4. Portfolio Links (simplified structure)
      if (additionalQuestions.portfolio) {
        const { error: portfolioError } = await supabase
          .from('portfolio_links')
          .insert([{
            student_id: user.id,
            portfolio_url: additionalQuestions.portfolio
          }]);
        
        if (portfolioError) {
          console.error("Error submitting portfolio link:", portfolioError);
        }
      }
      
      // 5. Interest Statements (simplified structure)
      if (additionalQuestions.whyInterested) {
        const { error: interestError } = await supabase
          .from('interest_statements')
          .insert([{
            student_id: user.id,
            why_interested: additionalQuestions.whyInterested
          }]);
        
        if (interestError) {
          console.error("Error submitting interest statement:", interestError);
        }
      }
      
      // 6. Experience Descriptions (simplified structure)
      if (additionalQuestions.relevantExperience) {
        const { error: experienceError } = await supabase
          .from('experience_descriptions')
          .insert([{
            student_id: user.id,
            relevant_experience: additionalQuestions.relevantExperience
          }]);
        
        if (experienceError) {
          console.error("Error submitting experience description:", experienceError);
        }
      }
      
      if (resumeData) {
        // Add entry to the local applications state
        const newApplication: Application = {
          id: resumeData[0].id,
          internship_id: internship.id,
          student_id: user.id,
          status: ApplicationStatus.PENDING,
          resume_url: applicationData.resume_url,
          cover_letter: applicationData.cover_letter,
          created_at: resumeData[0].created_at,
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
      
      // Fix: Use specific table names instead of dynamic strings
      // Update status in all application component tables
      const tables = [
        'resume_links',
        'cover_letters', 
        'linkedin_profiles',
        'portfolio_links',
        'interest_statements', 
        'experience_descriptions'
      ] as const; // Add 'as const' to treat this as a tuple of literal strings
      
      for (const table of tables) {
        const { error } = await supabase
          .from(table)
          .update({ status })
          .eq('id', applicationId);
        
        if (error) {
          console.error(`Error updating status in ${table}:`, error);
        }
      }
      
      // Update local state
      const updatedApplications = applications.map(app => 
        app.id === applicationId ? { ...app, status } : app
      );
      
      setApplications(updatedApplications);
      
      toast({
        title: "Status updated",
        description: `Application status has been updated to ${status}.`,
      });
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
