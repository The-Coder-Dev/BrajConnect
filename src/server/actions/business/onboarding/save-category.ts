"use server";

import { db } from "@/db";
import { business, businessCategory } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import { getFriendlyErrorMessage } from "@/lib/utils";
import { isRegisteredCategory } from "@/config/business-categories";

export async function saveBusinessCategory(businessId: string, categoryId: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    if (!businessId || !categoryId) {
      return { success: false, error: "Business ID and Category ID are required." };
    }

    // 1. Verify that categoryId corresponds to an approved registered category
    const isRegistered = isRegisteredCategory(categoryId);
    if (!isRegistered) {
      // Also check if categoryId is a database ID whose slug is registered
      const catRecord = await db.query.category.findFirst({
        where: (cat, { eq, and }) => and(eq(cat.id, categoryId), eq(cat.active, true)),
        columns: { id: true, slug: true, active: true },
      });

      if (!catRecord || !catRecord.active || !isRegisteredCategory(catRecord.slug)) {
        return {
          success: false,
          error: "The selected category is not supported. Please choose from the approved categories.",
        };
      }
    }

    // 2. Verify ownership
    const existing = await db.query.business.findFirst({
      where: and(eq(business.id, businessId), eq(business.ownerId, session.user.id)),
      columns: { id: true, status: true },
    });

    if (!existing) {
      return { success: false, error: "Business not found or unauthorized" };
    }

    if (existing.status !== "draft" && existing.status !== "needs_changes") {
      return {
        success: false,
        error: `Cannot modify category for business in '${existing.status}' status.`,
      };
    }

    // Since a business can have multiple categories but onboarding sets one primary:
    // First, remove existing primary category
    await db.delete(businessCategory)
      .where(and(
        eq(businessCategory.businessId, businessId),
        eq(businessCategory.isPrimary, true)
      ));

    // Insert new category
    await db.insert(businessCategory).values({
      businessId,
      categoryId,
      isPrimary: true,
    });

    return { success: true };
  } catch (error: any) {
    console.error("Failed to save category:", error);
    return { success: false, error: getFriendlyErrorMessage(error, "Unable to save category.") };
  }
}
