"use server";

import { db } from "@/db";
import { business, businessDocuments, documentTypeEnum } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { uploadDocument, deleteDocuments } from "@/lib/supabase/storage";

import { getFriendlyErrorMessage } from "@/lib/utils";

export async function saveBusinessDocuments(businessId: string, formData: FormData) {
  let uploadedPaths: string[] = [];

  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    // Verify ownership
    const existing = await db.query.business.findFirst({
      where: and(eq(business.id, businessId), eq(business.ownerId, session.user.id)),
      columns: { id: true }
    });

    if (!existing) {
      return { success: false, error: "Business not found or unauthorized" };
    }

    const types = formData.getAll("type") as typeof documentTypeEnum.enumValues[number][];
    const files = formData.getAll("file") as File[];

    if (types.length !== files.length) {
      return { success: false, error: "Mismatched document data" };
    }

    const newDocs = [];
    for (let i = 0; i < files.length; i++) {
      const type = types[i];
      const file = files[i];

      const res = await uploadDocument(file, businessId, type);
      if (res.error) {
        throw new Error(res.error);
      }

      uploadedPaths.push(res.path);

      newDocs.push({
        id: `doc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        businessId,
        documentType: type,
        fileName: file.name,
        storagePath: res.path,
        mimeType: file.type,
        verificationStatus: "not_submitted" as const,
      });
    }

    if (newDocs.length > 0) {
      // Find old documents of the same type and delete them
      const existingDocs = await db.query.businessDocuments.findMany({
        where: and(
          eq(businessDocuments.businessId, businessId)
        )
      });
      
      const oldPathsToDelete = existingDocs
        .filter(d => types.includes(d.documentType))
        .map(d => d.storagePath);
      
      // Delete old from DB
      for (const type of types) {
        await db.delete(businessDocuments)
          .where(and(
            eq(businessDocuments.businessId, businessId),
            eq(businessDocuments.documentType, type)
          ));
      }
      
      // Delete old from Supabase
      if (oldPathsToDelete.length > 0) {
        await deleteDocuments(oldPathsToDelete);
      }

      await db.insert(businessDocuments).values(newDocs);
    }

    return { success: true };
  } catch (error: any) {
    console.error("Failed to save documents:", error);
    
    // Rollback orphaned uploads
    if (uploadedPaths.length > 0) {
      await deleteDocuments(uploadedPaths);
    }

    return { success: false, error: getFriendlyErrorMessage(error, "Unable to save verification documents.") };
  }
}
