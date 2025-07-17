"use client";

import * as React from "react";
import { useRouter } from 'next/navigation';
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Logo } from "@/components/icons/logo";
import { FcGoogle } from "react-icons/fc";
import { Fingerprint } from "lucide-react";

export function AuthPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [role, setRole] = React.useState<"doctor" | "patient">("doctor");
  const [name, setName] = React.useState("");

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    login({ name: role === 'doctor' ? 'Dr. Ananya Reddy' : 'Ajay Singh', role });
    router.push('/dashboard');
  };

  const handleRegister = (event: React.FormEvent) => {
    event.preventDefault();
     if (!name) {
      // Simple validation
      alert("Please enter your name.");
      return;
    }
    login({ name, role });
    router.push('/dashboard');
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
            <Logo className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold">MediSync Hub</h1>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
             <TabsContent value="login">
                <form onSubmit={handleLogin}>
                     <Tabs defaultValue="doctor" onValueChange={(value) => setRole(value as "doctor" | "patient")} className="w-full">
                        <CardHeader>
                            <CardTitle>Sign In</CardTitle>
                            <CardDescription>Select your role and sign in to continue.</CardDescription>
                        </CardHeader>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="doctor">Doctor</TabsTrigger>
                            <TabsTrigger value="patient">Patient</TabsTrigger>
                        </TabsList>
                        <TabsContent value="doctor">
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                <Label htmlFor="doctor-email-login">Email</Label>
                                <Input id="doctor-email-login" type="email" placeholder="doctor@medisync.com" defaultValue="doctor@medisync.com" required />
                                </div>
                                <div className="space-y-2">
                                <Label htmlFor="doctor-password-login">Password</Label>
                                <Input id="doctor-password-login" type="password" defaultValue="password" required />
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="patient">
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                <Label htmlFor="patient-email-login">Email</Label>
                                <Input id="patient-email-login" type="email" placeholder="patient@email.com" defaultValue="patient@email.com" required />
                                </div>
                                <div className="space-y-2">
                                <Label htmlFor="patient-password-login">Password</Label>
                                <Input id="patient-password-login" type="password" defaultValue="password" required />
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                    <Button type="submit" className="w-full">
                        Sign In as {role === 'doctor' ? 'a Doctor' : 'a Patient'}
                    </Button>
                </form>
             </TabsContent>
             <TabsContent value="register">
                 <form onSubmit={handleRegister}>
                     <Tabs defaultValue="doctor" onValueChange={(value) => setRole(value as "doctor" | "patient")} className="w-full">
                        <CardHeader>
                            <CardTitle>Create Account</CardTitle>
                            <CardDescription>Select your role and fill in your details to register.</CardDescription>
                        </CardHeader>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="doctor">Doctor</TabsTrigger>
                            <TabsTrigger value="patient">Patient</TabsTrigger>
                        </TabsList>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name-register">Full Name</Label>
                                <Input id="name-register" type="text" placeholder="e.g. Priya Sharma" required value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email-register">Email</Label>
                                <Input id="email-register" type="email" placeholder="your.email@example.com" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password-register">Password</Label>
                                <Input id="password-register" type="password" required />
                            </div>
                        </div>
                    </Tabs>
                    <Button type="submit" className="w-full">
                        Register as {role === 'doctor' ? 'a Doctor' : 'a Patient'}
                    </Button>
                </form>
             </TabsContent>
        </Tabs>
        
        <div className="relative my-6">
          <Separator />
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <Button variant="outline"><FcGoogle className="mr-2 h-5 w-5" /> Google</Button>
            <Button variant="outline"><Fingerprint className="mr-2 h-5 w-5 text-blue-800" /> Aadhar</Button>
        </div>

      </CardContent>
      <CardFooter className="flex-col text-xs text-center">
         <p className="text-muted-foreground">
            This is a simulated auth system. No real data is processed.
         </p>
         <p className="text-muted-foreground mt-2">
            By signing in, you agree to our Terms of Service.
         </p>
      </CardFooter>
    </Card>
  );
}
