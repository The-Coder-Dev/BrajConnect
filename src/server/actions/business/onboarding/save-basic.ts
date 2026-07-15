"use server";

import { db } from "@/db";
import { business } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function saveBusinessBasic(businessId: string, data: {
  name?: string;
  shortDescription?: string;
  description?: string;
  establishedYear?: number;
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

    await db.update(business)
      .set({
        ...(data.name !== undefined && { name: data.name }),
        ...(data.shortDescription !== undefined && { shortDescription: data.shortDescription }),
        ...(data.description !== undefined && { fullDescription: data.description }),
        ...(data.establishedYear !== undefined && { establishedYear: data.establishedYear }),
        updatedAt: new Date(),
      })
      .where(eq(business.id, businessId));

    return { success: true };
  } catch (error: any) {
    console.error("Failed to save basic info:", error);
    return { success: false, error: error.message || "Failed to save basic info" };
  }
}
