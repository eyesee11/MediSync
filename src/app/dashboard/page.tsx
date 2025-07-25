"use client";

import * as React from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { useFirebaseAuth } from "@/contexts/firebase-auth-context";
import { PatientDashboard } from "@/components/dashboard/patient-dashboard";
import { DoctorReferrals } from "@/components/dashboard/doctor-referrals";

export default function DashboardPage() {
  const { user: localUser } = useAuth();
  const { user: firebaseUser } = useFirebaseAuth();
  
  // Use Firebase user data if available, fall back to local user
  const user = firebaseUser || localUser;

  if (user?.role === "doctor") {
    return <DoctorReferrals />;
  } else {
    return <PatientDashboard />;
  }
}
