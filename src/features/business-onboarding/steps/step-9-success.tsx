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
      {/* Success Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", damping: 12, delay: 0.2 }}
        className="h-24 w-24 rounded-full bg-green-50 flex items-center justify-center mb-6 shadow-inner border border-green-100"
      >
        <CheckCircle2 className="h-12 w-12 text-green-500" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-4xl mb-4"
      >
        🎉
      </motion.div>

      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4">
        Business Submitted Successfully!
      </h1>

      <p className="text-lg text-slate-500 mb-4 max-w-md mx-auto leading-relaxed">
        Your business profile is now under review by our team.
      </p>

      {/* Estimated review time */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl px-6 py-4 mb-10 max-w-sm w-full">
        <p className="text-sm font-semibold text-blue-800 mb-1">Estimated Review Time</p>
        <p className="text-2xl font-bold text-blue-600">24–48 hours</p>
        <p className="text-xs text-blue-500 mt-1">
          You&apos;ll receive an email once your business is approved.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
        <Button
          render={<Link href="/dashboard" />}
          nativeButton={false}
          className="w-full sm:w-auto rounded-xl px-8 h-12 bg-linear-to-b from-[#3B82F6] to-[#2563EB] hover:from-[#2563EB] hover:to-[#1D4ED8] text-white shadow-md shadow-blue-500/20 transition-all hover:-translate-y-px active:scale-[0.98] active:translate-y-0"
        >
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Go to Dashboard
        </Button>
        <Button
          render={<Link href="/" />}
          nativeButton={false}
          variant="outline"
          className="w-full sm:w-auto rounded-xl px-8 h-12 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-sm transition-all hover:-translate-y-px active:scale-[0.98] active:translate-y-0"
        >
          <Search className="mr-2 h-4 w-4" />
          Browse Businesses
        </Button>
      </div>
    </motion.div>
  );
}
