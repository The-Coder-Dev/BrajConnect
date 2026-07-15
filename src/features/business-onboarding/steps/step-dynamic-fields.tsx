"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fadeSlideVariants } from "../animations";
import { AssistantCard, AssistantQuestion } from "../components/ui/assistant-card";
import { useFormContext } from "react-hook-form";
import { BusinessSetupInput } from "@/lib/validations/business/setup";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Mocking dynamic fields fetched based on categoryId
const MOCK_FIELDS = [
  { id: "df1", key: "cuisine", label: "Cuisine Type", type: "text", required: true, helpText: "E.g., Italian, Indian, Mexican" },
  { id: "df2", key: "seating_capacity", label: "Seating Capacity", type: "number", required: false, helpText: "Approximate number of seats" },
  { id: "df3", key: "has_wifi", label: "Free Wi-Fi", type: "checkbox", required: false },
];

export function StepDynamicFields() {
  const { register, watch, formState: { errors } } = useFormContext<BusinessSetupInput>();
  const categoryId = watch("categoryId");
  
  const [fields, setFields] = useState(MOCK_FIELDS);

  useEffect(() => {
    // In production, this would fetch from /api/categories/${categoryId}/fields
    // For now, we use MOCK_FIELDS
    if (categoryId) {
      setFields(MOCK_FIELDS);
    }
  }, [categoryId]);

  return (
    <motion.div
      variants={fadeSlideVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-2xl mx-auto mt-8"
    >
      <AssistantCard>
        <AssistantQuestion>Provide some specific details</AssistantQuestion>
        <p className="text-muted-foreground mt-2">These details help customers know exactly what you offer.</p>
        
        <div className="space-y-6 mt-8">
          {fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label className="flex items-center gap-2">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </Label>
              
              {field.type === "text" || field.type === "number" ? (
                <Input 
                  type={field.type} 
                  className="h-11 rounded-xl"
                  {...register(`dynamicFields.${field.key}`)} 
                />
              ) : field.type === "textarea" ? (
                <Textarea 
                  className="rounded-xl"
                  {...register(`dynamicFields.${field.key}`)}
                />
              ) : field.type === "checkbox" ? (
                <div className="flex items-center gap-2">
                  <input type="checkbox" {...register(`dynamicFields.${field.key}`)} className="h-4 w-4" />
                  <span className="text-sm">Yes</span>
                </div>
              ) : null}

              {field.helpText && <p className="text-xs text-muted-foreground">{field.helpText}</p>}
            </div>
          ))}
        </div>
      </AssistantCard>
    </motion.div>
  );
}
