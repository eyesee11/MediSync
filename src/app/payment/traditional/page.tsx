"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  CreditCard,
  CheckCircle,
  ArrowLeft,
  Shield,
  Smartphone,
  Building,
  Clock,
  User,
  Calendar,
  Loader2,
} from "lucide-react";
import Link from "next/link";

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

export default function TraditionalPaymentPage() {
  const { toast } = useToast();
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "success" | "failed"
  >("idle");
  const [doctorName, setDoctorName] = useState("");
  const [fee, setFee] = useState(0);
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    upiId: "",
    bankAccount: "",
    ifscCode: "",
  });

  const paymentMethods: PaymentMethod[] = [
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: <CreditCard className="h-5 w-5" />,
      description: "Visa, Mastercard, RuPay accepted",
    },
    {
      id: "upi",
      name: "UPI Payment",
      icon: <Smartphone className="h-5 w-5" />,
      description: "Google Pay, PhonePe, Paytm, BHIM",
    },
    {
      id: "netbanking",
      name: "Net Banking",
      icon: <Building className="h-5 w-5" />,
      description: "All major banks supported",
    },
  ];

  useEffect(() => {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    setDoctorName(urlParams.get("doctor") || "Dr. Sarah Johnson");
    setFee(parseInt(urlParams.get("fee") || "250"));
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const processPayment = async () => {
    if (!selectedMethod) {
      toast({
        variant: "destructive",
        title: "Payment Method Required",
        description: "Please select a payment method",
      });
      return;
    }

    // Basic validation
    if (selectedMethod === "card") {
      if (
        !formData.cardNumber ||
        !formData.expiryDate ||
        !formData.cvv ||
        !formData.cardholderName
      ) {
        toast({
          variant: "destructive",
          title: "Incomplete Information",
          description: "Please fill in all card details",
        });
        return;
      }
    }

    if (selectedMethod === "upi" && !formData.upiId) {
      toast({
        variant: "destructive",
        title: "UPI ID Required",
        description: "Please enter your UPI ID",
      });
      return;
    }

    setPaymentStatus("processing");

    // Simulate payment processing
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulate API call

      setPaymentStatus("success");
      toast({
        title: "Payment Successful!",
        description: "Your appointment has been booked successfully",
      });

      // Store appointment in traditional database
      await storeAppointment();
    } catch (error) {
      setPaymentStatus("failed");
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description: "Please check your details and try again",
      });
    }
  };

  const storeAppointment = async () => {
    // This would integrate with your backend API
    console.log("Storing appointment:", {
      doctor: doctorName,
      fee: fee,
      paymentMethod: selectedMethod,
      timestamp: new Date().toISOString(),
    });
  };

  const renderPaymentForm = () => {
    switch (selectedMethod) {
      case "card":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChange={(e) =>
                  handleInputChange("cardNumber", e.target.value)
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={formData.expiryDate}
                  onChange={(e) =>
                    handleInputChange("expiryDate", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={formData.cvv}
                  onChange={(e) => handleInputChange("cvv", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardholderName">Cardholder Name</Label>
              <Input
                id="cardholderName"
                placeholder="John Doe"
                value={formData.cardholderName}
                onChange={(e) =>
                  handleInputChange("cardholderName", e.target.value)
                }
              />
            </div>
          </div>
        );

      case "upi":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="upiId">UPI ID</Label>
              <Input
                id="upiId"
                placeholder="yourname@paytm"
                value={formData.upiId}
                onChange={(e) => handleInputChange("upiId", e.target.value)}
              />
            </div>
            <Alert>
              <Smartphone className="h-4 w-4" />
              <AlertDescription>
                You'll be redirected to your UPI app to complete the payment
              </AlertDescription>
            </Alert>
          </div>
        );

      case "netbanking":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bank">Select Your Bank</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose your bank" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sbi">State Bank of India</SelectItem>
                  <SelectItem value="hdfc">HDFC Bank</SelectItem>
                  <SelectItem value="icici">ICICI Bank</SelectItem>
                  <SelectItem value="axis">Axis Bank</SelectItem>
                  <SelectItem value="kotak">Kotak Mahindra Bank</SelectItem>
                  <SelectItem value="pnb">Punjab National Bank</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Alert>
              <Building className="h-4 w-4" />
              <AlertDescription>
                You'll be redirected to your bank's secure login page
              </AlertDescription>
            </Alert>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Link href="/payment">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Payment Gateway</h1>
            <p className="text-muted-foreground">
              Complete your appointment booking
            </p>
          </div>
        </div>
      </div>

      {/* Appointment Summary */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Appointment Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Doctor:</span>
            <span className="font-medium">{doctorName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Consultation Fee:</span>
            <span className="font-medium">₹{fee}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Platform Fee:</span>
            <span className="font-medium">₹25</span>
          </div>
          <div className="flex justify-between items-center font-bold text-lg border-t pt-2">
            <span>Total Amount:</span>
            <span>₹{fee + 25}</span>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method Selection */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Select Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedMethod === method.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => setSelectedMethod(method.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="text-primary">{method.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-medium">{method.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {method.description}
                    </p>
                  </div>
                  {selectedMethod === method.id && (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Form */}
      {selectedMethod && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
          </CardHeader>
          <CardContent>{renderPaymentForm()}</CardContent>
        </Card>
      )}

      {/* Security Notice */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium">Secure Payment</h4>
              <p className="text-sm text-muted-foreground">
                Your payment information is encrypted using industry-standard
                SSL technology. We never store your card details on our servers.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Button */}
      {selectedMethod && paymentStatus === "idle" && (
        <Card>
          <CardContent className="pt-6">
            <Button onClick={processPayment} className="w-full" size="lg">
              <CreditCard className="mr-2 h-5 w-5" />
              Pay ₹{fee + 25}
            </Button>
          </CardContent>
        </Card>
      )}

      {paymentStatus === "processing" && (
        <Card>
          <CardContent className="pt-6 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Processing Payment...</h3>
            <p className="text-muted-foreground">
              Please wait while we process your payment
            </p>
          </CardContent>
        </Card>
      )}

      {paymentStatus === "success" && (
        <Card>
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Payment Successful!</h3>
            <p className="text-muted-foreground mb-4">
              Your appointment has been booked successfully
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/dashboard">
                <Button>View Dashboard</Button>
              </Link>
              <Link href="/search">
                <Button variant="outline">Book Another Appointment</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {paymentStatus === "failed" && (
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Payment Failed</h3>
            <p className="text-muted-foreground mb-4">
              There was an issue processing your payment. Please try again.
            </p>
            <Button onClick={() => setPaymentStatus("idle")} className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
