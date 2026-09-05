import React from "react";
import { getPartnerApplications } from "@/server/actions/franchise/applications";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Briefcase,
  Building2,
  MapPin,
  Calendar,
  IndianRupee,
  Compass,
  ArrowUpRight,
  Info,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My Franchise Applications - BachatLal",
};

export default async function PartnerApplicationsPage() {
  const res = await getPartnerApplications();
  const applications = res.success && res.data ? res.data : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Franchise Applications</h1>
          <p className="text-muted-foreground text-sm">
            Track and monitor the review status of your franchise inquiries.
          </p>
        </div>

        <Button
          className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold gap-1.5 shadow-xs"
          render={<Link href="/franchise/opportunities" />}
        >
          <Compass className="h-4 w-4" /> Explore More Opportunities
        </Button>
      </div>

      {applications.length === 0 ? (
        <Card className="rounded-2xl border-border/50 text-center py-16 px-4">
          <Briefcase className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
          <h3 className="text-lg font-bold">No Applications Yet</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
            You haven&apos;t submitted any franchise applications yet. Explore our curated franchise opportunities to find the perfect business match.
          </p>
          <Button
            className="mt-6 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold"
            render={<Link href="/franchise/opportunities" />}
          >
            Explore Opportunities
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {applications.map((app: any) => {
            const opp = app.opportunity;
            const biz = app.business;

            return (
              <Card
                key={app.id}
                className="rounded-2xl border-border/50 hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <div className="p-6 space-y-4">
                  {/* Top Bar: Opportunity Title & Status Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/40 pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/franchise/opportunities/${opp?.slug}`}
                          className="text-lg font-bold hover:underline hover:text-amber-700 transition-colors"
                        >
                          {opp?.title || "Franchise Opportunity"}
                        </Link>
                        <Badge
                          variant="outline"
                          className={`text-xs capitalize px-2.5 py-0.5 rounded-full font-semibold ${
                            app.status === "approved"
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                              : app.status === "under_review" || app.status === "submitted"
                              ? "bg-amber-500/10 text-amber-700 border-amber-500/30"
                              : "bg-red-500/10 text-red-600 border-red-500/30"
                          }`}
                        >
                          {app.status?.replace("_", " ")}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-2">
                        <Building2 className="h-3.5 w-3.5 text-primary" />
                        <span className="font-semibold text-foreground">{biz?.name}</span>
                        <span>•</span>
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Applied on {new Date(app.createdAt).toLocaleDateString()}</span>
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl text-xs font-semibold shrink-0 gap-1"
                      render={<Link href={`/franchise/opportunities/${opp?.slug}`} />}
                    >
                      View Listing <ArrowUpRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  {/* Application Details Summary */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="space-y-1 p-3 rounded-xl bg-muted/40 border border-border/30">
                      <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-amber-600" /> Target Location
                      </span>
                      <p className="font-bold text-foreground">{app.preferredLocation}</p>
                    </div>

                    <div className="space-y-1 p-3 rounded-xl bg-muted/40 border border-border/30">
                      <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                        <IndianRupee className="h-3.5 w-3.5 text-amber-600" /> Investment Committed
                      </span>
                      <p className="font-bold text-foreground">{app.investmentCapacity}</p>
                    </div>

                    <div className="space-y-1 p-3 rounded-xl bg-muted/40 border border-border/30">
                      <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                        <Briefcase className="h-3.5 w-3.5 text-amber-600" /> Applicant
                      </span>
                      <p className="font-bold text-foreground capitalize">
                        {app.applicantName} ({app.applicantType})
                      </p>
                    </div>
                  </div>

                  {/* Review Feedback / Notes if any */}
                  {app.reviewNotes && (
                    <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-300">
                        <Info className="h-4 w-4" /> Message from Business / Admin:
                      </div>
                      <p className="text-muted-foreground italic">
                        &ldquo;{app.reviewNotes}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
