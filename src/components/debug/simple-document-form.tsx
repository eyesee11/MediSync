"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { FileText, CheckCircle } from "lucide-react";

export function SimpleDocumentRequestForm() {
  const [patientId, setPatientId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [reason, setReason] = useState("");
  const { toast } = useToast();

  // Simple patient data (excluding Ayush as it's now in Firestore)
  const testPatients = [
    { id: "P-MS-003", name: "John Smith" },
    { id: "P-MS-004", name: "Sarah Johnson" }
  ];

  const handlePatientIdChange = async (value: string) => {
    setPatientId(value);
    
    // First try Firestore lookup using async findPatientById
    try {
      const { findPatientById } = await import('@/lib/patient-lookup');
      const firestorePatient = await findPatientById(value);
      
      if (firestorePatient) {
        setPatientName(firestorePatient.name);
        toast({
          title: "Patient Found (Firestore)",
          description: `Found: ${firestorePatient.name} (${firestorePatient.registrationId})`,
        });
        return;
      }
    } catch (error) {
      console.log("Firestore lookup failed, trying test patients:", error);
    }
    
    // Fall back to test patients
    const patient = testPatients.find(p => p.id.toUpperCase() === value.toUpperCase());
    if (patient) {
      setPatientName(patient.name);
      toast({
        title: "Patient Found (Test)",
        description: `Found: ${patient.name} (${patient.id})`,
      });
    } else {
      setPatientName("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Test Request Sent",
      description: `Request sent to ${patientName} (${patientId})`,
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Simple Document Request Form (Test Version)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="testPatientId">Patient ID</Label>
            <Input
              id="testPatientId"
              placeholder="Enter P-MS-001"
              value={patientId}
              onChange={(e) => handlePatientIdChange(e.target.value)}
              className={patientName ? "border-green-500" : ""}
            />
          </div>
          
          <div>
            <Label htmlFor="testPatientName">Patient Name</Label>
            <Input
              id="testPatientName"
              value={patientName}
              readOnly
              className={patientName ? "bg-green-50" : "bg-gray-50"}
            />
            {patientName && (
              <div className="flex items-center gap-2 mt-1">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600">Patient found!</span>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="testReason">Reason</Label>
            <Input
              id="testReason"
              placeholder="Test request"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full">
            Send Test Request
          </Button>
        </form>

        <div className="mt-4 p-3 bg-blue-50 rounded">
          <h4 className="font-medium">🧪 Test Instructions:</h4>
          <ol className="list-decimal list-inside text-sm mt-2 space-y-1">
            <li>Type "P-MS-001" for Firestore lookup (should find Ayush)</li>
            <li>Type "P-MS-003" for test data (should find John Smith)</li>
            <li>Green checkmark should appear when found</li>
            <li>Toast notification should show patient source</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
