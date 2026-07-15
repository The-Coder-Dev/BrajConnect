"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeSlideVariants } from "../animations";
import { AssistantCard, AssistantQuestion } from "../components/ui/assistant-card";
import { useFormContext, useFieldArray } from "react-hook-form";
import { BusinessSetupInput } from "@/lib/validations/business/setup";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function StepHours() {
  const { control, register, watch, setValue } = useFormContext<BusinessSetupInput>();
  const { fields } = useFieldArray({
    control,
    name: "hours",
  });

  return (
    <motion.div
      variants={fadeSlideVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-2xl mx-auto mt-8"
    >
      <AssistantCard>
        <AssistantQuestion>When are you open for business?</AssistantQuestion>
        
        <div className="space-y-4 mt-8">
          {fields.map((field, index) => {
            const isClosed = watch(`hours.${index}.isClosed`);
            const is24Hours = watch(`hours.${index}.is24Hours`);
            const dayOfWeek = watch(`hours.${index}.dayOfWeek`);
            // Ensure dayOfWeek is safely accessed
            const dayName = dayOfWeek !== undefined ? DAYS[dayOfWeek] : DAYS[index % 7];

            return (
              <div key={field.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border bg-card text-card-foreground shadow-sm">
                <div className="w-24 font-medium">{dayName}</div>
                
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={!isClosed} 
                    onCheckedChange={(c) => setValue(`hours.${index}.isClosed`, !c, { shouldValidate: true })} 
                  />
                  <Label className="text-sm">Open</Label>
                </div>

                {!isClosed && (
                  <>
                    <div className="flex items-center gap-2 ml-4">
                      <Switch 
                        checked={is24Hours} 
                        onCheckedChange={(c) => setValue(`hours.${index}.is24Hours`, c, { shouldValidate: true })} 
                      />
                      <Label className="text-sm">24h</Label>
                    </div>

                    {!is24Hours && (
                      <div className="flex items-center gap-2 ml-auto">
                        <Input type="time" {...register(`hours.${index}.openTime`)} className="w-28" />
                        <span className="text-muted-foreground">-</span>
                        <Input type="time" {...register(`hours.${index}.closeTime`)} className="w-28" />
                      </div>
                    )}
                  </>
                )}
                {isClosed && (
                  <div className="text-muted-foreground text-sm ml-auto italic">Closed</div>
                )}
              </div>
            );
          })}
        </div>
      </AssistantCard>
    </motion.div>
  );
}
