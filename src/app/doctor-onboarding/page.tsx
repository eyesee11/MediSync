"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Save,
  UserCircle,
  Upload,
  Camera,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  User,
  IdCard,
  Stethoscope,
  MapPin,
  ArrowRight,
  ArrowLeft,
  FileText,
  Clock,
} from "lucide-react";

export default function DoctorOnboardingPage() {
  const router = useRouter();
  const { user, login } = useAuth();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = React.useState(1);
  const totalSteps = 5;

  // Enhanced state for doctor onboarding data with dummy test data
  const [formData, setFormData] = React.useState({
    // Step 1: Personal Information - Pre-filled with dummy data
    firstName: "John",
    lastName: "Smith",
    email: "dr.john.smith@cityhospital.com",
    phone: "+1-555-123-4567",
    dateOfBirth: "1985-03-15",
    gender: "male",

    // Step 2: Profile Photo
    profilePhoto: null as File | null,
    profilePhotoPreview: "",

    // Step 3: HPRID Verification - Pre-filled with dummy data
    hprid: "DUMMY123456",
    hpridVerified: false,

    // Step 4: Professional Information - Pre-filled with dummy data
    specialty: "cardiologist",
    licenseNumber: "MD987654321",
    experience: "10",
    currentHospital: "City General Hospital",
    pastHospitals: "Metro Medical Center, Regional Health Hospital",
    certifications:
      "Board Certified in Cardiology, ACLS Certified, Echo Certified",
    bio: "Experienced cardiologist specializing in interventional cardiology and heart disease prevention. Dedicated to providing comprehensive cardiac care to patients of all ages.",
    languages: "English, Spanish, French",

    // Step 5: Practice Address - Pre-filled with dummy data
    address: "123 Medical Center Drive",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "us",
  });
  const [isVerifyingHPRID, setIsVerifyingHPRID] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please select a photo under 5MB.",
        });
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please select a valid image file.",
        });
        return;
      }

      setFormData((prev) => ({ ...prev, profilePhoto: file }));

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          profilePhotoPreview: e.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const verifyHPRID = async () => {
    if (!formData.hprid) {
      toast({
        variant: "destructive",
        title: "HPRID Required",
        description: "Please enter your HPRID number.",
      });
      return;
    }

    setIsVerifyingHPRID(true);

    try {
      const response = await fetch(
        "http://localhost:3000/api/doctors/verify-hprid",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ hprid: formData.hprid }),
        }
      );

      const data = await response.json();
      console.log("HPRID verification response:", data);

      if (response.ok && data.verified) {
        setFormData((prev) => ({
          ...prev,
          hpridVerified: true,
          hprid: data.hprid,
        }));
        toast({
          title: "HPRID Verified!",
          description:
            "Your Health Professional Registration ID has been successfully verified.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Verification Failed",
          description:
            data.message ||
            "The HPRID number could not be verified. Please check and try again.",
        });
      }
    } catch (error) {
      console.error("HPRID verification error:", error);
      toast({
        variant: "destructive",
        title: "Verification Error",
        description:
          "Unable to verify HPRID at this time. Please try again later.",
      });
    } finally {
      setIsVerifyingHPRID(false);
    }
  };

  // Dummy HPRID bypass function for testing
  const bypassHPRIDVerification = () => {
    const dummyHPRID = "DUMMY" + Date.now().toString().slice(-6); // Generate a unique dummy HPRID
    setFormData((prev) => ({
      ...prev,
      hprid: dummyHPRID,
      hpridVerified: true,
    }));
    toast({
      title: "HPRID Bypassed (Testing Mode)",
      description: `Using dummy HPRID: ${dummyHPRID} for testing purposes.`,
    });
  };

  // Auto-fill all dummy data for quick testing
  const fillDummyData = () => {
    setFormData({
      firstName: "Dr. Arjun",
      lastName: "Patel",
      email: "dr.arjun.patel@apollohospital.com",
      phone: "+91 98765 12345",
      dateOfBirth: "1982-07-22",
      gender: "male",
      profilePhoto: null,
      profilePhotoPreview: "",
      hprid: "DUMMY" + Date.now().toString().slice(-6),
      hpridVerified: true,
      specialty: "cardiology",
      licenseNumber: "MCI123789456",
      experience: "12",
      currentHospital: "Apollo Hospital Delhi",
      pastHospitals: "AIIMS Delhi, Fortis Hospital Gurgaon",
      certifications:
        "MD Cardiology, Fellowship in Interventional Cardiology, BLS Certified",
      bio: "Dedicated cardiologist with over 12 years of experience in treating heart conditions. Specializing in interventional cardiology and preventive cardiac care.",
      languages: "Hindi, English, Gujarati",
      address: "456 Medical Complex, Connaught Place",
      city: "New Delhi",
      state: "Delhi",
      zipCode: "110001",
      country: "in",
    });
    toast({
      title: "Dummy Data Loaded!",
      description:
        "All fields filled with test data. Ready for quick registration.",
    });
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          formData.firstName &&
          formData.lastName &&
          formData.email &&
          formData.phone
        );
      case 2:
        return true; // Photo is optional, but we recommend it
      case 3:
        return formData.hpridVerified;
      case 4:
        return !!(
          formData.specialty &&
          formData.licenseNumber &&
          formData.experience &&
          formData.currentHospital
        );
      case 5:
        return true; // Address is optional
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    } else {
      toast({
        variant: "destructive",
        title: "Please complete required fields",
        description:
          "Fill in all required information before proceeding to the next step.",
      });
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    // Validate all essential steps before submission
    const allStepsValid = [1, 2, 3, 4].every((step) => validateStep(step));
    if (!allStepsValid) {
      toast({
        variant: "destructive",
        title: "Please complete all required steps",
        description:
          "Ensure all required information is filled before submitting.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Submitting doctor registration with data:", formData);

      // Test if API is reachable first
      console.log("Testing API connectivity...");

      const response = await fetch(
        "http://localhost:3000/api/doctors/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);
      console.log("Response headers:", [...response.headers.entries()]);

      const data = await response.json();
      console.log("Registration response:", data);

      if (response.ok) {
        console.log("Doctor registration successful:", data);

        // Update user context with doctor role and name
        login({
          name: `Dr. ${formData.firstName} ${formData.lastName}`,
          role: "doctor",
        });

        toast({
          title: "Registration Completed!",
          description: `Your doctor profile has been successfully submitted for review. ID: ${data.id}`,
        });

        // Redirect to dashboard after successful registration
        setTimeout(() => {
          router.push("/dashboard");
        }, 3000);
      } else {
        throw new Error(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      console.error("Error type:", typeof error);
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);

      let errorMessage =
        "There was an error submitting your registration. Please try again.";

      if (error.name === "TypeError" && error.message.includes("fetch")) {
        errorMessage =
          "Cannot connect to server. Please ensure the API server is running on http://localhost:3000";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        variant: "destructive",
        title: "Registration Error",
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Let's start with your basic personal details for account
                identification.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  placeholder="e.g., John"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  placeholder="e.g., Smith"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="doctor@hospital.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  onValueChange={handleSelectChange("gender")}
                  value={formData.gender}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">
                      Prefer not to say
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Profile Photo
              </CardTitle>
              <CardDescription>
                Upload a professional photo that will be visible to patients.
                This helps build trust and recognition.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-6">
              <Avatar className="h-40 w-40">
                <AvatarImage src={formData.profilePhotoPreview} />
                <AvatarFallback className="text-3xl">
                  {formData.firstName && formData.lastName ? (
                    `${formData.firstName[0]}${formData.lastName[0]}`
                  ) : (
                    <User className="h-16 w-16" />
                  )}
                </AvatarFallback>
              </Avatar>
              <div className="text-center space-y-4">
                <Input
                  id="profilePhoto"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <Label htmlFor="profilePhoto" className="cursor-pointer">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="gap-2"
                    asChild
                  >
                    <span>
                      <Upload className="h-4 w-4" />
                      {formData.profilePhotoPreview
                        ? "Change Photo"
                        : "Upload Photo"}
                    </span>
                  </Button>
                </Label>
                <p className="text-sm text-muted-foreground">
                  JPG, PNG or GIF. Max file size 5MB.
                  <br />
                  Professional headshot recommended for best patient response.
                </p>
                {!formData.profilePhotoPreview && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <p className="text-amber-800 text-sm">
                      📸 <strong>Tip:</strong> Doctors with profile photos
                      receive 3x more patient consultations!
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IdCard className="h-5 w-5" />
                HPRID Verification
                {formData.hpridVerified && (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                )}
              </CardTitle>
              <CardDescription>
                Enter your Health Professional Registration ID (HPRID) for
                identity verification. This is required to practice medicine and
                ensures patient safety.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="hprid">HPRID Number *</Label>
                <div className="flex gap-2">
                  <Input
                    id="hprid"
                    placeholder="Enter your HPRID number"
                    value={formData.hprid}
                    onChange={handleInputChange}
                    disabled={formData.hpridVerified}
                    required
                  />
                  <Button
                    type="button"
                    onClick={verifyHPRID}
                    disabled={
                      isVerifyingHPRID ||
                      formData.hpridVerified ||
                      !formData.hprid
                    }
                    className="whitespace-nowrap min-w-[120px]"
                    variant={formData.hpridVerified ? "default" : "outline"}
                  >
                    {isVerifyingHPRID ? (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 animate-spin" />
                        Verifying...
                      </div>
                    ) : formData.hpridVerified ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Verified
                      </div>
                    ) : (
                      "Verify HPRID"
                    )}
                  </Button>
                </div>

                {/* Testing Bypass Button */}
                {!formData.hpridVerified && (
                  <div className="mt-4">
                    <Button
                      type="button"
                      onClick={bypassHPRIDVerification}
                      variant="secondary"
                      size="sm"
                      className="w-full bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border border-yellow-300"
                    >
                      🧪 Skip HPRID Verification (Testing Mode)
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1 text-center">
                      For development and testing purposes only
                    </p>
                  </div>
                )}
              </div>

              {formData.hpridVerified && (
                <div className="flex items-center gap-3 text-green-600 bg-green-50 p-4 rounded-lg border border-green-200">
                  <CheckCircle className="h-6 w-6" />
                  <div>
                    <p className="font-medium">
                      {formData.hprid.startsWith("DUMMY")
                        ? "HPRID Bypassed (Testing Mode)!"
                        : "HPRID Successfully Verified!"}
                    </p>
                    <p className="text-sm text-green-700">
                      {formData.hprid.startsWith("DUMMY")
                        ? `Using dummy HPRID: ${formData.hprid} for testing purposes.`
                        : "Your medical license is valid and active."}
                    </p>
                  </div>
                </div>
              )}

              {!formData.hpridVerified &&
                formData.hprid &&
                !isVerifyingHPRID && (
                  <div className="flex items-center gap-3 text-amber-600 bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <AlertCircle className="h-6 w-6" />
                    <div>
                      <p className="font-medium">Verification Required</p>
                      <p className="text-sm text-amber-700">
                        Please verify your HPRID to continue with registration.
                      </p>
                    </div>
                  </div>
                )}

              {isVerifyingHPRID && (
                <div className="flex items-center gap-3 text-blue-600 bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <Clock className="h-6 w-6 animate-spin" />
                  <div>
                    <p className="font-medium">Verifying HPRID...</p>
                    <p className="text-sm text-blue-700">
                      Please wait while we validate your registration with the
                      medical board.
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">
                  What is HPRID?
                </h4>
                <p className="text-sm text-blue-800">
                  The Health Professional Registration ID is a unique identifier
                  assigned to licensed medical professionals. It ensures that
                  only verified doctors can access patient information and
                  provide medical consultations.
                </p>
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5" />
                Professional Information
              </CardTitle>
              <CardDescription>
                Your medical qualifications and current practice details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="specialty">Medical Specialty *</Label>
                  <Select
                    onValueChange={handleSelectChange("specialty")}
                    value={formData.specialty}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general-practitioner">
                        General Practitioner
                      </SelectItem>
                      <SelectItem value="cardiologist">Cardiologist</SelectItem>
                      <SelectItem value="dermatologist">
                        Dermatologist
                      </SelectItem>
                      <SelectItem value="pediatrician">Pediatrician</SelectItem>
                      <SelectItem value="neurologist">Neurologist</SelectItem>
                      <SelectItem value="orthopedist">
                        Orthopedic Surgeon
                      </SelectItem>
                      <SelectItem value="psychiatrist">Psychiatrist</SelectItem>
                      <SelectItem value="oncologist">Oncologist</SelectItem>
                      <SelectItem value="radiologist">Radiologist</SelectItem>
                      <SelectItem value="anesthesiologist">
                        Anesthesiologist
                      </SelectItem>
                      <SelectItem value="emergency-medicine">
                        Emergency Medicine
                      </SelectItem>
                      <SelectItem value="pathologist">Pathologist</SelectItem>
                      <SelectItem value="ophthalmologist">
                        Ophthalmologist
                      </SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">
                    Medical License Number *
                  </Label>
                  <Input
                    id="licenseNumber"
                    placeholder="e.g., MD123456789"
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience *</Label>
                  <Input
                    id="experience"
                    type="number"
                    min="0"
                    max="60"
                    placeholder="e.g., 10"
                    value={formData.experience}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentHospital">
                    Current Hospital/Clinic *
                  </Label>
                  <Input
                    id="currentHospital"
                    placeholder="e.g., City General Hospital"
                    value={formData.currentHospital}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pastHospitals">Previous Workplaces</Label>
                <Textarea
                  id="pastHospitals"
                  placeholder="List previous hospitals or clinics where you've worked, separated by commas"
                  value={formData.pastHospitals}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="certifications">
                  Certifications & Qualifications
                </Label>
                <Textarea
                  id="certifications"
                  placeholder="List your medical degrees, board certifications, and other qualifications"
                  value={formData.certifications}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Professional Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Write a brief professional summary that will be visible to patients..."
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="languages">Languages Spoken</Label>
                <Input
                  id="languages"
                  placeholder="English, Spanish, French..."
                  value={formData.languages}
                  onChange={handleInputChange}
                />
              </div>
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Practice Address
              </CardTitle>
              <CardDescription>
                Primary practice location for patient visits and correspondence.
                This information helps patients find your clinic.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  placeholder="123 Medical Center Drive"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="New York"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State/Province</Label>
                <Input
                  id="state"
                  placeholder="NY"
                  value={formData.state}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                <Input
                  id="zipCode"
                  placeholder="10001"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select
                  onValueChange={handleSelectChange("country")}
                  value={formData.country}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="au">Australia</SelectItem>
                    <SelectItem value="in">India</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight flex items-center justify-center gap-3 mb-4">
            <Stethoscope className="h-10 w-10 text-primary" />
            Doctor Registration
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join MediSync and start providing secure, digital healthcare to
            patients worldwide.
          </p>
          <div className="flex justify-center mt-6 gap-4">
            <Badge variant="outline" className="text-sm">
              <ShieldCheck className="mr-2 h-4 w-4" />
              HIPAA Compliant & Secure
            </Badge>
          </div>

          {/* Testing Helper Button */}
          <div className="flex justify-center mt-4">
            <Button
              onClick={fillDummyData}
              variant="secondary"
              size="sm"
              className="bg-blue-100 hover:bg-blue-200 text-blue-800 border border-blue-300"
            >
              🚀 Fill All Fields with Test Data (Quick Test)
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>
                  Step {currentStep} of {totalSteps}
                </span>
                <span>
                  {Math.round((currentStep / totalSteps) * 100)}% Complete
                </span>
              </div>
              <Progress
                value={(currentStep / totalSteps) * 100}
                className="h-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Personal Info</span>
                <span>Profile Photo</span>
                <span>HPRID Verify</span>
                <span>Professional</span>
                <span>Address</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        <div className="space-y-6">
          {getStepContent()}

          {/* Navigation Buttons */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>

                {currentStep < totalSteps ? (
                  <Button
                    onClick={handleNext}
                    className="flex items-center gap-2"
                    disabled={!validateStep(currentStep)}
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={
                      isSubmitting ||
                      ![1, 2, 3, 4].every((step) => validateStep(step))
                    }
                    className="flex items-center gap-2"
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Clock className="h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4" />
                        Complete Registration
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>
            By completing this registration, you agree to our Terms of Service
            and Privacy Policy. Your information is protected with
            enterprise-grade encryption.
          </p>
        </div>
      </div>
    </div>
  );
}
