"use client";

import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth/auth-provider";
import {
  ArrowRight,
  ArrowLeft,
  User,
  Camera,
  Heart,
  FileText,
  MapPin,
  Clock,
  CheckCircle,
  Upload,
  TestTube,
} from "lucide-react";

interface PatientFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  profilePhoto: File | null;
  profilePhotoPreview: string;
  bloodType: string;
  height: string;
  weight: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  allergies: string;
  medications: string;
  medicalHistory: string;
  insuranceProvider: string;
  insuranceNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export default function PatientOnboardingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [formData, setFormData] = useState<PatientFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    profilePhoto: null,
    profilePhotoPreview: "",
    bloodType: "",
    height: "",
    weight: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",
    allergies: "",
    medications: "",
    medicalHistory: "",
    insuranceProvider: "",
    insuranceNumber: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "us",
  });

  const updateFormData = (
    field: keyof PatientFormData,
    value: string | File | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      updateFormData("profilePhoto", file);
      const reader = new FileReader();
      reader.onload = (e) => {
        updateFormData("profilePhotoPreview", e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Fill dummy data function for testing
  const fillDummyData = () => {
    setFormData({
      firstName: "Priya",
      lastName: "Sharma",
      email: "priya.sharma@gmail.com",
      phone: "+91 98765 43210",
      dateOfBirth: "1990-03-15",
      gender: "female",
      profilePhoto: null,
      profilePhotoPreview: "",
      bloodType: "A+",
      height: "165 cm",
      weight: "58 kg",
      emergencyContactName: "Rajesh Sharma",
      emergencyContactPhone: "+91 98765 43211",
      emergencyContactRelation: "spouse",
      allergies: "Penicillin, Shellfish",
      medications: "Multivitamin, Iron tablets",
      medicalHistory: "Appendectomy (2018), No chronic conditions",
      insuranceProvider: "Star Health Insurance",
      insuranceNumber: "SH123456789",
      address: "789 MG Road",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400001",
      country: "in",
    });
    toast({
      title: "Dummy Data Loaded!",
      description:
        "All fields filled with test patient data. Ready for quick registration.",
    });
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          formData.firstName &&
          formData.lastName &&
          formData.email &&
          formData.phone &&
          formData.dateOfBirth &&
          formData.gender
        );
      case 2:
        return true; // Photo is optional
      case 3:
        return !!(
          formData.bloodType &&
          formData.height &&
          formData.weight &&
          formData.emergencyContactName &&
          formData.emergencyContactPhone
        );
      case 4:
        return !!(formData.insuranceProvider && formData.insuranceNumber);
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
        description: "Fill in all required information before proceeding.",
      });
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    // Validate all essential steps before submission
    const allStepsValid = [1, 3, 4].every((step) => validateStep(step));
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
      console.log("Submitting patient registration with data:", formData);

      const response = await fetch(
        "http://localhost:3000/api/patients/register",
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

      const data = await response.json();
      console.log("Registration response:", data);

      if (response.ok) {
        console.log("Patient registration successful:", data);

        // Update user context with patient role and name
        login({
          name: `${formData.firstName} ${formData.lastName}`,
          role: "patient",
        });

        toast({
          title: "Registration Completed!",
          description: `Your patient profile has been successfully created. ID: ${data.id}`,
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
          <div className="space-y-6">
            <div className="text-center mb-6">
              <User className="h-12 w-12 mx-auto text-blue-600 mb-4" />
              <h2 className="text-2xl font-bold">Personal Information</h2>
              <p className="text-gray-600">Tell us about yourself</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => updateFormData("firstName", e.target.value)}
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => updateFormData("lastName", e.target.value)}
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData("email", e.target.value)}
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => updateFormData("phone", e.target.value)}
                placeholder="Enter your phone number"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    updateFormData("dateOfBirth", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender *</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => updateFormData("gender", value)}
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
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Camera className="h-12 w-12 mx-auto text-blue-600 mb-4" />
              <h2 className="text-2xl font-bold">Profile Photo</h2>
              <p className="text-gray-600">Add a profile photo (optional)</p>
            </div>

            <div className="flex flex-col items-center space-y-4">
              {formData.profilePhotoPreview ? (
                <img
                  src={formData.profilePhotoPreview}
                  alt="Profile preview"
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-200"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-300">
                  <User className="h-16 w-16 text-gray-400" />
                </div>
              )}

              <div className="flex flex-col items-center space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photoUpload"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    document.getElementById("photoUpload")?.click()
                  }
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  {formData.profilePhotoPreview
                    ? "Change Photo"
                    : "Upload Photo"}
                </Button>
                <p className="text-sm text-gray-500">
                  Recommended: Square image, at least 200x200px
                </p>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Heart className="h-12 w-12 mx-auto text-red-600 mb-4" />
              <h2 className="text-2xl font-bold">Medical Information</h2>
              <p className="text-gray-600">Important health details</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="bloodType">Blood Type *</Label>
                <Select
                  value={formData.bloodType}
                  onValueChange={(value) => updateFormData("bloodType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="height">Height *</Label>
                <Input
                  id="height"
                  value={formData.height}
                  onChange={(e) => updateFormData("height", e.target.value)}
                  placeholder="e.g., 5'8&quot; or 173cm"
                />
              </div>
              <div>
                <Label htmlFor="weight">Weight *</Label>
                <Input
                  id="weight"
                  value={formData.weight}
                  onChange={(e) => updateFormData("weight", e.target.value)}
                  placeholder="e.g., 150 lbs or 68 kg"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Emergency Contact *</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="emergencyContactName">Contact Name *</Label>
                  <Input
                    id="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={(e) =>
                      updateFormData("emergencyContactName", e.target.value)
                    }
                    placeholder="Emergency contact name"
                  />
                </div>
                <div>
                  <Label htmlFor="emergencyContactPhone">Contact Phone *</Label>
                  <Input
                    id="emergencyContactPhone"
                    value={formData.emergencyContactPhone}
                    onChange={(e) =>
                      updateFormData("emergencyContactPhone", e.target.value)
                    }
                    placeholder="Emergency contact phone"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="emergencyContactRelation">Relationship</Label>
                <Select
                  value={formData.emergencyContactRelation}
                  onValueChange={(value) =>
                    updateFormData("emergencyContactRelation", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Relationship to you" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spouse">Spouse</SelectItem>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="child">Child</SelectItem>
                    <SelectItem value="sibling">Sibling</SelectItem>
                    <SelectItem value="friend">Friend</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="allergies">Allergies</Label>
                <Textarea
                  id="allergies"
                  value={formData.allergies}
                  onChange={(e) => updateFormData("allergies", e.target.value)}
                  placeholder="List any known allergies (medications, foods, etc.)"
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="medications">Current Medications</Label>
                <Textarea
                  id="medications"
                  value={formData.medications}
                  onChange={(e) =>
                    updateFormData("medications", e.target.value)
                  }
                  placeholder="List current medications and dosages"
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="medicalHistory">Medical History</Label>
                <Textarea
                  id="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={(e) =>
                    updateFormData("medicalHistory", e.target.value)
                  }
                  placeholder="Relevant medical history, surgeries, chronic conditions"
                  rows={3}
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <FileText className="h-12 w-12 mx-auto text-green-600 mb-4" />
              <h2 className="text-2xl font-bold">Insurance Information</h2>
              <p className="text-gray-600">Your insurance details</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="insuranceProvider">Insurance Provider *</Label>
                <Input
                  id="insuranceProvider"
                  value={formData.insuranceProvider}
                  onChange={(e) =>
                    updateFormData("insuranceProvider", e.target.value)
                  }
                  placeholder="e.g., Blue Cross Blue Shield, Aetna, Cigna"
                />
              </div>
              <div>
                <Label htmlFor="insuranceNumber">Insurance Number *</Label>
                <Input
                  id="insuranceNumber"
                  value={formData.insuranceNumber}
                  onChange={(e) =>
                    updateFormData("insuranceNumber", e.target.value)
                  }
                  placeholder="Your insurance policy number"
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <MapPin className="h-12 w-12 mx-auto text-purple-600 mb-4" />
              <h2 className="text-2xl font-bold">Address Information</h2>
              <p className="text-gray-600">Where can we reach you?</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => updateFormData("address", e.target.value)}
                  placeholder="Enter your street address"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => updateFormData("city", e.target.value)}
                    placeholder="City"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => updateFormData("state", e.target.value)}
                    placeholder="State"
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => updateFormData("zipCode", e.target.value)}
                    placeholder="ZIP Code"
                  />
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">
                Registration Summary
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <strong>Name:</strong> {formData.firstName}{" "}
                  {formData.lastName}
                </div>
                <div>
                  <strong>Email:</strong> {formData.email}
                </div>
                <div>
                  <strong>Phone:</strong> {formData.phone}
                </div>
                <div>
                  <strong>Blood Type:</strong> {formData.bloodType}
                </div>
                <div>
                  <strong>Insurance:</strong> {formData.insuranceProvider}
                </div>
                <div>
                  <strong>Emergency Contact:</strong>{" "}
                  {formData.emergencyContactName}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Patient Registration
          </h1>
          <p className="text-gray-600">
            Join MediSync to manage your health records and appointments
          </p>
          {/* Quick Test Button */}
          <Button
            onClick={fillDummyData}
            variant="outline"
            className="mt-4 bg-yellow-50 border-yellow-300 text-yellow-800 hover:bg-yellow-100"
          >
            <TestTube className="h-4 w-4 mr-2" />
            Fill Dummy Data (Testing)
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {Array.from({ length: totalSteps }, (_, i) => {
              const stepNumber = i + 1;
              const isCompleted = stepNumber < currentStep;
              const isCurrent = stepNumber === currentStep;

              return (
                <div key={stepNumber} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                      isCompleted
                        ? "bg-blue-600 text-white"
                        : isCurrent
                        ? "bg-blue-100 text-blue-600 border-2 border-blue-600"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      stepNumber
                    )}
                  </div>
                  {stepNumber < totalSteps && (
                    <div
                      className={`w-16 h-1 mx-2 ${
                        isCompleted ? "bg-blue-600" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <div className="text-center">
            <Badge variant="outline" className="text-sm">
              Step {currentStep} of {totalSteps}
            </Badge>
          </div>
        </div>

        {/* Form Content */}
        <div className="mb-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-center">
                Step {currentStep}:{" "}
                {currentStep === 1
                  ? "Personal Information"
                  : currentStep === 2
                  ? "Profile Photo"
                  : currentStep === 3
                  ? "Medical Information"
                  : currentStep === 4
                  ? "Insurance Information"
                  : "Address & Review"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {getStepContent()}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t">
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
                    disabled={!validateStep(currentStep)}
                    className="flex items-center gap-2"
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={
                      isSubmitting ||
                      ![1, 3, 4].every((step) => validateStep(step))
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
        <div className="text-center text-sm text-gray-500">
          <p>
            By registering, you agree to our Terms of Service and Privacy
            Policy.
          </p>
          <p className="mt-2">
            Need help? Contact our support team at support@medisync.com
          </p>
        </div>
      </div>
    </div>
  );
}
