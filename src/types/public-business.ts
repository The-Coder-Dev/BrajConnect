/**
 * Public Business Domain DTOs & Types
 * Optimized for scalability, search, filtering, and subscription growth.
 */

export interface PublicBusinessCategory {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
}

export interface PublicBusinessLocation {
  address?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  formattedAddress: string;
  latitude?: number | null;
  longitude?: number | null;
}

export interface PublicBusinessRating {
  average: number;
  count: number;
}

export interface PublicBusinessSubscription {
  tier: "free" | "silver" | "gold" | "platinum";
  isPriority: boolean;
  badgeLabel?: string | null;
}

/**
 * Lightweight DTO for Business Cards (Homepage, Search, Directory)
 */
export interface PublicBusinessCardDTO {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  logoUrl: string;
  coverUrl: string;
  category: PublicBusinessCategory | null;
  location: PublicBusinessLocation;
  rating: PublicBusinessRating;
  isVerified: boolean;
  isFeatured: boolean;
  establishedYear: number | null;
  subscription: PublicBusinessSubscription;
  createdAt: string;
}

export interface PublicBusinessContact {
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  website?: string | null;
}

export interface PublicBusinessHoursDay {
  day: string;
  time: string;
  isOpen: boolean;
}

export interface PublicBusinessSocials {
  facebook?: string | null;
  instagram?: string | null;
  twitter?: string | null;
  linkedin?: string | null;
  youtube?: string | null;
}

export interface PublicBusinessServiceItem {
  id: string;
  name: string;
  description?: string | null;
  price?: string | null;
  icon?: string | null;
}

export interface PublicBusinessAmenityItem {
  id: string;
  name: string;
  icon?: string | null;
}

export interface PublicBusinessReviewItem {
  id: string;
  author: string;
  avatar?: string | null;
  rating: number;
  date: string;
  content: string;
  verified: boolean;
}

export interface PublicBusinessFaqItem {
  question: string;
  answer: string;
}

export interface PublicBusinessOwner {
  id: string;
  name: string;
  email?: string | null;
  image?: string | null;
}

/**
 * Full DTO for Individual Business Details Page
 */
export interface PublicBusinessDetailsDTO extends PublicBusinessCardDTO {
  fullDescription: string | null;
  contact: PublicBusinessContact;
  hours: PublicBusinessHoursDay[];
  openNow: boolean;
  socials: PublicBusinessSocials;
  gallery: string[];
  services: PublicBusinessServiceItem[];
  amenities: string[];
  reviews: {
    overall: number;
    count: number;
    breakdown?: Record<number, number>;
    recent: PublicBusinessReviewItem[];
  };
  faqs: PublicBusinessFaqItem[];
  relatedBusinesses: PublicBusinessCardDTO[];
  owner: PublicBusinessOwner | null;
  viewCount: string;
}

/**
 * Query Parameters for Filtering, Searching, & Pagination
 */
export interface PublicBusinessQueryParams {
  categorySlug?: string;
  city?: string;
  search?: string;
  featuredOnly?: boolean;
  page?: number;
  limit?: number;
  sort?: "newest" | "featured" | "rating" | "alphabetical";
  subscriptionTier?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
