"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeSlideVariants } from "../animations";
import { AssistantCard, AssistantQuestion } from "../components/ui/assistant-card";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { BusinessSetupInput } from "@/lib/validations/business/setup";
import { Label } from "@/components/ui/label";

export function Step5Location() {
  const { register, formState: { errors } } = useFormContext<BusinessSetupInput>();

  return (
    <motion.div
      variants={fadeSlideVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-xl mx-auto mt-8"
    >
      <AssistantCard>
        <AssistantQuestion>Where is your business located?</AssistantQuestion>
        
        <div className="space-y-5 mt-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country" className="text-muted-foreground">Country</Label>
              <Input 
                id="country"
                placeholder="e.g. United States" 
                className="h-12 rounded-xl"
                {...register("country")}
              />
              {errors.country && <p className="text-red-500 text-sm font-medium">{errors.country.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="state" className="text-muted-foreground">State / Province</Label>
              <Input 
                id="state"
                placeholder="e.g. California" 
                className="h-12 rounded-xl"
                {...register("state")}
              />
              {errors.state && <p className="text-red-500 text-sm font-medium">{errors.state.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="city" className="text-muted-foreground">City</Label>
            <Input 
              id="city"
              placeholder="e.g. San Francisco" 
              className="h-12 rounded-xl"
              {...register("city")}
            />
            {errors.city && <p className="text-red-500 text-sm font-medium">{errors.city.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-muted-foreground">Street Address</Label>
            <Input 
              id="address"
              placeholder="e.g. 123 Market St, Suite 100" 
              className="h-12 rounded-xl"
              {...register("address")}
            />
            {errors.address && <p className="text-red-500 text-sm font-medium">{errors.address.message}</p>}
          </div>
        </div>
      </AssistantCard>
    </motion.div>
  );
}
