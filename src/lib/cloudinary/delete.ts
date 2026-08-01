import { db } from "@/db";
import { business, gallery } from "@/db/schema";
import { eq, and, or } from "drizzle-orm";
import { cloudinary } from "./cloudinary";

/**
 * Deletes a single Cloudinary asset by its public_id.
 * Returns true on success or if the asset was already deleted ("not found").
 */
export async function deleteImage(publicId: string): Promise<boolean> {
  if (!publicId || publicId.trim() === "") {
    console.warn("[Cloudinary] deleteImage called with empty publicId — skipping.");
    return true;
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result === "ok" || result.result === "not found") {
      return true;
    }
    console.error("[Cloudinary] deleteImage unexpected result:", result);
    return false;
  } catch (error) {
    console.error("[Cloudinary] deleteImage error:", error instanceof Error ? error.message : error);
    return false;
  }
}

/**
 * Task 3: Verifies that publicId matches a stored DB record for a business owned by ownerId
 * before executing deletion from Cloudinary. Prevents arbitrary deletion abuse.
 */
export async function deleteVerifiedBusinessAsset(
  businessId: string,
  ownerId: string,
  publicId: string
): Promise<boolean> {
  if (!businessId || !ownerId || !publicId || publicId.trim() === "") {
    return false;
  }

  try {
    // 1. Check if publicId matches business logo/cover owned by user
    const bizMatch = await db.query.business.findFirst({
      where: and(
        eq(business.id, businessId),
        eq(business.ownerId, ownerId),
        or(eq(business.logoPublicId, publicId), eq(business.coverPublicId, publicId))
      ),
      columns: { id: true },
    });

    if (bizMatch) {
      return await deleteImage(publicId);
    }

    // 2. Check if publicId matches a gallery item for business owned by user
    const galleryMatch = await db.query.gallery.findFirst({
      where: and(
        eq(gallery.businessId, businessId),
        eq(gallery.cloudinaryPublicId, publicId)
      ),
      columns: { id: true },
    });

    if (galleryMatch) {
      // Confirm business ownership
      const ownerBiz = await db.query.business.findFirst({
        where: and(eq(business.id, businessId), eq(business.ownerId, ownerId)),
        columns: { id: true },
      });

      if (ownerBiz) {
        return await deleteImage(publicId);
      }
    }

    console.warn(
      `[Cloudinary Security] Blocked unverified deletion attempt for publicId "${publicId}" on business "${businessId}" by owner "${ownerId}".`
    );
    return false;
  } catch (error) {
    console.error("[Cloudinary Security] Error verifying asset deletion:", error);
    return false;
  }
}

