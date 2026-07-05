"use client";

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

export function FeatureCard({ icon: Icon, title, description, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="flex items-start gap-4 rounded-2xl bg-white/10 p-5 backdrop-blur-md border border-white/10 shadow-xl hover:bg-white/20 transition-colors"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/20 text-white shadow-inner">
        <Icon className="h-6 w-6" />
      </div>
      <div className="space-y-1">
        <h4 className="text-lg font-semibold text-white">{title}</h4>
        <p className="text-sm text-white/80 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}
