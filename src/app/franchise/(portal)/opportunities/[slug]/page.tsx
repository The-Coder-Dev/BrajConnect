import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getFranchiseOpportunityBySlug } from "@/server/actions/franchise/opportunities";
import { getSession } from "@/lib/auth/guards";
import { db } from "@/db";
import { franchiseProfile } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ApplyModal } from "@/components/franchise/apply-modal";
import {
  Building2,
  MapPin,
  IndianRupee,
  CheckCircle2,
  Award,
  Sparkles,
  ArrowLeft,
  Briefcase,
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
    <div className="space-y-6 pb-12">
      {/* Back Link Breadcrumb */}
      <div>
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
      <div className="relative rounded-3xl overflow-hidden border border-border/50 bg-slate-900 text-white min-h-65 md:min-h-80 flex flex-col justify-end p-6 md:p-10">
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

        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold border-none px-3 py-1">
              Verified Franchise
            </Badge>
            {opp.status === "approved" && (
              <Badge variant="outline" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                Active Opportunity
              </Badge>
            )}
            {opp.availableCity && (
              <span className="inline-flex items-center gap-1 text-xs text-slate-300 bg-white/10 px-2.5 py-1 rounded-full backdrop-blur-xs">
                <MapPin className="h-3 w-3 text-amber-400" />
                {opp.availableCity}, {opp.availableState || "UP"}
              </span>
            )}
            <span className="text-xs font-bold bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
              {opp.availableUnits} Unit{opp.availableUnits > 1 ? "s" : ""} Available
            </span>
          </div>

          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white max-w-2xl leading-tight">
            {opp.title}
          </h1>

          <div className="flex items-center gap-3 pt-1">
            <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white overflow-hidden shrink-0">
              {biz?.logoUrl ? (
                <Image
                  src={biz.logoUrl}
                  alt={biz.name}
                  width={40}
                  height={40}
                  className="object-cover"
                />
              ) : (
                <Building2 className="h-5 w-5 text-amber-400" />
              )}
            </div>
            <div>
              <p className="font-semibold text-white text-sm leading-none">{biz?.name}</p>
              <p className="text-xs text-slate-300 mt-0.5">Franchisor Brand</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-card border border-border/50 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <IndianRupee className="h-3 w-3 text-amber-600" /> Est. Investment
          </span>
          <p className="text-base md:text-lg font-extrabold text-foreground truncate">
            {opp.estimatedInvestment || opp.investmentRange || "Contact Brand"}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/50 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <Building2 className="h-3 w-3 text-blue-600" /> Space Required
          </span>
          <p className="text-base md:text-lg font-extrabold text-foreground truncate">
            {opp.minSpaceRequired || "Negotiable"}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/50 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3 w-3 text-red-600" /> Location
          </span>
          <p className="text-base md:text-lg font-extrabold text-foreground truncate">
            {opp.availableCity || "Multi-city"}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/50 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-amber-600" /> Franchise Fee
          </span>
          <p className="text-base md:text-lg font-extrabold text-foreground truncate">
            {opp.franchiseFee || "Contact Brand"}
          </p>
        </div>
      </div>

      {/* Main Content & Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Opportunity Description */}
          <Card className="rounded-2xl border-border/50 shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-amber-600" /> About the Opportunity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-foreground/85 leading-relaxed">
              <p className="whitespace-pre-line">{opp.description}</p>
            </CardContent>
          </Card>

          {/* Requirements & Criteria */}
          {(opp.experienceRequired || opp.eligibilityRequirements) && (
            <Card className="rounded-2xl border-border/50 shadow-xs">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-amber-600" /> Requirements & Eligibility
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-foreground/85 leading-relaxed">
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
              </CardContent>
            </Card>
          )}

          {/* Brand Support Provided */}
          {(opp.trainingProvided || opp.marketingSupport || opp.operationalSupport || opp.initialSetupSupport) && (
            <Card className="rounded-2xl border-border/50 shadow-xs">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-600" /> Brand Support Provided
                </CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          )}

          {/* Agreement Terms */}
          {(opp.agreementDuration || opp.renewalTerms || opp.termsConditions) && (
            <Card className="rounded-2xl border-border/50 shadow-xs">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-600" /> Agreement & Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Sticky Sidebar (1 Col) */}
        <div className="space-y-6">
          <div className="sticky top-24 space-y-6">
            <Card className="rounded-2xl border-amber-500/30 bg-card shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold flex items-center justify-between">
                  <span>Take the Next Step</span>
                  <Badge variant="secondary" className="text-xs bg-amber-500/10 text-amber-700 font-bold border-none">
                    Direct Deal
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  Apply directly to connect with the brand owner. Your verified profile details will be shared securely for review.
                </p>

                <div className="space-y-2 text-xs">
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

                {/* Primary CTA: Apply Modal */}
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
