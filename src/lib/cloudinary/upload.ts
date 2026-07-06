import { cloudinary } from "./cloudinary";
import { UploadOptions, UploadResult } from "./types";
import { CloudinaryResponse } from "@/types/cloudinary";

export async function uploadImage(
  base64Image: string,
  options: UploadOptions
): Promise<UploadResult> {
  try {
    const uploadOptions: Record<string, unknown> = {
      folder: options.folder,
    };

    if (options.preset) {
      uploadOptions.upload_preset = options.preset;
    }

    if (options.transformation) {
      uploadOptions.transformation = options.transformation;
    }

    if (options.publicId) {
      uploadOptions.public_id = options.publicId;
    }

    const result = await cloudinary.uploader.upload(base64Image, uploadOptions);

    return {
      success: true,
      data: result as CloudinaryResponse,
    };
  } catch (error: unknown) {
    console.error("Cloudinary Upload Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload image",
    };
  }
}
