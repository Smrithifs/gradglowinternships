
export enum UserRole {
  STUDENT = "student",
  RECRUITER = "recruiter"
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  avatar_url?: string;
}

export interface Internship {
  id: string;
  title: string;
  company: string;
  location: string;
  category: InternshipCategory;
  description: string;
  requirements: string[];
  salary?: string;
  duration: string;
  website?: string;
  logo_url?: string;
  created_at: string;
  deadline: string;
  is_remote: boolean;
  recruiter_id: string;
  company_description?: string;
}

export enum InternshipCategory {
  TECH = "Technology",
  DESIGN = "Design",
  MARKETING = "Marketing",
  BUSINESS = "Business",
  FINANCE = "Finance",
  ENGINEERING = "Engineering",
  HEALTHCARE = "Healthcare",
  EDUCATION = "Education",
  OTHER = "Other",
  SOFTWARE_DEVELOPMENT = "Software Development",
  DATA_SCIENCE = "Data Science",
  PRODUCT_MANAGEMENT = "Product Management"
}

export interface Application {
  id: string;
  internship_id: string;
  student_id: string;
  status: ApplicationStatus;
  resume_url?: string;
  cover_letter?: string;
  created_at: string;
  additional_questions?: Record<string, string>;
}

export enum ApplicationStatus {
  PENDING = "pending",
  REVIEWING = "reviewing",
  ACCEPTED = "accepted",
  REJECTED = "rejected"
}

export interface StudentProfile {
  id: string;
  user_id: string;
  university: string;
  degree: string;
  graduation_year: string;
  skills: string[];
  bio?: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
}

export interface RecruiterProfile {
  id: string;
  user_id: string;
  company: string;
  position: string;
  company_website?: string;
  linkedin_url?: string;
}
