import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getPartnerFranchiseUnits } from "@/server/actions/franchise/units";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Store,
  MapPin,
  Building2,
  Calendar,
  Compass,
  ArrowRight,
  Sparkles,
  Clock,
  CheckCircle2,
  FileText,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My Franchise Units - Franchise Partner Portal | BachatLal",
  description: "View and manage your approved franchise outlets, active stores, and onboarding status.",
};

const statusConfig: Record<
  string,
  { label: string; className: string; icon: React.ComponentType<{ className?: string }> }
> = {
  setup_in_progress: {
    label: "Setup in Progress",
    className: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
    icon: Clock,
  },
  active: {
    label: "Active & Operational",
    className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    icon: CheckCircle2,
  },
  temporarily_closed: {
    label: "Temporarily Closed",
    className: "bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/30",
    icon: Clock,
  },
  closed: {
    label: "Closed",
    className: "bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/30",
    icon: Clock,
  },
};

export default async function FranchiseUnitsPage() {
  const res = await getPartnerFranchiseUnits();
  const units = res.success && res.data ? res.data : [];

  const activeCount = units.filter((u) => u.status === "active").length;
  const setupCount = units.filter((u) => u.status === "setup_in_progress").length;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-semibold mb-2">
            <Store className="h-3.5 w-3.5" /> Outlet Management
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            My Franchise Units
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track and operate your approved franchise outlets across all partnered brands.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="rounded-xl text-xs font-bold gap-2 cursor-pointer"
            render={<Link href="/franchise/applications" />}
          >
            <FileText className="h-3.5 w-3.5" /> View Applications
          </Button>
          <Button
            className="rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white gap-2 cursor-pointer"
            render={<Link href="/franchise/opportunities" />}
          >
            <Compass className="h-3.5 w-3.5" /> Explore More Brands
          </Button>
        </div>
      </div>

      {/* Overview Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="rounded-2xl border-border/50 shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Units Awarded
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-foreground">{units.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all franchisor agreements</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/50 shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Active & Operational
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-emerald-600">{activeCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently serving customers</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/50 shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Setup In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-amber-600">{setupCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Undergoing site fit-out or training</p>
          </CardContent>
        </Card>
      </div>

      {/* Units List */}
      {units.length === 0 ? (
        <div className="p-16 border rounded-3xl border-dashed border-border/60 text-center space-y-4 bg-card/40">
          <Store className="h-12 w-12 text-muted-foreground/40 mx-auto" />
          <h3 className="text-lg font-bold">No Franchise Units Provisioned Yet</h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
            When a business owner approves your franchise application, a dedicated unit workspace will be automatically provisioned here with onboarding milestones, location specs, and brand support.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              className="rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white gap-2 cursor-pointer"
              render={<Link href="/franchise/opportunities" />}
            >
              <Compass className="h-4 w-4" /> Find Opportunities
            </Button>
            <Button
              variant="outline"
              className="rounded-xl text-xs font-bold gap-2 cursor-pointer"
              render={<Link href="/franchise/applications" />}
            >
              <FileText className="h-4 w-4" /> Check Application Status
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {units.map((unit) => {
            const status = statusConfig[unit.status] || statusConfig.setup_in_progress;
            const StatusIcon = status.icon;

            return (
              <Card
                key={unit.id}
                className="rounded-3xl border-border/50 bg-card overflow-hidden hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="p-6 space-y-4 flex-1">
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-2xl border border-border/40 bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                        {unit.business?.logoUrl ? (
                          <Image
                            src={unit.business.logoUrl}
                            alt={unit.business.name}
                            width={48}
                            height={48}
                            className="object-cover"
                          />
                        ) : (
                          <Building2 className="h-6 w-6 text-primary" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-foreground leading-tight">
                          {unit.name}
                        </h3>
                        <p className="text-xs text-muted-foreground font-medium mt-0.5">
                          Brand: {unit.business?.name}
                        </p>
                      </div>
                    </div>

                    <Badge
                      variant="outline"
                      className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shrink-0 ${status.className}`}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {status.label}
                    </Badge>
                  </div>

                  {/* Specs & Info */}
                  <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="p-3 rounded-xl bg-muted/40 border border-border/30 space-y-1">
                      <span className="text-muted-foreground flex items-center gap-1 font-medium">
                        <MapPin className="h-3.5 w-3.5 text-amber-600" /> Location
                      </span>
                      <p className="font-bold text-foreground truncate">
                        {unit.city}, {unit.state}
                      </p>
                      {unit.address && (
                        <p className="text-[11px] text-muted-foreground truncate">{unit.address}</p>
                      )}
                    </div>

                    <div className="p-3 rounded-xl bg-muted/40 border border-border/30 space-y-1">
                      <span className="text-muted-foreground flex items-center gap-1 font-medium">
                        <Sparkles className="h-3.5 w-3.5 text-amber-600" /> Territory Type
                      </span>
                      <p className="font-bold text-foreground truncate">
                        {unit.opportunity?.territoryType || "Exclusive Territory"}
                      </p>
                      <p className="text-[11px] text-muted-foreground truncate">
                        Space: {unit.opportunity?.minSpaceRequired || "Standard"}
                      </p>
                    </div>
                  </div>

                  {/* Operational Timeline */}
                  <div className="pt-2 text-[11px] text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground/70" />
                    <span>
                      Provisioned on{" "}
                      {new Date(unit.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-4 bg-muted/20 border-t border-border/40 flex items-center justify-between gap-3">
                  <span className="text-xs text-muted-foreground font-mono">
                    ID: {unit.id.slice(0, 12)}...
                  </span>

                  {unit.opportunity?.slug && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-xl text-xs font-semibold gap-1 text-amber-600 hover:text-amber-700"
                      render={<Link href={`/franchise/opportunities/${unit.opportunity.slug}`} />}
                    >
                      Opportunity Details <ArrowRight className="h-3 w-3" />
                    </Button>
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
