"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { fadeSlideVariants } from "../animations";
import { AssistantCard, AssistantQuestion } from "../components/ui/assistant-card";
import { ImageIcon, LayoutTemplate, CheckCircle2, AlertCircle, Loader2, X } from "lucide-react";
import { useAssistant } from "../context/assistant-context";
import { saveBusinessBrand } from "@/server/actions/business/onboarding/save-brand";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type UploadStatus = "idle" | "uploading" | "success" | "error";

interface ImageField {
  file: File | null;
  preview: string | null;
  status: UploadStatus;
  error: string | null;
}

const EMPTY_FIELD: ImageField = { file: null, preview: null, status: "idle", error: null };

export function Step6Brand() {
  const { registerStepValidator, unregisterStepValidator, businessId } = useAssistant();

  const [logoField, setLogoField] = useState<ImageField>(EMPTY_FIELD);
  const [coverField, setCoverField] = useState<ImageField>(EMPTY_FIELD);

  /**
   * Use refs to give the validator closure access to the latest state
   * WITHOUT re-registering the validator every time state changes.
   * This is the key pattern to prevent the infinite loop.
   */
  const logoFileRef = useRef<File | null>(null);
  const coverFileRef = useRef<File | null>(null);
  const businessIdRef = useRef<string | null>(null);

  // Keep refs in sync
  logoFileRef.current = logoField.file;
  coverFileRef.current = coverField.file;
  businessIdRef.current = businessId;

  // Register the validator ONCE on mount
  useEffect(() => {
    registerStepValidator("brand", async () => {
      const logoFile = logoFileRef.current;
      const coverFile = coverFileRef.current;
      const bId = businessIdRef.current;

      if (!logoFile && !coverFile) return true; // Both optional

      if (!bId) {
        toast.error("Business ID is missing. Please complete the previous steps first.");
        return false;
      }

      // Update uploading states
      if (logoFile) {
        setLogoField((prev) => ({ ...prev, status: "uploading" }));
      }
      if (coverFile) {
        setCoverField((prev) => ({ ...prev, status: "uploading" }));
      }

      try {
        const formData = new FormData();
        if (logoFile) formData.append("logo", logoFile);
        if (coverFile) formData.append("cover", coverFile);

        const res = await saveBusinessBrand(bId, formData);

        if (!res.success) {
          const errMsg = (res as any).error || "Failed to upload brand images";
          if (logoFile) setLogoField((prev) => ({ ...prev, status: "error", error: errMsg }));
          if (coverFile) setCoverField((prev) => ({ ...prev, status: "error", error: errMsg }));
          throw new Error(errMsg);
        }

        if (logoFile) setLogoField((prev) => ({ ...prev, status: "success" }));
        if (coverFile) setCoverField((prev) => ({ ...prev, status: "success" }));
        return true;
      } catch (e: any) {
        if (logoFile) setLogoField((prev) => ({ ...prev, status: "error", error: e.message }));
        if (coverFile) setCoverField((prev) => ({ ...prev, status: "error", error: e.message }));
        throw e;
      }
    });

    return () => unregisterStepValidator("brand");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally empty — refs keep state current

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "logo" | "cover"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Size validation
    const maxBytes = type === "logo" ? 2 * 1024 * 1024 : 5 * 1024 * 1024;
    const maxLabel = type === "logo" ? "2MB" : "5MB";
    if (file.size > maxBytes) {
      toast.error(`${type === "logo" ? "Logo" : "Cover"} image must be under ${maxLabel}`);
      return;
    }

    // Revoke old preview
    const setter = type === "logo" ? setLogoField : setCoverField;
    setter((prev) => {
      if (prev.preview) URL.revokeObjectURL(prev.preview);
      return { file, preview: URL.createObjectURL(file), status: "idle", error: null };
    });

    e.target.value = "";
  };

  const removeImage = (type: "logo" | "cover") => {
    const setter = type === "logo" ? setLogoField : setCoverField;
    setter((prev) => {
      if (prev.preview) URL.revokeObjectURL(prev.preview);
      return EMPTY_FIELD;
    });
  };

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (logoField.preview) URL.revokeObjectURL(logoField.preview);
      if (coverField.preview) URL.revokeObjectURL(coverField.preview);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          Upload high-quality images to help your business stand out.{" "}
          <span className="text-slate-400">(Optional — you can skip this step)</span>
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Logo */}
          <UploadZone
            label="Business Logo"
            description="1:1 ratio · SVG, PNG, JPG · Max 2MB"
            field={logoField}
            icon={<ImageIcon className="h-6 w-6" />}
            accept="image/png, image/jpeg, image/svg+xml"
            onChange={(e) => handleFileChange(e, "logo")}
            onRemove={() => removeImage("logo")}
          />

          {/* Cover */}
          <UploadZone
            label="Cover Image"
            description="16:9 ratio · PNG, JPG · Max 5MB"
            field={coverField}
            icon={<LayoutTemplate className="h-6 w-6" />}
            accept="image/png, image/jpeg"
            onChange={(e) => handleFileChange(e, "cover")}
            onRemove={() => removeImage("cover")}
          />
        </div>
      </AssistantCard>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// UploadZone sub-component
// ---------------------------------------------------------------------------
interface UploadZoneProps {
  label: string;
  description: string;
  field: ImageField;
  icon: React.ReactNode;
  accept: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}

function UploadZone({ label, description, field, icon, accept, onChange, onRemove }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const statusIcon = () => {
    if (field.status === "uploading") return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
    if (field.status === "success") return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    if (field.status === "error") return <AlertCircle className="h-5 w-5 text-red-500" />;
    return null;
  };

  if (field.preview) {
    return (
      <div className="relative rounded-2xl overflow-hidden border-2 border-slate-200 group">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={field.preview}
          alt={label}
          className={cn(
            "w-full h-48 object-cover transition-all duration-300",
            field.status === "uploading" && "opacity-60"
          )}
        />
        {/* Status overlay */}
        {field.status !== "idle" && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="bg-white rounded-full p-2 shadow">{statusIcon()}</div>
          </div>
        )}
        {/* Remove / Replace buttons */}
        {field.status === "idle" && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="h-8 px-3 text-xs"
              onClick={() => inputRef.current?.click()}
            >
              Replace
            </Button>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              className="h-8 px-3 text-xs"
              onClick={onRemove}
            >
              <X className="h-3 w-3 mr-1" /> Remove
            </Button>
          </div>
        )}
        {field.status === "success" && (
          <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-md font-medium">
            ✓ Uploaded
          </div>
        )}
        {field.error && (
          <div className="absolute bottom-2 left-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-md">
            {field.error}
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={onChange}
          className="hidden"
        />
        <div className="absolute top-2 right-2 bg-white/90 rounded-full px-2 py-0.5 text-xs font-medium text-slate-600 shadow-sm">
          {label}
        </div>
      </div>
    );
  }

  return (
    <label className={cn(
      "flex flex-col items-center justify-center h-48 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 group bg-slate-50/50",
      field.status === "error"
        ? "border-red-300 bg-red-50/30"
        : "border-slate-200 hover:border-blue-400 hover:bg-blue-50/30"
    )}>
      <div className={cn(
        "h-12 w-12 rounded-full flex items-center justify-center mb-3 transition-all duration-300",
        field.status === "error"
          ? "bg-red-100 text-red-500"
          : "bg-white shadow-sm text-blue-600 group-hover:scale-110 group-hover:bg-blue-100"
      )}>
        {icon}
      </div>
      <span className="text-sm font-semibold text-slate-900 mb-1">{label}</span>
      <span className="text-xs text-slate-500 text-center px-4">{description}</span>
      <span className="mt-3 px-4 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-600 group-hover:border-blue-200 group-hover:text-blue-700 transition-colors">
        Choose File
      </span>
      <input
        type="file"
        accept={accept}
        onChange={onChange}
        className="hidden"
      />
    </label>
  );
}
