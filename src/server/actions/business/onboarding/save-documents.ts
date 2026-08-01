"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { db } from "@/db";
import { businessDocuments } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { deleteDocuments } from "@/lib/supabase/storage";
import { getFriendlyErrorMessage } from "@/lib/utils";
import { verifyBusinessOwnership } from "@/lib/security/ownership";

export async function saveBusinessDocuments(
  businessId: string,
  docs: {
    type: string;
    fileName: string;
    storagePath: string;
    mimeType: string;
  }[]
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    // Task 3: Centralized Business Ownership & State Verification
    const ownershipCheck = await verifyBusinessOwnership(businessId, session.user.id);
    if (!ownershipCheck.authorized) {
      return { success: false, error: ownershipCheck.error || "Permission denied." };
    }

    // Task 7: Validate storage ownership for each attached document
    const expectedPrefix = `businesses/${businessId}/`;
    for (const doc of docs) {
      if (!doc.storagePath || !doc.storagePath.startsWith(expectedPrefix)) {
        return {
          success: false,
          error: "Unauthorized document attachment. Storage path does not belong to this business.",
        };
      }
    }

    const types = docs.map((d) => d.type);
    const newDocs = docs.map((doc) => ({
      id: `doc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      businessId,
      documentType: doc.type as any,
      fileName: doc.fileName,
      storagePath: doc.storagePath,
      mimeType: doc.mimeType,
      verificationStatus: "not_submitted" as const,
    }));

    if (newDocs.length > 0) {
      // Find old documents of the same type and delete them
      const existingDocs = await db.query.businessDocuments.findMany({
        where: eq(businessDocuments.businessId, businessId),
      });

      const oldPathsToDelete = existingDocs
        .filter((d) => types.includes(d.documentType))
        .map((d) => d.storagePath);

      // Delete old from DB
      for (const type of types) {
        await db
          .delete(businessDocuments)
          .where(
            and(
              eq(businessDocuments.businessId, businessId),
              eq(businessDocuments.documentType, type as any)
            )
          );
      }

      // Delete old from Supabase Storage
      if (oldPathsToDelete.length > 0) {
        await deleteDocuments(oldPathsToDelete);
      }

      await db.insert(businessDocuments).values(newDocs);
    }

    return { success: true };
  } catch (error: any) {
    console.error("Failed to save documents:", error);

    // Rollback uploaded paths to avoid orphan files
    const paths = docs.map((d) => d.storagePath).filter(Boolean);
    if (paths.length > 0) {
      await deleteDocuments(paths);
    }

    return {
      success: false,
      error: getFriendlyErrorMessage(error, "Unable to save verification documents."),
    };
  }
}
