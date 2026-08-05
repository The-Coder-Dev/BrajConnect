"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { db } from "@/db";
import { business, notifications } from "@/db/schema";
import { eq, and, desc, ilike, or, sql } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/guards";
import { getFriendlyErrorMessage } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { logBusinessActivity } from "@/server/actions/activity/log-activity";

export interface AdminBusinessListParams {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

/**
 * Admin action: Query businesses with search, status filtering, and pagination
 */
export async function getAdminBusinessList(params: AdminBusinessListParams = {}) {
  try {
    await requireAdmin();

    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, Math.min(50, params.limit || 10));
    const offset = (page - 1) * limit;

    const conditions: any[] = [];
    if (params.status && params.status !== "all") {
      conditions.push(eq(business.status, params.status as any));
    }
    if (params.search && params.search.trim()) {
      const q = `%${params.search.trim()}%`;
      conditions.push(or(ilike(business.name, q), ilike(business.slug, q)));
    }

    const items = await db.query.business.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      with: {
        owner: {
          columns: { id: true, name: true, email: true },
        },
        businessCategories: {
          with: { category: true },
        },
        location: true,
      },
      orderBy: [desc(business.updatedAt)],
      limit,
      offset,
    });

    const [{ total }] = await db
      .select({ total: sql<number>`count(*)` })
      .from(business)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      success: true,
      data: {
        items,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      },
    };
  } catch (error: any) {
    console.error("[Admin Business Management] Error querying businesses:", error);
    return {
      success: false,
      error: getFriendlyErrorMessage(error, "Unable to load admin business list."),
    };
  }
}

/**
 * Admin action: Update business status (Approve, Reject, Suspend, Restore, Archive)
 */
export async function updateAdminBusinessStatus(
  businessId: string,
  newStatus: "published" | "rejected" | "suspended" | "archived" | "draft",
  reason?: string
) {
  try {
    const admin = await requireAdmin();

    const biz = await db.query.business.findFirst({
      where: eq(business.id, businessId),
    });

    if (!biz) {
      return { success: false, error: "Business not found." };
    }

    const updates: any = {
      status: newStatus,
      updatedAt: new Date(),
    };

    if (newStatus === "published") {
      updates.publishedAt = new Date();
      updates.rejectionReason = null;
      updates.suspensionReason = null;
    } else if (newStatus === "rejected") {
      updates.rejectionReason = reason || "Rejection reason specified by administrator.";
    } else if (newStatus === "suspended") {
      updates.suspensionReason = reason || "Listing suspended by administrator.";
    }

    await db.update(business).set(updates).where(eq(business.id, businessId));

    // Create in-app notification for owner
    if (newStatus === "published") {
      try {
        await db.insert(notifications).values({
          id: `notif_${randomUUID().replace(/-/g, "").substring(0, 16)}`,
          userId: biz.ownerId,
          businessId: biz.id,
          type: "business_approved",
          title: "Business Listing Approved!",
          message: `Congratulations! "${biz.name}" has been verified and is live on BachatLal.`,
          link: "/dashboard",
          read: false,
        });
      } catch (nErr) {
        console.warn("[Admin Business] Notification warning:", nErr);
      }
    }

    // Log Activity Timeline Event
    await logBusinessActivity({
      businessId: biz.id,
      userId: admin.user.id,
      type: newStatus === "published" ? "approved" : newStatus,
      title: `Business ${newStatus.toUpperCase()}`,
      description: `Administrator changed status of "${biz.name}" to ${newStatus}.${reason ? ` Reason: ${reason}` : ""}`,
    });

    revalidatePath("/admin/businesses");
    revalidatePath("/dashboard");
    if (biz.slug) revalidatePath(`/business/${biz.slug}`);

    return { success: true };
  } catch (error: any) {
    console.error("[Admin Business Management] Error updating status:", error);
    return {
      success: false,
      error: getFriendlyErrorMessage(error, "Failed to update business status."),
    };
  }
}

/**
 * Admin action: Soft delete (Archive) or Permanent delete
 */
export async function deleteAdminBusiness(businessId: string, permanent: boolean = false) {
  try {
    const admin = await requireAdmin();

    const biz = await db.query.business.findFirst({
      where: eq(business.id, businessId),
    });

    if (!biz) {
      return { success: false, error: "Business not found." };
    }

    if (permanent) {
      await db.delete(business).where(eq(business.id, businessId));
      await logBusinessActivity({
        userId: admin.user.id,
        type: "deleted_permanently",
        title: "Business Permanently Deleted",
        description: `"${biz.name}" (ID: ${businessId}) was permanently purged by admin.`,
      });
    } else {
      // Soft Delete: Archive
      await db.update(business).set({ status: "archived", updatedAt: new Date() }).where(eq(business.id, businessId));
      await logBusinessActivity({
        businessId: biz.id,
        userId: admin.user.id,
        type: "archived",
        title: "Business Archived (Soft Deleted)",
        description: `"${biz.name}" was archived. It can be restored by an admin.`,
      });
    }

    revalidatePath("/admin/businesses");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error: any) {
    console.error("[Admin Business Management] Error deleting business:", error);
    return {
      success: false,
      error: getFriendlyErrorMessage(error, "Failed to delete business."),
    };
  }
}
