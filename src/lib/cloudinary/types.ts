import { CloudinaryResponse } from "@/types/cloudinary";

export interface UploadOptions {
  folder: string;
  preset?: string;
  transformation?: Record<string, unknown>[];
  publicId?: string;
}

export type UploadResult = 
  | { success: true; data: CloudinaryResponse }
  | { success: false; error: string };
