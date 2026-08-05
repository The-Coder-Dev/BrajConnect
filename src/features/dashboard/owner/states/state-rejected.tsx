"use client";

import React from "react";
import { XCircle, AlertTriangle, ArrowRight, RefreshCw, Pencil, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface StateRejectedProps {
  business: any;
}

export function StateRejected({ business }: StateRejectedProps) {
  const rejectionReason = business.rejectionReason || "Verification criteria incomplete or missing valid business license.";

  return (
    <div className="space-y-8 py-6 max-w-5xl mx-auto">
      {/* Rejection Alert Banner */}
      <div className="p-8 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-900 dark:text-red-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-700 dark:text-red-300 uppercase tracking-wider flex items-center gap-1.5">
              <XCircle className="w-3.5 h-3.5" /> Action Required
            </span>
            <span className="text-xs text-red-700/80 dark:text-red-300/80">
              Reviewed: {new Date(business.updatedAt).toLocaleDateString()}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Submission Requires Correction for "{business.name}"
          </h1>
          <p className="text-sm text-red-800/90 dark:text-red-300/90 max-w-2xl">
            Our verification team reviewed your submission and requested corrections before approval can proceed.
          </p>
        </div>
        <Link href="/setup/business">
          <Button size="lg" className="h-12 px-7 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shrink-0">
            <Pencil className="mr-2 h-4 w-4" /> Edit & Fix Submission
          </Button>
        </Link>
      </div>

      {/* Detailed Rejection Reason Card */}
      <Card className="rounded-2xl border-red-200 dark:border-red-900/50 shadow-sm p-6 bg-red-50/30 dark:bg-red-950/10 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-red-100 dark:bg-red-900/40 text-red-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-red-900 dark:text-red-200">Rejection Reason Provided by Admin</h3>
            <p className="text-xs text-red-700/80 dark:text-red-300/80">Address the issue below before resubmitting.</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/50 text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
          "{rejectionReason}"
        </div>

        <div className="pt-2 flex flex-wrap gap-4">
          <Link href="/setup/business">
            <Button className="rounded-xl bg-red-600 hover:bg-red-700 text-white">
              Update Business Details <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/dashboard/support">
            <Button variant="outline" className="rounded-xl">
              Request Admin Assistance
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
