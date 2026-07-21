"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fadeSlideVariants } from "../animations";
import { AssistantCard, AssistantQuestion } from "../components/ui/assistant-card";
import { useFormContext } from "react-hook-form";
import { BusinessSetupInput } from "@/lib/validations/business/setup";
import { Checkbox } from "@/components/ui/checkbox";
import { getActiveAmenities } from "@/server/actions/business/onboarding/get-amenities";
import * as Icons from "lucide-react";

export function StepAmenities() {
  const { watch, setValue } = useFormContext<BusinessSetupInput>();
  const selectedAmenities = watch("amenities") || [];
  const [amenitiesList, setAmenitiesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAmenities() {
      const res = await getActiveAmenities();
      if (res.success && res.data) {
        setAmenitiesList(res.data);
      }
      setLoading(false);
    }
    fetchAmenities();
  }, []);

  const toggleAmenity = (id: string) => {
    const newAmenities = selectedAmenities.includes(id)
      ? selectedAmenities.filter((a) => a !== id)
      : [...selectedAmenities, id];
    setValue("amenities", newAmenities, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <motion.div
      variants={fadeSlideVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-3xl mx-auto mt-8"
    >
      <AssistantCard>
        <AssistantQuestion>What amenities do you offer?</AssistantQuestion>
        <p className="text-muted-foreground mt-2 mb-6">
          Select the facilities available at your business. (Optional)
        </p>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {amenitiesList.map((amenity) => {
              // Safely render icon
              let Icon = null;
              if (amenity.icon && (Icons as any)[amenity.icon]) {
                Icon = (Icons as any)[amenity.icon];
              }

              const isSelected = selectedAmenities.includes(amenity.id);

              return (
                <label
                  key={amenity.id}
                  className={`
                    flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all
                    ${isSelected 
                      ? 'bg-primary/5 border-primary shadow-sm' 
                      : 'bg-card hover:bg-accent hover:text-accent-foreground'
                    }
                  `}
                >
                  <Checkbox 
                    checked={isSelected}
                    onCheckedChange={() => toggleAmenity(amenity.id)}
                    className="data-[state=checked]:bg-primary"
                  />
                  {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
                  <span className="font-medium text-sm select-none">{amenity.name}</span>
                </label>
              );
            })}
            
            {amenitiesList.length === 0 && (
              <div className="col-span-full text-center py-8 text-muted-foreground border-2 border-dashed rounded-xl">
                No amenities available.
              </div>
            )}
          </div>
        )}
      </AssistantCard>
    </motion.div>
  );
}