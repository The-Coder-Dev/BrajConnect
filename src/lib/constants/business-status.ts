export const BUSINESS_STATUS = {
  DRAFT: "draft",
  PENDING_REVIEW: "pending_review",
  PUBLISHED: "published",
  REJECTED: "rejected",
  SUSPENDED: "suspended",
} as const;

export type BusinessStatus = typeof BUSINESS_STATUS[keyof typeof BUSINESS_STATUS];
