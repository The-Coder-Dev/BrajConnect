import { db } from "@/db";
import { business } from "@/db/schema";
import { eq, like, desc } from "drizzle-orm";
import { generateSlug } from "./generate-slug";

/**
 * Generates a unique slug by checking against the business table.
 */
export async function generateUniqueBusinessSlug(name: string): Promise<string> {
  const baseSlug = generateSlug(name);
  if (!baseSlug) return `business-${Date.now()}`;
  
  // Check exact match
  const existing = await db.select({ id: business.id }).from(business).where(eq(business.slug, baseSlug));
  
  if (existing.length === 0) {
    return baseSlug;
  }

  // If exists, find the highest numbered suffix
  const similarSlugs = await db
    .select({ slug: business.slug })
    .from(business)
    .where(like(business.slug, `${baseSlug}-%`))
    .orderBy(desc(business.slug));

  let maxSuffix = 1;
  
  for (const row of similarSlugs) {
    const match = row.slug.match(new RegExp(`^${baseSlug}-(\\d+)$`));
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxSuffix) {
        maxSuffix = num;
      }
    }
  }

  return `${baseSlug}-${maxSuffix + 1}`;
}
