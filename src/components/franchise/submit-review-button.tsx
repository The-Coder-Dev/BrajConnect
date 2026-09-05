"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { submitOpportunityForReview } from "@/server/actions/franchise/opportunities";

export function SubmitReviewButton({ opportunityId }: { opportunityId: string }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await submitOpportunityForReview(opportunityId);
      if (!res.success) {
        toast.error(res.error || "Failed to submit opportunity for review");
      } else {
        toast.success("Opportunity submitted for Admin review!");
      }
    } catch (err: any) {
      toast.error(err?.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      size="sm"
      variant="default"
      disabled={loading}
      onClick={handleSubmit}
      className="rounded-xl text-xs font-semibold gap-1.5 bg-amber-600 hover:bg-amber-700 text-white"
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Send className="h-3.5 w-3.5" />
      )}
      Submit for Review
    </Button>
  );
}
