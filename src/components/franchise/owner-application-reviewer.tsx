"use client";

import { useState } from "react";
import { updateApplicationStatus } from "@/server/actions/franchise/applications";
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
import { CheckCircle2, XCircle, Clock, Loader2, User, Phone, Mail, MapPin, IndianRupee } from "lucide-react";

interface ApplicationReviewerProps {
  application: any;
}

export function OwnerApplicationReviewer({ application }: ApplicationReviewerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<"under_review" | "approved" | "rejected" | null>(null);
  const [reviewNotes, setReviewNotes] = useState(application.reviewNotes || "");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (status: "under_review" | "approved" | "rejected") => {
    setLoading(true);
    try {
      const res = await updateApplicationStatus({
        applicationId: application.id,
        status,
        reviewNotes,
      });

      if (!res.success) {
        toast.error(res.error || "Failed to update application status");
      } else {
        toast.success(`Application marked as ${status.replace("_", " ")}`);
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
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="rounded-xl text-xs font-semibold"
      >
        Review Details
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-xl rounded-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-base font-bold">
                Franchise Applicant Review
              </DialogTitle>
              <Badge
                variant="outline"
                className={`text-[10px] capitalize px-2.5 py-0.5 rounded-full font-semibold ${
                  application.status === "approved"
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                    : application.status === "rejected"
                    ? "bg-red-500/10 text-red-600 border-red-500/30"
                    : "bg-amber-500/10 text-amber-700 border-amber-500/30"
                }`}
              >
                {application.status?.replace("_", " ")}
              </Badge>
            </div>
            <DialogDescription className="text-xs">
              Opportunity: <span className="font-semibold text-foreground">{application.opportunity?.title}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 text-xs py-2">
            {/* Applicant Summary */}
            <div className="p-4 rounded-xl bg-muted/40 border border-border/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-foreground flex items-center gap-1.5">
                  <User className="h-4 w-4 text-primary" /> {application.applicantName}
                </span>
                <span className="capitalize font-semibold text-muted-foreground">
                  {application.applicantType} Applicant
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-muted-foreground pt-1">
                <div className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" /> {application.email}
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" /> {application.phone}
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" /> {application.preferredLocation}
                </div>
                <div className="flex items-center gap-1.5">
                  <IndianRupee className="h-3.5 w-3.5" /> {application.investmentCapacity}
                </div>
              </div>
            </div>

            {/* Experience & Comments */}
            {application.businessExperience && (
              <div className="space-y-1">
                <span className="font-bold text-muted-foreground">Past Business Experience:</span>
                <p className="p-2.5 rounded-lg bg-muted/20 border border-border/20 text-foreground">
                  {application.businessExperience}
                </p>
              </div>
            )}

            {application.whyInterested && (
              <div className="space-y-1">
                <span className="font-bold text-muted-foreground">Reason for Interest:</span>
                <p className="p-2.5 rounded-lg bg-muted/20 border border-border/20 text-foreground">
                  {application.whyInterested}
                </p>
              </div>
            )}

            {/* Review Notes Input */}
            <div className="space-y-2 pt-2 border-t border-border/30">
              <Label htmlFor="reviewNotes" className="text-xs font-semibold">
                Feedback / Notes for Applicant:
              </Label>
              <Textarea
                id="reviewNotes"
                placeholder="Add meeting notes, onboarding next steps, or decision rationale..."
                rows={3}
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                className="rounded-xl text-xs"
              />
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-border/30">
            <Button
              variant="outline"
              size="sm"
              disabled={loading}
              onClick={() => handleUpdate("under_review")}
              className="w-full sm:w-auto rounded-xl text-xs gap-1 text-amber-700 hover:bg-amber-50"
            >
              <Clock className="h-3.5 w-3.5" /> Mark Under Review
            </Button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="destructive"
                size="sm"
                disabled={loading}
                onClick={() => handleUpdate("rejected")}
                className="w-full sm:w-auto rounded-xl text-xs gap-1"
              >
                <XCircle className="h-3.5 w-3.5" /> Reject
              </Button>

              <Button
                size="sm"
                disabled={loading}
                onClick={() => handleUpdate("approved")}
                className="w-full sm:w-auto rounded-xl text-xs gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              >
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                Approve Partner
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
