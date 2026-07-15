"use server";

import { db } from "@/db";
import { business, gallery } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { uploadImageBuffer } from "@/lib/cloudinary/upload";

export async function saveBusinessGallery(businessId: string, formData: FormData) {
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

    const files = formData.getAll("images") as File[];
    
    // Server validation: Max 20 images total in db? For now we just validate upload size.
    if (files.length > 20) {
      return { success: false, error: "Maximum 20 images allowed" };
    }

    const existingGallery = await db.query.gallery.findMany({
      where: eq(gallery.businessId, businessId)
    });
    const currentCount = existingGallery.length;
    if (currentCount + files.length > 20) {
       return { success: false, error: `Maximum 20 images allowed. You already have ${currentCount}.` };
    }

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) return { success: false, error: "Each image must be under 5MB" };
    }

    const uploads = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const res = await uploadImageBuffer(buffer, { folder: `brajconnect/business/${businessId}/gallery` });
      if (res.success && res.data) {
        uploads.push({
          id: `gal_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          businessId,
          imageUrl: res.data.secure_url,
          cloudinaryPublicId: res.data.public_id,
          format: res.data.format,
          bytes: res.data.bytes,
          width: res.data.width,
          height: res.data.height,
          sortOrder: currentCount + i,
        });
      } else {
        throw new Error(res.error || "Failed to upload gallery image");
      }
    }

    if (uploads.length > 0) {
      await db.insert(gallery).values(uploads);
    }

    return { success: true };
  } catch (error: any) {
    console.error("Failed to save gallery:", error);
    return { success: false, error: error.message || "Failed to save gallery" };
  }
}
