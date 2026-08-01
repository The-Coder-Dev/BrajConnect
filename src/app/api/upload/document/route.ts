/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { uploadDocument } from "@/lib/supabase/storage";
import { db } from "@/db";
import { business } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import {
  ALLOWED_DOCUMENT_MIME_TYPES,
  validateFileMagicBytes,
} from "@/lib/security/file-validation";
import { enforceRateLimit, getClientIdentifier } from "@/lib/security/rate-limit";

export async function POST(request: Request) {
  try {
    // 1. Authenticate user session
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Enforce Rate Limiting (Task 6)
    const clientIdentifier = getClientIdentifier(request, session.user.id);
    const rateLimit = await enforceRateLimit({
      identifier: clientIdentifier,
      action: "upload_document",
      limit: 15,
      windowSeconds: 60,
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

    // 5. Task 2: Verify Business existence, status & owner ownership
    const biz = await db.query.business.findFirst({
      where: and(eq(business.id, businessId), eq(business.ownerId, session.user.id)),
      columns: { id: true, status: true },
    });

    if (!biz) {
      return NextResponse.json(
        { error: "Business not found or unauthorized cross-tenant upload." },
        { status: 403 }
      );
    }

    if (biz.status === "archived" || biz.status === "suspended") {
      return NextResponse.json(
        { error: "Business status does not allow document uploads." },
        { status: 400 }
      );
    }

    // 6. Validate MIME type
    if (!ALLOWED_DOCUMENT_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Invalid document format. Only PDF, JPG, PNG, and WebP are allowed." },
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

    // 7. Task 5: Inspect file Magic Bytes
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const magicByteCheck = validateFileMagicBytes(buffer, file.type);
    if (!magicByteCheck.valid) {
      return NextResponse.json(
        { error: magicByteCheck.error || "File content does not match declared document type." },
        { status: 400 }
      );
    }

    // 8. Task 7: Upload to Supabase Storage with strict business directory scoping
    const res = await uploadDocument(file, businessId, type);

    if (res.error) {
      return NextResponse.json(
        { error: res.error || "Failed to upload document to storage" },
        { status: 500 }
      );
    }

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
