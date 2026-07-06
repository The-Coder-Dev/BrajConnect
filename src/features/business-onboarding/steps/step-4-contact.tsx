"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeSlideVariants } from "../animations";
import { AssistantCard, AssistantQuestion } from "../components/ui/assistant-card";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { BusinessSetupInput } from "@/lib/validations/business/setup";
import { Label } from "@/components/ui/label";
import { Phone, Mail, Globe } from "lucide-react";

export function Step4Contact() {
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
        <AssistantQuestion>How can customers reach you?</AssistantQuestion>
        
        <div className="space-y-6 mt-8">
          <div className="space-y-3">
            <Label htmlFor="phone" className="text-muted-foreground flex items-center gap-2">
              <Phone className="h-4 w-4" /> Phone Number
            </Label>
            <Input 
              id="phone"
              placeholder="+1 (555) 000-0000" 
              className="h-12 rounded-xl"
              {...register("phone")}
            />
            {errors.phone && <p className="text-red-500 text-sm font-medium">{errors.phone.message}</p>}
          </div>

          <div className="space-y-3">
            <Label htmlFor="email" className="text-muted-foreground flex items-center gap-2">
              <Mail className="h-4 w-4" /> Email Address
            </Label>
            <Input 
              id="email"
              type="email"
              placeholder="hello@yourbusiness.com" 
              className="h-12 rounded-xl"
              {...register("email")}
            />
            {errors.email && <p className="text-red-500 text-sm font-medium">{errors.email.message}</p>}
          </div>

          <div className="space-y-3">
            <Label htmlFor="website" className="text-muted-foreground flex items-center gap-2">
              <Globe className="h-4 w-4" /> Website <span className="text-xs opacity-50">(Optional)</span>
            </Label>
            <Input 
              id="website"
              placeholder="https://yourbusiness.com" 
              className="h-12 rounded-xl"
              {...register("website")}
            />
            {errors.website && <p className="text-red-500 text-sm font-medium">{errors.website.message}</p>}
          </div>
        </div>
      </AssistantCard>
    </motion.div>
  );
}
