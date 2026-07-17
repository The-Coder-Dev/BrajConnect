/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { uploadImageBuffer } from "@/lib/cloudinary/upload";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
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
    const folder = (formData.get("folder") as string) || "brajconnect/uploads";

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // 3. Validate MIME type
    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed types: JPEG, PNG, WebP, GIF, SVG." },
        { status: 400 }
      );
    }

    // 4. Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Image file size must be under 5MB" },
        { status: 400 }
      );
    }

    // 5. Upload buffer to Cloudinary using existing helper
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const res = await uploadImageBuffer(buffer, { folder }, file.type);

    if (!res.success) {
      return NextResponse.json(
        { error: res.error || "Failed to upload image to Cloudinary" },
        { status: 500 }
      );
    }

    // 6. Return secure URL and public ID
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
