"use client";

import { usePathname, useRouter } from "next/navigation";
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
  Building2,
  Clock,
  CheckCircle2,
  XCircle,
  FileEdit,
  FolderTree,
  MapPin,
  Sparkles,
  Layers,
  Users,
  Star,
  Settings,
  HelpCircle,
  LogOut,
  ShieldAlert,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";
import { Badge } from "@/components/ui/badge";

const mainNavItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
];

const businessNavItems = [
  {
    title: "Pending Verification",
    url: "/admin/businesses/pending",
    icon: Clock,
    badge: "Action Required",
  },
  {
    title: "Published",
    url: "/admin/businesses/published",
    icon: CheckCircle2,
  },
  {
    title: "Rejected",
    url: "/admin/businesses/rejected",
    icon: XCircle,
  },
  {
    title: "Drafts",
    url: "/admin/businesses/drafts",
    icon: FileEdit,
  },
  {
    title: "All Businesses",
    url: "/admin/businesses",
    icon: Building2,
  },
];

const systemNavItems = [
  {
    title: "Categories",
    url: "/admin/categories",
    icon: FolderTree,
  },
  {
    title: "Locations",
    url: "/admin/locations",
    icon: MapPin,
  },
  {
    title: "Amenities",
    url: "/admin/amenities",
    icon: Sparkles,
  },
  {
    title: "Dynamic Fields",
    url: "/admin/dynamic-fields",
    icon: Layers,
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: Users,
  },
  {
    title: "Reviews",
    url: "/admin/reviews",
    icon: Star,
  },
];

const footerNavItems = [
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
  {
    title: "Support",
    url: "/admin/support",
    icon: HelpCircle,
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function AdminSidebar({ user }: { user: any }) {
  const pathname = usePathname();
  const { state } = useSidebar();
  const router = useRouter();

  const getInitials = (name: string) => {
    return name?.substring(0, 2).toUpperCase() || "AD";
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

  const renderMenuItem = (item: {
    title: string;
    url: string;
    icon: any;
    badge?: string;
  }) => {
    const isActive =
      item.url === "/admin"
        ? pathname === "/admin"
        : pathname === item.url || pathname.startsWith(item.url + "/");

    return (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton
          render={<Link href={item.url} />}
          isActive={isActive}
          tooltip={item.title}
          className={`rounded-xl transition-all font-medium py-2.5 ${
            isActive
              ? "bg-primary/10 text-primary font-semibold relative after:absolute after:left-0 after:top-1/2 after:-translate-y-1/2 after:w-1 after:h-6 after:bg-primary after:rounded-r-full"
              : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
          }`}
        >
          <item.icon className={`h-4 w-4 ${isActive ? "text-primary" : ""}`} />
          <span className="text-xs">{item.title}</span>
          {item.badge && state !== "collapsed" && (
            <Badge variant="secondary" className="ml-auto text-[10px] bg-amber-500/10 text-amber-600 border-amber-500/20 px-1.5 py-0">
              {item.badge}
            </Badge>
          )}
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-border/50 bg-background shadow-none"
    >
      <SidebarHeader className="py-5 px-4 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-primary text-primary-foreground font-bold shadow-xs shrink-0">
            <ShieldAlert className="h-5 w-5" />
          </div>
          {state !== "collapsed" && (
            <div className="flex flex-col flex-1 overflow-hidden">
              <span className="truncate text-sm font-bold tracking-tight">
                Admin Console
              </span>
              <span className="truncate text-[11px] text-muted-foreground font-medium">
                BrajConnect Control
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-3 space-y-4">
        {/* Main Section */}
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {mainNavItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Business Management */}
        <SidebarGroup className="p-0">
          {state !== "collapsed" && (
            <SidebarGroupLabel className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground/70 px-2 mb-1">
              Business Management
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {businessNavItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* System & Catalog */}
        <SidebarGroup className="p-0">
          {state !== "collapsed" && (
            <SidebarGroupLabel className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground/70 px-2 mb-1">
              Platform & Catalog
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {systemNavItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings & Support */}
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {footerNavItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-border/40">
        <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-muted/40 border border-border/30">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={user?.image} alt={user?.name} />
              <AvatarFallback className="rounded-lg text-xs font-bold bg-primary/10 text-primary">
                {getInitials(user?.name || "Admin")}
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
