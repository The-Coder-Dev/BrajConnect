import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { mockBusiness } from '@/features/business/data/mock-business';
import { BusinessHero } from '@/features/business/components/business-hero';
import { BusinessGallery } from '@/features/business/components/business-gallery';
import { BusinessInfo } from '@/features/business/components/business-info';
// import { BusinessServices } from '@/features/business/components/business-services';
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

export const metadata: Metadata = {
  title: `${mockBusiness.name} | BrajConnect`,
  description: mockBusiness.description,
};

export default async function BusinessDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug !== mockBusiness.slug && slug !== 'aura-premium-salon') {
    // We'll render anyway, but usually this is notFound()
  }

  return (
    <div className="relative min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden">
      <Navbar variant="solid" />
      
      {/* Top Full-Width Cover Image */}
      <div className="relative w-full h-[250px] sm:h-[300px] lg:h-[350px] bg-slate-100 dark:bg-slate-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={mockBusiness.coverImage} 
          alt={`${mockBusiness.name} Cover`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-black/10" />
      </div>

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pb-12 lg:pb-24">
        
        {/* 2-Column Layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative -mt-16 sm:-mt-20">
          
          {/* Main Content Column (70%) */}
          <div className="flex-1 w-full lg:w-[68%] flex flex-col gap-10">
            {/* The Hero component will now only handle the Logo and Title/Stats portion */}
            <BusinessHero business={mockBusiness} />
            
            <BusinessInfo business={mockBusiness} />
            <BusinessGallery business={mockBusiness} />
            <BusinessAmenities business={mockBusiness} />
            {/* <BusinessServices business={mockBusiness} /> */}
            <BusinessReviews business={mockBusiness} />
            <BusinessFaq business={mockBusiness} />
            <BusinessSocials business={mockBusiness} />
            <RelatedBusinesses business={mockBusiness} />
          </div>

          {/* Sticky Right Sidebar (30%) */}
          <div className="w-full lg:w-[32%] shrink-0">
            <div className="sticky top-24 flex flex-col gap-6">
              <BusinessHours business={mockBusiness} />
              <BusinessContactForm business={mockBusiness} />
              <BusinessSidebar business={mockBusiness} />
              <BusinessLocation business={mockBusiness} />
            </div>
          </div>

        </div>

        {/* Bottom Sections */}
        <div className="mt-16 lg:mt-24">
          <BottomCta />
        </div>
      </main>

      <Footer />
    </div>
  );
}
