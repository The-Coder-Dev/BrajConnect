"use client";

import React from "react";
import { Building2, Plus, CheckCircle2, ShieldCheck, TrendingUp, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface StateNoBusinessProps {
  userName: string;
}

export function StateNoBusiness({ userName }: StateNoBusinessProps) {
  return (
    <div className="space-y-10 py-6 max-w-5xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-red-600 via-red-700 to-red-900 text-white p-8 sm:p-12 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold backdrop-blur-md">
            <Building2 className="w-3.5 h-3.5 text-red-200" />
            BrajConnect Owner Portal
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Welcome, {userName}! <br />
            <span className="text-red-200">Register Your Business Today.</span>
          </h1>
          <p className="text-red-100 text-base sm:text-lg leading-relaxed">
            Showcase your business to thousands of locals and pilgrims in Mathura & Vrindavan. Get verified, track inquiries, and grow your local presence.
          </p>
          <div className="pt-4 flex flex-wrap gap-4">
            <Link href="/setup/business">
              <Button size="lg" className="h-13 px-8 rounded-xl bg-white text-red-700 hover:bg-slate-50 font-bold text-base shadow-lg hover:scale-[1.02] transition-all">
                <Plus className="mr-2 h-5 w-5" />
                Register Your Business
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Why Register Section */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Why list your business on BrajConnect?</h2>
          <p className="text-muted-foreground text-sm mt-1">Everything you need to capture local customers and manage inquiries.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="rounded-2xl border-border/60 p-6 bg-card hover:shadow-md transition-all">
            <CardContent className="p-0 space-y-3">
              <div className="h-12 w-12 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 flex items-center justify-center">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg">Reach Thousands Daily</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Connect directly with residents, tourists, and pilgrims seeking verified local services in Braj.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/60 p-6 bg-card hover:shadow-md transition-all">
            <CardContent className="p-0 space-y-3">
              <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg">Verified Trust Badge</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Gain instant credibility with our official BrajConnect verification badge after document check.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/60 p-6 bg-card hover:shadow-md transition-all">
            <CardContent className="p-0 space-y-3">
              <div className="h-12 w-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg">Direct Visitor Leads</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Receive direct phone calls, WhatsApp messages, and lead forms straight to your dashboard.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Start CTA Card */}
      <div className="p-8 rounded-2xl border border-dashed border-red-300 dark:border-red-900 bg-red-50/40 dark:bg-red-950/20 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <h4 className="font-bold text-lg">Ready to showcase your business?</h4>
          <p className="text-sm text-muted-foreground">Registration takes less than 5 minutes. Save your progress anytime as a draft.</p>
        </div>
        <Link href="/setup/business">
          <Button className="rounded-xl bg-red-600 hover:bg-red-700 text-white px-6 h-11 shrink-0">
            Start Business Setup <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
