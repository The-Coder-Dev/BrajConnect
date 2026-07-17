"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { db } from "@/db";
import { business, gallery } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { deleteImages } from "@/lib/cloudinary/upload";
import { getFriendlyErrorMessage } from "@/lib/utils";

export async function saveBusinessGallery(
  businessId: string,
  images: {
    imageUrl: string;
    cloudinaryPublicId: string;
    format?: string;
    bytes?: number;
    width?: number;
    height?: number;
  }[]
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
      columns: { id: true }
    });

    if (!existing) {
      return { success: false, error: "Business not found or unauthorized" };
    }

    // Server validation: Max 20 images total in db
    const existingGallery = await db.query.gallery.findMany({
      where: eq(gallery.businessId, businessId)
    });
    const currentCount = existingGallery.length;
    if (currentCount + images.length > 20) {
      return { success: false, error: `Maximum 20 images allowed. You already have ${currentCount}.` };
    }

    const uploads = images.map((img, i) => ({
      id: `gal_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      businessId,
      imageUrl: img.imageUrl,
      cloudinaryPublicId: img.cloudinaryPublicId,
      format: img.format || null,
      bytes: img.bytes || null,
      width: img.width || null,
      height: img.height || null,
      sortOrder: currentCount + i,
    }));

    if (uploads.length > 0) {
      await db.insert(gallery).values(uploads);
    }

    return { success: true };
  } catch (error: any) {
    console.error("Failed to save gallery:", error);
    
    // Rollback successful uploads if database insert failed
    const publicIds = images.map((img) => img.cloudinaryPublicId).filter(Boolean);
    if (publicIds.length > 0) {
      await deleteImages(publicIds);
    }

    return { success: false, error: getFriendlyErrorMessage(error, "Unable to save gallery images.") };
  }
}
