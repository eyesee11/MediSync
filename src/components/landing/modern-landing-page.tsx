"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Logo } from "@/components/icons/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { useToast } from "@/hooks/use-toast";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import {
  Heart,
  Shield,
  Clock,
  Users,
  Star,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  Award,
  Stethoscope,
  Activity,
  UserCheck,
  Lock,
  Globe,
  Smartphone,
  HeartHandshake,
  Building2,
  CreditCard,
  ChevronRight,
  Menu,
  X,
  LineChart,
  GitMerge,
  ShieldCheck,
  Building,
  PlayCircle,
  Database,
  Zap,
  RefreshCw,
  Plug,
  BarChart3,
  Moon,
  Sun,
} from "lucide-react";

// Animated Counter Component
function AnimatedCounter({ value, duration = 2, suffix = "", prefix = "", className = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.5 });

  useEffect(() => {
    if (!isInView) return;

    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOutCubic * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [value, duration, isInView]);

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {prefix}{formatNumber(count)}{suffix}
    </motion.span>
  );
}

// Platform capabilities data
const services = [
  {
    icon: RefreshCw,
    title: "Real-time Sync",
    description: "Automatic synchronization of medical records across all connected healthcare providers with real-time updates and conflict resolution.",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: Shield,
    title: "Security & Compliance", 
    description: "End-to-end encryption, HIPAA compliance, and advanced security protocols to protect sensitive patient data during transmission.",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: Plug,
    title: "Easy Integration",
    description: "Seamless integration with existing EHR systems, EMRs, and hospital management systems through standardized APIs and protocols.",
    gradient: "from-purple-500 to-indigo-500"
  },
  {
    icon: BarChart3,
    title: "Analytics & Insights",
    description: "Comprehensive analytics dashboard providing insights into sync performance, data flow patterns, and system usage metrics.",
    gradient: "from-orange-500 to-red-500"
  }
];

// Trust signals
const trustSignals = [
  {
    icon: Shield,
    label: "HIPAA Compliant",
    desc: "Your data is always secure",
  },
  {
    icon: Award,
    label: "NABH Certified",
    desc: "Nationally accredited healthcare",
  },
  {
    icon: Lock,
    label: "End-to-End Encrypted",
    desc: "Military-grade security",
  },
  {
    icon: CheckCircle,
    label: "MCI Approved",
    desc: "Medical Council verified",
  },
];

// Testimonials
const testimonials = [
  {
    name: "Priya Sharma",
    role: "Patient",
    location: "Mumbai",
    content:
      "MediSync made it so easy to book appointments and access my medical records. The doctors are professional and caring.",
    rating: 5,
    image: "PS",
  },
  {
    name: "Dr. Rajesh Patel",
    role: "Cardiologist",
    location: "Delhi",
    content:
      "As a healthcare provider, I appreciate the seamless integration and secure platform that MediSync provides.",
    rating: 5,
    image: "RP",
  },
  {
    name: "Anita Gupta",
    role: "Patient", 
    location: "Bangalore",
    content:
      "The telehealth services saved me so much time. I could consult with my doctor without leaving home.",
    rating: 5,
    image: "AG",
  },
];

// Insurance providers
const insuranceProviders = [
  "Star Health",
  "HDFC ERGO", 
  "ICICI Lombard",
  "Bajaj Allianz",
  "New India Assurance",
  "Oriental Insurance",
  "United India",
  "National Insurance",
];

export function ModernLandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const { toast } = useToast();

  // Contact form state
  const [contactForm, setContactForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);

  const { scrollYProgress } = useScroll();
  const heroRef = useRef(null);
  const servicesRef = useRef(null);
  const testimonialsRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true, amount: 0.2 });
  const servicesInView = useInView(servicesRef, { once: true, amount: 0.1 });
  const testimonialsInView = useInView(testimonialsRef, {
    once: true,
    amount: 0.1,
  });

  const menuItems = [
    { name: "Platform", href: "#platform" },
    { name: "Security", href: "#security" },
    { name: "Features", href: "#features" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Contact", href: "#contact" }
  ];

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      // Update active section based on scroll position
      const sections = menuItems.map(item => item.href.substring(1));
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [menuItems]);

  const handleBookAppointment = () => {
    setIsBookingLoading(true);
    setTimeout(() => setIsBookingLoading(false), 2000);
  };

  const scrollToSection = (sectionId) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    setIsMenuOpen(false);
  };

  const handleContactInputChange = (e) => {
    const { id, value } = e.target;
    setContactForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !contactForm.firstName ||
      !contactForm.lastName ||
      !contactForm.email ||
      !contactForm.message
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (marked with *).",
        variant: "destructive",
      });
      return;
    }

    setIsSubmittingContact(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactForm),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Message Sent Successfully!",
          description: "Thank you for contacting us. We'll get back to you soon.",
        });
        
        // Reset form
        setContactForm({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          message: "",
        });
      } else {
        throw new Error(data.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Contact form error:", error);
      toast({
        title: "Failed to Send Message",
        description: "Please try again later or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingContact(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-background/80 backdrop-blur-md shadow-lg" 
            : "bg-background/60 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div 
              className="flex-shrink-0"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div 
                className="cursor-pointer" 
                onClick={() => scrollToSection('#')}
              >
                <Logo />
              </div>
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-1">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <button
                      onClick={() => scrollToSection(item.href)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 relative overflow-hidden group ${
                        activeSection === item.href.substring(1)
                          ? "text-primary bg-primary/10"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      <span className="relative z-10">{item.name}</span>
                      <div className="absolute inset-0 bg-primary/5 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-lg" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right side buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <motion.button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </motion.button>
              
              <Link href="/login" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="rounded-lg">
                  Sign In
                </Button>
              </Link>
              
              <Link href="/login" target="_blank" rel="noopener noreferrer">
                <Button size="sm" className="rounded-lg bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <motion.button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-lg border-t"
          >
            <div className="px-4 py-4 space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="block w-full text-left px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
                >
                  {item.name}
                </button>
              ))}
              <div className="flex items-center space-x-2 pt-4 border-t">
                <Link href="/login" target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full rounded-lg">
                    Sign In
                  </Button>
                </Link>
                <Link href="/login" target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button size="sm" className="w-full rounded-lg bg-gradient-to-r from-primary to-blue-600">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </motion.nav>

      <main className="pt-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Hero Section */}
          <section ref={heroRef} className="min-h-screen bg-gradient-to-br from-blue-50/50 via-background to-blue-50/30 dark:from-slate-900/50 dark:via-background dark:to-slate-900/30 py-16 lg:py-24 flex items-center relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
              <div className="absolute bottom-40 right-20 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl" />
              <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative">
              <motion.div 
                className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
                initial={{ opacity: 0 }}
                animate={heroInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.8, staggerChildren: 0.2 }}
              >
                {/* Content */}
                <div className="space-y-8">
                  <motion.div 
                    className="space-y-6"
                    initial={{ opacity: 0, y: 30 }}
                    animate={heroInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                  >
                    <motion.h1 
                      className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight"
                      initial={{ opacity: 0, y: 30 }}
                      animate={heroInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                      Seamless Medical Record{" "}
                      <span className="bg-gradient-to-r from-primary via-blue-600 to-primary bg-clip-text text-transparent">
                        Synchronization
                      </span>
                    </motion.h1>
                    <motion.p 
                      className="text-lg text-muted-foreground max-w-2xl leading-relaxed"
                      initial={{ opacity: 0, y: 30 }}
                      animate={heroInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                      Eliminate the hassle of manual record transfers. MediSync automatically 
                      synchronizes patient medical records between healthcare providers, ensuring 
                      continuity of care without patient intervention or data loss.
                    </motion.p>
                  </motion.div>

                  {/* CTA Buttons */}
                  <motion.div 
                    className="flex flex-col sm:flex-row gap-4"
                    initial={{ opacity: 0, y: 30 }}
                    animate={heroInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link href="/login" target="_blank" rel="noopener noreferrer">
                        <Button size="lg" className="text-base px-8 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg hover:shadow-xl rounded-xl relative overflow-hidden group">
                          <div className="absolute inset-0 bg-white/10 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-xl" />
                          <span className="relative flex items-center space-x-2">
                            <span>Get Started</span>
                            <PlayCircle className="w-4 h-4" />
                          </span>
                        </Button>
                      </Link>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="text-base px-8 border-primary/30 hover:bg-primary/5 rounded-xl relative overflow-hidden group"
                        onClick={() => scrollToSection('#platform')}
                      >
                        <div className="absolute inset-0 bg-primary/5 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-xl" />
                        <span className="relative">View Platform</span>
                      </Button>
                    </motion.div>
                  </motion.div>

                  {/* Trust Badges */}
                  <motion.div 
                    className="flex flex-wrap gap-3 pt-4"
                    initial={{ opacity: 0, y: 30 }}
                    animate={heroInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.8 }}
                  >
                    {[
                      { icon: Shield, text: "HIPAA Compliant", color: "text-green-600" },
                      { icon: Database, text: "HL7 FHIR Compatible", color: "text-blue-600" },
                      { icon: Zap, text: "Real-time Sync", color: "text-yellow-600" },
                      { icon: Clock, text: "99.9% Uptime", color: "text-purple-600" }
                    ].map((badge, index) => {
                      const IconComponent = badge.icon;
                      return (
                        <motion.div
                          key={badge.text}
                          whileHover={{ scale: 1.05, y: -2 }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={heroInView ? { opacity: 1, y: 0 } : {}}
                          transition={{ delay: 0.8 + index * 0.1 }}
                        >
                          <Badge variant="secondary" className="flex items-center gap-2 px-3 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-primary/10 hover:border-primary/20 transition-all duration-200 hover:shadow-md">
                            <IconComponent className={`h-4 w-4 ${badge.color}`} />
                            {badge.text}
                          </Badge>
                        </motion.div>
                      );
                    })}
                  </motion.div>

                  {/* Stats Row */}
                  <motion.div 
                    className="grid grid-cols-3 gap-6 pt-4"
                    initial={{ opacity: 0, y: 30 }}
                    animate={heroInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 1.0 }}
                  >
                    {[
                      { icon: Building2, value: 500, suffix: "+", label: "Healthcare Providers" },
                      { icon: Users, value: 2000, suffix: "K+", label: "Records Synced" },
                      { icon: Clock, value: 99.9, suffix: "%", label: "Uptime SLA" }
                    ].map((stat, index) => {
                      const IconComponent = stat.icon;
                      return (
                        <motion.div
                          key={stat.label}
                          className="text-center group"
                          whileHover={{ scale: 1.05 }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={heroInView ? { opacity: 1, y: 0 } : {}}
                          transition={{ delay: 1.0 + index * 0.2 }}
                        >
                          <div className="flex items-center justify-center mb-2">
                            <IconComponent className="w-5 h-5 text-primary group-hover:scale-110 transition-transform duration-200" />
                          </div>
                          <div className="font-bold text-xl md:text-2xl bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                            <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                          </div>
                          <div className="text-xs text-muted-foreground">{stat.label}</div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </div>

                {/* Hero Image */}
                <motion.div 
                  className="relative"
                  initial={{ opacity: 0, x: 50 }}
                  animate={heroInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <motion.div 
                    className="relative flex items-center justify-center"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Main Image with Motion Effects */}
                    <motion.div
                      className="relative"
                      animate={{
                        y: [0, -20, 0],
                        rotate: [0, 2, 0, -2, 0],
                      }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <motion.img
                        src="/svg_image.png"
                        alt="MediSync Healthcare Platform Illustration"
                        className="w-full h-auto max-w-lg mx-auto filter drop-shadow-2xl"
                        style={{
                          filter: "drop-shadow(0 25px 25px rgba(0, 0, 0, 0.15)) drop-shadow(0 0 50px rgba(59, 130, 246, 0.3))"
                        }}
                        whileHover={{
                          scale: 1.05,
                          filter: "drop-shadow(0 30px 30px rgba(0, 0, 0, 0.2)) drop-shadow(0 0 60px rgba(59, 130, 246, 0.4))"
                        }}
                        transition={{ duration: 0.3 }}
                      />
                      
                      {/* Theme-adaptive glow effect */}
                      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/20 via-blue-500/20 to-primary/20 blur-3xl rounded-full opacity-60 dark:opacity-40" />
                    </motion.div>
                    
                    {/* Floating particles for visual effect */}
                    <motion.div
                      className="absolute top-10 right-10 w-2 h-2 bg-primary/60 rounded-full"
                      animate={{
                        y: [0, -30, 0],
                        opacity: [0.6, 1, 0.6],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5
                      }}
                    />
                    
                    <motion.div
                      className="absolute bottom-16 left-8 w-3 h-3 bg-blue-500/50 rounded-full"
                      animate={{
                        y: [0, -25, 0],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1.2
                      }}
                    />
                    
                    <motion.div
                      className="absolute top-1/3 left-4 w-1.5 h-1.5 bg-green-500/60 rounded-full"
                      animate={{
                        x: [0, 20, 0],
                        opacity: [0.6, 1, 0.6],
                      }}
                      transition={{
                        duration: 3.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                      }}
                    />
                    
                    {/* Floating UI indicators */}
                    <motion.div
                      className="absolute top-6 right-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-primary/10"
                      animate={{
                        y: [0, -10, 0],
                        transition: { repeat: Infinity, duration: 3, ease: "easeInOut" }
                      }}
                    >
                      <div className="flex items-center space-x-2 text-sm">
                        <motion.div 
                          className="w-2 h-2 bg-green-500 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                        />
                        <span className="font-medium text-green-700 dark:text-green-400">Live Sync</span>
                      </div>
                    </motion.div>

                    <motion.div
                      className="absolute bottom-6 left-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-primary/10"
                      animate={{
                        y: [0, 8, 0],
                        transition: { repeat: Infinity, duration: 2.5, ease: "easeInOut", delay: 1 }
                      }}
                    >
                      <div className="flex items-center space-x-2 text-sm">
                        <Database className="w-4 h-4 text-primary" />
                        <span className="font-medium text-foreground">HL7 FHIR</span>
                      </div>
                    </motion.div>
                    
                    {/* Pulse rings for dynamic effect */}
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-primary/20"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.1, 0.3],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    
                    <motion.div
                      className="absolute inset-0 rounded-full border border-blue-500/20"
                      animate={{
                        scale: [1, 1.4, 1],
                        opacity: [0.2, 0.05, 0.2],
                      }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                      }}
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* Platform Capabilities Section */}
          <section id="platform" ref={servicesRef} className="py-16 lg:py-24 bg-gradient-to-b from-background to-blue-50/30 dark:to-slate-900/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div 
                className="text-center space-y-4 mb-16"
                initial={{ opacity: 0, y: 30 }}
                animate={servicesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  Platform Capabilities
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Powerful features designed to streamline medical record management and improve 
                  healthcare coordination across all your connected providers.
                </p>
              </motion.div>

              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                initial={{ opacity: 0 }}
                animate={servicesInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.8, staggerChildren: 0.1 }}
              >
                {services.map((service, index) => {
                  const IconComponent = service.icon;
                  return (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      animate={servicesInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <Card className="relative group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg overflow-hidden">
                        {/* Gradient overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                        
                        <CardHeader className="text-center pb-4 relative">
                          <motion.div 
                            className={`mx-auto w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}
                            whileHover={{ rotate: 5 }}
                          >
                            <IconComponent className="h-8 w-8 text-white" />
                          </motion.div>
                          <CardTitle className="text-xl font-semibold">{service.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center space-y-4 relative">
                          <p className="text-muted-foreground leading-relaxed">
                            {service.description}
                          </p>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-primary hover:text-primary hover:bg-primary/5 rounded-lg group-hover:bg-primary/10 transition-colors"
                            >
                              Learn More →
                            </Button>
                          </motion.div>
                        </CardContent>

                        {/* Decorative elements */}
                        <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-xl group-hover:from-primary/10 transition-colors duration-300" />
                        <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-tl from-blue-500/5 to-transparent rounded-full blur-lg group-hover:from-blue-500/10 transition-colors duration-300" />
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </section>

          {/* Security Section */}
          <section id="security" className="py-16 lg:py-24 bg-gradient-to-b from-blue-50/30 to-background dark:from-slate-900/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center space-y-4 mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  Security & Compliance
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Your data security is our top priority. We maintain the highest standards of compliance and protection.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {trustSignals.map((signal, index) => {
                  const IconComponent = signal.icon;
                  return (
                    <motion.div
                      key={signal.label}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      className="group"
                    >
                      <Card className="text-center p-6 hover:shadow-lg transition-all duration-300 group-hover:bg-primary/5">
                        <div className="mb-4">
                          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <IconComponent className="h-6 w-6 text-primary" />
                          </div>
                        </div>
                        <h3 className="font-semibold mb-2">{signal.label}</h3>
                        <p className="text-sm text-muted-foreground">{signal.desc}</p>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section id="testimonials" ref={testimonialsRef} className="py-16 lg:py-24 bg-gradient-to-b from-background to-blue-50/30 dark:to-slate-900/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div 
                className="text-center space-y-4 mb-16"
                initial={{ opacity: 0, y: 30 }}
                animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  What Our Users Say
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Trusted by healthcare providers and patients across India
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={testimonial.name}
                    initial={{ opacity: 0, y: 30 }}
                    animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card className="p-6 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-sm">
                          {testimonial.image}
                        </div>
                        <div className="ml-3">
                          <div className="font-semibold">{testimonial.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {testimonial.role} • {testimonial.location}
                          </div>
                        </div>
                      </div>
                      <div className="flex mb-3">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-muted-foreground italic">{testimonial.content}</p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="py-16 lg:py-24 bg-gradient-to-b from-blue-50/30 to-background dark:from-slate-900/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center space-y-4 mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  Get in Touch
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Ready to transform your healthcare data management? Contact us today.
                </p>
              </div>

              <div className="max-w-2xl mx-auto">
                <Card className="p-8">
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="firstName" className="text-sm font-medium">
                          First Name *
                        </label>
                        <Input
                          id="firstName"
                          type="text"
                          value={contactForm.firstName}
                          onChange={handleContactInputChange}
                          required
                          className="rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="lastName" className="text-sm font-medium">
                          Last Name *
                        </label>
                        <Input
                          id="lastName"
                          type="text"
                          value={contactForm.lastName}
                          onChange={handleContactInputChange}
                          required
                          className="rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email *
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={contactForm.email}
                        onChange={handleContactInputChange}
                        required
                        className="rounded-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium">
                        Phone Number
                      </label>
                      <Input
                        id="phone"
                        type="tel"
                        value={contactForm.phone}
                        onChange={handleContactInputChange}
                        className="rounded-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">
                        Message *
                      </label>
                      <Textarea
                        id="message"
                        value={contactForm.message}
                        onChange={handleContactInputChange}
                        rows={4}
                        required
                        className="rounded-lg"
                      />
                    </div>

                    <LoadingButton
                      type="submit"
                      className="w-full rounded-lg bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
                      loading={isSubmittingContact}
                      loadingText="Sending..."
                    >
                      Send Message
                    </LoadingButton>
                  </form>
                </Card>
              </div>
            </div>
          </section>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Heart className="h-6 w-6 text-red-500" />
                <span className="text-xl font-bold">MediSync</span>
              </div>
              <p className="text-slate-400 text-sm">
                Seamless medical record synchronization for better healthcare coordination.
              </p>
              <div className="flex space-x-4">
              <Link href="/login" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                Sign In
              </Link>
              <span className="text-slate-600">•</span>
              <ThemeToggle />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Platform</h3>
            <div className="space-y-2 text-sm text-slate-400">
              <button onClick={() => scrollToSection('#platform')} className="block hover:text-white transition-colors">
                Features
              </button>
              <button onClick={() => scrollToSection('#security')} className="block hover:text-white transition-colors">
                Security
              </button>
              <Link href="/search" target="_blank" rel="noopener noreferrer" className="block hover:text-white transition-colors">
                Find Doctors
              </Link>
              <Link href="/dashboard" target="_blank" rel="noopener noreferrer" className="block hover:text-white transition-colors">
                Dashboard
              </Link>
            </div>
          </div>            <div className="space-y-4">
              <h3 className="font-semibold">Support</h3>
              <div className="space-y-2 text-sm text-slate-400">
                <button onClick={() => scrollToSection('#contact')} className="block hover:text-white transition-colors">
                  Contact Us
                </button>
                <a href="mailto:support@medisync.com" className="block hover:text-white transition-colors">
                  Help Center
                </a>
                <a href="#" className="block hover:text-white transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="block hover:text-white transition-colors">
                  Terms of Service
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Insurance Partners</h3>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                {insuranceProviders.slice(0, 6).map((provider) => (
                  <span key={provider} className="hover:text-white transition-colors cursor-pointer">
                    {provider}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-sm text-slate-400">
            <p>&copy; 2024 MediSync. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <motion.button
        onClick={() => scrollToSection('#')}
        className="fixed bottom-8 right-8 w-12 h-12 bg-primary text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-40"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: isScrolled ? 1 : 0, scale: isScrolled ? 1 : 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ChevronRight className="h-6 w-6 rotate-[-90deg]" />
      </motion.button>
    </div>
  );
}
