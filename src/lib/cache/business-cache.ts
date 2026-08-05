import { getRedisClient } from "@/lib/redis";
import { PublicBusinessQueryParams } from "@/types/public-business";
import { revalidatePath } from "next/cache";

const CACHE_PREFIX = "published:v1";
const FEED_KEYS_SET = `${CACHE_PREFIX}:feed_keys_index`;
const DEFAULT_TTL_SECONDS = 3600; // 1 hour

/**
 * Generate a deterministic Redis cache key for parameterized queries
 */
export function getFeedCacheKey(params?: PublicBusinessQueryParams): string {
  if (!params || Object.keys(params).length === 0) {
    return `${CACHE_PREFIX}:feed:default`;
  }

  const parts = [
    params.categorySlug ? `cat_${params.categorySlug}` : "",
    params.city ? `city_${params.city.toLowerCase().trim()}` : "",
    params.search ? `q_${params.search.toLowerCase().trim()}` : "",
    params.featuredOnly ? "feat_true" : "",
    params.sort ? `sort_${params.sort}` : "",
    params.page ? `p_${params.page}` : "p_1",
    params.limit ? `l_${params.limit}` : "l_12",
  ].filter(Boolean);

  return `${CACHE_PREFIX}:feed:${parts.join(":") || "all"}`;
}

/**
 * Generate a Redis cache key for single business detail page
 */
export function getSingleBusinessCacheKey(slug: string): string {
  return `${CACHE_PREFIX}:slug:${slug.toLowerCase().trim()}`;
}

/**
 * Read cached value from Redis (returns null if missing or error)
 */
export async function getCachedData<T>(key: string): Promise<T | null> {
  try {
    const redis = getRedisClient();
    if (!redis) return null;
    const cached = await redis.get<T>(key);
    return cached ?? null;
  } catch (error) {
    console.warn(`[Redis Cache Read Error] Key: ${key}`, error);
    return null; // Graceful degradation
  }
}

/**
 * Write value to Redis cache with TTL and index feed key
 */
export async function setCachedData<T>(
  key: string,
  data: T,
  ttlSeconds: number = DEFAULT_TTL_SECONDS
): Promise<void> {
  try {
    const redis = getRedisClient();
    if (!redis) return;

    await redis.set(key, data, { ex: ttlSeconds });

    // Track feed keys in set for wildcard invalidation
    if (key.includes(":feed:")) {
      await redis.sadd(FEED_KEYS_SET, key);
    }
  } catch (error) {
    console.warn(`[Redis Cache Write Error] Key: ${key}`, error);
  }
}

/**
 * Invalidate all published business caches (feeds + specific slug)
 * Executed whenever admin approves, rejects, edits, or deletes a business.
 */
export async function invalidateAllPublicBusinessCaches(options?: {
  businessId?: string;
  slug?: string;
}): Promise<void> {
  try {
    const redis = getRedisClient();
    if (redis) {
      const keysToDelete: string[] = [];

      // 1. Specific business slug cache key
      if (options?.slug) {
        keysToDelete.push(getSingleBusinessCacheKey(options.slug));
      }

      // 2. Fetch all registered feed keys from the index set
      const feedKeys = await redis.smembers<string[]>(FEED_KEYS_SET);
      if (Array.isArray(feedKeys) && feedKeys.length > 0) {
        keysToDelete.push(...feedKeys);
      }

      // 3. Include default fallback feed key
      keysToDelete.push(`${CACHE_PREFIX}:feed:default`);

      // 4. Batch delete
      if (keysToDelete.length > 0) {
        const uniqueKeys = Array.from(new Set(keysToDelete));
        await redis.del(...uniqueKeys);
      }

      // 5. Clear the index set itself
      await redis.del(FEED_KEYS_SET);
    }
  } catch (error) {
    console.error("[Redis Invalidation Error]", error);
  } finally {
    // 6. Next.js App Router Page Revalidations
    try {
      revalidatePath("/");
      revalidatePath("/business", "layout");
      if (options?.slug) {
        revalidatePath(`/business/${options.slug}`);
      }
    } catch {
      // Ignore revalidatePath outside request scope
    }
  }
}
