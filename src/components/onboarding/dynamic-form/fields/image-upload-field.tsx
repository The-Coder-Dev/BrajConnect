"use client";

import React, { useState, useRef } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FieldConfig } from "@/lib/onboarding/types";
import { isFieldDisabled } from "@/lib/onboarding/conditions";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadFieldProps {
  field: FieldConfig;
  path: string;
}

export function ImageUploadField({ field, path }: ImageUploadFieldProps) {
  const { control, watch, formState: { errors } } = useFormContext();
  const formValues = watch();
  const disabled = isFieldDisabled(field, formValues);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pathParts = path.split(".");
  let currentError: unknown = errors;
  for (const part of pathParts) {
    if (currentError && typeof currentError === "object") {
      currentError = (currentError as Record<string, unknown>)[part];
    } else {
      currentError = undefined;
      break;
    }
  }
  const errorMessage = (currentError as { message?: string })?.message;

  const uploadFile = (file: File): Promise<{ url: string; publicId: string }> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/upload/image");

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const pct = Math.round((event.loaded / event.total) * 100);
          setProgress(pct);
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
      fd.append("folder", "brajconnect/category_media");
      xhr.send(fd);
    });
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-slate-700">
        {field.label} {field.required && <span className="text-red-500">*</span>}
      </Label>
      {field.description && (
        <p className="text-xs text-slate-500">{field.description}</p>
      )}

      <Controller
        control={control}
        name={path}
        defaultValue={field.defaultValue ?? ""}
        render={({ field: controllerField }) => {
          const currentUrl = typeof controllerField.value === "string"
            ? controllerField.value
            : controllerField.value?.url;

          const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;

            if (!file.type.startsWith("image/")) {
              toast.error("Please upload an image file (JPEG, PNG, WebP).");
              return;
            }

            try {
              setIsUploading(true);
              setProgress(0);
              const result = await uploadFile(file);
              controllerField.onChange(result.url);
              toast.success("Image uploaded successfully!");
            } catch (err: unknown) {
              const msg = err instanceof Error ? err.message : "Failed to upload image.";
              toast.error(msg);
            } finally {
              setIsUploading(false);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }
          };

          const handleRemove = () => {
            controllerField.onChange("");
          };

          return (
            <div>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleFileChange}
                disabled={disabled || isUploading}
              />

              {currentUrl ? (
                <div className="relative w-full max-w-xs h-36 rounded-xl overflow-hidden border border-slate-200 group bg-slate-100">
                  <img
                    src={currentUrl}
                    alt={field.label}
                    className="w-full h-full object-cover"
                  />
                  {!disabled && (
                    <button
                      type="button"
                      onClick={handleRemove}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  disabled={disabled || isUploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center w-full max-w-xs h-32 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/60 hover:bg-slate-50 hover:border-red-300 transition-colors cursor-pointer text-slate-500"
                >
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-red-600" />
                      <span className="text-xs font-medium text-slate-600">
                        Uploading... {progress}%
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1.5">
                      <ImagePlus className="w-6 h-6 text-slate-400" />
                      <span className="text-xs font-medium text-slate-700">
                        Upload {field.label}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        PNG, JPG, WebP up to 5MB
                      </span>
                    </div>
                  )}
                </button>
              )}
            </div>
          );
        }}
      />
      {errorMessage && (
        <p className="text-xs text-red-500 font-medium">{errorMessage}</p>
      )}
    </div>
  );
}
