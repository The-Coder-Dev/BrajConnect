"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { db } from "@/db";
import { notifications } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getFriendlyErrorMessage } from "@/lib/utils";
import { revalidatePath } from "next/cache";

/**
 * Fetch in-app notifications for the logged in user
 */
export async function getOwnerNotifications() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const items = await db.query.notifications.findMany({
      where: eq(notifications.userId, session.user.id),
      orderBy: [desc(notifications.createdAt)],
      limit: 20,
    });

    const unreadCount = items.filter((n) => !n.read).length;

    return {
      success: true,
      data: {
        notifications: items,
        unreadCount,
      },
    };
  } catch (error: any) {
    console.error("Failed to fetch notifications:", error);
    return {
      success: false,
      error: getFriendlyErrorMessage(error, "Failed to load notifications."),
    };
  }
}

/**
 * Mark a single notification as read
 */
export async function markNotificationAsRead(id: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    await db
      .update(notifications)
      .set({ read: true })
      .where(and(eq(notifications.id, id), eq(notifications.userId, session.user.id)));

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to mark notification as read:", error);
    return {
      success: false,
      error: getFriendlyErrorMessage(error, "Failed to update notification."),
    };
  }
}

/**
 * Mark all notifications as read for logged in user
 */
export async function markAllNotificationsAsRead() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    await db
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.userId, session.user.id));

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to mark all notifications as read:", error);
    return {
      success: false,
      error: getFriendlyErrorMessage(error, "Failed to update notifications."),
    };
  }
}
