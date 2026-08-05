/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { uploadDocument } from "@/lib/supabase/storage";
import {
  ALLOWED_DOCUMENT_MIME_TYPES,
  validateFileMagicBytes,
} from "@/lib/security/file-validation";
import { enforceRateLimit, getClientIdentifier } from "@/lib/security/rate-limit";
import { verifyBusinessOwnership } from "@/lib/security/ownership";

export async function POST(request: Request) {
  try {
    // 1. Authenticate user session
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Task 2: Enforce Rate Limiting using centralized category
    const clientIdentifier = getClientIdentifier(request, session.user.id);
    const rateLimit = await enforceRateLimit({
      identifier: clientIdentifier,
      category: "document_upload",
    });

    if (!rateLimit.success) {
      return NextResponse.json(
        { error: rateLimit.error || "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // 3. Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = formData.get("type") as string | null;
    const businessId = formData.get("businessId") as string | null;

    // 4. Validation
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    if (!type || !businessId || businessId.trim() === "") {
      return NextResponse.json({ error: "Document type and Business ID are required." }, { status: 400 });
    }

    // 5. Task 3: Centralized Business Ownership & State Verification
    const ownershipCheck = await verifyBusinessOwnership(businessId, session.user.id);
    if (!ownershipCheck.authorized) {
      return NextResponse.json(
        { error: ownershipCheck.error || "Permission denied." },
        { status: ownershipCheck.statusCode || 403 }
      );
    }

    // 6. Validate MIME type
    if (!ALLOWED_DOCUMENT_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Invalid document format. Only PDF, JPG, PNG, and WebP are allowed." },
        { status: 400 }
      );
    }

    // 7. Task 5: Read Buffer and inspect Magic Bytes & buffer integrity
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const magicByteCheck = validateFileMagicBytes(buffer, file.type, { category: "document" });
    if (!magicByteCheck.valid) {
      return NextResponse.json(
        { error: magicByteCheck.error || "File content does not match declared document type." },
        { status: 400 }
      );
    }

    // 8. Upload to Supabase Storage with strict business directory scoping
    console.log(`[API Upload Document] Uploading file "${file.name}" for businessId: ${businessId}, Type: ${type}`);
    const res = await uploadDocument(file, businessId, type);

    if (res.error) {
      console.error(`[API Upload Document] Storage upload failed for ${businessId}:`, res.error);
      return NextResponse.json(
        { error: res.error || "Failed to upload document to storage" },
        { status: 500 }
      );
    }

    console.log(`[API Upload Document] Upload success. Generated Storage Path: "${res.path}"`);

    // 9. Return storage path, file metadata
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
