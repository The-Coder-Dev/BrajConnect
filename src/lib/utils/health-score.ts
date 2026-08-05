/* eslint-disable @typescript-eslint/no-explicit-any */

export interface HealthScoreItem {
  key: string;
  label: string;
  points: number;
  completed: boolean;
  actionText: string;
  link: string;
}

export interface HealthScoreResult {
  score: number;
  completedItems: HealthScoreItem[];
  missingItems: HealthScoreItem[];
}

export function calculateBusinessHealthScore(biz: any): HealthScoreResult {
  if (!biz) {
    return {
      score: 0,
      completedItems: [],
      missingItems: [],
    };
  }

  const editLink = `/dashboard/businesses/${biz.id}/edit`;

  const items: HealthScoreItem[] = [
    {
      key: "logo",
      label: "Business Logo",
      points: 10,
      completed: Boolean(biz.logoUrl),
      actionText: "Upload a business logo to build brand identity.",
      link: `${editLink}?tab=brand`,
    },
    {
      key: "cover",
      label: "Cover Image",
      points: 10,
      completed: Boolean(biz.coverUrl),
      actionText: "Add a cover image to make your listing banner attractive.",
      link: `${editLink}?tab=brand`,
    },
    {
      key: "gallery",
      label: "Gallery Images",
      points: 15,
      completed: Array.isArray(biz.gallery) && biz.gallery.length >= 2,
      actionText: "Upload at least 2 photos to your gallery.",
      link: `${editLink}?tab=gallery`,
    },
    {
      key: "description",
      label: "Detailed Description",
      points: 10,
      completed: Boolean(biz.fullDescription || biz.shortDescription),
      actionText: "Write a short summary and detailed description.",
      link: `${editLink}?tab=basic`,
    },
    {
      key: "hours",
      label: "Business Operating Hours",
      points: 10,
      completed: Array.isArray(biz.hours) && biz.hours.length > 0,
      actionText: "Set weekly operating hours to inform customers when you are open.",
      link: `${editLink}?tab=hours`,
    },
    {
      key: "address",
      label: "Location & Address",
      points: 10,
      completed: Boolean(biz.location && (biz.location.address || biz.location.city)),
      actionText: "Add complete street address and city.",
      link: `${editLink}?tab=location`,
    },
    {
      key: "phone",
      label: "Primary Phone Number",
      points: 10,
      completed: Boolean(biz.contact && (biz.contact.primaryPhone || biz.contact.phone)),
      actionText: "Provide a verified contact phone number.",
      link: `${editLink}?tab=contact`,
    },
    {
      key: "website",
      label: "Website URL",
      points: 5,
      completed: Boolean(biz.contact && biz.contact.website),
      actionText: "Link your official website URL.",
      link: `${editLink}?tab=contact`,
    },
    {
      key: "socials",
      label: "Social Media Links",
      points: 5,
      completed: Array.isArray(biz.socials) && biz.socials.length > 0,
      actionText: "Add Instagram or Facebook profile links.",
      link: `${editLink}?tab=socials`,
    },
    {
      key: "documents",
      label: "Verification Documents",
      points: 15,
      completed: Array.isArray(biz.documents) && biz.documents.length > 0,
      actionText: "Upload business registration or identity documents for verification.",
      link: `${editLink}?tab=documents`,
    },
  ];

  let score = 0;
  const completedItems: HealthScoreItem[] = [];
  const missingItems: HealthScoreItem[] = [];

  for (const item of items) {
    if (item.completed) {
      score += item.points;
      completedItems.push(item);
    } else {
      missingItems.push(item);
    }
  }

  return {
    score: Math.min(100, score),
    completedItems,
    missingItems,
  };
}
