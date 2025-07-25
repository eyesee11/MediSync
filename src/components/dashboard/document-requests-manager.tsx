"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDocumentAccess } from "@/contexts/document-access-context";
import { useAuth } from "@/components/auth/auth-provider";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  User, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Shield,
  Timer,
  Calendar
} from "lucide-react";

export function DocumentRequestsManager() {
  const { getRequestsForPatient, approveRequest, denyRequest } = useDocumentAccess();
  const { user } = useAuth();
  const { toast } = useToast();

  if (!user || user.role !== 'patient') return null;

  const requests = getRequestsForPatient(user.registrationId || user.name);
  const pendingRequests = requests.filter(req => req.status === 'pending');
  const processedRequests = requests.filter(req => req.status !== 'pending');

  const handleApprove = (requestId: string, doctorName: string) => {
    approveRequest(requestId);
    toast({
      title: "Request Approved",
      description: `${doctorName} now has access to your documents for 24 hours.`,
    });
  };

  const handleDeny = (requestId: string, doctorName: string) => {
    denyRequest(requestId);
    toast({
      title: "Request Denied",
      description: `Document access request from ${doctorName} has been denied.`,
    });
  };

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

  const getTimeRemaining = (expiryDate: Date) => {
    const now = new Date();
    const diff = expiryDate.getTime() - now.getTime();
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    } else {
      return `${minutes}m remaining`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <Card className="w-full border-yellow-200">
          <CardHeader className="bg-yellow-50">
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <Shield className="h-5 w-5" />
              Pending Document Access Requests
              <Badge variant="secondary">{pendingRequests.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {pendingRequests.map(request => (
              <div key={request.id} className="border-b last:border-b-0 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {request.doctorName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Doctor ID: {request.doctorId}
                    </p>
                  </div>
                  <Badge className={getStatusColor(request.status)}>
                    {getStatusIcon(request.status)}
                    Pending Review
                  </Badge>
                </div>
                
                <div className="mb-3">
                  <h4 className="text-sm font-medium mb-1">Reason for Request:</h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                    {request.reason}
                  </p>
                </div>
                
                <div className="mb-3">
                  <h4 className="text-sm font-medium mb-2">Requested Documents:</h4>
                  <div className="flex flex-wrap gap-1">
                    {request.documents.map(doc => (
                      <Badge key={doc} variant="outline" className="text-xs">
                        <FileText className="h-3 w-3 mr-1" />
                        {doc}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 inline mr-1" />
                    Requested: {request.requestDate.toLocaleDateString()} at {request.requestDate.toLocaleTimeString()}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeny(request.id, request.doctorName)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Deny
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleApprove(request.id, request.doctorName)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve (24h)
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Request History */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Document Access History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {processedRequests.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No processed requests yet.
            </p>
          ) : (
            <div className="space-y-4">
              {processedRequests.map(request => (
                <div key={request.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {request.doctorName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        ID: {request.doctorId}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(request.status)}>
                        {getStatusIcon(request.status)}
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </Badge>
                      {request.status === 'approved' && request.expiryDate && (
                        <div className="text-xs text-muted-foreground mt-1">
                          <Timer className="h-3 w-3 inline mr-1" />
                          {getTimeRemaining(request.expiryDate)}
                        </div>
                      )}
                    </div>
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
                    <div>Requested: {request.requestDate.toLocaleDateString()} {request.requestDate.toLocaleTimeString()}</div>
                    {request.approvalDate && (
                      <div>
                        {request.status === 'approved' ? 'Approved' : 'Responded'}: {request.approvalDate.toLocaleDateString()} {request.approvalDate.toLocaleTimeString()}
                      </div>
                    )}
                    {request.expiryDate && request.status === 'approved' && (
                      <div>Expires: {request.expiryDate.toLocaleDateString()} {request.expiryDate.toLocaleTimeString()}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
