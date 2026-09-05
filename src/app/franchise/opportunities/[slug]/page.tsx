import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getFranchiseOpportunityBySlug } from "@/server/actions/franchise/opportunities";
import { getSession } from "@/lib/auth/guards";
import { db } from "@/db";
import { franchiseProfile } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ApplyModal } from "@/components/franchise/apply-modal";
import {
  Building2,
  MapPin,
  IndianRupee,
  Calendar,
  CheckCircle2,
  Award,
  Sparkles,
  ArrowLeft,
  Briefcase,
  Share2,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface OpportunityDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: OpportunityDetailPageProps) {
  const { slug } = await params;
  const res = await getFranchiseOpportunityBySlug(slug);
  if (!res.success || !res.data) {
    return { title: "Opportunity Not Found - BachatLal" };
  }
  return {
    title: `${res.data.title} - ${res.data.business?.name} Franchise | BachatLal`,
    description: res.data.description?.slice(0, 160),
  };
}

export default async function FranchiseOpportunityDetailPage({
  params,
}: OpportunityDetailPageProps) {
  const { slug } = await params;
  const res = await getFranchiseOpportunityBySlug(slug);

  if (!res.success || !res.data) {
    notFound();
  }

  const opp = res.data;
  const biz = opp.business;

  // Check current session to prefill application if user is logged in
  const session = await getSession();
  const currentUser = session?.user || null;

  let partnerProfile = null;
  if (currentUser?.id) {
    partnerProfile = await db.query.franchiseProfile.findFirst({
      where: eq(franchiseProfile.userId, currentUser.id),
    });
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar variant="solid" />

      <main className="flex-1 pb-16">
        {/* Back Link Breadcrumb */}
        <div className="container max-w-6xl mx-auto px-4 pt-6 pb-2">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-xl text-xs font-semibold gap-1.5 text-muted-foreground hover:text-foreground"
            render={<Link href="/franchise/opportunities" />}
          >
            <ArrowLeft className="h-4 w-4" /> Back to All Opportunities
          </Button>
        </div>

        {/* Hero Banner with Media */}
        <section className="container max-w-6xl mx-auto px-4 py-4">
          <div className="relative rounded-3xl overflow-hidden border border-border/50 bg-slate-900 text-white min-h-[300px] md:min-h-[360px] flex flex-col justify-end p-6 md:p-10">
            {biz?.coverUrl && (
              <Image
                src={biz.coverUrl}
                alt={biz.name}
                fill
                className="object-cover opacity-35"
                priority
              />
            )}
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-3 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className="bg-amber-500/20 text-amber-300 border-amber-500/40 text-xs font-bold px-3 py-1 rounded-full"
                  >
                    Verified Franchise
                  </Badge>
                  <span className="text-xs font-bold bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                    {opp.availableUnits} Unit{opp.availableUnits > 1 ? "s" : ""} Available
                  </span>
                </div>

                <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight drop-shadow-md">
                  {opp.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-white/90">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Building2 className="h-4 w-4 text-amber-400" />
                    <span>{biz?.name}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-amber-400" />
                    <span>{opp.availableCity}, {opp.availableState}</span>
                  </div>
                  {opp.territoryType && (
                    <>
                      <span>•</span>
                      <span>{opp.territoryType}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="shrink-0">
                <ApplyModal
                  opportunity={opp}
                  currentUser={currentUser}
                  franchiseProfile={partnerProfile}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Grid */}
        <section className="container max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Details (2 cols) */}
            <div className="lg:col-span-2 space-y-8">
              {/* Opportunity Description */}
              <div className="p-6 md:p-8 rounded-3xl border border-border/50 bg-card space-y-4 shadow-xs">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-amber-600" /> About the Opportunity
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {opp.description}
                </p>
              </div>

              {/* Space & Requirements */}
              <div className="p-6 md:p-8 rounded-3xl border border-border/50 bg-card space-y-6 shadow-xs">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-amber-600" /> Requirements & Eligibility
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-muted/40 border border-border/30 space-y-1">
                    <span className="text-muted-foreground font-medium">Minimum Space Required</span>
                    <p className="text-sm font-extrabold text-foreground">{opp.minSpaceRequired}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-muted/40 border border-border/30 space-y-1">
                    <span className="text-muted-foreground font-medium">Available Units</span>
                    <p className="text-sm font-extrabold text-foreground">{opp.availableUnits} Territories</p>
                  </div>
                </div>

                {opp.experienceRequired && (
                  <div className="space-y-1 text-xs">
                    <span className="font-bold text-foreground">Experience Required:</span>
                    <p className="text-muted-foreground leading-relaxed">{opp.experienceRequired}</p>
                  </div>
                )}

                {opp.eligibilityRequirements && (
                  <div className="space-y-1 text-xs">
                    <span className="font-bold text-foreground">Eligibility Criteria:</span>
                    <p className="text-muted-foreground leading-relaxed">{opp.eligibilityRequirements}</p>
                  </div>
                )}
              </div>

              {/* Brand Support Provided */}
              {(opp.trainingProvided || opp.marketingSupport || opp.operationalSupport || opp.initialSetupSupport) && (
                <div className="p-6 md:p-8 rounded-3xl border border-border/50 bg-card space-y-6 shadow-xs">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-amber-600" /> Brand Support Provided
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    {opp.trainingProvided && (
                      <div className="p-4 rounded-2xl bg-muted/40 border border-border/30 space-y-1">
                        <span className="font-bold text-foreground">Training Support</span>
                        <p className="text-muted-foreground leading-relaxed">{opp.trainingProvided}</p>
                      </div>
                    )}

                    {opp.marketingSupport && (
                      <div className="p-4 rounded-2xl bg-muted/40 border border-border/30 space-y-1">
                        <span className="font-bold text-foreground">Marketing & Collateral</span>
                        <p className="text-muted-foreground leading-relaxed">{opp.marketingSupport}</p>
                      </div>
                    )}

                    {opp.operationalSupport && (
                      <div className="p-4 rounded-2xl bg-muted/40 border border-border/30 space-y-1">
                        <span className="font-bold text-foreground">Operational Guidance</span>
                        <p className="text-muted-foreground leading-relaxed">{opp.operationalSupport}</p>
                      </div>
                    )}

                    {opp.initialSetupSupport && (
                      <div className="p-4 rounded-2xl bg-muted/40 border border-border/30 space-y-1">
                        <span className="font-bold text-foreground">Store Setup & Architecture</span>
                        <p className="text-muted-foreground leading-relaxed">{opp.initialSetupSupport}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Agreement Terms */}
              {(opp.agreementDuration || opp.renewalTerms || opp.termsConditions) && (
                <div className="p-6 md:p-8 rounded-3xl border border-border/50 bg-card space-y-4 shadow-xs">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Award className="h-5 w-5 text-amber-600" /> Agreement & Terms
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    {opp.agreementDuration && (
                      <div className="p-4 rounded-2xl bg-muted/40 border border-border/30 space-y-1">
                        <span className="text-muted-foreground font-medium">Agreement Duration</span>
                        <p className="text-sm font-extrabold text-foreground">{opp.agreementDuration}</p>
                      </div>
                    )}

                    {opp.renewalTerms && (
                      <div className="p-4 rounded-2xl bg-muted/40 border border-border/30 space-y-1">
                        <span className="text-muted-foreground font-medium">Renewal Terms</span>
                        <p className="text-sm font-extrabold text-foreground">{opp.renewalTerms}</p>
                      </div>
                    )}
                  </div>

                  {opp.termsConditions && (
                    <div className="space-y-1 text-xs pt-2">
                      <span className="font-bold text-foreground">Terms & Conditions:</span>
                      <p className="text-muted-foreground leading-relaxed">{opp.termsConditions}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Sticky Investment Summary & CTA (1 col) */}
            <div className="space-y-6">
              {/* Financial Breakdown Card */}
              <div className="p-6 rounded-3xl border border-border/50 bg-card shadow-sm space-y-6 sticky top-24">
                <div className="space-y-1 border-b border-border/40 pb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Investment Summary
                  </span>
                  <div className="flex items-baseline gap-1 text-2xl md:text-3xl font-black text-foreground">
                    <span>{opp.estimatedInvestment}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Estimated Total Investment</p>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40">
                    <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-amber-600" /> Franchise Fee
                    </span>
                    <span className="font-bold text-foreground">{opp.franchiseFee}</span>
                  </div>

                  {opp.expectedSetupCost && (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40">
                      <span className="text-muted-foreground font-medium">Setup Cost</span>
                      <span className="font-bold text-foreground">{opp.expectedSetupCost}</span>
                    </div>
                  )}

                  {opp.investmentRange && (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40">
                      <span className="text-muted-foreground font-medium">Investment Range</span>
                      <span className="font-bold text-foreground">{opp.investmentRange}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40">
                    <span className="text-muted-foreground font-medium">Territory</span>
                    <span className="font-bold text-foreground">{opp.territoryType || "Exclusive"}</span>
                  </div>
                </div>

                {/* Primary CTA */}
                <div className="pt-2">
                  <ApplyModal
                    opportunity={opp}
                    currentUser={currentUser}
                    franchiseProfile={partnerProfile}
                  />
                </div>

                {/* Brand snippet */}
                <div className="pt-4 border-t border-border/40 flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl border border-border/40 bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                    {biz?.logoUrl ? (
                      <Image
                        src={biz.logoUrl}
                        alt={biz.name}
                        width={44}
                        height={44}
                        className="object-cover"
                      />
                    ) : (
                      <Building2 className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="font-bold text-sm text-foreground truncate">{biz?.name}</h4>
                    <p className="text-[11px] text-muted-foreground">
                      {biz?.establishedYear ? `Est. ${biz.establishedYear}` : "Verified Brand"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
