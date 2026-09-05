import React from "react";
import { requireAuth } from "@/lib/auth/guards";
import { getBusinessOwnerApplications } from "@/server/actions/franchise/applications";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, Building2, MapPin, IndianRupee, Calendar, ArrowLeft } from "lucide-react";
import { OwnerApplicationReviewer } from "@/components/franchise/owner-application-reviewer";

export const metadata = {
  title: "Franchise Applicants - Owner Dashboard",
};

export default async function OwnerFranchiseApplicationsPage() {
  await requireAuth();
  const res = await getBusinessOwnerApplications();
  const applications = res.success && res.data ? res.data : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="rounded-xl h-9 w-9"
            render={<Link href="/dashboard/franchise" />}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Franchise Applicants</h1>
            <p className="text-xs text-muted-foreground">
              Review and manage inquiries submitted for your franchise opportunities.
            </p>
          </div>
        </div>
      </div>

      {applications.length === 0 ? (
        <Card className="rounded-2xl border-border/50 text-center py-16 px-4">
          <Users className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
          <h3 className="text-lg font-bold">No Applicants Yet</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
            Once your approved franchise opportunities are published on BachatLal, qualified partners will appear here.
          </p>
          <Button
            className="mt-6 rounded-xl font-semibold"
            render={<Link href="/dashboard/franchise" />}
          >
            View Your Opportunities
          </Button>
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
                        {app.applicantType} Partner
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-[10px] capitalize px-2 py-0.5 rounded-full font-semibold ${
                          app.status === "approved"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                            : app.status === "rejected"
                            ? "bg-red-500/10 text-red-600 border-red-500/30"
                            : "bg-amber-500/10 text-amber-700 border-amber-500/30"
                        }`}
                      >
                        {app.status?.replace("_", " ")}
                      </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                      <Building2 className="h-3.5 w-3.5 text-primary" />
                      <span>Opportunity: {app.opportunity?.title}</span>
                      <span>•</span>
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{new Date(app.createdAt).toLocaleDateString()}</span>
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
                      <IndianRupee className="h-3.5 w-3.5 text-amber-600" /> Capacity
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
                    Note: &ldquo;{app.reviewNotes}&rdquo;
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
