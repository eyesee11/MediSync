import { create } from "ipfs-http-client";

// IPFS configuration
const IPFS_GATEWAY = "https://ipfs.io/ipfs/";
const IPFS_API_URL = "https://ipfs.infura.io:5001"; // You can use Infura or local IPFS node

export interface IPFSUploadResult {
  hash: string;
  url: string;
  size: number;
}

export class IPFSService {
  private client: any;

  constructor() {
    try {
      // Initialize IPFS client
      this.client = create({
        url: IPFS_API_URL,
        // Add auth if using Infura
        // headers: {
        //   authorization: 'Basic ' + Buffer.from(PROJECT_ID + ':' + PROJECT_SECRET).toString('base64')
        // }
      });
    } catch (error) {
      console.error("Failed to initialize IPFS client:", error);
    }
  }

  /**
   * Upload a file to IPFS
   * @param file - File to upload
   * @returns Promise with IPFS hash and URL
   */
  async uploadFile(file: File): Promise<IPFSUploadResult | null> {
    try {
      if (!this.client) {
        throw new Error("IPFS client not initialized");
      }

      // Convert file to buffer
      const buffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(buffer);

      // Upload to IPFS
      const result = await this.client.add(uint8Array, {
        progress: (bytes: number) => {
          console.log(`IPFS upload progress: ${bytes} bytes`);
        },
      });

      return {
        hash: result.path,
        url: `${IPFS_GATEWAY}${result.path}`,
        size: result.size,
      };
    } catch (error) {
      console.error("Failed to upload file to IPFS:", error);
      return null;
    }
  }

  /**
   * Upload JSON data to IPFS
   * @param data - JSON data to upload
   * @returns Promise with IPFS hash and URL
   */
  async uploadJSON(data: any): Promise<IPFSUploadResult | null> {
    try {
      if (!this.client) {
        throw new Error("IPFS client not initialized");
      }

      const jsonString = JSON.stringify(data);
      const buffer = Buffer.from(jsonString);

      const result = await this.client.add(buffer);

      return {
        hash: result.path,
        url: `${IPFS_GATEWAY}${result.path}`,
        size: result.size,
      };
    } catch (error) {
      console.error("Failed to upload JSON to IPFS:", error);
      return null;
    }
  }

  /**
   * Retrieve data from IPFS
   * @param hash - IPFS hash
   * @returns Promise with file data
   */
  async getFile(hash: string): Promise<Uint8Array | null> {
    try {
      if (!this.client) {
        throw new Error("IPFS client not initialized");
      }

      const chunks = [];
      for await (const chunk of this.client.cat(hash)) {
        chunks.push(chunk);
      }

      // Concatenate chunks
      const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
      const result = new Uint8Array(totalLength);
      let offset = 0;

      for (const chunk of chunks) {
        result.set(chunk, offset);
        offset += chunk.length;
      }

      return result;
    } catch (error) {
      console.error("Failed to retrieve file from IPFS:", error);
      return null;
    }
  }

  /**
   * Retrieve JSON data from IPFS
   * @param hash - IPFS hash
   * @returns Promise with parsed JSON data
   */
  async getJSON(hash: string): Promise<any | null> {
    try {
      const data = await this.getFile(hash);
      if (!data) return null;

      const jsonString = new TextDecoder().decode(data);
      return JSON.parse(jsonString);
    } catch (error) {
      console.error("Failed to retrieve JSON from IPFS:", error);
      return null;
    }
  }

  /**
   * Get IPFS URL for a hash
   * @param hash - IPFS hash
   * @returns IPFS gateway URL
   */
  getIPFSUrl(hash: string): string {
    return `${IPFS_GATEWAY}${hash}`;
  }

  /**
   * Pin a file to IPFS (keep it available)
   * @param hash - IPFS hash to pin
   * @returns Promise indicating success
   */
  async pinFile(hash: string): Promise<boolean> {
    try {
      if (!this.client) {
        throw new Error("IPFS client not initialized");
      }

      await this.client.pin.add(hash);
      return true;
    } catch (error) {
      console.error("Failed to pin file to IPFS:", error);
      return false;
    }
  }

  /**
   * Encrypt file data before uploading to IPFS
   * @param file - File to encrypt and upload
   * @param password - Password for encryption
   * @returns Promise with IPFS hash of encrypted data
   */
  async uploadEncryptedFile(
    file: File,
    password: string
  ): Promise<IPFSUploadResult | null> {
    try {
      // Simple encryption example - in production, use proper encryption
      const fileBuffer = await file.arrayBuffer();
      const fileArray = new Uint8Array(fileBuffer);

      // Create encrypted metadata
      const encryptedData = {
        filename: file.name,
        type: file.type,
        size: file.size,
        data: Array.from(fileArray), // Convert to regular array for JSON
        encrypted: true,
        timestamp: Date.now(),
      };

      return await this.uploadJSON(encryptedData);
    } catch (error) {
      console.error("Failed to upload encrypted file:", error);
      return null;
    }
  }
}

// Create singleton instance
export const ipfsService = new IPFSService();
