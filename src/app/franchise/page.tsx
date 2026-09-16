import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import {
  Compass,
  UserPlus,
  LogIn,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Building2,
  ArrowRight,
  Sparkles,
  Search,
} from "lucide-react";
import { getApprovedFranchiseOpportunities } from "@/server/actions/franchise/opportunities";
import { OpportunityCard } from "@/components/franchise/opportunity-card";

export const metadata = {
  title: "Franchise Partner Hub - BachatLal",
  description:
    "Partner with verified, high-growth local businesses. Proven models, strong brand recognition, and end-to-end operational support across the Braj & UP region.",
};

export default async function FranchisePublicHubPage() {
  // Fetch sample featured opportunities for the preview
  const oppsRes = await getApprovedFranchiseOpportunities();
  const featuredOpportunities = oppsRes.success && oppsRes.data ? oppsRes.data.slice(0, 3) : [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar variant="solid" />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-28 border-b border-border/50 bg-linear-to-b from-amber-500/10 via-background to-background overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-amber-400/15 via-transparent to-transparent pointer-events-none" />

          <div className="container max-w-6xl mx-auto px-4 text-center space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-wider shadow-xs">
              <Compass className="h-4 w-4" /> Regional Franchise Network
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground max-w-4xl mx-auto leading-tight md:leading-none">
              Own a Verified Franchise in Your City with{" "}
              <span className="bg-linear-to-r from-amber-600 via-orange-600 to-amber-600 bg-clip-text text-transparent">
                BachatLal
              </span>
            </h1>

            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Connect directly with established, profitable local enterprises across Uttar Pradesh.
              Eliminate middlemen, secure territory rights, and launch with comprehensive brand backing.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Button
                size="lg"
                className="rounded-full h-12 px-8 font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-lg hover:shadow-amber-500/25 transition-all gap-2 cursor-pointer"
                render={<Link href="/register/franchise" />}
              >
                <UserPlus className="h-4 w-4" /> Register as Franchise Partner
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="rounded-full h-12 px-8 font-semibold border-border/70 hover:bg-muted/80 transition-all gap-2 cursor-pointer"
                render={<Link href="/login/franchise" />}
              >
                <LogIn className="h-4 w-4" /> Partner Login
              </Button>
            </div>

            {/* Trust badges */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Verified Business Financials</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-amber-600" />
                <span>Zero Hidden Brokerage</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span>Proven High-ROI Models</span>
              </div>
            </div>
          </div>
        </section>

        {/* Why Partner Section */}
        <section className="py-16 md:py-20 container max-w-6xl mx-auto px-4">
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Why Partner Through BachatLal?
            </h2>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto">
              We bridge the gap between regional brands seeking expansion and passionate entrepreneurs looking for turnkey business ventures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 md:p-8 rounded-3xl border border-border/50 bg-card space-y-4 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                <Building2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold">Vetted Local Brands</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Every franchise opportunity listed has undergone platform verification to ensure operational viability and brand credibility.
              </p>
            </div>

            <div className="p-6 md:p-8 rounded-3xl border border-border/50 bg-card space-y-4 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold">Turnkey Store Support</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Receive site selection assistance, staff training programs, supply chain setup, and continuous marketing collateral from the franchisor.
              </p>
            </div>

            <div className="p-6 md:p-8 rounded-3xl border border-border/50 bg-card space-y-4 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold">Transparent Unit Operations</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Track your applications and units through your dedicated Franchise Partner portal with real-time status updates and document exchanges.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Opportunities Preview */}
        {featuredOpportunities.length > 0 && (
          <section className="py-16 bg-muted/20 border-t border-border/40">
            <div className="container max-w-6xl mx-auto px-4 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                    Latest Openings
                  </span>
                  <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                    Featured Opportunities
                  </h2>
                </div>
                <Button
                  variant="outline"
                  className="rounded-full gap-2 text-xs font-bold"
                  render={<Link href="/franchise/opportunities" />}
                >
                  <Search className="h-3.5 w-3.5" /> View All in Portal <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredOpportunities.map((opp) => (
                  <OpportunityCard key={opp.id} opportunity={opp} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Call To Action Banner */}
        <section className="py-16 md:py-20 container max-w-6xl mx-auto px-4">
          <div className="relative rounded-3xl p-8 md:p-14 bg-linear-to-r from-amber-600 via-orange-600 to-amber-700 text-white overflow-hidden shadow-xl">
            <div className="relative z-10 space-y-4 max-w-2xl">
              <h2 className="text-2xl md:text-4xl font-black tracking-tight leading-tight">
                Ready to Become a Franchise Partner?
              </h2>
              <p className="text-sm md:text-base text-amber-100/90 leading-relaxed">
                Create your partner account in minutes as an individual entrepreneur or corporate entity, explore territory opportunities, and submit your direct applications.
              </p>
              <div className="pt-4 flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="rounded-full h-11 px-8 font-bold bg-white text-slate-900 hover:bg-slate-100 shadow-md cursor-pointer"
                  render={<Link href="/register/franchise" />}
                >
                  Start Your Application
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full h-11 px-8 font-semibold border-white/40 text-white hover:bg-white/10 cursor-pointer"
                  render={<Link href="/login/franchise" />}
                >
                  Existing Partner Login
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
