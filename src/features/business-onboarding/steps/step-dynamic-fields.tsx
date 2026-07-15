"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { fadeSlideVariants } from "../animations";
import { AssistantCard, AssistantQuestion } from "../components/ui/assistant-card";
import { useFormContext, Controller } from "react-hook-form";
import { BusinessSetupInput } from "@/lib/validations/business/setup";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useDynamicFields, DynamicFieldType } from "../hooks/useDynamicFields";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAssistant } from "../context/assistant-context";

export function StepDynamicFields() {
  const { register, watch, control, getValues, formState: { errors } } = useFormContext<BusinessSetupInput>();
  const categoryId = watch("categoryId");
  const { registerStepValidator, unregisterStepValidator } = useAssistant();
  
  const { fields, isLoading, validateDynamicFields } = useDynamicFields(categoryId);

  useEffect(() => {
    // Register the custom validator for this step
    registerStepValidator("dynamic_fields", () => {
      const values = getValues("dynamicFields") || {};
      return validateDynamicFields(values);
    });

    return () => {
      unregisterStepValidator("dynamic_fields");
    };
  }, [registerStepValidator, unregisterStepValidator, validateDynamicFields, getValues]);

  const renderField = (field: DynamicFieldType) => {
    const error = (errors?.dynamicFields as any)?.[field.key];
    
    switch (field.inputType) {
      case "text":
      case "number":
      case "date":
        return (
          <>
            <Input 
              type={field.inputType} 
              placeholder={field.placeholder || ""}
              className="h-11 rounded-xl"
              {...register(`dynamicFields.${field.key}`)} 
            />
            {error && <p className="text-red-500 text-sm font-medium">{error.message}</p>}
          </>
        );
      case "textarea":
        return (
          <>
            <Textarea 
              placeholder={field.placeholder || ""}
              className="rounded-xl min-h-[100px]"
              {...register(`dynamicFields.${field.key}`)}
            />
            {error && <p className="text-red-500 text-sm font-medium">{error.message}</p>}
          </>
        );
      case "checkbox":
      case "switch":
        return (
          <Controller
            control={control}
            name={`dynamicFields.${field.key}`}
            render={({ field: controllerField }) => (
              <div className="flex items-center space-x-2 h-11">
                <Switch 
                  id={field.key} 
                  checked={controllerField.value || false} 
                  onCheckedChange={controllerField.onChange} 
                />
                <Label htmlFor={field.key} className="text-sm font-normal">Yes</Label>
              </div>
            )}
          />
        );
      case "select":
        return (
          <Controller
            control={control}
            name={`dynamicFields.${field.key}`}
            render={({ field: controllerField }) => (
              <>
                <Select onValueChange={controllerField.onChange} value={controllerField.value || ""}>
                  <SelectTrigger className="w-full h-11 rounded-xl">
                    <SelectValue placeholder={field.placeholder || "Select an option"} />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(field.options) ? field.options.map((opt: string, i: number) => (
                      <SelectItem key={i} value={opt}>{opt}</SelectItem>
                    )) : null}
                  </SelectContent>
                </Select>
                {error && <p className="text-red-500 text-sm font-medium">{error.message}</p>}
              </>
            )}
          />
        );
      case "radio":
        return (
          <Controller
            control={control}
            name={`dynamicFields.${field.key}`}
            render={({ field: controllerField }) => (
              <>
                <RadioGroup 
                  onValueChange={controllerField.onChange} 
                  value={controllerField.value || ""}
                  className="flex flex-col space-y-2 mt-2"
                >
                  {Array.isArray(field.options) ? field.options.map((opt: string, i: number) => (
                    <div className="flex items-center space-x-2" key={i}>
                      <RadioGroupItem value={opt} id={`${field.key}-${i}`} />
                      <Label htmlFor={`${field.key}-${i}`}>{opt}</Label>
                    </div>
                  )) : null}
                </RadioGroup>
                {error && <p className="text-red-500 text-sm font-medium">{error.message}</p>}
              </>
            )}
          />
        );
      default:
        return null;
    }
  };

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
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : fields.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground bg-slate-50 rounded-xl mt-8">
            <p>No specific details required for this category.</p>
          </div>
        ) : (
          <div className="space-y-6 mt-8">
            {fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label className="flex items-center gap-2">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </Label>
                
                {renderField(field)}

                {field.helpText && <p className="text-xs text-muted-foreground">{field.helpText}</p>}
              </div>
            ))}
          </div>
        )}
      </AssistantCard>
    </motion.div>
  );
}
