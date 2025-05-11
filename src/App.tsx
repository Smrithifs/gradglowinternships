
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { InternshipProvider } from "@/contexts/InternshipContext";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import InternshipsPage from "./pages/InternshipsPage";
import InternshipDetails from "./pages/InternshipDetails";
import StudentDashboard from "./pages/StudentDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import FAQ from "./pages/FAQ";
import Resources from "./pages/Resources";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  }
});

// Protected route component
const ProtectedRoute = ({ 
  children, 
  allowedRoles,
  redirectPath = "/login" 
}: { 
  children: React.ReactNode; 
  allowedRoles?: UserRole[];
  redirectPath?: string;
}) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  // Show loading state if still checking auth
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }
  
  // If roles are specified and user role doesn't match, redirect to appropriate dashboard
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    const redirectTo = user.role === UserRole.STUDENT ? "/dashboard" : "/recruiter-dashboard";
    return <Navigate to={redirectTo} replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/internships" element={<InternshipsPage />} />
      <Route path="/internship/:id" element={<InternshipDetails />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
            <StudentDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/recruiter-dashboard" 
        element={
          <ProtectedRoute allowedRoles={[UserRole.RECRUITER]}>
            <RecruiterDashboard />
          </ProtectedRoute>
        } 
      />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/resources" element={<Resources />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// App with providers
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <InternshipProvider>
            <AppRoutes />
          </InternshipProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
