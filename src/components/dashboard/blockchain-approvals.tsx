"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  Hash,
  Users,
  Activity,
  AlertTriangle,
  Copy,
  ExternalLink,
  FileText,
  Pill
} from "lucide-react";

interface BlockchainTransaction {
  id: string;
  hash: string;
  blockNumber: number;
  timestamp: number;
  status: "pending" | "confirmed" | "failed";
  confirmations: number;
  requiredConfirmations: number;
  gasUsed: string;
  transactionFee: string;
  approvalType: "document" | "access" | "medical-record" | "prescription";
  requesterId: string;
  requesterName: string;
  targetId: string;
  targetName: string;
  description: string;
  consensusNodes: {
    nodeId: string;
    nodeName: string;
    vote: "approve" | "reject" | "pending";
    timestamp?: number;
  }[];
}

// Mock blockchain transactions
const mockTransactions: BlockchainTransaction[] = [
  {
    id: "tx_001",
    hash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890",
    blockNumber: 1234567,
    timestamp: Date.now() - 30000,
    status: "pending",
    confirmations: 2,
    requiredConfirmations: 3,
    gasUsed: "0.0012 ETH",
    transactionFee: "0.0001 ETH",
    approvalType: "document",
    requesterId: "doc_001",
    requesterName: "Dr. Arjun Patel",
    targetId: "patient_001",
    targetName: "Ajay Singh",
    description: "Request access to cardiac test results",
    consensusNodes: [
      { nodeId: "node_1", nodeName: "AIIMS Node", vote: "approve", timestamp: Date.now() - 25000 },
      { nodeId: "node_2", nodeName: "Apollo Node", vote: "approve", timestamp: Date.now() - 20000 },
      { nodeId: "node_3", nodeName: "Fortis Node", vote: "pending" }
    ]
  },
  {
    id: "tx_002",
    hash: "0x9876543210fedcba0987654321fedcba0987654321fedcba0987654321fedcba",
    blockNumber: 1234566,
    timestamp: Date.now() - 120000,
    status: "confirmed",
    confirmations: 6,
    requiredConfirmations: 3,
    gasUsed: "0.0008 ETH",
    transactionFee: "0.0001 ETH",
    approvalType: "medical-record",
    requesterId: "lab_001",
    requesterName: "PathLab Diagnostics",
    targetId: "patient_001",
    targetName: "Ajay Singh",
    description: "Upload blood test results",
    consensusNodes: [
      { nodeId: "node_1", nodeName: "AIIMS Node", vote: "approve", timestamp: Date.now() - 115000 },
      { nodeId: "node_2", nodeName: "Apollo Node", vote: "approve", timestamp: Date.now() - 110000 },
      { nodeId: "node_3", nodeName: "Fortis Node", vote: "approve", timestamp: Date.now() - 105000 }
    ]
  },
  {
    id: "tx_003",
    hash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    blockNumber: 1234568,
    timestamp: Date.now() - 10000,
    status: "pending",
    confirmations: 1,
    requiredConfirmations: 3,
    gasUsed: "0.0015 ETH",
    transactionFee: "0.0002 ETH",
    approvalType: "prescription",
    requesterId: "pharmacy_001",
    requesterName: "MedPlus Pharmacy",
    targetId: "patient_001",
    targetName: "Ajay Singh",
    description: "Dispense prescribed medication",
    consensusNodes: [
      { nodeId: "node_1", nodeName: "AIIMS Node", vote: "approve", timestamp: Date.now() - 8000 },
      { nodeId: "node_2", nodeName: "Apollo Node", vote: "pending" },
      { nodeId: "node_3", nodeName: "Fortis Node", vote: "pending" }
    ]
  }
];

export function BlockchainApprovals() {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<BlockchainTransaction[]>(mockTransactions);
  const [selectedTransaction, setSelectedTransaction] = useState<BlockchainTransaction | null>(null);

  // Simulate blockchain consensus updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTransactions(prev => prev.map(tx => {
        if (tx.status === "pending") {
          // Randomly update pending votes
          const updatedNodes = tx.consensusNodes.map(node => {
            if (node.vote === "pending" && Math.random() > 0.7) {
              return {
                ...node,
                vote: Math.random() > 0.2 ? "approve" : "reject" as "approve" | "reject",
                timestamp: Date.now()
              };
            }
            return node;
          });

          const approvals = updatedNodes.filter(n => n.vote === "approve").length;
          const rejections = updatedNodes.filter(n => n.vote === "reject").length;
          
          let newStatus = tx.status;
          let newConfirmations = tx.confirmations;

          if (approvals >= tx.requiredConfirmations) {
            newStatus = "confirmed";
            newConfirmations = tx.requiredConfirmations;
          } else if (rejections >= tx.requiredConfirmations) {
            newStatus = "failed";
          } else if (approvals > 0) {
            newConfirmations = approvals;
          }

          return {
            ...tx,
            consensusNodes: updatedNodes,
            status: newStatus,
            confirmations: newConfirmations
          };
        }
        return tx;
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Transaction hash copied successfully.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "text-green-600";
      case "failed": return "text-red-600";
      case "pending": return "text-yellow-600";
      default: return "text-gray-600";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "document": return <FileText className="h-4 w-4" />;
      case "access": return <Shield className="h-4 w-4" />;
      case "medical-record": return <Activity className="h-4 w-4" />;
      case "prescription": return <Pill className="h-4 w-4" />;
      default: return <Hash className="h-4 w-4" />;
    }
  };

  const formatHash = (hash: string) => {
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  };

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    if (minutes > 0) {
      return `${minutes}m ${seconds}s ago`;
    }
    return `${seconds}s ago`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Blockchain Approvals</h2>
          <p className="text-muted-foreground">
            Decentralized consensus for medical record access and approvals
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Activity className="h-3 w-3" />
          {transactions.filter(tx => tx.status === "pending").length} Pending
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transaction List */}
        <div className="lg:col-span-2 space-y-4">
          {transactions.map((transaction) => (
            <Card 
              key={transaction.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedTransaction?.id === transaction.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setSelectedTransaction(transaction)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(transaction.approvalType)}
                    <CardTitle className="text-lg">{transaction.description}</CardTitle>
                  </div>
                  <Badge 
                    variant={transaction.status === "confirmed" ? "default" : "secondary"}
                    className={getStatusColor(transaction.status)}
                  >
                    {transaction.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                    {transaction.status === "confirmed" && <CheckCircle className="h-3 w-3 mr-1" />}
                    {transaction.status === "failed" && <XCircle className="h-3 w-3 mr-1" />}
                    {transaction.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">From:</span>
                    <span className="font-medium">{transaction.requesterName}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Hash:</span>
                    <div className="flex items-center gap-1">
                      <span className="font-mono text-xs">{formatHash(transaction.hash)}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(transaction.hash);
                        }}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Consensus:</span>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={(transaction.confirmations / transaction.requiredConfirmations) * 100} 
                        className="w-20 h-2"
                      />
                      <span className="text-xs">
                        {transaction.confirmations}/{transaction.requiredConfirmations}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Time:</span>
                    <span>{formatTime(transaction.timestamp)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Transaction Details */}
        <div className="space-y-4">
          {selectedTransaction ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hash className="h-5 w-5" />
                  Transaction Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Consensus Nodes</h4>
                  <div className="space-y-2">
                    {selectedTransaction.consensusNodes.map((node) => (
                      <div key={node.nodeId} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{node.nodeName}</p>
                          {node.timestamp && (
                            <p className="text-xs text-muted-foreground">
                              {formatTime(node.timestamp)}
                            </p>
                          )}
                        </div>
                        <Badge 
                          variant={
                            node.vote === "approve" ? "default" :
                            node.vote === "reject" ? "destructive" : "secondary"
                          }
                        >
                          {node.vote === "approve" && <CheckCircle className="h-3 w-3 mr-1" />}
                          {node.vote === "reject" && <XCircle className="h-3 w-3 mr-1" />}
                          {node.vote === "pending" && <Clock className="h-3 w-3 mr-1" />}
                          {node.vote.toUpperCase()}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Blockchain Info</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Block Number:</span>
                      <span className="font-mono">#{selectedTransaction.blockNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gas Used:</span>
                      <span className="font-mono">{selectedTransaction.gasUsed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Transaction Fee:</span>
                      <span className="font-mono">{selectedTransaction.transactionFee}</span>
                    </div>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.open(`https://etherscan.io/tx/${selectedTransaction.hash}`, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on Blockchain Explorer
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <div className="text-center text-muted-foreground">
                  <Hash className="h-8 w-8 mx-auto mb-2" />
                  <p>Select a transaction to view details</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Network Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Network Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active Nodes:</span>
                <span className="font-medium">3/3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Network Health:</span>
                <Badge variant="default" className="text-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Healthy
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Avg. Block Time:</span>
                <span className="font-mono text-sm">15s</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Pending TXs:</span>
                <span className="font-medium">
                  {transactions.filter(tx => tx.status === "pending").length}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
