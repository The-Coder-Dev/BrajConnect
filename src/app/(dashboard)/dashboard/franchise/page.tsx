import React from "react";
import { requireAuth } from "@/lib/auth/guards";
import { getOwnerFranchiseOpportunities } from "@/server/actions/franchise/opportunities";
import { getAdaptiveDashboardData } from "@/server/queries/dashboard/adaptive-dashboard";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Briefcase,
  Plus,
  Building2,
  MapPin,
  IndianRupee,
  Users,
  Eye,
  Send,
  AlertCircle,
} from "lucide-react";
import { SubmitReviewButton } from "@/components/franchise/submit-review-button";

export const metadata = {
  title: "Franchise Opportunities - Owner Dashboard",
};

export default async function OwnerFranchisePage() {
  await requireAuth();
  const dashRes = await getAdaptiveDashboardData();
  const activeBusiness = dashRes.success ? dashRes.data?.activeBusiness : null;   

  const oppsRes = await getOwnerFranchiseOpportunities(activeBusiness?.id);
  const opportunities = oppsRes.success && oppsRes.data ? oppsRes.data : [];

  const isPublished = activeBusiness?.status === "published";

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-linear-to-r from-primary/10 via-primary/5 to-transparent p-6 md:p-8 rounded-3xl border border-primary/20">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-primary" />
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Expand your business through franchising
            </h1>
          </div>
          <p className="text-muted-foreground text-sm max-w-2xl">
            Scale your brand presence across territories by partnering with motivated franchise entrepreneurs. Create, submit, and manage franchise offerings for{" "}
            <span className="font-semibold text-foreground">
              {activeBusiness?.name || "your business"}
            </span>.
          </p>
        </div>

        {isPublished ? (
          <Button
            className="rounded-xl shadow-md bg-primary hover:bg-red-600 text-white gap-2 font-bold px-6 h-12 self-start md:self-auto shrink-0 transition-all hover:-translate-y-0.5"
            render={<Link href="/dashboard/franchise/new" />}
          >
            <Plus className="h-5 w-5" />
            Create Franchise Opportunity
          </Button>
        ) : (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
            <span>Business must be approved & published before creating public franchise opportunities.</span>
          </div>
        )}
      </div>

      {/* Opportunities List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">Your Franchise Opportunities</h2>
            <p className="text-xs text-muted-foreground">
              Manage your published listings, draft plans, and applicant flow.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl text-xs font-semibold"
            render={<Link href="/dashboard/franchise/applications" />}
          >
            <Users className="h-3.5 w-3.5 mr-1.5" /> View All Applicants
          </Button>
        </div>

        {opportunities.length === 0 ? (
          <Card className="rounded-2xl border-border/50 text-center py-16 px-4">
            <Briefcase className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-lg font-bold">No Franchise Opportunities Created</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
              Ready to take your business to the next level? Create your first franchise offering and invite qualified partners to invest in your brand.
            </p>
            {isPublished && (
              <Button
                className="mt-6 rounded-xl bg-primary hover:bg-red-600 text-white font-semibold"
                render={<Link href="/dashboard/franchise/new" />}
              >
                Create Franchise Opportunity
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid gap-4">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {opportunities.map((opp: any) => {
              const appCount = opp.applications?.length || 0;

              return (
                <Card
                  key={opp.id}
                  className="rounded-2xl border-border/50 hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                  <div className="p-6 space-y-4">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/40 pb-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5">
                          <h3 className="text-base font-bold text-foreground">
                            {opp.title}
                          </h3>
                          <Badge
                            variant="outline"
                            className={`text-[10px] capitalize px-2.5 py-0.5 rounded-full font-semibold ${
                              opp.status === "approved"
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                                : opp.status === "pending_review"
                                ? "bg-amber-500/10 text-amber-700 border-amber-500/30"
                                : opp.status === "rejected"
                                ? "bg-red-500/10 text-red-600 border-red-500/30"
                                : "bg-slate-500/10 text-slate-600 border-slate-500/30"
                            }`}
                          >
                            {opp.status?.replace("_", " ")}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                          <Building2 className="h-3.5 w-3.5 text-primary" />
                          <span>{opp.business?.name}</span>
                          <span>•</span>
                          <MapPin className="h-3.5 w-3.5 text-amber-600" />
                          <span>{opp.availableCity}, {opp.availableState}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {opp.status === "draft" && (
                          <SubmitReviewButton opportunityId={opp.id} />
                        )}

                        {opp.status === "approved" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl text-xs font-semibold gap-1.5"
                            render={<Link href={`/franchise/opportunities/${opp.slug}`} target="_blank" />}
                          >
                            <Eye className="h-3.5 w-3.5" /> Public View
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="secondary"
                          className="rounded-xl text-xs font-semibold gap-1.5"
                          render={<Link href="/dashboard/franchise/applications" />}
                        >
                          <Users className="h-3.5 w-3.5" /> Applicants ({appCount})
                        </Button>
                      </div>
                    </div>

                    {/* Meta stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-muted/40 border border-border/30 space-y-0.5">
                        <span className="text-muted-foreground font-medium flex items-center gap-1">
                          <IndianRupee className="h-3.5 w-3.5 text-primary" /> Franchise Fee
                        </span>
                        <p className="font-bold text-foreground">{opp.franchiseFee}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-muted/40 border border-border/30 space-y-0.5">
                        <span className="text-muted-foreground font-medium flex items-center gap-1">
                          <IndianRupee className="h-3.5 w-3.5 text-primary" /> Estimated Investment
                        </span>
                        <p className="font-bold text-foreground">{opp.estimatedInvestment}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-muted/40 border border-border/30 space-y-0.5">
                        <span className="text-muted-foreground font-medium">Available Units</span>
                        <p className="font-bold text-foreground">{opp.availableUnits} Units</p>
                      </div>

                      <div className="p-3 rounded-xl bg-muted/40 border border-border/30 space-y-0.5">
                        <span className="text-muted-foreground font-medium">Min Space Required</span>
                        <p className="font-bold text-foreground">{opp.minSpaceRequired}</p>
                      </div>
                    </div>

                    {opp.rejectionReason && opp.status === "rejected" && (
                      <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs space-y-1">
                        <span className="font-bold text-red-700 dark:text-red-300">
                          Rejection Reason:
                        </span>
                        <p className="text-muted-foreground italic">{opp.rejectionReason}</p>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
