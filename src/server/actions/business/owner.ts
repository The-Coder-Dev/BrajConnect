"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/db";
import {
  business,
  businessAmenities,
} from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getFriendlyErrorMessage } from "@/lib/utils";

// Helper to verify owner session
async function getVerifiedUserId() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session.user.id;
}

/**
 * Get all businesses owned by the authenticated owner
 */
export async function getOwnerBusinesses() {
  try {
    const userId = await getVerifiedUserId();

    const businesses = await db.query.business.findMany({
      where: eq(business.ownerId, userId),
      with: {
        location: true,
        businessCategories: {
          with: {
            category: true,
          },
        },
      },
      orderBy: [desc(business.updatedAt)],
    });

    return { success: true, data: businesses };
  } catch (error: any) {
    console.error("Failed to fetch owner businesses:", error);
    return {
      success: false,
      error: getFriendlyErrorMessage(error, "Unable to load businesses."),
    };
  }
}

/**
 * Get full details of a specific business owned by the authenticated owner
 */
export async function getOwnerBusiness(businessId: string) {
  try {
    if (!businessId || typeof businessId !== "string" || businessId.trim() === "") {
      return { success: false, error: "Business ID is required." };
    }

    const userId = await getVerifiedUserId();

    const biz = await db.query.business.findFirst({
      where: and(eq(business.id, businessId), eq(business.ownerId, userId)),
      with: {
        contact: true,
        location: true,
        hours: true,
        socials: true,
        gallery: true,
        documents: true,
        businessCategories: {
          with: {
            category: true,
          },
        },
        businessFields: {
          with: {
            dynamicField: true,
          },
        },
        businessAmenities: {
          with: {
            amenity: true,
          },
        },
        services: true,
      },
    });

    if (!biz) {
      return { success: false, error: "Business not found." };
    }

    return { success: true, data: biz };
  } catch (error: any) {
    console.error(`Failed to fetch business details for ${businessId}:`, error);
    return {
      success: false,
      error: getFriendlyErrorMessage(
        error,
        "Unable to load business."
      ),
    };
  }
}

/**
 * Delete a draft business
 */
export async function deleteDraftBusiness(businessId: string) {
  try {
    if (!businessId || typeof businessId !== "string" || businessId.trim() === "") {
      return { success: false, error: "Business ID is required." };
    }

    const userId = await getVerifiedUserId();

    const existing = await db.query.business.findFirst({
      where: and(
        eq(business.id, businessId),
        eq(business.ownerId, userId),
        eq(business.status, "draft")
      ),
      columns: { id: true },
    });

    if (!existing) {
      return {
        success: false,
        error: "Permission denied.",
      };
    }

    await db.delete(business).where(eq(business.id, businessId));

    return { success: true };
  } catch (error: any) {
    console.error(`Failed to delete draft business ${businessId}:`, error);
    return {
      success: false,
      error: getFriendlyErrorMessage(error, "Something went wrong."),
    };
  }
}

/**
 * Withdraw business submission from review (returns to draft)
 */
export async function withdrawSubmission(businessId: string) {
  try {
    if (!businessId || typeof businessId !== "string" || businessId.trim() === "") {
      return { success: false, error: "Business ID is required." };
    }

    const userId = await getVerifiedUserId();

    const existing = await db.query.business.findFirst({
      where: and(
        eq(business.id, businessId),
        eq(business.ownerId, userId),
        eq(business.status, "pending_review")
      ),
      columns: { id: true },
    });

    if (!existing) {
      return {
        success: false,
        error: "Permission denied.",
      };
    }

    await db
      .update(business)
      .set({ status: "draft", updatedAt: new Date() })
      .where(eq(business.id, businessId));

    return { success: true };
  } catch (error: any) {
    console.error(`Failed to withdraw submission for ${businessId}:`, error);
    return {
      success: false,
      error: getFriendlyErrorMessage(
        error,
        "Something went wrong."
      ),
    };
  }
}

/**
 * Resubmit a rejected business (returns to pending review)
 */
export async function resubmitBusiness(businessId: string) {
  try {
    if (!businessId || typeof businessId !== "string" || businessId.trim() === "") {
      return { success: false, error: "Business ID is required." };
    }

    const userId = await getVerifiedUserId();

    const existing = await db.query.business.findFirst({
      where: and(
        eq(business.id, businessId),
        eq(business.ownerId, userId),
        eq(business.status, "rejected")
      ),
      columns: { id: true },
    });

    if (!existing) {
      return {
        success: false,
        error: "Permission denied.",
      };
    }

    await db
      .update(business)
      .set({ status: "pending_review", rejectionReason: null, updatedAt: new Date() })
      .where(eq(business.id, businessId));

    return { success: true };
  } catch (error: any) {
    console.error(`Failed to resubmit business ${businessId}:`, error);
    return {
      success: false,
      error: getFriendlyErrorMessage(error, "Something went wrong."),
    };
  }
}

/**
 * Restore an archived business (returns to draft)
 */
export async function restoreArchivedBusiness(businessId: string) {
  try {
    if (!businessId || typeof businessId !== "string" || businessId.trim() === "") {
      return { success: false, error: "Business ID is required." };
    }

    const userId = await getVerifiedUserId();

    const existing = await db.query.business.findFirst({
      where: and(
        eq(business.id, businessId),
        eq(business.ownerId, userId),
        eq(business.status, "archived")
      ),
      columns: { id: true },
    });

    if (!existing) {
      return {
        success: false,
        error: "Permission denied.",
      };
    }

    await db
      .update(business)
      .set({ status: "draft", updatedAt: new Date() })
      .where(eq(business.id, businessId));

    return { success: true };
  } catch (error: any) {
    console.error(`Failed to restore business ${businessId}:`, error);
    return {
      success: false,
      error: getFriendlyErrorMessage(error, "Something went wrong."),
    };
  }
}

/**
 * Save amenities associated with a business
 */
export async function saveBusinessAmenities(businessId: string, amenityIds: string[]) {
  try {
    if (!businessId || typeof businessId !== "string" || businessId.trim() === "") {
      return { success: false, error: "Business ID is required." };
    }

    const userId = await getVerifiedUserId();

    // Verify ownership
    const existing = await db.query.business.findFirst({
      where: and(eq(business.id, businessId), eq(business.ownerId, userId)),
      columns: { id: true }
    });

    if (!existing) {
      return { success: false, error: "Permission denied." };
    }

    // Update business_amenities
    await db.transaction(async (tx) => {
      await tx.delete(businessAmenities).where(eq(businessAmenities.businessId, businessId));

      if (amenityIds.length > 0) {
        await tx.insert(businessAmenities).values(
          amenityIds.map((id) => ({
            businessId,
            amenityId: id,
          }))
        );
      }
    });

    return { success: true };
  } catch (error: any) {
    console.error("Failed to save business amenities:", error);
    return {
      success: false,
      error: getFriendlyErrorMessage(error, "Failed to save amenities selection."),
    };
  }
}

