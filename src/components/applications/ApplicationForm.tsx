import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useInternships } from "@/contexts/InternshipContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface ApplicationFormProps {
  internshipId: string;
  onSuccess: () => void;
}

const formSchema = z.object({
  resume_url: z.string().url({ message: "Please enter a valid URL to your resume" }).optional().or(z.literal("")),
  cover_letter: z.string().optional(),
  linkedIn: z.string().url({ message: "Please enter a valid LinkedIn URL" }).optional().or(z.literal("")),
  portfolio: z.string().url({ message: "Please enter a valid portfolio URL" }).optional().or(z.literal("")),
  whyInterested: z.string().optional(),
  relevantExperience: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const ApplicationForm = ({ internshipId, onSuccess }: ApplicationFormProps) => {
  const { applyForInternship, loading, getInternshipById } = useInternships();
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Get internship details to store with application
  const internship = getInternshipById(internshipId);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resume_url: "",
      cover_letter: "",
      linkedIn: "",
      portfolio: "",
      whyInterested: "",
      relevantExperience: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setSubmitError(null);
    try {
      console.log("Submitting form data:", data);
      console.log("Internship being applied to:", internship);
      
      if (!internship) {
        throw new Error("Internship information not found");
      }
      
      // Submit application with all fields to the new separate tables
      await applyForInternship(internshipId, {
        resume_url: data.resume_url || "",
        cover_letter: data.cover_letter || "",
        additional_questions: {
          linkedIn: data.linkedIn || "",
          portfolio: data.portfolio || "",
          whyInterested: data.whyInterested || "",
          relevantExperience: data.relevantExperience || "",
          internshipTitle: internship.title || "",
          company: internship.company || "",
        },
      });
      
      setSubmitted(true);
      toast({
        title: "Application submitted!",
        description: "Thank you for applying. We will reach out to you soon.",
      });
      
      // Delay success callback to allow toast to be seen
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (error) {
      console.error("Error submitting application:", error);
      const errorMessage = error instanceof Error ? error.message : "There was a problem submitting your application";
      setSubmitError(errorMessage);
      toast({
        title: "Application failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-green-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2">Application Submitted!</h3>
        <p className="text-gray-600">Thank you for applying. We will review your application and get back to you soon.</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
        {submitError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm mb-4">
            {submitError}
          </div>
        )}
        
        <FormField
          control={form.control}
          name="resume_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resume/CV Link (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://drive.google.com/your-resume" {...field} />
              </FormControl>
              <FormDescription>
                You can provide a link to your resume (Google Drive, Dropbox, etc.)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cover_letter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Letter (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tell us why you're interested in this position..." 
                  className="min-h-32" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="linkedIn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>LinkedIn Profile (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://linkedin.com/in/your-profile" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="portfolio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Portfolio/GitHub (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://github.com/your-username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="whyInterested"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Why are you interested in this internship? (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Explain your interest in this specific role..." 
                  className="min-h-24" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="relevantExperience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What relevant experience do you have? (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe any relevant courses, projects, or experience..." 
                  className="min-h-24" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
              Submitting...
            </>
          ) : (
            "Submit Application"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ApplicationForm;
