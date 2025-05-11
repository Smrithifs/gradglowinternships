
import { supabase } from "@/integrations/supabase/client";
import { Internship, Application, ApplicationStatus, UserRole } from "@/types";
import { DbInternshipRow, DbApplicationRow } from "@/types/database";
import { mapDbInternshipToInternship, mapDbApplicationToApplication } from "@/utils/mappingUtils";

// Fetch all internships
export const fetchAllInternships = async (): Promise<Internship[]> => {
  const { data, error } = await supabase
    .from('internship_listings')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  return data.map((item: DbInternshipRow) => mapDbInternshipToInternship(item));
};

// Fetch internships for a specific recruiter
export const fetchRecruiterInternships = async (recruiterId: string): Promise<Internship[]> => {
  const { data, error } = await supabase
    .from('internship_listings')
    .select('*')
    .eq('recruiter_id', recruiterId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  return data.map((item: DbInternshipRow) => mapDbInternshipToInternship(item));
};

// Fetch applications for a student
export const fetchStudentApplications = async (studentId: string): Promise<Application[]> => {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data.map((app: DbApplicationRow) => mapDbApplicationToApplication(app));
};

// Fetch applications for a recruiter (in a real app, this would filter by recruiter's internships)
export const fetchRecruiterApplications = async (): Promise<Application[]> => {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  return data.map((app: DbApplicationRow) => mapDbApplicationToApplication(app));
};

// Create a new internship
export const createInternship = async (
  internshipData: Omit<Internship, "id" | "created_at" | "recruiter_id">,
  recruiterId: string
): Promise<Internship> => {
  const newInternship = {
    ...internshipData,
    recruiter_id: recruiterId
  };
  
  const { data, error } = await supabase
    .from('internship_listings')
    .insert([newInternship])
    .select()
    .single();

  if (error) throw error;
  
  // Add recruiter_id explicitly to match our model
  return mapDbInternshipToInternship({
    ...data,
    recruiter_id: recruiterId
  });
};

// Delete an internship
export const deleteInternship = async (id: string, recruiterId: string): Promise<void> => {
  const { error } = await supabase
    .from('internship_listings')
    .delete()
    .eq('id', id)
    .eq('recruiter_id', recruiterId);

  if (error) throw error;
};

// Update application status
export const updateApplicationStatus = async (applicationId: string, status: ApplicationStatus): Promise<void> => {
  const { error } = await supabase
    .from('applications')
    .update({ status })
    .eq('id', applicationId);

  if (error) throw error;
};

// Apply for an internship
export const applyForInternship = async (
  internship: Internship,
  studentId: string,
  studentName: string | null,
  applicationData: {
    resume_url?: string,
    cover_letter?: string,
    additional_questions?: Record<string, string>
  }
): Promise<Application> => {
  // Map to database structure
  const applicationRecord = {
    student_id: studentId,
    student_name: studentName,
    internship_company: internship.company,
    internship_title: internship.title,
    resume_url: applicationData.resume_url || null,
    cover_letter: applicationData.cover_letter || null,
    status: ApplicationStatus.PENDING,
    linkedin_url: applicationData.additional_questions?.linkedIn || null,
    portfolio_url: applicationData.additional_questions?.portfolio || null,
    why_interested: applicationData.additional_questions?.whyInterested || null,
    relevant_experience: applicationData.additional_questions?.relevantExperience || null,
  };

  const { data, error } = await supabase
    .from('applications')
    .insert([applicationRecord])
    .select()
    .single();

  if (error) throw error;

  // Return full application object
  return {
    id: data.id,
    internship_id: internship.id,
    student_id: studentId,
    status: ApplicationStatus.PENDING,
    resume_url: applicationData.resume_url,
    cover_letter: applicationData.cover_letter,
    created_at: data.created_at,
    additional_questions: applicationData.additional_questions
  };
};
