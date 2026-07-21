"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeSlideVariants } from "../animations";
import { AssistantCard, AssistantQuestion } from "../components/ui/assistant-card";
import { useFormContext, useFieldArray } from "react-hook-form";
import { BusinessSetupInput } from "@/lib/validations/business/setup";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

export function StepServices() {
  const { control, register, formState: { errors } } = useFormContext<BusinessSetupInput>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "services",
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
        <AssistantQuestion>What services do you offer?</AssistantQuestion>
        <p className="text-muted-foreground mt-2 mb-6">
          List the main services you provide to your customers. (Optional)
        </p>
        
        <div className="space-y-6">
          {fields.map((field, index) => {
            const serviceErrors = errors.services?.[index];
            return (
              <div key={field.id} className="relative p-5 rounded-xl border bg-card text-card-foreground shadow-sm group">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label>Service Name <span className="text-destructive">*</span></Label>
                    <Input 
                      placeholder="e.g. General Consultation" 
                      {...register(`services.${index}.name`)} 
                    />
                    {serviceErrors?.name && (
                      <p className="text-sm text-destructive">{serviceErrors.name.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Description <span className="text-muted-foreground font-normal">(Optional)</span></Label>
                    <Textarea 
                      placeholder="Briefly describe this service..." 
                      className="resize-none"
                      rows={2}
                      {...register(`services.${index}.description`)} 
                    />
                    {serviceErrors?.description && (
                      <p className="text-sm text-destructive">{serviceErrors.description.message}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {fields.length === 0 && (
            <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-xl">
              No services added yet.
            </div>
          )}

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => append({ name: "", description: "" })}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Service
          </Button>
        </div>
      </AssistantCard>
    </motion.div>
  );
}