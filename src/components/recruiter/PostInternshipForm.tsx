
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInternships } from "@/contexts/InternshipContext";
import { InternshipCategory } from "@/types";
import { format, addMonths } from "date-fns";

interface PostInternshipFormProps {
  onSuccess: () => void;
}

const internshipSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  company: z.string().min(2, { message: "Company name is required" }),
  location: z.string().min(2, { message: "Location is required" }),
  category: z.nativeEnum(InternshipCategory),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }),
  requirements: z.string().min(10, { message: "Requirements must be at least 10 characters" }),
  salary: z.string().optional(),
  duration: z.string().min(1, { message: "Duration is required" }),
  deadline: z.string().min(1, { message: "Application deadline is required" }),
  website: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  logo_url: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  company_description: z.string().optional(),
  is_remote: z.boolean().default(false),
});

type FormValues = z.infer<typeof internshipSchema>;

const PostInternshipForm = ({ onSuccess }: PostInternshipFormProps) => {
  const { createInternship, loading } = useInternships();
  const [submitted, setSubmitted] = useState(false);

  const defaultDeadline = format(addMonths(new Date(), 1), "yyyy-MM-dd");

  const form = useForm<FormValues>({
    resolver: zodResolver(internshipSchema),
    defaultValues: {
      title: "",
      company: "",
      location: "",
      category: InternshipCategory.TECH,
      description: "",
      requirements: "",
      salary: "",
      duration: "3 months",
      deadline: defaultDeadline,
      website: "",
      logo_url: "",
      company_description: "",
      is_remote: false,
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      // Transform requirements string to array
      const requirementsArray = data.requirements
        .split("\n")
        .map(req => req.trim())
        .filter(req => req.length > 0);
      
      // Here's the fix: Ensure all required properties are provided
      await createInternship({
        title: data.title,
        company: data.company,
        location: data.location,
        category: data.category,
        description: data.description,
        requirements: requirementsArray,
        salary: data.salary,
        duration: data.duration,
        deadline: new Date(data.deadline).toISOString(),
        website: data.website || undefined,
        logo_url: data.logo_url || undefined,
        company_description: data.company_description,
        is_remote: data.is_remote,
      });
      
      setSubmitted(true);
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (error) {
      console.error("Error posting internship:", error);
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
        <h3 className="text-xl font-semibold mb-2">Internship Posted!</h3>
        <p className="text-gray-600">Your internship has been successfully posted and is now visible to students.</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Internship Title*</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Frontend Developer Intern" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name*</FormLabel>
                <FormControl>
                  <Input placeholder="Your company name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location*</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Bangalore, India" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category*</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(InternshipCategory).map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration*</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 3 months" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Description*</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe the internship role, responsibilities, and what the intern will learn..." 
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
          name="requirements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Requirements*</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="List requirements, each on a new line. For example:
Knowledge of React
Basic TypeScript
Understanding of HTML/CSS
Good communication skills"
                  className="min-h-32"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                List each requirement on a new line
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="salary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salary (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., ₹30,000/month" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="deadline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Application Deadline*</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="is_remote"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Remote Position</FormLabel>
                <FormDescription>
                  Check this if the internship can be done remotely
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Website (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://yourcompany.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="logo_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Logo URL (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://yourcompany.com/logo.png" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="company_description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Description (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tell students more about your company..."
                  className="min-h-24"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Posting..." : "Post Internship"}
        </Button>
      </form>
    </Form>
  );
};

export default PostInternshipForm;
