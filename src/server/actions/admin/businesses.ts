"use server";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/db";
import { business, businessActivity, businessReview, businessContact, location, businessCategory } from "@/db/schema";
import { eq, and, ilike, or, desc, asc, sql, count } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/guards";
import { getFriendlyErrorMessage } from "@/lib/utils";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";

export interface AdminBusinessFilterParams {
  status?: string;
  search?: string;
  categoryId?: string;
  city?: string;
  sort?: "newest" | "oldest";
  hasDocs?: "all" | "yes" | "no";
  page?: number;
  limit?: number;
}

/**
 * Get businesses with advanced filtering & pagination for Admin
 */
export async function getAdminBusinesses(params: AdminBusinessFilterParams = {}) {
  try {
    await requireAdmin();

    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, Math.min(100, params.limit || 10));
    const offset = (page - 1) * limit;

    const conditions = [];

    // Filter by status if provided (and not "all")
    if (params.status && params.status !== "all") {
      conditions.push(eq(business.status, params.status as any));
    }

    // Search query across Business name, short description
    if (params.search && params.search.trim() !== "") {
      const searchPattern = `%${params.search.trim()}%`;
      conditions.push(
        or(
          ilike(business.name, searchPattern),
          ilike(business.shortDescription, searchPattern)
        )
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const orderBy = params.sort === "oldest" ? [asc(business.createdAt)] : [desc(business.createdAt)];

    // Fetch total count and paginated items in parallel
    const [totalCountRes, items] = await Promise.all([
      db.select({ value: count() }).from(business).where(whereClause),
      db.query.business.findMany({
        where: whereClause,
        orderBy,
        limit,
        offset,
        with: {
          owner: {
            columns: { id: true, name: true, email: true },
          },
          location: {
            columns: { city: true, state: true },
          },
          businessCategories: {
            with: {
              category: { columns: { id: true, name: true } },
            },
          },
          documents: {
            columns: { id: true, documentType: true, verificationStatus: true },
          },
        },
      }),
    ]);

    const total = totalCountRes[0]?.value || 0;
    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: {
        items,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      },
    };
  } catch (error: any) {
    console.error("Failed to fetch admin businesses:", error);
    return {
      success: false,
      error: getFriendlyErrorMessage(error, "Unable to load business listings."),
    };
  }
}

/**
 * Get comprehensive business details for admin review
 */
export async function getAdminBusinessDetail(businessId: string) {
  try {
    await requireAdmin();

    if (!businessId || typeof businessId !== "string") {
      return { success: false, error: "Invalid Business ID." };
    }

    const biz = await db.query.business.findFirst({
      where: eq(business.id, businessId),
      with: {
        owner: true,
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

    // Fetch review history and activity logs
    const [reviews, activities] = await Promise.all([
      db.query.businessReview.findMany({
        where: eq(businessReview.businessId, businessId),
        orderBy: [desc(businessReview.reviewedAt)],
        with: {
          reviewer: {
            columns: { name: true, email: true },
          },
        },
      }),
      db.query.businessActivity.findMany({
        where: eq(businessActivity.businessId, businessId),
        orderBy: [desc(businessActivity.createdAt)],
        with: {
          performedByUser: {
            columns: { name: true, email: true },
          },
        },
      }),
    ]);

    // Pre-generate signed document URLs on the server to prevent client-side waterfall delays
    let documentsWithSignedUrls: any[] = [];
    if (biz.documents && biz.documents.length > 0) {
      const { getSignedDocumentUrl } = await import("@/lib/supabase/storage");
      documentsWithSignedUrls = await Promise.all(
        biz.documents.map(async (doc: any) => {
          const signedUrl = doc.storagePath ? await getSignedDocumentUrl(doc.storagePath) : null;
          return { ...doc, signedUrl };
        })
      );
    }

    return {
      success: true,
      data: {
        ...biz,
        documents: documentsWithSignedUrls,
        reviews,
        activities,
      },
    };
  } catch (error: any) {
    console.error(`Failed to fetch admin business details for ${businessId}:`, error);
    return {
      success: false,
      error: getFriendlyErrorMessage(error, "Unable to load business details."),
    };
  }
}

/**
 * Approve Business Submission
 */
export async function approveBusiness(businessId: string) {
  try {
    const { user } = await requireAdmin();

    if (!businessId) return { success: false, error: "Business ID required." };

    await db.transaction(async (tx) => {
      // 1. Update business status
      await tx
        .update(business)
        .set({
          status: "published",
          verificationStatus: "verified",
          publishedAt: new Date(),
          updatedAt: new Date(),
          rejectionReason: null,
        })
        .where(eq(business.id, businessId));

      // 2. Add review record
      await tx.insert(businessReview).values({
        id: randomUUID(),
        businessId,
        reviewedBy: user.id,
        status: "approved",
        feedback: "Business details and verification documents approved.",
      });

      // 3. Add activity log
      await tx.insert(businessActivity).values({
        id: randomUUID(),
        businessId,
        action: "approved",
        performedBy: user.id,
        reason: "Listing approved and published by Admin",
      });
    });

    revalidatePath("/admin/businesses");
    revalidatePath(`/admin/businesses/${businessId}`);

    return { success: true };
  } catch (error: any) {
    console.error(`Failed to approve business ${businessId}:`, error);
    return {
      success: false,
      error: getFriendlyErrorMessage(error, "Failed to approve business."),
    };
  }
}

/**
 * Reject Business Submission
 */
export async function rejectBusiness(businessId: string, reason: string) {
  try {
    const { user } = await requireAdmin();

    if (!businessId || !reason || reason.trim() === "") {
      return { success: false, error: "Reason for rejection is required." };
    }

    await db.transaction(async (tx) => {
      // 1. Update business status
      await tx
        .update(business)
        .set({
          status: "rejected",
          verificationStatus: "rejected",
          rejectionReason: reason.trim(),
          updatedAt: new Date(),
        })
        .where(eq(business.id, businessId));

      // 2. Add review record
      await tx.insert(businessReview).values({
        id: randomUUID(),
        businessId,
        reviewedBy: user.id,
        status: "rejected",
        feedback: reason.trim(),
      });

      // 3. Add activity log
      await tx.insert(businessActivity).values({
        id: randomUUID(),
        businessId,
        action: "rejected",
        performedBy: user.id,
        reason: reason.trim(),
      });
    });

    revalidatePath("/admin/businesses");
    revalidatePath(`/admin/businesses/${businessId}`);

    return { success: true };
  } catch (error: any) {
    console.error(`Failed to reject business ${businessId}:`, error);
    return {
      success: false,
      error: getFriendlyErrorMessage(error, "Failed to reject business."),
    };
  }
}

/**
 * Request Changes on Business Submission
 */
export async function requestChanges(businessId: string, reason: string) {
  try {
    const { user } = await requireAdmin();

    if (!businessId || !reason || reason.trim() === "") {
      return { success: false, error: "Reason for requested changes is required." };
    }

    await db.transaction(async (tx) => {
      // 1. Update business status
      await tx
        .update(business)
        .set({
          status: "needs_changes",
          rejectionReason: reason.trim(),
          updatedAt: new Date(),
        })
        .where(eq(business.id, businessId));

      // 2. Add review record
      await tx.insert(businessReview).values({
        id: randomUUID(),
        businessId,
        reviewedBy: user.id,
        status: "changes_requested",
        feedback: reason.trim(),
      });

      // 3. Add activity log
      await tx.insert(businessActivity).values({
        id: randomUUID(),
        businessId,
        action: "changes_requested",
        performedBy: user.id,
        reason: reason.trim(),
      });
    });

    revalidatePath("/admin/businesses");
    revalidatePath(`/admin/businesses/${businessId}`);

    return { success: true };
  } catch (error: any) {
    console.error(`Failed to request changes for business ${businessId}:`, error);
    return {
      success: false,
      error: getFriendlyErrorMessage(error, "Failed to request changes."),
    };
  }
}
