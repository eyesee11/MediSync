"use client";

import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebarContent } from "./app-sidebar-content";
import { useFirebaseAuth } from "@/contexts/firebase-auth-context";
import { ThemeToggle } from "@/components/theme-toggle";
import { PageTransition } from "@/components/ui/page-transition";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useFirebaseAuth();
  const pathname = usePathname();

  const isAuthRoute = pathname === "/login";
  const isLandingPage = pathname === "/";
  const isContactPage = pathname === "/contact";
  const isOnboardingPage =
    pathname === "/patient-onboarding" || pathname === "/doctor-onboarding";

  if (isAuthRoute || isLandingPage || isContactPage || isOnboardingPage) {
    return (
      <main>
        <PageTransition>{children}</PageTransition>
      </main>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // The SidebarProvider needs to wrap the entire authenticated layout
  return (
    <SidebarProvider>
      <AuthenticatedLayout>{children}</AuthenticatedLayout>
    </SidebarProvider>
  );
}

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { user } = useFirebaseAuth();

  return (
    <>
      {user && (
        <Sidebar variant="sidebar" collapsible="icon">
          <AppSidebarContent />
        </Sidebar>
      )}
      <SidebarInset>
        <div className="absolute top-4 right-4 z-50">
          <ThemeToggle />
        </div>
        <div className="p-4 sm:p-6 lg:p-8">
          <PageTransition>{children}</PageTransition>
        </div>
      </SidebarInset>
    </>
  );
}
