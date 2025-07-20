"use client";

import * as React from "react";
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
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();

  // Enhanced state for doctor profile data
  const [profileData, setProfileData] = React.useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",

    // Profile Photo
    profilePhoto: null as File | null,
    profilePhotoPreview: "",

    // Professional Information
    hprid: "",
    hpridVerified: false,
    specialty: "",
    licenseNumber: "",
    experience: "",
    currentHospital: "",
    pastHospitals: "",

    // Address Information
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",

    // Additional Information
    bio: "",
    languages: "",
    certifications: "",
  });

  const [isVerifyingHPRID, setIsVerifyingHPRID] = React.useState(false);
  const [isCompleted, setIsCompleted] = React.useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setProfileData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field: string) => (value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
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

      setProfileData((prev) => ({ ...prev, profilePhoto: file }));

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData((prev) => ({
          ...prev,
          profilePhotoPreview: e.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const verifyHPRID = async () => {
    if (!profileData.hprid) {
      toast({
        variant: "destructive",
        title: "HPRID Required",
        description: "Please enter your HPRID number.",
      });
      return;
    }

    setIsVerifyingHPRID(true);

    // Mock HPRID verification API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call

      // Mock verification logic - in real implementation, this would call the HPRID API
      const isValid = profileData.hprid.length >= 10; // Simple validation for demo

      if (isValid) {
        setProfileData((prev) => ({ ...prev, hpridVerified: true }));
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
            "The HPRID number could not be verified. Please check and try again.",
        });
      }
    } catch (error) {
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

  // Dummy HPRID bypass function for testing (Profile Page)
  const bypassHPRIDVerification = () => {
    const dummyHPRID = "DUMMY" + Date.now().toString().slice(-6);
    setProfileData((prev) => ({
      ...prev,
      hprid: dummyHPRID,
      hpridVerified: true,
    }));
    toast({
      title: "HPRID Bypassed (Testing Mode)",
      description: `Using dummy HPRID: ${dummyHPRID} for testing purposes.`,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "hprid",
      "specialty",
      "licenseNumber",
      "currentHospital",
    ];
    const missingFields = requiredFields.filter(
      (field) => !profileData[field as keyof typeof profileData]
    );

    if (missingFields.length > 0) {
      toast({
        variant: "destructive",
        title: "Required fields missing",
        description: "Please fill in all required fields before saving.",
      });
      return;
    }

    if (!profileData.hpridVerified) {
      toast({
        variant: "destructive",
        title: "HPRID Verification Required",
        description: "Please verify your HPRID before saving your profile.",
      });
      return;
    }

    // Here you would typically save the data to a backend
    console.log("Saving doctor profile data:", profileData);
    setIsCompleted(true);
    toast({
      title: "Profile Completed!",
      description:
        "Your doctor profile has been successfully created and will be reviewed for approval.",
    });
  };

  // Only render for doctors
  if (user?.role !== "doctor") {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This page is only available for users with a 'Doctor' role.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-6">
      <div className="text-center relative">
        <div className="absolute top-0 right-0">
          <ThemeToggle />
        </div>
        <h1 className="text-4xl font-bold tracking-tight flex items-center justify-center gap-3 mb-4">
          <Stethoscope className="h-10 w-10 text-primary" />
          Doctor Registration
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Welcome to MediSync! Complete your professional profile to start
          connecting with patients and managing medical records securely.
        </p>
        <div className="flex justify-center mt-6">
          <Badge variant="outline" className="text-sm">
            <ShieldCheck className="mr-2 h-4 w-4" />
            All information is encrypted and HIPAA compliant
          </Badge>
        </div>
      </div>

      {isCompleted ? (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
              <h2 className="text-2xl font-semibold text-green-800">
                Profile Submitted Successfully!
              </h2>
              <p className="text-green-700">
                Your doctor profile has been submitted for review. You will
                receive an email notification once your profile is approved and
                you can start using the platform.
              </p>
              <div className="space-y-2 text-sm text-green-600">
                <p>✓ Personal information recorded</p>
                <p>✓ HPRID verified</p>
                <p>✓ Professional credentials submitted</p>
                <p>✓ Profile photo uploaded</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Photo Section */}
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
            <CardContent className="flex flex-col items-center space-y-4">
              <Avatar className="h-32 w-32">
                <AvatarImage src={profileData.profilePhotoPreview} />
                <AvatarFallback className="text-2xl">
                  {profileData.firstName && profileData.lastName ? (
                    `${profileData.firstName[0]}${profileData.lastName[0]}`
                  ) : (
                    <User className="h-12 w-12" />
                  )}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
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
                    className="gap-2"
                    asChild
                  >
                    <span>
                      <Upload className="h-4 w-4" />
                      {profileData.profilePhotoPreview
                        ? "Change Photo"
                        : "Upload Photo"}
                    </span>
                  </Button>
                </Label>
                <p className="text-xs text-muted-foreground mt-2">
                  JPG, PNG or GIF. Max file size 5MB.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Basic personal details for account identification and contact
                purposes.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  placeholder="e.g., John"
                  value={profileData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  placeholder="e.g., Smith"
                  value={profileData.lastName}
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
                  value={profileData.email}
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
                  value={profileData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={profileData.dateOfBirth}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  onValueChange={handleSelectChange("gender")}
                  value={profileData.gender}
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

          {/* HPRID Verification */}
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IdCard className="h-5 w-5" />
                HPRID Verification
                {profileData.hpridVerified && (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                )}
              </CardTitle>
              <CardDescription>
                Enter your Health Professional Registration ID (HPRID) for
                identity verification. This is required to practice medicine.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hprid">HPRID Number *</Label>
                <div className="flex gap-2">
                  <Input
                    id="hprid"
                    placeholder="Enter your HPRID number"
                    value={profileData.hprid}
                    onChange={handleInputChange}
                    disabled={profileData.hpridVerified}
                    required
                  />
                  <Button
                    type="button"
                    onClick={verifyHPRID}
                    disabled={
                      isVerifyingHPRID ||
                      profileData.hpridVerified ||
                      !profileData.hprid
                    }
                    className="whitespace-nowrap"
                  >
                    {isVerifyingHPRID
                      ? "Verifying..."
                      : profileData.hpridVerified
                      ? "Verified"
                      : "Verify"}
                  </Button>
                </div>

                {/* Testing Bypass Button */}
                {!profileData.hpridVerified && (
                  <div className="mt-3">
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
              {profileData.hpridVerified && (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-md">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">
                    {profileData.hprid.startsWith("DUMMY")
                      ? "HPRID Bypassed (Testing Mode)"
                      : "HPRID Successfully Verified"}
                  </span>
                </div>
              )}
              {!profileData.hpridVerified && profileData.hprid && (
                <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-md">
                  <AlertCircle className="h-5 w-5" />
                  <span>Please verify your HPRID to continue</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Professional Information */}
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
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="specialty">Medical Specialty *</Label>
                <Select
                  onValueChange={handleSelectChange("specialty")}
                  value={profileData.specialty}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general-practitioner">
                      General Practitioner
                    </SelectItem>
                    <SelectItem value="cardiologist">Cardiologist</SelectItem>
                    <SelectItem value="dermatologist">Dermatologist</SelectItem>
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
                <Label htmlFor="licenseNumber">Medical License Number *</Label>
                <Input
                  id="licenseNumber"
                  placeholder="e.g., MD123456789"
                  value={profileData.licenseNumber}
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
                  value={profileData.experience}
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
                  value={profileData.currentHospital}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="pastHospitals">Previous Workplaces</Label>
                <Textarea
                  id="pastHospitals"
                  placeholder="List previous hospitals or clinics where you've worked, separated by commas"
                  value={profileData.pastHospitals}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="certifications">
                  Certifications & Qualifications
                </Label>
                <Textarea
                  id="certifications"
                  placeholder="List your medical degrees, board certifications, and other qualifications"
                  value={profileData.certifications}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Practice Address
              </CardTitle>
              <CardDescription>
                Primary practice location for patient visits and correspondence.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  placeholder="123 Medical Center Drive"
                  value={profileData.address}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="New York"
                  value={profileData.city}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State/Province</Label>
                <Input
                  id="state"
                  placeholder="NY"
                  value={profileData.state}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                <Input
                  id="zipCode"
                  placeholder="10001"
                  value={profileData.zipCode}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select
                  onValueChange={handleSelectChange("country")}
                  value={profileData.country}
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

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
              <CardDescription>
                Optional details to help patients understand your background and
                expertise.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="bio">Professional Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Write a brief professional summary that will be visible to patients..."
                  value={profileData.bio}
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="languages">Languages Spoken</Label>
                <Input
                  id="languages"
                  placeholder="English, Spanish, French..."
                  value={profileData.languages}
                  onChange={handleInputChange}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold">
                  Ready to Submit Your Profile?
                </h3>
                <p className="text-muted-foreground">
                  Please review all information carefully. Once submitted, your
                  profile will be reviewed by our team before activation.
                </p>
                <Button type="submit" size="lg" className="w-full md:w-auto">
                  <Save className="mr-2 h-5 w-5" />
                  Complete Doctor Registration
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      )}
    </div>
  );
}
