
import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import InternshipCard from "@/components/internships/InternshipCard";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole, ApplicationStatus } from "@/types";
import { useInternships } from "@/contexts/InternshipContext";
import { format } from "date-fns";

const StudentDashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const { internships, userApplications } = useInternships();
  const [activeTab, setActiveTab] = useState("applications");
  
  // Redirect if not authenticated or not a student
  if (!isAuthenticated || user?.role !== UserRole.STUDENT) {
    return <Navigate to="/login" />;
  }
  
  // Get internships the student has applied to
  const appliedInternships = userApplications.map(app => {
    const internship = internships.find(i => i.id === app.internship_id);
    return {
      ...app,
      internship,
    };
  }).filter(app => app.internship); // Filter out any with missing internship data
  
  // Get recommended internships (simple algorithm - just newest ones the student hasn't applied to)
  const recommendedInternships = internships
    .filter(internship => !userApplications.some(app => app.internship_id === internship.id))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 6); // Get top 6
  
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
                  onClick={() => setActiveTab("applications")}
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                    activeTab === "applications" ? "bg-gradMid/10 text-gradMid" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  My Applications
                </button>
                <button 
                  onClick={() => setActiveTab("browse")}
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                    activeTab === "browse" ? "bg-gradMid/10 text-gradMid" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Browse Internships
                </button>
                <button 
                  onClick={() => setActiveTab("recommended")}
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                    activeTab === "recommended" ? "bg-gradMid/10 text-gradMid" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Recommended
                </button>
                <button 
                  onClick={() => setActiveTab("profile")}
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                    activeTab === "profile" ? "bg-gradMid/10 text-gradMid" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Profile
                </button>
              </div>
            </div>
            
            {/* Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle>Application Summary</CardTitle>
                <CardDescription>Your current application status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Applications</span>
                  <span className="font-semibold">{userApplications.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pending</span>
                  <span className="font-semibold">{userApplications.filter(app => app.status === ApplicationStatus.PENDING).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Under Review</span>
                  <span className="font-semibold">{userApplications.filter(app => app.status === ApplicationStatus.REVIEWING).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Accepted</span>
                  <span className="font-semibold">{userApplications.filter(app => app.status === ApplicationStatus.ACCEPTED).length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="w-full md:w-3/4">
            {activeTab === "applications" && (
              <div>
                <h1 className="text-2xl font-bold mb-6">My Applications</h1>
                
                {appliedInternships.length > 0 ? (
                  <div className="space-y-6">
                    {appliedInternships.map(app => (
                      <div key={app.id} className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="flex justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">{app.internship?.title}</h3>
                            <p className="text-gray-600">{app.internship?.company} • {app.internship?.location}</p>
                          </div>
                          <Badge className={getStatusColor(app.status)}>
                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-gray-600">
                          Applied on {format(new Date(app.created_at), "MMMM d, yyyy")}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
                    <h3 className="text-lg font-medium mb-2">No applications yet</h3>
                    <p className="text-gray-600 mb-4">You haven't applied to any internships yet.</p>
                    <button 
                      onClick={() => setActiveTab("recommended")}
                      className="text-gradMid hover:underline"
                    >
                      View recommended internships
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === "browse" && (
              <div>
                <h1 className="text-2xl font-bold mb-6">Browse Internships</h1>
                
                <div className="mb-6">
                  <Link to="/internships" className="text-gradMid hover:underline inline-flex items-center">
                    <span>View all internships with advanced filters</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {internships.slice(0, 6).map(internship => (
                    <InternshipCard 
                      key={internship.id} 
                      internship={internship} 
                    />
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === "recommended" && (
              <div>
                <h1 className="text-2xl font-bold mb-6">Recommended Internships</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recommendedInternships.map(internship => (
                    <InternshipCard 
                      key={internship.id} 
                      internship={internship} 
                    />
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === "profile" && (
              <div>
                <h1 className="text-2xl font-bold mb-6">Profile</h1>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p>{user.name || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p>{user.email}</p>
                    </div>
                    
                    {/* In a real app, there would be more profile data here */}
                    <div className="col-span-2 mt-4">
                      <p className="text-sm text-gray-500">Bio</p>
                      <p className="text-gray-600 italic">Profile information would be editable in a complete application.</p>
                    </div>
                  </div>
                </div>
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

export default StudentDashboard;
