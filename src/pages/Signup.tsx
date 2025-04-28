
import { Navigate } from "react-router-dom";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import SignupForm from "@/components/auth/SignupForm";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";

const Signup = () => {
  const { isAuthenticated, user } = useAuth();

  // Redirect if already logged in
  if (isAuthenticated) {
    return <Navigate to={user?.role === UserRole.STUDENT ? "/dashboard" : "/recruiter-dashboard"} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
          <SignupForm />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Signup;
