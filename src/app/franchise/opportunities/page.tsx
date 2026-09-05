import React from "react";
import { getApprovedFranchiseOpportunities } from "@/server/actions/franchise/opportunities";
import { OpportunityCard } from "@/components/franchise/opportunity-card";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Compass,
  Search,
  MapPin,
  Briefcase,
  UserPlus,
} from "lucide-react";
import { Input } from "@/components/ui/input";

export const metadata = {
  title: "Franchise Opportunities - BachatLal",
  description: "Browse verified franchise opportunities from top businesses across the region.",
};

interface FranchiseOpportunitiesPageProps {
  searchParams: Promise<{
    search?: string;
    city?: string;
    state?: string;
  }>;
}

export default async function FranchiseOpportunitiesPage({
  searchParams,
}: FranchiseOpportunitiesPageProps) {
  const params = await searchParams;

  const res = await getApprovedFranchiseOpportunities({
    search: params.search,
    city: params.city,
    state: params.state,
  });

  const opportunities = res.success && res.data ? res.data : [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar variant="solid" />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 md:py-20 border-b border-border/50 bg-linear-to-b from-amber-500/10 via-background to-background">
          <div className="container max-w-6xl mx-auto px-4 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Compass className="h-4 w-4" /> Regional Franchise Hub
            </div>

            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground max-w-3xl mx-auto leading-tight">
              Discover & Launch Your Next{" "}
              <span className="bg-linear-to-r from-amber-600 via-red-600 to-amber-600 bg-clip-text text-transparent">
                Franchise Venture
              </span>
            </h1>

            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
              Connect directly with verified, profitable businesses across Uttar Pradesh looking for expansion partners. Low entry barriers, proven models, and full brand support.
            </p>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button
                className="rounded-full h-11 px-6 font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-md gap-2"
                render={<Link href="/register/franchise" />}
              >
                <UserPlus className="h-4 w-4" /> Register as Franchise Partner
              </Button>
              <Button
                variant="outline"
                className="rounded-full h-11 px-6 font-semibold border-border/60"
                render={<Link href="/login/franchise" />}
              >
                Partner Login
              </Button>
            </div>
          </div>
        </section>

        {/* Search & Listing Section */}
        <section className="py-12 container max-w-6xl mx-auto px-4 space-y-8">
          {/* Search Bar */}
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
                <Button type="submit" className="h-11 rounded-xl px-5 font-bold bg-primary hover:bg-red-600 text-white">
                  Filter
                </Button>
              </div>
            </form>
          </div>

          {/* Results Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight">
                Available Opportunities ({opportunities.length})
              </h2>
              {params.search || params.city ? (
                <Link
                  href="/franchise/opportunities"
                  className="text-xs text-primary font-semibold hover:underline"
                >
                  Clear Filters
                </Link>
              ) : null}
            </div>

            {opportunities.length === 0 ? (
              <div className="p-16 border rounded-3xl border-dashed border-border/60 text-center space-y-4">
                <Briefcase className="h-12 w-12 text-muted-foreground/40 mx-auto" />
                <h3 className="text-lg font-bold">No Franchise Opportunities Found</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  There are currently no active franchise opportunities matching your search criteria. Check back soon or register as a partner to receive new updates.
                </p>
                <Button
                  variant="outline"
                  className="rounded-xl font-semibold"
                  render={<Link href="/franchise/opportunities" />}
                >
                  Reset Filter
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
        </section>
      </main>

      <Footer />
    </div>
  );
}
