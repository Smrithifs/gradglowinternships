
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import { useInternships } from "@/contexts/InternshipContext";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";
import ApplicationForm from "@/components/applications/ApplicationForm";

const InternshipDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { getInternshipById, hasApplied } = useInternships();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const internship = id ? getInternshipById(id) : null;
  
  if (!internship) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Internship Not Found</h2>
            <p className="text-gray-600 mb-6">The internship you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate("/internships")}>Browse Internships</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const alreadyApplied = hasApplied(internship.id);
  const formattedDeadline = format(new Date(internship.deadline), "MMMM d, yyyy");
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{internship.title}</h1>
                {internship.is_remote && (
                  <Badge variant="outline" className="bg-white">Remote</Badge>
                )}
              </div>
              <div className="flex items-center text-gray-600">
                <span>{internship.company}</span>
                <span className="mx-2">•</span>
                <span>{internship.location}</span>
              </div>
            </div>
            
            {internship.logo_url && (
              <img 
                src={internship.logo_url} 
                alt={`${internship.company} logo`} 
                className="w-16 h-16 object-contain rounded"
              />
            )}
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Category</h3>
                <p>{internship.category}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Duration</h3>
                <p>{internship.duration}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Salary</h3>
                <p>{internship.salary || "Not specified"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Application Deadline</h3>
                <p>{formattedDeadline}</p>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{internship.description}</p>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Requirements</h2>
              <ul className="list-disc pl-5 space-y-1">
                {internship.requirements.map((req, index) => (
                  <li key={index} className="text-gray-700">{req}</li>
                ))}
              </ul>
            </div>
            
            {internship.company_description && (
              <div>
                <h2 className="text-xl font-semibold mb-4">About {internship.company}</h2>
                <p className="text-gray-700">{internship.company_description}</p>
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center">
            {internship.website && (
              <a 
                href={internship.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gradMid hover:underline"
              >
                Visit Company Website
              </a>
            )}
            
            {isAuthenticated && user?.role === UserRole.STUDENT ? (
              alreadyApplied ? (
                <Badge variant="secondary" className="text-base py-2 px-4">Already Applied</Badge>
              ) : (
                <>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="lg">Apply Now</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Apply for {internship.title}</DialogTitle>
                      </DialogHeader>
                      <ApplicationForm 
                        internshipId={internship.id} 
                        onSuccess={() => setIsDialogOpen(false)} 
                      />
                    </DialogContent>
                  </Dialog>
                </>
              )
            ) : !isAuthenticated ? (
              <Button size="lg" onClick={() => navigate("/login")}>
                Sign In to Apply
              </Button>
            ) : null}
          </div>
        </div>
      </div>
      
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default InternshipDetails;
