import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PRICING_PLANS } from "@/config/pricing";
import { PricingTable } from "@/components/marketing/pricing-table";
import { PricingFaq } from "@/components/marketing/pricing-faq";
import { siteConfig } from "@/config/site";
import {
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Lock,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "BachatLal Pricing | Business Listing Plans",
  description:
    "Explore transparent pricing plans for local businesses on BachatLal. Start with a free verified listing or upgrade for enhanced category placement, lead tracking, and analytics.",
  openGraph: {
    title: "BachatLal Pricing | Business Listing Plans",
    description:
      "Explore transparent pricing plans for local businesses on BachatLal. Start free or scale with Business Pro.",
    url: `${siteConfig.url}/pricing`,
  },
};

export default function PricingPage() {
  return (
    <div className="py-16 md:py-24 space-y-24">
      
      {/* 1. Pricing Hero */}
      <section className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="max-w-3xl mx-auto text-center space-y-5 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-red-500/10 text-red-600 border border-red-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Transparent Business Pricing</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1]">
            Choose the Plan That Fits Your{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-red-600 to-orange-500">
              Business.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Start for free to create a verified presence or upgrade to unlock prominent search positioning, lead analytics, and priority customer inquiries.
          </p>
        </div>

        {/* 2. Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {PRICING_PLANS.map((plan) => (
            <Card
              key={plan.id}
              className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 ${
                plan.highlight
                  ? "border-2 border-red-600 shadow-2xl bg-white dark:bg-slate-900 relative md:-translate-y-2"
                  : "border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
                  Most Popular
                </div>
              )}

              <div className="space-y-6">
                {/* Header */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {plan.name}
                    </h3>
                    {plan.badge && !plan.highlight && (
                      <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider">
                        {plan.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed min-h-10">
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="pb-5 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      {plan.price}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      / {plan.period}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 font-medium">
                    Placement: {plan.limits}
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Features Included
                  </p>
                  <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                    {plan.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5">
                        <div className="w-4 h-4 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
                <Button
                  render={<Link href={plan.ctaHref} />}
                  className={`w-full h-11 rounded-xl text-xs font-bold transition-all ${
                    plan.highlight
                      ? "bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-600/20"
                      : plan.id === "free"
                      ? "bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900"
                      : "border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
                  }`}
                >
                  {plan.ctaText}
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 3. Side-by-Side Comparison Matrix */}
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <PricingTable />
      </div>

      {/* 4. Pricing FAQs */}
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <PricingFaq />
      </div>

      {/* 5. Bottom Conversion CTA */}
      <section className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="relative rounded-[3rem] bg-slate-950 text-white p-10 sm:p-16 text-center overflow-hidden border border-slate-800 shadow-2xl">
          <div className="absolute inset-0 bg-radial from-red-600/30 via-transparent to-transparent opacity-50 pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
              Ready to Expand Your Local Customer Base?
            </h2>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Create your business listing on BachatLal in minutes. Join hundreds of trusted businesses reaching local customers every day.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                render={<Link href="/sign-up" />}
                className="w-full sm:w-auto h-12 px-8 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-600/30"
              >
                Register Your Business Free
              </Button>
              <Button
                variant="outline"
                render={<Link href="/contact" />}
                className="w-full sm:w-auto h-12 px-8 rounded-full border-slate-700 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm"
              >
                Talk to Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
