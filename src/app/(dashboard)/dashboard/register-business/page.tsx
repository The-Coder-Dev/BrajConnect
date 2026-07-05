import { requireAuth } from "@/lib/auth/guards";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Users, Star, Megaphone } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Register Your Business - BrajConnect",
};

export default async function RegisterBusinessPage() {
  await requireAuth();

  const features = [
    {
      icon: Users,
      title: "Reach More Customers",
      description: "Connect with a larger audience looking for your specific services in the region.",
    },
    {
      icon: TrendingUp,
      title: "Manage Your Business",
      description: "Get access to powerful tools to manage listings, operational hours, and leads.",
    },
    {
      icon: Star,
      title: "Receive Reviews",
      description: "Build trust through authentic customer reviews and elevate your brand reputation.",
    },
    {
      icon: Megaphone,
      title: "Increase Visibility",
      description: "Boost your local SEO and stand out from competitors with a premium listing.",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center max-w-4xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="space-y-6 mb-16">
        <div className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-3 py-1 text-sm text-red-600 font-medium mb-4">
          <span className="flex h-2 w-2 rounded-full bg-red-600 mr-2 animate-pulse"></span>
          Business Portal Coming Soon
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance">
          Grow Your Business <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-red-600 to-orange-500">With Us</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
          Unlock exclusive tools to manage your digital storefront, interact with customers, and drive unparalleled growth.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid md:grid-cols-2 gap-6 w-full mb-16">
        {features.map((feature, idx) => (
          <div key={idx} className="flex flex-col items-center text-center p-6 rounded-xl bg-card border border-border/50 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
            <div className="h-12 w-12 rounded-lg bg-red-50 text-red-600 flex items-center justify-center mb-4">
              <feature.icon className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <Button size="lg" className="rounded-lg px-8 h-14 text-base font-semibold bg-linear-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 shadow-lg shadow-red-500/20" disabled>
          Register Your Business
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        <Button size="lg" variant="outline" className="rounded-lg px-8 h-14 text-base font-semibold border-border/50" render={<Link href="/dashboard" />}>
          Return to Dashboard
        </Button>
      </div>
      <p className="text-sm text-muted-foreground mt-4">
        We are currently rolling out the business portal to select partners.
      </p>
    </div>
  );
}
