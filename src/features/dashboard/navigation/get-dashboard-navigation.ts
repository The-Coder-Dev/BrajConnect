import {
  LayoutDashboard,
  User,
  BriefcaseBusiness,
  LifeBuoy,
  ShieldAlert,
  ArrowRightCircle,
  Clock,
  Pencil,
  RefreshCw,
  Building2,
  Image as ImageIcon,
  MessageSquare,
  Star,
  TrendingUp,
  Bell,
  Plus,
  Sparkles,
  CreditCard,
  Lock,
  LucideIcon
} from "lucide-react";

export type PlanTier = "free" | "business" | "premium" | "enterprise";

export interface NavigationItem {
  title: string;
  url: string;
  icon: LucideIcon;
  requiredPlan?: PlanTier;
  locked?: boolean;
  badge?: string;
}

export interface NavigationGroup {
  label: string;
  items: NavigationItem[];
}

export interface DashboardNavigationParams {
  user: any;
  activeBusiness: any | null;
  subscription?: { plan: PlanTier };
}

const PLAN_HIERARCHY: Record<PlanTier, number> = {
  free: 1,
  business: 2,
  premium: 3,
  enterprise: 4,
};

export function getDashboardNavigation({
  user,
  activeBusiness,
  subscription = { plan: "free" },
}: DashboardNavigationParams): NavigationGroup[] {
  const userPlan = subscription?.plan || "free";
  const userPlanLevel = PLAN_HIERARCHY[userPlan] || 1;

  const isAdmin = user?.role === "admin";
  const status = activeBusiness?.status || "NO_BUSINESS";

  const helperBuildItem = (item: NavigationItem): NavigationItem => {
    if (!item.requiredPlan) return item;
    const requiredLevel = PLAN_HIERARCHY[item.requiredPlan] || 1;
    const locked = userPlanLevel < requiredLevel;
    return {
      ...item,
      locked,
      badge: locked ? `${item.requiredPlan.toUpperCase()}` : item.badge,
    };
  };

  const navGroups: NavigationGroup[] = [];

  // If Admin, include Admin Console top item
  if (isAdmin) {
    navGroups.push({
      label: "Administration",
      items: [
        {
          title: "Admin Console",
          url: "/admin",
          icon: ShieldAlert,
        },
      ],
    });
  }

  // --- STATE A: NO BUSINESS ---
  if (!activeBusiness || status === "NO_BUSINESS") {
    navGroups.push({
      label: "Main",
      items: [
        { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
        { title: "Register Your Business", url: "/setup/business", icon: BriefcaseBusiness },
        { title: "My Profile", url: "/dashboard/profile", icon: User },
        { title: "Support", url: "/dashboard/support", icon: LifeBuoy },
      ],
    });
    return navGroups;
  }

  // --- STATE B: DRAFT ---
  if (status === "draft") {
    navGroups.push({
      label: "Main",
      items: [
        { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
        { title: "Continue Registration", url: "/setup/business", icon: ArrowRightCircle },
        { title: "My Profile", url: "/dashboard/profile", icon: User },
        { title: "Support", url: "/dashboard/support", icon: LifeBuoy },
      ],
    });
    return navGroups;
  }

  // --- STATE C: PENDING REVIEW ---
  if (status === "pending_review") {
    navGroups.push({
      label: "Main",
      items: [
        { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
        { title: "Review Status", url: "/dashboard", icon: Clock },
        { title: "My Profile", url: "/dashboard/profile", icon: User },
        { title: "Support", url: "/dashboard/support", icon: LifeBuoy },
      ],
    });
    return navGroups;
  }

  // --- STATE D: REJECTED ---
  if (status === "rejected") {
    navGroups.push({
      label: "Main",
      items: [
        { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
        { title: "Edit Business", url: "/setup/business", icon: Pencil },
        { title: "Resubmit", url: "/dashboard", icon: RefreshCw },
        { title: "My Profile", url: "/dashboard/profile", icon: User },
        { title: "Support", url: "/dashboard/support", icon: LifeBuoy },
      ],
    });
    return navGroups;
  }

  // --- STATE E: PUBLISHED BUSINESS OWNER SIDEBAR ---
  if (status === "published") {
    const businessSlugOrId = activeBusiness.slug || activeBusiness.id;
    const editBaseUrl = `/dashboard/businesses/${activeBusiness.id}/edit`;

    navGroups.push({
      label: "Business Operations",
      items: [
        { title: "Dashboard Overview", url: "/dashboard", icon: LayoutDashboard },
        { title: "Business Profile", url: `/business/${businessSlugOrId}`, icon: Building2 },
        { title: "Edit Business", url: editBaseUrl, icon: Pencil },
        { title: "Gallery", url: `${editBaseUrl}?tab=gallery`, icon: ImageIcon },
        { title: "Business Hours", url: `${editBaseUrl}?tab=hours`, icon: Clock },
        { title: "Leads", url: "/dashboard", icon: MessageSquare },
        { title: "Reviews", url: "/dashboard", icon: Star },
        helperBuildItem({
          title: "Analytics",
          url: "/dashboard",
          icon: TrendingUp,
          requiredPlan: "business",
        }),
        { title: "Notifications", url: "/dashboard", icon: Bell },
      ],
    });

    navGroups.push({
      label: "Account & Subscriptions",
      items: [
        { title: "Add Another Business", url: "/setup/business", icon: Plus },
        helperBuildItem({
          title: "Pricing & Plans",
          url: "/dashboard/settings",
          icon: Sparkles,
        }),
        { title: "My Profile", url: "/dashboard/profile", icon: User },
        { title: "Support", url: "/dashboard/support", icon: LifeBuoy },
      ],
    });

    return navGroups;
  }

  return navGroups;
}
