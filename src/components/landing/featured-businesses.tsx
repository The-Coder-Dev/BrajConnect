import { SectionHeader } from "./section-header";
import { BusinessCard } from "./business-card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Store } from "lucide-react";
import Link from "next/link";
import { getPublicBusinesses } from "@/server/queries/public/businesses";

export async function FeaturedBusinesses() {
  const { items: businesses } = await getPublicBusinesses({
    limit: 8,
    sort: "featured",
  });

  return (
    <section id="businesses" className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6 max-w-[1440px]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <SectionHeader
            title="Verified Businesses"
            subtitle="Discover top-rated and verified businesses trusted by thousands of customers in Braj."
          />
          {businesses.length > 0 && (
            <Button
              variant="ghost"
              className="hidden md:flex text-red-600 hover:text-red-700 hover:bg-red-50 font-semibold mb-12 cursor-pointer"
              render={<Link href="/business" />}
            >
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        {businesses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {businesses.map((b) => (
              <div key={b.id} className="h-full">
                <BusinessCard
                  name={b.name}
                  category={b.category?.name || "General"}
                  location={b.location.city ? `${b.location.city}, ${b.location.state}` : b.location.formattedAddress}
                  rating={b.rating.average}
                  reviews={b.rating.count}
                  verified={b.isVerified}
                  description={b.shortDescription || undefined}
                  image={b.coverUrl}
                  logo={b.logoUrl}
                  slug={b.slug}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-slate-200/80 text-center max-w-2xl mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4">
              <Store className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Published Businesses Yet</h3>
            <p className="text-slate-600 text-sm mb-6 max-w-md">
              Businesses approved by our admin team will appear here automatically. Are you a local business owner?
            </p>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl px-6 h-11 shadow-md cursor-pointer"
              render={<Link href="/business/onboarding" />}
            >
              Register Your Business Now
            </Button>
          </div>
        )}

        {businesses.length > 0 && (
          <Button
            className="w-full md:hidden mt-8 border-red-600 text-red-600 font-semibold h-12 rounded-xl"
            render={<Link href="/business" />}
          >
            View All Businesses
          </Button>
        )}
      </div>
    </section>
  );
}
