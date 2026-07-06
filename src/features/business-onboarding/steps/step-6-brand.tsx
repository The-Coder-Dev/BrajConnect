"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeSlideVariants } from "../animations";
import { AssistantCard, AssistantQuestion } from "../components/ui/assistant-card";
import { AssistantUpload } from "../components/ui/assistant-upload";
import { ImageIcon, LayoutTemplate, Images } from "lucide-react";

export function Step6Brand() {
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
          <AssistantUpload 
            label="Business Logo" 
            description="1:1 ratio. SVG, PNG, JPG (Max 5MB)"
            icon={<ImageIcon className="h-6 w-6" />}
          />
          <AssistantUpload 
            label="Cover Image" 
            description="16:9 ratio. High resolution banner"
            icon={<LayoutTemplate className="h-6 w-6" />}
          />
        </div>

        <div className="mt-6">
          <AssistantUpload 
            label="Photo Gallery" 
            description="Upload up to 10 photos of your business, products, or services."
            icon={<Images className="h-6 w-6" />}
            className="h-40"
          />
        </div>
      </AssistantCard>
    </motion.div>
  );
}
