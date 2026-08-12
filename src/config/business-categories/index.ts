import { CategoryConfig } from "@/lib/onboarding/types";
import { hotelConfig } from "./hotel";
import { restaurantConfig } from "./restaurant";
import { collegeConfig } from "./college";
import { schoolConfig } from "./school";
import { loanConfig } from "./loan";
import { propertyConfig } from "./property";
import { salonConfig } from "./salon";
import { dentalConfig } from "./dental";
import { doctorConfig } from "./doctor";
import { coachingConfig } from "./coaching";
import { hospitalConfig } from "./hospital";

export * from "./hotel";
export * from "./restaurant";
export * from "./college";
export * from "./school";
export * from "./loan";
export * from "./property";
export * from "./salon";
export * from "./dental";
export * from "./doctor";
export * from "./coaching";
export * from "./hospital";

export const ALL_CATEGORY_CONFIGS: CategoryConfig[] = [
  hotelConfig,
  restaurantConfig,
  collegeConfig,
  schoolConfig,
  loanConfig,
  propertyConfig,
  salonConfig,
  dentalConfig,
  doctorConfig,
  coachingConfig,
  hospitalConfig,
];

/**
 * Fast lookup map keyed by both category slug (e.g. "hotel") and category id (e.g. "cat_hotel")
 */
export const businessCategoryConfigs: Record<string, CategoryConfig> = {
  // Slug mappings
  hotel: hotelConfig,
  restaurant: restaurantConfig,
  college: collegeConfig,
  school: schoolConfig,
  loan: loanConfig,
  property: propertyConfig,
  salon: salonConfig,
  dental: dentalConfig,
  doctor: doctorConfig,
  coaching: coachingConfig,
  hospital: hospitalConfig,

  // ID mappings
  cat_hotel: hotelConfig,
  cat_restaurant: restaurantConfig,
  cat_college: collegeConfig,
  cat_school: schoolConfig,
  cat_loan: loanConfig,
  cat_property: propertyConfig,
  cat_salon: salonConfig,
  cat_dental: dentalConfig,
  cat_doctor: doctorConfig,
  cat_coaching: coachingConfig,
  cat_hospital: hospitalConfig,
};

/**
 * Retrieve category configuration by slug or database ID
 */
export function getCategoryConfig(slugOrId: string | undefined | null): CategoryConfig | undefined {
  if (!slugOrId) return undefined;
  const normalized = slugOrId.toLowerCase().trim();
  return businessCategoryConfigs[normalized];
}

/**
 * Get all 11 category configurations for selection grids and metadata
 */
export function getAllCategoryConfigs(): CategoryConfig[] {
  return ALL_CATEGORY_CONFIGS;
}

/**
 * Check if a category is supported in the dynamic onboarding system
 */
export function isRegisteredCategory(slugOrId: string | undefined | null): boolean {
  return getCategoryConfig(slugOrId) !== undefined;
}
