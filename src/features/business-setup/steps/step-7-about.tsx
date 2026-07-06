"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeSlideVariants } from "../animations";
import { AssistantCard, AssistantQuestion } from "../components/ui/assistant-card";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";
import { BusinessSetupInput } from "@/lib/validations/business/setup";
import { BUSINESS } from "@/lib/constants/business";

export function Step7About() {
  const { register, watch, formState: { errors } } = useFormContext<BusinessSetupInput>();
  const description = watch("description") || "";
  const maxLength = BUSINESS.LIMITS.DESCRIPTION_MAX_LENGTH;

  return (
    <motion.div
      variants={fadeSlideVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-2xl mx-auto mt-8"
    >
      <AssistantCard>
        <AssistantQuestion>Tell customers about your business.</AssistantQuestion>
        
        <div className="space-y-4 mt-8">
          <Textarea 
            placeholder="We are a family-owned bakery specializing in artisanal sourdough breads and custom cakes..."
            className="min-h-[200px] rounded-xl resize-none text-base p-4"
            {...register("description")}
          />
          
          <div className="flex justify-between items-center text-sm">
            {errors.description ? (
              <span className="text-red-500 font-medium">{errors.description.message}</span>
            ) : (
              <span className="text-muted-foreground">What makes your business unique?</span>
            )}
            <span className={`font-medium ${description.length > maxLength ? "text-red-500" : "text-muted-foreground"}`}>
              {description.length} / {maxLength}
            </span>
          </div>
        </div>
      </AssistantCard>
    </motion.div>
  );
}
