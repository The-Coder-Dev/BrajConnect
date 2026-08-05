"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { db } from "@/db";
import { businessLeads, business, notifications, businessAnalytics } from "@/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getFriendlyErrorMessage } from "@/lib/utils";
import { randomUUID } from "crypto";
import { revalidatePath, revalidateTag } from "next/cache";

export type LeadStatus = "new" | "contacted" | "qualified" | "closed" | "archived";

export interface CreateLeadInput {
  businessId: string;
  visitorName: string;
  email: string;
  phone: string;
  preferredContact?: string;
  subject?: string;
  message: string;
}

/**
 * Ensure database tables exist dynamically (Idempotent Guard)
 */
async function ensureLeadTablesExist() {
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS business_leads (
        id TEXT PRIMARY KEY,
        "businessId" TEXT NOT NULL REFERENCES business(id) ON DELETE CASCADE,
        "ownerId" TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
        "visitorName" TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        "preferredContact" TEXT DEFAULT 'phone',
        subject TEXT,
        message TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'new',
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY,
        "userId" TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
        "businessId" TEXT REFERENCES business(id) ON DELETE CASCADE,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        link TEXT,
        read BOOLEAN NOT NULL DEFAULT FALSE,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS business_analytics (
        id TEXT PRIMARY KEY,
        "businessId" TEXT NOT NULL UNIQUE REFERENCES business(id) ON DELETE CASCADE,
        "profileViews" INTEGER NOT NULL DEFAULT 0,
        "phoneClicks" INTEGER NOT NULL DEFAULT 0,
        "whatsappClicks" INTEGER NOT NULL DEFAULT 0,
        "websiteClicks" INTEGER NOT NULL DEFAULT 0,
        "directionClicks" INTEGER NOT NULL DEFAULT 0,
        "shareCount" INTEGER NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
  } catch (err) {
    console.warn("[Lead Creation] Table auto-provisioning SQL check warning:", err);
  }
}

/**
 * Public action: Create a new business lead (e.g. from business page contact form)
 */
export async function createBusinessLead(input: CreateLeadInput) {
  try {
    console.log(`[Lead Created] Processing inquiry for businessId: ${input.businessId}, Visitor: ${input.visitorName}`);

    if (!input.businessId || !input.visitorName || !input.email || !input.phone || !input.message) {
      return { success: false, error: "Please fill in all required fields." };
    }

    // Auto-provision tables if missing
    await ensureLeadTablesExist();

    const biz = await db.query.business.findFirst({
      where: eq(business.id, input.businessId),
      columns: { id: true, name: true, ownerId: true },
    });

    if (!biz) {
      console.warn(`[Lead Created] Target businessId ${input.businessId} not found`);
      return { success: false, error: "Target business not found." };
    }

    const leadId = `lead_${randomUUID().replace(/-/g, "").substring(0, 16)}`;

    // 1. Insert into business_leads
    await db.insert(businessLeads).values({
      id: leadId,
      businessId: biz.id,
      ownerId: biz.ownerId,
      visitorName: input.visitorName.trim(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone.trim(),
      preferredContact: input.preferredContact || "phone",
      subject: input.subject?.trim() || `Inquiry for ${biz.name}`,
      message: input.message.trim(),
      status: "new",
    });

    console.log(`[Lead Created] Lead ID "${leadId}" inserted into PostgreSQL for Business "${biz.name}" (Owner: ${biz.ownerId})`);

    // 2. Create in-app notification for the business owner
    try {
      await db.insert(notifications).values({
        id: `notif_${randomUUID().replace(/-/g, "").substring(0, 16)}`,
        userId: biz.ownerId,
        businessId: biz.id,
        type: "lead_received",
        title: "New Business Lead Received",
        message: `${input.visitorName} submitted an inquiry for "${biz.name}".`,
        link: "/dashboard",
        read: false,
      });
      console.log(`[Lead Created] In-app notification created for Owner ID: ${biz.ownerId}`);
    } catch (notifErr) {
      console.warn("[Lead Created] Could not insert notification:", notifErr);
    }

    // 3. Cache Invalidation & Revalidation
    try {
      revalidatePath("/dashboard");
      revalidatePath("/", "layout");
      console.log(`[Lead Created] Dashboard cache invalidated for business ${biz.id}`);
    } catch (revalErr) {
      console.warn("[Lead Created] Cache revalidation error:", revalErr);
    }

    return { success: true, leadId };
  } catch (error: any) {
    console.error("[Lead Created] Fatal error during lead creation:", error);
    return {
      success: false,
      error: getFriendlyErrorMessage(error, "Failed to submit lead inquiry."),
    };
  }
}

/**
 * Owner action: Get all leads for a specific business
 */
export async function getBusinessLeads(businessId: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    await ensureLeadTablesExist();

    const leads = await db.query.businessLeads.findMany({
      where: and(
        eq(businessLeads.businessId, businessId),
        eq(businessLeads.ownerId, session.user.id)
      ),
      orderBy: [desc(businessLeads.createdAt)],
    });

    return { success: true, data: leads };
  } catch (error: any) {
    console.error("Failed to fetch business leads:", error);
    return {
      success: false,
      error: getFriendlyErrorMessage(error, "Unable to load leads."),
    };
  }
}

/**
 * Owner action: Update lead status
 */
export async function updateLeadStatus(leadId: string, status: LeadStatus) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    await ensureLeadTablesExist();

    const lead = await db.query.businessLeads.findFirst({
      where: and(
        eq(businessLeads.id, leadId),
        eq(businessLeads.ownerId, session.user.id)
      ),
    });

    if (!lead) {
      return { success: false, error: "Lead not found or unauthorized." };
    }

    await db
      .update(businessLeads)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(businessLeads.id, leadId));

    revalidatePath("/dashboard");

    return { success: true };
  } catch (error: any) {
    console.error(`Failed to update lead ${leadId} status:`, error);
    return {
      success: false,
      error: getFriendlyErrorMessage(error, "Failed to update lead status."),
    };
  }
}
