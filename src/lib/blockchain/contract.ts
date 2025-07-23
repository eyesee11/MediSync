import { ethers } from "ethers";

// Contract ABI - This will be generated after compilation
export const CONTRACT_ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "approver",
        type: "address",
      },
    ],
    name: "ApproverAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "approver",
        type: "address",
      },
    ],
    name: "ApproverRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "doctor",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "patient",
        type: "address",
      },
    ],
    name: "DataApproved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "patient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "ipfsHash",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "recordType",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "description",
        type: "string",
      },
    ],
    name: "DataUploaded",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_approver",
        type: "address",
      },
    ],
    name: "addApprover",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
    ],
    name: "approveData",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "approvers",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "doctorApprovals",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_doctor",
        type: "address",
      },
    ],
    name: "getDoctorApprovals",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_patient",
        type: "address",
      },
    ],
    name: "getPatientRecords",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_patient",
        type: "address",
      },
    ],
    name: "getPendingRecords",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
    ],
    name: "getRecord",
    outputs: [
      {
        internalType: "string",
        name: "ipfsHash",
        type: "string",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
      {
        internalType: "address",
        name: "patient",
        type: "address",
      },
      {
        internalType: "address",
        name: "doctor",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "recordType",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTotalRecords",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_address",
        type: "address",
      },
    ],
    name: "isApprover",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "patientRecords",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "recordCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "records",
    outputs: [
      {
        internalType: "string",
        name: "ipfsHash",
        type: "string",
      },
      {
        internalType: "address",
        name: "patient",
        type: "address",
      },
      {
        internalType: "address",
        name: "doctor",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "recordType",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_approver",
        type: "address",
      },
    ],
    name: "removeApprover",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_ipfsHash",
        type: "string",
      },
      {
        internalType: "string",
        name: "_recordType",
        type: "string",
      },
      {
        internalType: "string",
        name: "_description",
        type: "string",
      },
    ],
    name: "uploadData",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

// Contract address - will be set after deployment
export const CONTRACT_ADDRESS = ""; // To be filled after deployment

export interface MedicalRecord {
  id: number;
  ipfsHash: string;
  approved: boolean;
  patient: string;
  doctor: string;
  timestamp: number;
  recordType: string;
  description: string;
}

export class BlockchainService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  private contract: ethers.Contract | null = null;

  async initialize(): Promise<boolean> {
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed");
      }

      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();

      if (!CONTRACT_ADDRESS) {
        throw new Error("Contract address not set");
      }

      this.contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        this.signer
      );
      return true;
    } catch (error) {
      console.error("Failed to initialize blockchain service:", error);
      return false;
    }
  }

  async connectWallet(): Promise<string | null> {
    try {
      if (!this.provider) await this.initialize();

      await window.ethereum.request({ method: "eth_requestAccounts" });
      const address = await this.signer?.getAddress();
      return address || null;
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      return null;
    }
  }

  async uploadRecord(
    ipfsHash: string,
    recordType: string,
    description: string
  ): Promise<boolean> {
    try {
      if (!this.contract) throw new Error("Contract not initialized");

      const tx = await this.contract.uploadData(
        ipfsHash,
        recordType,
        description
      );
      await tx.wait();
      return true;
    } catch (error) {
      console.error("Failed to upload record:", error);
      return false;
    }
  }

  async approveRecord(recordId: number): Promise<boolean> {
    try {
      if (!this.contract) throw new Error("Contract not initialized");

      const tx = await this.contract.approveData(recordId);
      await tx.wait();
      return true;
    } catch (error) {
      console.error("Failed to approve record:", error);
      return false;
    }
  }

  async getRecord(recordId: number): Promise<MedicalRecord | null> {
    try {
      if (!this.contract) throw new Error("Contract not initialized");

      const result = await this.contract.getRecord(recordId);
      return {
        id: recordId,
        ipfsHash: result[0],
        approved: result[1],
        patient: result[2],
        doctor: result[3],
        timestamp: Number(result[4]),
        recordType: result[5],
        description: result[6],
      };
    } catch (error) {
      console.error("Failed to get record:", error);
      return null;
    }
  }

  async getPatientRecords(patientAddress: string): Promise<number[]> {
    try {
      if (!this.contract) throw new Error("Contract not initialized");

      const result = await this.contract.getPatientRecords(patientAddress);
      return result.map((id: any) => Number(id));
    } catch (error) {
      console.error("Failed to get patient records:", error);
      return [];
    }
  }

  async getPendingRecords(patientAddress: string): Promise<number[]> {
    try {
      if (!this.contract) throw new Error("Contract not initialized");

      const result = await this.contract.getPendingRecords(patientAddress);
      return result.map((id: any) => Number(id));
    } catch (error) {
      console.error("Failed to get pending records:", error);
      return [];
    }
  }

  async isApprover(address: string): Promise<boolean> {
    try {
      if (!this.contract) throw new Error("Contract not initialized");

      return await this.contract.isApprover(address);
    } catch (error) {
      console.error("Failed to check approver status:", error);
      return false;
    }
  }

  async addApprover(approverAddress: string): Promise<boolean> {
    try {
      if (!this.contract) throw new Error("Contract not initialized");

      const tx = await this.contract.addApprover(approverAddress);
      await tx.wait();
      return true;
    } catch (error) {
      console.error("Failed to add approver:", error);
      return false;
    }
  }
}
