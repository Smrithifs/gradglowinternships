
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";

const Navbar = () => {
  const { isAuthenticated, user, signOut } = useAuth();
  const location = useLocation();
  
  // Check if we're on the landing page
  const isLandingPage = location.pathname === "/";

  return (
    <nav className={`w-full py-4 ${isLandingPage ? "absolute top-0 left-0 z-10" : "bg-white shadow-sm"}`}>
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className={`text-2xl font-bold ${isLandingPage ? "text-white" : "gradient-text"}`}>
            GradGlow
          </div>
        </Link>
        
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link to={user?.role === UserRole.STUDENT ? "/dashboard" : "/recruiter-dashboard"}>
                <Button variant="outline" className={`${isLandingPage ? "bg-white/10 text-white hover:bg-white/20 border-white/20" : ""}`}>
                  Dashboard
                </Button>
              </Link>
              <Button 
                onClick={() => signOut()}
                variant={isLandingPage ? "outline" : "default"}
                className={isLandingPage ? "bg-white/10 text-white hover:bg-white/20 border-white/20" : ""}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button 
                  variant="outline" 
                  className={`${isLandingPage ? "bg-white/10 text-white hover:bg-white/20 border-white/20" : ""}`}
                >
                  Log In
                </Button>
              </Link>
              <Link to="/signup">
                <Button 
                  variant={isLandingPage ? "outline" : "default"}
                  className={isLandingPage ? "bg-white/10 text-white hover:bg-white/20 border-white/20" : ""}
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
