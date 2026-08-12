import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { fadeSlideVariants } from "../animations";
import { AssistantCard, AssistantQuestion } from "../components/ui/assistant-card";
import { AssistantUpload } from "../components/ui/assistant-upload";
import {
  ImageIcon,
  LayoutTemplate,
  Images,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Plus,
  Loader2,
} from "lucide-react";
import { useAssistant } from "../context/assistant-context";
import { useFormContext, useFieldArray } from "react-hook-form";
import { BusinessSetupInput } from "@/lib/validations/business/setup";
import { saveBusinessBrand } from "@/server/actions/business/onboarding/save-brand";
import { saveBusinessGallery } from "@/server/actions/business/onboarding/save-gallery";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";

interface PendingGalleryFile {
  id: string;
  file: File;
  preview: string;
  progress: number;
  status: "idle" | "uploading" | "success" | "error";
  error?: string;
}

// Local helper to handle AJAX file uploads with progress tracking
const uploadImageFile = (
  file: File,
  businessId: string,
  folderType: "logo" | "cover" | "gallery",
  onProgress: (pct: number) => void
): Promise<{ url: string; publicId: string; format?: string; bytes?: number; width?: number; height?: number }> => {
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
  const { control } = useFormContext<BusinessSetupInput>();
  const { fields: existingGallery, remove: removeExistingGallery } = useFieldArray({
    control,
    name: "gallery",
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [pendingGallery, setPendingGallery] = useState<PendingGalleryFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [logoProgress, setLogoProgress] = useState<number | null>(null);
  const [coverProgress, setCoverProgress] = useState<number | null>(null);

  const logoFileRef = useRef<File | null>(logoFile);
  const coverFileRef = useRef<File | null>(coverFile);
  const pendingGalleryRef = useRef<PendingGalleryFile[]>(pendingGallery);
  const businessIdRef = useRef<string | null>(businessId);

  useEffect(() => {
    logoFileRef.current = logoFile;
    coverFileRef.current = coverFile;
    pendingGalleryRef.current = pendingGallery;
    businessIdRef.current = businessId;
  }, [logoFile, coverFile, pendingGallery, businessId]);

  useEffect(() => {
    registerStepValidator("brand", async () => {
      const currentLogo = logoFileRef.current;
      const currentCover = coverFileRef.current;
      const galleryFiles = pendingGalleryRef.current;
      const bId = businessIdRef.current;

      const unuploadedGallery = galleryFiles.filter((f) => f.status !== "success");
      const hasBrandUploads = Boolean(currentLogo || currentCover);
      const hasGalleryUploads = unuploadedGallery.length > 0;

      if (!hasBrandUploads && !hasGalleryUploads) return true; // nothing pending

      if (!bId) {
        toast.error("Business ID missing. Complete previous steps first.");
        return false;
      }

      setIsUploading(true);
      try {
        // 1. Upload Brand Identity (Logo / Cover)
        if (hasBrandUploads) {
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
        }

        // 2. Upload Pending Gallery Images
        if (hasGalleryUploads) {
          const uploadedGallery: {
            imageUrl: string;
            cloudinaryPublicId: string;
            format?: string;
            bytes?: number;
            width?: number;
            height?: number;
          }[] = [];

          for (const pf of galleryFiles) {
            if (pf.status === "success") continue;

            setPendingGallery((prev) =>
              prev.map((f) => (f.id === pf.id ? { ...f, status: "uploading", progress: 0 } : f))
            );

            try {
              const res = await uploadImageFile(pf.file, bId, "gallery", (pct) => {
                setPendingGallery((prev) =>
                  prev.map((f) => (f.id === pf.id ? { ...f, progress: pct } : f))
                );
              });

              setPendingGallery((prev) =>
                prev.map((f) => (f.id === pf.id ? { ...f, status: "success" } : f))
              );

              uploadedGallery.push({
                imageUrl: res.url,
                cloudinaryPublicId: res.publicId,
                format: res.format,
                bytes: res.bytes,
                width: res.width,
                height: res.height,
              });
            } catch (galleryErr: any) {
              setPendingGallery((prev) =>
                prev.map((f) =>
                  f.id === pf.id ? { ...f, status: "error", error: galleryErr.message || "Failed" } : f
                )
              );
              throw galleryErr;
            }
          }

          const saveRes = await saveBusinessGallery(bId, uploadedGallery);
          if (!saveRes.success) {
            throw new Error(saveRes.error || "Failed to save gallery in database");
          }
        }

        return true;
      } catch (err: any) {
        toast.error(err.message || "Failed to upload media");
        throw err;
      } finally {
        setIsUploading(false);
        setLogoProgress(null);
        setCoverProgress(null);
      }
    });

    return () => unregisterStepValidator("brand");
  }, [registerStepValidator, unregisterStepValidator]);

  // Clean up gallery object URLs
  useEffect(() => {
    return () => {
      pendingGalleryRef.current.forEach((f) => URL.revokeObjectURL(f.preview));
    };
  }, []);

  const handleBrandFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "logo" | "cover") => {
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

  const handleGalleryFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const totalAllowed = 20;
    const currentTotal = existingGallery.length + pendingGallery.length;
    if (currentTotal + files.length > totalAllowed) {
      toast.error(`You can upload a maximum of ${totalAllowed} photos.`);
      return;
    }

    const newPending: PendingGalleryFile[] = [];
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 5MB limit.`);
        continue;
      }
      newPending.push({
        id: `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        file,
        preview: URL.createObjectURL(file),
        progress: 0,
        status: "idle",
      });
    }

    setPendingGallery((prev) => [...prev, ...newPending]);
    e.target.value = ""; // Reset input
  };

  const removePendingGalleryItem = (id: string) => {
    setPendingGallery((prev) => {
      const item = prev.find((f) => f.id === id);
      if (item) URL.revokeObjectURL(item.preview);
      return prev.filter((f) => f.id !== id);
    });
  };

  return (
    <motion.div
      variants={fadeSlideVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-4xl mx-auto mt-4"
    >
      <AssistantCard>
        <AssistantQuestion>Showcase your business with photos and branding.</AssistantQuestion>
        <p className="text-slate-500 text-sm mt-1.5">
          High-quality photos and brand assets build trust and help attract more customers. (Optional — you can update these anytime).
        </p>

        {/* Section 1: Brand Assets */}
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
            1. Brand Identity
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Logo Upload */}
            <div className="relative">
              <input
                type="file"
                accept="image/png, image/jpeg, image/svg+xml, image/webp"
                onChange={(e) => handleBrandFileChange(e, "logo")}
                disabled={isUploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 disabled:cursor-not-allowed"
              />
              <AssistantUpload
                label={logoFile ? logoFile.name : "Business Logo"}
                description="1:1 square. SVG, PNG, JPG (Max 2MB)"
                icon={<ImageIcon className="h-6 w-6" />}
              />
              {logoProgress !== null && (
                <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
                  <div
                    className="bg-red-600 h-full transition-all duration-300"
                    style={{ width: `${logoProgress}%` }}
                  />
                </div>
              )}
            </div>

            {/* Cover Upload */}
            <div className="relative">
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={(e) => handleBrandFileChange(e, "cover")}
                disabled={isUploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 disabled:cursor-not-allowed"
              />
              <AssistantUpload
                label={coverFile ? coverFile.name : "Cover Banner"}
                description="16:9 widescreen banner (Max 5MB)"
                icon={<LayoutTemplate className="h-6 w-6" />}
              />
              {coverProgress !== null && (
                <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
                  <div
                    className="bg-red-600 h-full transition-all duration-300"
                    style={{ width: `${coverProgress}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Photo Gallery */}
        <div className="mt-10 pt-6 border-t border-slate-200/80">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Images className="h-4 w-4 text-red-600" /> 2. Photo Gallery
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Upload up to 20 storefront, interior, product, or work photos ({existingGallery.length + pendingGallery.length}/20 uploaded)
              </p>
            </div>

            <label className="cursor-pointer">
              <input
                type="file"
                multiple
                accept="image/png, image/jpeg, image/webp"
                onChange={handleGalleryFilesChange}
                disabled={isUploading || existingGallery.length + pendingGallery.length >= 20}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-xl border-slate-200 hover:border-red-300 hover:text-red-600 gap-1.5 pointer-events-none"
              >
                <Plus className="h-4 w-4" /> Add Photos
              </Button>
            </label>
          </div>

          {/* Gallery Items Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 mt-4">
            {/* Existing Saved Gallery Images */}
            {existingGallery.map((img, idx) => (
              <div
                key={img.id}
                className="relative group rounded-xl overflow-hidden aspect-video bg-slate-100 border border-slate-200"
              >
                <Image
                  src={img.url}
                  alt={`Gallery photo ${idx + 1}`}
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeExistingGallery(idx)}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all shadow-xs"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
                <div className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-medium backdrop-blur-xs flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" /> Saved
                </div>
              </div>
            ))}

            {/* Pending Uploads */}
            {pendingGallery.map((pf) => (
              <div
                key={pf.id}
                className="relative group rounded-xl overflow-hidden aspect-video bg-slate-100 border border-slate-200"
              >
                <Image
                  src={pf.preview}
                  alt={pf.file.name}
                  fill
                  className="object-cover"
                />
                {pf.status === "uploading" && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-2xs flex flex-col items-center justify-center gap-1 text-white">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="text-[10px] font-medium">{pf.progress}%</span>
                  </div>
                )}
                {pf.status === "success" && (
                  <div className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-emerald-600/90 text-white text-[10px] font-medium flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Uploaded
                  </div>
                )}
                {pf.status === "error" && (
                  <div className="absolute inset-0 bg-red-900/60 flex flex-col items-center justify-center text-white p-2 text-center">
                    <AlertCircle className="h-4 w-4 mb-1" />
                    <span className="text-[10px] leading-tight">Failed</span>
                  </div>
                )}
                {pf.status !== "uploading" && (
                  <button
                    type="button"
                    onClick={() => removePendingGalleryItem(pf.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all shadow-xs"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))}

            {/* Empty placeholder slot / Add card if under 20 */}
            {existingGallery.length + pendingGallery.length === 0 && (
              <div className="col-span-full py-8 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center p-6 bg-slate-50/50">
                <Images className="h-8 w-8 text-slate-400 mb-2" />
                <p className="text-sm font-medium text-slate-700">No gallery photos added yet</p>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  Add photos of your storefront, interiors, team, or menu/catalog to make your profile stand out.
                </p>
              </div>
            )}
          </div>
        </div>
      </AssistantCard>
    </motion.div>
  );
}
