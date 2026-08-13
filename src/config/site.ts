export const siteConfig = {
  name: "BachatLal",
  shortName: "BachatLal",
  description:
    "The trusted local business discovery platform for the Braj region. Discover verified shops, services, hotels, restaurants, and medical centers or grow your business online.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://bachatlal.com",
  ogImage: "/logo.webp",
  region: "Braj Region, Uttar Pradesh, India",
  contact: {
    generalEmail: "contact@bachatlal.com",
    supportEmail: "support@bachatlal.com",
    businessEmail: "business@bachatlal.com",
    partnershipsEmail: "partnerships@bachatlal.com",
    phone: "+91 98765 43210",
    address: "Mathura, Vrindavan & Braj Region, Uttar Pradesh, India",
    workingHours: "Monday – Saturday: 9:00 AM – 7:00 PM IST",
    responseTime: "Usually responds within 24 business hours",
  },
  social: {
    twitter: "https://twitter.com/bachatlal",
    facebook: "https://facebook.com/bachatlal",
    instagram: "https://instagram.com/bachatlal",
    linkedin: "https://linkedin.com/company/bachatlal",
  },
  links: {
    home: "/",
    about: "/about",
    pricing: "/pricing",
    contact: "/contact",
    businesses: "/#businesses",
    categories: "/#categories",
    listBusiness: "/sign-up",
    dashboard: "/dashboard",
    signIn: "/sign-in",
    signUp: "/sign-up",
    privacy: "/privacy-policy",
    terms: "/terms-of-service",
    disclaimer: "/disclaimer",
    cookiePolicy: "/cookie-policy",
  },
} as const;

export type SiteConfig = typeof siteConfig;
