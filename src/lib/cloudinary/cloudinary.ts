import { v2 as cloudinary } from "cloudinary";

/**
 * Validates that all required Cloudinary environment variables are present.
 * Throws a descriptive error at startup rather than a cryptic SDK error at runtime.
 */
function validateCloudinaryConfig(): void {
  const required = {
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  };

  const missing = Object.entries(required)
    .filter(([, value]) => !value || value.trim() === "")
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(
      `Missing required Cloudinary environment variables: ${missing.join(", ")}. ` +
        "Please add them to your .env file:\n" +
        "  CLOUDINARY_CLOUD_NAME=your_cloud_name\n" +
        "  CLOUDINARY_API_KEY=your_api_key\n" +
        "  CLOUDINARY_API_SECRET=your_api_secret"
    );
  }
}

// Validate on module load — surfaces misconfiguration early.
validateCloudinaryConfig();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  // Disable CLOUDINARY_URL auto-config to avoid conflicts
  secure: true,
});

export { cloudinary };
