/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { uploadDocument } from "@/lib/supabase/storage";

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
]);

export async function POST(request: Request) {
  try {
    // 1. Authenticate user session
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = formData.get("type") as string | null;
    const businessId = formData.get("businessId") as string | null;

    // 3. Validation
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    if (!type || !businessId) {
      return NextResponse.json({ error: "Document type and Business ID are required." }, { status: 400 });
    }

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Invalid document format. Only PDF, JPG, and PNG are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Document file size must be under 10MB" },
        { status: 400 }
      );
    }

    // 4. Upload to Supabase Storage using existing helper
    const res = await uploadDocument(file, businessId, type);

    if (res.error) {
      return NextResponse.json(
        { error: res.error || "Failed to upload document to storage" },
        { status: 500 }
      );
    }

    // 5. Return storage path, file metadata
    return NextResponse.json({
      storagePath: res.path,
      fileName: file.name,
      mimeType: file.type,
    });
  } catch (error: any) {
    console.error("[API Upload Document] Fatal error:", error);
    return NextResponse.json(
      { error: "Something went wrong during document upload." },
      { status: 500 }
    );
  }
}
