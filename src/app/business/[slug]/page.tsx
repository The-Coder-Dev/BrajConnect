import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublishedBusinessBySlug } from '@/server/queries/public/businesses';
import { BusinessHero } from '@/features/business/components/business-hero';
import { BusinessGallery } from '@/features/business/components/business-gallery';
import { BusinessInfo } from '@/features/business/components/business-info';
import { BusinessAmenities } from '@/features/business/components/business-amenities';
import { BusinessHours } from '@/features/business/components/business-hours';
import { BusinessLocation } from '@/features/business/components/business-location';
import { BusinessSocials } from '@/features/business/components/business-socials';
import { BusinessContactForm } from '@/features/business/components/business-contact-form';
import { BusinessSidebar } from '@/features/business/components/business-sidebar';
import { BusinessReviews } from '@/features/business/components/business-reviews';
import { BusinessFaq } from '@/features/business/components/business-faq';
import { RelatedBusinesses } from '@/features/business/components/related-businesses';
import { BottomCta } from '@/features/business/components/bottom-cta';
import { Navbar } from '@/components/landing/navbar';
import { Footer } from '@/components/landing/footer';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const business = await getPublishedBusinessBySlug(slug);

  if (!business) {
    return {
      title: 'Business Not Found | BachatLal',
      description: 'The requested business is not available.',
    };
  }

  return {
    title: `${business.name} | BachatLal`,
    description: business.shortDescription || business.fullDescription || `${business.name} listing on BachatLal`,
  };
}

export default async function BusinessDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const business = await getPublishedBusinessBySlug(slug);

  if (!business) {
    notFound();
  }

  return (
    <div className="relative min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden select-none">
      <Navbar variant="solid" />
      
      {/* Top Cover Image */}
      <div className="relative w-full h-62.5 sm:h-75 lg:h-85.5 bg-slate-100 dark:bg-slate-800">
        <img 
          src={business.coverUrl} 
          alt={`${business.name} Cover`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-black/10" />
      </div>

      <main className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 pb-12 lg:pb-24">
        
        {/* 2-Column Layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative -mt-16 sm:-mt-20">
          
          {/* Main Content Column (70%) */}
          <div className="flex-1 w-full lg:w-[68%] flex flex-col gap-10">
            <BusinessHero business={business} />
            <BusinessInfo business={business} />
            <BusinessGallery business={business} />
            <BusinessAmenities business={business} />
            <BusinessReviews business={business} />
            <BusinessFaq business={business} />
            <BusinessSocials business={business} />
            <RelatedBusinesses business={business} />
          </div>

          {/* Sticky Right Sidebar (30%) */}
          <div className="w-full lg:w-[32%] shrink-0">
            <div className="sticky top-24 flex flex-col gap-6">
              <BusinessHours business={business} />
              <BusinessContactForm business={business} />
              <BusinessSidebar business={business} />
              <BusinessLocation business={business} />
            </div>
          </div>

        </div>

        {/* Bottom CTA */}
        <div className="mt-16 lg:mt-24">
          <BottomCta />
        </div>
      </main>

      <Footer />
    </div>
  );
}
