"use server";

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
  preferredContactMethod?: "phone" | "whatsapp" | "email";
}) {
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

    // Upsert contact info
    const existingContact = await db.query.businessContact.findFirst({
      where: eq(businessContact.businessId, businessId),
      columns: { id: true }
    });

    if (existingContact) {
      await db.update(businessContact)
        .set({
          primaryPhone: data.primaryPhone,
          whatsapp: data.whatsapp,
          email: data.email,
          website: data.website,
          preferredContactMethod: data.preferredContactMethod,
          updatedAt: new Date(),
        })
        .where(eq(businessContact.businessId, businessId));
    } else {
      await db.insert(businessContact).values({
        id: `contact_${Date.now()}`,
        businessId,
        primaryPhone: data.primaryPhone,
        whatsapp: data.whatsapp,
        email: data.email,
        website: data.website,
        preferredContactMethod: data.preferredContactMethod,
      });
    }

    return { success: true };
  } catch (error: any) {
    console.error("Failed to save contact:", error);
    return { success: false, error: getFriendlyErrorMessage(error, "Unable to save contact details.") };
  }
}
