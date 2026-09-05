export const USER_ROLES = [
  "visitor",
  "business_owner",
  "franchise_partner",
  "admin",
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const DEFAULT_USER_ROLE: UserRole = "visitor";
