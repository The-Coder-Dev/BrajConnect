"use server";

import { db } from "@/db";
import { business, gallery } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { uploadImageBuffer, deleteImage } from "@/lib/cloudinary/upload";

import { getFriendlyErrorMessage } from "@/lib/utils";

export async function saveBusinessBrand(businessId: string, formData: FormData) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    // Verify ownership
    const existing = await db.query.business.findFirst({
      where: and(eq(business.id, businessId), eq(business.ownerId, session.user.id)),
      columns: { id: true, logoPublicId: true, coverPublicId: true }
    });

    if (!existing) {
      return { success: false, error: "Business not found or unauthorized" };
    }

    const logoFile = formData.get("logo") as File | null;
    const coverFile = formData.get("cover") as File | null;

    let logoUrl, logoPublicId, coverUrl, coverPublicId;

    if (logoFile && logoFile.size > 0) {
      if (logoFile.size > 2 * 1024 * 1024) return { success: false, error: "Logo exceeds 2MB limit" };
      const arrayBuffer = await logoFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const res = await uploadImageBuffer(buffer, { folder: `brajconnect/business/${businessId}/logo` });
      if (!res.success) throw new Error(res.error || "Failed to upload logo");
      logoUrl = res.data.secure_url;
      logoPublicId = res.data.public_id;
    }

    if (coverFile && coverFile.size > 0) {
      if (coverFile.size > 5 * 1024 * 1024) return { success: false, error: "Cover exceeds 5MB limit" };
      const arrayBuffer = await coverFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const res = await uploadImageBuffer(buffer, { folder: `brajconnect/business/${businessId}/cover` });
      if (!res.success) throw new Error(res.error || "Failed to upload cover");
      coverUrl = res.data.secure_url;
      coverPublicId = res.data.public_id;
    }

    const updates: any = { updatedAt: new Date() };
    if (logoUrl) {
      updates.logoUrl = logoUrl;
      updates.logoPublicId = logoPublicId;
    }
    if (coverUrl) {
      updates.coverUrl = coverUrl;
      updates.coverPublicId = coverPublicId;
    }

    if (Object.keys(updates).length > 1) {
      await db.update(business).set(updates).where(eq(business.id, businessId));
      
      // Cleanup old images if they were replaced
      if (logoUrl && existing.logoPublicId) {
        await deleteImage(existing.logoPublicId);
      }
      if (coverUrl && existing.coverPublicId) {
        await deleteImage(existing.coverPublicId);
      }
    }

    return { success: true };
  } catch (error: any) {
    console.error("Failed to save brand:", error);
    return { success: false, error: getFriendlyErrorMessage(error, "Unable to save brand images.") };
  }
}
