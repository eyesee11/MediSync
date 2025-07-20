"use client";

import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebarContent } from "./app-sidebar-content";
import { useAuth } from "@/components/auth/auth-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { PageTransition } from "@/components/ui/page-transition";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();

  const isAuthRoute = pathname === "/login";
  const isLandingPage = pathname === "/";

  if (isAuthRoute || isLandingPage) {
    return (
      <main>
        <PageTransition>{children}</PageTransition>
      </main>
    );
  }

  // The SidebarProvider needs to wrap the entire authenticated layout
  // to ensure its context (like pendingApprovals) is available everywhere.
  return (
    <SidebarProvider>
      <AuthenticatedLayout>{children}</AuthenticatedLayout>
    </SidebarProvider>
  );
}

// This is a new helper component to keep the layout clean.
// It assumes it's rendered within a SidebarProvider.
function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated && (
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
