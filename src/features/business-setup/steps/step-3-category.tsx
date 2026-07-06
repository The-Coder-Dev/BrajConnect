"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeSlideVariants } from "../animations";
import { AssistantCard, AssistantQuestion } from "../components/ui/assistant-card";
import { useFormContext } from "react-hook-form";
import { BusinessSetupInput } from "@/lib/validations/business/setup";
import { Store, Coffee, Wrench, Stethoscope, Briefcase, Code, Utensils, Scissors, MonitorPlay } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock categories for UI implementation
const CATEGORIES = [
  { id: "cat_retail", name: "Retail & Shopping", icon: Store },
  { id: "cat_food", name: "Food & Dining", icon: Utensils },
  { id: "cat_home", name: "Home Services", icon: Wrench },
  { id: "cat_health", name: "Health & Medical", icon: Stethoscope },
  { id: "cat_prof", name: "Professional Services", icon: Briefcase },
  { id: "cat_tech", name: "Tech & Software", icon: Code },
  { id: "cat_beauty", name: "Beauty & Spa", icon: Scissors },
  { id: "cat_ent", name: "Entertainment", icon: MonitorPlay },
  { id: "cat_cafe", name: "Cafe & Bakery", icon: Coffee },
];

export function Step3Category() {
  const { watch, setValue, formState: { errors } } = useFormContext<BusinessSetupInput>();
  const selectedCategory = watch("categoryId");

  return (
    <motion.div
      variants={fadeSlideVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-2xl mx-auto mt-8"
    >
      <AssistantCard>
        <AssistantQuestion>What best describes your business?</AssistantQuestion>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-8">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const Icon = cat.icon;
            
            return (
              <div
                key={cat.id}
                onClick={() => setValue("categoryId", cat.id, { shouldValidate: true })}
                className={cn(
                  "flex flex-col items-center justify-center p-5 text-center rounded-2xl cursor-pointer transition-all duration-300 border-2",
                  isSelected 
                    ? "border-blue-500 bg-blue-50/50 text-blue-700 shadow-[0_4px_14px_rgb(37,99,235,0.08)] scale-[0.98]" 
                    : "border-slate-100 bg-white hover:border-blue-200 hover:bg-slate-50/50 text-slate-500 hover:text-slate-900 shadow-sm hover:shadow-[0_4px_14px_rgb(0,0,0,0.04)]"
                )}
              >
                <Icon className={cn("h-7 w-7 mb-3 transition-colors duration-300", isSelected ? "text-blue-600" : "text-slate-400 group-hover:text-blue-500")} strokeWidth={isSelected ? 2 : 1.5} />
                <span className="text-sm font-semibold">{cat.name}</span>
              </div>
            );
          })}
        </div>
        
        {errors.categoryId && (
          <p className="text-red-500 text-sm mt-4 font-medium text-center">{errors.categoryId.message}</p>
        )}
      </AssistantCard>
    </motion.div>
  );
}
