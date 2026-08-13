import { renderBaseTemplate, escapeHtml } from "./base";
import { getAppUrl } from "../client";

export interface BusinessRejectedEmailProps {
  ownerName: string;
  businessName: string;
  businessId: string;
  rejectionReason: string;
}

export function renderBusinessRejectedEmail(props: BusinessRejectedEmailProps): {
  subject: string;
  html: string;
} {
  const appUrl = getAppUrl();
  const reviewUrl = `${appUrl}/dashboard/businesses/${encodeURIComponent(props.businessId)}`;
  const subject = "Action required: Your BachatLal business listing";
  const previewText = `Action required regarding your business listing for "${props.businessName}" on BachatLal.`;

  const content = `
    <h1 style="margin: 0 0 16px; font-size: 20px; font-weight: 700; color: #0f172a; line-height: 1.3;">
      Action Required on Your Listing
    </h1>

    <p style="margin: 0 0 16px; font-size: 15px; color: #334155;">
      Hi <strong>${escapeHtml(props.ownerName)}</strong>,
    </p>

    <p style="margin: 0 0 20px; font-size: 15px; color: #334155;">
      We've reviewed your business listing for <strong>${escapeHtml(props.businessName)}</strong>. Unfortunately, we're unable to approve your listing at this time.
    </p>

    <!-- Rejection Reason Card -->
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 0 0 24px; background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; padding: 16px 18px;">
      <tr>
        <td>
          <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #991b1b; margin-bottom: 6px;">
            Feedback from Moderation Team
          </div>
          <div style="font-size: 14px; color: #7f1d1d; line-height: 1.5; white-space: pre-wrap;">
            ${escapeHtml(props.rejectionReason)}
          </div>
        </td>
      </tr>
    </table>

    <p style="margin: 0 0 24px; font-size: 14px; color: #475569; line-height: 1.6;">
      Please review the feedback above, update your business details or documents in your dashboard, and resubmit your listing for review.
    </p>

    <!-- Primary CTA Button -->
    <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin: 28px 0 24px;">
      <tr>
        <td align="center" style="border-radius: 8px; background-color: #e11d48;">
          <a href="${reviewUrl}" target="_blank" class="btn-primary" style="display: inline-block; padding: 12px 24px; font-size: 14px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 8px; background-color: #e11d48; border: 1px solid #e11d48;">
            Review &amp; Edit Listing &rarr;
          </a>
        </td>
      </tr>
    </table>

    <p style="margin: 24px 0 0; font-size: 14px; color: #475569;">
      Thanks,<br />
      <strong>The BachatLal Team</strong>
    </p>
  `;

  const html = renderBaseTemplate({
    title: subject,
    previewText,
    content,
  });

  return { subject, html };
}
