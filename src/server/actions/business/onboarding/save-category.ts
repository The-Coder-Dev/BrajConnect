"use server";

import { db } from "@/db";
import { business, businessCategory } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import { getFriendlyErrorMessage } from "@/lib/utils";

export async function saveBusinessCategory(businessId: string, categoryId: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    // Verify ownership
    const existing = await db.query.business.findFirst({
      where: and(eq(business.id, businessId), eq(business.ownerId, session.user.id)),
      columns: { id: true }
    });

    if (!existing) {
      return { success: false, error: "Business not found or unauthorized" };
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
