import { createClient } from "@supabase/supabase-js";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL");
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

import { supabaseServer } from "./server";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const BUCKET_NAME = process.env.SUPABASE_STORAGE_BUCKET || "documents";

export async function uploadDocument(
  file: File,
  businessId: string,
  type: string
): Promise<{ path: string; error: string | null }> {
  try {
    // Basic validation
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      return { path: "", error: "Invalid file type. Only PDF, JPG, and PNG are allowed." };
    }

    if (file.size > 10 * 1024 * 1024) {
      return { path: "", error: "File size exceeds 10MB limit." };
    }

    // Generate unique path: businessId/type_timestamp_filename
    const timestamp = Date.now();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const path = `${businessId}/${type}_${timestamp}_${cleanFileName}`;

    const { data, error } = await supabaseServer.storage
      .from(BUCKET_NAME)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type
      });

    if (error) {
      console.error("Supabase storage error:", error);
      return { path: "", error: error.message };
    }

    return { path: data.path, error: null };
  } catch (err: any) {
    console.error("Upload error:", err);
    return { path: "", error: err.message || "Failed to upload document" };
  }
}

export async function deleteDocument(path: string): Promise<boolean> {
  try {
    const { error } = await supabaseServer.storage
      .from(BUCKET_NAME)
      .remove([path]);
    
    if (error) {
      console.error("Failed to delete document from Supabase:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Failed to delete document:", err);
    return false;
  }
}

export async function deleteDocuments(paths: string[]): Promise<boolean> {
  if (!paths || paths.length === 0) return true;
  
  try {
    const { error } = await supabaseServer.storage
      .from(BUCKET_NAME)
      .remove(paths);
    
    if (error) {
      console.error("Failed to delete documents from Supabase:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Failed to delete documents:", err);
    return false;
  }
}
