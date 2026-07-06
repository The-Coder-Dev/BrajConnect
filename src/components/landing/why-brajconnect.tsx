"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "./section-header";
import { ShieldCheck, Search, Star, Store, Map, Smartphone } from "lucide-react";

const features = [
  {
    title: "Verified Listings",
    description: "Every business with a verified badge has been manually checked and authenticated by our team.",
    icon: ShieldCheck,
    color: "bg-emerald-50 text-emerald-600",
    className: "md:col-span-2 lg:col-span-2 row-span-2",
    hasImage: true
  },
  {
    title: "Smart Search",
    description: "Find exactly what you need with our intelligent search algorithm.",
    icon: Search,
    color: "bg-blue-50 text-blue-600",
    className: "md:col-span-1 lg:col-span-1",
  },
  {
    title: "Rich Profiles",
    description: "View photos, menus, services, and read genuine reviews.",
    icon: Store,
    color: "bg-indigo-50 text-indigo-600",
    className: "md:col-span-1 lg:col-span-1",
  },
  {
    title: "Location Based",
    description: "Discover the best options nearest to you with our precise location mapping.",
    icon: Map,
    color: "bg-orange-50 text-orange-600",
    className: "md:col-span-1 lg:col-span-1",
  },
  {
    title: "Genuine Reviews",
    description: "Read experiences from real customers to help you make informed choices.",
    icon: Star,
    color: "bg-yellow-50 text-yellow-600",
    className: "md:col-span-1 lg:col-span-1",
  },
];

export function WhyBrajConnect() {
  return (
    <section id="about" className="py-32 bg-slate-50 relative overflow-hidden">
      {/* Subtle Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/40 via-slate-50 to-slate-50 pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-6 max-w-[1440px] relative z-10">
        <div className="max-w-3xl mx-auto mb-20 text-center">
          <SectionHeader 
            title="Why Choose BrajConnect" 
            subtitle="We're building the most reliable and comprehensive business discovery platform for the Braj region, designed with a premium experience in mind."
            align="center"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[minmax(180px,auto)]">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1, type: "spring", stiffness: 100 }}
              className={`group relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-200/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 p-8 flex flex-col ${feature.className || ""}`}
            >
              {/* Subtle inner gradient */}
              <div className="absolute inset-0 bg-linear-to-br from-transparent to-slate-50/50 pointer-events-none" />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 ${feature.color}`}>
                  <feature.icon className="h-7 w-7" />
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  {feature.description}
                </p>
                
                {feature.hasImage && (
                  <div className="mt-8 relative flex-1 min-h-[150px] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/50 group-hover:border-blue-200 transition-colors">
                    {/* Abstract placeholder visual */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px]" />
                    <div className="absolute inset-0 bg-linear-to-tr from-emerald-100/50 to-blue-100/50 mix-blend-multiply" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-64 h-64 bg-emerald-400/20 blur-3xl rounded-full group-hover:bg-emerald-400/30 transition-colors duration-700" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                      <ShieldCheck className="w-24 h-24 text-emerald-500/20 group-hover:scale-110 transition-transform duration-700" />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
