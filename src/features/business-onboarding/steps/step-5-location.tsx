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
      className="max-w-2xl mx-auto mt-4"
    >
      <AssistantCard>
        <AssistantQuestion>Where is your business located?</AssistantQuestion>
        <p className="text-slate-500 text-sm mt-1.5">
          Enter your business address and location details so local customers can easily find you.
        </p>

        <div className="space-y-5 mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country" className="text-slate-700 text-sm font-medium">
                Country
              </Label>
              <Input
                id="country"
                placeholder="India"
                defaultValue="India"
                className="h-11 rounded-xl"
                {...register("country")}
              />
              {errors.country && <p className="text-red-500 text-xs font-medium">{errors.country.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="state" className="text-slate-700 text-sm font-medium">
                State
              </Label>
              <Input
                id="state"
                placeholder="e.g. Uttar Pradesh"
                className="h-11 rounded-xl"
                {...register("state")}
              />
              {errors.state && <p className="text-red-500 text-xs font-medium">{errors.state.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-slate-700 text-sm font-medium">
                City / Town
              </Label>
              <Input
                id="city"
                placeholder="e.g. Mathura"
                className="h-11 rounded-xl"
                {...register("city")}
              />
              {errors.city && <p className="text-red-500 text-xs font-medium">{errors.city.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="postalCode" className="text-slate-700 text-sm font-medium">
                PIN Code
              </Label>
              <Input
                id="postalCode"
                placeholder="e.g. 281001"
                className="h-11 rounded-xl"
                {...register("postalCode")}
              />
              {errors.postalCode && <p className="text-red-500 text-xs font-medium">{errors.postalCode.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-slate-700 text-sm font-medium">
              Street Address / Shop No. & Landmark
            </Label>
            <Input
              id="address"
              placeholder="e.g. Shop 12, Krishna Nagar Main Market, Near Holi Gate"
              className="h-11 rounded-xl"
              {...register("address")}
            />
            {errors.address && <p className="text-red-500 text-xs font-medium">{errors.address.message}</p>}
          </div>
        </div>
      </AssistantCard>
    </motion.div>
  );
}
