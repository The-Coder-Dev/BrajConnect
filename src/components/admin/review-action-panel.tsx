"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertCircle, ShieldCheck } from "lucide-react";
import { approveBusiness, rejectBusiness, requestChanges } from "@/server/actions/admin/businesses";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function AdminReviewActionPanel({
  businessId,
  businessName,
  status,
  verificationStatus,
}: {
  businessId: string;
  businessName: string;
  status: string;
  verificationStatus: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [modal, setModal] = useState<{ open: boolean; type: "reject" | "changes" | null }>({
    open: false,
    type: null,
  });
  const [reason, setReason] = useState("");

  const handleApprove = () => {
    startTransition(async () => {
      const res = await approveBusiness(businessId);
      if (res.success) {
        toast.success(`Business "${businessName}" approved successfully!`);
        router.push("/admin/businesses/pending");
      } else {
        toast.error(res.error || "Failed to approve business.");
      }
    });
  };

  const handleActionSubmit = () => {
    if (!reason.trim()) {
      toast.error("Please enter a reason.");
      return;
    }

    startTransition(async () => {
      if (!modal.type) return;

      let res;
      if (modal.type === "reject") {
        res = await rejectBusiness(businessId, reason);
      } else {
        res = await requestChanges(businessId, reason);
      }

      if (res.success) {
        toast.success(
          modal.type === "reject"
            ? `Business "${businessName}" rejected.`
            : `Requested changes for "${businessName}".`
        );
        setModal({ open: false, type: null });
        setReason("");
        router.push("/admin/businesses/pending");
      } else {
        toast.error(res.error || "Failed to process moderation action.");
      }
    });
  };

  return (
    <>
      <Card className="rounded-2xl border-2 border-primary/20 bg-card sticky top-24 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" /> Moderation Action
            </CardTitle>
            <Badge
              variant="outline"
              className={`text-[10px] capitalize px-2.5 py-0.5 rounded-full font-bold ${
                status === "published"
                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                  : status === "pending_review"
                  ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                  : status === "rejected"
                  ? "bg-red-500/10 text-red-600 border-red-500/20"
                  : "bg-slate-500/10 text-slate-600 border-slate-500/20"
              }`}
            >
              {status?.replace("_", " ")}
            </Badge>
          </div>
          <CardDescription className="text-xs">
            Verification status: <span className="font-semibold text-foreground capitalize">{verificationStatus?.replace("_", " ")}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          <Button
            disabled={isPending || status === "published"}
            onClick={handleApprove}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-11 text-xs font-bold shadow-xs gap-2"
          >
            <CheckCircle2 className="h-4 w-4" /> Approve Listing
          </Button>

          <Button
            variant="outline"
            disabled={isPending}
            onClick={() => setModal({ open: true, type: "changes" })}
            className="w-full border-amber-500/30 text-amber-600 hover:bg-amber-50 rounded-xl h-11 text-xs font-bold gap-2"
          >
            <AlertCircle className="h-4 w-4" /> Request Changes
          </Button>

          <Button
            variant="outline"
            disabled={isPending || status === "rejected"}
            onClick={() => setModal({ open: true, type: "reject" })}
            className="w-full border-red-500/30 text-red-600 hover:bg-red-50 rounded-xl h-11 text-xs font-bold gap-2"
          >
            <XCircle className="h-4 w-4" /> Reject Listing
          </Button>
        </CardContent>
      </Card>

      <Dialog open={modal.open} onOpenChange={(open) => !open && setModal({ open: false, type: null })}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {modal.type === "reject" ? "Reject Business Submission" : "Request Changes"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Provide feedback for <span className="font-bold text-foreground">{businessName}</span>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <Textarea
              placeholder={
                modal.type === "reject"
                  ? "Specify reason for rejection (e.g. invalid document or duplicate listing)..."
                  : "Specify required changes (e.g. please upload a clearer GST certificate)..."
              }
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[120px] rounded-xl text-xs p-3"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setModal({ open: false, type: null })} className="rounded-xl text-xs">
              Cancel
            </Button>
            <Button
              disabled={isPending || !reason.trim()}
              onClick={handleActionSubmit}
              className={`rounded-xl text-xs font-semibold text-white ${
                modal.type === "reject" ? "bg-red-600 hover:bg-red-700" : "bg-amber-600 hover:bg-amber-700"
              }`}
            >
              Submit Action
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
