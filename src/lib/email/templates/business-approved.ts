import { renderBaseTemplate, escapeHtml } from "./base";
import { getAppUrl } from "../client";

export interface BusinessApprovedEmailProps {
  ownerName: string;
  businessName: string;
  businessSlug: string;
}

export function renderBusinessApprovedEmail(props: BusinessApprovedEmailProps): {
  subject: string;
  html: string;
} {
  const appUrl = getAppUrl();
  const businessPublicUrl = `${appUrl}/business/${encodeURIComponent(props.businessSlug)}`;
  const dashboardUrl = `${appUrl}/dashboard`;
  const subject = "Your business is now live on BachatLal";
  const previewText = `Great news! "${props.businessName}" is now live and published on BachatLal.`;

  const content = `
    <h1 style="margin: 0 0 16px; font-size: 20px; font-weight: 700; color: #0f172a; line-height: 1.3;">
      Your Business is Live! 🎉
    </h1>

    <p style="margin: 0 0 16px; font-size: 15px; color: #334155;">
      Hi <strong>${escapeHtml(props.ownerName)}</strong>,
    </p>

    <p style="margin: 0 0 16px; font-size: 15px; color: #334155;">
      Great news! Your business listing for <strong>${escapeHtml(props.businessName)}</strong> has been approved and is now live on BachatLal.
    </p>

    <!-- Status Box -->
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 0 0 24px; background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 10px; padding: 14px 18px;">
      <tr>
        <td>
          <span style="display: inline-block; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #065f46; margin-bottom: 4px;">
            Listing Status
          </span>
          <div style="font-size: 15px; font-weight: 600; color: #047857;">
            Live on BachatLal
          </div>
        </td>
      </tr>
    </table>

    <p style="margin: 0 0 24px; font-size: 14px; color: #475569; line-height: 1.6;">
      Customers across the Braj region can now discover, contact, and explore your business services directly on BachatLal.
    </p>

    <!-- Primary and Secondary CTAs -->
    <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin: 28px 0 16px;">
      <tr>
        <td align="center" style="border-radius: 8px; background-color: #e11d48;">
          <a href="${businessPublicUrl}" target="_blank" class="btn-primary" style="display: inline-block; padding: 12px 24px; font-size: 14px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 8px; background-color: #e11d48; border: 1px solid #e11d48;">
            View Your Business &rarr;
          </a>
        </td>
      </tr>
    </table>

    <p style="margin: 0 0 24px; font-size: 13px; color: #64748b;">
      Need to manage hours, photos, or updates? <a href="${dashboardUrl}" style="color: #e11d48; font-weight: 600; text-decoration: underline;">Open Business Dashboard</a>
    </p>

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
