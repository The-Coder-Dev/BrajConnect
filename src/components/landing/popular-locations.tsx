"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "./section-header";
import { MapPin } from "lucide-react";

const locations = [
  { name: "Mathura", count: 450, color: "from-blue-500 to-blue-600" },
  { name: "Vrindavan", count: 320, color: "from-orange-400 to-orange-500" },
  { name: "Agra", count: 850, color: "from-emerald-500 to-emerald-600" },
  { name: "Delhi", count: 1200, color: "from-purple-500 to-purple-600" }
];

export function PopularLocations() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6 max-w-[1440px]">
        <SectionHeader 
          title="Popular Locations" 
          subtitle="Explore the most active cities and regions on our platform."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {locations.map((location, index) => (
            <motion.div
              key={location.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group cursor-pointer relative overflow-hidden rounded-3xl h-64 shadow-md hover:shadow-xl transition-all duration-500"
            >
              <div className={`absolute inset-0 bg-linear-to-br ${location.color} opacity-90 group-hover:opacity-100 transition-opacity duration-500`} />
              
              {/* Pattern overlay */}
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
              
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform duration-500">
                  <MapPin className="h-5 w-5" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">{location.name}</h3>
                <p className="text-white/80 font-medium">{location.count}+ Businesses</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
