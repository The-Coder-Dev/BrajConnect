"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeSlideVariants } from "../animations";
import { AssistantCard, AssistantQuestion } from "../components/ui/assistant-card";
import { Building2, Clock } from "lucide-react";

export function Step1Welcome() {
  return (
    <motion.div
      variants={fadeSlideVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col items-center justify-center h-full max-w-lg mx-auto text-center mt-12 sm:mt-24"
    >
      <div className="relative mb-10">
        <div className="absolute inset-0 bg-blue-400 blur-2xl opacity-20 rounded-full" />
        <div className="relative h-24 w-24 rounded-[32px] bg-linear-to-b from-white to-blue-50/50 flex items-center justify-center shadow-[0_8px_30px_rgb(37,99,235,0.12)] border border-blue-100/60 backdrop-blur-sm">
          <Building2 className="h-12 w-12 text-blue-600" strokeWidth={1.5} />
        </div>
      </div>
      
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 mb-6 drop-shadow-sm">
        Let&apos;s get your business online.
      </h1>
      
      <p className="text-lg text-slate-500 mb-12 max-w-[420px] mx-auto leading-relaxed">
        We&apos;ll guide you through setting up your business profile so customers can find and connect with you.
      </p>

      <div className="flex items-center justify-center gap-2 text-sm font-medium text-[#2563EB] bg-blue-50/80 px-4 py-2 rounded-full border border-blue-200/50 shadow-sm backdrop-blur-md">
        <Clock className="h-4 w-4 opacity-80" />
        Estimated time: 3–5 minutes
      </div>
    </motion.div>
  );
}
