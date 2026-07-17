"use client";

import React, { useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Edit,
  Trash2,
  Undo,
  RotateCcw,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  deleteDraftBusiness,
  withdrawSubmission,
  resubmitBusiness,
  restoreArchivedBusiness,
} from "@/server/actions/business/owner";

interface BusinessDetailsActionsProps {
  businessId: string;
  status: string;
  slug: string;
}

export function BusinessDetailsActions({
  businessId,
  status,
  slug,
}: BusinessDetailsActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm("Are you sure you want to permanently delete this draft business?")) return;
    startTransition(async () => {
      const res = await deleteDraftBusiness(businessId);
      if (res.success) {
        toast.success("Draft deleted successfully.");
        router.push("/dashboard/businesses");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to delete draft.");
      }
    });
  };

  const handleWithdraw = () => {
    startTransition(async () => {
      const res = await withdrawSubmission(businessId);
      if (res.success) {
        toast.success("Submission withdrawn successfully. Status returned to draft.");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to withdraw submission.");
      }
    });
  };

  const handleResubmit = () => {
    startTransition(async () => {
      const res = await resubmitBusiness(businessId);
      if (res.success) {
        toast.success("Business resubmitted for review successfully!");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to resubmit.");
      }
    });
  };

  const handleRestore = () => {
    startTransition(async () => {
      const res = await restoreArchivedBusiness(businessId);
      if (res.success) {
        toast.success("Business restored to draft status.");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to restore.");
      }
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Link href="/dashboard/businesses">
        <Button variant="outline" className="rounded-xl h-10 px-4">
          <ChevronLeft className="mr-1 h-4 w-4" /> Back to List
        </Button>
      </Link>

      {status === "draft" && (
        <>
          <Link href={`/setup/business?id=${businessId}`}>
            <Button className="rounded-xl h-10 px-4 bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-xs">
              Continue Onboarding
            </Button>
          </Link>
          <Link href={`/dashboard/businesses/${businessId}/edit`}>
            <Button variant="outline" className="rounded-xl h-10 px-4">
              <Edit className="mr-1 h-4 w-4" /> Edit details
            </Button>
          </Link>
          <Button
            variant="outline"
            className="rounded-xl h-10 px-4 text-red-600 hover:bg-red-50 hover:border-red-200"
            onClick={handleDelete}
            disabled={isPending}
          >
            <Trash2 className="mr-1 h-4 w-4" /> Delete Draft
          </Button>
        </>
      )}

      {status === "pending_review" && (
        <Button
          variant="outline"
          className="rounded-xl h-10 px-4 text-amber-600 hover:bg-amber-50 hover:border-amber-200"
          onClick={handleWithdraw}
          disabled={isPending}
        >
          <Undo className="mr-1 h-4 w-4" /> Withdraw Submission
        </Button>
      )}

      {status === "rejected" && (
        <>
          <Link href={`/dashboard/businesses/${businessId}/edit`}>
            <Button className="rounded-xl h-10 px-4 bg-slate-900 text-white hover:bg-slate-800">
              <Edit className="mr-1 h-4 w-4" /> Edit details
            </Button>
          </Link>
          <Button
            variant="outline"
            className="rounded-xl h-10 px-4 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200"
            onClick={handleResubmit}
            disabled={isPending}
          >
            <RotateCcw className="mr-1 h-4 w-4" /> Resubmit for review
          </Button>
        </>
      )}

      {status === "published" && (
        <>
          <Link href={`/business/${slug}`} target="_blank">
            <Button className="rounded-xl h-10 px-4 bg-emerald-600 hover:bg-emerald-700 text-white">
              View Public Page
            </Button>
          </Link>
          <Link href={`/dashboard/businesses/${businessId}/edit`}>
            <Button variant="outline" className="rounded-xl h-10 px-4">
              <Edit className="mr-1 h-4 w-4" /> Edit Business
            </Button>
          </Link>
        </>
      )}

      {status === "archived" && (
        <Button
          className="rounded-xl h-10 px-4 bg-zinc-950 text-white hover:bg-zinc-800"
          onClick={handleRestore}
          disabled={isPending}
        >
          <RotateCcw className="mr-1 h-4 w-4" /> Reactivate (Restore to Draft)
        </Button>
      )}
    </div>
  );
}
