"use server";

import { cloudinary } from "./cloudinary";
import { UploadOptions, UploadResult } from "./types";
import { CloudinaryResponse } from "@/types/cloudinary";
import { Readable } from "stream";

// ---------------------------------------------------------------------------
// Allowed MIME types for image uploads
// ---------------------------------------------------------------------------
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Extract a human-readable message from any thrown value. */
function extractErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    // Strip the generic Cloudinary "Must supply api_key" noise with a better message.
    if (
      error.message.includes("Must supply api_key") ||
      error.message.includes("Must supply cloud_name")
    ) {
      return (
        "Cloudinary is not configured. " +
        "Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
      );
    }
    return error.message;
  }
  if (typeof error === "object" && error !== null && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return fallback;
}

// ---------------------------------------------------------------------------
// uploadImage — base64/data-URI upload
// ---------------------------------------------------------------------------

export async function uploadImage(
  base64Image: string,
  options: UploadOptions
): Promise<UploadResult> {
  try {
    if (!base64Image || base64Image.trim() === "") {
      return { success: false, error: "No image data provided." };
    }

    const uploadOptions: Record<string, unknown> = {
      folder: options.folder,
      secure: true,
    };

    if (options.preset) uploadOptions.upload_preset = options.preset;
    if (options.transformation) uploadOptions.transformation = options.transformation;
    if (options.publicId) uploadOptions.public_id = options.publicId;

    const result = await cloudinary.uploader.upload(base64Image, uploadOptions);

    return {
      success: true,
      data: result as CloudinaryResponse,
    };
  } catch (error: unknown) {
    const message = extractErrorMessage(error, "Failed to upload image.");
    console.error("[Cloudinary] uploadImage error:", message);
    return { success: false, error: message };
  }
}

// ---------------------------------------------------------------------------
// uploadImageBuffer — raw Buffer stream upload (used by Server Actions)
// ---------------------------------------------------------------------------

export async function uploadImageBuffer(
  buffer: Buffer,
  options: UploadOptions,
  mimeType?: string
): Promise<UploadResult> {
  // Validate MIME type when provided
  if (mimeType && !ALLOWED_MIME_TYPES.has(mimeType)) {
    return {
      success: false,
      error: `Invalid file type "${mimeType}". Allowed types: JPEG, PNG, WebP, GIF, SVG.`,
    };
  }

  if (!buffer || buffer.length === 0) {
    return { success: false, error: "Empty file buffer provided." };
  }

  return new Promise((resolve) => {
    const uploadOptions: Record<string, unknown> = {
      folder: options.folder,
      secure: true,
    };

    if (options.preset) uploadOptions.upload_preset = options.preset;
    if (options.transformation) uploadOptions.transformation = options.transformation;
    if (options.publicId) uploadOptions.public_id = options.publicId;

    const stream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          const message = extractErrorMessage(error, "Failed to upload image.");
          console.error("[Cloudinary] uploadImageBuffer stream error:", message);
          resolve({ success: false, error: message });
        } else {
          resolve({ success: true, data: result as CloudinaryResponse });
        }
      }
    );

    Readable.from(buffer).pipe(stream);
  });
}

// ---------------------------------------------------------------------------
// deleteImage — destroy a single asset by public_id
// ---------------------------------------------------------------------------

export async function deleteImage(publicId: string): Promise<boolean> {
  if (!publicId || publicId.trim() === "") {
    console.warn("[Cloudinary] deleteImage called with empty publicId — skipping.");
    return true;
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    // Cloudinary returns "ok" for success and "not found" for already-deleted assets.
    if (result.result === "ok" || result.result === "not found") {
      return true;
    }
    console.error("[Cloudinary] deleteImage unexpected result:", result);
    return false;
  } catch (error) {
    const message = extractErrorMessage(error, "Failed to delete image.");
    console.error("[Cloudinary] deleteImage error:", message);
    return false;
  }
}

// ---------------------------------------------------------------------------
// deleteImages — bulk destroy multiple assets
// ---------------------------------------------------------------------------

export async function deleteImages(publicIds: string[]): Promise<boolean> {
  if (!publicIds || publicIds.length === 0) return true;

  // Filter out any blank entries
  const validIds = publicIds.filter((id) => id && id.trim() !== "");
  if (validIds.length === 0) return true;

  try {
    await cloudinary.api.delete_resources(validIds);
    return true;
  } catch (error) {
    const message = extractErrorMessage(error, "Failed to delete images.");
    console.error("[Cloudinary] deleteImages error:", message);
    return false;
  }
}
