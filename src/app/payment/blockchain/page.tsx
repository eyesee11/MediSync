"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  Wallet,
  CheckCircle,
  ArrowLeft,
  Shield,
  Clock,
  AlertTriangle,
  Loader2,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

export default function BlockchainPaymentPage() {
  const { toast } = useToast();
  const [walletConnected, setWalletConnected] = useState(false);
  const [account, setAccount] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "success" | "failed"
  >("idle");
  const [transactionHash, setTransactionHash] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [fee, setFee] = useState(0);

  useEffect(() => {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    setDoctorName(urlParams.get("doctor") || "Dr. Sarah Johnson");
    setFee(parseInt(urlParams.get("fee") || "250"));

    // Check if wallet is already connected
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
        toast({
          title: "Wallet Connected",
          description: "MetaMask wallet connected successfully",
        });
      } catch (error) {
        console.error("Error connecting wallet:", error);
        toast({
          variant: "destructive",
          title: "Connection Failed",
          description: "Failed to connect to MetaMask wallet",
        });
      }
    } else {
      toast({
        variant: "destructive",
        title: "MetaMask Not Found",
        description: "Please install MetaMask browser extension",
      });
    }
  };

  const processPayment = async () => {
    if (!walletConnected) {
      toast({
        variant: "destructive",
        title: "Wallet Not Connected",
        description: "Please connect your MetaMask wallet first",
      });
      return;
    }

    setPaymentStatus("processing");

    try {
      // Convert fee to Wei (assuming 1 ETH = 1000 USD for demo purposes)
      const feeInEth = (fee / 100000).toString(); // Convert to smaller ETH amount for demo
      const feeInWei = (parseFloat(feeInEth) * 1e18).toString(16);

      const transactionParameters = {
        to: "0x742d35Cc6666Cc8F7d7D8b0b3b2b8C4C4E4e4e4e", // Demo recipient address
        from: account,
        value: `0x${feeInWei}`,
        gas: "0x5208", // 21000 in hex
      };

      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [transactionParameters],
      });

      setTransactionHash(txHash);
      setPaymentStatus("success");

      toast({
        title: "Payment Successful!",
        description: "Your appointment has been booked successfully",
      });

      // Store appointment in blockchain (integration with smart contract)
      // This would integrate with the PatientDataConsent contract
      await storeAppointmentOnBlockchain(txHash);
    } catch (error) {
      console.error("Payment failed:", error);
      setPaymentStatus("failed");
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description: "Transaction was rejected or failed",
      });
    }
  };

  const storeAppointmentOnBlockchain = async (txHash: string) => {
    // This would integrate with the PatientDataConsent smart contract
    // For now, it's a placeholder that simulates blockchain storage
    console.log("Storing appointment on blockchain:", {
      transactionHash: txHash,
      doctor: doctorName,
      patient: account,
      fee: fee,
      timestamp: new Date().toISOString(),
    });
  };

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case "processing":
        return <Loader2 className="h-6 w-6 animate-spin text-blue-600" />;
      case "success":
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case "failed":
        return <AlertTriangle className="h-6 w-6 text-red-600" />;
      default:
        return <Wallet className="h-6 w-6 text-gray-600" />;
    }
  };

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case "processing":
        return "Processing blockchain transaction...";
      case "success":
        return "Payment successful! Appointment booked.";
      case "failed":
        return "Payment failed. Please try again.";
      default:
        return "Ready to process payment";
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Link href="/payment">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Blockchain Payment</h1>
            <p className="text-muted-foreground">
              Secure appointment booking with MetaMask
            </p>
          </div>
        </div>
      </div>

      {/* Payment Status */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center space-x-4 mb-4">
            {getStatusIcon()}
            <span className="text-lg font-medium">{getStatusMessage()}</span>
          </div>

          {paymentStatus === "success" && transactionHash && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Transaction Hash:
              </p>
              <div className="bg-muted p-3 rounded-lg">
                <p className="font-mono text-sm break-all">{transactionHash}</p>
              </div>
              <a
                href={`https://etherscan.io/tx/${transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center mt-2 text-sm text-primary hover:underline"
              >
                View on Etherscan <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Appointment Details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Appointment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Doctor:</span>
            <span className="font-medium">{doctorName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Consultation Fee:</span>
            <span className="font-medium">₹{fee}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Payment Method:</span>
            <Badge variant="secondary">
              <Wallet className="mr-1 h-3 w-3" />
              MetaMask
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Wallet Connection */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Wallet Connection
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!walletConnected ? (
            <div className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Please connect your MetaMask wallet to proceed with the
                  payment
                </AlertDescription>
              </Alert>
              <Button onClick={connectWallet} className="w-full">
                <Wallet className="mr-2 h-4 w-4" />
                Connect MetaMask Wallet
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium">Wallet Connected</span>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">Account:</p>
                <p className="font-mono text-sm break-all">{account}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Features */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Blockchain Security
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Immutable transaction record</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Transparent payment history</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Decentralized verification</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Smart contract protection</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Action */}
      {walletConnected && paymentStatus === "idle" && (
        <Card>
          <CardContent className="pt-6">
            <Button onClick={processPayment} className="w-full" size="lg">
              <Wallet className="mr-2 h-5 w-5" />
              Pay ₹{fee} with MetaMask
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-2">
              This will open MetaMask to confirm the transaction
            </p>
          </CardContent>
        </Card>
      )}

      {paymentStatus === "success" && (
        <Card>
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Payment Successful!</h3>
            <p className="text-muted-foreground mb-4">
              Your appointment has been booked and recorded on the blockchain
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/dashboard">
                <Button>View Dashboard</Button>
              </Link>
              <Link href="/search">
                <Button variant="outline">Book Another Appointment</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
