"use client";

import React from "react";
import { motion } from "framer-motion";

export function AssistantProgress({ value }: { value: number }) {
  return (
    <div className="h-1.5 w-full bg-secondary/20 rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-blue-600 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    </div>
  );
}
