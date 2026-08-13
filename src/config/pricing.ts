export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  badge?: string;
  highlight?: boolean;
  ctaText: string;
  ctaHref: string;
  features: string[];
  limits: string;
  status: "active" | "coming_soon";
}

export interface PricingComparisonCategory {
  category: string;
  features: {
    name: string;
    free: string | boolean;
    pro: string | boolean;
    premium: string | boolean;
    enterprise: string | boolean;
    tooltip?: string;
  }[];
}

export interface PricingFaq {
  question: string;
  answer: string;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free Starter",
    price: "₹0",
    period: "forever",
    description: "Essential listing features to establish your local business presence on BachatLal.",
    badge: "FREE",
    highlight: false,
    ctaText: "Get Started Free",
    ctaHref: "/sign-up",
    features: [
      "1 Verified Business Listing",
      "Basic Contact Details & Working Hours",
      "Public Search & Category Indexing",
      "Standard Lead Form Enquiries",
      "Customer Review Submissions",
      "Interactive Map Location",
    ],
    limits: "Standard placement",
    status: "active",
  },
  {
    id: "business-pro",
    name: "Business Pro",
    price: "₹499",
    period: "per month",
    description: "Enhanced growth tools to drive direct calls, leads, and customer trust.",
    badge: "MOST POPULAR",
    highlight: true,
    ctaText: "Choose Plan",
    ctaHref: "/sign-up",
    features: [
      "Everything in Free Starter",
      "Official Green Verified Trust Badge",
      "Featured Search Placement in Category",
      "Image Gallery (up to 15 photos)",
      "Direct Call & WhatsApp Tracking",
      "Customer Inquiry CSV Export",
      "Custom Business Amenities List",
    ],
    limits: "Priority placement",
    status: "active",
  },
  {
    id: "premium-scale",
    name: "Premium Scale",
    price: "₹999",
    period: "per month",
    description: "Maximum visibility, competitive analytics, and multi-category reach.",
    badge: "GROWTH",
    highlight: false,
    ctaText: "Choose Plan",
    ctaHref: "/sign-up",
    features: [
      "Everything in Business Pro",
      "Multi-Category Listing (up to 3 categories)",
      "Top 3 Search Placement within City",
      "Competitor Benchmark Analytics",
      "Priority Customer & Listing Support",
      "Special Promotional Badge Highlights",
      "Automated Review Moderation Tools",
    ],
    limits: "Top 3 search placement",
    status: "active",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "annual billing",
    description: "Tailored multi-location chain management, dedicated support, and custom integrations.",
    badge: "ENTERPRISE",
    highlight: false,
    ctaText: "Contact Sales",
    ctaHref: "/contact?subject=Enterprise+Pricing+Inquiry",
    features: [
      "Unlimited Business Locations",
      "Dedicated Account Specialist",
      "Custom API Integrations",
      "Custom SLA & Guaranteed Uptime",
      "Full Branding & Custom Portal Setup",
      "Quarterly Strategy & Growth Reviews",
    ],
    limits: "Unlimited scale",
    status: "active",
  },
];

export const PRICING_COMPARISON: PricingComparisonCategory[] = [
  {
    category: "Profile & Business Listing",
    features: [
      { name: "Verified Business Listing", free: "1 Location", pro: "1 Location", premium: "1 Location", enterprise: "Unlimited" },
      { name: "Verified Trust Badge", free: false, pro: true, premium: true, enterprise: true },
      { name: "Listing Categories", free: "1 Category", pro: "1 Category", premium: "Up to 3", enterprise: "Custom" },
      { name: "Business Hours & Amenities", free: true, pro: true, premium: true, enterprise: true },
      { name: "Direct WhatsApp & Call Buttons", free: "Basic", pro: "Tracked", premium: "Tracked", enterprise: "Tracked & CRM" },
    ],
  },
  {
    category: "Media & Showcase",
    features: [
      { name: "Cover Image & Logo", free: true, pro: true, premium: true, enterprise: true },
      { name: "Photo Gallery Capacity", free: "Up to 3 photos", pro: "Up to 15 photos", premium: "Up to 50 photos", enterprise: "Unlimited" },
      { name: "Custom Video Embeds", free: false, pro: false, premium: true, enterprise: true },
    ],
  },
  {
    category: "Lead Generation & Inquiries",
    features: [
      { name: "Public Contact / Inquiry Form", free: true, pro: true, premium: true, enterprise: true },
      { name: "Real-time Lead Notifications", free: "Email", pro: "Email & Dashboard", premium: "Email & Instant Alerts", enterprise: "Webhook / API" },
      { name: "Lead Export (CSV/Excel)", free: false, pro: true, premium: true, enterprise: true },
      { name: "Customer Review Management", free: "Standard", pro: "Standard", premium: "Priority Moderation", enterprise: "Dedicated Audit" },
    ],
  },
  {
    category: "Search Visibility & Ranking",
    features: [
      { name: "Search Indexing", free: "Standard", pro: "Enhanced", premium: "Top 3 Tier", enterprise: "Top Priority" },
      { name: "Featured Category Badge", free: false, pro: true, premium: true, enterprise: true },
      { name: "Homepage Spotlight Eligibility", free: false, pro: false, premium: true, enterprise: true },
    ],
  },
  {
    category: "Analytics & Support",
    features: [
      { name: "Traffic & View Analytics", free: "Basic Views", pro: "Views & Clicks", premium: "Full Funnel & Competitors", enterprise: "Custom BI Reports" },
      { name: "Customer Support", free: "Standard Ticket", pro: "Email Support", premium: "Priority Support (24h)", enterprise: "Dedicated Manager (1h SLA)" },
    ],
  },
];

export const PRICING_FAQS: PricingFaq[] = [
  {
    question: "Can I list my business on BachatLal for free?",
    answer:
      "Yes! BachatLal provides a Free Starter plan that allows any genuine local business to create a verified profile, display contact details, opening hours, photos, and receive customer enquiries without any upfront or hidden costs.",
  },
  {
    question: "Can I upgrade or downgrade my plan at any time?",
    answer:
      "Yes. You can manage your subscription directly from your Business Dashboard. Upgrades take effect immediately, while downgrades take effect at the conclusion of your current billing period.",
  },
  {
    question: "What happens if my business listing is rejected during verification?",
    answer:
      "If your business verification submission is rejected due to missing or invalid documentation, our moderation team will provide specific feedback. You can update your business details in your dashboard and resubmit for verification without any fee.",
  },
  {
    question: "Can I cancel a paid subscription plan?",
    answer:
      "Yes, you can cancel your paid subscription at any time with no lock-in contract or cancellation penalties. Your premium benefits will remain active until the end of your prepaid period.",
  },
  {
    question: "What happens to my listing if I cancel a paid plan?",
    answer:
      "Your listing will not be deleted. Upon cancellation, your listing simply reverts to the Free Starter plan, preserving your business profile, customer reviews, and basic contact information.",
  },
  {
    question: "Does paying for a plan guarantee top search placement?",
    answer:
      "Paid plans grant priority placement within your chosen categories and search rankings according to the plan tier. However, BachatLal maintains high standards for search relevance, user ratings, and geographic proximity to ensure honest, high-quality results for our visitors.",
  },
];
