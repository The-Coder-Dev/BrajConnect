import React from "react";
import { getAdminDashboardStats } from "@/server/actions/admin/dashboard";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Clock,
  CheckCircle2,
  XCircle,
  FileEdit,
  TrendingUp,
  Activity,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Admin Overview - BrajConnect",
};

export default async function AdminDashboardPage() {
  const res = await getAdminDashboardStats();
  const stats = res.success && res.data ? res.data : {
    totalBusinesses: 0,
    pendingVerification: 0,
    published: 0,
    rejected: 0,
    drafts: 0,
    todaySubmissions: 0,
    recentActivities: [],
    latestBusinesses: [],
  };

  const statCards = [
    {
      title: "Total Businesses",
      value: stats.totalBusinesses,
      description: "All registered entities",
      icon: Building2,
      color: "text-blue-600 bg-blue-50 border-blue-200",
      href: "/admin/businesses",
    },
    {
      title: "Pending Verification",
      value: stats.pendingVerification,
      description: "Requires admin review",
      icon: Clock,
      color: "text-amber-600 bg-amber-50 border-amber-200",
      href: "/admin/businesses/pending",
      highlight: stats.pendingVerification > 0,
    },
    {
      title: "Published",
      value: stats.published,
      description: "Live on platform",
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
      href: "/admin/businesses/published",
    },
    {
      title: "Rejected",
      value: stats.rejected,
      description: "Submissions declined",
      icon: XCircle,
      color: "text-red-600 bg-red-50 border-red-200",
      href: "/admin/businesses/rejected",
    },
    {
      title: "Drafts",
      value: stats.drafts,
      description: "In-progress setups",
      icon: FileEdit,
      color: "text-slate-600 bg-slate-50 border-slate-200",
      href: "/admin/businesses/drafts",
    },
    {
      title: "Today's Submissions",
      value: stats.todaySubmissions,
      description: "Submitted last 24 hours",
      icon: TrendingUp,
      color: "text-violet-600 bg-violet-50 border-violet-200",
      href: "/admin/businesses/pending",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-linear-to-r from-primary/10 via-primary/5 to-transparent p-6 rounded-3xl border border-primary/20">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Admin Overview</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Monitor listings, manage verification requests, and oversee platform performance.
          </p>
        </div>
        {stats.pendingVerification > 0 && (
          <Button
            className="rounded-xl shadow-sm bg-amber-600 hover:bg-amber-700 text-white gap-2 font-semibold self-start md:self-auto"
            render={<Link href="/admin/businesses/pending" />}
          >
            <Clock className="h-4 w-4" />
            Review {stats.pendingVerification} Pending
          </Button>
        )}
      </div>

      {/* Grid Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.title} href={card.href}>
              <Card className={`rounded-2xl border transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer relative overflow-hidden ${
                card.highlight ? "border-amber-400 bg-amber-50/20" : "border-border/50"
              }`}>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-semibold text-muted-foreground">
                    {card.title}
                  </CardTitle>
                  <div className={`p-2.5 rounded-xl border ${card.color}`}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black tracking-tight">{card.value}</div>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">{card.description}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Main Overview Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Latest Submissions Column (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="rounded-2xl border border-border/50 shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-lg font-bold">Latest Businesses</CardTitle>
                <CardDescription className="text-xs">Most recently created or updated listings</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-xs text-primary font-semibold" render={<Link href="/admin/businesses" />}>
                View All <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats.latestBusinesses && stats.latestBusinesses.length > 0 ? (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                stats.latestBusinesses.map((biz: any) => (
                  <div
                    key={biz.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 border rounded-xl border-border/40 bg-card hover:bg-muted/30 transition-colors gap-3"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/businesses/${biz.id}`} className="font-bold text-sm hover:underline">
                          {biz.name}
                        </Link>
                        <Badge
                          variant="outline"
                          className={`text-[10px] capitalize px-2 py-0.5 rounded-full font-medium ${
                            biz.status === "published"
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                              : biz.status === "pending_review"
                              ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                              : biz.status === "rejected"
                              ? "bg-red-500/10 text-red-600 border-red-500/20"
                              : "bg-slate-500/10 text-slate-600 border-slate-500/20"
                          }`}
                        >
                          {biz.status?.replace("_", " ")}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Owner: <span className="font-medium text-foreground">{biz.owner?.name || "Unknown"}</span> ({biz.owner?.email})
                      </p>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                      <span className="text-[11px] text-muted-foreground font-medium">
                        {new Date(biz.createdAt).toLocaleDateString()}
                      </span>
                      <Button size="sm" variant="outline" className="h-8 rounded-lg text-xs font-semibold" render={<Link href={`/admin/businesses/${biz.id}`} />}>
                        Review
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground italic py-4 text-center">No business listings found.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Activity Feed Column (1 col) */}
        <div className="space-y-4">
          <Card className="rounded-2xl border border-border/50 shadow-xs">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" /> Recent Audit Activity
              </CardTitle>
              <CardDescription className="text-xs">Moderation actions and status logs</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.recentActivities && stats.recentActivities.length > 0 ? (
                <div className="relative pl-4 border-l-2 border-border/40 space-y-4">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {stats.recentActivities.map((act: any) => (
                    <div key={act.id} className="relative group">
                      <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-background" />
                      <div className="space-y-1">
                        <p className="text-xs font-semibold leading-tight">
                          <span className="capitalize text-primary">{act.action?.replace("_", " ")}</span> on{" "}
                          <span className="font-bold">{act.business?.name || "Business"}</span>
                        </p>
                        {act.reason && (
                          <p className="text-[11px] text-muted-foreground line-clamp-2 italic bg-muted/30 p-1.5 rounded-md">
                            &ldquo;{act.reason}&rdquo;
                          </p>
                        )}
                        <p className="text-[10px] text-muted-foreground font-medium">
                          By {act.performedByUser?.name || "Admin"} · {new Date(act.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic py-4 text-center">No moderation logs yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
