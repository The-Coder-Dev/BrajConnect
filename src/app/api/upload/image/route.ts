/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { uploadImageBuffer } from "@/lib/cloudinary/upload";
import {
  ALLOWED_IMAGE_MIME_TYPES,
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
      category: "image_upload",
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
    const businessId = formData.get("businessId") as string | null;
    const folder = (formData.get("folder") as string) || "brajconnect/uploads";

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // 4. Task 3: Centralized Business Ownership & State Verification
    if (businessId && businessId.trim() !== "") {
      const ownershipCheck = await verifyBusinessOwnership(businessId, session.user.id);
      if (!ownershipCheck.authorized) {
        return NextResponse.json(
          { error: ownershipCheck.error || "Permission denied." },
          { status: ownershipCheck.statusCode || 403 }
        );
      }
    }

    // 5. Task 4: Validate MIME type (Raster images only)
    if (!ALLOWED_IMAGE_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Invalid image format. Allowed types: JPEG, PNG, WebP. SVG is strictly forbidden." },
        { status: 400 }
      );
    }

    // 6. Task 5: Read Buffer and inspect Magic Bytes & buffer integrity
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const magicByteCheck = validateFileMagicBytes(buffer, file.type, { category: "image" });
    if (!magicByteCheck.valid) {
      return NextResponse.json(
        { error: magicByteCheck.error || "File content does not match declared image type." },
        { status: 400 }
      );
    }

    // 7. Upload buffer to Cloudinary
    const targetFolder = businessId ? `${folder}/${businessId}` : folder;
    const res = await uploadImageBuffer(buffer, { folder: targetFolder }, file.type);

    if (!res.success) {
      return NextResponse.json(
        { error: res.error || "Failed to upload image to Cloudinary" },
        { status: 500 }
      );
    }

    // 8. Return secure URL and public ID
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
