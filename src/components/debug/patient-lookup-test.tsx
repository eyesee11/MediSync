"use client";

import React, { useState } from 'react';
import { findPatientById, searchPatients } from "@/lib/patient-lookup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PatientLookupTest() {
  const [testId, setTestId] = useState("");
  const [result, setResult] = useState<any>(null);

  const testLookup = () => {
    console.log("Testing lookup for:", testId);
    const patient = findPatientById(testId);
    console.log("Result:", patient);
    setResult(patient);
  };

  const testSearch = () => {
    console.log("Testing search for:", testId);
    const patients = searchPatients(testId);
    console.log("Search results:", patients);
    setResult(patients);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Patient Lookup Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          value={testId}
          onChange={(e) => setTestId(e.target.value)}
          placeholder="Enter patient ID (P-MS-001)"
        />
        <div className="flex gap-2">
          <Button onClick={testLookup}>Test Exact Match</Button>
          <Button onClick={testSearch} variant="outline">Test Search</Button>
        </div>
        {result && (
          <div className="p-3 bg-gray-100 rounded">
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
