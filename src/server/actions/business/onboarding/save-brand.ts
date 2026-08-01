"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { db } from "@/db";
import { business } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { deleteImage } from "@/lib/cloudinary/upload";
import { getFriendlyErrorMessage } from "@/lib/utils";
import { verifyBusinessOwnership } from "@/lib/security/ownership";

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

    // Task 3: Centralized Business Ownership & State Verification
    const ownershipCheck = await verifyBusinessOwnership(businessId, session.user.id);
    if (!ownershipCheck.authorized) {
      return { success: false, error: ownershipCheck.error || "Permission denied." };
    }

    // Fetch existing stored image public IDs for safe deletion
    const existing = await db.query.business.findFirst({
      where: eq(business.id, businessId),
      columns: { logoPublicId: true, coverPublicId: true },
    });

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

      // Cleanup old images if replaced
      if (data.logoUrl && existing?.logoPublicId) {
        await deleteImage(existing.logoPublicId);
      }
      if (data.coverUrl && existing?.coverPublicId) {
        await deleteImage(existing.coverPublicId);
      }
    }

    return { success: true };
  } catch (error: any) {
    console.error("Failed to save brand:", error);
    return { success: false, error: getFriendlyErrorMessage(error, "Unable to save brand images.") };
  }
}
