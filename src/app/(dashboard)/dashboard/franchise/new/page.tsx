import React from "react";
import { requireAuth } from "@/lib/auth/guards";
import { getAdaptiveDashboardData } from "@/server/queries/dashboard/adaptive-dashboard";
import { CreateOpportunityForm } from "@/components/franchise/create-opportunity-form";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Create Franchise Opportunity - BachatLal",
};

export default async function NewFranchiseOpportunityPage() {
  await requireAuth();
  const dashRes = await getAdaptiveDashboardData();
  const activeBusiness = dashRes.success ? dashRes.data?.activeBusiness : null;

  if (!activeBusiness || activeBusiness.status !== "published") {
    return (
      <div className="p-8 border rounded-2xl bg-amber-500/10 border-amber-500/20 text-center space-y-4 max-w-2xl mx-auto my-12">
        <AlertCircle className="h-10 w-10 text-amber-600 mx-auto" />
        <h2 className="text-xl font-bold">Approved Business Required</h2>
        <p className="text-sm text-muted-foreground">
          To create franchise opportunities, you must have an active and published business profile on BachatLal.
        </p>
        <Button className="rounded-xl font-semibold" render={<Link href="/dashboard" />}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
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
          <h1 className="text-2xl font-bold tracking-tight">Create Franchise Opportunity</h1>
          <p className="text-xs text-muted-foreground">
            Offer franchise rights for <span className="font-semibold text-foreground">{activeBusiness.name}</span>
          </p>
        </div>
      </div>

      <CreateOpportunityForm business={activeBusiness} />
    </div>
  );
}
