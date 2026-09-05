"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Compass,
  FileText,
  User,
  Settings,
  LogOut,
  Briefcase,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";

const franchiseNavItems = [
  {
    title: "Dashboard",
    url: "/franchise/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Explore Opportunities",
    url: "/franchise/opportunities",
    icon: Compass,
  },
  {
    title: "My Applications",
    url: "/franchise/applications",
    icon: FileText,
  },
  {
    title: "Profile",
    url: "/franchise/profile",
    icon: User,
  },
  {
    title: "Settings",
    url: "/franchise/settings",
    icon: Settings,
  },
];

export function FranchiseSidebar({ user }: { user: any }) {
  const pathname = usePathname();
  const { state } = useSidebar();

  const getInitials = (name: string) => {
    return name?.substring(0, 2).toUpperCase() || "FP";
  };

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/login/franchise";
        },
      },
    });
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-border/50 bg-background shadow-none"
    >
      <SidebarHeader className="py-5 px-4 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-amber-600 text-white font-bold shadow-xs shrink-0">
            <Briefcase className="h-5 w-5" />
          </div>
          {state !== "collapsed" && (
            <div className="flex flex-col flex-1 overflow-hidden">
              <span className="truncate text-sm font-bold tracking-tight">
                Franchise Portal
              </span>
              <span className="truncate text-[11px] text-muted-foreground font-medium">
                BachatLal Partner
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4 space-y-4">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {franchiseNavItems.map((item) => {
                const isActive =
                  item.url === "/franchise/dashboard"
                    ? pathname === "/franchise/dashboard"
                    : pathname.startsWith(item.url);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      render={<Link href={item.url} />}
                      isActive={isActive}
                      tooltip={item.title}
                      className={`rounded-xl transition-all font-medium py-2.5 ${
                        isActive
                          ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 font-semibold relative after:absolute after:left-0 after:top-1/2 after:-translate-y-1/2 after:w-1 after:h-6 after:bg-amber-600 after:rounded-r-full"
                          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                      }`}
                    >
                      <item.icon className={`h-4 w-4 ${isActive ? "text-amber-600" : ""}`} />
                      <span className="text-xs">{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-border/40">
        <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-muted/40 border border-border/30">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={user?.image} alt={user?.name} />
              <AvatarFallback className="rounded-lg text-xs font-bold bg-amber-500/10 text-amber-700">
                {getInitials(user?.name || "Partner")}
              </AvatarFallback>
            </Avatar>
            {state !== "collapsed" && (
              <div className="flex flex-col flex-1 overflow-hidden">
                <span className="truncate text-xs font-bold">{user?.name}</span>
                <span className="truncate text-[10px] text-muted-foreground">{user?.email}</span>
              </div>
            )}
          </div>
          {state !== "collapsed" && (
            <button
              onClick={handleSignOut}
              title="Sign out"
              className="p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
