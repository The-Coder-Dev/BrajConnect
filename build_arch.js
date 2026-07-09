const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, 'src');

const filesToCreate = [
  // Server Layer
  'server/actions/business/index.ts',
  'server/actions/category/index.ts',
  'server/actions/upload/index.ts',
  'server/actions/admin/index.ts',
  'server/actions/index.ts',
  'server/queries/business/index.ts',
  'server/queries/category/index.ts',
  'server/queries/search/index.ts',
  'server/queries/dashboard/index.ts',
  'server/queries/index.ts',
  'server/index.ts',

  // Database Schema
  'db/schema/subcategory.ts',
  'db/schema/business-category.ts',
  'db/schema/business-contact.ts',
  'db/schema/business-hours.ts',
  'db/schema/business-services.ts',
  'db/schema/business-documents.ts',
  'db/schema/amenities.ts',
  'db/schema/business-amenities.ts',
  'db/schema/dynamic-fields.ts',
  'db/schema/business-fields.ts',

  // Validation Structure
  'validations/business/basic.ts',
  'validations/business/contact.ts',
  'validations/business/location.ts',
  'validations/business/gallery.ts',
  'validations/business/services.ts',
  'validations/business/hours.ts',
  'validations/business/documents.ts',
  'validations/business/socials.ts',
  'validations/business/onboarding.ts',
  'validations/business/index.ts',
  'validations/admin/index.ts',
  'validations/search/index.ts',
  'validations/index.ts',

  // Types
  'types/category.ts',
  'types/gallery.ts',
  'types/service.ts',
  'types/amenity.ts',
  'types/social.ts',
  'types/document.ts',
  'types/search.ts',
  'types/enums.ts',

  // Constants
  'lib/constants/verification-status.ts',
  'lib/constants/document-types.ts',
  'lib/constants/social-platforms.ts',
  'lib/constants/storage.ts',
  'lib/constants/business-limits.ts',
  'lib/constants/supported-image-types.ts',
  'lib/constants/supported-document-types.ts',
  'lib/constants/index.ts',

  // Cloudinary Module
  'lib/cloudinary/optimize.ts',
  'lib/cloudinary/folders.ts',
  'lib/cloudinary/transformations.ts',
  'lib/cloudinary/index.ts',

  // Supabase Storage
  'lib/supabase-storage/upload-document.ts',
  'lib/supabase-storage/delete-document.ts',
  'lib/supabase-storage/buckets.ts',
  'lib/supabase-storage/index.ts',

  // Google Maps
  'lib/maps/autocomplete.ts',
  'lib/maps/geocode.ts',
  'lib/maps/reverse-geocode.ts',
  'lib/maps/place-details.ts',
  'lib/maps/index.ts',

  // Search Layer
  'lib/search/filters.ts',
  'lib/search/ranking.ts',
  'lib/search/query-builder.ts',
  'lib/search/search-params.ts',
  'lib/search/index.ts',

  // Dashboards
  'features/dashboard/owner/index.ts',
  'features/dashboard/admin/index.ts',
  'features/dashboard/visitor/index.ts',
];

const exportContent = "export {};\n";

for (const file of filesToCreate) {
  const fullPath = path.join(basePath, file);
  const dir = path.dirname(fullPath);
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Only write if it doesn't already exist, to avoid overwriting any existing code
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, exportContent, 'utf8');
    console.log(`Created: ${file}`);
  } else {
    console.log(`Skipped (exists): ${file}`);
  }
}

console.log("Architecture expansion completed successfully.");
