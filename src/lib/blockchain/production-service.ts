import { ethers } from "ethers";

// Smart contract ABI - this should match your deployed contract
const CONTRACT_ABI = [
  "function uploadData(string memory _ipfsHash, string memory _recordType, string memory _description) public",
  "function approveData(uint _id) public",
  "function getRecord(uint _id) public view returns (string memory ipfsHash, bool approved, address patient, address doctor, uint256 timestamp, string memory recordType, string memory description)",
  "function getTotalRecords() public view returns (uint256)",
  "function getPatientRecords(address _patient) public view returns (uint[] memory)",
  "function addApprover(address _approver) public",
  "function removeApprover(address _approver) public",
  "event DataUploaded(uint indexed id, address indexed patient, string ipfsHash)",
  "event DataApproved(uint indexed id, address indexed doctor, address indexed patient)",
];

// Contract configuration
const CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const NETWORK_CONFIG = {
  chainId: "0x7A69", // 31337 in hex (Hardhat local network)
  chainName: "Hardhat Local",
  rpcUrls: ["http://localhost:8545"],
  nativeCurrency: {
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
  },
};

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

export interface AppointmentRecord {
  id: number;
  doctor: string;
  patient: string;
  fee: number;
  timestamp: number;
  transactionHash: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
}

export class ProductionBlockchainService {
  private provider: ethers.BrowserProvider | null = null;
  private contract: ethers.Contract | null = null;
  private signer: ethers.JsonRpcSigner | null = null;

  constructor() {
    this.initializeProvider();
  }

  private async initializeProvider() {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      try {
        this.provider = new ethers.BrowserProvider((window as any).ethereum);
      } catch (error) {
        console.error("Failed to initialize provider:", error);
      }
    }
  }

  async connectWallet(): Promise<string | null> {
    if (!this.provider) {
      throw new Error("MetaMask not available");
    }

    try {
      // Request account access
      await this.provider.send("eth_requestAccounts", []);
      this.signer = await this.provider.getSigner();
      const address = await this.signer.getAddress();

      // Initialize contract with signer
      this.contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        this.signer
      );

      // Switch to correct network if needed
      await this.switchToCorrectNetwork();

      return address;
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      throw error;
    }
  }

  private async switchToCorrectNetwork() {
    if (!this.provider) return;

    try {
      await this.provider.send("wallet_switchEthereumChain", [
        { chainId: NETWORK_CONFIG.chainId },
      ]);
    } catch (error: any) {
      // If network doesn't exist, add it
      if (error.code === 4902) {
        await this.provider.send("wallet_addEthereumChain", [NETWORK_CONFIG]);
      } else {
        throw error;
      }
    }
  }

  async isWalletConnected(): Promise<boolean> {
    if (!this.provider) return false;

    try {
      const accounts = await this.provider.send("eth_accounts", []);
      if (accounts.length > 0) {
        this.signer = await this.provider.getSigner();
        this.contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          this.signer
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error checking wallet connection:", error);
      return false;
    }
  }

  async getConnectedAddress(): Promise<string | null> {
    if (!this.signer) return null;
    try {
      return await this.signer.getAddress();
    } catch (error) {
      console.error("Error getting address:", error);
      return null;
    }
  }

  // Medical Record Functions
  async uploadMedicalRecord(
    ipfsHash: string,
    recordType: string,
    description: string
  ): Promise<string> {
    if (!this.contract) {
      throw new Error("Contract not initialized. Please connect wallet first.");
    }

    try {
      const tx = await this.contract.uploadData(
        ipfsHash,
        recordType,
        description
      );
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error("Failed to upload medical record:", error);
      throw error;
    }
  }

  async approveMedicalRecord(recordId: number): Promise<string> {
    if (!this.contract) {
      throw new Error("Contract not initialized. Please connect wallet first.");
    }

    try {
      const tx = await this.contract.approveData(recordId);
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error("Failed to approve medical record:", error);
      throw error;
    }
  }

  async getMedicalRecord(recordId: number): Promise<MedicalRecord> {
    if (!this.contract) {
      throw new Error("Contract not initialized. Please connect wallet first.");
    }

    try {
      const record = await this.contract.getRecord(recordId);
      return {
        id: recordId,
        ipfsHash: record[0],
        approved: record[1],
        patient: record[2],
        doctor: record[3],
        timestamp: Number(record[4]),
        recordType: record[5],
        description: record[6],
      };
    } catch (error) {
      console.error("Failed to get medical record:", error);
      throw error;
    }
  }

  async getTotalRecords(): Promise<number> {
    if (!this.contract) {
      throw new Error("Contract not initialized. Please connect wallet first.");
    }

    try {
      const total = await this.contract.getTotalRecords();
      return Number(total);
    } catch (error) {
      console.error("Failed to get total records:", error);
      throw error;
    }
  }

  async getPatientRecords(patientAddress: string): Promise<number[]> {
    if (!this.contract) {
      throw new Error("Contract not initialized. Please connect wallet first.");
    }

    try {
      const recordIds = await this.contract.getPatientRecords(patientAddress);
      return recordIds.map((id: any) => Number(id));
    } catch (error) {
      console.error("Failed to get patient records:", error);
      throw error;
    }
  }

  // Appointment Functions (using the same contract for demonstration)
  async processAppointmentPayment(
    doctorAddress: string,
    fee: number,
    appointmentDetails: string
  ): Promise<{ transactionHash: string; appointmentId: number }> {
    if (!this.signer) {
      throw new Error("Wallet not connected");
    }

    try {
      // Convert fee to Wei (assuming fee is in USD and we convert to a small ETH amount)
      const feeInEth = (fee / 100000).toString(); // Convert to smaller ETH amount for demo
      const feeInWei = ethers.parseEther(feeInEth);

      // Send payment transaction
      const tx = await this.signer.sendTransaction({
        to: doctorAddress,
        value: feeInWei,
      });

      await tx.wait();

      // Store appointment details on blockchain using the medical record contract
      const appointmentHash = `appointment_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      const recordTx = await this.contract!.uploadData(
        appointmentHash,
        "appointment",
        appointmentDetails
      );
      await recordTx.wait();

      // Get the record ID (this would be the appointment ID)
      const totalRecords = await this.getTotalRecords();
      const appointmentId = totalRecords - 1;

      return {
        transactionHash: tx.hash,
        appointmentId,
      };
    } catch (error) {
      console.error("Failed to process appointment payment:", error);
      throw error;
    }
  }

  // Doctor Management Functions
  async addDoctor(doctorAddress: string): Promise<string> {
    if (!this.contract) {
      throw new Error("Contract not initialized. Please connect wallet first.");
    }

    try {
      const tx = await this.contract.addApprover(doctorAddress);
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error("Failed to add doctor:", error);
      throw error;
    }
  }

  async removeDoctor(doctorAddress: string): Promise<string> {
    if (!this.contract) {
      throw new Error("Contract not initialized. Please connect wallet first.");
    }

    try {
      const tx = await this.contract.removeApprover(doctorAddress);
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error("Failed to remove doctor:", error);
      throw error;
    }
  }

  // Event Listeners
  async listenToMedicalRecordEvents(callback: (event: any) => void) {
    if (!this.contract) return;

    try {
      this.contract.on("DataUploaded", (id, patient, ipfsHash, event) => {
        callback({
          type: "DataUploaded",
          id: Number(id),
          patient,
          ipfsHash,
          blockNumber: event.blockNumber,
          transactionHash: event.transactionHash,
        });
      });

      this.contract.on("DataApproved", (id, doctor, patient, event) => {
        callback({
          type: "DataApproved",
          id: Number(id),
          doctor,
          patient,
          blockNumber: event.blockNumber,
          transactionHash: event.transactionHash,
        });
      });
    } catch (error) {
      console.error("Failed to listen to events:", error);
    }
  }

  async stopListening() {
    if (!this.contract) return;
    this.contract.removeAllListeners();
  }

  // Utility Functions
  async getTransactionReceipt(transactionHash: string) {
    if (!this.provider) return null;

    try {
      return await this.provider.getTransactionReceipt(transactionHash);
    } catch (error) {
      console.error("Failed to get transaction receipt:", error);
      return null;
    }
  }

  async getBlockNumber(): Promise<number> {
    if (!this.provider) return 0;

    try {
      return await this.provider.getBlockNumber();
    } catch (error) {
      console.error("Failed to get block number:", error);
      return 0;
    }
  }
}

// Singleton instance
export const blockchainService = new ProductionBlockchainService();
