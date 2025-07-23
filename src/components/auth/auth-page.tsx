"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFirebaseAuth } from "@/contexts/firebase-auth-context";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Chrome, CreditCard } from "lucide-react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showAadhar, setShowAadhar] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    displayName: "",
    role: "patient" as "patient" | "doctor",
    aadharNumber: "",
    otp: "",
  });

  const {
    signInWithGoogle,
    signInWithAadhar,
    signInWithEmail,
    registerWithEmail,
    loading,
  } = useFirebaseAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleGoogleAuth = async () => {
    try {
      await signInWithGoogle();
      toast({
        title: "Success!",
        description: "Signed in with Google successfully.",
      });
      router.push("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign in with Google.",
        variant: "destructive",
      });
    }
  };

  const handleAadharAuth = async () => {
    try {
      await signInWithAadhar(formData.aadharNumber, formData.otp);
      toast({
        title: "Success!",
        description: "Signed in with Aadhar successfully.",
      });
      router.push("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description:
          "Failed to sign in with Aadhar. Use OTP: 123456 for testing.",
        variant: "destructive",
      });
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmail(formData.email, formData.password);
      } else {
        await registerWithEmail(
          formData.email,
          formData.password,
          formData.displayName,
          formData.role
        );
      }

      toast({
        title: "Success!",
        description: isLogin
          ? "Signed in successfully."
          : "Account created successfully.",
      });
      router.push("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isLogin ? "sign in" : "create account"}.`,
        variant: "destructive",
      });
    }
  };

  if (showAadhar) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <CreditCard className="h-5 w-5" />
              Aadhar Authentication
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="aadhar">Aadhar Number</Label>
              <Input
                id="aadhar"
                type="text"
                placeholder="Enter 12-digit Aadhar number"
                value={formData.aadharNumber}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    aadharNumber: e.target.value,
                  }))
                }
                maxLength={12}
              />
            </div>
            <div>
              <Label htmlFor="otp">OTP</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter OTP (use 123456 for testing)"
                value={formData.otp}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, otp: e.target.value }))
                }
                maxLength={6}
              />
              <p className="text-xs text-muted-foreground mt-1">
                For testing, use OTP: 123456
              </p>
            </div>
            <Button
              onClick={handleAadharAuth}
              className="w-full"
              disabled={loading || !formData.aadharNumber || !formData.otp}
            >
              {loading ? "Verifying..." : "Verify & Sign In"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowAadhar(false)}
              className="w-full"
            >
              Back to Login Options
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            {isLogin ? "Sign In to MediSync" : "Create MediSync Account"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Google Sign In */}
          <Button
            onClick={handleGoogleAuth}
            variant="outline"
            className="w-full"
            disabled={loading}
          >
            <Chrome className="mr-2 h-4 w-4" />
            Continue with Google
          </Button>

          {/* Aadhar Sign In */}
          <Button
            onClick={() => setShowAadhar(true)}
            variant="outline"
            className="w-full"
            disabled={loading}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Continue with Aadhar
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <Label htmlFor="displayName">Full Name</Label>
                  <Input
                    id="displayName"
                    type="text"
                    value={formData.displayName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        displayName: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        role: e.target.value as "patient" | "doctor",
                      }))
                    }
                    className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-600"
                  >
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                  </select>
                </div>
              </>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? "Processing..."
                : isLogin
                ? "Sign In"
                : "Create Account"}
            </Button>
          </form>

          <div className="text-center">
            <Button
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
              disabled={loading}
            >
              {isLogin
                ? "Need an account? Sign up"
                : "Already have an account? Sign in"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
