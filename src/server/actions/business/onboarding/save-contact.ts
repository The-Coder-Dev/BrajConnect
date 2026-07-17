"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { db } from "@/db";
import { business, businessContact } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getFriendlyErrorMessage } from "@/lib/utils";

export async function saveBusinessContact(businessId: string, data: {
  primaryPhone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  preferredContactMethod?: any;
}) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    if (!businessId || typeof businessId !== "string" || businessId.trim() === "") {
      return { success: false, error: "Business ID is required." };
    }

    // Verify ownership
    const existing = await db.query.business.findFirst({
      where: and(eq(business.id, businessId), eq(business.ownerId, session.user.id)),
      columns: { id: true }
    });

    if (!existing) {
      return { success: false, error: "Business not found or unauthorized" };
    }

    // Normalize preferredContactMethod
    let normalizedMethod: "phone" | "whatsapp" | "email" | null = null;
    if (data.preferredContactMethod && typeof data.preferredContactMethod === "string") {
      const lower = data.preferredContactMethod.toLowerCase().trim();
      if (lower === "phone" || lower === "whatsapp" || lower === "email") {
        normalizedMethod = lower;
      }
    }

    // Upsert contact info
    const existingContact = await db.query.businessContact.findFirst({
      where: eq(businessContact.businessId, businessId),
      columns: { id: true }
    });

    if (existingContact) {
      await db.update(businessContact)
        .set({
          primaryPhone: data.primaryPhone || null,
          whatsapp: data.whatsapp || null,
          email: data.email || null,
          website: data.website || null,
          preferredContactMethod: normalizedMethod,
          updatedAt: new Date(),
        })
        .where(eq(businessContact.businessId, businessId));
    } else {
      await db.insert(businessContact).values({
        id: `contact_${Date.now()}`,
        businessId,
        primaryPhone: data.primaryPhone || null,
        whatsapp: data.whatsapp || null,
        email: data.email || null,
        website: data.website || null,
        preferredContactMethod: normalizedMethod,
      });
    }

    return { success: true };
  } catch (error: any) {
    console.error("Failed to save contact:", error);
    return { success: false, error: getFriendlyErrorMessage(error, "Unable to save contact details.") };
  }
}
