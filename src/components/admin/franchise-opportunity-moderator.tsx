"use client";

import { useState } from "react";
import { adminModerateOpportunity } from "@/server/actions/franchise/applications";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Building2,
  MapPin,
  IndianRupee,
  ShieldCheck,
  FileText,
} from "lucide-react";

interface ModeratorProps {
  opportunity: any;
}

export function FranchiseOpportunityModerator({ opportunity }: ModeratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState(opportunity.rejectionReason || "");
  const [loading, setLoading] = useState(false);

  const handleModerate = async (action: "approved" | "rejected") => {
    if (action === "rejected" && (!reason || !reason.trim())) {
      toast.error("Please provide a reason for rejecting this opportunity.");
      return;
    }

    setLoading(true);
    try {
      const res = await adminModerateOpportunity({
        opportunityId: opportunity.id,
        action,
        reason,
      });

      if (!res.success) {
        toast.error(res.error || "Moderation action failed");
      } else {
        toast.success(
          action === "approved"
            ? "Franchise Opportunity approved and published!"
            : "Opportunity rejected"
        );
        setIsOpen(false);
      }
    } catch (err: any) {
      toast.error(err?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="rounded-xl text-xs font-semibold gap-1.5"
      >
        <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Moderate
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-2xl rounded-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-base font-bold">
                Admin Franchise Moderation
              </DialogTitle>
              <Badge
                variant="outline"
                className={`text-[10px] capitalize px-2.5 py-0.5 rounded-full font-semibold ${
                  opportunity.status === "approved"
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                    : opportunity.status === "rejected"
                    ? "bg-red-500/10 text-red-600 border-red-500/30"
                    : "bg-amber-500/10 text-amber-700 border-amber-500/30"
                }`}
              >
                {opportunity.status?.replace("_", " ")}
              </Badge>
            </div>
            <DialogDescription className="text-xs">
              Review terms, investment metrics, and compliance before publishing.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 text-xs py-2">
            {/* Title & Business */}
            <div className="p-4 rounded-xl bg-muted/40 border border-border/30 space-y-1.5">
              <h4 className="font-bold text-sm text-foreground">{opportunity.title}</h4>
              <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
                <span className="flex items-center gap-1 font-semibold text-foreground">
                  <Building2 className="h-3.5 w-3.5 text-primary" /> {opportunity.business?.name}
                </span>
                <span>•</span>
                <span>Business Status: {opportunity.business?.status}</span>
                <span>•</span>
                <span>Owner: {opportunity.owner?.name} ({opportunity.owner?.email})</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <span className="font-bold text-muted-foreground">Description:</span>
              <p className="p-3 rounded-xl bg-muted/20 border border-border/20 text-foreground leading-relaxed">
                {opportunity.description}
              </p>
            </div>

            {/* Financials & Location */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-muted/30 border border-border/20 space-y-0.5">
                <span className="text-muted-foreground flex items-center gap-1 font-medium">
                  <IndianRupee className="h-3 w-3 text-primary" /> Fee
                </span>
                <p className="font-bold text-foreground">{opportunity.franchiseFee}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-muted/30 border border-border/20 space-y-0.5">
                <span className="text-muted-foreground flex items-center gap-1 font-medium">
                  <IndianRupee className="h-3 w-3 text-primary" /> Est. Total
                </span>
                <p className="font-bold text-foreground">{opportunity.estimatedInvestment}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-muted/30 border border-border/20 space-y-0.5">
                <span className="text-muted-foreground flex items-center gap-1 font-medium">
                  <MapPin className="h-3 w-3 text-amber-600" /> Location
                </span>
                <p className="font-bold text-foreground truncate">
                  {opportunity.availableCity}, {opportunity.availableState}
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-muted/30 border border-border/20 space-y-0.5">
                <span className="text-muted-foreground font-medium">Space Required</span>
                <p className="font-bold text-foreground">{opportunity.minSpaceRequired}</p>
              </div>
            </div>

            {/* Support & Terms */}
            {(opportunity.trainingProvided || opportunity.marketingSupport) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {opportunity.trainingProvided && (
                  <div className="p-2.5 rounded-xl bg-muted/20 border border-border/20 space-y-0.5">
                    <span className="font-semibold text-muted-foreground">Training:</span>
                    <p className="text-foreground">{opportunity.trainingProvided}</p>
                  </div>
                )}
                {opportunity.marketingSupport && (
                  <div className="p-2.5 rounded-xl bg-muted/20 border border-border/20 space-y-0.5">
                    <span className="font-semibold text-muted-foreground">Marketing:</span>
                    <p className="text-foreground">{opportunity.marketingSupport}</p>
                  </div>
                )}
              </div>
            )}

            {/* Rejection / Note Input */}
            <div className="space-y-1.5 pt-2 border-t border-border/30">
              <Label htmlFor="reason" className="text-xs font-semibold">
                Rejection Reason / Internal Admin Notes:
              </Label>
              <Textarea
                id="reason"
                placeholder="Specify requirements if declining or moderation feedback..."
                rows={2}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="rounded-xl text-xs"
              />
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-border/30">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="w-full sm:w-auto rounded-xl text-xs"
            >
              Cancel
            </Button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="destructive"
                size="sm"
                disabled={loading}
                onClick={() => handleModerate("rejected")}
                className="w-full sm:w-auto rounded-xl text-xs gap-1.5 font-semibold"
              >
                <XCircle className="h-4 w-4" /> Reject Opportunity
              </Button>

              <Button
                size="sm"
                disabled={loading}
                onClick={() => handleModerate("approved")}
                className="w-full sm:w-auto rounded-xl text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                Approve & Publish
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
