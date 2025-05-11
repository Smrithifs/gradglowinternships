
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, ApplicationStatus } from "@/types";
import { Application } from "@/types";

interface DashboardSidebarProps {
  user: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  applications: Application[];
}

const DashboardSidebar = ({ user, activeTab, setActiveTab, applications }: DashboardSidebarProps) => {
  return (
    <div className="w-full md:w-1/4">
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-gradMid/20 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gradMid">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold">{user.name || "User"}</h3>
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
          <Link 
            to="/internships"
            className="block w-full text-left px-4 py-2 rounded-md transition-colors text-gray-600 hover:bg-gray-100"
          >
            Browse Internships
          </Link>
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
            <span className="font-semibold">{applications.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Pending</span>
            <span className="font-semibold">{applications.filter(app => app.status === ApplicationStatus.PENDING).length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Under Review</span>
            <span className="font-semibold">{applications.filter(app => app.status === ApplicationStatus.REVIEWING).length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Accepted</span>
            <span className="font-semibold">{applications.filter(app => app.status === ApplicationStatus.ACCEPTED).length}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSidebar;
