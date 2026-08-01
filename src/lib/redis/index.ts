import { Redis } from "@upstash/redis";

/**
 * Server-only Upstash Redis Client Singleton.
 * Gracefully handles missing environment variables without crashing the application.
 */
let redisClient: Redis | null = null;

export function getRedisClient(): Redis | null {
  if (redisClient) return redisClient;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[Redis] UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN missing. Rate limiting falling back to standard pass-through or local fallback."
      );
    }
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
    return null;
  }
}
