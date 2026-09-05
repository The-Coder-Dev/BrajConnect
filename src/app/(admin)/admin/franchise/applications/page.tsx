import React from "react";
import { requireAdmin } from "@/lib/auth/guards";
import { getAdminAllApplications } from "@/server/actions/franchise/applications";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, Building2, MapPin, IndianRupee, Calendar } from "lucide-react";
import { OwnerApplicationReviewer } from "@/components/franchise/owner-application-reviewer";

export const metadata = {
  title: "Admin - Franchise Applications",
};

interface AdminApplicationsPageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function AdminFranchiseApplicationsPage({
  searchParams,
}: AdminApplicationsPageProps) {
  await requireAdmin();
  const params = await searchParams;
  const currentStatus = params.status || "all";

  const res = await getAdminAllApplications(currentStatus);
  const applications = res.success && res.data ? res.data : [];

  const statusFilters = [
    { label: "All", value: "all" },
    { label: "Submitted", value: "submitted" },
    { label: "Under Review", value: "under_review" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Franchise Applications Hub
          </h1>
          <p className="text-xs text-muted-foreground">
            Platform-wide overview of all partner franchise applications and review statuses.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 pb-2">
        {statusFilters.map((tab) => (
          <Button
            key={tab.value}
            variant={currentStatus === tab.value ? "default" : "outline"}
            size="sm"
            className="rounded-xl text-xs font-semibold"
            render={<Link href={`/admin/franchise/applications?status=${tab.value}`} />}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {applications.length === 0 ? (
        <Card className="rounded-2xl border-border/50 text-center py-16 px-4">
          <Users className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
          <h3 className="text-lg font-bold">No Applications Found</h3>
          <p className="text-xs text-muted-foreground mt-1">
            No applications match status &ldquo;{currentStatus}&rdquo;.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {applications.map((app: any) => (
            <Card
              key={app.id}
              className="rounded-2xl border-border/50 hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              <div className="p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/40 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <h3 className="font-bold text-base text-foreground">
                        {app.applicantName}
                      </h3>
                      <Badge
                        variant="outline"
                        className="text-[10px] capitalize px-2 py-0.5 rounded-full font-semibold border-amber-500/30 text-amber-700 bg-amber-500/10"
                      >
                        {app.applicantType}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-[10px] capitalize px-2 py-0.5 rounded-full font-semibold ${
                          app.status === "approved"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                            : app.status === "rejected"
                            ? "bg-red-500/10 text-red-600 border-red-500/30"
                            : "bg-amber-500/10 text-amber-700 border-amber-500/30 font-bold"
                        }`}
                      >
                        {app.status?.replace("_", " ")}
                      </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-foreground flex items-center gap-1">
                        <Building2 className="h-3.5 w-3.5 text-primary" /> {app.business?.name}
                      </span>
                      <span>•</span>
                      <span>Opportunity: {app.opportunity?.title}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(app.createdAt).toLocaleDateString()}
                      </span>
                    </p>
                  </div>

                  <OwnerApplicationReviewer application={app} />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-muted/40 border border-border/30 space-y-0.5">
                    <span className="text-muted-foreground font-medium flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-amber-600" /> Location
                    </span>
                    <p className="font-bold text-foreground">{app.preferredLocation}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-muted/40 border border-border/30 space-y-0.5">
                    <span className="text-muted-foreground font-medium flex items-center gap-1">
                      <IndianRupee className="h-3.5 w-3.5 text-amber-600" /> Investment
                    </span>
                    <p className="font-bold text-foreground">{app.investmentCapacity}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-muted/40 border border-border/30 space-y-0.5">
                    <span className="text-muted-foreground font-medium">Contact Phone</span>
                    <p className="font-bold text-foreground">{app.phone}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-muted/40 border border-border/30 space-y-0.5">
                    <span className="text-muted-foreground font-medium">Contact Email</span>
                    <p className="font-bold text-foreground truncate">{app.email}</p>
                  </div>
                </div>

                {app.reviewNotes && (
                  <div className="p-3 rounded-xl bg-muted/20 border border-border/20 text-xs text-muted-foreground italic">
                    Review note: &ldquo;{app.reviewNotes}&rdquo;
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
