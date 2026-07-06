"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeSlideVariants } from "../animations";
import { AssistantCard, AssistantQuestion } from "../components/ui/assistant-card";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { BusinessSetupInput } from "@/lib/validations/business/setup";
import { generateSlug } from "@/lib/slug/generate-slug";

export function Step2Name() {
  const { register, watch, formState: { errors } } = useFormContext<BusinessSetupInput>();
  const nameValue = watch("name");
  const generatedSlug = generateSlug(nameValue || "");

  return (
    <motion.div
      variants={fadeSlideVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-xl mx-auto mt-8"
    >
      <AssistantCard>
        <AssistantQuestion>What should customers call your business?</AssistantQuestion>
        
        <div className="space-y-4 mt-8">
          <div>
            <Input 
              placeholder="e.g. Acme Corporation" 
              className="h-14 text-lg rounded-xl"
              {...register("name")}
              autoFocus
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-2 font-medium">{errors.name.message}</p>
            )}
          </div>
          
          <div className="pt-4 border-t border-border/50">
            <p className="text-sm text-muted-foreground font-medium mb-1">Your public profile URL will be:</p>
            <div className="bg-muted/50 p-3 rounded-lg border border-border/50 text-sm overflow-hidden text-ellipsis">
              <span className="text-muted-foreground">brajconnect.com/b/</span>
              <span className="font-semibold text-foreground">{generatedSlug || "your-business-name"}</span>
            </div>
          </div>
        </div>
      </AssistantCard>
    </motion.div>
  );
}
