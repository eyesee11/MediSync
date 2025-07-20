"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  User,
  CreditCard,
  FileText,
  AlertTriangle,
  Loader2,
  Search,
  RefreshCw
} from "lucide-react";

interface VerificationResult {
  status: "verified" | "failed" | "pending" | "not_found";
  message: string;
  details?: {
    name?: string;
    registrationDate?: string;
    specialty?: string;
    hospital?: string;
    licenseStatus?: string;
    insuranceProvider?: string;
    policyNumber?: string;
    expiryDate?: string;
    coverageAmount?: string;
  };
}

// Mock verification database
const mockHPRIDDatabase = {
  "MH123456789": {
    name: "Dr. Arjun Patel",
    registrationDate: "2018-06-15",
    specialty: "Cardiology",
    hospital: "Apollo Hospital Delhi",
    licenseStatus: "Active",
    state: "Maharashtra"
  },
  "DL987654321": {
    name: "Dr. Priya Sharma",
    registrationDate: "2020-03-22",
    specialty: "Dermatology",
    hospital: "Max Hospital Saket",
    licenseStatus: "Active",
    state: "Delhi"
  }
};

const mockInsuranceDatabase = {
  "POL001234567890": {
    name: "Ajay Singh",
    insuranceProvider: "Star Health Insurance",
    policyNumber: "POL001234567890",
    expiryDate: "2025-12-31",
    coverageAmount: "₹5,00,000",
    status: "Active"
  },
  "HDC987654321098": {
    name: "Priya Sharma",
    insuranceProvider: "HDFC ERGO Health",
    policyNumber: "HDC987654321098",
    expiryDate: "2025-08-15",
    coverageAmount: "₹10,00,000",
    status: "Active"
  }
};

export function VerificationSystem() {
  const { toast } = useToast();
  const [hpridInput, setHpridInput] = useState("");
  const [insuranceInput, setInsuranceInput] = useState("");
  const [hpridResult, setHpridResult] = useState<VerificationResult | null>(null);
  const [insuranceResult, setInsuranceResult] = useState<VerificationResult | null>(null);
  const [hpridLoading, setHpridLoading] = useState(false);
  const [insuranceLoading, setInsuranceLoading] = useState(false);

  const verifyHPRID = async () => {
    if (!hpridInput.trim()) {
      toast({
        variant: "destructive",
        title: "Invalid Input",
        description: "Please enter a valid HPRID number.",
      });
      return;
    }

    setHpridLoading(true);
    setHpridResult({ status: "pending", message: "Verifying with Medical Council..." });

    // Simulate API call delay
    setTimeout(() => {
      const doctor = mockHPRIDDatabase[hpridInput as keyof typeof mockHPRIDDatabase];
      
      if (doctor) {
        setHpridResult({
          status: "verified",
          message: "HPRID verified successfully!",
          details: doctor
        });
        toast({
          title: "Verification Successful",
          description: `Dr. ${doctor.name}'s credentials have been verified.`,
        });
      } else {
        setHpridResult({
          status: "not_found",
          message: "HPRID not found in our database. Please check the number and try again."
        });
        toast({
          variant: "destructive",
          title: "Verification Failed",
          description: "HPRID not found in the medical council database.",
        });
      }
      setHpridLoading(false);
    }, 2000);
  };

  const verifyInsurance = async () => {
    if (!insuranceInput.trim()) {
      toast({
        variant: "destructive",
        title: "Invalid Input",
        description: "Please enter a valid insurance policy number.",
      });
      return;
    }

    setInsuranceLoading(true);
    setInsuranceResult({ status: "pending", message: "Verifying with insurance provider..." });

    // Simulate API call delay
    setTimeout(() => {
      const policy = mockInsuranceDatabase[insuranceInput as keyof typeof mockInsuranceDatabase];
      
      if (policy) {
        // Check if policy is expired
        const expiryDate = new Date(policy.expiryDate);
        const now = new Date();
        
        if (expiryDate < now) {
          setInsuranceResult({
            status: "failed",
            message: "Insurance policy has expired.",
            details: policy
          });
          toast({
            variant: "destructive",
            title: "Policy Expired",
            description: "The insurance policy has expired. Please renew your policy.",
          });
        } else {
          setInsuranceResult({
            status: "verified",
            message: "Insurance policy verified successfully!",
            details: policy
          });
          toast({
            title: "Verification Successful",
            description: `${policy.name}'s insurance policy is active and verified.`,
          });
        }
      } else {
        setInsuranceResult({
          status: "not_found",
          message: "Insurance policy not found. Please check the policy number and try again."
        });
        toast({
          variant: "destructive",
          title: "Verification Failed",
          description: "Insurance policy not found in the provider database.",
        });
      }
      setInsuranceLoading(false);
    }, 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "pending":
        return <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />;
      case "not_found":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950";
      case "failed":
        return "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950";
      case "pending":
        return "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950";
      case "not_found":
        return "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950";
      default:
        return "";
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Healthcare Verification System</h1>
        <p className="text-muted-foreground">
          Verify HPRID credentials and insurance policies in real-time
        </p>
      </div>

      <Tabs defaultValue="hprid" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="hprid" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            HPRID Verification
          </TabsTrigger>
          <TabsTrigger value="insurance" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Insurance Verification
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hprid" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Health Professional Registration ID (HPRID) Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="hprid">HPRID Number</Label>
                  <Input
                    id="hprid"
                    placeholder="e.g., MH123456789"
                    value={hpridInput}
                    onChange={(e) => setHpridInput(e.target.value.toUpperCase())}
                    disabled={hpridLoading}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the 11-digit HPRID number (State code + 9 digits)
                  </p>
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={verifyHPRID} 
                    disabled={hpridLoading || !hpridInput.trim()}
                    className="flex items-center gap-2"
                  >
                    {hpridLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                    Verify
                  </Button>
                </div>
              </div>

              {/* Sample HPRID Numbers */}
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm font-medium mb-2">Sample HPRID Numbers for Testing:</p>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setHpridInput("MH123456789")}
                  >
                    MH123456789
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setHpridInput("DL987654321")}
                  >
                    DL987654321
                  </Button>
                </div>
              </div>

              {hpridResult && (
                <Card className={`${getStatusColor(hpridResult.status)}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      {getStatusIcon(hpridResult.status)}
                      <div className="flex-1">
                        <p className="font-medium">{hpridResult.message}</p>
                        {hpridResult.details && (
                          <div className="mt-3 space-y-2">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Name:</span> {hpridResult.details.name}
                              </div>
                              <div>
                                <span className="font-medium">Specialty:</span> {hpridResult.details.specialty}
                              </div>
                              <div>
                                <span className="font-medium">Hospital:</span> {hpridResult.details.hospital}
                              </div>
                              <div>
                                <span className="font-medium">License Status:</span>{" "}
                                <Badge variant="default" className="text-green-600">
                                  {hpridResult.details.licenseStatus}
                                </Badge>
                              </div>
                              <div>
                                <span className="font-medium">Registration Date:</span> {hpridResult.details.registrationDate}
                              </div>
                              <div>
                                <span className="font-medium">State:</span> {hpridResult.details.state}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insurance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Insurance Policy Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="insurance">Policy Number</Label>
                  <Input
                    id="insurance"
                    placeholder="e.g., POL001234567890"
                    value={insuranceInput}
                    onChange={(e) => setInsuranceInput(e.target.value.toUpperCase())}
                    disabled={insuranceLoading}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter your insurance policy number
                  </p>
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={verifyInsurance} 
                    disabled={insuranceLoading || !insuranceInput.trim()}
                    className="flex items-center gap-2"
                  >
                    {insuranceLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                    Verify
                  </Button>
                </div>
              </div>

              {/* Sample Policy Numbers */}
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm font-medium mb-2">Sample Policy Numbers for Testing:</p>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setInsuranceInput("POL001234567890")}
                  >
                    POL001234567890
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setInsuranceInput("HDC987654321098")}
                  >
                    HDC987654321098
                  </Button>
                </div>
              </div>

              {insuranceResult && (
                <Card className={`${getStatusColor(insuranceResult.status)}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      {getStatusIcon(insuranceResult.status)}
                      <div className="flex-1">
                        <p className="font-medium">{insuranceResult.message}</p>
                        {insuranceResult.details && (
                          <div className="mt-3 space-y-2">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Policy Holder:</span> {insuranceResult.details.name}
                              </div>
                              <div>
                                <span className="font-medium">Provider:</span> {insuranceResult.details.insuranceProvider}
                              </div>
                              <div>
                                <span className="font-medium">Policy Number:</span> {insuranceResult.details.policyNumber}
                              </div>
                              <div>
                                <span className="font-medium">Status:</span>{" "}
                                <Badge 
                                  variant="default" 
                                  className={insuranceResult.status === "verified" ? "text-green-600" : "text-red-600"}
                                >
                                  {insuranceResult.details.status || insuranceResult.status}
                                </Badge>
                              </div>
                              <div>
                                <span className="font-medium">Coverage Amount:</span> {insuranceResult.details.coverageAmount}
                              </div>
                              <div>
                                <span className="font-medium">Expiry Date:</span> {insuranceResult.details.expiryDate}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Quick Links
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start">
              <RefreshCw className="h-4 w-4 mr-2" />
              Renew Insurance Policy
            </Button>
            <Button variant="outline" className="justify-start">
              <User className="h-4 w-4 mr-2" />
              Update HPRID Information
            </Button>
            <Button variant="outline" className="justify-start">
              <Shield className="h-4 w-4 mr-2" />
              View Verification History
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
