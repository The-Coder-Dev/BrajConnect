"use client";

import React from "react";
import {
  Building2, CheckCircle2, Eye, PhoneCall, MessageCircle, Globe, Share2,
  Star, ShieldCheck, Plus, ArrowRight, Edit3, Image as ImageIcon, Clock,
  Briefcase, ExternalLink, TrendingUp, Sparkles, Lock, FileText, Bell, History
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { LeadsManager } from "../components/leads-manager";
import { NotificationsManager } from "../components/notifications-manager";

interface StatePublishedProps {
  business: any;
  metrics: any;
  leads: any[];
  notifications: any[];
  unreadNotificationsCount: number;
  activities: any[];
}

export function StatePublished({
  business,
  metrics,
  leads,
  notifications,
  unreadNotificationsCount,
  activities,
}: StatePublishedProps) {
  const publishedDate = business.publishedAt
    ? new Date(business.publishedAt).toLocaleDateString()
    : new Date(business.updatedAt).toLocaleDateString();

  return (
    <div className="space-y-10 py-6 max-w-7xl mx-auto">
      {/* Published Business Header Banner */}
      <Card className="rounded-3xl border-border/60 bg-card shadow-sm overflow-hidden">
        <div className="relative h-48 bg-linear-to-r from-red-600 to-red-800 flex items-center justify-center overflow-hidden">
          {business.coverUrl && (
            <Image
              src={business.coverUrl}
              alt={`${business.name} Cover`}
              fill
              className="object-cover opacity-80"
              sizes="100vw"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
          <div className="absolute top-4 right-4 flex gap-2">
            <Badge className="bg-emerald-500 text-white font-bold px-3 py-1 text-xs shadow-md flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Published & Verified
            </Badge>
          </div>
        </div>

        <div className="p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            {business.logoUrl && (
              <div className="relative h-20 w-20 rounded-2xl border-2 border-white dark:border-slate-800 shadow-md bg-white shrink-0 -mt-14 z-10 overflow-hidden">
                <Image
                  src={business.logoUrl}
                  alt={business.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
            )}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">{business.name}</h1>
                <Badge variant="outline" className="text-xs font-semibold">
                  {business.location?.city || "Mathura"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-1 max-w-2xl">
                {business.shortDescription || "Live Business Listing on BrajConnect"}
              </p>
              <p className="text-xs text-slate-400 font-medium">
                Published since {publishedDate}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <Link href={`/business/${business.slug || business.id}`} target="_blank">
              <Button variant="outline" className="rounded-xl font-bold text-xs gap-1.5 h-11">
                <ExternalLink className="w-4 h-4" /> View Public Profile
              </Button>
            </Link>
            <Link href="/setup/business">
              <Button className="rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs gap-1.5 h-11">
                <Edit3 className="w-4 h-4" /> Edit Business Details
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* 6 Key Overview Metric Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-6">
        <Card className="rounded-2xl border-border/60 shadow-xs bg-card hover:shadow-md transition-all p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Profile Views</span>
            <Eye className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-3xl font-black mt-3">{metrics?.profileViews ?? 0}</div>
          <p className="text-[11px] text-muted-foreground mt-1">Total page impressions</p>
        </Card>

        <Card className="rounded-2xl border-border/60 shadow-xs bg-card hover:shadow-md transition-all p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">New Leads</span>
            <MessageCircle className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-emerald-600 mt-3">{metrics?.unreadLeads ?? 0}</div>
          <p className="text-[11px] text-muted-foreground mt-1">{metrics?.totalLeads ?? 0} total inquiries</p>
        </Card>

        <Card className="rounded-2xl border-border/60 shadow-xs bg-card hover:shadow-md transition-all p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Notifications</span>
            <Bell className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-amber-600 mt-3">{unreadNotificationsCount ?? 0}</div>
          <p className="text-[11px] text-muted-foreground mt-1">Unread in-app alerts</p>
        </Card>

        <Card className="rounded-2xl border-border/60 shadow-xs bg-card hover:shadow-md transition-all p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Avg Rating</span>
            <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-500 mt-3">{metrics?.averageRating ?? 5.0}</div>
          <p className="text-[11px] text-muted-foreground mt-1">{metrics?.reviewsCount ?? 0} customer reviews</p>
        </Card>

        <Card className="rounded-2xl border-border/60 shadow-xs bg-card hover:shadow-md transition-all p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Phone Clicks</span>
            <PhoneCall className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-3xl font-black mt-3">{metrics?.phoneClicks ?? 0}</div>
          <p className="text-[11px] text-muted-foreground mt-1">Direct call triggers</p>
        </Card>

        <Card className="rounded-2xl border-border/60 shadow-xs bg-card hover:shadow-md transition-all p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Health Score</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-emerald-600 mt-3">100%</div>
          <p className="text-[11px] text-muted-foreground mt-1">Verified & Active</p>
        </Card>
      </div>

      {/* Quick Actions Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight">Business Management Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/setup/business">
            <Card className="rounded-2xl border-border/50 hover:border-red-500/40 p-5 bg-card hover:bg-slate-50/50 dark:hover:bg-slate-900/50 shadow-xs hover:shadow-sm cursor-pointer transition-all flex items-center gap-4">
              <div className="h-11 w-11 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 flex items-center justify-center shrink-0">
                <Edit3 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Edit Business Info</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Name, category, and bio</p>
              </div>
            </Card>
          </Link>

          <Link href="/setup/business">
            <Card className="rounded-2xl border-border/50 hover:border-blue-500/40 p-5 bg-card hover:bg-slate-50/50 dark:hover:bg-slate-900/50 shadow-xs hover:shadow-sm cursor-pointer transition-all flex items-center gap-4">
              <div className="h-11 w-11 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center shrink-0">
                <ImageIcon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Manage Gallery</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Upload photos & logos</p>
              </div>
            </Card>
          </Link>

          <Link href="/setup/business">
            <Card className="rounded-2xl border-border/50 hover:border-amber-500/40 p-5 bg-card hover:bg-slate-50/50 dark:hover:bg-slate-900/50 shadow-xs hover:shadow-sm cursor-pointer transition-all flex items-center gap-4">
              <div className="h-11 w-11 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center shrink-0">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Update Hours</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Set weekly operating schedule</p>
              </div>
            </Card>
          </Link>

          <Link href="/setup/business">
            <Card className="rounded-2xl border-border/50 hover:border-emerald-500/40 p-5 bg-card hover:bg-slate-50/50 dark:hover:bg-slate-900/50 shadow-xs hover:shadow-sm cursor-pointer transition-all flex items-center gap-4">
              <div className="h-11 w-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center shrink-0">
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Manage Services</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Offerings and price list</p>
              </div>
            </Card>
          </Link>
        </div>
      </div>

      {/* Main Section: Leads CRM */}
      <LeadsManager businessId={business.id} initialLeads={leads} />

      {/* Two Column Grid: Notifications & Activity Audit Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <NotificationsManager
          notifications={notifications}
          unreadCount={unreadNotificationsCount}
        />

        {/* Activity Timeline Audit Log */}
        <Card className="rounded-2xl border-border/60 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-muted-foreground" />
              <h3 className="text-lg font-bold">Recent Activity</h3>
            </div>
            <Badge variant="outline" className="text-[10px] uppercase font-bold">Audit Log</Badge>
          </div>

          <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
            {activities.map((act) => (
              <div key={act.id} className="flex gap-3 text-xs">
                <div className="h-7 w-7 rounded-full bg-muted border flex items-center justify-center shrink-0 font-bold">
                  {act.type === "published" ? "✓" : "•"}
                </div>
                <div className="space-y-0.5">
                  <p className="font-bold text-foreground">{act.title}</p>
                  <p className="text-muted-foreground">{act.description}</p>
                  <p className="text-[10px] text-slate-400">{new Date(act.time).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Subscription Tier & Premium Lock Architecture Placeholder */}
      <Card className="rounded-2xl border-dashed border-amber-300 dark:border-amber-900 bg-amber-50/20 dark:bg-amber-950/10 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h4 className="font-bold text-base">Unlock BrajConnect Premium Business Tools</h4>
            <Badge className="bg-amber-500 text-white font-extrabold text-[10px]">PRO READY</Badge>
          </div>
          <p className="text-xs text-muted-foreground max-w-2xl">
            Prepared architecture for subscription tiers: Featured Search Placement, Competitor Benchmark Analytics, and Direct Customer Lead CSV Export.
          </p>
        </div>
        <Button disabled variant="outline" className="rounded-xl border-amber-400 text-amber-700 font-bold text-xs gap-1 shrink-0">
          <Lock className="w-3.5 h-3.5 text-amber-500" /> Subscriptions System (Coming Soon)
        </Button>
      </Card>
    </div>
  );
}
