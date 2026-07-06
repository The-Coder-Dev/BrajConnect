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
    <main className="min-h-screen bg-background font-sans selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      <HeroSection />
      <FeaturedCategories />
      <FeaturedBusinesses />
      <WhyBrajConnect />
      <PopularLocations />
      <HowItWorks />
      <CTASection />
      <Footer />
    </main>
  );
}

