"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFirebaseAuth } from "@/contexts/firebase-auth-context";
import { DocumentRequestsManager } from "@/components/dashboard/document-requests-manager";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Heart,
  Activity,
  TrendingUp,
  Calendar,
  User,
  Phone,
  MapPin,
  Stethoscope,
  ClipboardList,
  FileText,
  Users,
  AlertTriangle,
  Link2,
} from "lucide-react";

// Mock data for patient health metrics
const healthMetrics = [
  { date: "Jan", bloodPressure: 120, heartRate: 72, weight: 58 },
  { date: "Feb", bloodPressure: 118, heartRate: 75, weight: 57.5 },
  { date: "Mar", bloodPressure: 122, heartRate: 70, weight: 58.2 },
  { date: "Apr", bloodPressure: 115, heartRate: 73, weight: 57.8 },
  { date: "May", bloodPressure: 119, heartRate: 71, weight: 58.5 },
  { date: "Jun", bloodPressure: 116, heartRate: 74, weight: 58.1 },
];

// Mock data for doctor consultations and referrals
const consultationHistory = [
  {
    id: 1,
    date: "2024-06-15",
    doctor: "Dr. Arjun Patel",
    specialty: "Cardiology",
    hospital: "Apollo Hospital Delhi",
    diagnosis: "Routine Cardiac Checkup",
    prescription: "Continue current medications",
    followUp: "3 months",
    referredBy: "Dr. Meera Singh (General Physician)",
    notes:
      "Patient showing excellent cardiac health. Blood pressure well controlled.",
    cost: "₹2,500",
  },
  {
    id: 2,
    date: "2024-05-20",
    doctor: "Dr. Rajesh Kumar",
    specialty: "Orthopedics",
    hospital: "Fortis Hospital Gurgaon",
    diagnosis: "Lower Back Pain",
    prescription: "Physiotherapy, Pain relief medication",
    followUp: "2 weeks",
    referredBy: "Dr. Arjun Patel (Cardiology)",
    notes:
      "Recommended exercises and posture correction. MRI shows minor disc bulge.",
    cost: "₹3,200",
  },
  {
    id: 3,
    date: "2024-04-10",
    doctor: "Dr. Priya Gupta",
    specialty: "Dermatology",
    hospital: "Max Hospital Saket",
    diagnosis: "Skin Allergy",
    prescription: "Antihistamines, Topical cream",
    followUp: "1 month",
    referredBy: "Dr. Meera Singh (General Physician)",
    notes:
      "Allergic reaction to new skincare product. Prescribed gentle skincare routine.",
    cost: "₹1,800",
  },
  {
    id: 4,
    date: "2024-03-05",
    doctor: "Dr. Meera Singh",
    specialty: "General Physician",
    hospital: "AIIMS Delhi",
    diagnosis: "Annual Health Checkup",
    prescription: "Multivitamins, Continue healthy lifestyle",
    followUp: "1 year",
    referredBy: "Self-referral",
    notes: "Overall excellent health. Recommended vitamin D supplements.",
    cost: "₹1,500",
  },
];

// Mock data for referral network
const referralData = [
  { name: "Dr. Meera Singh", referrals: 3, specialty: "General Physician" },
  { name: "Dr. Arjun Patel", referrals: 2, specialty: "Cardiology" },
  { name: "Dr. Rajesh Kumar", referrals: 1, specialty: "Orthopedics" },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

interface PatientDashboardProps {
  patient?: {
    name: string;
    email: string;
    phone: string;
    bloodType: string;
    insuranceProvider: string;
    emergencyContact: string;
  };
}

export function PatientDashboard({ patient }: PatientDashboardProps) {
  const [selectedConsultation, setSelectedConsultation] = useState<
    number | null
  >(null);
  
  // Use Firebase auth to get real user data
  const { user: firebaseUser } = useFirebaseAuth();

  // Use real user data from Firebase if available, otherwise fall back to prop or default
  const patientData = firebaseUser || patient || {
    displayName: "Loading...",
    email: "loading@example.com",
    registrationId: "Loading...",
    role: "patient" as const,
  };

  // Helper function to safely get display name
  const getDisplayName = () => {
    if (firebaseUser?.displayName) return firebaseUser.displayName;
    if ('displayName' in patientData && patientData.displayName) return patientData.displayName;
    if ('name' in patientData && patientData.name) return patientData.name;
    if (patientData.email) return patientData.email.split('@')[0];
    return "User";
  };

  const displayName = getDisplayName();
  const userInitials = displayName.split(' ').map((name: string) => name[0]).join('').toUpperCase().slice(0, 2);

  // Helper functions to safely access properties
  const getPhotoURL = () => {
    if (firebaseUser?.photoURL) return firebaseUser.photoURL;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=059669&color=fff`;
  };

  const getRegistrationId = () => {
    if (firebaseUser?.registrationId) return firebaseUser.registrationId;
    if ('registrationId' in patientData && patientData.registrationId) return patientData.registrationId;
    return "Not assigned";
  };

  const getPhoneNumber = () => {
    if (firebaseUser?.phoneNumber) return firebaseUser.phoneNumber;
    if ('phone' in patientData && patientData.phone) return patientData.phone;
    if ('phoneNumber' in patientData && patientData.phoneNumber) return patientData.phoneNumber;
    return patientData.email;
  };

  const getVerificationStatus = () => {
    if (firebaseUser?.verified !== undefined) return firebaseUser.verified;
    return false;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Patient Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={getPhotoURL()} />
              <AvatarFallback className="bg-green-600 text-white">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{displayName}</h1>
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  ID: {getRegistrationId()}
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  {getPhoneNumber()}
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  {firebaseUser ? "Account Verified" : "Profile Loading"}
                </div>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700">
              {getVerificationStatus() ? "Verified Patient" : "Active Patient"}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="health-metrics">Health Metrics</TabsTrigger>
          <TabsTrigger value="consultations">Consultations</TabsTrigger>
          <TabsTrigger value="referral-network">Referral Network</TabsTrigger>
          <TabsTrigger value="document-requests">Document Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Consultations
                </CardTitle>
                <Stethoscope className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {consultationHistory.length}
                </div>
                <p className="text-xs text-muted-foreground">Last 6 months</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Cost
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹9,000</div>
                <p className="text-xs text-muted-foreground">This year</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Doctors Consulted
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
                <p className="text-xs text-muted-foreground">
                  Different specialists
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Next Appointment
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Sep 15</div>
                <p className="text-xs text-muted-foreground">Dr. Arjun Patel</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Consultations Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Consultations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {consultationHistory.slice(0, 3).map((consultation) => (
                  <div
                    key={consultation.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>
                          {consultation.doctor.split(" ")[1]?.[0] || "D"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{consultation.doctor}</div>
                        <div className="text-sm text-muted-foreground">
                          {consultation.specialty}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{consultation.date}</div>
                      <div className="text-sm text-muted-foreground">
                        {consultation.cost}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health-metrics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Health Trends Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={healthMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="bloodPressure"
                    stroke="#8884d8"
                    strokeWidth={2}
                    name="Blood Pressure (systolic)"
                  />
                  <Line
                    type="monotone"
                    dataKey="heartRate"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    name="Heart Rate (bpm)"
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#ffc658"
                    strokeWidth={2}
                    name="Weight (kg)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consultations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Consultation History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {consultationHistory.map((consultation) => (
                  <Card
                    key={consultation.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Avatar className="w-12 h-12">
                              <AvatarFallback className="bg-blue-600 text-white">
                                {consultation.doctor.split(" ")[1]?.[0] || "D"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold">
                                {consultation.doctor}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {consultation.specialty} •{" "}
                                {consultation.hospital}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                              <p className="text-sm font-medium">Date:</p>
                              <p className="text-sm text-muted-foreground">
                                {consultation.date}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Diagnosis:</p>
                              <p className="text-sm text-muted-foreground">
                                {consultation.diagnosis}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                Referred By:
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {consultation.referredBy}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Cost:</p>
                              <p className="text-sm font-semibold text-green-600">
                                {consultation.cost}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4">
                            <p className="text-sm font-medium">Prescription:</p>
                            <p className="text-sm text-muted-foreground">
                              {consultation.prescription}
                            </p>
                          </div>

                          <div className="mt-2">
                            <p className="text-sm font-medium">Notes:</p>
                            <p className="text-sm text-muted-foreground">
                              {consultation.notes}
                            </p>
                          </div>

                          <div className="mt-3">
                            <Badge variant="outline">
                              Follow-up: {consultation.followUp}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="referral-network" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Referral Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={referralData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(props: any) => `${props.name}: ${props.value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="referrals"
                    >
                      {referralData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Doctor Network</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {referralData.map((doctor, index) => (
                    <div
                      key={doctor.name}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback
                            style={{
                              backgroundColor: COLORS[index % COLORS.length],
                            }}
                          >
                            {doctor.name.split(" ")[1]?.[0] || "D"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{doctor.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {doctor.specialty}
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {doctor.referrals} referrals
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Referral Timeline & Cost Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={consultationHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value: any) => [`₹${value}`, "Cost"]} />
                  <Legend />
                  <Bar
                    dataKey={(item: any) =>
                      parseInt(item.cost.replace("₹", "").replace(",", ""))
                    }
                    fill="#8884d8"
                    name="Consultation Cost (₹)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="document-requests" className="space-y-6">
          <DocumentRequestsManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
