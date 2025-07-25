"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "./auth-provider";
import { useRouter } from "next/navigation";
import { User, Stethoscope, Heart, TestTube } from "lucide-react";

interface TestAccount {
  name: string;
  role: 'patient' | 'doctor';
  registrationId: string;
  email: string;
  description: string;
}

const testAccounts: TestAccount[] = [
  {
    name: "John Smith",
    role: "patient",
    registrationId: "P-MS-003",
    email: "john.smith@test.com",
    description: "Patient with cardiac monitoring data"
  },
  {
    name: "Sarah Johnson",
    role: "patient", 
    registrationId: "P-MS-004",
    email: "sarah.johnson@test.com",
    description: "Patient with diabetes management records"
  },
  {
    name: "Dr. Michael Brown",
    role: "doctor",
    registrationId: "D-MS-003", 
    email: "dr.michael@test.com",
    description: "Cardiologist with patient referrals"
  },
  {
    name: "Dr. Emily Davis",
    role: "doctor",
    registrationId: "D-MS-004",
    email: "dr.emily@test.com", 
    description: "General physician with consultation history"
  }
];

export function TestAccounts() {
  const { login } = useAuth();
  const router = useRouter();

  const handleTestLogin = (account: TestAccount) => {
    // Login with test account data
    login({
      name: account.name,
      role: account.role,
      registrationId: account.registrationId
    });
    
    // Redirect to dashboard
    router.push('/dashboard');
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Demo Test Accounts
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Quick access to pre-configured test accounts with sample data for demonstration purposes.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {testAccounts.map((account, index) => (
              <Card key={index} className="border border-muted hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {account.role === 'doctor' ? (
                        <Stethoscope className="h-5 w-5 text-blue-600" />
                      ) : (
                        <Heart className="h-5 w-5 text-green-600" />
                      )}
                      <div>
                        <h3 className="font-semibold text-sm">{account.name}</h3>
                        <p className="text-xs text-muted-foreground">{account.email}</p>
                      </div>
                    </div>
                    <Badge variant={account.role === 'doctor' ? 'default' : 'secondary'} className="text-xs">
                      {account.role.charAt(0).toUpperCase() + account.role.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-xs text-muted-foreground mb-1">Registration ID</p>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {account.registrationId}
                    </code>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-3">
                    {account.description}
                  </p>
                  
                  <Button 
                    onClick={() => handleTestLogin(account)}
                    className="w-full"
                    size="sm"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Login as {account.role === 'doctor' ? 'Doctor' : 'Patient'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2 text-sm">Test Account Features:</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Pre-populated health metrics and consultation history</li>
              <li>• Sample referral networks and appointment data</li> 
              <li>• Demonstration of role-based access controls</li>
              <li>• Registration ID system showcase</li>
              <li>• Document access request system between doctors and patients</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
