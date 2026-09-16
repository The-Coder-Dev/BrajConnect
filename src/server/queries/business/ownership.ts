"use server";

import { db } from "@/db";
import { business } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

/**
 * Check User Business Ownership
 *
 * NOTE: This query is strictly a UI NAVIGATION and WORKSPACE SWITCHER check.
 * It is NOT an authorization mechanism.
 * Server actions, business operations, and private business dashboard data loaders
 * MUST independently and strictly enforce authorization:
 * `business.ownerId === authenticatedUser.id`
 */
export async function checkUserBusinessOwnership(): Promise<{ hasBusiness: boolean; businessCount: number }> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { hasBusiness: false, businessCount: 0 };
    }

    const [result] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(business)
      .where(eq(business.ownerId, session.user.id));

    const businessCount = Number(result?.count ?? 0);

    return {
      hasBusiness: businessCount > 0,
      businessCount,
    };
  } catch (error) {
    console.error("Error checking user business ownership:", error);
    return { hasBusiness: false, businessCount: 0 };
  }
}
