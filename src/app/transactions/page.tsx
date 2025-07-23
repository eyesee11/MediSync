"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  Check,
  ArrowLeft,
  User,
  Phone,
  Mail,
  Shield,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

interface AppointmentDetails {
  date: string;
  time: string;
  type: "consultation" | "follow-up" | "emergency";
  symptoms: string;
  patientNotes: string;
}

interface PatientInfo {
  name: string;
  email: string;
  phone: string;
  emergencyContact: string;
  insuranceNumber?: string; // Optional field
  allergies: string;
  currentMedications: string;
}

interface PaymentInfo {
  method: "card" | "upi" | "netbanking" | "wallet";
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  upiId?: string;
  bankName?: string;
}

export default function TransactionsPage() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = React.useState(1);
  const [appointmentDetails, setAppointmentDetails] =
    React.useState<AppointmentDetails>({
      date: "",
      time: "",
      type: "consultation",
      symptoms: "",
      patientNotes: "",
    });
  const [patientInfo, setPatientInfo] = React.useState<PatientInfo>({
    name: "",
    email: "",
    phone: "",
    emergencyContact: "",
    insuranceNumber: "",
    allergies: "",
    currentMedications: "",
  });
  const [paymentInfo, setPaymentInfo] = React.useState<PaymentInfo>({
    method: "card",
  });
  const [isProcessing, setIsProcessing] = React.useState(false);

  // Sample doctor data - in a real app, this would come from route params or state
  const selectedDoctor = {
    name: "Dr. Priya Sharma",
    specialty: "Cardiologist",
    fee: 800,
    avatar: "/api/placeholder/400/400",
    avatarFallback: "PS",
    location: { address: "Apollo Hospital, Mumbai, Maharashtra" },
    experience: 15,
  };

  const handleAppointmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointmentDetails.date || !appointmentDetails.time) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please select a date and time for your appointment.",
      });
      return;
    }
    setCurrentStep(2);
  };

  const handlePatientInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientInfo.name || !patientInfo.email || !patientInfo.phone) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all required patient information.",
      });
      return;
    }
    setCurrentStep(3);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast({
      title: "Appointment Booked Successfully!",
      description: `Your appointment with ${selectedDoctor.name} has been confirmed.`,
    });

    setIsProcessing(false);
    setCurrentStep(4);
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute of [0, 30]) {
        const time = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split("T")[0];
  };

  return (
    <div className="min-h-screen space-y-8">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <Link href="/search">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Search
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Book Appointment
            </h1>
            <p className="text-muted-foreground">
              Complete your appointment booking with {selectedDoctor.name}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center">
        <div className="flex items-center space-x-4">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step < currentStep ? <Check className="h-4 w-4" /> : step}
              </div>
              {step < 4 && (
                <div
                  className={`w-12 h-1 ${
                    step < currentStep ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Doctor Information Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage
                src={selectedDoctor.avatar}
                alt={selectedDoctor.name}
              />
              <AvatarFallback>{selectedDoctor.avatarFallback}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-bold">{selectedDoctor.name}</h3>
              <p className="text-primary font-medium">
                {selectedDoctor.specialty}
              </p>
              <p className="text-sm text-muted-foreground">
                {selectedDoctor.experience} years experience
              </p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-2xl font-bold text-primary">
                ₹{selectedDoctor.fee}
              </p>
              <p className="text-sm text-muted-foreground">Consultation Fee</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Step 1: Appointment Details */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Appointment Details
            </CardTitle>
            <CardDescription>
              Select your preferred date, time, and provide additional
              information.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleAppointmentSubmit}>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="date">Preferred Date</Label>
                  <Input
                    id="date"
                    type="date"
                    min={getMinDate()}
                    max={getMaxDate()}
                    value={appointmentDetails.date}
                    onChange={(e) =>
                      setAppointmentDetails({
                        ...appointmentDetails,
                        date: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Preferred Time</Label>
                  <Select
                    value={appointmentDetails.time}
                    onValueChange={(value) =>
                      setAppointmentDetails({
                        ...appointmentDetails,
                        time: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {generateTimeSlots().map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Appointment Type</Label>
                <Select
                  value={appointmentDetails.type}
                  onValueChange={(value) =>
                    setAppointmentDetails({
                      ...appointmentDetails,
                      type: value as "consultation" | "follow-up" | "emergency",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consultation">
                      General Consultation
                    </SelectItem>
                    <SelectItem value="follow-up">Follow-up Visit</SelectItem>
                    <SelectItem value="emergency">
                      Emergency Consultation
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="symptoms">Symptoms/Reason for Visit</Label>
                <Textarea
                  id="symptoms"
                  placeholder="Please describe your symptoms or reason for the visit..."
                  value={appointmentDetails.symptoms}
                  onChange={(e) =>
                    setAppointmentDetails({
                      ...appointmentDetails,
                      symptoms: e.target.value,
                    })
                  }
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional information you'd like the doctor to know..."
                  value={appointmentDetails.patientNotes}
                  onChange={(e) =>
                    setAppointmentDetails({
                      ...appointmentDetails,
                      patientNotes: e.target.value,
                    })
                  }
                  rows={2}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="ml-auto">
                Continue to Patient Information
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {/* Step 2: Patient Information */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Patient Information
            </CardTitle>
            <CardDescription>
              Please provide your personal and medical information.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handlePatientInfoSubmit}>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={patientInfo.name}
                    onChange={(e) =>
                      setPatientInfo({ ...patientInfo, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={patientInfo.email}
                    onChange={(e) =>
                      setPatientInfo({ ...patientInfo, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={patientInfo.phone}
                    onChange={(e) =>
                      setPatientInfo({ ...patientInfo, phone: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergency">Emergency Contact</Label>
                  <Input
                    id="emergency"
                    type="tel"
                    value={patientInfo.emergencyContact}
                    onChange={(e) =>
                      setPatientInfo({
                        ...patientInfo,
                        emergencyContact: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="insurance" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Insurance Number (Optional)
                </Label>
                <Input
                  id="insurance"
                  placeholder="Enter your insurance number if applicable"
                  value={patientInfo.insuranceNumber}
                  onChange={(e) =>
                    setPatientInfo({
                      ...patientInfo,
                      insuranceNumber: e.target.value,
                    })
                  }
                />
                <p className="text-sm text-muted-foreground flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  Insurance verification is optional. You can proceed without
                  insurance details.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="allergies">Known Allergies</Label>
                <Textarea
                  id="allergies"
                  placeholder="List any known allergies or write 'None'"
                  value={patientInfo.allergies}
                  onChange={(e) =>
                    setPatientInfo({
                      ...patientInfo,
                      allergies: e.target.value,
                    })
                  }
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medications">Current Medications</Label>
                <Textarea
                  id="medications"
                  placeholder="List current medications or write 'None'"
                  value={patientInfo.currentMedications}
                  onChange={(e) =>
                    setPatientInfo({
                      ...patientInfo,
                      currentMedications: e.target.value,
                    })
                  }
                  rows={2}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(1)}
              >
                Back
              </Button>
              <Button type="submit">Continue to Payment</Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {/* Step 3: Payment Information */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Information
            </CardTitle>
            <CardDescription>
              Choose your payment method and complete the transaction.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handlePaymentSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { value: "card", label: "Credit/Debit Card" },
                    { value: "upi", label: "UPI" },
                    { value: "netbanking", label: "Net Banking" },
                    { value: "wallet", label: "Digital Wallet" },
                  ].map((method) => (
                    <div key={method.value}>
                      <input
                        type="radio"
                        id={method.value}
                        name="paymentMethod"
                        value={method.value}
                        checked={paymentInfo.method === method.value}
                        onChange={(e) =>
                          setPaymentInfo({
                            ...paymentInfo,
                            method: e.target.value as PaymentInfo["method"],
                          })
                        }
                        className="sr-only"
                      />
                      <Label
                        htmlFor={method.value}
                        className={`block p-4 border rounded-lg cursor-pointer text-center ${
                          paymentInfo.method === method.value
                            ? "border-primary bg-primary/5"
                            : "border-border"
                        }`}
                      >
                        {method.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {paymentInfo.method === "card" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={paymentInfo.cardNumber}
                      onChange={(e) =>
                        setPaymentInfo({
                          ...paymentInfo,
                          cardNumber: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        value={paymentInfo.expiryDate}
                        onChange={(e) =>
                          setPaymentInfo({
                            ...paymentInfo,
                            expiryDate: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={paymentInfo.cvv}
                        onChange={(e) =>
                          setPaymentInfo({
                            ...paymentInfo,
                            cvv: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentInfo.method === "upi" && (
                <div className="space-y-2">
                  <Label htmlFor="upiId">UPI ID</Label>
                  <Input
                    id="upiId"
                    placeholder="yourname@paytm"
                    value={paymentInfo.upiId}
                    onChange={(e) =>
                      setPaymentInfo({ ...paymentInfo, upiId: e.target.value })
                    }
                  />
                </div>
              )}

              {paymentInfo.method === "netbanking" && (
                <div className="space-y-2">
                  <Label htmlFor="bank">Select Bank</Label>
                  <Select
                    value={paymentInfo.bankName}
                    onValueChange={(value) =>
                      setPaymentInfo({ ...paymentInfo, bankName: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose your bank" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sbi">State Bank of India</SelectItem>
                      <SelectItem value="hdfc">HDFC Bank</SelectItem>
                      <SelectItem value="icici">ICICI Bank</SelectItem>
                      <SelectItem value="axis">Axis Bank</SelectItem>
                      <SelectItem value="kotak">Kotak Mahindra Bank</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="p-4 bg-muted rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Amount:</span>
                  <span className="text-2xl font-bold text-primary">
                    ₹{selectedDoctor.fee}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(2)}
              >
                Back
              </Button>
              <Button type="submit" disabled={isProcessing}>
                {isProcessing ? "Processing..." : `Pay ₹${selectedDoctor.fee}`}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {/* Step 4: Confirmation */}
      {currentStep === 4 && (
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Appointment Confirmed!</CardTitle>
            <CardDescription>
              Your appointment has been successfully booked. You will receive a
              confirmation email shortly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-6 bg-muted rounded-lg space-y-4">
              <h3 className="font-semibold text-lg">Appointment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Doctor</p>
                  <p className="font-medium">{selectedDoctor.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Specialty</p>
                  <p className="font-medium">{selectedDoctor.specialty}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p className="font-medium">{appointmentDetails.date}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Time</p>
                  <p className="font-medium">{appointmentDetails.time}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Type</p>
                  <p className="font-medium capitalize">
                    {appointmentDetails.type}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Fee Paid</p>
                  <p className="font-medium">₹{selectedDoctor.fee}</p>
                </div>
              </div>
              <div>
                <p className="text-muted-foreground">Location</p>
                <p className="font-medium">{selectedDoctor.location.address}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline">Go to Dashboard</Button>
            </Link>
            <Link href="/search">
              <Button>Book Another Appointment</Button>
            </Link>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
