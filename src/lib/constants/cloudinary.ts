export const CLOUDINARY = {
  FOLDERS: {
    BUSINESS_LOGOS: "brajconnect/business-logos",
    BUSINESS_COVERS: "brajconnect/business-covers",
    GALLERY: "brajconnect/gallery",
    USER_AVATARS: "brajconnect/user-avatars",
    REVIEWS: "brajconnect/reviews",
  },
  PRESETS: {
    BUSINESS: "brajconnect_business",
  },
  LIMITS: {
    MAX_FILE_SIZE_MB: 5,
    GALLERY_MAX_IMAGES: 10,
  }
} as const;
