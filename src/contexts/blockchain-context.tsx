"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  blockchainService,
  MedicalRecord,
  AppointmentRecord,
} from "@/lib/blockchain/production-service";
import { useToast } from "@/hooks/use-toast";

interface BlockchainContextType {
  // Connection state
  isConnected: boolean;
  address: string | null;
  isLoading: boolean;

  // Actions
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;

  // Medical Records
  uploadMedicalRecord: (
    ipfsHash: string,
    recordType: string,
    description: string
  ) => Promise<string>;
  approveMedicalRecord: (recordId: number) => Promise<string>;
  getMedicalRecord: (recordId: number) => Promise<MedicalRecord>;
  getPatientRecords: (patientAddress?: string) => Promise<number[]>;

  // Appointments
  processAppointmentPayment: (
    doctorAddress: string,
    fee: number,
    details: string
  ) => Promise<{ transactionHash: string; appointmentId: number }>;

  // Data
  medicalRecords: MedicalRecord[];
  appointments: AppointmentRecord[];
  totalRecords: number;

  // Events
  onNewRecord: (callback: (record: MedicalRecord) => void) => void;
  onRecordApproved: (
    callback: (recordId: number, doctor: string) => void
  ) => void;
}

const BlockchainContext = createContext<BlockchainContextType | undefined>(
  undefined
);

interface BlockchainProviderProps {
  children: ReactNode;
}

export function BlockchainProvider({ children }: BlockchainProviderProps) {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);

  // Check wallet connection on mount
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    setIsLoading(true);
    try {
      const connected = await blockchainService.isWalletConnected();
      if (connected) {
        const addr = await blockchainService.getConnectedAddress();
        setIsConnected(true);
        setAddress(addr);
        await loadUserData(addr);
      }
    } catch (error) {
      console.error("Error checking connection:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const connectWallet = async () => {
    setIsLoading(true);
    try {
      const addr = await blockchainService.connectWallet();
      if (addr) {
        setIsConnected(true);
        setAddress(addr);
        await loadUserData(addr);

        toast({
          title: "Wallet Connected",
          description: `Connected to ${addr.slice(0, 6)}...${addr.slice(-4)}`,
        });

        // Start listening to events
        await blockchainService.listenToMedicalRecordEvents((event) => {
          handleBlockchainEvent(event);
        });
      }
    } catch (error: any) {
      console.error("Connection error:", error);
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: error.message || "Failed to connect to MetaMask",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAddress(null);
    setMedicalRecords([]);
    setAppointments([]);
    setTotalRecords(0);
    blockchainService.stopListening();

    toast({
      title: "Wallet Disconnected",
      description: "You have been disconnected from MetaMask",
    });
  };

  const loadUserData = async (userAddress: string | null) => {
    if (!userAddress) return;

    try {
      // Load total records
      const total = await blockchainService.getTotalRecords();
      setTotalRecords(total);

      // Load patient records
      const recordIds = await blockchainService.getPatientRecords(userAddress);
      const records: MedicalRecord[] = [];

      for (const id of recordIds) {
        try {
          const record = await blockchainService.getMedicalRecord(id);
          records.push(record);
        } catch (error) {
          console.error(`Failed to load record ${id}:`, error);
        }
      }

      setMedicalRecords(records);
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const handleBlockchainEvent = (event: any) => {
    switch (event.type) {
      case "DataUploaded":
        toast({
          title: "New Medical Record",
          description: `Record uploaded to blockchain`,
        });
        // Reload records
        if (address) {
          loadUserData(address);
        }
        break;

      case "DataApproved":
        toast({
          title: "Record Approved",
          description: `Medical record has been approved by doctor`,
        });
        // Reload records
        if (address) {
          loadUserData(address);
        }
        break;
    }
  };

  const uploadMedicalRecord = async (
    ipfsHash: string,
    recordType: string,
    description: string
  ): Promise<string> => {
    try {
      const txHash = await blockchainService.uploadMedicalRecord(
        ipfsHash,
        recordType,
        description
      );

      toast({
        title: "Record Uploaded",
        description: "Medical record uploaded to blockchain successfully",
      });

      // Reload user data
      if (address) {
        setTimeout(() => loadUserData(address), 2000); // Wait for block confirmation
      }

      return txHash;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: error.message || "Failed to upload medical record",
      });
      throw error;
    }
  };

  const approveMedicalRecord = async (recordId: number): Promise<string> => {
    try {
      const txHash = await blockchainService.approveMedicalRecord(recordId);

      toast({
        title: "Record Approved",
        description: "Medical record approved successfully",
      });

      // Reload user data
      if (address) {
        setTimeout(() => loadUserData(address), 2000); // Wait for block confirmation
      }

      return txHash;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Approval Failed",
        description: error.message || "Failed to approve medical record",
      });
      throw error;
    }
  };

  const getMedicalRecord = async (recordId: number): Promise<MedicalRecord> => {
    return blockchainService.getMedicalRecord(recordId);
  };

  const getPatientRecords = async (
    patientAddress?: string
  ): Promise<number[]> => {
    const addr = patientAddress || address;
    if (!addr) throw new Error("No address provided");
    return blockchainService.getPatientRecords(addr);
  };

  const processAppointmentPayment = async (
    doctorAddress: string,
    fee: number,
    details: string
  ): Promise<{ transactionHash: string; appointmentId: number }> => {
    try {
      const result = await blockchainService.processAppointmentPayment(
        doctorAddress,
        fee,
        details
      );

      toast({
        title: "Payment Successful",
        description: "Appointment payment processed on blockchain",
      });

      return result;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description: error.message || "Failed to process payment",
      });
      throw error;
    }
  };

  const onNewRecord = (callback: (record: MedicalRecord) => void) => {
    // This would be implemented with event listeners
    // For now, it's a placeholder
  };

  const onRecordApproved = (
    callback: (recordId: number, doctor: string) => void
  ) => {
    // This would be implemented with event listeners
    // For now, it's a placeholder
  };

  const contextValue: BlockchainContextType = {
    // Connection state
    isConnected,
    address,
    isLoading,

    // Actions
    connectWallet,
    disconnectWallet,

    // Medical Records
    uploadMedicalRecord,
    approveMedicalRecord,
    getMedicalRecord,
    getPatientRecords,

    // Appointments
    processAppointmentPayment,

    // Data
    medicalRecords,
    appointments,
    totalRecords,

    // Events
    onNewRecord,
    onRecordApproved,
  };

  return (
    <BlockchainContext.Provider value={contextValue}>
      {children}
    </BlockchainContext.Provider>
  );
}

export function useBlockchain() {
  const context = useContext(BlockchainContext);
  if (context === undefined) {
    throw new Error("useBlockchain must be used within a BlockchainProvider");
  }
  return context;
}
