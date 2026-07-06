"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "./section-header";
import { MapPin, ArrowUpRight } from "lucide-react";

const locations = [
  { name: "Mathura", count: 450, color: "from-blue-600 to-blue-800", shadow: "hover:shadow-blue-500/25" },
  { name: "Vrindavan", count: 320, color: "from-orange-500 to-orange-700", shadow: "hover:shadow-orange-500/25" },
  { name: "Agra", count: 850, color: "from-emerald-600 to-emerald-800", shadow: "hover:shadow-emerald-500/25" },
  { name: "Delhi", count: 1200, color: "from-purple-600 to-purple-800", shadow: "hover:shadow-purple-500/25" }
];

export function PopularLocations() {
  return (
    <section className="py-32 bg-white relative">
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-slate-200 to-transparent"></div>
      
      <div className="container mx-auto px-4 md:px-6 max-w-[1440px]">
        <SectionHeader 
          title="Popular Locations" 
          subtitle="Explore the most active cities and regions on our platform."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {locations.map((location, index) => (
            <motion.div
              key={location.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1, type: "spring", stiffness: 100 }}
              className={`group cursor-pointer relative overflow-hidden rounded-[2rem] h-[300px] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ${location.shadow}`}
            >
              {/* Soft Gradient Background */}
              <div className={`absolute inset-0 bg-linear-to-br ${location.color} opacity-95 group-hover:opacity-100 transition-opacity duration-500`} />
              
              {/* Abstract City Silhouette / Wave Pattern */}
              <div className="absolute bottom-0 left-0 right-0 h-32 opacity-20 group-hover:opacity-30 transition-opacity duration-500 mix-blend-overlay">
                <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full h-full text-white fill-current">
                  <path fillOpacity="1" d="M0,256L48,229.3C96,203,192,149,288,154.7C384,160,480,224,576,218.7C672,213,768,139,864,128C960,117,1056,171,1152,197.3C1248,224,1344,224,1392,224L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>
              </div>
              
              {/* Tiny decorative pattern */}
              <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 2px, transparent 0)', backgroundSize: '24px 24px' }} />
              
              <div className="absolute inset-0 p-8 flex flex-col">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-white/30 transition-all duration-500 shadow-inner">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/0 flex items-center justify-center text-white opacity-0 -translate-x-4 group-hover:bg-white/20 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                    <ArrowUpRight className="h-5 w-5" />
                  </div>
                </div>
                
                <div className="mt-auto transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-3xl font-bold text-white mb-2 tracking-tight">{location.name}</h3>
                  <p className="text-white/90 font-medium">{location.count}+ Businesses</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
