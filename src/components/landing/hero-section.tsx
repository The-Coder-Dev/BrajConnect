"use client";

import { motion } from "framer-motion";
import { SearchBar } from "@/components/landing/search-bar";

const popularSearches = ["Restaurants", "Hotels", "Hospitals", "Temples", "Shopping"];

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden flex flex-col items-center justify-center min-h-[90vh]">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 bg-slate-50">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-red-400/10 blur-[120px]" />
        <div 
          className="absolute inset-0 opacity-[0.015]" 
          style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }} 
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
            <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
            <span className="text-sm font-medium text-muted-foreground">The premier business directory in Braj</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-6 leading-[1.1]"
          >
            Discover trusted local <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-blue-400">businesses around you.</span>
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
            className="w-full max-w-3xl mx-auto mb-8"
          >
            <SearchBar />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-2 text-sm"
          >
            <span className="text-slate-500 mr-2">Popular:</span>
            {popularSearches.map((term) => (
              <button
                key={term}
                className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50 transition-colors shadow-sm"
              >
                {term}
              </button>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
