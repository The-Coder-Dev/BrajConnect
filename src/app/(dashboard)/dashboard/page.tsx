import { requireAuth } from "@/lib/auth/guards";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building2,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Plus,
  ArrowRight,
  History,
  AlertTriangle,
  Archive,
} from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/dashboard/empty-state";
import { getOwnerBusinesses } from "@/server/actions/business/owner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Dashboard - BrajConnect",
};

interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description: string;
  time: Date;
}

export default async function DashboardPage() {
  const { user } = await requireAuth();
  const res = await getOwnerBusinesses();

  if (!res.success || !res.data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 border rounded-2xl bg-destructive/5 text-destructive border-destructive/20">
        <AlertTriangle className="h-10 w-10 mb-4" />
        <h2 className="text-xl font-bold">Failed to load dashboard data</h2>
        <p className="text-muted-foreground mt-2">{res.error || "An unexpected error occurred."}</p>
      </div>
    );
  }

  const businesses = res.data;

  // Empty State if no businesses are registered
  if (businesses.length === 0) {
    return (
      <div className="space-y-8 py-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Welcome, {user.name}</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Register your business to list it on BrajConnect and manage it from this portal.
          </p>
        </div>
        <EmptyState
          icon={Building2}
          title="You haven't registered any business yet"
          description="Start building your online presence by registering your business on BrajConnect today."
          actionLabel="Register Your Business"
          actionHref="/setup/business"
        />
      </div>
    );
  }

  // Compute stats
  const totalCount = businesses.length;
  const publishedCount = businesses.filter((b) => b.status === "published").length;
  const pendingCount = businesses.filter((b) => b.status === "pending_review").length;
  const rejectedCount = businesses.filter((b) => b.status === "rejected").length;
  const draftsCount = businesses.filter((b) => b.status === "draft").length;

  // Find latest business (updated or created most recently)
  const latestBusiness = businesses[0];

  // Dynamic Timeline Activities
  const activities: ActivityItem[] = [];
  businesses.forEach((b) => {
    // Created event
    activities.push({
      id: `${b.id}-created`,
      type: "created",
      title: "Business Created",
      description: `"${b.name}" was registered as a draft.`,
      time: b.createdAt,
    });

    // Updated event (if updatedAt is different from createdAt by more than 10 seconds)
    if (b.updatedAt.getTime() - b.createdAt.getTime() > 10000) {
      activities.push({
        id: `${b.id}-updated`,
        type: "updated",
        title: "Business Updated",
        description: `"${b.name}" details were updated.`,
        time: b.updatedAt,
      });
    }

    // Submitted/Approved/Rejected events based on status
    if (b.status === "pending_review") {
      activities.push({
        id: `${b.id}-submitted`,
        type: "submitted",
        title: "Submitted for Review",
        description: `"${b.name}" is pending administrator verification.`,
        time: b.updatedAt,
      });
    } else if (b.status === "published" && b.publishedAt) {
      activities.push({
        id: `${b.id}-published`,
        type: "published",
        title: "Business Approved",
        description: `"${b.name}" was approved and is now live!`,
        time: b.publishedAt,
      });
    } else if (b.status === "rejected") {
      activities.push({
        id: `${b.id}-rejected`,
        type: "rejected",
        title: "Business Rejected",
        description: `"${b.name}" submission was rejected by the admin.`,
        time: b.updatedAt,
      });
    }
  });

  // Sort activities by time desc, take top 5
  const recentActivities = activities
    .sort((a, b) => b.time.getTime() - a.time.getTime())
    .slice(0, 5);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Published</Badge>;
      case "pending_review":
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">Pending Review</Badge>;
      case "rejected":
        return <Badge className="bg-red-500/10 text-red-600 border-red-500/20">Rejected</Badge>;
      case "draft":
        return <Badge className="bg-slate-500/10 text-slate-600 border-slate-500/20">Draft</Badge>;
      case "suspended":
        return <Badge className="bg-violet-500/10 text-violet-600 border-violet-500/20">Suspended</Badge>;
      case "archived":
        return <Badge className="bg-zinc-500/10 text-zinc-600 border-zinc-500/20">Archived</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-10 py-4">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Welcome back, {user.name}. Manage your business list and track approval status.
          </p>
        </div>
        <Link href="/setup/business">
          <Button className="rounded-xl bg-linear-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white shadow-md shadow-red-500/10 hover:shadow-red-500/20 transition-all duration-300">
            <Plus className="mr-2 h-4 w-4" />
            Register New Business
          </Button>
        </Link>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <Card className="rounded-xl shadow-xs border-border/50 bg-card hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Businesses</CardTitle>
            <Building2 className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold">{totalCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Registered businesses</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-xs border-border/50 bg-card hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Published</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-emerald-600">{publishedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Live on BrajConnect</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-xs border-border/50 bg-card hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-amber-600">{pendingCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Waiting for approval</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-xs border-border/50 bg-card hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-red-600">{rejectedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Requires correction</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-xs border-border/50 bg-card hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Drafts</CardTitle>
            <FileText className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-600">{draftsCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Incomplete profiles</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Layout Area */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Columns - Latest Submitted & Quick Links */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="text-xl font-bold mb-4 tracking-tight">Latest Business Activity</h2>
            <Card className="rounded-2xl border-border/50 bg-card shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
              <div className="relative h-40 bg-slate-100 flex items-center justify-center overflow-hidden">
                {latestBusiness.coverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={latestBusiness.coverUrl}
                    alt={`${latestBusiness.name} Cover`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Building2 className="h-10 w-10 text-slate-300" />
                  </div>
                )}
                <div className="absolute top-4 right-4">{getStatusBadge(latestBusiness.status)}</div>
              </div>
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  {latestBusiness.logoUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={latestBusiness.logoUrl}
                      alt={latestBusiness.name}
                      className="h-14 w-14 rounded-xl border object-cover shadow-sm bg-white shrink-0 -mt-10 z-10"
                    />
                  )}
                  <div className="space-y-1">
                    <CardTitle className="text-xl font-bold">{latestBusiness.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {latestBusiness.shortDescription || "No description provided."}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 border-t border-border/40 bg-muted/10 p-5 flex flex-wrap items-center justify-between gap-4 text-sm">
                <div className="flex gap-4">
                  <div className="text-muted-foreground">
                    Last Updated: <span className="font-semibold text-foreground">{new Date(latestBusiness.updatedAt).toLocaleDateString()}</span>
                  </div>
                  {latestBusiness.location && (
                    <div className="text-muted-foreground">
                      City: <span className="font-semibold text-foreground">{latestBusiness.location.city}</span>
                    </div>
                  )}
                </div>
                <Link href={`/dashboard/businesses/${latestBusiness.id}`} className="inline-flex items-center gap-1 text-primary font-semibold hover:underline">
                  Manage Business <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions Grid */}
          <div>
            <h2 className="text-xl font-bold mb-4 tracking-tight">Quick Actions</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Link href="/dashboard/businesses">
                <Card className="rounded-xl border-border/50 hover:border-primary/30 bg-card hover:bg-slate-50/50 shadow-xs hover:shadow-sm cursor-pointer transition-all duration-300 p-5 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base">View All Businesses</h3>
                    <p className="text-xs text-muted-foreground mt-1">Review list, check status, or trigger resubmissions.</p>
                  </div>
                </Card>
              </Link>
              <Link href="/dashboard/profile">
                <Card className="rounded-xl border-border/50 hover:border-primary/30 bg-card hover:bg-slate-50/50 shadow-xs hover:shadow-sm cursor-pointer transition-all duration-300 p-5 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-red-50 flex items-center justify-center text-primary shrink-0">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base">Manage Profile</h3>
                    <p className="text-xs text-muted-foreground mt-1">Update registration details and security settings.</p>
                  </div>
                </Card>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column - Recent Activities */}
        <div>
          <h2 className="text-xl font-bold mb-4 tracking-tight">Recent Activity</h2>
          <Card className="rounded-2xl border-border/50 bg-card shadow-sm p-6">
            <div className="space-y-6">
              {recentActivities.length > 0 ? (
                recentActivities.map((act, index) => (
                  <div key={act.id} className="relative flex gap-4">
                    {/* Timeline line */}
                    {index < recentActivities.length - 1 && (
                      <span className="absolute left-4 top-8 -bottom-6 w-0.5 bg-muted" />
                    )}
                    {/* Icon mapping */}
                    <div className="z-10 h-8 w-8 rounded-full border bg-background flex items-center justify-center shrink-0">
                      {act.type === "created" && <FileText className="h-4 w-4 text-slate-400" />}
                      {act.type === "updated" && <FileText className="h-4 w-4 text-blue-500" />}
                      {act.type === "submitted" && <Clock className="h-4 w-4 text-amber-500" />}
                      {act.type === "published" && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                      {act.type === "rejected" && <XCircle className="h-4 w-4 text-red-500" />}
                    </div>
                    <div className="space-y-1 py-0.5">
                      <p className="text-sm font-bold text-foreground">{act.title}</p>
                      <p className="text-xs text-muted-foreground">{act.description}</p>
                      <p className="text-[10px] font-medium text-slate-400">
                        {new Date(act.time).toLocaleDateString()} at {new Date(act.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-10 text-muted-foreground gap-2">
                  <History className="h-8 w-8 text-slate-300" />
                  <p className="text-sm">No activity recorded yet.</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
