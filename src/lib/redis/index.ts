import { Redis } from "@upstash/redis";

/**
 * Server-only Upstash Redis Client Singleton.
 *
 * Task 1 Hardening:
 * - Development: Returns null if credentials missing, allowing memory fallback.
 * - Production: Throws a server error if credentials missing (fail fast).
 */
let redisClient: Redis | null = null;

export function getRedisClient(): Redis | null {
  if (redisClient) return redisClient;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  const isProd = process.env.NODE_ENV === "production";

  if (!url || !token) {
    if (isProd) {
      const errorMsg =
        "[Redis Error] UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be configured in production environment.";
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    console.warn(
      "[Redis] Missing Upstash credentials in development mode. Falling back to local in-memory rate limiter."
    );
    return null;
  }

  try {
    redisClient = new Redis({
      url,
      token,
    });
    return redisClient;
  } catch (error) {
    console.error("[Redis] Failed to initialize Redis client:", error);
    if (isProd) {
      throw new Error("[Redis Error] Failed to initialize Redis client in production.");
    }
    return null;
  }
}
