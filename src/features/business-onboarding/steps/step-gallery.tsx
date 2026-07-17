"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { fadeSlideVariants } from "../animations";
import { AssistantCard, AssistantQuestion } from "../components/ui/assistant-card";
import {
  Images, X, Loader2, CheckCircle2, AlertCircle, UploadCloud
} from "lucide-react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { BusinessSetupInput } from "@/lib/validations/business/setup";
import { Button } from "@/components/ui/button";
import { useAssistant } from "../context/assistant-context";
import { saveBusinessGallery } from "@/server/actions/business/onboarding/save-gallery";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type FileStatus = "pending" | "uploading" | "success" | "error";

interface PendingFile {
  id: string;
  file: File;
  preview: string;
  status: FileStatus;
  error?: string;
}

export function StepGallery() {
  const { control } = useFormContext<BusinessSetupInput>();
  const { fields, remove } = useFieldArray({ control, name: "gallery" });
  const { registerStepValidator, unregisterStepValidator, businessId } = useAssistant();

  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  /**
   * Refs to keep the validator closure up-to-date without re-registering.
   */
  const pendingFilesRef = useRef<PendingFile[]>([]);
  const businessIdRef = useRef<string | null>(null);
  pendingFilesRef.current = pendingFiles;
  businessIdRef.current = businessId;

  // Register validator ONCE on mount
  useEffect(() => {
    registerStepValidator("gallery", async () => {
      const files = pendingFilesRef.current;
      const bId = businessIdRef.current;

      if (files.length === 0) return true;

      if (!bId) {
        toast.error("Business ID missing. Complete previous steps first.");
        return false;
      }

      setIsUploading(true);

      // Mark all as uploading
      setPendingFiles((prev) => prev.map((f) => ({ ...f, status: "uploading" })));

      try {
        const formData = new FormData();
        files.forEach((pf) => formData.append("images", pf.file));

        const res = await saveBusinessGallery(bId, formData);

        if (!res.success) {
          const errMsg = (res as any).error || "Failed to upload gallery images";
          setPendingFiles((prev) => prev.map((f) => ({ ...f, status: "error", error: errMsg })));
          throw new Error(errMsg);
        }

        setPendingFiles((prev) => prev.map((f) => ({ ...f, status: "success" })));
        return true;
      } catch (e: any) {
        setPendingFiles((prev) =>
          prev.map((f) => ({ ...f, status: f.status === "uploading" ? "error" : f.status }))
        );
        throw e;
      } finally {
        setIsUploading(false);
      }
    });

    return () => unregisterStepValidator("gallery");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally empty — refs stay current

  // Cleanup previews on unmount
  useEffect(() => {
    return () => {
      pendingFilesRef.current.forEach((f) => URL.revokeObjectURL(f.preview));
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const totalExisting = fields.length + pendingFiles.length;
    const remaining = 20 - totalExisting;
    if (remaining <= 0) {
      toast.error("Maximum 20 images allowed.");
      return;
    }

    const valid: PendingFile[] = [];
    for (const file of files.slice(0, remaining)) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`"${file.name}" exceeds 5MB limit.`);
        continue;
      }
      valid.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file,
        preview: URL.createObjectURL(file),
        status: "pending",
      });
    }

    if (valid.length > 0) {
      setPendingFiles((prev) => [...prev, ...valid]);
    }
    e.target.value = "";
  };

  const removePending = (id: string) => {
    setPendingFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter((f) => f.id !== id);
    });
  };

  const totalImages = fields.length + pendingFiles.length;
  const atLimit = totalImages >= 20;

  return (
    <motion.div
      variants={fadeSlideVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-3xl mx-auto mt-8"
    >
      <AssistantCard>
        <div className="flex items-start justify-between mb-2">
          <AssistantQuestion>Showcase your business</AssistantQuestion>
          <span className="text-sm font-medium text-slate-400 mt-1">
            {totalImages} / 20
          </span>
        </div>
        <p className="text-muted-foreground mb-8">
          Upload up to 20 photos of your business, products, or services.
        </p>

        {/* Drop zone */}
        {!atLimit && (
          <label className={cn(
            "flex flex-col items-center justify-center h-40 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 group bg-slate-50/50",
            isUploading
              ? "pointer-events-none opacity-60"
              : "border-slate-200 hover:border-blue-400 hover:bg-blue-50/30"
          )}>
            <div className="h-12 w-12 rounded-full bg-white shadow-sm text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-blue-100 transition-all duration-300">
              <UploadCloud className="h-6 w-6" />
            </div>
            <span className="text-sm font-semibold text-slate-900 mb-1">Add Photos</span>
            <span className="text-xs text-slate-500">PNG, JPG · Max 5MB each</span>
            <input
              type="file"
              multiple
              accept="image/png, image/jpeg, image/webp"
              onChange={handleFileChange}
              className="hidden"
              disabled={isUploading}
            />
          </label>
        )}

        {atLimit && (
          <div className="flex items-center justify-center h-20 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-400 text-sm">
            Maximum 20 images reached
          </div>
        )}

        {/* Image grid */}
        {totalImages > 0 && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* Existing DB images */}
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="relative group rounded-xl overflow-hidden border aspect-video bg-muted"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={(field as any).url}
                  alt="Gallery item"
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-start justify-end p-2">
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => remove(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="absolute bottom-2 left-2 bg-white/90 text-slate-700 text-xs px-2 py-0.5 rounded-md font-medium shadow-sm">
                  Saved
                </div>
              </div>
            ))}

            {/* Pending new uploads */}
            {pendingFiles.map((pf) => (
              <div
                key={pf.id}
                className="relative group rounded-xl overflow-hidden border-2 aspect-video bg-muted border-dashed border-blue-400"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pf.preview}
                  alt="Pending upload"
                  className={cn(
                    "object-cover w-full h-full",
                    pf.status === "uploading" && "opacity-50"
                  )}
                />

                {/* Status overlay */}
                {pf.status === "uploading" && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Loader2 className="h-6 w-6 text-white animate-spin" />
                  </div>
                )}
                {pf.status === "success" && (
                  <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                  </div>
                )}
                {pf.status === "error" && (
                  <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                    <AlertCircle className="h-8 w-8 text-red-500" />
                  </div>
                )}

                {/* Remove button (only when idle/pending/error) */}
                {pf.status !== "uploading" && pf.status !== "success" && (
                  <div className="absolute top-2 right-2">
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => removePending(pf.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                {/* Status badge */}
                <div className={cn(
                  "absolute bottom-2 left-2 text-white text-xs px-2 py-0.5 rounded-md font-medium shadow",
                  pf.status === "pending" && "bg-blue-500",
                  pf.status === "uploading" && "bg-yellow-500",
                  pf.status === "success" && "bg-green-500",
                  pf.status === "error" && "bg-red-500"
                )}>
                  {pf.status === "pending" && "Ready"}
                  {pf.status === "uploading" && "Uploading..."}
                  {pf.status === "success" && "✓ Uploaded"}
                  {pf.status === "error" && "Failed"}
                </div>
              </div>
            ))}
          </div>
        )}
      </AssistantCard>
    </motion.div>
  );
}
