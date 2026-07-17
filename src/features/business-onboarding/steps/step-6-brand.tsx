"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fadeSlideVariants } from "../animations";
import { AssistantCard, AssistantQuestion } from "../components/ui/assistant-card";
import { AssistantUpload } from "../components/ui/assistant-upload";
import { ImageIcon, LayoutTemplate } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { BusinessSetupInput } from "@/lib/validations/business/setup";
import { useAssistant } from "../context/assistant-context";
import { saveBusinessBrand } from "@/server/actions/business/onboarding/save-brand";

export function Step6Brand() {
  const { registerStepValidator, unregisterStepValidator, businessId } = useAssistant();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  useEffect(() => {
    registerStepValidator("brand", async () => {
      if (!logoFile && !coverFile) return true; // Optional step
      if (!businessId) return false;

      const formData = new FormData();
      if (logoFile) formData.append("logo", logoFile);
      if (coverFile) formData.append("cover", coverFile);

      const res = await saveBusinessBrand(businessId, formData);
      if (!res.success) {
        throw new Error((res as any).error || "Failed to upload brand images");
      }
      return true;
    });

    return () => unregisterStepValidator("brand");
  }, [registerStepValidator, unregisterStepValidator, logoFile, coverFile, businessId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "logo" | "cover") => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === "logo") setLogoFile(file);
      else setCoverFile(file);
    }
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
        <AssistantQuestion>Let&apos;s make your business recognizable.</AssistantQuestion>
        
        <p className="text-muted-foreground mb-8">
          Upload high-quality images to help your business stand out. (You can skip this for now)
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative">
            <input 
              type="file" 
              accept="image/png, image/jpeg, image/svg+xml"
              onChange={(e) => handleFileChange(e, "logo")}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
            />
            <AssistantUpload 
              label={logoFile ? logoFile.name : "Business Logo"} 
              description="1:1 ratio. SVG, PNG, JPG (Max 2MB)"
              icon={<ImageIcon className="h-6 w-6" />}
            />
          </div>
          <div className="relative">
            <input 
              type="file" 
              accept="image/png, image/jpeg"
              onChange={(e) => handleFileChange(e, "cover")}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
            />
            <AssistantUpload 
              label={coverFile ? coverFile.name : "Cover Image"} 
              description="16:9 ratio. High resolution banner (Max 5MB)"
              icon={<LayoutTemplate className="h-6 w-6" />}
            />
          </div>
        </div>
      </AssistantCard>
    </motion.div>
  );
}
