"use server";

import { db } from "@/db";
import { business, businessHours } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import { getFriendlyErrorMessage } from "@/lib/utils";

type HourEntry = {
  dayOfWeek: number;
  openTime?: string;
  closeTime?: string;
  isClosed: boolean;
  is24Hours: boolean;
};

export async function saveBusinessHours(businessId: string, hours: HourEntry[]) {
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

    // Delete existing hours
    await db.delete(businessHours).where(eq(businessHours.businessId, businessId));

    // Insert new ones
    if (hours.length > 0) {
      const rows = hours.map(h => ({
        id: `bh_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        businessId,
        dayOfWeek: h.dayOfWeek,
        openTime: h.openTime || null,
        closeTime: h.closeTime || null,
        isClosed: h.isClosed,
        is24Hours: h.is24Hours,
      }));

      await db.insert(businessHours).values(rows);
    }

    return { success: true };
  } catch (error: any) {
    console.error("Failed to save hours:", error);
    return { success: false, error: getFriendlyErrorMessage(error, "Unable to save business hours.") };
  }
}
