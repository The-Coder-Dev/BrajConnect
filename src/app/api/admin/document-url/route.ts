import { requireAdmin } from "@/lib/auth/guards";
import { getSignedDocumentUrl } from "@/lib/supabase/storage";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const path = searchParams.get("path");

    if (!path) {
      return NextResponse.json({ error: "Missing document path" }, { status: 400 });
    }

    const url = await getSignedDocumentUrl(path);

    if (!url) {
      return NextResponse.json({ error: "Failed to generate signed URL" }, { status: 500 });
    }

    return NextResponse.json({ url });
  } catch (error) {
    console.error("[API Admin Document URL Error]:", error);
    return NextResponse.json({ error: "Unauthorized or server error" }, { status: 401 });
  }
}
