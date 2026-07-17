"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { fadeSlideVariants } from "../animations";
import { AssistantCard, AssistantQuestion } from "../components/ui/assistant-card";
import { Button } from "@/components/ui/button";
import {
  FileUp, X, Loader2, CheckCircle2, AlertCircle, FilePlus
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAssistant } from "../context/assistant-context";
import { saveBusinessDocuments } from "@/server/actions/business/onboarding/save-documents";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type DocStatus = "pending" | "uploading" | "success" | "error";

interface PendingDoc {
  id: string;
  file: File;
  type: string;
  status: DocStatus;
  error?: string;
}

const DOC_TYPES = [
  { value: "gst", label: "GST Certificate" },
  { value: "pan", label: "PAN Card" },
  { value: "registration_certificate", label: "Registration Certificate" },
  { value: "trade_license", label: "Trade License" },
  { value: "other", label: "Other" },
] as const;

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function StepDocuments() {
  const { registerStepValidator, unregisterStepValidator, businessId } = useAssistant();
  const [pendingDocs, setPendingDocs] = useState<PendingDoc[]>([]);
  const [currentType, setCurrentType] = useState<string>("gst");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Refs keep validator closure in sync without re-registering.
   */
  const pendingDocsRef = useRef<PendingDoc[]>([]);
  const businessIdRef = useRef<string | null>(null);
  pendingDocsRef.current = pendingDocs;
  businessIdRef.current = businessId;

  // Register ONCE on mount
  useEffect(() => {
    registerStepValidator("documents", async () => {
      const docs = pendingDocsRef.current;
      const bId = businessIdRef.current;

      if (docs.length === 0) return true; // Optional step

      if (!bId) {
        toast.error("Business ID missing. Complete previous steps first.");
        return false;
      }

      setIsUploading(true);
      setPendingDocs((prev) => prev.map((d) => ({ ...d, status: "uploading" })));

      try {
        const formData = new FormData();
        docs.forEach((doc) => {
          formData.append("type", doc.type);
          formData.append("file", doc.file);
        });

        const res = await saveBusinessDocuments(bId, formData);

        if (!res.success) {
          const errMsg = (res as any).error || "Failed to upload documents";
          setPendingDocs((prev) => prev.map((d) => ({ ...d, status: "error", error: errMsg })));
          throw new Error(errMsg);
        }

        setPendingDocs((prev) => prev.map((d) => ({ ...d, status: "success" })));
        return true;
      } catch (e: any) {
        setPendingDocs((prev) =>
          prev.map((d) => ({ ...d, status: d.status === "uploading" ? "error" : d.status }))
        );
        throw e;
      } finally {
        setIsUploading(false);
      }
    });

    return () => unregisterStepValidator("documents");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally empty

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File exceeds 10MB limit.");
      return;
    }

    // Prevent duplicate file names
    if (pendingDocs.some((d) => d.file.name === file.name && d.type === currentType)) {
      toast.error("This document has already been added.");
      e.target.value = "";
      return;
    }

    setPendingDocs((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file,
        type: currentType,
        status: "pending",
      },
    ]);
    e.target.value = "";
  };

  const removeDoc = (id: string) => {
    setPendingDocs((prev) => prev.filter((d) => d.id !== id));
  };

  const docTypeLabel = (type: string) =>
    DOC_TYPES.find((d) => d.value === type)?.label ?? type;

  const statusIcon = (status: DocStatus) => {
    if (status === "uploading") return <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />;
    if (status === "success") return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    if (status === "error") return <AlertCircle className="h-4 w-4 text-red-500" />;
    return <FileUp className="h-4 w-4 text-blue-600" />;
  };

  return (
    <motion.div
      variants={fadeSlideVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-2xl mx-auto mt-8"
    >
      <AssistantCard>
        <AssistantQuestion>Upload Verification Documents</AssistantQuestion>
        <p className="text-muted-foreground mt-2">
          These documents are required to verify your business and will not be shared publicly.
        </p>

        <div className="space-y-6 mt-8">
          {/* Add Document Control */}
          <div className="p-4 border rounded-xl border-dashed bg-muted/30 space-y-3">
            <Label className="block font-medium">Add New Document</Label>
            <div className="flex gap-3 flex-col sm:flex-row">
              <Select
                value={currentType}
                onValueChange={(val) => { if (val) setCurrentType(val); }}
              >
                <SelectTrigger className="flex-1 h-11 rounded-xl">
                  <SelectValue placeholder="Document Type" />
                </SelectTrigger>
                <SelectContent>
                  {DOC_TYPES.map((dt) => (
                    <SelectItem key={dt.value} value={dt.value}>
                      {dt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                type="button"
                variant="outline"
                className="h-11 px-5 rounded-xl gap-2 whitespace-nowrap"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                <FilePlus className="h-4 w-4" />
                Choose File
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Supported: PDF, JPG, PNG · Max 10MB per file
            </p>
          </div>

          {/* Document list */}
          {pendingDocs.length > 0 && (
            <div className="space-y-2">
              <Label className="font-medium">Queued for Upload</Label>
              {pendingDocs.map((doc) => (
                <div
                  key={doc.id}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-xl border transition-colors",
                    doc.status === "pending" && "border-blue-200 bg-blue-50/50",
                    doc.status === "uploading" && "border-yellow-200 bg-yellow-50/50",
                    doc.status === "success" && "border-green-200 bg-green-50/50",
                    doc.status === "error" && "border-red-200 bg-red-50/50"
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={cn(
                      "p-2 rounded-lg flex-shrink-0",
                      doc.status === "pending" && "bg-blue-100",
                      doc.status === "uploading" && "bg-yellow-100",
                      doc.status === "success" && "bg-green-100",
                      doc.status === "error" && "bg-red-100"
                    )}>
                      {statusIcon(doc.status)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{doc.file.name}</p>
                      <p className="text-xs text-muted-foreground flex gap-2">
                        <span className="uppercase">{docTypeLabel(doc.type)}</span>
                        <span>·</span>
                        <span>{formatBytes(doc.file.size)}</span>
                        {doc.status === "uploading" && <span className="text-yellow-600">Uploading...</span>}
                        {doc.status === "success" && <span className="text-green-600">✓ Uploaded</span>}
                        {doc.status === "error" && <span className="text-red-600">Failed</span>}
                      </p>
                    </div>
                  </div>
                  {doc.status !== "uploading" && doc.status !== "success" && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-red-500 flex-shrink-0"
                      onClick={() => removeDoc(doc.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}

          {pendingDocs.length === 0 && (
            <div className="py-8 text-center text-sm text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
              No documents added yet. This step is optional.
            </div>
          )}
        </div>
      </AssistantCard>
    </motion.div>
  );
}
