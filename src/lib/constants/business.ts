export const BUSINESS = {
  LIMITS: {
    NAME_MAX_LENGTH: 100,
    DESCRIPTION_MAX_LENGTH: 2000,
    TAGS_MAX_COUNT: 5,
  },
  VALIDATION: {
    PHONE_REGEX: /^\+?[1-9]\d{1,14}$/,
  },
} as const;
