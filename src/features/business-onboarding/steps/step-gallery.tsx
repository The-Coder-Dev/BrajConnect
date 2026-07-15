"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeSlideVariants } from "../animations";
import { AssistantCard, AssistantQuestion } from "../components/ui/assistant-card";
import { AssistantUpload } from "../components/ui/assistant-upload";
import { Images, X, Star } from "lucide-react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { BusinessSetupInput } from "@/lib/validations/business/setup";
import { Button } from "@/components/ui/button";

export function StepGallery() {
  const { control, setValue } = useFormContext<BusinessSetupInput>();
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "gallery",
  });

  const handleUpload = () => {
    // Note: Cloudinary upload widget will go here in production
    // MOCKING the upload for now
    append({
      url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      publicId: `sample_${Date.now()}`,
      format: "jpg",
      bytes: 24680,
      width: 1024,
      height: 768,
      altText: "",
      isCover: fields.length === 0, // Make first image the cover
    });
  };

  const setAsCover = (index: number) => {
    fields.forEach((_, i) => {
      update(i, { ...fields[i], isCover: i === index });
    });
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
        <AssistantQuestion>Showcase your business</AssistantQuestion>
        
        <p className="text-muted-foreground mb-8">
          Upload up to 10 photos of your business, products, or services.
        </p>

        <div onClick={handleUpload}>
          <AssistantUpload 
            label="Photo Gallery" 
            description="High quality images attract more customers."
            icon={<Images className="h-6 w-6" />}
            className="h-40"
          />
        </div>

        {fields.length > 0 && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
            {fields.map((field, index) => (
              <div key={field.id} className="relative group rounded-xl overflow-hidden border aspect-video bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={field.url} alt="Gallery item" className="object-cover w-full h-full" />
                
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                  <div className="flex justify-between">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className={`h-7 px-2 text-xs ${field.isCover ? 'bg-primary text-primary-foreground hover:bg-primary' : ''}`}
                      onClick={() => setAsCover(index)}
                    >
                      <Star className="w-3 h-3 mr-1" /> Cover
                    </Button>
                    <Button variant="destructive" size="icon" className="h-7 w-7" onClick={() => remove(index)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {field.isCover && (
                  <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md flex items-center">
                    <Star className="w-3 h-3 mr-1 fill-current" /> Cover Image
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </AssistantCard>
    </motion.div>
  );
}
