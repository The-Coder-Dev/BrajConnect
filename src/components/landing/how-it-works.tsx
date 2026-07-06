"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "./section-header";
import { Search, Compass, MessageSquare } from "lucide-react";

const steps = [
  {
    title: "Search",
    description: "Enter your requirement and location to find the best businesses around you.",
    icon: Search,
    color: "bg-blue-50 text-blue-600 border-blue-200 shadow-blue-500/20"
  },
  {
    title: "Explore",
    description: "Check reviews, ratings, photos, and detailed profiles to make the right choice.",
    icon: Compass,
    color: "bg-emerald-50 text-emerald-600 border-emerald-200 shadow-emerald-500/20"
  },
  {
    title: "Connect",
    description: "Contact the business directly through call or message to get your work done.",
    icon: MessageSquare,
    color: "bg-purple-50 text-purple-600 border-purple-200 shadow-purple-500/20"
  }
];

export function HowItWorks() {
  return (
    <section className="py-32 bg-slate-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[400px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-6 max-w-[1440px] relative z-10">
        <SectionHeader 
          title="How It Works" 
          subtitle="Three simple steps to find exactly what you need in seconds."
          align="center"
        />

        <div className="relative mt-24 max-w-5xl mx-auto">
          {/* Animated Connecting Line */}
          <div className="hidden md:block absolute top-16 left-[15%] right-[15%] h-1 bg-slate-200 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: "0%" }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
              className="h-full bg-linear-to-r from-blue-500 via-emerald-400 to-purple-500"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.3, type: "spring", stiffness: 100 }}
                className="relative flex flex-col items-center text-center group"
              >
                <div className={`w-32 h-32 rounded-[2.5rem] flex items-center justify-center mb-8 border border-white shadow-xl bg-white/60 backdrop-blur-xl group-hover:-translate-y-2 transition-all duration-500 ${step.color}`}>
                  <step.icon className="h-12 w-12 group-hover:scale-110 transition-transform duration-500" />
                  
                  {/* Step Number Badge */}
                  <div className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-lg border-4 border-slate-50 group-hover:bg-blue-600 transition-colors duration-500">
                    {index + 1}
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight group-hover:text-blue-600 transition-colors duration-300">{step.title}</h3>
                <p className="text-slate-600 font-medium leading-relaxed max-w-xs">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
