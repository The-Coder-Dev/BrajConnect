import { CloudinaryResponse } from "@/types/cloudinary";

export interface UploadOptions {
  folder: string;
  preset?: string;
  transformation?: any[];
  publicId?: string;
}

export type UploadResult = 
  | { success: true; data: CloudinaryResponse }
  | { success: false; error: string };
