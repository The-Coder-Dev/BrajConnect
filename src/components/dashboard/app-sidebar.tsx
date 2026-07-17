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
import {
  LayoutDashboard,
  User,
  BriefcaseBusiness,
  LifeBuoy,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const items = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Profile",
    url: "/dashboard/profile",
    icon: User,
  },
  {
    title: "Register Your Business",
    url: "/setup/business",
    icon: BriefcaseBusiness,
  },
  {
    title: "Support",
    url: "/dashboard/support",
    icon: LifeBuoy,
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function AppSidebar({ user }: { user: any }) {
  const pathname = usePathname();
  const { state } = useSidebar();
  const router = useRouter();

  const getInitials = (name: string) => {
    return name?.substring(0, 2).toUpperCase() || "BC";
  };

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in");
          router.refresh();
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
                {user.email}
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {items.map((item) => {
                const isActive = item.url === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      render={<Link href={item.url} />}
                      isActive={isActive}
                      tooltip={item.title}
                      className={`rounded-lg transition-all ${
                        isActive
                          ? "bg-transparent text-primary font-medium relative after:absolute after:left-0 after:top-1/2 after:-translate-y-1/2 after:w-1 after:h-5 after:bg-primary after:rounded-r-full"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      }`}
                    >
                      <item.icon className={isActive ? "text-primary" : ""} />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
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
