
export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  avatar_url?: string;
}

export enum UserRole {
  STUDENT = "student",
  RECRUITER = "recruiter",
}

export interface Internship {
  id: string;
  title: string;
  company: string;
  location: string;
  category: InternshipCategory;
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
}

export enum InternshipCategory {
  SOFTWARE_DEVELOPMENT = "Software Development",
  DATA_SCIENCE = "Data Science",
  PRODUCT_MANAGEMENT = "Product Management",
  DESIGN = "Design",
  MARKETING = "Marketing",
  FINANCE = "Finance",
  SALES = "Sales",
  OPERATIONS = "Operations",
  HUMAN_RESOURCES = "Human Resources",
  CUSTOMER_SERVICE = "Customer Service",
  TECH = "Tech",
  HEALTHCARE = "Healthcare",
  LEGAL = "Legal",
  ARCHITECTURE = "Architecture",
  EDUCATION = "Education",
  HOSPITALITY = "Hospitality"
}

export enum ApplicationStatus {
  PENDING = "pending",
  REVIEWING = "reviewing",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
}

export interface Application {
  id: string;
  internship_id: string;
  student_id: string;
  status: ApplicationStatus;
  resume_url?: string;
  cover_letter?: string;
  created_at: string;
  additional_questions?: {
    linkedIn?: string;
    portfolio?: string;
    whyInterested?: string;
    relevantExperience?: string;
    internshipTitle?: string;
    company?: string;
  };
}

// Database types to handle differences between our app models and database schema
export interface DbInternship {
  id: string;
  title: string;
  company: string;
  location: string;
  category: string;
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
}

export interface DbApplication {
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
}
