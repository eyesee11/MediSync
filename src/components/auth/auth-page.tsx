"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFirebaseAuth } from "@/contexts/firebase-auth-context";
import { useAuth } from "@/components/auth/auth-provider";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Chrome, CreditCard, Mail, User, AlertCircle, CheckCircle, TestTube, Wifi } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { TestAccounts } from "@/components/auth/test-accounts";
import { FirestoreConnectionDiagnostics } from "@/components/debug/firestore-diagnostics";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showAadhar, setShowAadhar] = useState(false);
  const [showTestAccounts, setShowTestAccounts] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [aadharStep, setAadharStep] = useState<'input' | 'otp'>('input');
  const [txnId, setTxnId] = useState<string>('');
  const [localLoading, setLocalLoading] = useState(false); // Local loading state
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
    sendAadharOTP,
    loading: firebaseLoading,
  } = useFirebaseAuth();
  const { login: localLogin } = useAuth(); // Local auth for dashboard routing
  const { toast } = useToast();
  const router = useRouter();

  // Use local loading state instead of Firebase loading for better UX
  const loading = localLoading;

  // Helper function to integrate Firebase auth with local auth and route to dashboard
  const completeAuthAndRoute = (firebaseUser: any) => {
    try {
      // Set local auth state for dashboard routing
      localLogin({
        name: firebaseUser?.displayName || firebaseUser?.email || 'User',
        role: firebaseUser?.role || 'patient',
        registrationId: firebaseUser?.registrationId // Pass registration ID
      });

      // Route to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error('Error setting local auth:', error);
      router.push("/dashboard"); // Fallback
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setLocalLoading(true);
      const result = await signInWithGoogle();
      completeAuthAndRoute(result);
      toast({
        title: "Success!",
        description: "Signed in with Google successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign in with Google.",
        variant: "destructive",
      });
    } finally {
      setLocalLoading(false);
    }
  };

  const handleAadharStart = async () => {
    try {
      if (!formData.aadharNumber || formData.aadharNumber.length !== 12) {
        toast({
          title: "Invalid Aadhar Number",
          description: "Please enter a valid 12-digit Aadhar number.",
          variant: "destructive",
        });
        return;
      }

      const result = await sendAadharOTP(formData.aadharNumber);
      
      if (result.success) {
        setTxnId(result.txnId || '');
        setAadharStep('otp');
        toast({
          title: "OTP Sent",
          description: result.message,
        });
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAadharAuth = async () => {
    try {
      setLocalLoading(true);
      // For demo purposes, accept OTP "123456"
      if (formData.otp !== "123456") {
        toast({
          title: "Invalid OTP",
          description: "For demo, please use OTP: 123456",
          variant: "destructive",
        });
        return;
      }

      const result = await signInWithAadhar(formData.aadharNumber, formData.otp);
      completeAuthAndRoute(result);
      toast({
        title: "Success!",
        description: "Signed in with Aadhar successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLocalLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLocalLoading(true);
      let result;
      if (isLogin) {
        result = await signInWithEmail(formData.email, formData.password);
      } else {
        result = await registerWithEmail(
          formData.email,
          formData.password,
          formData.displayName,
          formData.role
        );
      }

      // Ensure role is properly set for new registrations
      if (!isLogin && result) {
        result.role = formData.role;
      }

      completeAuthAndRoute(result);
      toast({
        title: "Success!",
        description: isLogin
          ? "Signed in successfully."
          : "Account created successfully.",
      });
    } catch (error: any) {
      console.error("Authentication error:", error);
      
      let errorMessage = `Failed to ${isLogin ? "sign in" : "create account"}.`;
      
      // Handle specific Firebase errors
      if (error?.code) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = "This email is already registered. Please sign in instead or use a different email.";
            // Automatically switch to login mode
            setIsLogin(true);
            break;
          case 'auth/operation-not-allowed':
            errorMessage = "Email/Password authentication is not enabled in Firebase Console. Please enable it in Firebase Authentication settings.";
            break;
          case 'auth/invalid-credential':
            errorMessage = "Invalid email or password. Please check your credentials and try again.";
            break;
          case 'auth/user-disabled':
            errorMessage = "This account has been disabled. Please contact support.";
            break;
          case 'auth/weak-password':
            errorMessage = "Password is too weak. Please use at least 6 characters.";
            break;
          case 'auth/invalid-email':
            errorMessage = "Please enter a valid email address.";
            break;
          case 'auth/user-not-found':
            errorMessage = "No account found with this email. Please sign up first.";
            break;
          case 'auth/wrong-password':
            errorMessage = "Incorrect password. Please try again.";
            break;
          case 'auth/too-many-requests':
            errorMessage = "Too many failed attempts. Please try again later.";
            break;
          default:
            errorMessage = error.message || errorMessage;
        }
      }
      
      toast({
        title: "Authentication Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLocalLoading(false);
    }
  };

  if (showAadhar) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 relative">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <CreditCard className="h-5 w-5" />
              Aadhar Authentication
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {aadharStep === 'input' ? (
              <>
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
                        aadharNumber: e.target.value.replace(/\D/g, '').slice(0, 12),
                      }))
                    }
                    maxLength={12}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter your 12-digit Aadhar number
                  </p>
                </div>
                <Button
                  onClick={handleAadharStart}
                  className="w-full"
                  disabled={loading || formData.aadharNumber.length !== 12}
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </Button>
              </>
            ) : (
              <>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-green-800">
                    OTP sent to Aadhar number ending with **** {formData.aadharNumber.slice(-4)}
                  </p>
                </div>
                <div>
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={formData.otp}
                    onChange={(e) =>
                      setFormData((prev) => ({ 
                        ...prev, 
                        otp: e.target.value.replace(/\D/g, '').slice(0, 6)
                      }))
                    }
                    maxLength={6}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    For demo, use OTP: <strong>123456</strong>
                  </p>
                </div>
                <Button
                  onClick={handleAadharAuth}
                  className="w-full"
                  disabled={loading || formData.otp.length !== 6}
                >
                  {loading ? "Verifying..." : "Verify & Sign In"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setAadharStep('input');
                    setFormData(prev => ({ ...prev, otp: '' }));
                  }}
                  className="w-full"
                >
                  Change Aadhar Number
                </Button>
              </>
            )}
            <Button
              variant="outline"
              onClick={() => {
                setShowAadhar(false);
                setAadharStep('input');
                setFormData(prev => ({ ...prev, aadharNumber: '', otp: '' }));
              }}
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      {/* Test Accounts Toggle */}
      <div className="absolute top-4 left-4 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowTestAccounts(!showTestAccounts)}
        >
          <TestTube className="h-4 w-4 mr-2" />
          {showTestAccounts ? "Live Login" : "Demo Accounts"}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowDiagnostics(!showDiagnostics)}
        >
          <Wifi className="h-4 w-4 mr-2" />
          {showDiagnostics ? "Hide Debug" : "Debug Connection"}
        </Button>
      </div>

      {showTestAccounts ? (
        <TestAccounts />
      ) : showDiagnostics ? (
        <FirestoreConnectionDiagnostics />
      ) : (
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
                    required={!isLogin}
                  />
                </div>
                <div>
                  <Label htmlFor="role">Account Type</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value: "patient" | "doctor") =>
                      setFormData((prev) => ({ ...prev, role: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="patient">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Patient
                        </div>
                      </SelectItem>
                      <SelectItem value="doctor">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Doctor
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
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
      )}
    </div>
  );
}
