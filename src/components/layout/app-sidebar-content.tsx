
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  SidebarGroupContent
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  UserCircle
} from 'lucide-react';
import { Logo } from '@/components/icons/logo';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { useAuth } from '@/components/auth/auth-provider';
import { useToast } from '@/hooks/use-toast';
import * as React from 'react';

const doctorMenuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/records', label: 'Patient Records', icon: FileText },
  { href: '/profile', label: 'My Profile', icon: UserCircle },
];

const patientMenuItems = [
    { href: '/dashboard', label: 'My Health', icon: HeartPulse },
    { href: '/records', label: 'My Records', icon: FileText },
    { href: '/search', label: 'Find a Doctor', icon: SearchIcon },
    { href: '/chatbot', label: 'Ask AI', icon: Bot },
];

export function AppSidebarContent() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const { pendingApprovals, setPendingApprovals } = useSidebar();

  const menuItems = user?.role === 'doctor' ? doctorMenuItems : patientMenuItems;

  const handleApproval = (id: number, approved: boolean, request: any) => {
      if (!setPendingApprovals) return;
      setPendingApprovals((prev: any[]) => prev.filter(p => p.id !== id));
      
      const toastMessage = request.type === 'Document Upload' 
        ? (approved ? `${request.name} has been added to your records.` : `The document ${request.name} was rejected.`)
        : (approved ? `Access to your records has been granted to ${request.requester}.` : `Record access request from ${request.requester} was rejected.`);

      toast({
          title: approved ? "Request Approved" : "Request Rejected",
          description: toastMessage,
          variant: approved ? "default" : "destructive"
      })
  }

  const documentUploads = pendingApprovals?.filter((p: any) => p.type === 'Document Upload') || [];
  const accessRequests = pendingApprovals?.filter((p: any) => p.type === 'Access Request') || [];


  return (
    <>
      <SidebarHeader>
        <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-lg">
                    <Logo className="w-6 h-6 text-primary" />
                </div>
                <span className="font-semibold text-lg group-data-[collapsible=icon]:hidden">MediSync Hub</span>
            </Link>
            <SidebarTrigger className="hidden md:flex" />
        </div>
      </SidebarHeader>
      <SidebarContent className="flex-grow flex flex-col">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  asChild={false}
                  isActive={pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))}
                  tooltip={item.label}
                >
                    <item.icon />
                    <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        
        <div className="flex-grow" />

        {user?.role === 'patient' && (
             <SidebarGroup className="mt-auto group-data-[collapsible=icon]:-mt-4">
                <SidebarGroupLabel className="flex items-center gap-2">
                    <FileClock /> Pending Approvals
                </SidebarGroupLabel>
                <SidebarGroupContent>
                    {pendingApprovals.length === 0 ? (
                        <p className="text-xs text-muted-foreground p-2">No pending requests.</p>
                    ) : (
                        <>
                            {documentUploads.length > 0 && (
                                <div className="flex flex-col gap-2 p-0 mb-2">
                                    <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><FileUp className="h-3 w-3" /> Document Uploads</p>
                                    {documentUploads.map((approval: any) => (
                                    <div key={approval.id} className="text-xs p-2 bg-sidebar-accent/50 rounded-md">
                                        <p className="font-semibold truncate">{approval.name}</p>
                                        <p className="text-muted-foreground">From: {approval.requester}</p>
                                        <div className="flex gap-2 mt-2">
                                            <Button size="sm" className="h-6 px-1.5" onClick={() => handleApproval(approval.id, true, approval)}>
                                                <Check className="w-3 h-3 mr-1"/> Approve
                                            </Button>
                                            <Button variant="destructive" size="sm" className="h-6 px-1.5" onClick={() => handleApproval(approval.id, false, approval)}>
                                                <X className="w-3 h-3 mr-1"/> Reject
                                            </Button>
                                        </div>
                                    </div>
                                    ))}
                                </div>
                            )}
                            {accessRequests.length > 0 && (
                                <div className="flex flex-col gap-2 p-0">
                                     <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><KeyRound className="h-3 w-3" /> Access Requests</p>
                                    {accessRequests.map((approval: any) => (
                                    <div key={approval.id} className="text-xs p-2 bg-sidebar-accent/50 rounded-md">
                                        <p className="font-semibold truncate">{approval.name}</p>
                                        <p className="text-muted-foreground">From: {approval.requester}</p>
                                        <div className="flex gap-2 mt-2">
                                            <Button size="sm" className="h-6 px-1.5" onClick={() => handleApproval(approval.id, true, approval)}>
                                                <Check className="w-3 h-3 mr-1"/> Approve
                                            </Button>
                                            <Button variant="destructive" size="sm" className="h-6 px-1.5" onClick={() => handleApproval(approval.id, false, approval)}>
                                                <X className="w-3 h-3 mr-1"/> Reject
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
        <div className="flex items-center gap-3 p-2 rounded-md transition-colors duration-200 w-full">
            <Avatar className="w-9 h-9">
                <AvatarImage src={`https://placehold.co/40x40.png`} alt={user?.name} data-ai-hint={`${user?.role} portrait`} />
                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden group-data-[collapsible=icon]:hidden">
                <p className="font-semibold text-sm truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate capitalize">{user?.role}</p>
            </div>
            <Button variant="ghost" size="icon" className="w-8 h-8 group-data-[collapsible=icon]:hidden" onClick={logout}>
                <LogOut className="w-4 h-4" />
            </Button>
        </div>
      </SidebarFooter>
    </>
  );
}
