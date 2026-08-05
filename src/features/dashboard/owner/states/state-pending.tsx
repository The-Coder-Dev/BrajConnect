"use client";

import React from "react";
import { Clock, ShieldAlert, CheckCircle2, HelpCircle, FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface StatePendingProps {
  business: any;
}

export function StatePending({ business }: StatePendingProps) {
  return (
    <div className="space-y-8 py-6 max-w-5xl mx-auto">
      {/* Pending Banner */}
      <div className="p-8 rounded-3xl bg-blue-500/10 border border-blue-500/20 text-blue-900 dark:text-blue-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-700 dark:text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 animate-spin" /> Pending Review
            </span>
            <span className="text-xs text-blue-700/80 dark:text-blue-300/80">
              Submitted: {new Date(business.updatedAt).toLocaleDateString()}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            "{business.name}" is Under Verification
          </h1>
          <p className="text-sm text-blue-800/90 dark:text-blue-300/90 max-w-2xl">
            Our admin team is verifying your business details and uploaded compliance documents. Once approved, your business page will automatically go live.
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-blue-200/60 dark:border-blue-900/60 text-center shrink-0">
          <p className="text-xs text-muted-foreground font-medium">Estimated Turnaround</p>
          <p className="text-xl font-extrabold text-blue-600 dark:text-blue-400 mt-0.5">24 - 48 Hours</p>
        </div>
      </div>

      {/* Verification Process Timeline */}
      <Card className="rounded-2xl border-border/60 shadow-sm p-6 space-y-6">
        <h3 className="text-lg font-bold">Verification Progress</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-2">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              1. Submission Received
            </div>
            <p className="text-xs text-muted-foreground">Your onboarding details were successfully compiled and submitted.</p>
          </div>

          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 space-y-2">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold text-sm">
              <Clock className="w-4 h-4 text-blue-600 animate-pulse" />
              2. Document Check
            </div>
            <p className="text-xs text-muted-foreground">Admin team is inspecting uploaded GST/PAN verification documents.</p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 dark:bg-slate-900/40 space-y-2">
            <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
              <span className="w-4 h-4 rounded-full border border-slate-400 flex items-center justify-center text-[10px]">3</span>
              3. Final Approval & Publish
            </div>
            <p className="text-xs text-muted-foreground">Approved business listing goes live on public search & category pages.</p>
          </div>
        </div>
      </Card>

      {/* Need Assistance Action */}
      <div className="p-6 rounded-2xl border bg-card flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center shrink-0">
            <HelpCircle className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-base">Have questions about your submission?</h4>
            <p className="text-xs text-muted-foreground">If you need to update any information while under review, contact our support team.</p>
          </div>
        </div>
        <Link href="/dashboard/support">
          <Button variant="outline" className="rounded-xl shrink-0">
            Contact Support
          </Button>
        </Link>
      </div>
    </div>
  );
}
