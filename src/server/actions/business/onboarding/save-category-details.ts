"use server";

import { db } from "@/db";
import { business, businessCategoryDetails } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getFriendlyErrorMessage } from "@/lib/utils";
import { getCategoryConfig } from "@/config/business-categories";
import { validateCategorySubmission } from "@/lib/onboarding/validation";
import { randomUUID } from "crypto";

export async function saveBusinessCategoryDetails(
  businessId: string,
  categoryId: string,
  categoryData: Record<string, unknown>
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    if (!businessId || !categoryId) {
      return { success: false, error: "Business ID and Category ID are required." };
    }

    // 1. Verify business ownership
    const existing = await db.query.business.findFirst({
      where: and(eq(business.id, businessId), eq(business.ownerId, session.user.id)),
      columns: { id: true, status: true },
    });

    if (!existing) {
      return { success: false, error: "Business not found or unauthorized." };
    }

    if (existing.status !== "draft" && existing.status !== "needs_changes") {
      return {
        success: false,
        error: `Cannot modify category details for business in '${existing.status}' status.`,
      };
    }

    // 2. Resolve category configuration by categoryId (or slug)
    const categoryRecord = await db.query.category.findFirst({
      where: (cat, { eq }) => eq(cat.id, categoryId),
      columns: { id: true, slug: true, name: true, active: true },
    });

    const categorySlug = categoryRecord?.slug || categoryId;
    const config = getCategoryConfig(categorySlug) || getCategoryConfig(categoryId);

    if (!config || (categoryRecord && !categoryRecord.active)) {
      return {
        success: false,
        error: "The selected category is not supported. Please choose from the approved categories.",
      };
    }

    // 3. Authoritative server-side validation & field sanitization
    const validationResult = validateCategorySubmission(config, categoryData || {});
    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error || "Category validation failed.",
      };
    }
    const sanitizedData = validationResult.data;

    // 4. Upsert into businessCategoryDetails
    await db.transaction(async (tx) => {
      const existingDetails = await tx.query.businessCategoryDetails.findFirst({
        where: eq(businessCategoryDetails.businessId, businessId),
        columns: { id: true },
      });

      if (existingDetails) {
        await tx
          .update(businessCategoryDetails)
          .set({
            categoryId,
            data: sanitizedData,
            updatedAt: new Date(),
          })
          .where(eq(businessCategoryDetails.id, existingDetails.id));
      } else {
        await tx.insert(businessCategoryDetails).values({
          id: randomUUID(),
          businessId,
          categoryId,
          data: sanitizedData,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    });

    return { success: true };
  } catch (error: unknown) {
    console.error("[saveBusinessCategoryDetails] Error:", error);
    return {
      success: false,
      error: getFriendlyErrorMessage(error, "Failed to save category details."),
    };
  }
}
