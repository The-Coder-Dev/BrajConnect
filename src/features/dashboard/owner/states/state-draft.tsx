"use client";

import React from "react";
import { FileText, ArrowRight, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

interface StateDraftProps {
  business: any;
  completion: {
    percentage: number;
    missingSteps: string[];
  };
}

export function StateDraft({ business, completion }: StateDraftProps) {
  return (
    <div className="space-y-8 py-6 max-w-5xl mx-auto">
      {/* Draft Alert Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 uppercase tracking-wider">
              Draft Status
            </span>
            <span className="text-xs text-amber-700/80 dark:text-amber-300/80 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Last updated: {new Date(business.updatedAt).toLocaleDateString()}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Complete Registration for "{business.name || "Untitled Business"}"
          </h1>
          <p className="text-sm text-amber-800/90 dark:text-amber-300/90 max-w-2xl">
            Your business draft is currently saved. Finish missing steps and submit for manual verification to list your business publicly.
          </p>
        </div>
        <Link href="/setup/business">
          <Button size="lg" className="h-12 px-7 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md shrink-0">
            Continue Setup <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Completion Progress Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 rounded-2xl border-border/60 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">Profile Completion</h3>
              <p className="text-xs text-muted-foreground">Complete 100% of required fields to submit for admin review.</p>
            </div>
            <div className="text-2xl font-black text-amber-600">{completion.percentage}%</div>
          </div>

          <Progress value={completion.percentage} className="h-3 bg-muted rounded-full overflow-hidden" />

          {/* Missing Checklist */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Missing Requirements</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {completion.missingSteps.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl border border-red-200/60 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/20 text-xs font-semibold text-red-700 dark:text-red-300">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{step} Required</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Info Sidebar */}
        <Card className="rounded-2xl border-border/60 shadow-sm p-6 bg-card flex flex-col justify-between">
          <div className="space-y-4">
            <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
              <FileText className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-base">Why complete setup?</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Incomplete drafts remain hidden from public search results and category listings. Submitting your draft triggers manual admin verification.
            </p>
          </div>
          <div className="pt-6">
            <Link href="/setup/business">
              <Button variant="outline" className="w-full rounded-xl border-amber-300 text-amber-700 hover:bg-amber-50">
                Resume Onboarding Form
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
