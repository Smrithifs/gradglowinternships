
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { InternshipProvider } from "@/contexts/InternshipContext";
import { useEffect } from "react";
import { deduplicateInternshipListings } from "@/integrations/supabase/client";

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

const App = () => {
  // Deduplicate internships when the app starts
  useEffect(() => {
    const init = async () => {
      await deduplicateInternshipListings();
    };
    
    init();
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <InternshipProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/internships" element={<InternshipsPage />} />
                <Route path="/internship/:id" element={<InternshipDetails />} />
                <Route path="/dashboard" element={<StudentDashboard />} />
                <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </InternshipProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
