import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Compass,
  Store,
  ArrowRight,
  ShieldCheck,
  Search,
  Sparkles,
  Users,
  Building2,
  TrendingUp,
  MessageSquare,
  MapPin,
  CheckCircle2,
  Check,
} from "lucide-react";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "About BachatLal | Discover & List Local Businesses",
  description:
    "Learn how BachatLal connects customers with trusted local businesses across the Braj region while empowering business owners to build and manage their digital presence.",
  openGraph: {
    title: "About BachatLal | Discover & List Local Businesses",
    description:
      "Learn how BachatLal connects customers with trusted local businesses across the Braj region.",
    url: `${siteConfig.url}/about`,
  },
};

const steps = [
  {
    step: "01",
    title: "Discover",
    description: "Search and browse verified local businesses, restaurants, healthcare, hotels, and shops near you.",
    icon: Search,
    color: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border-blue-500/20",
  },
  {
    step: "02",
    title: "Explore",
    description: "View verified business profiles, photo galleries, operational hours, verified amenities, and authentic reviews.",
    icon: Compass,
    color: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-500/20",
  },
  {
    step: "03",
    title: "Connect",
    description: "Call directly, chat over WhatsApp, submit enquiry forms, or get one-tap navigation directions.",
    icon: MessageSquare,
    color: "bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400 border-orange-500/20",
  },
  {
    step: "04",
    title: "Grow",
    description: "Business owners create listings, manage inquiries, monitor view analytics, and build local brand trust.",
    icon: TrendingUp,
    color: "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 border-red-500/20",
  },
];

const customerBenefits = [
  "Search verified local shops, doctors, hotels & services with zero spam",
  "View accurate operational hours, phone numbers, and WhatsApp channels",
  "Browse photo galleries, menus, and certified business amenities",
  "Submit direct inquiries without intermediary booking commissions",
  "Find precise GPS map navigation with one-click route planning",
];

const businessBenefits = [
  "Create a professional, search-indexed digital business storefront",
  "Earn an official Green Verified Trust badge upon document check",
  "Receive direct customer leads with email & dashboard notifications",
  "Showcase photos, amenities, social media links & opening hours",
  "Track real-time profile views, call clicks & inquiry conversions",
];

export default function AboutPage() {
  return (
    <div className="space-y-24 md:space-y-32 pb-24">
      
      {/* 1. Hero Section */}
      <section className="relative pt-16 md:pt-24 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-red-500/10 text-red-600 border border-red-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>About BachatLal</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1]">
              Helping People Discover Businesses They Can{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-red-600 to-orange-500">
                Trust.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
              BachatLal is a dedicated business discovery and digital enablement platform. We connect local residents and visitors with authentic local services, while giving entrepreneurs the tools to create, manage, and scale their online presence.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                render={<Link href="/#businesses" />}
                className="w-full sm:w-auto h-13 px-8 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-base shadow-lg hover:shadow-red-600/20 transition-all"
              >
                Explore Businesses <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                render={<Link href="/sign-up" />}
                className="w-full sm:w-auto h-13 px-8 rounded-full border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-base hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                List Your Business
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. What is BachatLal? */}
      <section className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="p-8 sm:p-12 md:p-16 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-600">
              <Building2 className="w-4 h-4" />
              <span>Our Story & Purpose</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Bridging the Digital Gap for Local Commerce
            </h2>

            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base sm:text-lg">
              In rapidly developing regions like Braj (Mathura, Vrindavan, and neighboring hubs), finding reliable, up-to-date business contact information has historically relied on fragmented word-of-mouth or outdated search listings.
            </p>

            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base sm:text-lg">
              <strong>BachatLal exists to solve this challenge.</strong> We provide customers with verified, comprehensive directory listings—complete with actual working hours, phone numbers, WhatsApp chats, photo galleries, and genuine reviews—while giving local shop owners and service providers an intuitive dashboard to manage their listings without technical complexity.
            </p>
          </div>
        </div>
      </section>

      {/* 3. How BachatLal Works */}
      <section className="container mx-auto px-4 md:px-6 max-w-7xl space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            <span>Simple 4-Step Process</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How BachatLal Works
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base">
            From initial search to direct inquiry, we make discovery seamless and dependable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item) => (
            <div
              key={item.step}
              className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${item.color}`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-black font-mono text-slate-300 dark:text-slate-700">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {item.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. For Customers vs For Businesses */}
      <section className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Customers Card */}
          <div className="p-8 sm:p-12 rounded-[2.5rem] bg-linear-to-br from-slate-50 to-blue-50/30 dark:from-slate-900 dark:to-blue-950/20 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
                  For Customers
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                  Discover reliable local services without the clutter of outdated listings, broken numbers, or unverified claims.
                </p>
              </div>

              <ul className="space-y-3.5">
                {customerBenefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-200">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button
              variant="outline"
              render={<Link href="/#businesses" />}
              className="w-fit rounded-xl font-bold border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/40"
            >
              Browse Categories
            </Button>
          </div>

          {/* Businesses Card */}
          <div className="p-8 sm:p-12 rounded-[2.5rem] bg-linear-to-br from-slate-50 to-red-50/30 dark:from-slate-900 dark:to-red-950/20 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-md shadow-red-600/20">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
                  For Businesses
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                  Establish a commanding online footprint, attract qualified customer leads, and showcase your authentic services.
                </p>
              </div>

              <ul className="space-y-3.5">
                {businessBenefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-200">
                    <CheckCircle2 className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button
              render={<Link href="/sign-up" />}
              className="w-fit rounded-xl font-bold bg-red-600 hover:bg-red-500 text-white shadow-md"
            >
              List Your Business Now
            </Button>
          </div>

        </div>
      </section>

      {/* 5. Mission Section */}
      <section className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="relative rounded-[3rem] bg-slate-950 text-white p-10 sm:p-16 md:p-20 text-center overflow-hidden border border-slate-800 shadow-2xl">
          <div className="absolute inset-0 bg-radial from-red-600/20 via-transparent to-transparent opacity-60 pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-red-400 border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Our Core Mission</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              &ldquo;Make discovering and showcasing local businesses simpler.&rdquo;
            </h2>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              We believe every honest local merchant deserves the opportunity to be discovered, and every customer deserves fast, verified access to the services in their neighborhood.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Final Call to Action */}
      <section className="container mx-auto px-4 md:px-6 max-w-5xl text-center space-y-8">
        <div className="space-y-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Ready to Get Started?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base max-w-xl mx-auto">
            Join thousands of shoppers and businesses who trust BachatLal every day.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            render={<Link href="/#businesses" />}
            className="w-full sm:w-auto h-12 px-8 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm"
          >
            Start Discovering
          </Button>
          <Button
            render={<Link href="/sign-up" />}
            className="w-full sm:w-auto h-12 px-8 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-md"
          >
            List Your Business
          </Button>
        </div>
      </section>

      {/* Organization Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: siteConfig.name,
            url: siteConfig.url,
            logo: `${siteConfig.url}/logo.webp`,
            description: siteConfig.description,
            address: {
              "@type": "PostalAddress",
              addressRegion: "Uttar Pradesh",
              addressCountry: "IN",
            },
            contactPoint: {
              "@type": "ContactPoint",
              email: siteConfig.contact.supportEmail,
              contactType: "Customer Support",
            },
          }),
        }}
      />
    </div>
  );
}
