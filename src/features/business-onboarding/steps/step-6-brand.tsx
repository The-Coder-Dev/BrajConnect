"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { fadeSlideVariants } from "../animations";
import { AssistantCard, AssistantQuestion } from "../components/ui/assistant-card";
import { AssistantUpload } from "../components/ui/assistant-upload";
import { ImageIcon, LayoutTemplate } from "lucide-react";
import { useAssistant } from "../context/assistant-context";
import { saveBusinessBrand } from "@/server/actions/business/onboarding/save-brand";
import { toast } from "sonner";

// Local helper to handle AJAX file uploads with progress tracking
const uploadImageFile = (
  file: File,
  businessId: string,
  folderType: "logo" | "cover",
  onProgress: (pct: number) => void
): Promise<{ url: string; publicId: string }> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload/image");

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch {
          reject(new Error("Invalid response from server"));
        }
      } else {
        try {
          const err = JSON.parse(xhr.responseText);
          reject(new Error(err.error || "Upload failed"));
        } catch {
          reject(new Error("Upload failed"));
        }
      }
    };

    xhr.onerror = () => reject(new Error("Network error during upload"));

    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", `brajconnect/business/${businessId}/${folderType}`);
    xhr.send(fd);
  });
};

export function Step6Brand() {
  const { registerStepValidator, unregisterStepValidator, businessId } = useAssistant();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [logoProgress, setLogoProgress] = useState<number | null>(null);
  const [coverProgress, setCoverProgress] = useState<number | null>(null);

  // Use refs to keep validation callbacks current without re-registering
  const logoFileRef = useRef<File | null>(logoFile);
  const coverFileRef = useRef<File | null>(coverFile);
  const businessIdRef = useRef<string | null>(businessId);

  useEffect(() => {
    logoFileRef.current = logoFile;
    coverFileRef.current = coverFile;
    businessIdRef.current = businessId;
  }, [logoFile, coverFile, businessId]);

  useEffect(() => {
    registerStepValidator("brand", async () => {
      const currentLogo = logoFileRef.current;
      const currentCover = coverFileRef.current;
      const bId = businessIdRef.current;

      if (!currentLogo && !currentCover) return true; // Optional step
      if (!bId) {
        toast.error("Business ID missing. Complete previous steps first.");
        return false;
      }

      setIsUploading(true);
      try {
        let logoRes = undefined;
        let coverRes = undefined;

        if (currentLogo) {
          setLogoProgress(0);
          logoRes = await uploadImageFile(currentLogo, bId, "logo", setLogoProgress);
        }

        if (currentCover) {
          setCoverProgress(0);
          coverRes = await uploadImageFile(currentCover, bId, "cover", setCoverProgress);
        }

        const res = await saveBusinessBrand(bId, {
          logoUrl: logoRes?.url,
          logoPublicId: logoRes?.publicId,
          coverUrl: coverRes?.url,
          coverPublicId: coverRes?.publicId,
        });

        if (!res.success) {
          throw new Error((res as any).error || "Failed to save brand images");
        }
        return true;
      } catch (err: any) {
        toast.error(err.message || "Failed to upload brand images");
        throw err;
      } finally {
        setIsUploading(false);
        setLogoProgress(null);
        setCoverProgress(null);
      }
    });

    return () => unregisterStepValidator("brand");
  }, [registerStepValidator, unregisterStepValidator]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "logo" | "cover") => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === "logo") {
        if (file.size > 2 * 1024 * 1024) {
          toast.error("Logo file must be under 2MB.");
          return;
        }
        setLogoFile(file);
      } else {
        if (file.size > 5 * 1024 * 1024) {
          toast.error("Cover image file must be under 5MB.");
          return;
        }
        setCoverFile(file);
      }
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
              disabled={isUploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 disabled:cursor-not-allowed"
            />
            <AssistantUpload
              label={logoFile ? logoFile.name : "Business Logo"}
              description="1:1 ratio. SVG, PNG, JPG (Max 2MB)"
              icon={<ImageIcon className="h-6 w-6" />}
            />
            {logoProgress !== null && (
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mt-3 overflow-hidden">
                <div
                  className="bg-blue-600 h-full transition-all duration-300"
                  style={{ width: `${logoProgress}%` }}
                />
              </div>
            )}
          </div>
          <div className="relative">
            <input
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={(e) => handleFileChange(e, "cover")}
              disabled={isUploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 disabled:cursor-not-allowed"
            />
            <AssistantUpload
              label={coverFile ? coverFile.name : "Cover Image"}
              description="16:9 ratio. High resolution banner (Max 5MB)"
              icon={<LayoutTemplate className="h-6 w-6" />}
            />
            {coverProgress !== null && (
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mt-3 overflow-hidden">
                <div
                  className="bg-blue-600 h-full transition-all duration-300"
                  style={{ width: `${coverProgress}%` }}
                />
              </div>
            )}
          </div>
        </div>
      </AssistantCard>
    </motion.div>
  );
}
