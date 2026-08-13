import { renderBaseTemplate, escapeHtml } from "./base";
import { getAppUrl } from "../client";

export interface BusinessSubmittedEmailProps {
  ownerName: string;
  businessName: string;
}

export function renderBusinessSubmittedEmail(props: BusinessSubmittedEmailProps): {
  subject: string;
  html: string;
} {
  const appUrl = getAppUrl();
  const dashboardUrl = `${appUrl}/dashboard`;
  const subject = "Your business has been submitted to BachatLal";
  const previewText = `Your business listing for "${props.businessName}" is now pending review on BachatLal.`;

  const content = `
    <h1 style="margin: 0 0 16px; font-size: 20px; font-weight: 700; color: #0f172a; line-height: 1.3;">
      Business Submission Received
    </h1>

    <p style="margin: 0 0 16px; font-size: 15px; color: #334155;">
      Hi <strong>${escapeHtml(props.ownerName)}</strong>,
    </p>

    <p style="margin: 0 0 20px; font-size: 15px; color: #334155;">
      We've received your business listing for <strong>${escapeHtml(props.businessName)}</strong>.
    </p>

    <!-- Status Box -->
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 0 0 24px; background-color: #fef3c7; border: 1px solid #fde68a; border-radius: 10px; padding: 14px 18px;">
      <tr>
        <td>
          <span style="display: inline-block; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #92400e; margin-bottom: 4px;">
            Listing Status
          </span>
          <div style="font-size: 15px; font-weight: 600; color: #78350f;">
            Pending Review
          </div>
        </td>
      </tr>
    </table>

    <p style="margin: 0 0 20px; font-size: 14px; color: #475569; line-height: 1.6;">
      Your listing has been successfully submitted and is now under review by the BachatLal moderation team. Our team will review your listing and notify you by email once the review is complete.
    </p>

    <!-- Primary CTA Button -->
    <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin: 28px 0 24px;">
      <tr>
        <td align="center" style="border-radius: 8px; background-color: #e11d48;">
          <a href="${dashboardUrl}" target="_blank" class="btn-primary" style="display: inline-block; padding: 12px 24px; font-size: 14px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 8px; background-color: #e11d48; border: 1px solid #e11d48;">
            View Business Dashboard &rarr;
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
