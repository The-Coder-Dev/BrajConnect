"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fadeSlideVariants } from "../animations";
import { AssistantCard, AssistantQuestion } from "../components/ui/assistant-card";
import { useFormContext } from "react-hook-form";
import { BusinessSetupInput } from "@/lib/validations/business/setup";
import {
  Hotel,
  Utensils,
  GraduationCap,
  School,
  Banknote,
  Building,
  Scissors,
  Smile,
  Stethoscope,
  BookOpen,
  Cross,
  Store,
  Coffee,
  Wrench,
  Briefcase,
  Code,
  MonitorPlay,
  Car,
  MapPin,
  HelpCircle,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getCategories } from "@/server/actions/category/get-categories";

const ICON_MAP: Record<string, LucideIcon> = {
  Hotel: Hotel,
  Utensils: Utensils,
  GraduationCap: GraduationCap,
  School: School,
  Banknote: Banknote,
  Building: Building,
  Scissors: Scissors,
  Smile: Smile,
  Stethoscope: Stethoscope,
  BookOpen: BookOpen,
  Cross: Cross,
  Store: Store,
  Coffee: Coffee,
  Wrench: Wrench,
  Briefcase: Briefcase,
  Code: Code,
  MonitorPlay: MonitorPlay,
  Car: Car,
  MapPin: MapPin,
};

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  sortOrder: number;
}

export function Step3Category() {
  const { watch, setValue, formState: { errors } } = useFormContext<BusinessSetupInput>();
  const selectedCategory = watch("categoryId");

  const [categories, setCategories] = useState<CategoryItem[]>([]);
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
      // Reset category-specific state on category change
      setValue("categoryData", {}, { shouldValidate: true });
      setValue("dynamicFields", {}, { shouldValidate: true });
    }
  };

  return (
    <motion.div
      variants={fadeSlideVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-3xl mx-auto mt-8"
    >
      <AssistantCard>
        <AssistantQuestion>What best describes your business category?</AssistantQuestion>
        <p className="text-slate-500 text-sm mt-1.5">
          Select your category to tailor the onboarding experience to your specific industry.
        </p>

        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-9 w-9 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 mt-8">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const Icon = cat.icon && ICON_MAP[cat.icon] ? ICON_MAP[cat.icon] : HelpCircle;

              return (
                <div
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={cn(
                    "flex flex-col items-center justify-center p-4.5 text-center rounded-2xl cursor-pointer transition-all duration-200 border-2 select-none",
                    isSelected
                      ? "border-red-500 bg-red-50/70 text-red-700 shadow-sm scale-[0.98]"
                      : "border-slate-100 bg-white hover:border-red-200 hover:bg-slate-50/60 text-slate-600 hover:text-slate-900 shadow-xs hover:shadow-sm"
                  )}
                >
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center mb-2.5 transition-colors duration-200",
                      isSelected ? "bg-red-600 text-white" : "bg-slate-100 text-slate-500"
                    )}
                  >
                    <Icon className="h-6 w-6" strokeWidth={isSelected ? 2.2 : 1.7} />
                  </div>
                  <span className="text-xs font-semibold leading-tight line-clamp-1">
                    {cat.name}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {errors.categoryId && (
          <p className="text-red-500 text-sm mt-4 font-medium text-center">
            {errors.categoryId.message}
          </p>
        )}
      </AssistantCard>
    </motion.div>
  );
}
