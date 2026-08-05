import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Lock, ShieldCheck, Zap, Star } from "lucide-react";

export const metadata = {
  title: "Pricing & Plans - BachatLal",
};

export default async function PricingPage() {
  const plans = [
    {
      name: "Free Starter",
      price: "₹0",
      period: "forever",
      description: "Essential listing features to list your local business.",
      badge: "FREE",
      highlight: false,
      features: [
        "1 Verified Business Listing",
        "Basic Contact Details & Hours",
        "Public Search Indexing",
        "Standard Lead Form Enquiries",
        "Customer Review Submissions",
      ],
      limits: "Standard placement",
    },
    {
      name: "Business Pro",
      price: "₹499",
      period: "per month",
      description: "Enhanced tools to drive calls, leads & customer trust.",
      badge: "POPULAR",
      highlight: true,
      features: [
        "Everything in Free",
        "Verified Green Trust Badge",
        "Featured Search Placement",
        "Image Gallery (up to 15 photos)",
        "Direct Call & WhatsApp Tracking",
        "Customer Inquiry CSV Export",
      ],
      limits: "Priority placement",
    },
    {
      name: "Premium Scale",
      price: "₹999",
      period: "per month",
      description: "Maximum visibility, analytics & multi-category reach.",
      badge: "GROWTH",
      highlight: false,
      features: [
        "Everything in Business Pro",
        "Multi-Category Listing (up to 3)",
        "Competitor Benchmark Analytics",
        "Priority Customer Support",
        "Promotional Badge Highlights",
        "Automated Review Moderation",
      ],
      limits: "Top 3 search placement",
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "annual billing",
      description: "Dedicated account manager & multi-location chain management.",
      badge: "ENTERPRISE",
      highlight: false,
      features: [
        "Unlimited Business Locations",
        "Custom API Integrations",
        "Dedicated Account Specialist",
        "Custom SLA & Uptime Guarantee",
        "Full Branding Customization",
      ],
      limits: "Unlimited scale",
    },
  ];

  return (
    <div className="space-y-8 py-4 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <Badge className="bg-red-500/10 text-red-600 border-red-500/20 text-xs px-3.5 py-1 rounded-full font-bold">
          <Sparkles className="w-3.5 h-3.5 mr-1" /> Transparent Business Pricing
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Choose the Right Plan to Grow</h1>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          Scale your local presence on BachatLal. All paid subscription plans are currently in preview mode.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 pt-4">
        {plans.map((plan, idx) => (
          <Card
            key={idx}
            className={`rounded-3xl p-6 flex flex-col justify-between transition-all ${
              plan.highlight
                ? "border-2 border-red-600 shadow-xl bg-card relative"
                : "border-border/60 shadow-xs bg-card hover:shadow-md"
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                Most Popular
              </div>
            )}

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <Badge variant="outline" className="text-[10px] uppercase font-bold">
                    {plan.badge}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{plan.description}</p>
              </div>

              <div className="pb-4 border-b border-border/40">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-foreground">{plan.price}</span>
                  <span className="text-xs text-muted-foreground font-medium">/ {plan.period}</span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1 font-medium">{plan.limits}</p>
              </div>

              <div className="space-y-2.5">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Features Included</p>
                <ul className="space-y-2 text-xs">
                  {plan.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2 text-muted-foreground">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-border/40">
              <Button
                disabled
                className={`w-full rounded-xl font-bold text-xs gap-1.5 h-11 ${
                  plan.highlight
                    ? "bg-red-600 hover:bg-red-700 text-white opacity-80"
                    : "variant-outline"
                }`}
              >
                <Lock className="w-3.5 h-3.5 text-amber-500" />
                Coming Soon
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
