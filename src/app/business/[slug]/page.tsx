import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { mockBusiness } from '@/features/business/data/mock-business';
import { BusinessHero } from '@/features/business/components/business-hero';
import { BusinessGallery } from '@/features/business/components/business-gallery';
import { BusinessInfo } from '@/features/business/components/business-info';
import { BusinessServices } from '@/features/business/components/business-services';
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

export const metadata: Metadata = {
  title: `${mockBusiness.name} | BrajConnect`,
  description: mockBusiness.description,
};

export default function BusinessDetailsPage({ params }: { params: { slug: string } }) {
  // Mock check for the slug
  // In a real app, we would fetch the business by slug from DB
  if (params.slug !== mockBusiness.slug && params.slug !== 'aura-premium-salon') {
    // We'll just render it anyway for now, but usually it would be notFound()
  }

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden">
      {/* Premium Background Blurs */}
      <div className="absolute top-0 left-0 w-full h-[500px] overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/20 dark:bg-blue-600/20 rounded-full blur-[100px] opacity-70" />
        <div className="absolute top-20 -right-20 w-[30rem] h-[30rem] bg-red-500/10 dark:bg-red-600/10 rounded-full blur-[120px] opacity-50" />
      </div>

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Top Hero Section */}
        <div className="mb-8">
          <BusinessHero business={mockBusiness} />
        </div>

        {/* 2-Column Layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative">
          
          {/* Main Content Column */}
          <div className="flex-1 min-w-0 flex flex-col gap-12">
            <BusinessGallery business={mockBusiness} />
            <BusinessInfo business={mockBusiness} />
            <BusinessServices business={mockBusiness} />
            <BusinessAmenities business={mockBusiness} />
            <BusinessHours business={mockBusiness} />
            <BusinessLocation business={mockBusiness} />
            <BusinessSocials business={mockBusiness} />
            <BusinessContactForm business={mockBusiness} />
            <BusinessReviews business={mockBusiness} />
            <BusinessFaq business={mockBusiness} />
          </div>

          {/* Sticky Right Sidebar */}
          <div className="w-full lg:w-[380px] xl:w-[400px] shrink-0">
            <div className="sticky top-24">
              <BusinessSidebar business={mockBusiness} />
            </div>
          </div>

        </div>

        {/* Bottom Sections */}
        <div className="mt-16 lg:mt-24 space-y-16">
          <RelatedBusinesses business={mockBusiness} />
          <BottomCta />
        </div>
      </main>
    </div>
  );
}
