import { Navbar } from "@/components/landing/navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturedCategories } from "@/components/landing/featured-categories";
import { FeaturedBusinesses } from "@/components/landing/featured-businesses";
import { WhyBrajConnect } from "@/components/landing/why-brajconnect";
import { PopularLocations } from "@/components/landing/popular-locations";
import { HowItWorks } from "@/components/landing/how-it-works";
import { CTASection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      {/* Global Background Texture */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />
      
      <div className="relative z-10">
        <Navbar variant="transparent" />
        <HeroSection />
        <FeaturedCategories />
        <FeaturedBusinesses />
      <WhyBrajConnect />
      <PopularLocations />
      <HowItWorks />
      <CTASection />
      <Footer />
      </div>
    </main>
  );
}

