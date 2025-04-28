import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import { InternshipCategory } from "@/types";
import { motion } from "framer-motion";

const Index = () => {
  const features = [
    {
      title: "For Students",
      description: "Discover internships from top companies and apply with a single click.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
        </svg>
      ),
    },
    {
      title: "For Recruiters",
      description: "Post internship opportunities and find the perfect talent for your team.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
        </svg>
      ),
    },
    {
      title: "Career Growth",
      description: "Build your resume with meaningful experiences and kickstart your career.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
        </svg>
      ),
    },
  ];

  const categories = Object.values(InternshipCategory);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full">
            <svg 
              viewBox="0 0 1000 1000" 
              opacity="0.2" 
              className="w-full h-full"
            >
              <circle cx="850" cy="150" r="150" fill="white" />
              <circle cx="100" cy="700" r="120" fill="white" />
              <circle cx="500" cy="500" r="80" fill="white" />
            </svg>
          </div>
        </div>
        
        <Navbar />
        
        <div className="container mx-auto px-4 pt-24 pb-20 md:pt-32 md:pb-32 relative z-1">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              Find Your <span className="text-yellow-300">Perfect Internship</span>, Grow Your Career
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              Connect with top companies and kickstart your professional journey with meaningful internship opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" variant="default" className="bg-white text-indigo-600 hover:bg-white/90 shadow-lg transition-all duration-300 hover:scale-105 w-full sm:w-auto">
                  Get Started
                </Button>
              </Link>
              <Link to="/internships">
                <Button size="lg" variant="outline" className="border-white text-white bg-transparent hover:bg-white/10 shadow-lg transition-all duration-300 hover:scale-105 w-full sm:w-auto">
                  Browse Internships
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              How <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">GradGlow</span> Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div 
                  key={index} 
                  variants={itemVariants}
                  className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center rounded-full text-indigo-600 mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Explore Internships by Category
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((category, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                >
                  <Link 
                    to={`/internships?category=${category}`} 
                    className="p-6 rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 hover:shadow-md transition-all text-center border border-transparent hover:border-indigo-200 block h-full"
                  >
                    <h3 className="text-lg font-medium text-indigo-800">{category}</h3>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-12">Our Impact</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="p-4">
                <div className="text-4xl font-bold text-indigo-600 mb-2">500+</div>
                <div className="text-gray-600">Companies</div>
              </div>
              <div className="p-4">
                <div className="text-4xl font-bold text-indigo-600 mb-2">1,000+</div>
                <div className="text-gray-600">Internships</div>
              </div>
              <div className="p-4">
                <div className="text-4xl font-bold text-indigo-600 mb-2">50,000+</div>
                <div className="text-gray-600">Students</div>
              </div>
              <div className="p-4">
                <div className="text-4xl font-bold text-indigo-600 mb-2">95%</div>
                <div className="text-gray-600">Success Rate</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 py-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <svg 
            viewBox="0 0 1000 1000" 
            opacity="0.1" 
            className="w-full h-full"
          >
            <circle cx="900" cy="150" r="200" fill="white" />
            <circle cx="100" cy="800" r="170" fill="white" />
          </svg>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 drop-shadow-md">
              Ready to Find Your Next Opportunity?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Whether you're a student looking for internships or a recruiter seeking talent,
              GradGlow has you covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" variant="default" className="bg-white text-indigo-600 hover:bg-white/90 shadow-lg transition-all duration-300 hover:scale-105 w-full sm:w-auto">
                  Sign Up Now
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="border-white text-white bg-transparent hover:bg-white/10 shadow-lg transition-all duration-300 hover:scale-105 w-full sm:w-auto">
                  Log In
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
