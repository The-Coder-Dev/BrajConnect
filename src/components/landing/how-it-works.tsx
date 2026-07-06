"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "./section-header";
import { Search, Compass, MessageSquare } from "lucide-react";

const steps = [
  {
    title: "Search",
    description: "Enter your requirement and location to find the best businesses around you.",
    icon: Search,
    color: "bg-blue-100 text-blue-600 border-blue-200"
  },
  {
    title: "Explore",
    description: "Check reviews, ratings, photos, and detailed profiles to make the right choice.",
    icon: Compass,
    color: "bg-emerald-100 text-emerald-600 border-emerald-200"
  },
  {
    title: "Connect",
    description: "Contact the business directly through call or message to get your work done.",
    icon: MessageSquare,
    color: "bg-purple-100 text-purple-600 border-purple-200"
  }
];

export function HowItWorks() {
  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-4 md:px-6 max-w-[1440px]">
        <SectionHeader 
          title="How It Works" 
          subtitle="Three simple steps to find exactly what you need in seconds."
          align="center"
        />

        <div className="relative mt-20 max-w-5xl mx-auto">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-slate-100" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative flex flex-col items-center text-center group"
              >
                <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-8 border-2 shadow-lg shadow-slate-200/50 relative z-10 bg-white group-hover:scale-110 transition-transform duration-500 ${step.color}`}>
                  <step.icon className="h-10 w-10" />
                  
                  {/* Step Number Badge */}
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-md">
                    {index + 1}
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed max-w-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
