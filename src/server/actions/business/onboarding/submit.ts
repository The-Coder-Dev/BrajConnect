"use server";

import { db } from "@/db";
import { business } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import { getFriendlyErrorMessage } from "@/lib/utils";
import { isValidStatusTransition } from "@/lib/security/workflow";

export async function submitBusinessForReview(businessId: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const userId = session.user.id;

    console.log(`[submitBusinessForReview] Submitting businessId: ${businessId} for userId: ${userId}`);

    // We use a transaction to validate everything and update the status
    return await db.transaction(async (tx) => {
      // Verify ownership & get current state
      const existing = await tx.query.business.findFirst({
        where: and(eq(business.id, businessId), eq(business.ownerId, userId)),
        with: {
          contact: true,
          location: true,
          hours: true,
          businessCategories: true,
          documents: true,
        }
      });

      if (!existing) {
        console.warn(`[submitBusinessForReview] Business ${businessId} not found or not owned by user ${userId}`);
        throw new Error("Business not found or unauthorized");
      }

      console.log(`[submitBusinessForReview] Validating business state. Current Status: '${existing.status}', Document Count: ${existing.documents?.length || 0}`);

      // Task 8: Validate business workflow state transition
      if (!isValidStatusTransition(existing.status, "pending_review")) {
        throw new Error(`Cannot submit business in status '${existing.status}' for review.`);
      }

      // 9. Before changing status, validate required sections are complete
      if (!existing.name) throw new Error("Business name is required");
      
      if (!existing.businessCategories || existing.businessCategories.length === 0) {
        throw new Error("Business category is required");
      }

      if (!existing.contact) {
        throw new Error("Contact information is required");
      }

      if (!existing.location) {
        throw new Error("Location information is required");
      }

      if (!existing.hours || existing.hours.length === 0) {
        throw new Error("Business hours are required");
      }
      
      // Task 9: Re-enable required verification document validation
      if (!existing.documents || existing.documents.length === 0) {
        console.warn(`[submitBusinessForReview] Missing verification documents for businessId: ${businessId}`);
        throw new Error("At least one verification document is required before submitting for review.");
      }

      // 10. Use BusinessStatus enum
      await tx.update(business)
        .set({ status: "pending_review", updatedAt: new Date() })
        .where(eq(business.id, businessId));

      console.log(`[submitBusinessForReview] Business ${businessId} successfully transitioned to 'pending_review' status.`);

      return { success: true };
    });
  } catch (error: unknown) {
    console.error("Failed to submit business:", error);
    return { success: false, error: getFriendlyErrorMessage(error, "Unable to submit business. Please try again.") };
  }
}
