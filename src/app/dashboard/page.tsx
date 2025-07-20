"use client";

import * as React from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { PatientDashboard } from "@/components/dashboard/patient-dashboard";
import { DoctorReferrals } from "@/components/dashboard/doctor-referrals";

export default function DashboardPage() {
  const { user } = useAuth();

  if (user?.role === "doctor") {
    return <DoctorReferrals />;
  } else {
    return <PatientDashboard />;
  }
}
