"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "./section-header";
import { ShieldCheck, Search, Star, Store, Map, Smartphone } from "lucide-react";

const features = [
  {
    title: "Verified Listings",
    description: "Every business with a verified badge has been manually checked and authenticated by our team.",
    icon: ShieldCheck,
    color: "bg-emerald-100 text-emerald-600"
  },
  {
    title: "Smart Search",
    description: "Find exactly what you need with our intelligent search algorithm that understands your intent.",
    icon: Search,
    color: "bg-blue-100 text-blue-600"
  },
  {
    title: "Rich Profiles",
    description: "View photos, menus, services, and read genuine reviews before making a decision.",
    icon: Store,
    color: "bg-indigo-100 text-indigo-600"
  },
  {
    title: "Location Based",
    description: "Discover the best options nearest to you with our precise location mapping.",
    icon: Map,
    color: "bg-orange-100 text-orange-600"
  },
  {
    title: "Genuine Reviews",
    description: "Read experiences from real customers to help you make informed choices.",
    icon: Star,
    color: "bg-yellow-100 text-yellow-600"
  },
  {
    title: "Mobile Ready",
    description: "Access BrajConnect seamlessly from any device, anywhere you go.",
    icon: Smartphone,
    color: "bg-purple-100 text-purple-600"
  }
];

export function WhyBrajConnect() {
  return (
    <section id="about" className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 max-w-[1440px] relative z-10">
        <SectionHeader 
          title="Why Choose BrajConnect" 
          subtitle="We're building the most reliable and comprehensive business discovery platform for the Braj region."
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-200 transition-all duration-300"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${feature.color}`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
