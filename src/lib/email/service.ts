import { db } from "@/db";
import { business } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getResendClient, getEmailSender } from "./client";
import { recordEmailLog } from "./log";
import { SendBusinessStatusEmailParams, EmailSendResult } from "./types";
import { renderBusinessSubmittedEmail } from "./templates/business-submitted";
import { renderBusinessApprovedEmail } from "./templates/business-approved";
import { renderBusinessRejectedEmail } from "./templates/business-rejected";
import { renderBusinessResubmittedEmail } from "./templates/business-resubmitted";

/**
 * Centralized service to send business lifecycle status emails.
 * 
 * Safety Guarantees:
 * - Never throws unhandled errors (isolated try/catch).
 * - Always resolves owner email server-side from the database relationship.
 * - Records email outcome in the `email_logs` table.
 * - Resend failure never impacts business lifecycle state transitions.
 */
export async function sendBusinessStatusEmail(
  params: SendBusinessStatusEmailParams
): Promise<EmailSendResult> {
  try {
    if (!params.businessId) {
      console.warn("[Email Service] Missing businessId parameter.");
      return { success: false, error: "Missing businessId parameter." };
    }

    let recipientEmail = params.recipientEmail;
    let recipientName = params.recipientName;
    let businessName = params.businessName;
    let businessSlug = params.businessSlug;
    let userId = params.userId;

    // Resolve missing business or owner information from DB
    if (!recipientEmail || !recipientName || !businessName || (params.type === "BUSINESS_APPROVED" && !businessSlug)) {
      const biz = await db.query.business.findFirst({
        where: eq(business.id, params.businessId),
        with: {
          owner: {
            columns: { id: true, name: true, email: true },
          },
        },
      });

      if (!biz) {
        console.warn(`[Email Service] Business "${params.businessId}" not found in database.`);
        return { success: false, error: "Business not found." };
      }

      businessName = businessName || biz.name;
      businessSlug = businessSlug || biz.slug;

      if (biz.owner) {
        recipientEmail = recipientEmail || biz.owner.email;
        recipientName = recipientName || biz.owner.name;
        userId = userId || biz.owner.id;
      }
    }

    // Validate recipient email address
    if (!recipientEmail || !recipientEmail.includes("@")) {
      const errorMsg = `No valid owner email address found for business "${params.businessId}".`;
      console.warn(`[Email Service] ${errorMsg}`);
      await recordEmailLog({
        userId,
        businessId: params.businessId,
        recipientEmail: recipientEmail || "unresolved@owner",
        event: params.type,
        status: "failed",
        error: errorMsg,
      });
      return { success: false, error: errorMsg };
    }

    const safeOwnerName = recipientName?.trim() || "Business Owner";
    const safeBusinessName = businessName?.trim() || "Your Business";

    // Render appropriate email template based on lifecycle event
    let subject = "";
    let html = "";

    switch (params.type) {
      case "BUSINESS_SUBMITTED": {
        const rendered = renderBusinessSubmittedEmail({
          ownerName: safeOwnerName,
          businessName: safeBusinessName,
        });
        subject = rendered.subject;
        html = rendered.html;
        break;
      }
      case "BUSINESS_APPROVED": {
        const rendered = renderBusinessApprovedEmail({
          ownerName: safeOwnerName,
          businessName: safeBusinessName,
          businessSlug: businessSlug || "",
        });
        subject = rendered.subject;
        html = rendered.html;
        break;
      }
      case "BUSINESS_REJECTED": {
        const rendered = renderBusinessRejectedEmail({
          ownerName: safeOwnerName,
          businessName: safeBusinessName,
          businessId: params.businessId,
          rejectionReason: params.rejectionReason?.trim() || "The submitted details could not be verified.",
        });
        subject = rendered.subject;
        html = rendered.html;
        break;
      }
      case "BUSINESS_RESUBMITTED": {
        const rendered = renderBusinessResubmittedEmail({
          ownerName: safeOwnerName,
          businessName: safeBusinessName,
        });
        subject = rendered.subject;
        html = rendered.html;
        break;
      }
      default: {
        const exhaustiveCheck: never = params.type;
        console.error(`[Email Service] Unsupported email event: ${exhaustiveCheck}`);
        return { success: false, error: `Unsupported email event: ${params.type}` };
      }
    }

    const resend = getResendClient();
    const from = getEmailSender();

    if (!resend) {
      const errorMsg = "Resend client not configured (missing or invalid RESEND_API_KEY).";
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[Email Service] [DEV SIMULATION] ${params.type} email would be sent to ${recipientEmail} with subject: "${subject}"`);
        await recordEmailLog({
          userId,
          businessId: params.businessId,
          recipientEmail,
          event: params.type,
          status: "sent",
          providerMessageId: "dev_mock_id",
          error: null,
        });
        return { success: true, messageId: "dev_mock_id" };
      }

      await recordEmailLog({
        userId,
        businessId: params.businessId,
        recipientEmail,
        event: params.type,
        status: "failed",
        error: errorMsg,
      });
      return { success: false, error: errorMsg };
    }

    // Dispatch transactional email via Resend
    const { data, error } = await resend.emails.send({
      from,
      to: recipientEmail,
      subject,
      html,
    });

    if (error) {
      const errorMsg = error.message || JSON.stringify(error);
      console.error(`[Email Service] Resend dispatch failed for [${params.type}] to ${recipientEmail}:`, error);
      await recordEmailLog({
        userId,
        businessId: params.businessId,
        recipientEmail,
        event: params.type,
        status: "failed",
        error: errorMsg,
      });
      return { success: false, error: errorMsg };
    }

    const providerMessageId = data?.id || undefined;
    console.log(`[Email Service] Successfully sent [${params.type}] to ${recipientEmail} (ID: ${providerMessageId})`);

    await recordEmailLog({
      userId,
      businessId: params.businessId,
      recipientEmail,
      event: params.type,
      status: "sent",
      providerMessageId,
      error: null,
    });

    return { success: true, messageId: providerMessageId };
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error in sendBusinessStatusEmail";
    console.error("[Email Service] Unhandled error sending business status email:", error);
    return { success: false, error: errorMsg };
  }
}
