"use client";

import { motion } from "framer-motion";
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
    image: "/mock/img1.jpg",
    logo: "/mock/logo1.png"
  },
  {
    name: "Brijwasi Royal",
    category: "Hotels",
    location: "Near Railway Station, Mathura",
    rating: 4.6,
    reviews: 892,
    verified: true,
    image: "/mock/img2.jpg",
    logo: "/mock/logo2.png"
  },
  {
    name: "Nayati Medicity",
    category: "Hospitals",
    location: "NH-2, Mathura",
    rating: 4.5,
    reviews: 534,
    verified: true,
    image: "/mock/img3.jpg",
    logo: "/mock/logo3.png"
  },
  {
    name: "Krishna Valley",
    category: "Real Estate",
    location: "Chatikara Road, Vrindavan",
    rating: 4.3,
    reviews: 128,
    verified: false,
    image: "/mock/img4.jpg",
    logo: "/mock/logo4.png"
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function FeaturedBusinesses() {
  return (
    <section id="businesses" className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6 max-w-[1440px]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <SectionHeader 
            title="Premium Businesses" 
            subtitle="Discover top-rated and verified businesses trusted by thousands of customers."
          />
          <Button variant="ghost" className="hidden md:flex text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-semibold mb-12">
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {businesses.map((business, index) => (
            <motion.div key={index} variants={item} className="h-full">
              <BusinessCard {...business} />
            </motion.div>
          ))}
        </motion.div>

        <Button variant="outline" className="w-full md:hidden mt-8 border-slate-200 text-slate-700 font-semibold h-12 rounded-xl">
          View All Businesses
        </Button>
      </div>
    </section>
  );
}
