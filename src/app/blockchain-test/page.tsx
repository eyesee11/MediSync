"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export default function BlockchainTestPage() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [account, setAccount] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newRecord, setNewRecord] = useState({
    type: "",
    description: "",
    file: null,
  });

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setWalletConnected(true);
          setAccount(accounts[0]);
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletConnected(true);
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("Please install MetaMask to test blockchain functionality");
    }
  };

  const uploadRecord = async () => {
    if (!newRecord.type || !newRecord.description) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      // Simulate IPFS upload (in real implementation, this would upload to IPFS)
      const mockIpfsHash = `QmMock${Date.now()}${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      // Simulate blockchain interaction
      const mockRecord = {
        id: records.length,
        ipfsHash: mockIpfsHash,
        type: newRecord.type,
        description: newRecord.description,
        patient: account,
        approved: false,
        timestamp: new Date().toLocaleString(),
        doctor: null,
      };

      setRecords([...records, mockRecord]);
      setNewRecord({ type: "", description: "", file: null });

      alert("Medical record uploaded successfully! (Demo)");
    } catch (error) {
      console.error("Error uploading record:", error);
      alert("Error uploading record");
    } finally {
      setLoading(false);
    }
  };

  const approveRecord = async (recordId) => {
    setLoading(true);
    try {
      // Simulate doctor approval
      const updatedRecords = records.map((record) =>
        record.id === recordId
          ? { ...record, approved: true, doctor: account }
          : record
      );
      setRecords(updatedRecords);
      alert("Record approved successfully! (Demo)");
    } catch (error) {
      console.error("Error approving record:", error);
      alert("Error approving record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">
          🔗 Blockchain Medical Records Test
        </h1>
        <p className="text-muted-foreground">
          Test the decentralized medical record management system
        </p>
      </div>

      {/* Wallet Connection */}
      <Card>
        <CardHeader>
          <CardTitle>👛 Wallet Connection</CardTitle>
        </CardHeader>
        <CardContent>
          {!walletConnected ? (
            <div className="text-center">
              <p className="mb-4">
                Connect your MetaMask wallet to test blockchain functionality
              </p>
              <Button onClick={connectWallet}>Connect Wallet</Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Badge variant="outline" className="text-green-600">
                ✅ Wallet Connected
              </Badge>
              <p className="text-sm font-mono break-all">Account: {account}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {walletConnected && (
        <>
          {/* Upload New Record */}
          <Card>
            <CardHeader>
              <CardTitle>📄 Upload Medical Record</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Record Type</label>
                <Input
                  placeholder="e.g., Blood Test, X-Ray, MRI Scan"
                  value={newRecord.type}
                  onChange={(e) =>
                    setNewRecord({ ...newRecord, type: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Brief description of the medical record"
                  value={newRecord.description}
                  onChange={(e) =>
                    setNewRecord({ ...newRecord, description: e.target.value })
                  }
                />
              </div>
              <Button
                onClick={uploadRecord}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Uploading..." : "Upload to Blockchain"}
              </Button>
            </CardContent>
          </Card>

          {/* Medical Records List */}
          <Card>
            <CardHeader>
              <CardTitle>📋 Medical Records ({records.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {records.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No medical records uploaded yet</p>
                  <p className="text-sm">
                    Upload your first record above to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {records.map((record) => (
                    <div
                      key={record.id}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{record.type}</h3>
                          <p className="text-sm text-muted-foreground">
                            {record.description}
                          </p>
                        </div>
                        <Badge
                          variant={record.approved ? "default" : "secondary"}
                        >
                          {record.approved ? "✅ Approved" : "⏳ Pending"}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div>
                          <strong>IPFS Hash:</strong>{" "}
                          <span className="font-mono text-xs">
                            {record.ipfsHash}
                          </span>
                        </div>
                        <div>
                          <strong>Timestamp:</strong> {record.timestamp}
                        </div>
                        <div>
                          <strong>Patient:</strong>{" "}
                          <span className="font-mono text-xs">
                            {record.patient}
                          </span>
                        </div>
                        {record.doctor && (
                          <div>
                            <strong>Doctor:</strong>{" "}
                            <span className="font-mono text-xs">
                              {record.doctor}
                            </span>
                          </div>
                        )}
                      </div>

                      {!record.approved && (
                        <Button
                          size="sm"
                          onClick={() => approveRecord(record.id)}
                          disabled={loading}
                        >
                          Approve as Doctor
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Test Information */}
          <Alert>
            <AlertDescription>
              <strong>🧪 Testing Mode:</strong> This is a demo interface. In
              production, it would connect to the deployed smart contract at
              address{" "}
              <code className="bg-muted px-1 rounded">
                0x5FbDB2315678afecb367f032d93F642f64180aa3
              </code>{" "}
              and upload files to IPFS. The blockchain functionality has been
              tested and verified through automated tests.
            </AlertDescription>
          </Alert>
        </>
      )}
    </div>
  );
}
