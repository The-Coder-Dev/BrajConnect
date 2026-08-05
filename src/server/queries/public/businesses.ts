import { db } from "@/db";
import { business, location, businessCategory, category } from "@/db/schema";
import { eq, and, isNull, ilike, or, desc, asc, count } from "drizzle-orm";
import {
  PublicBusinessCardDTO,
  PublicBusinessDetailsDTO,
  PublicBusinessQueryParams,
  PaginatedResponse,
} from "@/types/public-business";
import {
  toPublicBusinessCardDTO,
  toPublicBusinessDetailsDTO,
} from "@/lib/dto/public-business";
import {
  getFeedCacheKey,
  getSingleBusinessCacheKey,
  getCachedData,
  setCachedData,
} from "@/lib/cache/business-cache";

/**
 * Reusable Drizzle Query Relations configuration for Public Cards
 */
const publicCardWithRelations = {
  owner: {
    columns: { id: true, name: true, email: true, image: true },
  },
  location: true,
  businessCategories: {
    with: {
      category: true,
    },
  },
} as const;

/**
 * Reusable Drizzle Query Relations configuration for Full Details Page
 */
const publicDetailsWithRelations = {
  owner: {
    columns: { id: true, name: true, email: true, image: true },
  },
  location: true,
  contact: true,
  hours: true,
  socials: true,
  gallery: true,
  services: true,
  businessCategories: {
    with: {
      category: true,
    },
  },
  businessAmenities: {
    with: {
      amenity: true,
    },
  },
} as const;

/**
 * Fetch published businesses with filtering, searching, pagination, and caching
 */
export async function getPublicBusinesses(
  params: PublicBusinessQueryParams = {}
): Promise<PaginatedResponse<PublicBusinessCardDTO>> {
  const cacheKey = getFeedCacheKey(params);

  // 1. Try reading from Upstash Redis cache
  const cachedResponse = await getCachedData<PaginatedResponse<PublicBusinessCardDTO>>(cacheKey);
  if (cachedResponse) {
    return cachedResponse;
  }

  // 2. Build security & filter conditions
  const conditions = [
    eq(business.status, "published"),
    isNull(business.deletedAt),
  ];

  // Category Filter
  if (params.categorySlug && params.categorySlug.trim() !== "" && params.categorySlug !== "all") {
    const categoryRecord = await db.query.category.findFirst({
      where: eq(category.slug, params.categorySlug.trim()),
      columns: { id: true },
    });

    if (categoryRecord) {
      const bizCatRows = await db
        .select({ businessId: businessCategory.businessId })
        .from(businessCategory)
        .where(eq(businessCategory.categoryId, categoryRecord.id));

      const bizIds = bizCatRows.map((r) => r.businessId);
      if (bizIds.length > 0) {
        conditions.push(or(...bizIds.map((id) => eq(business.id, id)))!);
      } else {
        return {
          items: [],
          pagination: { page: 1, limit: params.limit || 12, total: 0, totalPages: 0 },
        };
      }
    }
  }

  // City Filter
  if (params.city && params.city.trim() !== "" && params.city !== "all") {
    const locRows = await db
      .select({ businessId: location.businessId })
      .from(location)
      .where(ilike(location.city, `%${params.city.trim()}%`));

    const locBizIds = locRows.map((r) => r.businessId);
    if (locBizIds.length > 0) {
      conditions.push(or(...locBizIds.map((id) => eq(business.id, id)))!);
    } else {
      return {
        items: [],
        pagination: { page: 1, limit: params.limit || 12, total: 0, totalPages: 0 },
      };
    }
  }

  // Search Filter
  if (params.search && params.search.trim() !== "") {
    const searchPattern = `%${params.search.trim()}%`;
    conditions.push(
      or(
        ilike(business.name, searchPattern),
        ilike(business.shortDescription, searchPattern)
      )!
    );
  }

  // Featured Only Filter
  if (params.featuredOnly) {
    conditions.push(eq(business.featured, true));
  }

  const whereClause = and(...conditions);

  // Sorting logic
  let orderBy = [desc(business.createdAt)];
  if (params.sort === "featured") {
    orderBy = [desc(business.featured), desc(business.createdAt)];
  } else if (params.sort === "alphabetical") {
    orderBy = [asc(business.name)];
  }

  const page = Math.max(1, params.page || 1);
  const limit = Math.max(1, Math.min(50, params.limit || 12));
  const offset = (page - 1) * limit;

  // 3. Query Database
  const [totalCountRes, rawBusinesses] = await Promise.all([
    db.select({ value: count() }).from(business).where(whereClause),
    db.query.business.findMany({
      where: whereClause,
      orderBy,
      limit,
      offset,
      with: publicCardWithRelations,
    }),
  ]);

  const total = totalCountRes[0]?.value || 0;
  const totalPages = Math.ceil(total / limit);

  // 4. Transform to DTO
  const items = rawBusinesses.map(toPublicBusinessCardDTO);

  const response: PaginatedResponse<PublicBusinessCardDTO> = {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };

  // 5. Save to Redis Cache
  await setCachedData(cacheKey, response);

  return response;
}

/**
 * Fetch published business details by slug with caching & security guards
 */
export async function getPublishedBusinessBySlug(
  slug: string
): Promise<PublicBusinessDetailsDTO | null> {
  if (!slug || slug.trim() === "") return null;

  const normalizedSlug = slug.toLowerCase().trim();
  const cacheKey = getSingleBusinessCacheKey(normalizedSlug);

  // 1. Check Redis Cache
  const cachedBusiness = await getCachedData<PublicBusinessDetailsDTO>(cacheKey);
  if (cachedBusiness) {
    return cachedBusiness;
  }

  // 2. Fetch single business from DB (strict published check)
  const rawBusiness = await db.query.business.findFirst({
    where: and(
      eq(business.slug, normalizedSlug),
      eq(business.status, "published"),
      isNull(business.deletedAt)
    ),
    with: publicDetailsWithRelations,
  });

  if (!rawBusiness) {
    return null;
  }

  // 3. Fetch up to 3 related published businesses in parallel
  const relatedRaw = await db.query.business.findMany({
    where: and(
      eq(business.status, "published"),
      isNull(business.deletedAt)
    ),
    orderBy: [desc(business.createdAt)],
    limit: 3,
    with: publicCardWithRelations,
  });

  const filteredRelated = relatedRaw.filter((b) => b.id !== rawBusiness.id);

  // 4. Transform to DTO
  const detailsDTO = toPublicBusinessDetailsDTO(rawBusiness, filteredRelated);

  // 5. Cache response in Redis
  await setCachedData(cacheKey, detailsDTO);

  return detailsDTO;
}
