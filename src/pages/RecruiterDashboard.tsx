
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import PostInternshipForm from "@/components/recruiter/PostInternshipForm";
import InternshipCard from "@/components/internships/InternshipCard";
import { useAuth } from "@/contexts/AuthContext";
import { useInternships } from "@/contexts/InternshipContext";
import { UserRole, ApplicationStatus } from "@/types";
import { format } from "date-fns";

const RecruiterDashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const { recruiterInternships, recruiterApplications, internships, updateApplicationStatus } = useInternships();
  const [activeTab, setActiveTab] = useState("postings");
  const [isPostingDialogOpen, setIsPostingDialogOpen] = useState(false);
  const { toast } = useToast();
  
  // Redirect if not authenticated or not a recruiter
  if (!isAuthenticated || user?.role !== UserRole.RECRUITER) {
    return <Navigate to="/login" />;
  }
  
  // Group applications by internship
  const applicationsByInternship = recruiterApplications.reduce((acc, app) => {
    const internshipId = app.internship_id;
    if (!acc[internshipId]) {
      acc[internshipId] = [];
    }
    acc[internshipId].push(app);
    return acc;
  }, {} as Record<string, typeof recruiterApplications>);
  
  const handleStatusChange = async (applicationId: string, status: ApplicationStatus) => {
    try {
      await updateApplicationStatus(applicationId, status);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update application status.",
        variant: "destructive",
      });
    }
  };
  
  const getStatusOptions = (currentStatus: ApplicationStatus) => {
    const allStatuses = Object.values(ApplicationStatus);
    return allStatuses.filter(status => status !== currentStatus);
  };
  
  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case ApplicationStatus.REVIEWING:
        return "bg-blue-100 text-blue-800";
      case ApplicationStatus.ACCEPTED:
        return "bg-green-100 text-green-800";
      case ApplicationStatus.REJECTED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Recruiter Dashboard</h1>
            <p className="text-gray-600">Manage your internship postings and applications</p>
          </div>
          
          <Dialog open={isPostingDialogOpen} onOpenChange={setIsPostingDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4 md:mt-0">+ Post New Internship</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Post a New Internship</DialogTitle>
              </DialogHeader>
              <PostInternshipForm onSuccess={() => setIsPostingDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-1/4">
            <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradMid/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gradMid">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <button 
                  onClick={() => setActiveTab("postings")}
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                    activeTab === "postings" ? "bg-gradMid/10 text-gradMid" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  My Postings
                </button>
                <button 
                  onClick={() => setActiveTab("applications")}
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                    activeTab === "applications" ? "bg-gradMid/10 text-gradMid" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Applications
                </button>
              </div>
            </div>
            
            {/* Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle>Dashboard Summary</CardTitle>
                <CardDescription>Your internship & application stats</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Postings</span>
                  <span className="font-semibold">{recruiterInternships.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Applications</span>
                  <span className="font-semibold">{recruiterApplications.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pending Review</span>
                  <span className="font-semibold">
                    {recruiterApplications.filter(app => app.status === ApplicationStatus.PENDING).length}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="w-full md:w-3/4">
            {activeTab === "postings" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">My Internship Postings</h2>
                
                {recruiterInternships.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {recruiterInternships.map(internship => (
                      <InternshipCard 
                        key={internship.id} 
                        internship={internship}
                        showApplyButton={false} 
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
                    <h3 className="text-lg font-medium mb-2">No internships posted yet</h3>
                    <p className="text-gray-600 mb-4">Post your first internship to start receiving applications.</p>
                    <Button onClick={() => setIsPostingDialogOpen(true)}>Post Internship</Button>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === "applications" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Applications Received</h2>
                
                {Object.keys(applicationsByInternship).length > 0 ? (
                  <div className="space-y-8">
                    {Object.entries(applicationsByInternship).map(([internshipId, applications]) => {
                      const internship = internships.find(i => i.id === internshipId);
                      if (!internship) return null;
                      
                      return (
                        <div key={internshipId} className="bg-white p-6 rounded-lg shadow-sm border">
                          <h3 className="text-xl font-semibold mb-1">{internship.title}</h3>
                          <p className="text-gray-600 mb-4">{applications.length} application(s)</p>
                          
                          <div className="space-y-4">
                            {applications.map(app => (
                              <div key={app.id} className="border-t pt-4">
                                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                                  <div>
                                    <h4 className="font-medium">Application #{app.id.slice(0, 5)}</h4>
                                    <p className="text-sm text-gray-600">
                                      Submitted on {format(new Date(app.created_at), "MMMM d, yyyy")}
                                    </p>
                                  </div>
                                  
                                  <div className="flex items-center gap-2">
                                    <Badge className={getStatusColor(app.status)}>
                                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                    </Badge>
                                    
                                    <select
                                      value=""
                                      onChange={(e) => {
                                        const newStatus = e.target.value as ApplicationStatus;
                                        if (newStatus) {
                                          handleStatusChange(app.id, newStatus);
                                        }
                                        e.target.value = "";
                                      }}
                                      className="text-sm border rounded p-1"
                                    >
                                      <option value="" disabled>Update</option>
                                      {getStatusOptions(app.status).map(status => (
                                        <option key={status} value={status}>
                                          {status.charAt(0).toUpperCase() + status.slice(1)}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                                
                                {app.resume_url && (
                                  <div className="mt-2">
                                    <a 
                                      href={app.resume_url} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-gradMid hover:underline text-sm"
                                    >
                                      View Resume
                                    </a>
                                  </div>
                                )}
                                
                                {app.cover_letter && app.cover_letter.length > 0 && (
                                  <div className="mt-2">
                                    <details className="text-sm">
                                      <summary className="cursor-pointer text-gradMid hover:underline">
                                        Cover Letter
                                      </summary>
                                      <p className="mt-2 text-gray-700 bg-gray-50 p-3 rounded">
                                        {app.cover_letter}
                                      </p>
                                    </details>
                                  </div>
                                )}
                                
                                {app.additional_questions && (
                                  <div className="mt-2">
                                    <details className="text-sm">
                                      <summary className="cursor-pointer text-gradMid hover:underline">
                                        Additional Information
                                      </summary>
                                      <div className="mt-2 text-gray-700 bg-gray-50 p-3 rounded space-y-2">
                                        {Object.entries(app.additional_questions).map(([key, value]) => (
                                          <div key={key}>
                                            <p className="font-medium">{key}:</p>
                                            <p>{value}</p>
                                          </div>
                                        ))}
                                      </div>
                                    </details>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
                    <h3 className="text-lg font-medium mb-2">No applications received yet</h3>
                    <p className="text-gray-600">You haven't received any applications for your internships yet.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default RecruiterDashboard;
