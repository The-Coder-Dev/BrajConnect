"use client";

import { FeatureCard } from "./feature-card";
import { Building2, Users, LineChart } from "lucide-react";
import { motion } from "framer-motion";

export function HeroPanel() {
  return (
    <div className="relative hidden lg:flex flex-1 flex-col overflow-hidden bg-primary">
      {/* Abstract Background Effects */}
      <div className="absolute -left-20 top-0 h-[500px] w-[500px] rounded-full bg-red-300/30 blur-[120px]" />
      <div className="absolute -right-20 bottom-0 h-[400px] w-[400px] rounded-full bg-red-400/20 blur-[100px]" />
      <div className="absolute right-20 top-20 h-[300px] w-[300px] rounded-full bg-red-500/20 blur-[80px]" />
      
      <div className="relative z-10 flex h-full flex-col justify-center px-16 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 max-w-xl"
        >
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-white lg:text-5xl">
            Scale your business with confidence.
          </h2>
          <p className="text-lg text-white/80">
            Join thousands of premium businesses leveraging our platform for unparalleled growth, seamless collaboration, and advanced analytics.
          </p>
        </motion.div>

        <div className="flex flex-col gap-4">
          <FeatureCard 
            icon={Building2}
            title="Business Listings"
            description="Create rich, compelling profiles that attract premium clients and boost your local SEO effortlessly."
            delay={0.1}
          />
          <FeatureCard 
            icon={Users}
            title="Team Collaboration"
            description="Manage your staff, assign roles, and streamline your operations from one unified dashboard."
            delay={0.2}
          />
          <FeatureCard 
            icon={LineChart}
            title="Advanced Analytics"
            description="Track your performance, monitor visitor engagement, and make data-driven decisions."
            delay={0.3}
          />
        </div>
      </div>
    </div>
  );
}
