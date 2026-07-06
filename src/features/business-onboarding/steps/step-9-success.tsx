"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeSlideVariants } from "../animations";
import { CheckCircle2, LayoutDashboard, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Step9Success() {
  return (
    <motion.div
      variants={fadeSlideVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col items-center justify-center h-full max-w-lg mx-auto text-center mt-16"
    >
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", damping: 12, delay: 0.2 }}
        className="h-24 w-24 rounded-full bg-green-50 flex items-center justify-center mb-8 shadow-inner border border-green-100"
      >
        <CheckCircle2 className="h-12 w-12 text-green-500" />
      </motion.div>
      
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4">
        Your business is under review!
      </h1>
      
      <p className="text-lg text-slate-500 mb-10 max-w-md mx-auto leading-relaxed">
        We&apos;ve received your business profile. Our team will review the details shortly. You can manage your business from the dashboard while you wait.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
        <Button 
          className="w-full sm:w-auto rounded-xl px-8 h-12 bg-linear-to-b from-[#3B82F6] to-[#2563EB] hover:from-[#2563EB] hover:to-[#1D4ED8] text-white shadow-md shadow-blue-500/20 transition-all hover:-translate-y-px active:scale-[0.98] active:translate-y-0"
          render={<Link href="/dashboard" />}
          nativeButton={false}
        >
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Go to Dashboard
        </Button>
        <Button 
          variant="outline"
          className="w-full sm:w-auto rounded-xl px-8 h-12 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-sm transition-all hover:-translate-y-px active:scale-[0.98] active:translate-y-0"
          render={<Link href="/" />}
          nativeButton={false}
        >
          <Search className="mr-2 h-4 w-4" />
          Browse Businesses
        </Button>
      </div>
    </motion.div>
  );
}
