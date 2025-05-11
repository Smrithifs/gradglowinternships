
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://vbkttodkbqbjcahequrt.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZia3R0b2RrYnFiamNhaGVxdXJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4MzM3MjksImV4cCI6MjA2MTQwOTcyOX0.iJhOvSJmfI8uOX9chJXsmwMlX8INboukZjeRp6RxXlo";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: localStorage
  },
  global: {
    headers: {
      'X-Client-Info': 'lovable-internship-app'
    }
  },
  db: {
    schema: 'public'
  }
});

// Helper function to check connection status
export const checkSupabaseConnection = async () => {
  try {
    // Use maybeSingle instead of select().count
    const { data, error } = await supabase
      .from('internship_listings')
      .select('*')
      .limit(1)
      .maybeSingle();
      
    if (error) {
      console.error('Supabase connection error:', error);
      return false;
    }
    console.log('Supabase connection successful');
    return true;
  } catch (err) {
    console.error('Failed to connect to Supabase:', err);
    return false;
  }
};

// Helper function to deduplicate internship listings
export const deduplicateInternshipListings = async () => {
  try {
    console.log('Starting deduplication process');
    
    // Get all internship listings
    const { data: listings, error } = await supabase
      .from('internship_listings')
      .select('*');
      
    if (error) {
      console.error('Error fetching internship listings:', error);
      return false;
    }
    
    if (!listings || listings.length === 0) {
      console.log('No internship listings found');
      return true;
    }
    
    // Find duplicates by title and company
    const uniqueListings = [];
    const seenKeys = new Set();
    const duplicateIds = [];
    
    listings.forEach(listing => {
      const key = `${listing.title}-${listing.company}`;
      
      if (seenKeys.has(key)) {
        duplicateIds.push(listing.id);
      } else {
        seenKeys.add(key);
        uniqueListings.push(listing);
      }
    });
    
    console.log(`Found ${duplicateIds.length} duplicate listings`);
    
    // Delete duplicate listings if any
    if (duplicateIds.length > 0) {
      const { error: deleteError } = await supabase
        .from('internship_listings')
        .delete()
        .in('id', duplicateIds);
        
      if (deleteError) {
        console.error('Error deleting duplicate listings:', deleteError);
        return false;
      }
      
      console.log(`Successfully deleted ${duplicateIds.length} duplicate listings`);
    }
    
    return true;
  } catch (err) {
    console.error('Error deduplicating internship listings:', err);
    return false;
  }
};

// Add new internship listings in different categories
export const addNewInternshipListings = async () => {
  const newListings = [
    {
      title: "Blockchain Development Intern",
      company: "Ethereum Foundation",
      location: "Remote",
      category: "Tech",
      description: "Join the Ethereum Foundation as a Blockchain Development Intern to work on cutting-edge blockchain technology. You'll get hands-on experience with Solidity, Web3.js, and other blockchain frameworks.",
      requirements: ["Knowledge of JavaScript/TypeScript", "Interest in blockchain technology", "Basic understanding of cryptography", "Strong problem-solving skills"],
      salary: "₹50,000/month",
      duration: "6 months",
      deadline: new Date(2025, 8, 15).toISOString(),
      is_remote: true,
      website: "https://ethereum.org",
      logo_url: "https://logo.clearbit.com/ethereum.org",
      company_description: "The Ethereum Foundation is a non-profit organization dedicated to supporting the Ethereum blockchain and related technologies."
    },
    {
      title: "Social Media Marketing Intern",
      company: "TikTok",
      location: "Mumbai, India",
      category: "Marketing",
      description: "Drive social media campaigns for one of the fastest-growing platforms. Learn how to create viral content and measure engagement metrics in this dynamic role.",
      requirements: ["Strong understanding of social media platforms", "Creative mindset", "Basic video editing skills", "Knowledge of digital marketing principles"],
      salary: "₹35,000/month",
      duration: "3 months",
      deadline: new Date(2025, 7, 30).toISOString(),
      is_remote: false,
      website: "https://tiktok.com",
      logo_url: "https://logo.clearbit.com/tiktok.com",
      company_description: "TikTok is a social media platform for creating, sharing and discovering short videos."
    },
    {
      title: "Sustainable Architecture Intern",
      company: "Green Building Council",
      location: "Delhi, India",
      category: "Architecture",
      description: "Work with eco-conscious architects to design sustainable buildings. Learn about green building certifications and environmentally friendly materials.",
      requirements: ["Pursuing degree in Architecture", "Knowledge of CAD software", "Interest in sustainability", "Understanding of building codes"],
      salary: "₹30,000/month",
      duration: "4 months",
      deadline: new Date(2025, 9, 5).toISOString(),
      is_remote: false,
      website: "https://igbc.in",
      logo_url: null,
      company_description: "The Green Building Council promotes sustainability in architecture and construction across India."
    },
    {
      title: "Cybersecurity Analyst Intern",
      company: "Infosys",
      location: "Pune, India",
      category: "Tech",
      description: "Gain hands-on experience in cybersecurity at Infosys. You'll work with security tools, perform vulnerability assessments, and learn about threat mitigation strategies.",
      requirements: ["Knowledge of network security principles", "Basic understanding of cryptography", "Familiarity with Linux systems", "Strong attention to detail"],
      salary: "₹45,000/month",
      duration: "6 months",
      deadline: new Date(2025, 8, 10).toISOString(),
      is_remote: false,
      website: "https://www.infosys.com",
      logo_url: "https://logo.clearbit.com/infosys.com",
      company_description: "Infosys is a global leader in next-generation digital services and consulting."
    },
    {
      title: "Event Management Intern",
      company: "Wizcraft",
      location: "Bangalore, India",
      category: "Hospitality",
      description: "Join India's premier event management company to learn about planning and executing large-scale events. Get exposure to corporate events, weddings, and music festivals.",
      requirements: ["Excellent organizational skills", "Good communication", "Ability to work under pressure", "Creative problem solving"],
      salary: "₹25,000/month",
      duration: "3 months",
      deadline: new Date(2025, 7, 25).toISOString(),
      is_remote: false,
      website: "https://www.wizcraftworld.com",
      logo_url: null,
      company_description: "Wizcraft International Entertainment is one of India's leading communication and entertainment companies."
    }
  ];

  try {
    for (const listing of newListings) {
      const { error } = await supabase
        .from('internship_listings')
        .insert([listing]);
        
      if (error) {
        console.error(`Error adding listing "${listing.title}":`, error);
      } else {
        console.log(`Successfully added listing: ${listing.title}`);
      }
    }
    
    return true;
  } catch (err) {
    console.error('Error adding new internship listings:', err);
    return false;
  }
};

// Call this function to verify the connection
checkSupabaseConnection();
