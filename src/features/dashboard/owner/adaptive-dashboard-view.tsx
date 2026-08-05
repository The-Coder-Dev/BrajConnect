"use client";

import React, { useState } from "react";
import { Building2, ChevronDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StateNoBusiness } from "./states/state-no-business";
import { StateDraft } from "./states/state-draft";
import { StatePending } from "./states/state-pending";
import { StateRejected } from "./states/state-rejected";
import { StatePublished } from "./states/state-published";

interface AdaptiveDashboardViewProps {
  data: {
    state: "NO_BUSINESS" | "DRAFT" | "PENDING_REVIEW" | "REJECTED" | "PUBLISHED";
    user: any;
    businesses: any[];
    activeBusiness: any;
    draftCompletion?: any;
    metrics?: any;
    leads?: any[];
    notifications?: any[];
    unreadNotificationsCount?: number;
    activities?: any[];
  };
}

export function AdaptiveDashboardView({ data }: AdaptiveDashboardViewProps) {
  const router = useRouter();
  const { state, user, businesses, activeBusiness } = data;

  const handleSelectBusiness = (bId: string) => {
    router.push(`/dashboard?businessId=${bId}`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header with Multi-Business Switcher (If user has businesses) */}
      {businesses && businesses.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold tracking-tight">Business Dashboard</h1>
            
            {/* Multi-business switcher dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border/80 bg-background px-3 py-1.5 text-xs font-bold text-foreground hover:bg-muted transition-colors">
                <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="max-w-40 truncate">{activeBusiness?.name || "Select Business"}</span>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 rounded-xl">
                {businesses.map((b) => (
                  <DropdownMenuItem
                    key={b.id}
                    onClick={() => handleSelectBusiness(b.id)}
                    className="flex items-center justify-between text-xs font-medium cursor-pointer"
                  >
                    <span className="truncate">{b.name}</span>
                    <Badge variant="outline" className="text-[10px] uppercase">
                      {b.status}
                    </Badge>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Link href="/setup/business">
            <Button size="sm" className="rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs">
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Another Business
            </Button>
          </Link>
        </div>
      )}

      {/* Render Adaptive State Component */}
      {state === "NO_BUSINESS" && <StateNoBusiness userName={user.name} />}

      {state === "DRAFT" && activeBusiness && (
        <StateDraft
          business={activeBusiness}
          completion={data.draftCompletion || { percentage: 50, missingSteps: [] }}
        />
      )}

      {state === "PENDING_REVIEW" && activeBusiness && (
        <StatePending business={activeBusiness} />
      )}

      {state === "REJECTED" && activeBusiness && (
        <StateRejected business={activeBusiness} />
      )}

      {state === "PUBLISHED" && activeBusiness && (
        <StatePublished
          business={activeBusiness}
          metrics={data.metrics || {}}
          leads={data.leads || []}
          notifications={data.notifications || []}
          unreadNotificationsCount={data.unreadNotificationsCount || 0}
          activities={data.activities || []}
        />
      )}
    </div>
  );
}
