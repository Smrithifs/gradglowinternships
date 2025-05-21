
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

// Update the application interfaces to work with split tables
export interface ApplicationComponent {
  id: string;
  internship_title: string;
  internship_company: string;
  student_id: string;
  student_name?: string;
  status: ApplicationStatus;
  created_at: string;
}

export interface ResumeLink extends ApplicationComponent {
  resume_url?: string;
}

export interface CoverLetter extends ApplicationComponent {
  cover_letter?: string;
}

export interface LinkedInProfile extends ApplicationComponent {
  linkedin_url?: string;
}

export interface PortfolioLink extends ApplicationComponent {
  portfolio_url?: string;
}

export interface InterestStatement extends ApplicationComponent {
  why_interested?: string;
}

export interface ExperienceDescription extends ApplicationComponent {
  relevant_experience?: string;
}

// For backward compatibility with existing code
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
