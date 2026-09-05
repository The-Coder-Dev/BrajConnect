import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  MapPin,
  IndianRupee,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface OpportunityCardProps {
  opportunity: {
    id: string;
    title: string;
    slug: string;
    description: string;
    franchiseFee: string;
    estimatedInvestment: string;
    investmentRange?: string | null;
    availableCity: string;
    availableState: string;
    availableUnits: number;
    minSpaceRequired: string;
    business?: {
      id: string;
      name: string;
      slug: string;
      logoUrl?: string | null;
      coverUrl?: string | null;
      shortDescription?: string | null;
    } | null;
  };
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const biz = opportunity.business;

  return (
    <Card className="group rounded-3xl border border-border/50 hover:border-amber-500/40 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col bg-card">
      {/* Top Media / Brand Banner */}
      <div className="relative h-44 w-full bg-linear-to-br from-amber-500/15 via-primary/5 to-slate-900/10 overflow-hidden">
        {biz?.coverUrl ? (
          <Image
            src={biz.coverUrl}
            alt={biz.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30">
            <Building2 className="h-16 w-16" />
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

        {/* Brand Tag & Units Badge */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
          <Badge
            variant="outline"
            className="bg-background/90 backdrop-blur-md text-foreground border-border/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs"
          >
            Verified Franchise
          </Badge>

          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500 text-white shadow-xs">
            {opportunity.availableUnits} Unit{opportunity.availableUnits > 1 ? "s" : ""} Left
          </span>
        </div>

        {/* Brand Title Overlay on Image */}
        <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center gap-2.5">
          <div className="h-10 w-10 rounded-xl bg-white shadow-md flex items-center justify-center overflow-hidden shrink-0 border border-border/30">
            {biz?.logoUrl ? (
              <Image
                src={biz.logoUrl}
                alt={biz.name}
                width={40}
                height={40}
                className="object-cover"
              />
            ) : (
              <Building2 className="h-5 w-5 text-primary" />
            )}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white/90 uppercase tracking-wider truncate">
              {biz?.name}
            </p>
            <h3 className="text-sm font-extrabold text-white truncate drop-shadow-xs">
              {opportunity.title}
            </h3>
          </div>
        </div>
      </div>

      {/* Body Information */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-amber-600 shrink-0" />
            <span className="font-semibold text-foreground truncate">
              {opportunity.availableCity}, {opportunity.availableState}
            </span>
          </div>

          {/* Description snippet */}
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {opportunity.description || biz?.shortDescription}
          </p>

          {/* Investment & Fee Highlights */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="p-2.5 rounded-xl bg-muted/40 border border-border/30 space-y-0.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                <IndianRupee className="h-3 w-3 text-primary" /> Investment
              </span>
              <p className="font-extrabold text-xs text-foreground truncate">
                {opportunity.estimatedInvestment}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-muted/40 border border-border/30 space-y-0.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-amber-600" /> Franchise Fee
              </span>
              <p className="font-extrabold text-xs text-foreground truncate">
                {opportunity.franchiseFee}
              </p>
            </div>
          </div>
        </div>

        {/* CTA Footer */}
        <div className="pt-2 border-t border-border/30 flex items-center justify-between gap-2">
          <span className="text-[11px] text-muted-foreground">
            Min Space: <span className="font-semibold text-foreground">{opportunity.minSpaceRequired}</span>
          </span>

          <Button
            size="sm"
            className="rounded-xl font-bold bg-amber-600 hover:bg-amber-700 text-white text-xs gap-1 group-hover:shadow-sm"
            render={<Link href={`/franchise/opportunities/${opportunity.slug}`} />}
          >
            View Details <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
