"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  LogOut,
  FileText,
  HeartPulse,
  Bot,
  Search as SearchIcon,
  FileClock,
  Check,
  X,
  FileUp,
  KeyRound,
  UserCircle,
  Shield,
  MessageCircle,
} from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useAuth } from "@/components/auth/auth-provider";
import { useToast } from "@/hooks/use-toast";
import * as React from "react";

const doctorMenuItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    external: false,
  },
  {
    href: "/records",
    label: "Patient Records",
    icon: FileText,
    external: false,
  },
  {
    href: "/verification",
    label: "Verify Credentials",
    icon: Shield,
    external: false,
  },
];

const patientMenuItems = [
  { href: "/dashboard", label: "My Health", icon: HeartPulse, external: false },
  { href: "/records", label: "My Records", icon: FileText, external: false },
  {
    href: "/search",
    label: "Find a Doctor",
    icon: SearchIcon,
    external: false,
  },
  { href: "/chatbot", label: "Ask AI", icon: Bot, external: false },
  {
    href: "/verification",
    label: "Verify Insurance",
    icon: Shield,
    external: false,
  },
];

export function AppSidebarContent() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const { pendingApprovals, setPendingApprovals } = useSidebar();

  const menuItems =
    user?.role === "doctor" ? doctorMenuItems : patientMenuItems;

  const handleApproval = (id: number, approved: boolean, request: any) => {
    if (!setPendingApprovals) return;
    setPendingApprovals((prev: any[]) => prev.filter((p) => p.id !== id));

    const toastMessage =
      request.type === "Document Upload"
        ? approved
          ? `${request.name} has been added to your records.`
          : `The document ${request.name} was rejected.`
        : approved
        ? `Access to your records has been granted to ${request.requester}.`
        : `Record access request from ${request.requester} was rejected.`;

    toast({
      title: approved ? "Request Approved" : "Request Rejected",
      description: toastMessage,
      variant: approved ? "default" : "destructive",
    });
  };

  const documentUploads =
    pendingApprovals?.filter((p: any) => p.type === "Document Upload") || [];
  const accessRequests =
    pendingApprovals?.filter((p: any) => p.type === "Access Request") || [];

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="font-semibold text-lg">MediSync Hub</span>
          </Link>
          <SidebarTrigger className="hidden md:flex" />
        </div>
      </SidebarHeader>
      <SidebarContent className="flex-grow flex flex-col">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              {item.external ? (
                <SidebarMenuButton
                  asChild={false}
                  isActive={false}
                  tooltip={item.label}
                  onClick={() => window.open(item.href, "_blank")}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              ) : (
                <Link href={item.href}>
                  <SidebarMenuButton
                    asChild={false}
                    isActive={
                      pathname === item.href ||
                      (item.href !== "/dashboard" &&
                        pathname.startsWith(item.href))
                    }
                    tooltip={item.label}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        <div className="flex-grow" />

        {user?.role === "patient" && (
          <SidebarGroup className="mt-auto group-data-[collapsible=icon]:-mt-4">
            <SidebarGroupLabel className="flex items-center gap-2">
              <FileClock /> Pending Approvals
            </SidebarGroupLabel>
            <SidebarGroupContent>
              {pendingApprovals.length === 0 ? (
                <p className="text-xs text-muted-foreground p-2">
                  No pending requests.
                </p>
              ) : (
                <>
                  {documentUploads.length > 0 && (
                    <div className="flex flex-col gap-2 p-0 mb-2">
                      <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                        <FileUp className="h-3 w-3" /> Document Uploads
                      </p>
                      {documentUploads.map((approval: any) => (
                        <div
                          key={approval.id}
                          className="text-xs p-2 bg-sidebar-accent/50 rounded-md"
                        >
                          <p className="font-semibold truncate">
                            {approval.name}
                          </p>
                          <p className="text-muted-foreground">
                            From: {approval.requester}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <Button
                              size="sm"
                              className="h-6 px-1.5"
                              onClick={() =>
                                handleApproval(approval.id, true, approval)
                              }
                            >
                              <Check className="w-3 h-3 mr-1" /> Approve
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="h-6 px-1.5"
                              onClick={() =>
                                handleApproval(approval.id, false, approval)
                              }
                            >
                              <X className="w-3 h-3 mr-1" /> Reject
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {accessRequests.length > 0 && (
                    <div className="flex flex-col gap-2 p-0">
                      <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                        <KeyRound className="h-3 w-3" /> Access Requests
                      </p>
                      {accessRequests.map((approval: any) => (
                        <div
                          key={approval.id}
                          className="text-xs p-2 bg-sidebar-accent/50 rounded-md"
                        >
                          <p className="font-semibold truncate">
                            {approval.name}
                          </p>
                          <p className="text-muted-foreground">
                            From: {approval.requester}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <Button
                              size="sm"
                              className="h-6 px-1.5"
                              onClick={() =>
                                handleApproval(approval.id, true, approval)
                              }
                            >
                              <Check className="w-3 h-3 mr-1" /> Approve
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="h-6 px-1.5"
                              onClick={() =>
                                handleApproval(approval.id, false, approval)
                              }
                            >
                              <X className="w-3 h-3 mr-1" /> Reject
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <Separator className="my-1" />
      <SidebarFooter>
        <Link href="/profile" className="block">
          <div className="flex items-center gap-3 p-2 rounded-md transition-colors duration-200 w-full hover:bg-accent">
            <div className="relative">
              <Avatar className="w-9 h-9 border-2 border-primary/20">
                <AvatarImage
                  src={
                    user?.role === "doctor"
                      ? `https://placehold.co/40x40/4F46E5/FFFFFF.png?text=Dr`
                      : `https://placehold.co/40x40/059669/FFFFFF.png?text=P`
                  }
                  alt={user?.name}
                />
                <AvatarFallback
                  className={
                    user?.role === "doctor"
                      ? "bg-blue-600 text-white"
                      : "bg-green-600 text-white"
                  }
                >
                  {user?.role === "doctor" ? "Dr" : user?.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {/* Role indicator badge */}
              <div
                className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                  user?.role === "doctor" ? "bg-blue-600" : "bg-green-600"
                }`}
              >
                {user?.role === "doctor" ? "👩‍⚕️" : "🏥"}
              </div>
            </div>
            <div className="flex-1 overflow-hidden group-data-[collapsible=icon]:hidden">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-sm truncate">{user?.name}</p>
                <div
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    user?.role === "doctor"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  }`}
                >
                  {user?.role === "doctor" ? "Doctor" : "Patient"}
                </div>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {user?.role === "doctor"
                  ? "Medical Professional"
                  : "Patient Profile"}
              </p>
              {user?.registrationId && (
                <p className="text-xs font-mono text-primary/80 truncate">
                  ID: {user.registrationId}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 group-data-[collapsible=icon]:hidden"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                logout();
              }}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </Link>
      </SidebarFooter>
    </>
  );
}
