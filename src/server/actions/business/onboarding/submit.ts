"use server";

import { db } from "@/db";
import { business, businessContact, location, businessHours, businessCategory, businessDocuments } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import { getFriendlyErrorMessage } from "@/lib/utils";

export async function submitBusinessForReview(businessId: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const userId = session.user.id;

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
        throw new Error("Business not found or unauthorized");
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
      
      // Optionally validate documents if required, etc.
      // If we require at least one document:
      // if (!existing.documents || existing.documents.length === 0) {
      //   throw new Error("Verification documents are required");
      // }

      // 10. Use BusinessStatus enum
      await tx.update(business)
        .set({ status: "pending_review", updatedAt: new Date() })
        .where(eq(business.id, businessId));

      return { success: true };
    });
  } catch (error: any) {
    console.error("Failed to submit business:", error);
    return { success: false, error: getFriendlyErrorMessage(error, "Unable to submit business. Please try again.") };
  }
}
