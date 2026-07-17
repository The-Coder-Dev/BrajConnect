"use server";

import { db } from "@/db";
import { business, businessFields } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import { getFriendlyErrorMessage } from "@/lib/utils";

export async function saveBusinessDynamicFields(businessId: string, fields: Record<string, any>) {
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

    // Normalize and filter new ones
    const entries = Object.entries(fields || {});
    
    const rows = entries
      .filter(([_, value]) => {
        // Skip empty or undefined values completely (since DB column is notNull)
        return value !== undefined && value !== null && value !== "";
      })
      .map(([dynamicFieldId, value]) => {
        let normalizedValue = String(value);
        
        if (typeof value === "boolean") {
          normalizedValue = value ? "true" : "false";
        } else if (typeof value === "number") {
          normalizedValue = value.toString();
        }

        return {
          id: `bf_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          businessId,
          dynamicFieldId,
          value: normalizedValue,
        };
      });

    if (rows.length > 0) {
      await db.insert(businessFields).values(rows);
    }

    return { success: true };
  } catch (error: any) {
    console.error("Failed to save dynamic fields for business", businessId, "Fields:", fields, "Error:", error);
    return { success: false, error: getFriendlyErrorMessage(error, "Unable to save category details.") };
  }
}

