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
