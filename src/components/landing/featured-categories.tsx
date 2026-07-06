"use client";

import { motion } from "framer-motion";
import { 
  Utensils, 
  Hotel, 
  Stethoscope, 
  GraduationCap, 
  ShoppingBag, 
  Car, 
  Dumbbell, 
  Scissors,
  Coffee,
  Building,
  HeartPulse,
  Landmark
} from "lucide-react";
import { SectionHeader } from "@/components/landing/section-header";

const categories = [
  { name: "Restaurants", icon: Utensils, count: 120, color: "bg-orange-100 text-orange-600" },
  { name: "Hotels", icon: Hotel, count: 85, color: "bg-blue-100 text-blue-600" },
  { name: "Hospitals", icon: HeartPulse, count: 42, color: "bg-red-100 text-red-600" },
  { name: "Temples", icon: Landmark, count: 56, color: "bg-amber-100 text-amber-600" },
  { name: "Schools", icon: GraduationCap, count: 94, color: "bg-emerald-100 text-emerald-600" },
  { name: "Shopping", icon: ShoppingBag, count: 215, color: "bg-purple-100 text-purple-600" },
  { name: "Automobile", icon: Car, count: 63, color: "bg-slate-100 text-slate-600" },
  { name: "Gyms", icon: Dumbbell, count: 38, color: "bg-zinc-100 text-zinc-800" },
  { name: "Beauty", icon: Scissors, count: 104, color: "bg-pink-100 text-pink-600" },
  { name: "Cafes", icon: Coffee, count: 45, color: "bg-yellow-100 text-yellow-700" },
  { name: "Real Estate", icon: Building, count: 72, color: "bg-indigo-100 text-indigo-600" },
  { name: "Doctors", icon: Stethoscope, count: 156, color: "bg-cyan-100 text-cyan-600" },
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

export function FeaturedCategories() {
  return (
    <section id="categories" className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6 max-w-[1440px]">
        <SectionHeader 
          title="Explore by Category" 
          subtitle="Find exactly what you're looking for from our comprehensive list of local business categories."
          align="center"
        />

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6 mt-12"
        >
          {categories.map((category) => (
            <motion.div key={category.name} variants={item}>
              <a 
                href="#" 
                className="group flex flex-col items-center p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:border-blue-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 text-center cursor-pointer"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${category.color}`}>
                  <category.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{category.name}</h3>
                <p className="text-xs text-slate-500">{category.count} Listings</p>
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
