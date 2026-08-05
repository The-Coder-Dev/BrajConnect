"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { LogOut, Lock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";
import { getDashboardNavigation } from "@/features/dashboard/navigation/get-dashboard-navigation";
import { Badge } from "@/components/ui/badge";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function AppSidebar({ user, activeBusiness }: { user: any; activeBusiness?: any }) {
  const pathname = usePathname();
  const { state } = useSidebar();

  const navigationGroups = getDashboardNavigation({
    user,
    activeBusiness: activeBusiness || null,
  });

  const getInitials = (name: string) => {
    return name?.substring(0, 2).toUpperCase() || "BC";
  };

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/sign-in";
        },
      },
    });
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-border/50 bg-background shadow-none"
    >
      <SidebarHeader className="py-6 px-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 rounded-lg bg-red-50">
            <AvatarImage src={user.image} alt={user.name} />
            <AvatarFallback className="rounded-lg text-xs font-semibold text-primary">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          {state !== "collapsed" && (
            <div className="flex flex-col flex-1 overflow-hidden">
              <span className="truncate text-sm font-semibold">
                {user.name}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {activeBusiness ? (
                  <span className="text-emerald-600 font-bold uppercase text-[10px]">
                    {activeBusiness.status} • {activeBusiness.name}
                  </span>
                ) : (
                  user.email
                )}
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 space-y-4">
        {navigationGroups.map((group, groupIdx) => (
          <SidebarGroup key={groupIdx}>
            {state !== "collapsed" && group.label && (
              <SidebarGroupLabel className="text-[10px] uppercase font-bold text-muted-foreground px-2">
                {group.label}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu className="gap-1.5">
                {group.items.map((item) => {
                  const isActive = item.url === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(item.url);
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        render={<Link href={item.locked ? "#" : item.url} />}
                        isActive={isActive}
                        tooltip={item.title}
                        disabled={item.locked}
                        className={`rounded-lg transition-all ${
                          isActive
                            ? "bg-transparent text-primary font-medium relative after:absolute after:left-0 after:top-1/2 after:-translate-y-1/2 after:w-1 after:h-5 after:bg-primary after:rounded-r-full"
                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                        } ${item.locked ? "opacity-60 cursor-not-allowed" : ""}`}
                      >
                        <item.icon className={isActive ? "text-primary" : ""} />
                        <span className="truncate flex-1">{item.title}</span>
                        {item.locked && <Lock className="w-3 h-3 text-amber-500 shrink-0 ml-auto" />}
                        {item.badge && !item.locked && (
                          <Badge variant="outline" className="text-[9px] px-1 py-0 uppercase ml-auto">
                            {item.badge}
                          </Badge>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleSignOut}
              tooltip="Sign out"
              className="rounded-lg cursor-pointer text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-all"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
