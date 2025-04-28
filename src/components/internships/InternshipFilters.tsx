
import { useState } from "react";
import { InternshipCategory } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InternshipFiltersProps {
  onFilterChange: (filters: FilterValues) => void;
}

export interface FilterValues {
  search: string;
  category: string | null;
  location: string | null;
  isRemote: boolean;
}

const InternshipFilters = ({ onFilterChange }: InternshipFiltersProps) => {
  const [filters, setFilters] = useState<FilterValues>({
    search: "",
    category: null,
    location: null,
    isRemote: false,
  });

  const locations = [
    "Remote",
    "Bangalore, India",
    "Hyderabad, India",
    "Mumbai, India",
    "Chennai, India",
    "Delhi, India"
  ];

  const handleFilterChange = (key: keyof FilterValues, value: any) => {
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      search: "",
      category: null,
      location: null,
      isRemote: false,
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
      <div className="mb-6">
        <Input
          placeholder="Search by title, company, or keyword"
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <div>
          <Select
            value={filters.category || ""}
            onValueChange={(value) => handleFilterChange("category", value || null)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Object.values(InternshipCategory).map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select
            value={filters.location || ""}
            onValueChange={(value) => handleFilterChange("location", value || null)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="remote"
            checked={filters.isRemote}
            onCheckedChange={(checked) => 
              handleFilterChange("isRemote", checked === true)
            }
          />
          <Label htmlFor="remote" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Remote Only
          </Label>
        </div>
      </div>

      <Button variant="outline" onClick={handleReset}>
        Reset Filters
      </Button>
    </div>
  );
};

export default InternshipFilters;
