import { getAppUrl } from "../client";

export interface BaseEmailOptions {
  title: string;
  previewText: string;
  content: string;
}

/**
 * Base responsive HTML email template for BachatLal notifications.
 * Uses inline styles and standard system font stacks for maximum email client compatibility.
 */
export function renderBaseTemplate(options: BaseEmailOptions): string {
  const appUrl = getAppUrl();
  const logoUrl = `${appUrl}/logo.webp`;
  const currentYear = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${escapeHtml(options.title)}</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
  </style>
  <![endif]-->
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
      background-color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
    }
    table {
      border-spacing: 0;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    td {
      padding: 0;
    }
    img {
      border: 0;
      -ms-interpolation-mode: bicubic;
    }
    .btn-primary:hover {
      background-color: #be123c !important;
    }
    @media only screen and (max-width: 600px) {
      .container-table {
        width: 100% !important;
        max-width: 100% !important;
      }
      .content-padding {
        padding: 24px 20px !important;
      }
      .header-padding {
        padding: 24px 20px 16px !important;
      }
      .btn-primary {
        display: block !important;
        width: auto !important;
        text-align: center !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; color: #1e293b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <!-- Preview Text -->
  <div style="display: none; font-size: 1px; color: #f8fafc; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    ${escapeHtml(options.previewText)}
  </div>

  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 32px 12px 48px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" class="container-table" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);">
          
          <!-- Header with BachatLal Logo -->
          <tr>
            <td class="header-padding" style="padding: 32px 32px 20px; border-bottom: 1px solid #f1f5f9; text-align: left;">
              <a href="${appUrl}" target="_blank" style="text-decoration: none; display: inline-block;">
                <img src="${logoUrl}" alt="BachatLal" width="130" height="auto" style="max-height: 44px; width: auto; display: block; border: 0;" />
              </a>
            </td>
          </tr>

          <!-- Main Body Content -->
          <tr>
            <td class="content-padding" style="padding: 32px 32px 28px; text-align: left; font-size: 15px; line-height: 1.6; color: #334155;">
              ${options.content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: left; font-size: 12px; line-height: 1.5; color: #64748b;">
              <p style="margin: 0 0 8px; font-weight: 600; color: #475569;">
                BachatLal
              </p>
              <p style="margin: 0 0 12px;">
                The trusted local business discovery platform for the Braj region.
              </p>
              <p style="margin: 0 0 16px; font-size: 11px; color: #94a3b8;">
                You received this transactional notification because your account is registered as a business owner on BachatLal.
              </p>
              <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                &copy; ${currentYear} BachatLal. All rights reserved. &bull; <a href="${appUrl}" style="color: #64748b; text-decoration: underline;">bachatlal.in</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Escapes HTML characters for safe rendering.
 */
export function escapeHtml(str?: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
