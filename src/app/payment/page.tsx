"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Wallet,
  CreditCard,
  Shield,
  Clock,
  CheckCircle,
  ArrowLeft,
  User,
  Calendar,
  MapPin,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

interface DoctorInfo {
  name: string;
  specialty: string;
  fee: number;
  avatar: string;
  location: string;
  availableSlots: string[];
}

export default function PaymentSelectionPage() {
  const { toast } = useToast();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "metamask" | "traditional" | null
  >(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [account, setAccount] = useState("");

  // Mock doctor data - in real app, this would come from route params or state
  const doctorInfo: DoctorInfo = {
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    fee: 250,
    avatar: "/api/placeholder/120/120",
    location: "Heart Care Center, Downtown",
    availableSlots: ["2:00 PM", "3:30 PM", "4:00 PM"],
  };

  const connectMetaMask = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletConnected(true);
        setAccount(accounts[0]);
        toast({
          title: "Wallet Connected",
          description: "MetaMask wallet connected successfully",
        });
      } catch (error) {
        console.error("Error connecting wallet:", error);
        toast({
          variant: "destructive",
          title: "Connection Failed",
          description: "Failed to connect to MetaMask wallet",
        });
      }
    } else {
      toast({
        variant: "destructive",
        title: "MetaMask Not Found",
        description: "Please install MetaMask browser extension",
      });
    }
  };

  const proceedWithMetaMask = () => {
    if (!walletConnected) {
      connectMetaMask();
      return;
    }

    // Redirect to blockchain payment
    window.location.href = `/payment/blockchain?doctor=${encodeURIComponent(
      doctorInfo.name
    )}&fee=${doctorInfo.fee}`;
  };

  const proceedWithTraditional = () => {
    // Redirect to traditional payment portal
    window.location.href = `/payment/traditional?doctor=${encodeURIComponent(
      doctorInfo.name
    )}&fee=${doctorInfo.fee}`;
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Link href="/search">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Search
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Choose Payment Method</h1>
            <p className="text-muted-foreground">
              Select how you'd like to pay for your appointment
            </p>
          </div>
        </div>
      </div>

      {/* Doctor Summary */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Appointment Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={doctorInfo.avatar} alt={doctorInfo.name} />
              <AvatarFallback>
                {doctorInfo.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-bold text-lg">{doctorInfo.name}</h3>
              <p className="text-primary font-medium">{doctorInfo.specialty}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {doctorInfo.location}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />₹{doctorInfo.fee}{" "}
                  Consultation Fee
                </span>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Calendar className="mr-1 h-3 w-3" />
              Available Today
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method Selection */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* MetaMask Payment */}
        <Card
          className={`cursor-pointer transition-all ${
            selectedPaymentMethod === "metamask" ? "ring-2 ring-primary" : ""
          }`}
        >
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-bold">Blockchain Payment</h3>
                  <p className="text-sm text-muted-foreground">
                    Pay with MetaMask
                  </p>
                </div>
              </div>
              {walletConnected && (
                <Badge
                  variant="default"
                  className="bg-green-100 text-green-800"
                >
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Connected
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-green-600" />
                <span>Secure blockchain transaction</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-blue-600" />
                <span>Instant confirmation</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-purple-600" />
                <span>Transparent and immutable</span>
              </div>
            </div>

            {walletConnected && (
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  Connected Account:
                </p>
                <p className="font-mono text-sm break-all">{account}</p>
              </div>
            )}

            <Button
              className="w-full"
              onClick={proceedWithMetaMask}
              variant={
                selectedPaymentMethod === "metamask" ? "default" : "outline"
              }
            >
              {walletConnected
                ? "Pay with MetaMask"
                : "Connect & Pay with MetaMask"}
            </Button>
          </CardContent>
        </Card>

        {/* Traditional Payment */}
        <Card
          className={`cursor-pointer transition-all ${
            selectedPaymentMethod === "traditional" ? "ring-2 ring-primary" : ""
          }`}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold">Traditional Payment</h3>
                <p className="text-sm text-muted-foreground">
                  Card, UPI & Net Banking
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CreditCard className="h-4 w-4 text-blue-600" />
                <span>Credit/Debit Cards</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span>UPI & Digital Wallets</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-purple-600" />
                <span>Net Banking</span>
              </div>
            </div>

            <Alert>
              <AlertDescription className="text-sm">
                Secure payment gateway with industry-standard encryption
              </AlertDescription>
            </Alert>

            <Button
              className="w-full"
              onClick={proceedWithTraditional}
              variant={
                selectedPaymentMethod === "traditional" ? "default" : "outline"
              }
            >
              Proceed to Payment Gateway
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Security Notice */}
      <Alert className="mb-6">
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Secure Payment:</strong> All payment methods are secured with
          end-to-end encryption. Your financial information is protected and
          never stored on our servers.
        </AlertDescription>
      </Alert>

      {/* Appointment Details */}
      <Card>
        <CardHeader>
          <CardTitle>Available Time Slots</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {doctorInfo.availableSlots.map((slot, index) => (
              <Button key={index} variant="outline" className="justify-center">
                <Clock className="mr-2 h-4 w-4" />
                {slot}
              </Button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Select your preferred time slot after completing payment
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
