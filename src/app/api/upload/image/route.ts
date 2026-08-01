/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { uploadImageBuffer } from "@/lib/cloudinary/upload";
import { db } from "@/db";
import { business } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import {
  ALLOWED_IMAGE_MIME_TYPES,
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
      action: "upload_image",
      limit: 20,
      windowSeconds: 60,
    });

    if (!rateLimit.success) {
      return NextResponse.json(
        { error: rateLimit.error || "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // 3. Parse form data & verify parameters
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const businessId = formData.get("businessId") as string | null;
    const folder = (formData.get("folder") as string) || "brajconnect/uploads";

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // 4. Task 2: Ownership verification if businessId provided
    if (businessId && businessId.trim() !== "") {
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
          { error: "Business status does not allow image uploads." },
          { status: 400 }
        );
      }
    }

    // 5. Task 4: Validate MIME type (Raster images only: JPEG, PNG, WebP — SVG rejected)
    if (!ALLOWED_IMAGE_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Invalid image format. Allowed types: JPEG, PNG, WebP. SVG is strictly forbidden." },
        { status: 400 }
      );
    }

    // 6. Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Image file size must be under 5MB" },
        { status: 400 }
      );
    }

    // 7. Task 5: Read Buffer and inspect Magic Bytes
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const magicByteCheck = validateFileMagicBytes(buffer, file.type);
    if (!magicByteCheck.valid) {
      return NextResponse.json(
        { error: magicByteCheck.error || "File content does not match declared image type." },
        { status: 400 }
      );
    }

    // 8. Upload buffer to Cloudinary
    const targetFolder = businessId ? `${folder}/${businessId}` : folder;
    const res = await uploadImageBuffer(buffer, { folder: targetFolder }, file.type);

    if (!res.success) {
      return NextResponse.json(
        { error: res.error || "Failed to upload image to Cloudinary" },
        { status: 500 }
      );
    }

    // 9. Return secure URL and public ID
    return NextResponse.json({
      url: res.data.secure_url,
      publicId: res.data.public_id,
    });
  } catch (error: any) {
    console.error("[API Upload Image] Fatal error:", error);
    return NextResponse.json(
      { error: "Something went wrong during image upload." },
      { status: 500 }
    );
  }
}
