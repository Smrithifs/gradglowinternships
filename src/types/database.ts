
import { ApplicationStatus, InternshipCategory } from "./index";

// Database model types to help with mapping
export type DbInternshipRow = {
  id: string;
  title: string;
  company: string;
  location: string;
  category: string; // Will be cast to InternshipCategory
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

export type DbApplicationRow = {
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
