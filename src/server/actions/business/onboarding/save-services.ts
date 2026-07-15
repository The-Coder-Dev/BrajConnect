"use server";

import { db } from "@/db";
import { business, businessServices } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function saveBusinessServices(businessId: string, services: { title: string; description?: string }[]) {
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

    // Delete existing
    await db.delete(businessServices).where(eq(businessServices.businessId, businessId));

    if (services.length > 0) {
      const rows = services.map((s, idx) => ({
        id: `srv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        businessId,
        title: s.title,
        description: s.description || null,
        sortOrder: idx,
      }));

      await db.insert(businessServices).values(rows);
    }

    return { success: true };
  } catch (error: any) {
    console.error("Failed to save services:", error);
    return { success: false, error: error.message || "Failed to save services" };
  }
}
