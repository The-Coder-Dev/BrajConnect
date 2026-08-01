/**
 * Business Workflow & State Transition Security Utility
 *
 * Enforces Task 8: Validates legal state transitions for business status.
 * Reuses businessStatusEnum values:
 * draft | pending_review | needs_changes | published | rejected | suspended | archived
 */

export type BusinessStatus =
  | "draft"
  | "pending_review"
  | "needs_changes"
  | "published"
  | "rejected"
  | "suspended"
  | "archived";

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
  if (currentStatus === targetStatus) return true; // No change

  const current = currentStatus as BusinessStatus;
  const target = targetStatus as BusinessStatus;

  const allowedTargets = ALLOWED_TRANSITIONS[current];
  if (!allowedTargets) {
    return false;
  }

  return allowedTargets.has(target);
}
