import React from "react";
import { getApprovedFranchiseOpportunities } from "@/server/actions/franchise/opportunities";
import { OpportunityCard } from "@/components/franchise/opportunity-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Compass,
  Search,
  MapPin,
  Briefcase,
} from "lucide-react";
import { Input } from "@/components/ui/input";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Explore Opportunities - Franchise Partner Portal | BachatLal",
  description: "Browse verified franchise opportunities from top businesses across the region.",
};

interface FranchiseOpportunitiesPortalPageProps {
  searchParams: Promise<{
    search?: string;
    city?: string;
    state?: string;
  }>;
}

export default async function FranchiseOpportunitiesPortalPage({
  searchParams,
}: FranchiseOpportunitiesPortalPageProps) {
  const params = await searchParams;

  const res = await getApprovedFranchiseOpportunities({
    search: params.search,
    city: params.city,
    state: params.state,
  });

  const opportunities = res.success && res.data ? res.data : [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-semibold mb-2">
            <Compass className="h-3.5 w-3.5" /> Franchise Directory
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Explore Opportunities
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Discover verified franchise opportunities and apply directly to expand with proven brands.
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="p-4 rounded-2xl bg-card border border-border/50 shadow-xs">
        <form method="GET" className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative sm:col-span-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              name="search"
              defaultValue={params.search || ""}
              placeholder="Search by franchise title, brand name, or keywords..."
              className="pl-10 h-11 rounded-xl bg-background text-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                name="city"
                defaultValue={params.city || ""}
                placeholder="City (e.g. Mathura)"
                className="pl-10 h-11 rounded-xl bg-background text-sm"
              />
            </div>
            <Button type="submit" className="h-11 rounded-xl px-5 font-bold bg-amber-600 hover:bg-amber-700 text-white">
              Filter
            </Button>
          </div>
        </form>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold tracking-tight">
          Available Opportunities ({opportunities.length})
        </h2>
        {params.search || params.city ? (
          <Link
            href="/franchise/opportunities"
            className="text-xs text-amber-600 hover:text-amber-700 font-semibold hover:underline"
          >
            Clear Filters
          </Link>
        ) : null}
      </div>

      {/* Results Grid */}
      {opportunities.length === 0 ? (
        <div className="p-16 border rounded-2xl border-dashed border-border/60 text-center space-y-4 bg-card/50">
          <Briefcase className="h-12 w-12 text-muted-foreground/40 mx-auto" />
          <h3 className="text-lg font-bold">No Opportunities Found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            There are currently no active franchise opportunities matching your search criteria. Try modifying your search filters.
          </p>
          <Button
            variant="outline"
            className="rounded-xl font-semibold"
            render={<Link href="/franchise/opportunities" />}
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))}
        </div>
      )}
    </div>
  );
}
