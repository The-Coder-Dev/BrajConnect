"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { db } from "@/db";
import { activityLogs } from "@/db/schema";
import { sql } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface LogActivityParams {
  businessId?: string;
  userId?: string;
  type: string;
  title: string;
  description: string;
  metadata?: any;
}

export async function logBusinessActivity(params: LogActivityParams) {
  try {
    // Ensure table exists idempotently
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id TEXT PRIMARY KEY,
        "businessId" TEXT REFERENCES business(id) ON DELETE CASCADE,
        "userId" TEXT REFERENCES user(id) ON DELETE CASCADE,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        metadata JSONB,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    const logId = `act_${randomUUID().replace(/-/g, "").substring(0, 16)}`;

    await db.insert(activityLogs).values({
      id: logId,
      businessId: params.businessId || null,
      userId: params.userId || null,
      type: params.type,
      title: params.title.trim(),
      description: params.description.trim(),
      metadata: params.metadata || null,
    });

    console.log(`[Activity Logged] ID: ${logId}, Type: ${params.type}, Business: ${params.businessId || 'N/A'}`);
    return { success: true, logId };
  } catch (err) {
    console.warn("[Activity Logged] Failed to write activity log:", err);
    return { success: false };
  }
}
