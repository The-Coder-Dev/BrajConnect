"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fadeSlideVariants } from "../animations";
import { AssistantCard, AssistantQuestion } from "../components/ui/assistant-card";
import { useFormContext } from "react-hook-form";
import { BusinessSetupInput } from "@/lib/validations/business/setup";
import { Store, Coffee, Wrench, Stethoscope, Briefcase, Code, Utensils, Scissors, MonitorPlay, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCategories } from "@/server/actions/category/get-categories";

const ICON_MAP: Record<string, any> = {
  "Store": Store,
  "Coffee": Coffee,
  "Wrench": Wrench,
  "Stethoscope": Stethoscope,
  "Briefcase": Briefcase,
  "Code": Code,
  "Utensils": Utensils,
  "Scissors": Scissors,
  "MonitorPlay": MonitorPlay
};

export function Step3Category() {
  const { watch, setValue, formState: { errors } } = useFormContext<BusinessSetupInput>();
  const selectedCategory = watch("categoryId");
  
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadCategories();
  }, []);

  const handleCategorySelect = (id: string) => {
    if (selectedCategory !== id) {
      setValue("categoryId", id, { shouldValidate: true });
      setValue("dynamicFields", {}, { shouldValidate: true });
    }
  };

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
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-8">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const Icon = cat.icon && ICON_MAP[cat.icon] ? ICON_MAP[cat.icon] : HelpCircle;
              
              return (
                <div
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
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
        )}
        
        {errors.categoryId && (
          <p className="text-red-500 text-sm mt-4 font-medium text-center">{errors.categoryId.message}</p>
        )}
      </AssistantCard>
    </motion.div>
  );
}
