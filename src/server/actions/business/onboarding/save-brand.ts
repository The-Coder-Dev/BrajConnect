"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { db } from "@/db";
import { business } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { deleteImage } from "@/lib/cloudinary/upload";
import { getFriendlyErrorMessage } from "@/lib/utils";

export async function saveBusinessBrand(
  businessId: string,
  data: {
    logoUrl?: string;
    logoPublicId?: string;
    coverUrl?: string;
    coverPublicId?: string;
  }
) {
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
      columns: { id: true, logoPublicId: true, coverPublicId: true }
    });

    if (!existing) {
      return { success: false, error: "Business not found or unauthorized" };
    }

    const updates: any = { updatedAt: new Date() };
    if (data.logoUrl) {
      updates.logoUrl = data.logoUrl;
      updates.logoPublicId = data.logoPublicId || null;
    }
    if (data.coverUrl) {
      updates.coverUrl = data.coverUrl;
      updates.coverPublicId = data.coverPublicId || null;
    }

    if (Object.keys(updates).length > 1) {
      await db.update(business).set(updates).where(eq(business.id, businessId));
      
      // Cleanup old images if they were replaced
      if (data.logoUrl && existing.logoPublicId) {
        await deleteImage(existing.logoPublicId);
      }
      if (data.coverUrl && existing.coverPublicId) {
        await deleteImage(existing.coverPublicId);
      }
    }

    return { success: true };
  } catch (error: any) {
    console.error("Failed to save brand:", error);
    return { success: false, error: getFriendlyErrorMessage(error, "Unable to save brand images.") };
  }
}
