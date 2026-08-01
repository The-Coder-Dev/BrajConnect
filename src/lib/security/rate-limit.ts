import { Ratelimit } from "@upstash/ratelimit";
import { getRedisClient } from "@/lib/redis";

// In-memory fallback map for environments without Upstash Redis credentials configured
const memoryStore = new Map<string, { count: number; expiresAt: number }>();

function checkMemoryRateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): { success: boolean; remaining: number; reset: number } {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const entry = memoryStore.get(key);

  if (!entry || now > entry.expiresAt) {
    memoryStore.set(key, { count: 1, expiresAt: now + windowMs });
    return { success: true, remaining: limit - 1, reset: Math.ceil((now + windowMs) / 1000) };
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0, reset: Math.ceil(entry.expiresAt / 1000) };
  }

  entry.count += 1;
  return { success: true, remaining: limit - entry.count, reset: Math.ceil(entry.expiresAt / 1000) };
}

// Pre-configured rate limiters per action domain
const limiterInstances = new Map<string, Ratelimit>();

function getUpstashLimiter(requests: number, windowSeconds: number): Ratelimit | null {
  const redis = getRedisClient();
  if (!redis) return null;

  const key = `${requests}_${windowSeconds}`;
  if (limiterInstances.has(key)) {
    return limiterInstances.get(key)!;
  }

  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, `${windowSeconds} s`),
    analytics: true,
    prefix: "brajconnect:ratelimit",
  });

  limiterInstances.set(key, limiter);
  return limiter;
}

export interface RateLimitOptions {
  identifier: string;
  action?: string;
  limit?: number; // default: 10
  windowSeconds?: number; // default: 60
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  error?: string;
}

/**
 * Production-grade rate limiter powered by Upstash Redis with zero-downtime memory fallback.
 */
export async function enforceRateLimit(options: RateLimitOptions): Promise<RateLimitResult> {
  const { identifier, action = "general", limit = 10, windowSeconds = 60 } = options;
  const key = `${action}:${identifier}`;

  try {
    const upstashLimiter = getUpstashLimiter(limit, windowSeconds);

    if (upstashLimiter) {
      const result = await upstashLimiter.limit(key);
      return {
        success: result.success,
        limit: result.limit,
        remaining: result.remaining,
        reset: result.reset,
        error: result.success ? undefined : "Too many requests. Please try again later.",
      };
    }
  } catch (error) {
    console.error("[RateLimit] Upstash Redis rate limit check failed, using fallback:", error);
  }

  // Fallback to in-memory sliding window
  const memResult = checkMemoryRateLimit(key, limit, windowSeconds);
  return {
    success: memResult.success,
    limit,
    remaining: memResult.remaining,
    reset: memResult.reset,
    error: memResult.success ? undefined : "Too many requests. Please try again later.",
  };
}

/**
 * Extracts a unique rate-limit key (IP address or fallback identifier) from incoming Request headers.
 */
export function getClientIdentifier(request: Request, userOrSessionId?: string): string {
  if (userOrSessionId && userOrSessionId.trim() !== "") {
    return `user_${userOrSessionId}`;
  }

  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const ips = forwarded.split(",");
    if (ips[0] && ips[0].trim() !== "") {
      return `ip_${ips[0].trim()}`;
    }
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp && realIp.trim() !== "") {
    return `ip_${realIp.trim()}`;
  }

  return "anonymous_client";
}
