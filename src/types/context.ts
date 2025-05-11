
import { Internship, Application, ApplicationStatus } from "./index";

export interface InternshipContextProps {
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
  applyForInternship: (
    internshipId: string, 
    applicationData: { 
      resume_url?: string, 
      cover_letter?: string, 
      additional_questions?: Record<string, string> 
    }
  ) => Promise<void>;
}
