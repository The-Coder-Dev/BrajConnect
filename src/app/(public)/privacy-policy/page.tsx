import { Metadata } from "next";
import { LegalLayout, type LegalSection } from "@/components/legal/legal-layout";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy | BachatLal",
  description:
    "Read the BachatLal Privacy Policy to understand how we collect, use, protect, and handle your personal and business data.",
  openGraph: {
    title: "Privacy Policy | BachatLal",
    description: "Read the BachatLal Privacy Policy regarding data collection, usage, and privacy rights.",
    url: `${siteConfig.url}/privacy-policy`,
  },
};

const sections: LegalSection[] = [
  {
    id: "introduction",
    title: "Introduction",
    content: (
      <>
        <p>
          Welcome to <strong>BachatLal</strong> (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We operate the business discovery and listing portal accessible via <a href={siteConfig.url} className="text-red-600 underline">{siteConfig.url}</a>.
        </p>
        <p>
          We are committed to respecting your privacy and protecting the personal and business information you share with us. This Privacy Policy explains what information we collect, how we process and protect it, and the choices available to you regarding your data.
        </p>
        <p>
          By accessing or using BachatLal, creating an account, or submitting a business listing or customer enquiry, you acknowledge that you have read and understood the practices described in this policy.
        </p>
      </>
    ),
  },
  {
    id: "information-we-collect",
    title: "Information We Collect",
    content: (
      <>
        <p>
          We collect information that is necessary to deliver our discovery services, authenticate users, facilitate inquiries between customers and merchants, and verify business authenticity.
        </p>
        <p>
          The types of information collected depend on how you interact with BachatLal—whether as a general visitor browsing directory listings, a registered user, or a business owner managing a profile.
        </p>
      </>
    ),
  },
  {
    id: "user-provided-information",
    title: "Information Provided by Users",
    content: (
      <>
        <p>
          When you use BachatLal to browse, submit feedback, or send a general inquiry through our contact channels, we may collect:
        </p>
        <ul className="list-disc pl-6 space-y-1.5">
          <li>Full name and contact email address</li>
          <li>Phone number (when provided for callbacks or messaging)</li>
          <li>Subject line, message content, and category selections</li>
          <li>Customer review ratings, comments, and submitted feedback</li>
        </ul>
      </>
    ),
  },
  {
    id: "business-information",
    title: "Business Listing Information",
    content: (
      <>
        <p>
          When you register and list a business on BachatLal, we collect details necessary to display your public business storefront:
        </p>
        <ul className="list-disc pl-6 space-y-1.5">
          <li>Trading name, legal entity name, and brand description</li>
          <li>Physical address, landmark, city, postal code, and GPS map coordinates</li>
          <li>Official business phone numbers, WhatsApp contact numbers, and public email</li>
          <li>Primary category, subcategories, amenities, and operational hours</li>
          <li>Social profile links (Instagram, Facebook, LinkedIn, Twitter/X)</li>
          <li>Verification documents (such as GSTIN, trade licenses, or utility records submitted strictly for admin verification)</li>
        </ul>
      </>
    ),
  },
  {
    id: "account-information",
    title: "Account & Authentication Information",
    content: (
      <>
        <p>
          When creating an account to manage business listings or save preferences, we collect your name, email address, password hash, and role permissions. Passwords are cryptographically hashed and never stored in plain text.
        </p>
        <p>
          Session cookies and tokens are utilized solely to keep you securely signed in to your Business Dashboard.
        </p>
      </>
    ),
  },
  {
    id: "enquiries-and-communications",
    title: "Enquiries and Direct Communications",
    content: (
      <>
        <p>
          When a visitor submits an inquiry form on a published business profile, BachatLal securely transmits the visitor&apos;s name, email, phone number, and message to the respective business owner&apos;s dashboard and notification feed.
        </p>
        <p>
          BachatLal does not sell or distribute lead data to unrelated third-party marketing companies.
        </p>
      </>
    ),
  },
  {
    id: "uploaded-content",
    title: "Uploaded Content & Media",
    content: (
      <>
        <p>
          Business owners may upload visual assets such as logos, cover banners, and storefront photo galleries. These files are securely processed and hosted via modern cloud storage networks (such as Cloudinary and Supabase Storage) to ensure high-speed delivery.
        </p>
        <p>
          Do not upload photos containing sensitive personal identification numbers or confidential private documents to public gallery fields.
        </p>
      </>
    ),
  },
  {
    id: "how-we-use-information",
    title: "How We Use Information",
    content: (
      <>
        <p>We use the collected information for the following legitimate purposes:</p>
        <ul className="list-disc pl-6 space-y-1.5">
          <li>Publishing and indexing verified business profiles in search results</li>
          <li>Routing customer enquiries directly to business operators</li>
          <li>Authenticating registered users and preventing unauthorized portal access</li>
          <li>Verifying ownership and business authenticity during the verification workflow</li>
          <li>Monitoring platform security, mitigating spam, and enforcing rate limits</li>
          <li>Providing system notifications regarding listing status, reviews, or policy updates</li>
        </ul>
      </>
    ),
  },
  {
    id: "how-we-share-information",
    title: "How We Share Information",
    content: (
      <>
        <p>
          Information designated as public (such as your business name, address, public contact number, photos, and opening hours) is displayed openly across BachatLal so customers can find and contact your establishment.
        </p>
        <p>
          We do <strong>not</strong> sell, rent, or lease your private personal contact details to third-party data brokers. Private information is only shared under the following conditions:
        </p>
        <ul className="list-disc pl-6 space-y-1.5">
          <li><strong>Direct Inquiries:</strong> When a user sends an inquiry to a specific business, that business receives the provided details.</li>
          <li><strong>Legal Compliance:</strong> When required by applicable Indian law, judicial court orders, or law enforcement requests.</li>
          <li><strong>Protection of Rights:</strong> To protect the security, rights, and safety of BachatLal, our users, or the general public.</li>
        </ul>
      </>
    ),
  },
  {
    id: "service-providers",
    title: "Service Providers and Third Parties",
    content: (
      <>
        <p>
          We partner with vetted infrastructure and cloud service providers to maintain the platform:
        </p>
        <ul className="list-disc pl-6 space-y-1.5">
          <li>Cloud hosting and deployment (e.g., Vercel)</li>
          <li>Database and authentication storage (e.g., PostgreSQL / Supabase)</li>
          <li>Media optimization and CDN delivery (e.g., Cloudinary)</li>
          <li>Spam prevention and rate limiting (e.g., Upstash Redis)</li>
        </ul>
        <p>
          These providers are bound by strict data protection agreements and only process information as instructed by BachatLal.
        </p>
      </>
    ),
  },
  {
    id: "data-storage-and-security",
    title: "Data Storage and Security",
    content: (
      <>
        <p>
          We implement industry-standard technical and organizational security measures to protect your data, including HTTPS encryption in transit, cryptographic password hashing, access control lists, and automated rate limiting against brute-force attacks.
        </p>
        <p>
          While we maintain stringent security protocols, no digital transmission or electronic storage method is 100% immune to potential risks. We encourage users to maintain strong, unique passwords.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies and Similar Technologies",
    content: (
      <>
        <p>
          BachatLal uses essential cookies to manage authenticated sessions, preserve user preferences, and secure API requests. We do not deploy invasive third-party cross-site advertising trackers.
        </p>
        <p>
          For comprehensive details on how cookies are utilized and how to manage them, please review our dedicated <a href="/cookie-policy" className="text-red-600 underline">Cookie Policy</a>.
        </p>
      </>
    ),
  },
  {
    id: "data-retention",
    title: "Data Retention",
    content: (
      <>
        <p>
          We retain personal and business listing information for as long as your account remains active or as needed to provide you with directory services. If you delete your account or request listing removal, we will remove public visibility and delete or anonymize personal data, except where required by law or legitimate accounting requirements.
        </p>
      </>
    ),
  },
  {
    id: "user-rights",
    title: "User Rights and Data Choices",
    content: (
      <>
        <p>You have the following rights concerning your data on BachatLal:</p>
        <ul className="list-disc pl-6 space-y-1.5">
          <li><strong>Access & Correction:</strong> You can review and update your business profile details at any time through your dashboard.</li>
          <li><strong>Account Deletion:</strong> You may request the deletion of your account and removal of your business listing.</li>
          <li><strong>Communication Preferences:</strong> You can opt out of non-essential promotional notifications while retaining transactional notices.</li>
        </ul>
        <p>
          To exercise any of these rights, contact us at <a href={`mailto:${siteConfig.contact.supportEmail}`} className="text-red-600 underline">{siteConfig.contact.supportEmail}</a>.
        </p>
      </>
    ),
  },
  {
    id: "childrens-privacy",
    title: "Children's Privacy",
    content: (
      <>
        <p>
          BachatLal is designed for general audiences and business owners. We do not knowingly collect personal data from children under the age of 18. If we learn that personal information of a minor has been collected without parental consent, we will promptly take steps to delete such data.
        </p>
      </>
    ),
  },
  {
    id: "changes-to-policy",
    title: "Changes to This Privacy Policy",
    content: (
      <>
        <p>
          We may update this Privacy Policy periodically to reflect enhancements in our services, statutory requirements, or operational practices. The revised version will be indicated by an updated &quot;Last updated&quot; date at the top of this page.
        </p>
        <p>
          We encourage you to review this policy periodically to stay informed about how we safeguard your data.
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
          If you have any questions, grievances, or requests regarding this Privacy Policy or our data handling practices, please contact us at:
        </p>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm space-y-1">
          <p><strong>BachatLal Privacy & Compliance Team</strong></p>
          <p>Email: <a href={`mailto:${siteConfig.contact.supportEmail}`} className="text-red-600 underline">{siteConfig.contact.supportEmail}</a></p>
          <p>Region: {siteConfig.region}</p>
          <p>Support Hours: {siteConfig.contact.workingHours}</p>
        </div>
      </>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      eyebrow="Legal & Compliance"
      lastUpdated="August 13, 2026"
      description="This Privacy Policy describes how BachatLal collects, uses, protects, and handles your personal information and business listings across our platform."
      sections={sections}
    />
  );
}
