"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fadeSlideVariants } from "../animations";
import { AssistantCard, AssistantQuestion } from "../components/ui/assistant-card";
import { AssistantUpload } from "../components/ui/assistant-upload";
import { Images, X, Star } from "lucide-react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { BusinessSetupInput } from "@/lib/validations/business/setup";
import { Button } from "@/components/ui/button";
import { useAssistant } from "../context/assistant-context";
import { saveBusinessGallery } from "@/server/actions/business/onboarding/save-gallery";

export function StepGallery() {
  const { control } = useFormContext<BusinessSetupInput>();
  const { fields, remove, update } = useFieldArray({
    control,
    name: "gallery",
  });
  
  const { registerStepValidator, unregisterStepValidator, businessId } = useAssistant();
  const [newFiles, setNewFiles] = useState<{ file: File; preview: string }[]>([]);

  useEffect(() => {
    registerStepValidator("gallery", async () => {
      if (newFiles.length === 0) return true; // Nothing new to upload
      if (!businessId) return false;

      const formData = new FormData();
      newFiles.forEach((nf) => {
        formData.append("images", nf.file);
      });

      const res = await saveBusinessGallery(businessId, formData);
      if (!res.success) {
        throw new Error((res as any).error || "Failed to upload gallery images");
      }
      return true;
    });

    return () => unregisterStepValidator("gallery");
  }, [registerStepValidator, unregisterStepValidator, newFiles, businessId]);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      newFiles.forEach(f => URL.revokeObjectURL(f.preview));
    };
  }, [newFiles]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validFiles = files.filter(f => {
      if (f.size > 5 * 1024 * 1024) {
        alert(`${f.name} exceeds 5MB limit`);
        return false;
      }
      return true;
    });

    const newPreviews = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setNewFiles(prev => [...prev, ...newPreviews].slice(0, 20));
  };

  const removeNewFile = (index: number) => {
    setNewFiles(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const setAsCover = (index: number) => {
    fields.forEach((_, i) => {
      update(i, { ...fields[i], isCover: i === index });
    });
  };

  const totalImages = fields.length + newFiles.length;

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
          Upload up to 20 photos of your business, products, or services.
        </p>

        <div className="relative">
           <input 
              type="file" 
              multiple
              accept="image/png, image/jpeg, image/svg+xml"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
              disabled={totalImages >= 20}
            />
          <AssistantUpload 
            label={totalImages >= 20 ? "Maximum limit reached" : "Photo Gallery"} 
            description={totalImages >= 20 ? "20/20 images uploaded" : "High quality images attract more customers. (Max 5MB each)"}
            icon={<Images className="h-6 w-6" />}
            className="h-40"
          />
        </div>

        {totalImages > 0 && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* Existing DB Images */}
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
            
            {/* New files to upload */}
            {newFiles.map((nf, index) => (
              <div key={`new-${index}`} className="relative group rounded-xl overflow-hidden border aspect-video bg-muted border-dashed border-blue-400">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={nf.preview} alt="New upload preview" className="object-cover w-full h-full opacity-70" />
                <div className="absolute top-2 right-2">
                  <Button variant="destructive" size="icon" className="h-7 w-7" onClick={() => removeNewFile(index)}>
                      <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-md flex items-center shadow">
                   Ready to Upload
                </div>
              </div>
            ))}
          </div>
        )}
      </AssistantCard>
    </motion.div>
  );
}
