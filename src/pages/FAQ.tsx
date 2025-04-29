
import { useState } from "react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How do I apply for an internship?",
    answer: "To apply for an internship, browse through the available listings on our Internships page, select the one you're interested in, and click 'Apply Now'. You'll need to be signed in as a student to complete the application process."
  },
  {
    question: "What documents do I need to apply?",
    answer: "For most applications, you'll need a resume/CV and optionally a cover letter. Some internships may require additional materials. You can provide links to your documents hosted on Google Drive, Dropbox, or other services."
  },
  {
    question: "How can I track my application status?",
    answer: "Once you've applied, you can track the status of your applications through the Student Dashboard. Your applications will be listed as 'Pending', 'Under Review', 'Accepted', or 'Rejected'."
  },
  {
    question: "I'm a recruiter, how do I post an internship?",
    answer: "As a recruiter, you need to sign up for a recruiter account. After logging in, you can post new internships through your Recruiter Dashboard by filling out the required details about the position."
  },
  {
    question: "How long does the application process take?",
    answer: "The application review timeline varies by company. Most companies try to respond within 2-3 weeks. You can check your application status on your dashboard at any time."
  },
  {
    question: "Can I edit my application after submission?",
    answer: "Currently, you cannot edit an application after submission. If you need to make changes, we recommend reaching out directly to the company through their contact information provided in the internship listing."
  },
  {
    question: "Are remote internships available?",
    answer: "Yes, many companies offer remote internships. You can filter for remote opportunities on our Internships page using the 'Remote' filter option."
  },
  {
    question: "How do I prepare for my internship interview?",
    answer: "We recommend researching the company, preparing answers to common interview questions in your field, reviewing your resume, and preparing questions to ask your interviewer. Check out our Resources page for more interview preparation tips."
  }
];

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredFAQs = searchQuery 
    ? faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">Frequently Asked Questions</h1>
          
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search FAQ..."
              className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <Accordion type="single" collapsible className="w-full">
              {filteredFAQs.length > 0 ? (
                filteredFAQs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-200 last:border-b-0">
                    <AccordionTrigger className="text-lg font-medium py-4 hover:text-purple-600">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 pb-4 pt-1">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No matching questions found. Try a different search term.
                </div>
              )}
            </Accordion>
          </div>
          
          <div className="mt-10 text-center">
            <h2 className="text-2xl font-semibold mb-4">Still have questions?</h2>
            <p className="text-gray-600 mb-6">
              If you couldn't find the answer you were looking for, feel free to contact us.
            </p>
            <a 
              href="mailto:support@gradglow.com" 
              className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-md"
            >
              Contact Support
            </a>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQ;
