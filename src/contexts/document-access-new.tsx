"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface DocumentAccessRequest {
  id: string;
  doctorId: string;
  doctorName: string;
  patientId: string;
  patientName: string;
  requestDate: Date;
  status: 'pending' | 'approved' | 'denied' | 'expired';
  approvalDate?: Date;
  expiryDate?: Date;
  reason: string;
  documents: string[];
}

interface DocumentAccessContextType {
  requests: DocumentAccessRequest[];
  createRequest: (doctorInfo: {id: string, name: string}, patientInfo: {id: string, name: string}, reason: string, documents: string[]) => DocumentAccessRequest;
  approveRequest: (requestId: string) => void;
  denyRequest: (requestId: string) => void;
  getRequestsForDoctor: (doctorId: string) => DocumentAccessRequest[];
  getRequestsForPatient: (patientId: string) => DocumentAccessRequest[];
  hasActiveAccess: (doctorId: string, patientId: string) => boolean;
}

const DocumentAccessContext = createContext<DocumentAccessContextType | undefined>(undefined);

export const useDocumentAccess = () => {
  const context = useContext(DocumentAccessContext);
  if (context === undefined) {
    throw new Error('useDocumentAccess must be used within a DocumentAccessProvider');
  }
  return context;
};

interface DocumentAccessProviderProps {
  children: ReactNode;
}

export const DocumentAccessProvider: React.FC<DocumentAccessProviderProps> = ({ children }) => {
  const [requests, setRequests] = useState<DocumentAccessRequest[]>([]);

  const createRequest = (
    doctorInfo: {id: string, name: string}, 
    patientInfo: {id: string, name: string}, 
    reason: string, 
    documents: string[]
  ): DocumentAccessRequest => {
    const newRequest: DocumentAccessRequest = {
      id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      doctorId: doctorInfo.id,
      doctorName: doctorInfo.name,
      patientId: patientInfo.id,
      patientName: patientInfo.name,
      requestDate: new Date(),
      status: 'pending',
      reason,
      documents
    };

    setRequests(prev => [...prev, newRequest]);
    return newRequest;
  };

  const approveRequest = (requestId: string) => {
    setRequests(prev => prev.map(request => {
      if (request.id === requestId && request.status === 'pending') {
        const approvalDate = new Date();
        const expiryDate = new Date(approvalDate.getTime() + 24 * 60 * 60 * 1000); // 24 hours from approval
        
        return {
          ...request,
          status: 'approved' as const,
          approvalDate,
          expiryDate
        };
      }
      return request;
    }));
  };

  const denyRequest = (requestId: string) => {
    setRequests(prev => prev.map(request => {
      if (request.id === requestId && request.status === 'pending') {
        return {
          ...request,
          status: 'denied' as const
        };
      }
      return request;
    }));
  };

  const getRequestsForDoctor = (doctorId: string): DocumentAccessRequest[] => {
    return requests.filter(request => request.doctorId === doctorId);
  };

  const getRequestsForPatient = (patientId: string): DocumentAccessRequest[] => {
    return requests.filter(request => request.patientId === patientId);
  };

  const hasActiveAccess = (doctorId: string, patientId: string): boolean => {
    const now = new Date();
    return requests.some(request => 
      request.doctorId === doctorId && 
      request.patientId === patientId && 
      request.status === 'approved' && 
      request.expiryDate && 
      request.expiryDate > now
    );
  };

  // Check for expired requests and update their status
  React.useEffect(() => {
    const checkExpiredRequests = () => {
      const now = new Date();
      setRequests(prev => prev.map(request => {
        if (
          request.status === 'approved' && 
          request.expiryDate && 
          request.expiryDate <= now
        ) {
          return {
            ...request,
            status: 'expired' as const
          };
        }
        return request;
      }));
    };

    // Check every minute for expired requests
    const interval = setInterval(checkExpiredRequests, 60000);
    
    // Initial check
    checkExpiredRequests();

    return () => clearInterval(interval);
  }, []);

  return (
    <DocumentAccessContext.Provider value={{
      requests,
      createRequest,
      approveRequest,
      denyRequest,
      getRequestsForDoctor,
      getRequestsForPatient,
      hasActiveAccess
    }}>
      {children}
    </DocumentAccessContext.Provider>
  );
};
