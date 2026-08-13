import { Metadata } from "next";
import { LegalLayout, type LegalSection } from "@/components/legal/legal-layout";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms of Service | BachatLal",
  description:
    "Review the Terms of Service governing your access to and use of the BachatLal business discovery and listing platform.",
  openGraph: {
    title: "Terms of Service | BachatLal",
    description: "Terms of Service governing use of the BachatLal platform and business listings.",
    url: `${siteConfig.url}/terms-of-service`,
  },
};

const sections: LegalSection[] = [
  {
    id: "acceptance-of-terms",
    title: "Acceptance of Terms",
    content: (
      <>
        <p>
          These Terms of Service (&quot;Terms&quot;) constitute a legally binding agreement between you (&quot;User,&quot; &quot;you,&quot; or &quot;your&quot;) and <strong>BachatLal</strong> (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), governing your access to and use of the website located at <a href={siteConfig.url} className="text-red-600 underline">{siteConfig.url}</a>, along with all associated features, business portals, and services.
        </p>
        <p>
          By browsing the website, submitting an inquiry, registering an account, or listing a business profile, you signify that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you must immediately discontinue using BachatLal.
        </p>
      </>
    ),
  },
  {
    id: "eligibility",
    title: "Eligibility",
    content: (
      <>
        <p>
          You must be at least 18 years old and capable of entering into legally binding contracts under applicable Indian law to create an account or list a business on BachatLal. If you register or use the platform on behalf of a business, company, or legal entity, you represent and warrant that you have full legal authority to bind that entity to these Terms.
        </p>
      </>
    ),
  },
  {
    id: "accounts",
    title: "Accounts and Account Security",
    content: (
      <>
        <p>
          To create, manage, or edit business listings, you must create a registered account. You agree to provide accurate, current, and complete information during registration and keep your account details updated.
        </p>
        <p>
          You are solely responsible for safeguarding your login credentials and for all activities occurring under your account. You agree to notify us immediately at <a href={`mailto:${siteConfig.contact.supportEmail}`} className="text-red-600 underline">{siteConfig.contact.supportEmail}</a> of any unauthorized use or security breach.
        </p>
      </>
    ),
  },
  {
    id: "business-listings",
    title: "Business Listings & Merchant Responsibilities",
    content: (
      <>
        <p>
          BachatLal allows business owners and authorized representatives to submit listings featuring their company name, address, phone numbers, services, opening hours, photos, and amenities.
        </p>
        <p>
          As a merchant, you warrant that all submitted details are authentic, legitimate, and comply with all applicable local, state, and national commercial regulations. You may not list illegal services, counterfeit goods, or deceptive offerings.
        </p>
      </>
    ),
  },
  {
    id: "accuracy-responsibility",
    title: "Accuracy of Submitted Information",
    content: (
      <>
        <p>
          <strong>Businesses are solely responsible for the accuracy and completeness of their listings.</strong> BachatLal functions as a discovery and listing intermediary and does not independently warrant that every listed price, timing, amenity, or contact number is error-free.
        </p>
        <p>
          Business owners must promptly update their profile if their contact numbers, location, hours, or operational status change.
        </p>
      </>
    ),
  },
  {
    id: "business-verification",
    title: "Business Verification Policy & Scope",
    content: (
      <>
        <p>
          BachatLal provides a verification process where our moderation team reviews submitted documentation (such as registration certificates, storefront photos, or utility records). Upon review, a listing may receive an official &quot;Verified&quot; trust badge.
        </p>
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-sm text-amber-900 dark:text-amber-200">
          <strong>Important Notice regarding Verification:</strong> A &quot;Verified&quot; status confirms only that the business provided documentation consistent with our verification checklist at the time of review. <strong>A verified badge is not a guarantee, certification, or warranty</strong> of the merchant&apos;s product quality, pricing, safety, legality, financial solvency, or ongoing business conduct.
        </div>
      </>
    ),
  },
  {
    id: "user-content",
    title: "User-Provided Content & Reviews",
    content: (
      <>
        <p>
          Users may submit customer reviews, ratings, and comments regarding listed businesses. You retain ownership of content you submit, but you grant BachatLal a worldwide, perpetual, non-exclusive, royalty-free license to display, index, format, and distribute that content across our platform.
        </p>
        <p>
          Reviews must reflect genuine first-hand experiences. Submitting defamatory, abusive, fraudulent, or paid promotional reviews is strictly prohibited. We reserve the right to remove any review that violates our community guidelines.
        </p>
      </>
    ),
  },
  {
    id: "prohibited-activities",
    title: "Prohibited Activities",
    content: (
      <>
        <p>When accessing or using BachatLal, you agree not to:</p>
        <ul className="list-disc pl-6 space-y-1.5">
          <li>Use automated scrapers, bots, or crawlers to harvest directory data without our prior written consent</li>
          <li>Submit false, misleading, impersonating, or fraudulent business listings or customer reviews</li>
          <li>Distribute unsolicited commercial advertising, spam inquiries, or bulk promotions</li>
          <li>Upload viruses, malware, or any code designed to disrupt platform performance or security</li>
          <li>Attempt to bypass rate limits, authentication tokens, or access controls</li>
          <li>Use BachatLal to promote hate speech, harassment, illegal gambling, or unlawful activities</li>
        </ul>
      </>
    ),
  },
  {
    id: "enquiries-and-transactions",
    title: "Enquiries & Independent Customer Transactions",
    content: (
      <>
        <p>
          BachatLal provides discovery tools and direct inquiry forms connecting customers with businesses. <strong>BachatLal is not a party to any commercial transactions, contracts, appointments, or purchases</strong> made between users and listed businesses.
        </p>
        <p>
          All commercial terms, payments, warranties, refunds, and service deliveries are agreed upon directly between the customer and the respective business.
        </p>
      </>
    ),
  },
  {
    id: "pricing-and-subscriptions",
    title: "Pricing and Subscriptions",
    content: (
      <>
        <p>
          BachatLal offers Free Starter listings alongside optional paid subscription plans (such as Business Pro, Premium Scale, and Enterprise) offering enhanced features, priority placement, and lead analytics.
        </p>
        <p>
          All pricing values are clearly stated in Indian Rupees (INR) and subject to applicable government taxes where required.
        </p>
      </>
    ),
  },
  {
    id: "payments",
    title: "Payments and Billing",
    content: (
      <>
        <p>
          When paid subscription plans are activated, fees are billed on a recurring monthly or annual basis as selected during subscription checkout. Failure to pay applicable subscription fees may result in the downgrade of your listing to the Free Starter tier.
        </p>
      </>
    ),
  },
  {
    id: "refunds-and-cancellations",
    title: "Refunds and Cancellations",
    content: (
      <>
        <p>
          Business owners may cancel a paid subscription at any time via the Business Dashboard. Following cancellation, premium features will remain accessible until the conclusion of the active prepaid billing cycle.
        </p>
        <p>
          Unless required by applicable law or explicitly stated in a special promotion, subscription fees for utilized periods are non-refundable.
        </p>
      </>
    ),
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property",
    content: (
      <>
        <p>
          The BachatLal brand name, logo, software code, user interface designs, logos, graphics, and proprietary database compilations are the exclusive intellectual property of BachatLal and protected under Indian and international copyright and trademark laws.
        </p>
        <p>
          Third-party logos, merchant trademarks, and brand names displayed on business profiles remain the property of their respective owners.
        </p>
      </>
    ),
  },
  {
    id: "third-party-services",
    title: "Third-Party Services and Links",
    content: (
      <>
        <p>
          BachatLal may contain links to external third-party websites, social media profiles, and mapping services (such as Google Maps or OpenStreetMap). We do not control or endorse the content, policies, or practices of external third-party sites.
        </p>
      </>
    ),
  },
  {
    id: "platform-availability",
    title: "Platform Availability and Maintenance",
    content: (
      <>
        <p>
          We strive to provide uninterrupted 24/7 service. However, BachatLal may undergo periodic scheduled maintenance, server upgrades, or unexpected downtime. We do not guarantee continuous, uninterrupted, or error-free access.
        </p>
      </>
    ),
  },
  {
    id: "disclaimer-of-warranties",
    title: "Disclaimer of Warranties",
    content: (
      <>
        <p>
          THE PLATFORM AND ALL LISTED INFORMATION ARE PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
        </p>
        <p>
          WE DO NOT WARRANT THAT BUSINESS LISTINGS ARE ACCURATE, COMPLETE, RELIABLE, OR FREE OF ERRORS OR OMISSIONS.
        </p>
      </>
    ),
  },
  {
    id: "limitation-of-liability",
    title: "Limitation of Liability",
    content: (
      <>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, BACHATLAL AND ITS DIRECTORS, OFFICERS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, OR PUNITIVE DAMAGES, OR FOR ANY LOSS OF REVENUE, PROFITS, DATA, OR GOODWILL ARISING FROM OR RELATED TO YOUR USE OF THE PLATFORM OR ANY TRANSACTION ENTERED INTO WITH A LISTED BUSINESS.
        </p>
      </>
    ),
  },
  {
    id: "indemnification",
    title: "Indemnification",
    content: (
      <>
        <p>
          You agree to indemnify, defend, and hold harmless BachatLal, its officers, employees, and affiliates from and against any claims, liabilities, damages, losses, costs, or expenses (including legal fees) arising from your violation of these Terms, your submitted content or business listing, or your violation of any third-party rights.
        </p>
      </>
    ),
  },
  {
    id: "suspension-or-termination",
    title: "Account Suspension or Listing Removal",
    content: (
      <>
        <p>
          We reserve the right, at our sole discretion, to reject, suspend, modify, or permanently remove any business listing or user account that violates these Terms, contains fraudulent or deceptive information, or damages the reputation and integrity of the BachatLal platform.
        </p>
      </>
    ),
  },
  {
    id: "changes-to-terms",
    title: "Changes to These Terms",
    content: (
      <>
        <p>
          We reserve the right to revise or replace these Terms at any time. If a revision is material, we will update the &quot;Last updated&quot; date on this page. Your continued use of BachatLal after revisions become effective constitutes your acceptance of the updated Terms.
        </p>
      </>
    ),
  },
  {
    id: "governing-law",
    title: "Governing Law and Jurisdiction",
    content: (
      <>
        <p>
          These Terms and any disputes arising out of or related to your use of BachatLal shall be governed by and construed in accordance with the laws of India. Any legal dispute or proceeding shall be subject to the exclusive jurisdiction of the competent courts in Uttar Pradesh, India.
        </p>
      </>
    ),
  },
  {
    id: "contact-information",
    title: "Contact Information",
    content: (
      <>
        <p>
          If you have any questions concerning these Terms of Service, please contact our legal team:
        </p>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm space-y-1">
          <p><strong>BachatLal Legal & Compliance</strong></p>
          <p>Email: <a href={`mailto:${siteConfig.contact.supportEmail}`} className="text-red-600 underline">{siteConfig.contact.supportEmail}</a></p>
          <p>Region: {siteConfig.region}</p>
        </div>
      </>
    ),
  },
];

export default function TermsOfServicePage() {
  return (
    <LegalLayout
      title="Terms of Service"
      eyebrow="Legal & Compliance"
      lastUpdated="August 13, 2026"
      description="These Terms of Service govern your access to and use of the BachatLal platform, directory listings, and business owner services."
      sections={sections}
    />
  );
}
