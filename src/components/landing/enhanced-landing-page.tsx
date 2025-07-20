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
import { useState, useRef } from "react";
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
} from "lucide-react";

// Platform capabilities data
const services = [
  {
    icon: LineChart,
    title: "Records Synced (24h)",
    value: "8,432",
    description: "+12.3% from last 24 hours",
  },
  {
    icon: GitMerge,
    title: "Hospital Integrations",
    value: "28",
    description: "Mumbai, Delhi, Bangalore, Chennai",
  },
  {
    icon: ShieldCheck,
    title: "HIPAA Compliance",
    value: "100%",
    description: "MCI & NABH certified",
    valueColor: "text-green-600",
  },
  {
    icon: Users,
    title: "Active Users",
    value: "15,670",
    description: "+450 since last month",
  },
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

export function EnhancedLandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBookingLoading, setIsBookingLoading] = useState(false);
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

  const handleBookAppointment = () => {
    setIsBookingLoading(true);
    setTimeout(() => setIsBookingLoading(false), 2000);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  const handleContactInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setContactForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactForm.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
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
        body: JSON.stringify({
          name: `${contactForm.firstName} ${contactForm.lastName}`,
          email: contactForm.email,
          phone: contactForm.phone,
          message: contactForm.message,
          subject: "Contact Form Submission from MediSync Hub",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Message Sent Successfully!",
          description:
            "Thank you for contacting us. We'll get back to you within 24-48 hours.",
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
        throw new Error(data.error || "Failed to send message");
      }
    } catch (error) {
      console.error("Contact form error:", error);
      toast({
        title: "Failed to Send Message",
        description:
          error instanceof Error
            ? error.message
            : "Please try again later or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingContact(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      {/* Header */}
      <motion.header
        className="sticky top-0 z-50 bg-white/95 dark:bg-background/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center space-x-2"
            aria-label="MediSync Home"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Logo className="h-8 w-8 text-blue-600" />
            </motion.div>
            <span className="font-bold text-xl text-gray-900 dark:text-white">
              MediSync
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex items-center space-x-8"
            role="navigation"
          >
            {[
              { label: "Services", id: "services" },
              { label: "About", id: "about" },
              { label: "Testimonials", id: "testimonials" },
              { label: "Contact", id: "contact" },
            ].map((item, index) => (
              <motion.button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
              </motion.button>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link href="/login">
                <Button
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 focus:ring-2 focus:ring-blue-500"
                  aria-label="Sign in to your account"
                >
                  Sign In
                </Button>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Link href="/login">
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white focus:ring-2 focus:ring-blue-500"
                  aria-label="Login to access your account"
                >
                  Login / Register
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            className="md:hidden bg-white dark:bg-background border-t border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <nav
              className="container mx-auto px-4 py-4 space-y-2"
              role="navigation"
            >
              {[
                { label: "Services", id: "services" },
                { label: "About", id: "about" },
                { label: "Testimonials", id: "testimonials" },
                { label: "Contact", id: "contact" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-4 space-y-2">
                <Link href="/login" className="block">
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <LoadingButton
                  isLoading={isBookingLoading}
                  onClick={handleBookAppointment}
                  loadingText="Booking..."
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Book Appointment
                </LoadingButton>
              </div>
            </nav>
          </motion.div>
        )}
      </motion.header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section
          ref={heroRef}
          className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-blue-950/20 dark:via-background dark:to-green-950/20 py-12 md:py-20 lg:py-28"
          role="banner"
        >
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
            <motion.div
              className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            <motion.div
              className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-green-200/20 rounded-full blur-3xl"
              animate={{
                scale: [1.2, 1, 1.2],
                rotate: [360, 180, 0],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </div>

          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, x: -50 }}
                animate={heroInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8 }}
              >
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={heroInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.2 }}
                  >
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      Medical Records Platform
                    </Badge>
                  </motion.div>

                  <motion.h1
                    className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight"
                    initial={{ opacity: 0, y: 30 }}
                    animate={heroInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.3 }}
                  >
                    Secure, Real-time{" "}
                    <span className="text-blue-600 dark:text-blue-400">
                      Medical Record
                    </span>{" "}
                    Synchronization
                  </motion.h1>

                  <motion.p
                    className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={heroInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.4 }}
                  >
                    MediSync Hub provides a robust platform for seamless EHR
                    integration, HIPAA compliance, and secure data handling for
                    modern healthcare providers in India.
                  </motion.p>
                </div>

                <motion.div
                  className="flex flex-col sm:flex-row gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.5 }}
                >
                  <Link href="/login" prefetch={false}>
                    <LoadingButton
                      isLoading={isBookingLoading}
                      onClick={handleBookAppointment}
                      loadingText="Loading..."
                      loadingType="heart"
                      size="lg"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold focus:ring-2 focus:ring-blue-500"
                    >
                      Get Started Today
                    </LoadingButton>
                  </Link>

                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => scrollToSection("services")}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 px-8 py-3 text-lg font-semibold focus:ring-2 focus:ring-gray-500"
                  >
                    Learn More
                  </Button>
                </motion.div>

                {/* Trust Indicators */}
                <motion.div
                  className="flex flex-wrap items-center gap-6 pt-6"
                  initial={{ opacity: 0 }}
                  animate={heroInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.6 }}
                >
                  {trustSignals.map((signal, index) => (
                    <motion.div
                      key={signal.label}
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={heroInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: 0.7 + index * 0.1 }}
                    >
                      <signal.icon className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {signal.label}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Hero Image/Illustration */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 50 }}
                animate={heroInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="relative bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900/30 dark:to-green-900/30 rounded-2xl p-8 md:p-12">
                  {/* Medical Illustration */}
                  <div className="flex items-center justify-center">
                    <motion.div
                      className="relative"
                      animate={{
                        y: [-10, 10, -10],
                      }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <div className="w-48 h-48 md:w-64 md:h-64 bg-white dark:bg-gray-800 rounded-full shadow-2xl flex items-center justify-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        >
                          <Heart className="w-24 h-24 md:w-32 md:h-32 text-red-500 fill-current" />
                        </motion.div>
                      </div>
                    </motion.div>

                    {/* Floating Medical Icons */}
                    {[
                      { Icon: Stethoscope, position: "top-4 left-4", delay: 0 },
                      { Icon: Activity, position: "top-4 right-4", delay: 1 },
                      { Icon: Shield, position: "bottom-4 left-4", delay: 2 },
                      { Icon: Clock, position: "bottom-4 right-4", delay: 3 },
                    ].map(({ Icon, position, delay }, index) => (
                      <motion.div
                        key={index}
                        className={`absolute ${position}`}
                        animate={{
                          y: [-5, 5, -5],
                          opacity: [0.6, 1, 0.6],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          delay: delay,
                          ease: "easeInOut",
                        }}
                      >
                        <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center">
                          <Icon className="w-6 h-6 text-blue-600" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Continue with Services section... */}

        {/* Services Section */}
        <section
          id="services"
          ref={servicesRef}
          className="py-16 md:py-24 bg-white dark:bg-background"
        >
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              className="text-center space-y-4 mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={servicesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              >
                Our Services
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
                Platform Capabilities at a Glance
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                We provide a reliable and secure infrastructure to keep your
                healthcare services running smoothly across India.
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 50 }}
                  animate={servicesInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <Card className="h-full border-2 hover:border-blue-500/50 transition-all duration-300 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {service.title}
                      </CardTitle>
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.5,
                        }}
                      >
                        <service.icon className="h-4 w-4 text-muted-foreground" />
                      </motion.div>
                    </CardHeader>
                    <CardContent>
                      <motion.div
                        className={`text-2xl font-bold ${
                          service.valueColor || ""
                        }`}
                        initial={{ scale: 0 }}
                        animate={servicesInView ? { scale: 1 } : {}}
                        transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                      >
                        {service.value}
                      </motion.div>
                      <p className="text-xs text-muted-foreground">
                        {service.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section
          id="about"
          className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900/50"
        >
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  About MediSync
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  Our Mission is to Revolutionize Healthcare Data
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  MediSync Hub was founded with a simple yet powerful goal: to
                  create a universally connected and secure healthcare
                  ecosystem. We believe that by enabling seamless data flow
                  between providers, we can improve patient outcomes, reduce
                  administrative burdens, and pave the way for a new era of
                  proactive and personalized medicine.
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  Our commitment to HIPAA compliance and data security means
                  that patient privacy is at the forefront of everything we do.
                  We utilize advanced encryption methods and follow the
                  strictest protocols to ensure your data is safe.
                </p>

                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      2.3M+
                    </div>
                    <div className="text-gray-600 dark:text-gray-300">
                      Records Synchronized
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      Zero
                    </div>
                    <div className="text-gray-600 dark:text-gray-300">
                      Security Incidents
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">28</div>
                    <div className="text-gray-600 dark:text-gray-300">
                      Hospital Integrations
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-teal-600">100%</div>
                    <div className="text-gray-600 dark:text-gray-300">
                      HIPAA Compliant
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Trust Signals Grid */}
              <motion.div
                className="grid grid-cols-2 gap-6"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                {trustSignals.map((signal, index) => (
                  <motion.div
                    key={signal.label}
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <signal.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                      {signal.label}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {signal.desc}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section
          id="testimonials"
          ref={testimonialsRef}
          className="py-16 md:py-24 bg-white dark:bg-background"
        >
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              className="text-center space-y-4 mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <Badge
                variant="secondary"
                className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
              >
                Patient Stories
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
                What Our Patients Say
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Real experiences from real people who trust MediSync with their
                healthcare needs.
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 50 }}
                  animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <Card className="h-full bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center space-x-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-5 h-5 text-yellow-400 fill-current"
                          />
                        ))}
                      </div>
                      <blockquote className="text-gray-700 dark:text-gray-300 italic">
                        "{testimonial.content}"
                      </blockquote>
                      <div className="flex items-center space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                          {testimonial.image}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {testimonial.name}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            {testimonial.role} • {testimonial.location}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Insurance Section */}
        <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900/50">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              className="text-center space-y-4 mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Badge
                variant="secondary"
                className="bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200"
              >
                Insurance Accepted
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                We Accept Major Insurance Plans
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Don't worry about payments. We work with leading insurance
                providers across India to make healthcare affordable and
                accessible.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              {insuranceProviders.map((provider, index) => (
                <motion.div
                  key={provider}
                  className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                >
                  <CreditCard className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {provider}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section
          id="contact"
          className="py-16 md:py-24 bg-white dark:bg-background"
        >
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              className="text-center space-y-4 mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Badge
                variant="secondary"
                className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
              >
                Get In Touch
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
                Ready to Transform Your Healthcare Data?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Connect with our team to learn how MediSync Hub can secure and
                streamline your medical data management.
              </p>
            </motion.div>

            <div className="grid gap-12 lg:grid-cols-2">
              {/* Contact Information */}
              <motion.div
                className="space-y-8"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="space-y-6">
                  <motion.div
                    className="flex items-center space-x-4"
                    whileHover={{ x: 10, transition: { duration: 0.2 } }}
                  >
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <Phone className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        Call Us
                      </div>
                      <div className="text-gray-600 dark:text-gray-300">
                        +91 1800-123-4567
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-center space-x-4"
                    whileHover={{ x: 10, transition: { duration: 0.2 } }}
                  >
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        Email Us
                      </div>
                      <div className="text-gray-600 dark:text-gray-300">
                        weaboo1164@gmail.com
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-center space-x-4"
                    whileHover={{ x: 10, transition: { duration: 0.2 } }}
                  >
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        Visit Us
                      </div>
                      <div className="text-gray-600 dark:text-gray-300">
                        Mumbai, Delhi, Bangalore
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-center space-x-4"
                    whileHover={{ x: 10, transition: { duration: 0.2 } }}
                  >
                    <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-teal-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        Available
                      </div>
                      <div className="text-gray-600 dark:text-gray-300">
                        24/7 Emergency Support
                      </div>
                    </div>
                  </motion.div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/30 dark:to-green-950/30 p-6 rounded-xl">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                    Need Immediate Medical Attention?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    For medical emergencies, please call 108 or visit your
                    nearest emergency room.
                  </p>
                  <Button
                    variant="destructive"
                    className="bg-red-600 hover:bg-red-700 text-white"
                    aria-label="Emergency contact"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Emergency: 108
                  </Button>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                      Send us a Message
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="firstName"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                          >
                            First Name *
                          </label>
                          <Input
                            id="firstName"
                            value={contactForm.firstName}
                            onChange={handleContactInputChange}
                            placeholder="Enter your first name"
                            className="focus:ring-2 focus:ring-blue-500"
                            required
                            aria-required="true"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="lastName"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                          >
                            Last Name *
                          </label>
                          <Input
                            id="lastName"
                            value={contactForm.lastName}
                            onChange={handleContactInputChange}
                            placeholder="Enter your last name"
                            className="focus:ring-2 focus:ring-blue-500"
                            required
                            aria-required="true"
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >
                          Email Address *
                        </label>
                        <Input
                          id="email"
                          type="email"
                          value={contactForm.email}
                          onChange={handleContactInputChange}
                          placeholder="your.email@example.com"
                          className="focus:ring-2 focus:ring-blue-500"
                          required
                          aria-required="true"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >
                          Phone Number
                        </label>
                        <Input
                          id="phone"
                          type="tel"
                          value={contactForm.phone}
                          onChange={handleContactInputChange}
                          placeholder="+91 98765 43210"
                          className="focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="message"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >
                          Message *
                        </label>
                        <Textarea
                          id="message"
                          value={contactForm.message}
                          onChange={handleContactInputChange}
                          placeholder="How can we help you today?"
                          rows={4}
                          className="focus:ring-2 focus:ring-blue-500"
                          required
                          aria-required="true"
                        />
                      </div>
                      <LoadingButton
                        type="submit"
                        isLoading={isSubmittingContact}
                        loadingText="Sending..."
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        size="lg"
                      >
                        Send Message
                      </LoadingButton>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Logo className="h-8 w-8 text-blue-400" />
                <span className="font-bold text-xl">MediSync</span>
              </div>
              <p className="text-gray-300">
                Your trusted healthcare partner, providing secure and affordable
                medical services across India.
              </p>
              <div className="flex space-x-4">
                {trustSignals.slice(0, 2).map((signal, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <signal.icon className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-gray-300">
                      {signal.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <a
                    href="#services"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Services
                  </a>
                </li>
                <li>
                  <a
                    href="#about"
                    className="hover:text-blue-400 transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#testimonials"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Testimonials
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Services</h3>
              <ul className="space-y-2 text-gray-300">
                <li>Primary Care</li>
                <li>Telehealth</li>
                <li>Specialist Care</li>
                <li>Preventive Care</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Contact Info</h3>
              <div className="space-y-2 text-gray-300">
                <p>+91 1800-123-4567</p>
                <p>support@medisync.in</p>
                <p>Available 24/7</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">
              © 2025 MediSync. All rights reserved.
            </p>
            <div className="flex space-x-6 text-gray-400 mt-4 md:mt-0">
              <a href="#" className="hover:text-blue-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                HIPAA Notice
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
