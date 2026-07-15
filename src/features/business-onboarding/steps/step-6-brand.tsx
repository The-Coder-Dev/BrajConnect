"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeSlideVariants } from "../animations";
import { AssistantCard, AssistantQuestion } from "../components/ui/assistant-card";
import { AssistantUpload } from "../components/ui/assistant-upload";
import { ImageIcon, LayoutTemplate } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { BusinessSetupInput } from "@/lib/validations/business/setup";

export function Step6Brand() {
  const { setValue } = useFormContext<BusinessSetupInput>();

  const handleUpload = (type: "logo" | "cover") => {
    // Note: Cloudinary upload widget will go here in production
    // MOCKING the upload for now
    const payload = {
      url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      publicId: "sample",
      format: "jpg",
      bytes: 12345,
      width: 800,
      height: 600,
    };
    if (type === "logo") {
      setValue("logo", payload, { shouldValidate: true });
    } else {
      setValue("cover", payload, { shouldValidate: true });
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
          <div onClick={() => handleUpload("logo")}>
            <AssistantUpload 
              label="Business Logo" 
              description="1:1 ratio. SVG, PNG, JPG (Max 5MB)"
              icon={<ImageIcon className="h-6 w-6" />}
            />
          </div>
          <div onClick={() => handleUpload("cover")}>
            <AssistantUpload 
              label="Cover Image" 
              description="16:9 ratio. High resolution banner"
              icon={<LayoutTemplate className="h-6 w-6" />}
            />
          </div>
        </div>
      </AssistantCard>
    </motion.div>
  );
}
