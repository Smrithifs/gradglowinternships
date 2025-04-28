
import { formatDistanceToNow } from "date-fns";
import { Internship } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface InternshipCardProps {
  internship: Internship;
  showApplyButton?: boolean;
  showDetails?: boolean;
  alreadyApplied?: boolean;
}

const InternshipCard = ({ 
  internship, 
  showApplyButton = true, 
  showDetails = true,
  alreadyApplied = false
}: InternshipCardProps) => {
  const postedAgo = formatDistanceToNow(new Date(internship.created_at), { addSuffix: true });
  
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border-none bg-card-gradient gradient-border h-full flex flex-col">
      <CardContent className="p-6 flex-1">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg md:text-xl font-semibold">{internship.title}</h3>
            <div className="flex items-center text-gray-600 mt-1">
              <span>{internship.company}</span>
              <span className="mx-2">•</span>
              <span>{internship.location}</span>
            </div>
          </div>
          {internship.logo_url && (
            <img 
              src={internship.logo_url} 
              alt={`${internship.company} logo`} 
              className="w-10 h-10 object-contain rounded"
            />
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 my-3">
          <Badge variant="outline" className="bg-white/50">{internship.category}</Badge>
          {internship.is_remote && (
            <Badge variant="outline" className="bg-white/50">Remote</Badge>
          )}
          <Badge variant="outline" className="bg-white/50">{internship.duration}</Badge>
        </div>
        
        {showDetails && (
          <div className="mt-3 text-gray-600 text-sm line-clamp-3">
            {internship.description}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-6 pt-0 mt-auto flex items-center justify-between">
        <div className="text-xs text-gray-500">Posted {postedAgo}</div>
        
        {showApplyButton && (
          alreadyApplied ? (
            <Badge variant="secondary">Applied</Badge>
          ) : (
            <Link to={`/internship/${internship.id}`}>
              <Button size="sm" variant="default">View Details</Button>
            </Link>
          )
        )}
      </CardFooter>
    </Card>
  );
};

export default InternshipCard;
