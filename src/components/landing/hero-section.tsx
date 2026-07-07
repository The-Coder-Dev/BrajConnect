"use client";

import { motion } from "framer-motion";
import { SearchBar } from "@/components/landing/search-bar";
import { Star } from "lucide-react";

const popularSearches = ["Restaurants", "Hotels", "Hospitals", "Doctors", "Temples", "Shopping"];

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden flex flex-col items-center justify-center min-h-[90vh]">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 bg-slate-50 overflow-hidden">
        {/* Soft blue radial gradient */}
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-500/10 blur-[140px]" />
        {/* Subtle red glow */}
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-red-500/5 blur-[120px]" />
        {/* Blurred floating gradient blobs */}
        <motion.div 
          animate={{ x: [0, 30, 0], y: [0, -40, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-blue-300/10 blur-[100px]" 
        />
        {/* Faint grid background texture */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
        />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-[1440px]">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-border shadow-sm mb-6"
          >
            <span className="flex h-2 w-2 rounded-full animate-pulse bg-blue-600"></span>
            <span className="text-sm font-medium text-muted-foreground">The premier business directory in Braj</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-6xl md:text-7xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.05]"
          >
            Discover trusted local <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-blue-400 drop-shadow-sm">Businesses around you.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto"
          >
            Find the best restaurants, hotels, services, and shops in Mathura, Vrindavan, and beyond with real reviews and verified details.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-full max-w-4xl mx-auto mb-10 relative z-20"
          >
            <SearchBar />
          </motion.div>
          
          {/* Trust Row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-sm md:text-base font-medium text-slate-600 mb-12"
          >
            <div className="flex items-center gap-2">
              <span className="text-slate-900 font-bold">15,000+</span>
              <span>Businesses</span>
            </div>
            <div className="h-1 w-1 rounded-full bg-slate-300 hidden md:block"></div>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-900 font-bold">4.9</span>
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Average Rating</span>
            </div>
            <div className="h-1 w-1 rounded-full bg-slate-300 hidden md:block"></div>
            <div className="flex items-center gap-2">
              <span className="text-slate-900 font-bold">40+</span>
              <span>Categories</span>
            </div>
            <div className="h-1 w-1 rounded-full bg-slate-300 hidden md:block"></div>
            <div className="flex items-center gap-2">
              <span className="text-slate-900 font-bold">100K+</span>
              <span>Monthly Visitors</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-2 text-sm z-10"
          >
            <span className="text-slate-500 mr-2 font-medium">Popular:</span>
            {popularSearches.map((term, i) => (
              <motion.button
                key={term}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.6 + i * 0.05 }}
                className="px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-slate-200/60 text-slate-700 hover:border-blue-400 hover:text-blue-700 hover:bg-blue-50/80 hover:shadow-md transition-all cursor-pointer font-medium"
              >
                {term}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
