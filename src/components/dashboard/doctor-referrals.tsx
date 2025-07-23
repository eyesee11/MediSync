"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  Stethoscope,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Download,
  Eye,
  MessageSquare,
  Calendar,
  Phone,
  MapPin,
  Heart,
  Activity,
} from "lucide-react";

// Mock data for incoming referrals
const incomingReferrals = [
  {
    id: 1,
    patientName: "Priya Sharma",
    age: 34,
    gender: "Female",
    patientId: "PT001",
    referredBy: "Dr. Meera Singh",
    referringHospital: "AIIMS Delhi",
    referringSpecialty: "General Medicine",
    date: "2024-07-18",
    urgency: "high",
    reason: "Chest pain with irregular heartbeat",
    symptoms: "Chest discomfort, palpitations, shortness of breath",
    medicalHistory: "Hypertension, family history of cardiac issues",
    currentMedications: "Amlodipine 5mg, Metoprolol 25mg",
    vitals: {
      bp: "145/90",
      hr: "95",
      temp: "98.6°F",
      spo2: "97%",
    },
    labResults: "ECG shows irregular rhythm, Troponin levels elevated",
    documents: [
      { name: "ECG Report", type: "pdf", size: "2.3 MB" },
      { name: "Lab Results", type: "pdf", size: "1.8 MB" },
      { name: "Chest X-Ray", type: "jpg", size: "5.2 MB" },
    ],
    insuranceInfo: {
      provider: "Star Health Insurance",
      policyNumber: "SH123456789",
      coverage: "₹5,00,000",
    },
    contactInfo: {
      phone: "+91 98765 43210",
      email: "priya.sharma@gmail.com",
      address: "789 MG Road, Mumbai, Maharashtra 400001",
      emergencyContact: "Rajesh Sharma (+91 98765 43211)",
    },
    status: "pending",
    priority: "high",
  },
  {
    id: 2,
    patientName: "Amit Kumar",
    age: 45,
    gender: "Male",
    patientId: "PT002",
    referredBy: "Dr. Rajesh Verma",
    referringHospital: "Fortis Hospital Gurgaon",
    referringSpecialty: "Orthopedics",
    date: "2024-07-17",
    urgency: "medium",
    reason: "Post-surgical cardiac evaluation",
    symptoms: "Mild chest discomfort post knee surgery",
    medicalHistory: "Recent knee replacement surgery, diabetes",
    currentMedications: "Insulin, Pain medications",
    vitals: {
      bp: "130/85",
      hr: "78",
      temp: "98.2°F",
      spo2: "98%",
    },
    labResults: "Pre-operative cardiac assessment required",
    documents: [
      { name: "Surgery Report", type: "pdf", size: "3.1 MB" },
      { name: "Anesthesia Report", type: "pdf", size: "1.2 MB" },
    ],
    insuranceInfo: {
      provider: "HDFC ERGO Health",
      policyNumber: "HE987654321",
      coverage: "₹3,00,000",
    },
    contactInfo: {
      phone: "+91 87654 32109",
      email: "amit.kumar@gmail.com",
      address: "123 Sector 45, Gurgaon, Haryana 122001",
      emergencyContact: "Sunita Kumar (+91 87654 32110)",
    },
    status: "in-review",
    priority: "medium",
  },
  {
    id: 3,
    patientName: "Kavya Reddy",
    age: 28,
    gender: "Female",
    patientId: "PT003",
    referredBy: "Dr. Priya Gupta",
    referringHospital: "Max Hospital Saket",
    referringSpecialty: "Gynecology",
    date: "2024-07-16",
    urgency: "low",
    reason: "Pregnancy-related cardiac monitoring",
    symptoms: "Occasional palpitations during pregnancy",
    medicalHistory: "First pregnancy, no prior cardiac issues",
    currentMedications: "Prenatal vitamins, Folic acid",
    vitals: {
      bp: "115/75",
      hr: "85",
      temp: "98.4°F",
      spo2: "99%",
    },
    labResults: "Routine pregnancy labs normal",
    documents: [
      { name: "Prenatal Check Report", type: "pdf", size: "2.0 MB" },
      { name: "Ultrasound Report", type: "pdf", size: "4.5 MB" },
    ],
    insuranceInfo: {
      provider: "Bajaj Allianz Health",
      policyNumber: "BA456789123",
      coverage: "₹2,50,000",
    },
    contactInfo: {
      phone: "+91 76543 21098",
      email: "kavya.reddy@gmail.com",
      address: "456 Jubilee Hills, Hyderabad, Telangana 500033",
      emergencyContact: "Ravi Reddy (+91 76543 21099)",
    },
    status: "scheduled",
    priority: "low",
  },
];

// Mock data for referral analytics
const referralAnalytics = [
  { month: "Jan", received: 12, accepted: 10, completed: 8 },
  { month: "Feb", received: 15, accepted: 13, completed: 11 },
  { month: "Mar", received: 18, accepted: 16, completed: 14 },
  { month: "Apr", received: 22, accepted: 20, completed: 18 },
  { month: "May", received: 25, accepted: 23, completed: 20 },
  { month: "Jun", received: 28, accepted: 26, completed: 24 },
];

interface DoctorReferralsProps {
  doctor?: {
    name: string;
    specialty: string;
    hospital: string;
  };
}

export function DoctorReferrals({ doctor }: DoctorReferralsProps) {
  const [selectedReferral, setSelectedReferral] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Default doctor data if none provided
  const doctorData = doctor || {
    name: "Dr. Arjun Patel",
    specialty: "Cardiology",
    hospital: "Apollo Hospital Delhi",
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "in-review":
        return "bg-blue-100 text-blue-800";
      case "scheduled":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredReferrals =
    statusFilter === "all"
      ? incomingReferrals
      : incomingReferrals.filter((ref) => ref.status === statusFilter);

  const handleStatusUpdate = (id: number, newStatus: string) => {
    console.log(`Updating referral ${id} to status: ${newStatus}`);
    // Here you would typically update the database
  };

  return (
    <div className="space-y-6 p-6">
      {/* Doctor Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src="https://placehold.co/64x64/4F46E5/FFFFFF.png?text=Dr" />
              <AvatarFallback className="bg-blue-600 text-white">
                Dr
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{doctorData.name}</h1>
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Stethoscope className="w-4 h-4" />
                  {doctorData.specialty}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {doctorData.hospital}
                </div>
              </div>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              Active Doctor
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="referrals" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="referrals">Incoming Referrals</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="templates">Response Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="referrals" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Referrals
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {
                    incomingReferrals.filter((r) => r.status === "pending")
                      .length
                  }
                </div>
                <p className="text-xs text-muted-foreground">Awaiting review</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  High Priority
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {
                    incomingReferrals.filter((r) => r.priority === "high")
                      .length
                  }
                </div>
                <p className="text-xs text-muted-foreground">Urgent cases</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  This Month
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">28</div>
                <p className="text-xs text-muted-foreground">Total referrals</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Acceptance Rate
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">93%</div>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Referral Queue</CardTitle>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Referrals</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-review">In Review</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredReferrals.map((referral) => (
                  <Card
                    key={referral.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <Avatar className="w-12 h-12">
                              <AvatarFallback className="bg-green-600 text-white">
                                {referral.patientName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-lg">
                                {referral.patientName}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {referral.age} years • {referral.gender} • ID:{" "}
                                {referral.patientId}
                              </p>
                            </div>
                            <div className="flex gap-2 ml-auto">
                              <Badge
                                className={getPriorityColor(referral.priority)}
                              >
                                {referral.priority.toUpperCase()} PRIORITY
                              </Badge>
                              <Badge
                                variant="outline"
                                className={getStatusColor(referral.status)}
                              >
                                {referral.status
                                  .replace("-", " ")
                                  .toUpperCase()}
                              </Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">
                                Referred By:
                              </p>
                              <p className="text-sm font-semibold">
                                {referral.referredBy}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {referral.referringSpecialty}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">
                                Date:
                              </p>
                              <p className="text-sm">{referral.date}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">
                                Insurance:
                              </p>
                              <p className="text-sm">
                                {referral.insuranceInfo.provider}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Coverage: {referral.insuranceInfo.coverage}
                              </p>
                            </div>
                          </div>

                          <div className="mb-4">
                            <p className="text-sm font-medium text-muted-foreground">
                              Reason for Referral:
                            </p>
                            <p className="text-sm">{referral.reason}</p>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">
                                BP:
                              </p>
                              <p className="text-sm font-semibold">
                                {referral.vitals.bp}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">
                                HR:
                              </p>
                              <p className="text-sm font-semibold">
                                {referral.vitals.hr}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">
                                Temp:
                              </p>
                              <p className="text-sm font-semibold">
                                {referral.vitals.temp}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">
                                SpO2:
                              </p>
                              <p className="text-sm font-semibold">
                                {referral.vitals.spo2}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {referral.documents.map((doc, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="flex items-center gap-1"
                              >
                                <FileText className="w-3 h-3" />
                                {doc.name} ({doc.size})
                              </Badge>
                            ))}
                          </div>

                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Eye className="w-4 h-4 mr-1" />
                                  View Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>
                                    Patient Details - {referral.patientName}
                                  </DialogTitle>
                                  <DialogDescription>
                                    Complete referral information and medical
                                    history
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-6">
                                  {/* Patient Info */}
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">
                                        Patient Information
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label>Contact Information</Label>
                                          <div className="space-y-1 text-sm">
                                            <p>
                                              <Phone className="w-4 h-4 inline mr-2" />
                                              {referral.contactInfo.phone}
                                            </p>
                                            <p>
                                              <MessageSquare className="w-4 h-4 inline mr-2" />
                                              {referral.contactInfo.email}
                                            </p>
                                            <p>
                                              <MapPin className="w-4 h-4 inline mr-2" />
                                              {referral.contactInfo.address}
                                            </p>
                                          </div>
                                        </div>
                                        <div>
                                          <Label>Emergency Contact</Label>
                                          <p className="text-sm">
                                            {
                                              referral.contactInfo
                                                .emergencyContact
                                            }
                                          </p>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>

                                  {/* Medical Information */}
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">
                                        Medical Information
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                      <div>
                                        <Label>Symptoms</Label>
                                        <p className="text-sm">
                                          {referral.symptoms}
                                        </p>
                                      </div>
                                      <div>
                                        <Label>Medical History</Label>
                                        <p className="text-sm">
                                          {referral.medicalHistory}
                                        </p>
                                      </div>
                                      <div>
                                        <Label>Current Medications</Label>
                                        <p className="text-sm">
                                          {referral.currentMedications}
                                        </p>
                                      </div>
                                      <div>
                                        <Label>Lab Results</Label>
                                        <p className="text-sm">
                                          {referral.labResults}
                                        </p>
                                      </div>
                                    </CardContent>
                                  </Card>

                                  {/* Documents */}
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">
                                        Documents
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {referral.documents.map(
                                          (doc, index) => (
                                            <div
                                              key={index}
                                              className="flex items-center justify-between p-3 border rounded"
                                            >
                                              <div className="flex items-center gap-2">
                                                <FileText className="w-5 h-5" />
                                                <div>
                                                  <p className="font-medium">
                                                    {doc.name}
                                                  </p>
                                                  <p className="text-sm text-muted-foreground">
                                                    {doc.type.toUpperCase()} •{" "}
                                                    {doc.size}
                                                  </p>
                                                </div>
                                              </div>
                                              <Button
                                                variant="outline"
                                                size="sm"
                                              >
                                                <Download className="w-4 h-4" />
                                              </Button>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>
                              </DialogContent>
                            </Dialog>

                            <Select
                              onValueChange={(value) =>
                                handleStatusUpdate(referral.id, value)
                              }
                            >
                              <SelectTrigger className="w-40">
                                <SelectValue placeholder="Update Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="in-review">
                                  In Review
                                </SelectItem>
                                <SelectItem value="scheduled">
                                  Schedule
                                </SelectItem>
                                <SelectItem value="completed">
                                  Complete
                                </SelectItem>
                              </SelectContent>
                            </Select>

                            <Button size="sm">
                              <MessageSquare className="w-4 h-4 mr-1" />
                              Respond
                            </Button>
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

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Referral Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={referralAnalytics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="received"
                    stroke="#8884d8"
                    strokeWidth={2}
                    name="Referrals Received"
                  />
                  <Line
                    type="monotone"
                    dataKey="accepted"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    name="Referrals Accepted"
                  />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    stroke="#ffc658"
                    strokeWidth={2}
                    name="Referrals Completed"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-6">
          {/* Pending Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Pending Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Mock appointment data - in a real app, this would come from state management */}
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>AS</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">Ajay Singh</p>
                          <p className="text-sm text-muted-foreground">
                            Patient ID: PAT001
                          </p>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>📅 Tomorrow, 2:00 PM</p>
                        <p>💰 ₹800 - General Consultation</p>
                        <p>📝 Symptoms: Chest pain, shortness of breath</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Reschedule
                      </Button>
                      <Button size="sm">Accept</Button>
                      <Button size="sm" variant="destructive">
                        Decline
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No more pending appointments</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Today's Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Today's Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">9:00 AM - 9:30 AM</p>
                    <p className="text-sm text-muted-foreground">Available</p>
                  </div>
                  <Badge variant="secondary">Free</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-primary/5 border border-primary/20 rounded-lg">
                  <div>
                    <p className="font-medium">10:00 AM - 10:30 AM</p>
                    <p className="text-sm text-muted-foreground">
                      Priya Sharma - Follow-up
                    </p>
                  </div>
                  <Badge>Confirmed</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">11:00 AM - 11:30 AM</p>
                    <p className="text-sm text-muted-foreground">Available</p>
                  </div>
                  <Badge variant="secondary">Free</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Response Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4">
                  <Button
                    variant="outline"
                    className="text-left justify-start h-auto p-4"
                  >
                    <div>
                      <p className="font-medium">Accept Referral</p>
                      <p className="text-sm text-muted-foreground">
                        Standard acceptance with appointment scheduling
                      </p>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="text-left justify-start h-auto p-4"
                  >
                    <div>
                      <p className="font-medium">
                        Request Additional Information
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Ask for more tests or documentation
                      </p>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="text-left justify-start h-auto p-4"
                  >
                    <div>
                      <p className="font-medium">Refer to Another Specialist</p>
                      <p className="text-sm text-muted-foreground">
                        Redirect to more appropriate specialist
                      </p>
                    </div>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
