import { businessStatusEnum } from "@/db/schema";

/**
 * Business Workflow & State Transition Security Utility
 *
 * Task 4: Reuses businessStatusEnum values from Drizzle DB schema for full type safety.
 */
export type BusinessStatus = (typeof businessStatusEnum.enumValues)[number];

const ALLOWED_TRANSITIONS: Record<BusinessStatus, Set<BusinessStatus>> = {
  draft: new Set(["pending_review", "archived"]),
  pending_review: new Set(["published", "rejected", "needs_changes", "draft"]),
  needs_changes: new Set(["pending_review", "draft", "archived"]),
  rejected: new Set(["pending_review", "draft", "archived"]),
  published: new Set(["suspended", "archived", "needs_changes"]),
  suspended: new Set(["published", "draft", "archived"]),
  archived: new Set(["draft"]),
};

/**
 * Validates if transitioning from currentStatus to targetStatus is legally allowed.
 */
export function isValidStatusTransition(
  currentStatus: string,
  targetStatus: string
): boolean {
  if (currentStatus === targetStatus) return true;

  const current = currentStatus as BusinessStatus;
  const target = targetStatus as BusinessStatus;

  const allowedTargets = ALLOWED_TRANSITIONS[current];
  if (!allowedTargets) {
    return false;
  }

  return allowedTargets.has(target);
}
