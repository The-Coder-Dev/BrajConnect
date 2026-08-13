import { Metadata } from "next";
import { LegalLayout, type LegalSection } from "@/components/legal/legal-layout";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Cookie Policy | BachatLal",
  description:
    "Learn how BachatLal uses essential cookies and local storage to secure sessions, remember preferences, and deliver high performance.",
  openGraph: {
    title: "Cookie Policy | BachatLal",
    description: "Learn how BachatLal uses cookies and secure session tokens.",
    url: `${siteConfig.url}/cookie-policy`,
  },
};

const sections: LegalSection[] = [
  {
    id: "what-are-cookies",
    title: "What Cookies Are",
    content: (
      <>
        <p>
          Cookies are small text files containing small amounts of data that are placed on your computer, smartphone, or tablet when you visit a website. They are widely used by modern web platforms to make websites work efficiently, remember your login session, and provide aggregated system telemetry.
        </p>
        <p>
          In addition to standard HTTP cookies, we may utilize related browser storage technologies such as <code>localStorage</code> and <code>sessionStorage</code> for transient UI state (like remembering your theme preferences or drawer states).
        </p>
      </>
    ),
  },
  {
    id: "how-we-use-cookies",
    title: "How We Use Cookies",
    content: (
      <>
        <p>
          At <strong>BachatLal</strong>, we believe in minimal, privacy-first data handling. We use cookies primarily for strictly necessary functions that keep the platform secure and fast:
        </p>
        <ul className="list-disc pl-6 space-y-1.5">
          <li>Authenticating business owners and protecting dashboard sessions against unauthorized access</li>
          <li>Safeguarding forms against Cross-Site Request Forgery (CSRF) and automated bot abuse</li>
          <li>Enforcing server-side rate limits to prevent denial-of-service disruptions</li>
          <li>Remembering interface preferences, such as selected categories or active filter tabs</li>
        </ul>
      </>
    ),
  },
  {
    id: "types-of-cookies",
    title: "Types of Cookies We Use",
    content: (
      <>
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">1. Strictly Essential & Security Cookies</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              These cookies are vital for the proper operation of BachatLal. They handle user authentication (Better Auth sessions), secure tokens, and rate-limiting counters. The website cannot function securely without these cookies.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">2. Functionality & Preference Cookies</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              These cookies allow the site to remember user interface choices (such as dark/light display mode or collapsed sidebar menus) to provide a seamless browsing experience.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">3. Aggregated Performance & Analytics Telemetry</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              We may utilize privacy-preserving, aggregate performance metrics (such as Vercel Speed Insights) to monitor page load times and server latency. These metrics do not track your personal identity or browsing behavior across other websites.
            </p>
          </div>
        </div>

        <p className="text-sm pt-2">
          <strong>No Invasive Advertising Trackers:</strong> BachatLal does not sell user data to advertising networks or embed intrusive third-party cross-site behavioral tracking cookies.
        </p>
      </>
    ),
  },
  {
    id: "third-party-cookies",
    title: "Third-Party Services & Media Delivery",
    content: (
      <>
        <p>
          When you view business profiles containing photos or media assets hosted by our trusted infrastructure partners (such as Cloudinary or Google Maps embeds), those third-party providers may set cookies necessary for content delivery or map rendering.
        </p>
        <p>
          We recommend reviewing the respective privacy and cookie notices of external service providers when interacting with embedded external components.
        </p>
      </>
    ),
  },
  {
    id: "cookie-management",
    title: "How to Manage and Disable Cookies",
    content: (
      <>
        <p>
          Most modern web browsers allow you to manage your cookie settings. You can configure your browser to block cookies, alert you when a cookie is placed, or delete cookies that have already been set.
        </p>
        <p>
          To adjust your cookie preferences, refer to your browser&apos;s help documentation:
        </p>
        <ul className="list-disc pl-6 space-y-1 text-xs sm:text-sm">
          <li><strong>Google Chrome:</strong> Settings &gt; Privacy and security &gt; Cookies and other site data</li>
          <li><strong>Mozilla Firefox:</strong> Settings &gt; Privacy &amp; Security &gt; Cookies and Site Data</li>
          <li><strong>Apple Safari:</strong> Preferences &gt; Privacy &gt; Manage Website Data</li>
          <li><strong>Microsoft Edge:</strong> Settings &gt; Cookies and site permissions &gt; Manage and delete cookies</li>
        </ul>
        <p className="text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
          <strong>Please note:</strong> Disabling strictly essential cookies will prevent you from signing in to your Business Dashboard or managing business listings.
        </p>
      </>
    ),
  },
  {
    id: "changes-to-policy",
    title: "Changes to This Cookie Policy",
    content: (
      <>
        <p>
          We may update this Cookie Policy from time to time to reflect changes in the technologies we use or in legal regulations. Any updates will take effect immediately upon posting to this page.
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
          If you have questions about how cookies are used on BachatLal, please reach out to us at:
        </p>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm space-y-1">
          <p><strong>BachatLal Privacy Team</strong></p>
          <p>Email: <a href={`mailto:${siteConfig.contact.supportEmail}`} className="text-red-600 underline">{siteConfig.contact.supportEmail}</a></p>
        </div>
      </>
    ),
  },
];

export default function CookiePolicyPage() {
  return (
    <LegalLayout
      title="Cookie Policy"
      eyebrow="Legal & Compliance"
      lastUpdated="August 13, 2026"
      description="This Cookie Policy explains how BachatLal uses essential cookies, local storage, and related technologies to deliver secure, performant directory services."
      sections={sections}
    />
  );
}
