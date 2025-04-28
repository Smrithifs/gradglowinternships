
import { useState, useMemo } from "react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import InternshipCard from "@/components/internships/InternshipCard";
import InternshipFilters, { FilterValues } from "@/components/internships/InternshipFilters";
import { useInternships } from "@/contexts/InternshipContext";
import { Internship } from "@/types";
import { useLocation } from "react-router-dom";

const InternshipsPage = () => {
  const { internships, hasApplied } = useInternships();
  const [filters, setFilters] = useState<FilterValues>({
    search: "",
    category: null,
    location: null,
    isRemote: false,
  });
  
  const location = useLocation();
  
  // Extract category from URL if present
  useState(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get("category");
    
    if (category) {
      setFilters(prev => ({ ...prev, category }));
    }
  });

  const filteredInternships = useMemo(() => {
    return internships.filter((internship: Internship) => {
      // Search filter
      if (filters.search && !internship.title.toLowerCase().includes(filters.search.toLowerCase()) && 
          !internship.company.toLowerCase().includes(filters.search.toLowerCase()) &&
          !internship.description.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      
      // Category filter
      if (filters.category && internship.category !== filters.category) {
        return false;
      }
      
      // Location filter
      if (filters.location && internship.location !== filters.location) {
        return false;
      }
      
      // Remote filter
      if (filters.isRemote && !internship.is_remote) {
        return false;
      }
      
      return true;
    });
  }, [internships, filters]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Explore <span className="gradient-text">Internship Opportunities</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find the perfect internship to kickstart your career journey and gain valuable experience.
          </p>
        </div>
        
        <InternshipFilters onFilterChange={setFilters} />
        
        {filteredInternships.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInternships.map((internship) => (
              <InternshipCard 
                key={internship.id} 
                internship={internship}
                alreadyApplied={hasApplied(internship.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No internships found</h3>
            <p className="text-gray-600">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
      
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default InternshipsPage;
