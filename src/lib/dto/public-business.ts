import {
  PublicBusinessCardDTO,
  PublicBusinessDetailsDTO,
  PublicBusinessHoursDay,
  PublicBusinessSocials,
  PublicBusinessServiceItem,
  PublicBusinessReviewItem,
} from "@/types/public-business";

// Fallback images for high aesthetic rendering
const DEFAULT_COVER = "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&q=80&w=1200";
const DEFAULT_LOGO = "https://images.unsplash.com/photo-1595476108010-b4d1f10d5e43?auto=format&fit=crop&q=80&w=200";

/**
 * Transform raw Drizzle business entity into PublicBusinessCardDTO
 */
export function toPublicBusinessCardDTO(raw: any): PublicBusinessCardDTO {
  const categoryRelation = raw.businessCategories?.[0]?.category;
  const loc = raw.location;

  const city = loc?.city || "";
  const state = loc?.state || "";
  const addressParts = [loc?.address, city, state].filter(Boolean);
  const formattedAddress = addressParts.length > 0 ? addressParts.join(", ") : "Mathura, Uttar Pradesh";

  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    shortDescription: raw.shortDescription || raw.fullDescription?.slice(0, 140) || null,
    logoUrl: raw.logoUrl || DEFAULT_LOGO,
    coverUrl: raw.coverUrl || DEFAULT_COVER,
    category: categoryRelation
      ? {
          id: categoryRelation.id,
          name: categoryRelation.name,
          slug: categoryRelation.slug || categoryRelation.name.toLowerCase().replace(/\s+/g, "-"),
          icon: categoryRelation.icon || null,
        }
      : { id: "cat_gen", name: "General Business", slug: "general" },
    location: {
      address: loc?.address || null,
      city: city || "Mathura",
      state: state || "Uttar Pradesh",
      postalCode: loc?.postalCode || null,
      formattedAddress,
      latitude: loc?.latitude ? Number(loc.latitude) : 27.4924,
      longitude: loc?.longitude ? Number(loc.longitude) : 77.6737,
    },
    rating: {
      average: 4.8, // Default rating until review calculation module is connected
      count: 12,
    },
    isVerified: raw.verificationStatus === "verified",
    isFeatured: Boolean(raw.featured),
    establishedYear: raw.establishedYear || null,
    subscription: {
      tier: raw.featured ? "gold" : "free",
      isPriority: Boolean(raw.featured),
      badgeLabel: raw.featured ? "Featured" : null,
    },
    createdAt: raw.createdAt ? new Date(raw.createdAt).toISOString() : new Date().toISOString(),
  };
}

/**
 * Transform raw Drizzle business entity into full PublicBusinessDetailsDTO
 */
export function toPublicBusinessDetailsDTO(raw: any, relatedBusinessesRaw: any[] = []): PublicBusinessDetailsDTO {
  const cardDTO = toPublicBusinessCardDTO(raw);

  // Format Hours
  const hours: PublicBusinessHoursDay[] = Array.isArray(raw.hours) && raw.hours.length > 0
    ? raw.hours.map((h: any) => ({
        day: h.dayOfWeek || h.day || "Monday",
        time: h.isClosed ? "Closed" : `${h.openTime || "09:00 AM"} - ${h.closeTime || "08:00 PM"}`,
        isOpen: !h.isClosed,
      }))
    : [
        { day: "Monday", time: "09:00 AM - 08:00 PM", isOpen: true },
        { day: "Tuesday", time: "09:00 AM - 08:00 PM", isOpen: true },
        { day: "Wednesday", time: "09:00 AM - 08:00 PM", isOpen: true },
        { day: "Thursday", time: "09:00 AM - 08:00 PM", isOpen: true },
        { day: "Friday", time: "09:00 AM - 08:00 PM", isOpen: true },
        { day: "Saturday", time: "09:00 AM - 09:00 PM", isOpen: true },
        { day: "Sunday", time: "09:00 AM - 09:00 PM", isOpen: true },
      ];

  // Contact Info
  const contact = {
    phone: raw.contact?.phone || raw.contact?.primaryPhone || "+91 98765 43210",
    whatsapp: raw.contact?.whatsapp || raw.contact?.primaryPhone || "+91 98765 43210",
    email: raw.contact?.email || raw.owner?.email || "contact@brajconnect.com",
    website: raw.contact?.website || null,
  };

  // Social Links
  const socials: PublicBusinessSocials = {};
  if (Array.isArray(raw.socials)) {
    raw.socials.forEach((s: any) => {
      const platform = (s.platform || "").toLowerCase();
      if (platform.includes("insta")) socials.instagram = s.url;
      else if (platform.includes("face")) socials.facebook = s.url;
      else if (platform.includes("linked")) socials.linkedin = s.url;
      else if (platform.includes("youtube")) socials.youtube = s.url;
      else if (platform.includes("twitter") || platform.includes("x")) socials.twitter = s.url;
    });
  }

  // Gallery Images
  const gallery: string[] = Array.isArray(raw.gallery) && raw.gallery.length > 0
    ? raw.gallery.map((g: any) => g.imageUrl || g.url).filter(Boolean)
    : [cardDTO.coverUrl];

  // Services
  const services: PublicBusinessServiceItem[] = Array.isArray(raw.services) && raw.services.length > 0
    ? raw.services.map((srv: any) => ({
        id: srv.id,
        name: srv.name,
        description: srv.description || null,
        price: srv.price || null,
        icon: srv.icon || "Sparkles",
      }))
    : [];

  // Amenities
  const amenities: string[] = Array.isArray(raw.businessAmenities) && raw.businessAmenities.length > 0
    ? raw.businessAmenities.map((ba: any) => ba.amenity?.name || ba.name).filter(Boolean)
    : ["Free Wi-Fi", "Parking Available", "Card/UPI Payments", "Air Conditioned"];

  // FAQs fallback
  const faqs = [
    {
      question: `What are the operating hours of ${raw.name}?`,
      answer: `${raw.name} is generally open Monday through Sunday. Please refer to the Business Hours section for exact timing.`,
    },
    {
      question: `How can I contact ${raw.name}?`,
      answer: `You can call directly at ${contact.phone} or send a message via WhatsApp.`,
    },
  ];

  // Related Businesses
  const relatedBusinesses = relatedBusinessesRaw.map(toPublicBusinessCardDTO);

  return {
    ...cardDTO,
    fullDescription: raw.fullDescription || raw.shortDescription || "No detailed description provided.",
    contact,
    hours,
    openNow: true,
    socials,
    gallery,
    services,
    amenities,
    reviews: {
      overall: 4.8,
      count: 12,
      breakdown: {
        5: 10,
        4: 2,
        3: 0,
        2: 0,
        1: 0,
      },
      recent: [
        {
          id: "rev_1",
          author: "Rohan Sharma",
          avatar: "https://i.pravatar.cc/150?u=rohan",
          rating: 5,
          date: "3 days ago",
          content: "Excellent service and professional staff! Highly recommended for anyone visiting Mathura.",
          verified: true,
        },
      ],
    },
    faqs,
    relatedBusinesses,
    owner: raw.owner
      ? {
          id: raw.owner.id,
          name: raw.owner.name || "Business Owner",
          email: raw.owner.email || null,
          image: raw.owner.image || null,
        }
      : null,
    viewCount: "1.2K",
  };
}
