
import { Internship, Application, ApplicationStatus } from "@/types";
import { DbInternshipRow, DbApplicationRow } from "@/types/database";

// Map database internship to app internship model
export const mapDbInternshipToInternship = (item: DbInternshipRow): Internship => ({
  id: item.id,
  title: item.title,
  company: item.company,
  location: item.location,
  category: item.category as any, // Cast to enum
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
  recruiter_id: item.recruiter_id
});

// Map database application to app application model
export const mapDbApplicationToApplication = (dbApp: DbApplicationRow): Application => ({
  id: dbApp.id,
  student_id: dbApp.student_id,
  internship_id: "", // Will be populated when needed
  status: dbApp.status as ApplicationStatus,
  resume_url: dbApp.resume_url || undefined,
  cover_letter: dbApp.cover_letter || undefined,
  created_at: dbApp.created_at,
  additional_questions: {
    linkedIn: dbApp.linkedin_url || undefined,
    portfolio: dbApp.portfolio_url || undefined,
    whyInterested: dbApp.why_interested || undefined,
    relevantExperience: dbApp.relevant_experience || undefined,
    internshipTitle: dbApp.internship_title,
    company: dbApp.internship_company
  }
});
