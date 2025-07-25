"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useDocumentAccess } from "@/contexts/document-access-context";
import { useAuth } from "@/components/auth/auth-provider";
import { useToast } from "@/hooks/use-toast";
import { findPatientById, searchPatients } from "@/lib/patient-lookup";
import { FileText, Send, User, Clock, CheckCircle, XCircle, AlertTriangle, Search } from "lucide-react";

interface DocumentRequestFormProps {
  onClose?: () => void;
}

export function DocumentRequestForm({ onClose }: DocumentRequestFormProps) {
  const [patientId, setPatientId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [reason, setReason] = useState("");
  const [documents, setDocuments] = useState<string[]>([]);
  const [newDocument, setNewDocument] = useState("");
  const [patientSearchResults, setPatientSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [patientFound, setPatientFound] = useState(false);

  const { createRequest } = useDocumentAccess();
  const { user } = useAuth();
  const { toast } = useToast();

  // Handle patient ID input and lookup
  const handlePatientIdChange = async (value: string) => {
    setPatientId(value);
    
    if (value.trim()) {
      // Try to find exact match first
      const exactMatch = await findPatientById(value.trim());
      if (exactMatch) {
        setPatientName(exactMatch.name);
        setPatientFound(true);
        setShowSearchResults(false);
        toast({
          title: "Patient Found",
          description: `Patient: ${exactMatch.name} (${exactMatch.registrationId})`,
        });
      } else {
        // Search for partial matches
        const searchResults = searchPatients(value);
        setPatientSearchResults(searchResults);
        setShowSearchResults(searchResults.length > 0);
        setPatientFound(false);
        if (searchResults.length === 0 && value.length > 2) {
          setPatientName("");
        }
      }
    } else {
      setPatientName("");
      setPatientFound(false);
      setShowSearchResults(false);
      setPatientSearchResults([]);
    }
  };

  // Handle selecting a patient from search results
  const handleSelectPatient = (patient: any) => {
    setPatientId(patient.registrationId);
    setPatientName(patient.name);
    setPatientFound(true);
    setShowSearchResults(false);
    toast({
      title: "Patient Selected",
      description: `Selected: ${patient.name} (${patient.registrationId})`,
    });
  };

  const documentTypes = [
    "Medical History",
    "Lab Reports",
    "X-Rays",
    "Prescription Records",
    "Consultation Notes",
    "Vaccination Records",
    "Allergy Information",
    "Surgical Records"
  ];

  const handleAddDocument = () => {
    if (newDocument && !documents.includes(newDocument)) {
      setDocuments([...documents, newDocument]);
      setNewDocument("");
    }
  };

  const handleRemoveDocument = (doc: string) => {
    setDocuments(documents.filter(d => d !== doc));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || user.role !== 'doctor') {
      toast({
        title: "Access Denied",
        description: "Only doctors can request document access.",
        variant: "destructive"
      });
      return;
    }

    if (!patientId || !patientName || !reason || documents.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and select at least one document type.",
        variant: "destructive"
      });
      return;
    }

    if (!patientFound) {
      toast({
        title: "Patient Not Found",
        description: "Please select a valid patient from the search results or enter a correct patient ID.",
        variant: "destructive"
      });
      return;
    }

    try {
      const request = createRequest(
        { id: user.registrationId || user.name, name: user.name },
        { id: patientId, name: patientName },
        reason,
        documents
      );

      toast({
        title: "Request Sent",
        description: `Document access request sent to ${patientName} (${patientId}). You will be notified when they respond.`,
      });

      // Reset form
      setPatientId("");
      setPatientName("");
      setReason("");
      setDocuments([]);
      setPatientFound(false);
      setShowSearchResults(false);
      
      if (onClose) onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send document access request. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Request Patient Document Access
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="relative">
              <Label htmlFor="patientId">Patient Registration ID</Label>
              <div className="relative">
                <Input
                  id="patientId"
                  placeholder="Enter Patient ID (e.g., P-MS-001) or search by name"
                  value={patientId}
                  onChange={async (e) => await handlePatientIdChange(e.target.value)}
                  required
                  className={patientFound ? "border-green-500 bg-green-50" : ""}
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              
              {/* Search Results Dropdown */}
              {showSearchResults && patientSearchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                  {patientSearchResults.map((patient, index) => (
                    <div
                      key={index}
                      onClick={() => handleSelectPatient(patient)}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{patient.name}</div>
                          <div className="text-sm text-gray-500">{patient.registrationId}</div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {patient.registrationId}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">{patient.description}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div>
              <Label htmlFor="patientName">Patient Name</Label>
              <Input
                id="patientName"
                placeholder="Patient name will be auto-filled"
                value={patientName}
                readOnly
                className={patientFound ? "border-green-500 bg-green-50" : "bg-gray-50"}
              />
              {patientFound && (
                <div className="flex items-center gap-2 mt-1">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">Patient verified</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="reason">Reason for Access Request</Label>
            <Textarea
              id="reason"
              placeholder="Please explain why you need access to the patient's documents..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              rows={3}
            />
          </div>

          <div>
            <Label>Requested Documents</Label>
            <div className="space-y-3">
              <div className="flex gap-2">
                <select
                  value={newDocument}
                  onChange={(e) => setNewDocument(e.target.value)}
                  className="flex-1 p-2 border rounded-md"
                >
                  <option value="">Select document type...</option>
                  {documentTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <Button
                  type="button"
                  onClick={handleAddDocument}
                  disabled={!newDocument}
                  variant="outline"
                >
                  Add
                </Button>
              </div>
              
              {documents.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {documents.map(doc => (
                    <Badge
                      key={doc}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {doc}
                      <button
                        type="button"
                        onClick={() => handleRemoveDocument(doc)}
                        className="ml-1 text-xs hover:text-red-600"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              <Send className="h-4 w-4 mr-2" />
              Send Request
            </Button>
            {onClose && (
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export function DocumentRequestsList() {
  const { getRequestsForDoctor } = useDocumentAccess();
  const { user } = useAuth();

  if (!user || user.role !== 'doctor') return null;

  const requests = getRequestsForDoctor(user.registrationId || user.name);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'denied':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'expired':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'denied':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          My Document Access Requests
        </CardTitle>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No document access requests yet.
          </p>
        ) : (
          <div className="space-y-4">
            {requests.map(request => (
              <div key={request.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {request.patientName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      ID: {request.patientId}
                    </p>
                  </div>
                  <Badge className={getStatusColor(request.status)}>
                    {getStatusIcon(request.status)}
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </Badge>
                </div>
                
                <p className="text-sm mb-2">{request.reason}</p>
                
                <div className="flex flex-wrap gap-1 mb-2">
                  {request.documents.map(doc => (
                    <Badge key={doc} variant="outline" className="text-xs">
                      {doc}
                    </Badge>
                  ))}
                </div>
                
                <div className="text-xs text-muted-foreground">
                  Requested: {request.requestDate.toLocaleDateString()} {request.requestDate.toLocaleTimeString()}
                  {request.expiryDate && request.status === 'approved' && (
                    <span className="ml-2">
                      Expires: {request.expiryDate.toLocaleDateString()} {request.expiryDate.toLocaleTimeString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
