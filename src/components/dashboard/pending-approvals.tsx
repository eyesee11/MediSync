"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDocumentAccess } from "@/contexts/document-access-context";
import { useAuth } from "@/components/auth/auth-provider";
import { Check, X, Clock, FileText, Upload, Eye } from "lucide-react";

export function PendingApprovalsSection() {
  const { getRequestsForPatient, approveRequest, denyRequest } = useDocumentAccess();
  const { user } = useAuth();

  if (!user || user.role !== 'patient') return null;

  const allRequests = getRequestsForPatient(user.registrationId || user.name);
  const pendingRequests = allRequests.filter(req => req.status === 'pending');

  if (pendingRequests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Pending Approvals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No pending access requests from doctors.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Pending Approvals
          <Badge variant="destructive" className="ml-auto">
            {pendingRequests.length} pending
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {pendingRequests.map((request) => (
          <div
            key={request.id}
            className="border rounded-lg p-4 space-y-3 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-blue-600 border-blue-600">
                    Dr. {request.doctorName}
                  </Badge>
                  <Badge variant="secondary">
                    ID: {request.doctorId}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Eye className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">
                    Wants to view your documents
                  </span>
                </div>
                {request.documents && request.documents.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span>Documents: {request.documents.join(', ')}</span>
                  </div>
                )}
                {request.reason && (
                  <div className="text-sm text-muted-foreground bg-white/50 dark:bg-black/20 p-2 rounded border-l-2 border-primary/30">
                    <strong>Reason:</strong> {request.reason}
                  </div>
                )}
              </div>
              <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                <Clock className="h-3 w-3 mr-1" />
                Pending
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Requested {request.requestDate.toLocaleString()}</span>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                onClick={() => approveRequest(request.id)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                <Check className="h-4 w-4 mr-1" />
                Approve Access
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => denyRequest(request.id)}
                className="flex-1"
              >
                <X className="h-4 w-4 mr-1" />
                Deny
              </Button>
            </div>

            <div className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
              <strong>Note:</strong> If approved, the doctor will have access for 24 hours or until expiry.
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
