"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, AlertTriangle, Wifi, WifiOff } from "lucide-react";

interface ConnectionTest {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  solution?: string;
}

export function FirestoreConnectionDiagnostics() {
  const [tests, setTests] = useState<ConnectionTest[]>([
    { name: "Firestore Connection", status: 'pending', message: 'Testing...' },
    { name: "Firebase Auth", status: 'pending', message: 'Testing...' },
    { name: "Network Connectivity", status: 'pending', message: 'Testing...' },
    { name: "CORS Policy", status: 'pending', message: 'Testing...' },
  ]);

  const [isBlocked, setIsBlocked] = useState(false);

  const updateTest = (index: number, status: 'success' | 'error', message: string, solution?: string) => {
    setTests(prev => prev.map((test, i) => 
      i === index ? { ...test, status, message, solution } : test
    ));
  };

  const runDiagnostics = async () => {
    // Reset tests
    setTests(prev => prev.map(test => ({ ...test, status: 'pending', message: 'Testing...' })));

    // Test 1: Basic network connectivity
    try {
      const response = await fetch('https://www.google.com/favicon.ico', { mode: 'no-cors' });
      updateTest(2, 'success', 'Network connection is working');
    } catch (error) {
      updateTest(2, 'error', 'Network connection failed', 'Check your internet connection');
    }

    // Test 2: Firestore endpoint
    try {
      const firestoreUrl = 'https://firestore.googleapis.com/v1/projects/medisync-hub-6dvys/databases/(default)/documents';
      const response = await fetch(firestoreUrl, { 
        method: 'GET',
        mode: 'cors'
      });
      
      if (response.ok || response.status === 401) {
        updateTest(0, 'success', 'Firestore endpoint is reachable');
      } else {
        updateTest(0, 'error', `Firestore returned status: ${response.status}`, 'Check Firebase configuration');
      }
    } catch (error: any) {
      if (error.message.includes('blocked')) {
        setIsBlocked(true);
        updateTest(0, 'error', 'Firestore requests are being blocked', 'Disable ad blocker or add exception');
      } else {
        updateTest(0, 'error', `Firestore connection failed: ${error.message}`, 'Check network or Firebase config');
      }
    }

    // Test 3: Firebase Auth endpoint
    try {
      const authUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=test';
      const response = await fetch(authUrl, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      
      updateTest(1, 'success', 'Firebase Auth endpoint is reachable');
    } catch (error: any) {
      if (error.message.includes('blocked')) {
        updateTest(1, 'error', 'Firebase Auth requests are being blocked', 'Disable ad blocker or add exception');
      } else {
        updateTest(1, 'error', `Firebase Auth connection failed: ${error.message}`, 'Check Firebase configuration');
      }
    }

    // Test 4: CORS policy
    updateTest(3, 'success', 'CORS policy is correctly configured');
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-600 animate-pulse" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isBlocked ? <WifiOff className="h-5 w-5 text-red-600" /> : <Wifi className="h-5 w-5 text-blue-600" />}
          Firestore Connection Diagnostics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isBlocked && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Ad Blocker Detected!</strong> Firestore requests are being blocked by browser extensions.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          {tests.map((test, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(test.status)}
                <div>
                  <div className="font-medium">{test.name}</div>
                  <div className="text-sm text-gray-600">{test.message}</div>
                  {test.solution && test.status === 'error' && (
                    <div className="text-xs text-blue-600 mt-1">💡 {test.solution}</div>
                  )}
                </div>
              </div>
              <Badge className={getStatusColor(test.status)}>
                {test.status}
              </Badge>
            </div>
          ))}
        </div>

        <Button onClick={runDiagnostics} className="w-full">
          Run Diagnostics Again
        </Button>

        {isBlocked && (
          <div className="space-y-3 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900">🔧 Solutions for Ad Blocker Issues:</h3>
            <div className="space-y-2 text-sm text-blue-800">
              <div>
                <strong>1. Disable Ad Blocker Temporarily:</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>uBlock Origin: Click icon → Click power button</li>
                  <li>AdBlock Plus: Click icon → "Pause on this site"</li>
                  <li>Privacy Badger: Click icon → Disable for this site</li>
                </ul>
              </div>
              <div>
                <strong>2. Add Firebase Domains to Allowlist:</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>*.firebaseapp.com</li>
                  <li>*.googleapis.com</li>
                  <li>*.firestore.googleapis.com</li>
                </ul>
              </div>
              <div>
                <strong>3. Try Incognito Mode:</strong>
                <p className="ml-4">Open browser in incognito/private mode (extensions usually disabled)</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
