/**
 * Centralized Rate Limiting Configuration
 *
 * Defines request limits and time windows (in seconds) per action domain.
 * Referenced across API routes, server actions, and proxy middleware.
 */

export const RATE_LIMIT_CONFIG = {
  login: { limit: 5, windowSeconds: 60 },
  signup: { limit: 3, windowSeconds: 60 },
  image_upload: { limit: 20, windowSeconds: 60 },
  document_upload: { limit: 15, windowSeconds: 60 },
  password_reset: { limit: 3, windowSeconds: 60 },
  verification: { limit: 5, windowSeconds: 60 },
  public_api: { limit: 60, windowSeconds: 60 },
} as const;

export type RateLimitCategory = keyof typeof RATE_LIMIT_CONFIG;
