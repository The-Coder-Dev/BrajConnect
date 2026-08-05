"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { db } from "@/db";
import { reviews, business, notifications } from "@/db/schema";
import { eq, and, desc, sql, avg, count } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getFriendlyErrorMessage } from "@/lib/utils";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { logBusinessActivity } from "@/server/actions/activity/log-activity";

export interface SubmitReviewInput {
  businessId: string;
  authorName: string;
  authorEmail: string;
  rating: number;
  comment: string;
}

async function ensureReviewsTableExists() {
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS reviews (
        id TEXT PRIMARY KEY,
        "businessId" TEXT NOT NULL REFERENCES business(id) ON DELETE CASCADE,
        "userId" TEXT REFERENCES user(id) ON DELETE CASCADE,
        "authorName" TEXT NOT NULL,
        "authorEmail" TEXT NOT NULL,
        "authorAvatar" TEXT,
        rating INTEGER NOT NULL DEFAULT 5,
        comment TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        "ownerResponse" TEXT,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
  } catch (err) {
    console.warn("[Reviews] Auto-provisioning SQL check warning:", err);
  }
}

/**
 * Public action: Visitor submits a review for a business
 */
export async function submitBusinessReview(input: SubmitReviewInput) {
  try {
    if (!input.businessId || !input.authorName || !input.authorEmail || !input.comment) {
      return { success: false, error: "Please fill in all required review fields." };
    }

    if (input.rating < 1 || input.rating > 5) {
      return { success: false, error: "Rating must be between 1 and 5 stars." };
    }

    await ensureReviewsTableExists();

    const biz = await db.query.business.findFirst({
      where: eq(business.id, input.businessId),
      columns: { id: true, name: true, ownerId: true, slug: true },
    });

    if (!biz) {
      return { success: false, error: "Target business not found." };
    }

    // Optional session check if visitor is logged in
    const session = await auth.api.getSession({ headers: await headers() }).catch(() => null);

    const reviewId = `rev_${randomUUID().replace(/-/g, "").substring(0, 16)}`;

    await db.insert(reviews).values({
      id: reviewId,
      businessId: biz.id,
      userId: session?.user?.id || null,
      authorName: input.authorName.trim(),
      authorEmail: input.authorEmail.trim().toLowerCase(),
      authorAvatar: session?.user?.image || null,
      rating: input.rating,
      comment: input.comment.trim(),
      status: "pending",
    });

    // Create in-app notification for owner
    try {
      await db.insert(notifications).values({
        id: `notif_${randomUUID().replace(/-/g, "").substring(0, 16)}`,
        userId: biz.ownerId,
        businessId: biz.id,
        type: "review_received",
        title: "New Review Submitted",
        message: `${input.authorName} left a ${input.rating}-star review for "${biz.name}".`,
        link: "/dashboard",
        read: false,
      });
    } catch (nErr) {
      console.warn("[Reviews] Notification creation warning:", nErr);
    }

    // Log activity
    await logBusinessActivity({
      businessId: biz.id,
      userId: biz.ownerId,
      type: "review_received",
      title: "Review Submitted",
      description: `${input.authorName} submitted a ${input.rating}-star review awaiting approval.`,
    });

    revalidatePath(`/business/${biz.slug || biz.id}`);
    revalidatePath("/dashboard");

    return { success: true, reviewId };
  } catch (error: any) {
    console.error("[Reviews] Error submitting review:", error);
    return {
      success: false,
      error: getFriendlyErrorMessage(error, "Failed to submit review."),
    };
  }
}

/**
 * Fetch reviews for business (Public sees approved; Owner/Admin sees all)
 */
export async function getBusinessReviews(businessId: string, status?: string) {
  try {
    await ensureReviewsTableExists();

    const whereConditions = [eq(reviews.businessId, businessId)];
    if (status) {
      whereConditions.push(eq(reviews.status, status));
    }

    const items = await db.query.reviews.findMany({
      where: and(...whereConditions),
      orderBy: [desc(reviews.createdAt)],
    });

    return { success: true, data: items };
  } catch (error: any) {
    console.error("[Reviews] Error fetching reviews:", error);
    return { success: false, data: [] };
  }
}

/**
 * Owner/Admin action: Moderate review (approve, reject, spam, reply)
 */
export async function moderateBusinessReview(
  reviewId: string,
  newStatus: "approved" | "rejected" | "spam",
  ownerResponse?: string
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    await ensureReviewsTableExists();

    const rev = await db.query.reviews.findFirst({
      where: eq(reviews.id, reviewId),
    });

    if (!rev) {
      return { success: false, error: "Review not found." };
    }

    const biz = await db.query.business.findFirst({
      where: eq(business.id, rev.businessId),
      columns: { id: true, ownerId: true, slug: true },
    });

    const isAdmin = session.user.role === "admin";
    const isOwner = biz?.ownerId === session.user.id;

    if (!isAdmin && !isOwner) {
      return { success: false, error: "Unauthorized to moderate this review." };
    }

    await db
      .update(reviews)
      .set({
        status: newStatus,
        ownerResponse: ownerResponse !== undefined ? ownerResponse.trim() : rev.ownerResponse,
        updatedAt: new Date(),
      })
      .where(eq(reviews.id, reviewId));

    if (newStatus === "approved") {
      await logBusinessActivity({
        businessId: rev.businessId,
        userId: session.user.id,
        type: "review_approved",
        title: "Review Approved",
        description: `Review by ${rev.authorName} was approved and is live.`,
      });
    }

    revalidatePath("/dashboard");
    if (biz?.slug) {
      revalidatePath(`/business/${biz.slug}`);
    }

    return { success: true };
  } catch (error: any) {
    console.error("[Reviews] Error moderating review:", error);
    return {
      success: false,
      error: getFriendlyErrorMessage(error, "Failed to update review status."),
    };
  }
}
