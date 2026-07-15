"use server";

import { db } from "@/db";
import { business, businessFields } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function saveBusinessDynamicFields(businessId: string, fields: Record<string, string>) {
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

    // Delete existing dynamic fields
    await db.delete(businessFields).where(eq(businessFields.businessId, businessId));

    // Insert new ones
    const entries = Object.entries(fields);
    if (entries.length > 0) {
      const rows = entries.map(([dynamicFieldId, value]) => ({
        id: `bf_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        businessId,
        dynamicFieldId,
        value: value.toString(),
      }));

      await db.insert(businessFields).values(rows);
    }

    return { success: true };
  } catch (error: any) {
    console.error("Failed to save dynamic fields:", error);
    return { success: false, error: error.message || "Failed to save dynamic fields" };
  }
}
