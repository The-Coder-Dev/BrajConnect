import { cloudinary } from "./cloudinary";
import { UploadOptions, UploadResult } from "./types";
import { CloudinaryResponse } from "@/types/cloudinary";
import { Readable } from "stream";

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

export async function uploadImageBuffer(
  buffer: Buffer,
  options: UploadOptions
): Promise<UploadResult> {
  return new Promise((resolve) => {
    const uploadOptions: Record<string, unknown> = {
      folder: options.folder,
    };

    if (options.preset) uploadOptions.upload_preset = options.preset;
    if (options.transformation) uploadOptions.transformation = options.transformation;
    if (options.publicId) uploadOptions.public_id = options.publicId;

    const stream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error("Cloudinary Buffer Upload Error:", error);
          resolve({ success: false, error: error.message });
        } else {
          resolve({ success: true, data: result as CloudinaryResponse });
        }
      }
    );

    Readable.from(buffer).pipe(stream);
  });
}
