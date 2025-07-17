"use client"

import * as React from "react"
import { useAuth } from "@/components/auth/auth-provider"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import {
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Activity, ShieldCheck, GitMerge, Users, User, X, FileText, HeartPulse, Link2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

const doctorPatients = [
  { id: "PAT-001", name: "Ajay Singh", dob: "1985-05-20" },
  { id: "PAT-002", name: "Priya Sharma", dob: "1992-11-30" },
  { id: "PAT-003", name: "Rohan Mehta", dob: "1978-02-14" },
];

const patientChartData = {
  "PAT-001": [
    { day: "Monday", synced: 12, failed: 1 },
    { day: "Tuesday", synced: 15, failed: 0 },
    { day: "Wednesday", synced: 10, failed: 2 },
    { day: "Thursday", synced: 18, failed: 1 },
    { day: "Friday", synced: 20, failed: 0 },
    { day: "Saturday", synced: 8, failed: 0 },
    { day: "Sunday", synced: 5, failed: 1 },
  ],
  "PAT-002": [
    { day: "Monday", synced: 5, failed: 0 },
    { day: "Tuesday", synced: 8, failed: 1 },
    { day: "Wednesday", synced: 6, failed: 0 },
    { day: "Thursday", synced: 9, failed: 0 },
    { day: "Friday", synced: 11, failed: 1 },
    { day: "Saturday", synced: 4, failed: 0 },
    { day: "Sunday", synced: 3, failed: 0 },
  ],
   "PAT-003": [
    { day: "Monday", synced: 25, failed: 3 },
    { day: "Tuesday", synced: 30, failed: 1 },
    { day: "Wednesday", synced: 28, failed: 2 },
    { day: "Thursday", synced: 35, failed: 0 },
    { day: "Friday", synced: 40, failed: 1 },
    { day: "Saturday", synced: 15, failed: 0 },
    { day: "Sunday", synced: 12, failed: 2 },
  ],
};

const patientRecentActivities = {
  "PAT-001": [
    { user: "Dr. Ananya Reddy", action: "Accessed Lab Results #789012", timestamp: "2 mins ago", status: "Success" },
    { user: "System", action: "EHR sync with 'City General Hospital' complete", timestamp: "15 mins ago", status: "Success" },
  ],
  "PAT-002": [
      { user: "Dr. Ananya Reddy", action: "Viewed Consultation Note", timestamp: "1 day ago", status: "Success"},
      { user: "System", action: "Failed to sync record #543210 from 'Oak Valley Clinic'", timestamp: "2 days ago", status: "Failed" },
  ],
   "PAT-003": [
      { user: "Admin", action: "Updated patient contact info", timestamp: "4 hours ago", status: "Success"},
      { user: "Dr. Ananya Reddy", action: "Requested access to imaging records", timestamp: "5 hours ago", status: "Pending" },
  ],
}

const globalChartData = [
  { day: "Monday", synced: 58, failed: 8 },
  { day: "Tuesday", synced: 72, failed: 12 },
  { day: "Wednesday", synced: 65, failed: 5 },
  { day: "Thursday", synced: 89, failed: 3 },
  { day: "Friday", synced: 95, failed: 2 },
  { day: "Saturday", synced: 43, failed: 1 },
  { day: "Sunday", synced: 32, failed: 4 },
];

const globalRecentActivities = [
  { user: "Dr. Anya Sharma", action: "Accessed patient record #789012", timestamp: "2 mins ago", status: "Success" },
  { user: "System", action: "EHR sync with 'City General Hospital' complete", timestamp: "15 mins ago", status: "Success" },
  { user: "Admin", action: "Updated role for user 'mark.reid'", timestamp: "1 hour ago", status: "Success" },
  { user: "System", action: "Failed to sync record #543210 from 'Oak Valley Clinic'", timestamp: "2 hours ago", status: "Failed" },
  { user: "Dr. Vikram Rao", action: "Transferred records for patient #345678 to 'Metro Specialty'", timestamp: "5 hours ago", status: "Success" },
]

const chartConfig = {
  synced: {
    label: "Synced",
    color: "hsl(var(--chart-1))",
  },
  failed: {
    label: "Failed",
    color: "hsl(var(--destructive))",
  },
} satisfies ChartConfig


export default function DashboardPage() {
  const { user } = useAuth();
  const [selectedPatient, setSelectedPatient] = React.useState<any>(null);

  const isDoctor = user?.role === 'doctor';
  const chartData = selectedPatient ? patientChartData[selectedPatient.id as keyof typeof patientChartData] : (user?.role === 'patient' ? patientChartData['PAT-001'] : globalChartData);
  const recentActivities = selectedPatient ? patientRecentActivities[selectedPatient.id as keyof typeof patientRecentActivities] : (user?.role === 'patient' ? patientRecentActivities['PAT-001'] : globalRecentActivities);

  const renderDoctorDashboard = () => (
     <div className="flex flex-col gap-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {selectedPatient ? `Patient Dashboard: ${selectedPatient.name}` : "Doctor Dashboard"}
          </h1>
          <p className="text-muted-foreground">
            {selectedPatient ? `Viewing details for patient ID: ${selectedPatient.id}` : "Overview of your assigned patients and system activity."}
          </p>
        </div>
        {selectedPatient && (
          <Button variant="outline" onClick={() => setSelectedPatient(null)}>
            <X className="mr-2 h-4 w-4" /> Back to Global View
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Records Synced (24h)
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{selectedPatient ? '12' : '12,542'}</div>
            <p className="text-xs text-muted-foreground">
              {selectedPatient ? '+2 since yesterday' : '+5.2% from last 24 hours'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active EHR Integrations
            </CardTitle>
            <GitMerge className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{selectedPatient ? '2' : '14'}</div>
            <p className="text-xs text-muted-foreground">
              {selectedPatient ? 'City General, Oak Valley' : '2 new integrations pending'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Status</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Compliant</div>
            <p className="text-xs text-muted-foreground">
              Last audit: {selectedPatient ? 'yesterday' : '2 days ago'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{selectedPatient ? 'Provider' : 'Active Users'}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{selectedPatient ? 'You' : '2,104'}</div>
            <p className="text-xs text-muted-foreground">
             {selectedPatient ? `Logged in as ${user?.name}` : '+180 since last month'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <Card className="md:col-span-1">
            <CardHeader>
                <CardTitle>My Patients</CardTitle>
                <CardDescription>Select a patient to view their specific dashboard.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="flex flex-col gap-2">
                    {doctorPatients.map(patient => (
                        <Button 
                            key={patient.id}
                            variant={selectedPatient?.id === patient.id ? "secondary" : "ghost"}
                            className="justify-start gap-2"
                            onClick={() => setSelectedPatient(patient)}
                        >
                            <User className="h-4 w-4" /> {patient.name}
                        </Button>
                    ))}
                 </div>
            </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Data Sync Activity</CardTitle>
            <CardDescription>
              {selectedPatient ? `Records synced vs failed for ${selectedPatient.name} in the last 7 days.` : 'Records synced vs failed in the last 7 days.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64 w-full">
              <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="synced" fill="var(--color-synced)" radius={4} />
                <Bar dataKey="failed" fill="var(--color-failed)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      
       <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
                {selectedPatient ? `A log of recent actions for ${selectedPatient.name}.` : 'A log of recent system and user actions.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivities.map((activity, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{activity.user}</TableCell>
                    <TableCell>{activity.action}</TableCell>
                    <TableCell className="text-muted-foreground">{activity.timestamp}</TableCell>
                    <TableCell>
                      <Badge variant={activity.status === "Success" ? "default" : activity.status === "Failed" ? "destructive" : "secondary"}
                       className={activity.status === "Success" ? "bg-green-100 text-green-800" : ""}>
                        {activity.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
    </div>
  )

   const renderPatientDashboard = () => (
     <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Health Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}! Here's an overview of your health activity.
        </p>
      </div>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Conditions
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-base font-semibold">Hypertension</div>
            <p className="text-xs text-muted-foreground">
              Type 2 Diabetes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Records Accessed
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3 times</div>
            <p className="text-xs text-muted-foreground">
              in the last 24 hours
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connected Providers</CardTitle>
            <Link2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              Dr. Reddy, Dr. Rao
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Status</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Compliant</div>
            <p className="text-xs text-muted-foreground">
              All records secure
            </p>
          </CardContent>
        </Card>
      </div>

       <div className="grid gap-8 md:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Data Sync Activity</CardTitle>
            <CardDescription>
              Your personal records synced vs failed in the last 7 days.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64 w-full">
              <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="synced" fill="var(--color-synced)" radius={4} />
                <Bar dataKey="failed" fill="var(--color-failed)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

       <Card>
          <CardHeader>
            <CardTitle>Recent Activity on Your Records</CardTitle>
            <CardDescription>
               A log of recent actions related to your health data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivities.map((activity, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{activity.user}</TableCell>
                    <TableCell>{activity.action}</TableCell>
                    <TableCell className="text-muted-foreground">{activity.timestamp}</TableCell>
                    <TableCell>
                      <Badge variant={activity.status === "Success" ? "default" : activity.status === "Failed" ? "destructive" : "secondary"}
                       className={activity.status === "Success" ? "bg-green-100 text-green-800" : ""}>
                        {activity.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </div>
   )

  return isDoctor ? renderDoctorDashboard() : renderPatientDashboard();
}
