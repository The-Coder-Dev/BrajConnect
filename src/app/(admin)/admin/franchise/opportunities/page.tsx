import React from "react";
import { requireAdmin } from "@/lib/auth/guards";
import { getAdminOpportunities } from "@/server/actions/franchise/applications";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Briefcase,
  Building2,
  MapPin,
  IndianRupee,
  Clock,
  Eye,
} from "lucide-react";
import { FranchiseOpportunityModerator } from "@/components/admin/franchise-opportunity-moderator";

export const metadata = {
  title: "Admin - Franchise Opportunities Moderation",
};

interface AdminOpportunitiesPageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function AdminFranchiseOpportunitiesPage({
  searchParams,
}: AdminOpportunitiesPageProps) {
  await requireAdmin();
  const params = await searchParams;
  const currentStatus = params.status || "all";

  const res = await getAdminOpportunities(currentStatus);
  const opportunities = res.success && res.data ? res.data : [];

  const statusFilters = [
    { label: "All", value: "all" },
    { label: "Pending Review", value: "pending_review" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
    { label: "Drafts", value: "draft" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Franchise Opportunities Moderation
          </h1>
          <p className="text-xs text-muted-foreground">
            Review submitted franchise offerings before they appear publicly for partners.
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
            render={<Link href={`/admin/franchise/opportunities?status=${tab.value}`} />}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {opportunities.length === 0 ? (
        <Card className="rounded-2xl border-border/50 text-center py-16 px-4">
          <Briefcase className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
          <h3 className="text-lg font-bold">No Opportunities Found</h3>
          <p className="text-xs text-muted-foreground mt-1">
            No franchise opportunities match status &ldquo;{currentStatus}&rdquo;.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {opportunities.map((opp: any) => (
            <Card
              key={opp.id}
              className="rounded-2xl border-border/50 hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              <div className="p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/40 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <h3 className="font-bold text-base text-foreground">{opp.title}</h3>
                      <Badge
                        variant="outline"
                        className={`text-[10px] capitalize px-2.5 py-0.5 rounded-full font-semibold ${
                          opp.status === "approved"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                            : opp.status === "pending_review"
                            ? "bg-amber-500/10 text-amber-700 border-amber-500/30 font-bold"
                            : opp.status === "rejected"
                            ? "bg-red-500/10 text-red-600 border-red-500/30"
                            : "bg-slate-500/10 text-slate-600 border-slate-500/30"
                        }`}
                      >
                        {opp.status?.replace("_", " ")}
                      </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-foreground flex items-center gap-1">
                        <Building2 className="h-3.5 w-3.5 text-primary" /> {opp.business?.name}
                      </span>
                      <span>•</span>
                      <span>Owner: {opp.owner?.name} ({opp.owner?.email})</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-amber-600" />
                        {opp.availableCity}, {opp.availableState}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {opp.status === "approved" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl text-xs font-semibold gap-1"
                        render={<Link href={`/franchise/opportunities/${opp.slug}`} target="_blank" />}
                      >
                        <Eye className="h-3.5 w-3.5" /> Public View
                      </Button>
                    )}

                    <FranchiseOpportunityModerator opportunity={opp} />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-muted/40 border border-border/30 space-y-0.5">
                    <span className="text-muted-foreground font-medium flex items-center gap-1">
                      <IndianRupee className="h-3.5 w-3.5 text-primary" /> Franchise Fee
                    </span>
                    <p className="font-bold text-foreground">{opp.franchiseFee}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-muted/40 border border-border/30 space-y-0.5">
                    <span className="text-muted-foreground font-medium flex items-center gap-1">
                      <IndianRupee className="h-3.5 w-3.5 text-primary" /> Total Investment
                    </span>
                    <p className="font-bold text-foreground">{opp.estimatedInvestment}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-muted/40 border border-border/30 space-y-0.5">
                    <span className="text-muted-foreground font-medium">Available Units</span>
                    <p className="font-bold text-foreground">{opp.availableUnits} Units</p>
                  </div>

                  <div className="p-3 rounded-xl bg-muted/40 border border-border/30 space-y-0.5">
                    <span className="text-muted-foreground font-medium">Space Requirement</span>
                    <p className="font-bold text-foreground">{opp.minSpaceRequired}</p>
                  </div>
                </div>

                {opp.rejectionReason && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-700 dark:text-red-300">
                    <span className="font-bold">Admin Reason:</span> {opp.rejectionReason}
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
