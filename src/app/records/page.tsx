"use client"

import * as React from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useSidebar } from "@/components/ui/sidebar"
import { FileText, User, ShieldCheck, Download, CheckCircle, XCircle, Hourglass, Upload, Search, FileUp, FileClock, Send } from "lucide-react"

const patientRecords = [
    { id: "REC-001", type: "Lab Results", date: "2024-07-15", details: "Blood Panel", status: "Available" },
    { id: "REC-002", type: "Consultation Note", date: "2024-07-10", details: "Follow-up with Dr. Reddy", status: "Available" },
    { id: "REC-003", type: "Imaging", date: "2024-07-08", details: "Chest X-Ray", status: "Available" },
    { id: "REC-004", type: "Prescription", date: "2024-07-10", details: "Metformin 500mg", status: "Available" },
]

const patients = [
    { id: "PAT-001", name: "Ajay Singh", dob: "1985-05-20" },
    { id: "PAT-002", name: "Priya Sharma", dob: "1992-11-30" },
    { id: "PAT-003", name: "Rohan Mehta", dob: "1978-02-14" },
]

export default function RecordsPage() {
    const { user } = useAuth()
    const { toast } = useToast()
    const { setPendingApprovals } = useSidebar()
    const [selectedPatient, setSelectedPatient] = React.useState<any>(null)
    const [isConsentModalOpen, setIsConsentModalOpen] = React.useState(false)
    const [consentStatus, setConsentStatus] = React.useState<"pending" | "granted" | "denied" | "request_sent">("pending")
    const [consentAction, setConsentAction] = React.useState<"view" | "upload">("view")
    const [hasAccess, setHasAccess] = React.useState(false)
    const [searchId, setSearchId] = React.useState("")
    const [foundPatient, setFoundPatient] = React.useState<any>(null)
    const [searched, setSearched] = React.useState(false)

    // State for patient document upload
    const [uploadedFiles, setUploadedFiles] = React.useState<any[]>([]);
    const [documentName, setDocumentName] = React.useState("");
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

    // State for doctor uploading for patient
    const [isDoctorUploadModalOpen, setIsDoctorUploadModalOpen] = React.useState(false);
    const [doctorUploadDocName, setDoctorUploadDocName] = React.useState("");
    const [doctorUploadFile, setDoctorUploadFile] = React.useState<File | null>(null);


    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearched(true);
        const patient = patients.find(p => p.id === searchId);
        setFoundPatient(patient || null);
        setHasAccess(false);
        if (!patient) {
            toast({
                variant: "destructive",
                title: "Patient not found",
                description: `No patient found with ID: ${searchId}`,
            })
        }
    }

    const handleViewRecords = (patient: any) => {
        setSelectedPatient(patient)
        setConsentAction("view")
        setIsConsentModalOpen(true)
        setConsentStatus("pending")
    }
    
    const handleRequestConsent = () => {
        if (!setPendingApprovals) return;
        setConsentStatus("request_sent");

        const approvalRequest = {
            name: consentAction === 'view' ? `Access Records` : doctorUploadDocName,
            patient: selectedPatient.name,
            id: Date.now(),
            type: consentAction === 'view' ? 'Access Request' : 'Document Upload',
            requester: user?.name,
        }

        setPendingApprovals((prev: any) => [...prev, approvalRequest])
        
        setTimeout(() => {
            setIsConsentModalOpen(false);
            if(consentAction === 'upload') {
                setIsDoctorUploadModalOpen(false);
            }
            toast({
                title: "Request Sent",
                description: `Your request has been sent to ${selectedPatient.name} for approval.`
            })
        }, 1500);
    }

    const handleGrantConsent = () => { // This would be called by the patient
        setConsentStatus("granted")
        setTimeout(() => {
            setIsConsentModalOpen(false)
            if (consentAction === 'view') {
                 setHasAccess(true)
            } else if (consentAction === 'upload') {
                // This logic is now handled in the sidebar approval action
                toast({
                    title: "Approval Granted",
                    description: `Consent granted to upload ${doctorUploadDocName} for ${selectedPatient.name}.`
                })
                setIsDoctorUploadModalOpen(false)
            }
        }, 1500)
    }

    const handleDenyConsent = () => {
        setConsentStatus("denied")
        setTimeout(() => {
            setIsConsentModalOpen(false)
        }, 1500)
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
        }
    };

     const handleDoctorFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setDoctorUploadFile(event.target.files[0]);
        }
    };

    const handleFileUpload = (event: React.FormEvent) => {
        event.preventDefault();
        if (selectedFile && documentName) {
            const newFile = {
                id: `USER-DOC-${uploadedFiles.length + 1}`,
                name: documentName,
                type: selectedFile.type,
                date: new Date().toISOString().split('T')[0],
            };
            setUploadedFiles([...uploadedFiles, newFile]);
            toast({
                title: "File Uploaded",
                description: `${documentName} has been successfully uploaded.`,
            });
            // Reset form
            setDocumentName("");
            setSelectedFile(null);
            const fileInput = document.getElementById('file-upload') as HTMLInputElement;
            if (fileInput) fileInput.value = "";
        } else {
            toast({
                variant: "destructive",
                title: "Upload Failed",
                description: "Please provide a document name and select a file.",
            });
        }
    };

    const handleDoctorUploadRequest = (e: React.FormEvent) => {
        e.preventDefault();
        if (doctorUploadDocName && doctorUploadFile) {
            setConsentAction("upload");
            setIsConsentModalOpen(true);
            setConsentStatus("pending");
        } else {
            toast({
                variant: "destructive",
                title: "Missing Information",
                description: "Please provide a document name and select a file.",
            });
        }
    };

    const renderDoctorView = () => (
        <Card>
            <CardHeader>
                <CardTitle>Patient Record Search</CardTitle>
                <CardDescription>Enter a unique patient ID to find their records.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSearch} className="flex items-end gap-4 mb-6">
                    <div className="flex-grow">
                        <Label htmlFor="patient-id">Patient ID</Label>
                        <Input
                            id="patient-id"
                            placeholder="e.g., PAT-001"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                        />
                    </div>
                    <Button type="submit"><Search className="mr-2" /> Search</Button>
                </form>

                {searched && foundPatient && (
                    <Card className="bg-muted/50">
                        <CardHeader>
                            <CardTitle>Patient Found: {foundPatient.name}</CardTitle>
                             <CardDescription>ID: {foundPatient.id} | DOB: {foundPatient.dob}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-end gap-2">
                           <Button variant="outline" onClick={() => { setSelectedPatient(foundPatient); setIsDoctorUploadModalOpen(true); }}>
                                <FileUp className="mr-2" /> Upload for Patient
                            </Button>
                           <Button onClick={() => handleViewRecords(foundPatient)}>View Records</Button>
                        </CardContent>
                    </Card>
                )}
                 {searched && !foundPatient && (
                    <div className="text-center py-8 text-muted-foreground">
                        <p>No patient found for ID "{searchId}". Please try again.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );

    const renderPatientRecords = (records: any[]) => (
         <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Record ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {records.map(record => (
                    <TableRow key={record.id}>
                        <TableCell className="font-mono">{record.id}</TableCell>
                        <TableCell>{record.type}</TableCell>
                        <TableCell>{record.date}</TableCell>
                        <TableCell>{record.details || record.name}</TableCell>
                        <TableCell><Badge variant="secondary" className="bg-green-100 text-green-800">Available</Badge></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );

    const renderPatientView = () => (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>My Medical Records</CardTitle>
                    <CardDescription>Here is a list of your available medical records.</CardDescription>
                </CardHeader>
                <CardContent>
                   {renderPatientRecords([...patientRecords, ...uploadedFiles.map(f => ({...f, details: f.name, status: "Available"}))])}
                </CardContent>
                <CardFooter>
                    <Button variant="outline"><Download className="mr-2" /> Download All</Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Upload New Document</CardTitle>
                    <CardDescription>Add a new document to your personal records.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleFileUpload} className="space-y-4">
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="doc-name">Document Name</Label>
                            <Input 
                                id="doc-name" 
                                placeholder="e.g., Insurance Card"
                                value={documentName}
                                onChange={(e) => setDocumentName(e.target.value)}
                             />
                        </div>
                         <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="file-upload">File</Label>
                            <Input id="file-upload" type="file" onChange={handleFileChange} />
                        </div>
                        <Button type="submit"><Upload className="mr-2" /> Upload Document</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Records Access</h1>
                <p className="text-muted-foreground">
                    {user?.role === 'doctor' 
                        ? "Securely access patient records through blockchain-verified consent."
                        : "Manage and view your personal medical records."}
                </p>
            </div>

            {hasAccess && selectedPatient ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Viewing Records for {selectedPatient.name}</CardTitle>
                        <CardDescription>Access granted. Patient ID: {selectedPatient.id}</CardDescription>
                    </CardHeader>
                    <CardContent>{renderPatientRecords(patientRecords)}</CardContent>
                    <CardFooter>
                        <Button onClick={() => { setHasAccess(false); setSelectedPatient(null); setSearchId(''); setFoundPatient(null); setSearched(false);}}>Back to Patient Search</Button>
                    </CardFooter>
                </Card>
            ) : (
                user?.role === 'doctor' ? renderDoctorView() : renderPatientView()
            )}

            <Dialog open={isConsentModalOpen} onOpenChange={setIsConsentModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Consent Required</DialogTitle>
                        <DialogDescription>
                            To {consentAction} records for {selectedPatient?.name}, patient consent is required.
                        </DialogDescription>
                    </DialogHeader>
                    {consentStatus === "pending" && (
                         <div className="space-y-4 py-4">
                             {consentAction === 'upload' && (
                                <Card className="p-4 bg-muted/50">
                                    <CardHeader className="p-0 pb-2">
                                        <CardTitle className="text-lg flex items-center gap-2"><FileClock /> Pending Upload</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <p className="font-semibold">{doctorUploadDocName}</p>
                                        <p className="text-sm text-muted-foreground">{doctorUploadFile?.name}</p>
                                    </CardContent>
                                </Card>
                            )}
                            <Card className="p-4 bg-muted/50">
                                <CardHeader className="p-0 pb-2">
                                    <CardTitle className="text-lg flex items-center gap-2"><User /> Requesting Provider</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <p className="font-semibold">{user?.name}</p>
                                    <p className="text-sm text-muted-foreground">Doctor</p>
                                </CardContent>
                            </Card>
                             <Card className="p-4 bg-muted/50">
                                 <CardHeader className="p-0 pb-2">
                                     <CardTitle className="text-lg flex items-center gap-2"><FileText /> Patient Records</CardTitle>
                                 </CardHeader>
                                 <CardContent className="p-0">
                                     <p className="font-semibold">{selectedPatient?.name}</p>
                                     <p className="text-sm text-muted-foreground">ID: {selectedPatient?.id}</p>
                                 </CardContent>
                             </Card>
                         </div>
                    )}
                    {consentStatus === "request_sent" && (
                        <div className="flex flex-col items-center justify-center space-y-4 py-8 text-center">
                            <Send className="h-16 w-16 text-primary" />
                            <h3 className="text-xl font-semibold">Request Sent!</h3>
                            <p className="text-muted-foreground">Your request has been sent to the patient for approval.</p>
                        </div>
                    )}
                     {consentStatus === "denied" && (
                        <div className="flex flex-col items-center justify-center space-y-4 py-8 text-center">
                            <XCircle className="h-16 w-16 text-destructive" />
                            <h3 className="text-xl font-semibold">Consent Denied</h3>
                            <p className="text-muted-foreground">The transaction was rejected. You cannot access these records.</p>
                        </div>
                    )}
                    <DialogFooter className="sm:justify-between gap-2">
                        <Badge variant="outline"><ShieldCheck className="mr-2 h-4 w-4"/>Secured by MediSync</Badge>
                        {consentStatus === "pending" && (
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => setIsConsentModalOpen(false)}>Cancel</Button>
                                <Button onClick={handleRequestConsent}>Send Request</Button>
                            </div>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isDoctorUploadModalOpen} onOpenChange={setIsDoctorUploadModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Upload Document for {selectedPatient?.name}</DialogTitle>
                        <DialogDescription>
                            Select a file and provide a name. This will require the patient's consent.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleDoctorUploadRequest} className="space-y-4 py-4">
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="doc-upload-name">Document Name</Label>
                            <Input
                                id="doc-upload-name"
                                placeholder="e.g., Specialist Referral"
                                value={doctorUploadDocName}
                                onChange={(e) => setDoctorUploadDocName(e.target.value)}
                            />
                        </div>
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="doc-upload-file">File</Label>
                            <Input id="doc-upload-file" type="file" onChange={handleDoctorFileChange} />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDoctorUploadModalOpen(false)}>Cancel</Button>
                            <Button type="submit">Request Upload Consent</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
