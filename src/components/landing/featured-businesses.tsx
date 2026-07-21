import { SectionHeader } from "./section-header";
import { BusinessCard } from "./business-card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const businesses = [
  {
    name: "Govinda's Restaurant",
    category: "Restaurants",
    location: "Raman Reti, Vrindavan",
    rating: 4.8,
    reviews: 1245,
    verified: true,
    description: "Authentic pure vegetarian satvik food with a divine ambiance.",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    logo: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=150&q=80"
  },
  {
    name: "Brijwasi Royal",
    category: "Hotels",
    location: "Near Railway Station, Mathura",
    rating: 4.6,
    reviews: 892,
    verified: true,
    description: "Premium luxury stays with world-class amenities in the heart of the city.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    logo: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=150&q=80"
  },
  {
    name: "Nayati Medicity",
    category: "Hospitals",
    location: "NH-2, Mathura",
    rating: 4.5,
    reviews: 534,
    verified: true,
    description: "Multi-super specialty hospital providing advanced healthcare services.",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
    logo: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=150&q=80"
  },
  {
    name: "Krishna Valley",
    category: "Real Estate",
    location: "Chatikara Road, Vrindavan",
    rating: 4.3,
    reviews: 128,
    verified: false,
    description: "Modern luxury apartments surrounded by spiritual serenity.",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
    logo: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=150&q=80"
  }
];

export function FeaturedBusinesses() {
  return (
    <section id="businesses" className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6 max-w-[1440px]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <SectionHeader 
            title="Premium Businesses" 
            subtitle="Discover top-rated and verified businesses trusted by thousands of customers."
          />
          <Button variant="ghost" className="hidden md:flex text-red-600 hover:text-red-700 hover:bg-red-50 font-semibold mb-12">
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {businesses.map((business, index) => (
            <div key={index} className="h-full">
              <BusinessCard {...business} />
            </div>
          ))}
        </div>

        <Button className="w-full md:hidden mt-8 border-red-600 text-red-600 font-semibold h-12 rounded-xl">
          View All Businesses
        </Button>
      </div>
    </section>
  );
}

