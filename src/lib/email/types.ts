export type BusinessEmailEvent =
  | "BUSINESS_SUBMITTED"
  | "BUSINESS_APPROVED"
  | "BUSINESS_REJECTED"
  | "BUSINESS_RESUBMITTED";

export interface SendBusinessStatusEmailParams {
  type: BusinessEmailEvent;
  businessId: string;
  businessName?: string;
  businessSlug?: string;
  rejectionReason?: string;
  recipientEmail?: string;
  recipientName?: string;
  userId?: string;
}

export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}
