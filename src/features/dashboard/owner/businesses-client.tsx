"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Building2,
  Trash2,
  Play,
  Edit,
  Eye,
  Undo,
  RotateCcw,
  AlertCircle,
  HelpCircle,
  Clock,
  XCircle,
  Calendar,
  Sparkles,
  MapPin,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Inbox,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
  deleteDraftBusiness,
  withdrawSubmission,
  resubmitBusiness,
  restoreArchivedBusiness,
} from "@/server/actions/business/owner";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface BusinessesClientProps {
  initialBusinesses: any[];
}

export function BusinessesClient({ initialBusinesses }: BusinessesClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Search & Filter state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Interactive Dialog states
  const [selectedBiz, setSelectedBiz] = useState<any | null>(null);
  const [dialogType, setDialogType] = useState<
    "rejection" | "suspension" | "timeline" | "analytics" | null
  >(null);

  // Delete draft confirmation dialog state
  const [deleteConfirmBizId, setDeleteConfirmBizId] = useState<string | null>(null);

  // Filter businesses
  const filteredBusinesses = initialBusinesses.filter((b) => {
    const matchesSearch = b.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Action Handlers
  const handleDeleteDraft = (id: string) => {
    startTransition(async () => {
      try {
        const res = await deleteDraftBusiness(id);
        if (res.success) {
          toast.success("Draft business deleted successfully");
          router.refresh();
        } else {
          toast.error(res.error || "Failed to delete draft business");
        }
      } catch (err: any) {
        toast.error(err.message || "An unexpected error occurred");
      } finally {
        setDeleteConfirmBizId(null);
      }
    });
  };

  const handleWithdraw = (id: string) => {
    startTransition(async () => {
      try {
        const res = await withdrawSubmission(id);
        if (res.success) {
          toast.success("Submission withdrawn successfully. Business is now in draft.");
          router.refresh();
        } else {
          toast.error(res.error || "Failed to withdraw submission");
        }
      } catch (err: any) {
        toast.error(err.message || "An unexpected error occurred");
      }
    });
  };

  const handleResubmit = (id: string) => {
    startTransition(async () => {
      try {
        const res = await resubmitBusiness(id);
        if (res.success) {
          toast.success("Business resubmitted for review successfully!");
          router.refresh();
        } else {
          toast.error(res.error || "Failed to resubmit business");
        }
      } catch (err: any) {
        toast.error(err.message || "An unexpected error occurred");
      }
    });
  };

  const handleRestore = (id: string) => {
    startTransition(async () => {
      try {
        const res = await restoreArchivedBusiness(id);
        if (res.success) {
          toast.success("Business restored to draft status.");
          router.refresh();
        } else {
          toast.error(res.error || "Failed to restore business");
        }
      } catch (err: any) {
        toast.error(err.message || "An unexpected error occurred");
      }
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 rounded-lg">Published</Badge>;
      case "pending_review":
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 rounded-lg">Pending Review</Badge>;
      case "rejected":
        return <Badge className="bg-red-500/10 text-red-600 border-red-500/20 rounded-lg">Rejected</Badge>;
      case "draft":
        return <Badge className="bg-slate-500/10 text-slate-600 border-slate-500/20 rounded-lg">Draft</Badge>;
      case "suspended":
        return <Badge className="bg-violet-500/10 text-violet-600 border-violet-500/20 rounded-lg">Suspended</Badge>;
      case "archived":
        return <Badge className="bg-zinc-500/10 text-zinc-600 border-zinc-500/20 rounded-lg">Archived</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getVerificationBadge = (vStatus: string) => {
    switch (vStatus) {
      case "verified":
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 rounded-lg">✓ Verified</Badge>;
      case "pending":
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 rounded-lg">Verification Pending</Badge>;
      case "rejected":
        return <Badge className="bg-red-500/10 text-red-600 border-red-500/20 rounded-lg">Verification Rejected</Badge>;
      case "not_submitted":
      default:
        return <Badge className="bg-slate-500/10 text-slate-600 border-slate-500/20 rounded-lg">Unverified</Badge>;
    }
  };

  const openDialog = (biz: any, type: "rejection" | "suspension" | "timeline" | "analytics") => {
    setSelectedBiz(biz);
    setDialogType(type);
  };

  const closeDialog = () => {
    setSelectedBiz(null);
    setDialogType(null);
  };

  // Helper to compile dynamic activities for details/timeline view
  const getTimelineEvents = (biz: any) => {
    if (!biz) return [];
    const events = [
      { title: "Business Onboarding Started", time: biz.createdAt, desc: "Created draft business record." },
    ];
    if (biz.updatedAt.getTime() - biz.createdAt.getTime() > 10000) {
      events.push({ title: "Profile Details Updated", time: biz.updatedAt, desc: "Business information modified by owner." });
    }
    if (biz.status === "pending_review") {
      events.push({ title: "Submitted for Verification", time: biz.updatedAt, desc: "Waiting for administrator approval." });
    }
    if (biz.status === "published" && biz.publishedAt) {
      events.push({ title: "Approved & Published", time: biz.publishedAt, desc: "Business is active and listed on the portal." });
    }
    if (biz.status === "rejected") {
      events.push({ title: "Submission Rejected", time: biz.updatedAt, desc: biz.rejectionReason || "Incomplete documentation or invalid details." });
    }
    if (biz.status === "suspended") {
      events.push({ title: "Listing Suspended", time: biz.updatedAt, desc: biz.suspensionReason || "Listing suspended by admin." });
    }
    return events.sort((a, b) => b.time.getTime() - a.time.getTime());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">My Businesses</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Review, update, and track verification statuses for your listed businesses.
        </p>
      </div>

      {/* Filters Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/30 p-4 border rounded-xl border-border/40">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name..."
            className="pl-10 h-10 rounded-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
          {[
            { value: "all", label: "All" },
            { value: "draft", label: "Draft" },
            { value: "pending_review", label: "Pending Review" },
            { value: "published", label: "Published" },
            { value: "rejected", label: "Rejected" },
            { value: "suspended", label: "Suspended" },
            { value: "archived", label: "Archived" },
          ].map((st) => (
            <Button
              key={st.value}
              variant={statusFilter === st.value ? "default" : "outline"}
              className="rounded-full h-9 px-4 text-xs whitespace-nowrap"
              onClick={() => setStatusFilter(st.value)}
            >
              {st.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Grid of Businesses */}
      {filteredBusinesses.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredBusinesses.map((biz) => {
            const primaryCat = biz.businessCategories?.[0]?.category?.name || "Uncategorized";
            return (
              <Card
                key={biz.id}
                className="rounded-2xl border-border/50 hover:border-primary/20 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                <div>
                  {/* Image banner preview */}
                  <div className="h-28 bg-slate-100 relative overflow-hidden shrink-0">
                    {biz.coverUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={biz.coverUrl}
                        alt={`${biz.name} Cover`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <Building2 className="h-8 w-8" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      {getStatusBadge(biz.status)}
                    </div>
                    {biz.featured && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-amber-500 text-white rounded-lg flex gap-1 border-0 shadow-xs">
                          <Sparkles className="h-3.5 w-3.5 fill-white" /> Featured
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardHeader className="pb-3 pt-4">
                    <div className="flex gap-4">
                      {biz.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={biz.logoUrl}
                          alt={biz.name}
                          className="h-12 w-12 rounded-xl object-cover border bg-white shadow-xs shrink-0 -mt-8 z-10"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-xl bg-slate-100 border shadow-xs shrink-0 -mt-8 z-10 flex items-center justify-center text-slate-400">
                          <Building2 className="h-6 w-6" />
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-lg font-bold line-clamp-1">{biz.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground">
                          <span>{primaryCat}</span>
                          {biz.location?.city && (
                            <>
                              <span>·</span>
                              <span className="flex items-center gap-0.5">
                                <MapPin className="h-3 w-3 shrink-0" />
                                {biz.location.city}
                              </span>
                            </>
                          )}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3 pb-4">
                    {/* Verification Status */}
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground font-medium">Verification Status:</span>
                      {getVerificationBadge(biz.verificationStatus)}
                    </div>

                    {/* Meta Timestamps */}
                    <div className="border-t border-border/40 pt-2 flex justify-between items-center text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 shrink-0" /> Created: {new Date(biz.createdAt).toLocaleDateString()}
                      </span>
                      <span>
                        Updated: {new Date(biz.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </div>

                {/* Actions container based on status */}
                <div className="bg-muted/10 p-4 border-t border-border/40 grid grid-cols-2 gap-2 mt-auto">
                  {biz.status === "draft" && (
                    <>
                      <Link href={`/setup/business?id=${biz.id}`} className="col-span-2">
                        <Button className="w-full rounded-xl bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-xs">
                          <Play className="h-3.5 w-3.5 mr-1" /> Continue Setup
                        </Button>
                      </Link>
                      <Link href={`/dashboard/businesses/${biz.id}/edit`}>
                        <Button variant="outline" className="w-full rounded-xl gap-1">
                          <Edit className="h-3.5 w-3.5" /> Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        className="w-full rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200 gap-1"
                        onClick={() => setDeleteConfirmBizId(biz.id)}
                        disabled={isPending}
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </Button>
                    </>
                  )}

                  {biz.status === "pending_review" && (
                    <>
                      <Link href={`/dashboard/businesses/${biz.id}`} className="col-span-2">
                        <Button className="w-full rounded-xl gap-1 bg-slate-900 text-white hover:bg-slate-800">
                          <Eye className="h-3.5 w-3.5" /> View Submission
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        className="w-full rounded-xl gap-1 text-slate-700"
                        onClick={() => openDialog(biz, "timeline")}
                      >
                        <Clock className="h-3.5 w-3.5" /> Timeline
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full rounded-xl gap-1 text-amber-600 hover:bg-amber-50 hover:border-amber-200"
                        onClick={() => handleWithdraw(biz.id)}
                        disabled={isPending}
                      >
                        <Undo className="h-3.5 w-3.5" /> Withdraw
                      </Button>
                    </>
                  )}

                  {biz.status === "rejected" && (
                    <>
                      <Button
                        className="col-span-2 rounded-xl bg-linear-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white gap-1"
                        onClick={() => openDialog(biz, "rejection")}
                      >
                        <AlertCircle className="h-3.5 w-3.5" /> Rejection Feedback
                      </Button>
                      <Link href={`/dashboard/businesses/${biz.id}/edit`}>
                        <Button variant="outline" className="w-full rounded-xl gap-1">
                          <Edit className="h-3.5 w-3.5" /> Edit details
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        className="w-full rounded-xl gap-1 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200"
                        onClick={() => handleResubmit(biz.id)}
                        disabled={isPending}
                      >
                        <RotateCcw className="h-3.5 w-3.5" /> Resubmit
                      </Button>
                    </>
                  )}

                  {biz.status === "published" && (
                    <>
                      <Link href={`/business/${biz.slug}`} target="_blank" className="col-span-2">
                        <Button className="w-full rounded-xl gap-1 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs">
                          <ExternalLink className="h-3.5 w-3.5" /> View Listing
                        </Button>
                      </Link>
                      <Link href={`/dashboard/businesses/${biz.id}/edit`}>
                        <Button variant="outline" className="w-full rounded-xl gap-1">
                          <Edit className="h-3.5 w-3.5" /> Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        className="w-full rounded-xl gap-1"
                        onClick={() => openDialog(biz, "analytics")}
                      >
                        <TrendingUp className="h-3.5 w-3.5" /> Analytics
                      </Button>
                    </>
                  )}

                  {biz.status === "suspended" && (
                    <>
                      <Button
                        className="w-full rounded-xl gap-1 bg-violet-600 hover:bg-violet-700 text-white col-span-2"
                        onClick={() => openDialog(biz, "suspension")}
                      >
                        <AlertCircle className="h-3.5 w-3.5" /> Suspension Reason
                      </Button>
                      <Link href="/dashboard/support" className="col-span-2">
                        <Button variant="outline" className="w-full rounded-xl gap-1">
                          <HelpCircle className="h-3.5 w-3.5" /> Contact Support
                        </Button>
                      </Link>
                    </>
                  )}

                  {biz.status === "archived" && (
                    <Button
                      className="col-span-2 rounded-xl bg-zinc-950 text-white hover:bg-zinc-800 gap-1"
                      onClick={() => handleRestore(biz.id)}
                      disabled={isPending}
                    >
                      <RotateCcw className="h-3.5 w-3.5" /> Reactivate Business (Restore)
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border bg-card/10">
          <Inbox className="h-10 w-10 text-slate-300 mb-3" />
          <h3 className="text-lg font-bold">No businesses found</h3>
          <p className="text-muted-foreground text-sm max-w-xs mt-1">
            Try adjusting your search query or filter tags to see matching results.
          </p>
        </div>
      )}

      {/* Interactive Modal Dialogs */}
      <Dialog open={dialogType !== null} onOpenChange={closeDialog}>
        <DialogContent className="max-w-md rounded-2xl">
          {dialogType === "rejection" && selectedBiz && (
            <>
              <DialogHeader>
                <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-2">
                  <XCircle className="h-5 w-5" />
                </div>
                <DialogTitle className="text-xl font-bold">Submission Rejected</DialogTitle>
                <DialogDescription>
                  Review the feedback from administration for &quot;{selectedBiz.name}&quot;.
                </DialogDescription>
              </DialogHeader>
              <div className="bg-red-50/50 border border-red-100 rounded-xl p-4 mt-2">
                <p className="text-sm font-semibold text-red-800">Admin Rejection Reason:</p>
                <p className="text-sm text-red-700 mt-1 whitespace-pre-wrap italic">
                  {selectedBiz.rejectionReason || "No custom message provided. Please check that document uploads and contact info are accurate."}
                </p>
              </div>
              <div className="text-xs text-muted-foreground mt-2 leading-relaxed">
                You can edit your details to correct these errors and click <strong>Resubmit</strong> to put your business back in review.
              </div>
              <DialogFooter className="mt-4">
                <Link href={`/dashboard/businesses/${selectedBiz.id}/edit`} onClick={closeDialog}>
                  <Button className="rounded-xl">
                    <Edit className="h-3.5 w-3.5 mr-1" /> Edit Business
                  </Button>
                </Link>
              </DialogFooter>
            </>
          )}

          {dialogType === "suspension" && selectedBiz && (
            <>
              <DialogHeader>
                <div className="h-10 w-10 rounded-full bg-violet-50 flex items-center justify-center text-violet-500 mb-2">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <DialogTitle className="text-xl font-bold">Listing Suspended</DialogTitle>
                <DialogDescription>
                  Your business &quot;{selectedBiz.name}&quot; has been suspended by the administrator.
                </DialogDescription>
              </DialogHeader>
              <div className="bg-violet-50/50 border border-violet-100 rounded-xl p-4 mt-2">
                <p className="text-sm font-semibold text-violet-800">Reason for Suspension:</p>
                <p className="text-sm text-violet-700 mt-1 whitespace-pre-wrap italic">
                  {selectedBiz.suspensionReason || "This listing has been suspended due to violations of portal guidelines."}
                </p>
              </div>
              <div className="text-xs text-muted-foreground mt-2 leading-relaxed">
                While suspended, this business details page is read-only. If you believe this is an error, please reach out to our team.
              </div>
              <DialogFooter className="mt-4">
                <Link href="/dashboard/support" onClick={closeDialog}>
                  <Button className="rounded-xl bg-violet-600 hover:bg-violet-700">Contact Admin</Button>
                </Link>
              </DialogFooter>
            </>
          )}

          {dialogType === "timeline" && selectedBiz && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg font-bold">Submission Timeline</DialogTitle>
                <DialogDescription>
                  Tracking state history for &quot;{selectedBiz.name}&quot;.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 space-y-4 max-h-[300px] overflow-y-auto pr-1">
                {getTimelineEvents(selectedBiz).map((ev, index, arr) => (
                  <div key={index} className="relative flex gap-3">
                    {index < arr.length - 1 && (
                      <span className="absolute left-3 top-7 bottom-0 w-0.5 bg-slate-200 -mt-2" />
                    )}
                    <div className="h-6 w-6 rounded-full border bg-slate-50 flex items-center justify-center shrink-0 text-slate-500">
                      <ChevronRight className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{ev.title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{ev.desc}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {new Date(ev.time).toLocaleDateString()} at {new Date(ev.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <DialogFooter className="mt-4">
                <Button variant="outline" className="rounded-xl" onClick={closeDialog}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}

          {dialogType === "analytics" && selectedBiz && (
            <>
              <DialogHeader>
                <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 mb-2">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <DialogTitle className="text-xl font-bold">Business Analytics</DialogTitle>
                <DialogDescription>
                  Traffic performance and listing metrics for &quot;{selectedBiz.name}&quot;.
                </DialogDescription>
              </DialogHeader>
              <div className="py-6 text-center text-muted-foreground space-y-2">
                <p className="font-semibold text-foreground">Coming Soon in Phase 2.2!</p>
                <p className="text-sm leading-relaxed max-w-xs mx-auto">
                  Detailed analytics including search impressions, telephone clicks, and contact forms will be available in the next release.
                </p>
              </div>
              <DialogFooter>
                <Button className="rounded-xl w-full" onClick={closeDialog}>
                  Got It
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Draft Alert Dialog */}
      <AlertDialog open={deleteConfirmBizId !== null} onOpenChange={(open) => { if (!open) setDeleteConfirmBizId(null); }}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bold text-lg">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this draft business listing. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
              onClick={() => deleteConfirmBizId && handleDeleteDraft(deleteConfirmBizId)}
              disabled={isPending}
            >
              Delete Draft
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
