import React from "react";
import { getFranchiseDashboardData } from "@/server/actions/franchise/profile";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Briefcase,
  Clock,
  CheckCircle2,
  XCircle,
  Compass,
  ArrowRight,
  Building2,
  User,
  MapPin,
  IndianRupee,
  Calendar,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Franchise Partner Dashboard - BachatLal",
};

export default async function FranchiseDashboardPage() {
  const res = await getFranchiseDashboardData();
  const data = res.success && res.data ? res.data : null;

  const stats = data?.stats || {
    total: 0,
    underReview: 0,
    approved: 0,
    rejected: 0,
  };

  const profile = data?.profile;
  const recentApplications = data?.recentApplications || [];

  const statCards = [
    {
      title: "Total Applications",
      value: stats.total,
      description: "Opportunities you have applied for",
      icon: Briefcase,
      color: "text-blue-600 bg-blue-50 border-blue-200",
      href: "/franchise/applications",
    },
    {
      title: "Under Review",
      value: stats.underReview,
      description: "Pending owner/admin review",
      icon: Clock,
      color: "text-amber-600 bg-amber-50 border-amber-200",
      href: "/franchise/applications",
      highlight: stats.underReview > 0,
    },
    {
      title: "Approved",
      value: stats.approved,
      description: "Ready for franchise onboarding",
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
      href: "/franchise/applications",
    },
    {
      title: "Rejected",
      value: stats.rejected,
      description: "Declined submissions",
      icon: XCircle,
      color: "text-red-600 bg-red-50 border-red-200",
      href: "/franchise/applications",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-linear-to-r from-amber-500/15 via-amber-500/5 to-transparent p-6 md:p-8 rounded-3xl border border-amber-500/30">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🤝</span>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Welcome to BachatLal Franchise
            </h1>
          </div>
          <p className="text-muted-foreground text-sm max-w-2xl">
            Explore vetted franchise opportunities from high-growth local businesses across the region, apply with one click, and track your applications.
          </p>
        </div>

        <Button
          className="rounded-xl shadow-md bg-amber-600 hover:bg-amber-700 text-white gap-2 font-bold px-6 h-12 self-start md:self-auto shrink-0 transition-all hover:-translate-y-0.5"
          render={<Link href="/franchise/opportunities" />}
        >
          <Compass className="h-5 w-5" />
          Explore Franchise Opportunities
        </Button>
      </div>

      {/* Grid Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.title} href={card.href}>
              <Card
                className={`rounded-2xl border transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer relative overflow-hidden ${
                  card.highlight ? "border-amber-400 bg-amber-50/20" : "border-border/50"
                }`}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {card.title}
                  </CardTitle>
                  <div className={`p-2.5 rounded-xl border ${card.color}`}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black tracking-tight">{card.value}</div>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* 2-Column Section: Profile Details & Recent Applications */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Applications (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="rounded-2xl border border-border/50 shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-lg font-bold">Recent Applications</CardTitle>
                <CardDescription className="text-xs">
                  Status of your latest franchise inquiries
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-amber-700 dark:text-amber-400 font-semibold"
                render={<Link href="/franchise/applications" />}
              >
                View All <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentApplications.length > 0 ? (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                recentApplications.map((app: any) => (
                  <div
                    key={app.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-xl border-border/40 bg-card hover:bg-muted/30 transition-colors gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-foreground">
                          {app.opportunity?.title || "Franchise Opportunity"}
                        </span>
                        <Badge
                          variant="outline"
                          className={`text-[10px] capitalize px-2 py-0.5 rounded-full font-medium ${
                            app.status === "approved"
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                              : app.status === "under_review" || app.status === "submitted"
                              ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                              : "bg-red-500/10 text-red-600 border-red-500/20"
                          }`}
                        >
                          {app.status?.replace("_", " ")}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-2">
                        <Building2 className="h-3.5 w-3.5 text-primary" />
                        <span>{app.business?.name || "BachatLal Business"}</span>
                        <span>•</span>
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{app.preferredLocation}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                      <div className="text-right">
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(app.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 rounded-lg text-xs font-semibold"
                        render={<Link href={`/franchise/opportunities/${app.opportunity?.slug}`} />}
                      >
                        View Opportunity
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 px-4 border border-dashed rounded-xl border-border/60">
                  <Compass className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="font-semibold text-sm">No applications submitted yet</p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                    Browse approved franchise opportunities and take the first step towards owning a thriving franchise.
                  </p>
                  <Button
                    size="sm"
                    className="mt-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold"
                    render={<Link href="/franchise/opportunities" />}
                  >
                    Browse Opportunities
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Profile Information (1 col) */}
        <div className="space-y-4">
          <Card className="rounded-2xl border border-border/50 shadow-xs">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <User className="h-4 w-4 text-amber-600" /> Franchise Profile
              </CardTitle>
              <CardDescription className="text-xs">
                Your registered partner identity & preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 rounded-xl bg-muted/40 border border-border/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Applicant Type</span>
                  <Badge
                    variant="outline"
                    className="capitalize text-xs font-semibold border-amber-500/30 text-amber-700 bg-amber-500/10"
                  >
                    {profile?.applicantType || "individual"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Partner Name</span>
                  <span className="text-xs font-bold text-foreground">
                    {profile?.applicantType === "company"
                      ? profile?.companyName
                      : profile?.fullName || data?.user?.name}
                  </span>
                </div>
                {profile?.applicantType === "company" && profile?.authorizedPersonName && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Authorized Person</span>
                    <span className="text-xs font-medium text-foreground">
                      {profile?.authorizedPersonName} ({profile?.authorizedPersonDesignation})
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-2.5 pt-1">
                <div className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="text-[11px] text-muted-foreground uppercase font-bold">
                      Preferred Location
                    </span>
                    <p className="text-xs font-semibold text-foreground">
                      {profile?.preferredCity}, {profile?.preferredState}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <IndianRupee className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="text-[11px] text-muted-foreground uppercase font-bold">
                      Investment Capacity
                    </span>
                    <p className="text-xs font-semibold text-foreground">
                      {profile?.investmentCapacity}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-border/30">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full rounded-xl text-xs font-semibold"
                  render={<Link href="/franchise/profile" />}
                >
                  Manage Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
