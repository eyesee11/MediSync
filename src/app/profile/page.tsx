
"use client"

import * as React from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Save, UserCircle } from "lucide-react"

export default function ProfilePage() {
    const { user } = useAuth()
    const { toast } = useToast()

    // Mock state for profile data
    const [profileData, setProfileData] = React.useState({
        specialty: "",
        licenseNumber: "",
        experience: "",
        currentHospital: "",
        pastHospitals: "",
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setProfileData(prev => ({ ...prev, [id]: value }));
    }

    const handleSelectChange = (value: string) => {
        setProfileData(prev => ({ ...prev, specialty: value }));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically save the data to a backend
        console.log("Saving profile data:", profileData);
        toast({
            title: "Profile Saved!",
            description: "Your professional details have been updated successfully.",
        })
    }
    
    // Only render for doctors
    if (user?.role !== 'doctor') {
        return (
             <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Access Denied</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">This page is only available for users with a 'Doctor' role.</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <UserCircle className="h-8 w-8 text-primary" />
                    Doctor Profile
                </h1>
                <p className="text-muted-foreground">
                    Complete your professional profile to be listed and found by patients.
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Professional Information</CardTitle>
                        <CardDescription>
                            Please provide your details accurately. This information will be verified.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="specialty">Specialty</Label>
                            <Select onValueChange={handleSelectChange} value={profileData.specialty}>
                                <SelectTrigger id="specialty">
                                    <SelectValue placeholder="Select your specialty" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="physician">Physician</SelectItem>
                                    <SelectItem value="cardiologist">Cardiologist</SelectItem>
                                    <SelectItem value="dermatologist">Dermatologist</SelectItem>
                                    <SelectItem value="pediatrician">Pediatrician</SelectItem>
                                    <SelectItem value="neurologist">Neurologist</SelectItem>
                                    <SelectItem value="orthopedist">Orthopedist</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="licenseNumber">Medical License Number</Label>
                            <Input id="licenseNumber" placeholder="e.g., 123456789" value={profileData.licenseNumber} onChange={handleInputChange} required />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="experience">Years of Experience</Label>
                            <Input id="experience" type="number" placeholder="e.g., 10" value={profileData.experience} onChange={handleInputChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="currentHospital">Current Hospital / Clinic</Label>
                            <Input id="currentHospital" placeholder="e.g., City General Hospital" value={profileData.currentHospital} onChange={handleInputChange} required />
                        </div>
                         <div className="md:col-span-2 space-y-2">
                            <Label htmlFor="pastHospitals">Past Workplaces (optional)</Label>
                            <Textarea id="pastHospitals" placeholder="List previous hospitals or clinics, separated by commas" value={profileData.pastHospitals} onChange={handleInputChange} />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit">
                            <Save className="mr-2" />
                            Save Profile
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    )
}
