import { Metadata } from "next";
import { LegalLayout, type LegalSection } from "@/components/legal/legal-layout";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Disclaimer | BachatLal",
  description:
    "Read the official BachatLal Disclaimer regarding platform listings, accuracy of business information, verification scope, and user responsibility.",
  openGraph: {
    title: "Disclaimer | BachatLal",
    description: "Official Disclaimer regarding BachatLal listings, verification scope, and accuracy.",
    url: `${siteConfig.url}/disclaimer`,
  },
};

const sections: LegalSection[] = [
  {
    id: "platform-information",
    title: "Platform Information & Directory Role",
    content: (
      <>
        <p>
          <strong>BachatLal</strong> operates as an online business directory, discovery platform, and informational portal designed to assist customers in locating local services, shops, healthcare providers, hospitality, and amenities across the Braj region.
        </p>
        <p>
          Information published on BachatLal is provided directly by third-party business owners, authorized merchant representatives, or gathered from publicly accessible sources. BachatLal acts as a conduit and technology facilitator for local discovery.
        </p>
      </>
    ),
  },
  {
    id: "business-accuracy",
    title: "Accuracy and Completeness of Listings",
    content: (
      <>
        <p>
          While we encourage business owners to maintain accurate profiles and perform periodic moderation reviews, <strong>BachatLal does not warrant or guarantee that all business descriptions, pricing, working hours, phone numbers, addresses, amenities, or images are 100% complete, current, accurate, or error-free.</strong>
        </p>
        <p>
          Businesses may alter their operational hours, service offerings, tariffs, or physical locations without immediate notification to BachatLal. We strongly advise users to call or message businesses in advance to confirm critical details before traveling.
        </p>
      </>
    ),
  },
  {
    id: "verification-scope",
    title: "Scope & Limitations of Verification Badges",
    content: (
      <>
        <p>
          Certain business listings on BachatLal display an official &quot;Verified&quot; green trust badge. This badge signifies solely that the business owner submitted proof of identity or basic business documentation (such as registration records or utility receipts) that satisfied our administrative verification checklist at the time of review.
        </p>
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-sm text-amber-900 dark:text-amber-200">
          <strong>A Verified Badge is NOT:</strong>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>An endorsement, accreditation, or quality warranty by BachatLal</li>
            <li>A guarantee of merchant safety, honesty, financial reliability, or hygiene</li>
            <li>An assurance that the business holds all requisite government or health permits</li>
            <li>An assumption of liability by BachatLal for any dispute between you and the merchant</li>
          </ul>
        </div>
      </>
    ),
  },
  {
    id: "third-party-endorsement",
    title: "Third-Party Businesses & Non-Endorsement",
    content: (
      <>
        <p>
          The appearance of any business, shop, hospital, hotel, restaurant, or service provider on BachatLal does not constitute an endorsement, sponsorship, or recommendation by BachatLal.
        </p>
        <p>
          BachatLal does not control, supervise, or assume legal responsibility for the goods, services, hygiene, medical qualifications, safety protocols, pricing, or conduct of any third-party business listed on our platform.
        </p>
      </>
    ),
  },
  {
    id: "user-decisions",
    title: "User Decisions and Due Diligence",
    content: (
      <>
        <p>
          All decisions to visit, contact, purchase goods from, hire services from, or enter contracts with any business listed on BachatLal are made solely at your own risk and discretion.
        </p>
        <p>
          You are solely responsible for conducting appropriate due diligence—such as verifying doctor qualifications, inspecting hotel conditions, checking food hygiene, confirming pricing, and verifying trade licenses—before engaging in any commercial transaction.
        </p>
      </>
    ),
  },
  {
    id: "external-links",
    title: "External Links and Third-Party Websites",
    content: (
      <>
        <p>
          BachatLal profiles and pages may contain hyperlinks to third-party websites, external social media accounts, booking platforms, or mapping services. These external links are provided purely for user convenience.
        </p>
        <p>
          BachatLal has no control over the content, privacy practices, or security of external websites and disclaims all liability for any loss or harm resulting from your interaction with third-party sites.
        </p>
      </>
    ),
  },
  {
    id: "platform-availability",
    title: "Platform Availability and Technical Interruptions",
    content: (
      <>
        <p>
          We endeavor to maintain high platform availability, but we do not warrant that BachatLal will operate uninterrupted, timely, secure, or free from server errors, bugs, or malicious attacks.
        </p>
        <p>
          BachatLal shall not be held liable for any loss, inconvenience, or missed business opportunities caused by platform downtime, maintenance, or data sync delays.
        </p>
      </>
    ),
  },
  {
    id: "no-professional-advice",
    title: "No Professional Advice",
    content: (
      <>
        <p>
          Any informational guides, category descriptions, customer reviews, or business articles published on BachatLal are intended strictly for general informational purposes and do not constitute legal, medical, financial, architectural, or professional advice.
        </p>
        <p>
          For specialized medical, legal, or financial consultations, always consult with certified, licensed professional practitioners.
        </p>
      </>
    ),
  },
  {
    id: "independent-verification",
    title: "Independent Verification Statement",
    content: (
      <>
        <p>
          <strong>By using BachatLal, you explicitly acknowledge and agree that you must independently verify all critical business information, opening hours, pricing, and terms before relying on them or committing to any financial expenditure.</strong>
        </p>
        <p>
          If you discover an inaccurate listing or suspect fraudulent activity, please report it immediately to our team at <a href={`mailto:${siteConfig.contact.supportEmail}`} className="text-red-600 underline">{siteConfig.contact.supportEmail}</a> so we can investigate and update the directory.
        </p>
      </>
    ),
  },
];

export default function DisclaimerPage() {
  return (
    <LegalLayout
      title="Disclaimer"
      eyebrow="Legal & Compliance"
      lastUpdated="August 13, 2026"
      description="Important legal disclaimer regarding BachatLal directory listings, accuracy of merchant details, verification limitations, and independent user responsibility."
      sections={sections}
    />
  );
}
