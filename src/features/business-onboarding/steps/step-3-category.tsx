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
  HelpCircle,
  Check,
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
      // Reset category-specific state on category change to prevent stale data leaks
      setValue("categoryData", {}, { shouldValidate: true });
      setValue("dynamicFields", {}, { shouldValidate: true });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCategorySelect(id);
    }
  };

  return (
    <motion.div
      variants={fadeSlideVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-4xl mx-auto mt-4"
    >
      <AssistantCard>
        <AssistantQuestion>What best describes your business category?</AssistantQuestion>
        <p className="text-slate-500 text-sm mt-1.5">
          Select your category to tailor the onboarding experience to your specific industry.
        </p>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-9 w-9 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 mt-8">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const Icon = cat.icon && ICON_MAP[cat.icon] ? ICON_MAP[cat.icon] : HelpCircle;

              return (
                <div
                  key={cat.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleCategorySelect(cat.id)}
                  onKeyDown={(e) => handleKeyDown(e, cat.id)}
                  aria-pressed={isSelected}
                  className={cn(
                    "relative flex items-center gap-4 p-4 text-left rounded-2xl cursor-pointer transition-all duration-200 border-2 select-none min-h-[76px] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2",
                    isSelected
                      ? "border-red-600 bg-red-50/80 text-red-950 shadow-sm"
                      : "border-slate-200/80 bg-white hover:border-red-200 hover:bg-slate-50/80 text-slate-700 hover:text-slate-900 shadow-xs hover:shadow-sm"
                  )}
                >
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-200",
                      isSelected ? "bg-red-600 text-white shadow-xs" : "bg-slate-100 text-slate-600 group-hover:bg-red-50"
                    )}
                  >
                    <Icon className="h-6 w-6" strokeWidth={isSelected ? 2.2 : 1.8} />
                  </div>
                  <div className="flex-1 min-w-0 pr-6">
                    <span className="text-sm font-semibold leading-tight text-slate-900 block">
                      {cat.name}
                    </span>
                    {cat.description && (
                      <span className="text-xs text-slate-500 line-clamp-1 mt-0.5 block">
                        {cat.description}
                      </span>
                    )}
                  </div>

                  {/* Selected check badge indicator */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xs animate-in zoom-in-50 duration-150">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </div>
                  )}
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
