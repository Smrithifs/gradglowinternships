
import React from "react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const Resources = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-8">Student Resources</h1>
        
        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="resume" className="mb-12">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="resume">Resume & CV</TabsTrigger>
              <TabsTrigger value="interview">Interview Prep</TabsTrigger>
              <TabsTrigger value="skills">Skill Development</TabsTrigger>
              <TabsTrigger value="career">Career Planning</TabsTrigger>
            </TabsList>
            
            <TabsContent value="resume" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ResourceCard
                  title="Resume Writing Guide"
                  description="Learn how to create a professional resume that stands out to recruiters."
                  category="Guide"
                  link="https://example.com/resume-guide"
                />
                <ResourceCard
                  title="CV Templates for Tech"
                  description="Ready-to-use templates for technical positions in software, data science, and more."
                  category="Templates"
                  link="https://example.com/tech-templates"
                />
                <ResourceCard
                  title="Resume Review Workshop"
                  description="Get your resume reviewed by industry professionals in this recorded workshop."
                  category="Video"
                  link="https://example.com/resume-workshop"
                />
                <ResourceCard
                  title="ATS-Friendly Resume Tips"
                  description="Optimize your resume to pass through Applicant Tracking Systems."
                  category="Article"
                  link="https://example.com/ats-tips"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="interview" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ResourceCard
                  title="Technical Interview Handbook"
                  description="Comprehensive guide to technical interviews with practice problems and solutions."
                  category="Handbook"
                  link="https://example.com/tech-interview"
                />
                <ResourceCard
                  title="Behavioral Interview Questions"
                  description="Common behavioral questions and how to structure your responses using the STAR method."
                  category="Guide"
                  link="https://example.com/behavioral"
                />
                <ResourceCard
                  title="Mock Interview Platform"
                  description="Practice with peer-to-peer mock interviews or record yourself answering questions."
                  category="Tool"
                  link="https://example.com/mock-interview"
                />
                <ResourceCard
                  title="Industry-Specific Interview Prep"
                  description="Interview preparation resources tailored to specific industries and roles."
                  category="Collection"
                  link="https://example.com/industry-interview"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="skills" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ResourceCard
                  title="Programming Course Catalog"
                  description="Free and paid courses to learn programming languages relevant to your field."
                  category="Courses"
                  link="https://example.com/programming"
                />
                <ResourceCard
                  title="Soft Skills Development"
                  description="Resources to improve communication, teamwork, and other essential workplace skills."
                  category="Training"
                  link="https://example.com/soft-skills"
                />
                <ResourceCard
                  title="Industry Certification Guide"
                  description="Overview of valuable certifications by industry and how to obtain them."
                  category="Guide"
                  link="https://example.com/certifications"
                />
                <ResourceCard
                  title="Project-Based Learning"
                  description="Build portfolio-worthy projects while learning new technical skills."
                  category="Projects"
                  link="https://example.com/projects"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="career" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ResourceCard
                  title="Career Path Exploration"
                  description="Explore different career paths within your field and understand growth trajectories."
                  category="Guide"
                  link="https://example.com/career-paths"
                />
                <ResourceCard
                  title="Networking Strategies"
                  description="Effective approaches to building your professional network as a student."
                  category="Strategies"
                  link="https://example.com/networking"
                />
                <ResourceCard
                  title="Industry Insights Newsletter"
                  description="Weekly newsletter with trends, news, and opportunities in various industries."
                  category="Newsletter"
                  link="https://example.com/newsletter"
                />
                <ResourceCard
                  title="Career Planning Toolkit"
                  description="Set goals, track progress, and plan your career development with this comprehensive toolkit."
                  category="Tool"
                  link="https://example.com/career-toolkit"
                />
              </div>
            </TabsContent>
          </Tabs>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Upcoming Events</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <EventCard
                title="Resume Workshop"
                date="May 15, 2025"
                time="3:00 PM - 5:00 PM"
                location="Virtual"
              />
              <EventCard
                title="Tech Industry Panel"
                date="May 22, 2025"
                time="2:00 PM - 4:00 PM"
                location="Virtual"
              />
              <EventCard
                title="Mock Interview Day"
                date="June 5, 2025"
                time="9:00 AM - 3:00 PM"
                location="Campus Center"
              />
            </div>
          </section>
          
          <section>
            <div className="bg-gradient-to-r from-purple-100 to-indigo-100 p-8 rounded-lg text-center">
              <h2 className="text-2xl font-semibold mb-4">Need Personalized Help?</h2>
              <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                Our career advisors are available to provide one-on-one guidance tailored to your specific career goals and challenges.
              </p>
              <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                Schedule Advising Session
              </Button>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

interface ResourceCardProps {
  title: string;
  description: string;
  category: string;
  link: string;
}

const ResourceCard = ({ title, description, category, link }: ResourceCardProps) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Badge variant="outline">{category}</Badge>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto pt-4">
        <a 
          href={link} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline flex items-center"
        >
          Access Resource
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
        </a>
      </CardFooter>
    </Card>
  );
};

interface EventCardProps {
  title: string;
  date: string;
  time: string;
  location: string;
}

const EventCard = ({ title, date, time, location }: EventCardProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h3 className="font-medium text-lg mb-2">{title}</h3>
      <div className="text-sm text-gray-700 space-y-1">
        <p className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2 text-gray-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
          </svg>
          {date}
        </p>
        <p className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2 text-gray-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {time}
        </p>
        <p className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2 text-gray-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          {location}
        </p>
      </div>
      <Button variant="outline" className="w-full mt-4 border-indigo-200 hover:bg-indigo-50 text-indigo-700">
        Register
      </Button>
    </div>
  );
};

export default Resources;
