"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fadeSlideVariants } from "../animations";
import { AssistantCard, AssistantQuestion } from "../components/ui/assistant-card";
import { useFormContext, useFieldArray } from "react-hook-form";
import { BusinessSetupInput } from "@/lib/validations/business/setup";
import { Button } from "@/components/ui/button";
import { FileUp, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAssistant } from "../context/assistant-context";
import { saveBusinessDocuments } from "@/server/actions/business/onboarding/save-documents";
import { documentTypeEnum } from "@/db/schema";

export function StepDocuments() {
  const { control } = useFormContext<BusinessSetupInput>();
  const { fields, remove } = useFieldArray({
    control,
    name: "documents",
  });
  
  const { registerStepValidator, unregisterStepValidator, businessId } = useAssistant();
  const [newDocs, setNewDocs] = useState<{ file: File; type: string }[]>([]);
  const [currentType, setCurrentType] = useState<string>("gst");

  useEffect(() => {
    registerStepValidator("documents", async () => {
      if (newDocs.length === 0) return true; // Optional step, skip if nothing new
      if (!businessId) return false;

      const formData = new FormData();
      newDocs.forEach((doc) => {
        formData.append("type", doc.type);
        formData.append("file", doc.file);
      });

      const res = await saveBusinessDocuments(businessId, formData);
      if (!res.success) {
        throw new Error((res as any).error || "Failed to upload documents");
      }
      return true;
    });

    return () => unregisterStepValidator("documents");
  }, [registerStepValidator, unregisterStepValidator, newDocs, businessId]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File size exceeds 10MB limit");
        return;
      }
      setNewDocs(prev => [...prev, { file, type: currentType }]);
      // Reset input
      e.target.value = '';
    }
  };

  const removeNewDoc = (index: number) => {
    setNewDocs(prev => prev.filter((_, i) => i !== index));
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
        <p className="text-muted-foreground mt-2">These documents are required to verify your business and will not be shared publicly.</p>
        
        <div className="space-y-6 mt-8">
          
          <div className="p-4 border rounded-xl border-dashed bg-muted/30">
            <Label className="mb-3 block">Add New Document</Label>
            <div className="flex gap-4">
              <Select value={currentType} onValueChange={(val) => { if (val) setCurrentType(val); }}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Document Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gst">GST Certificate</SelectItem>
                  <SelectItem value="pan">PAN Card</SelectItem>
                  <SelectItem value="registration_certificate">Registration Certificate</SelectItem>
                  <SelectItem value="trade_license">Trade License</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative">
                <Input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleFileUpload}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <Button variant="outline" className="w-32 gap-2">
                  <FileUp className="w-4 h-4" /> Upload
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Supported formats: PDF, JPG, PNG (Max 10MB)</p>
          </div>

          {(fields.length > 0 || newDocs.length > 0) && (
            <div className="space-y-3">
              <Label>Documents</Label>
              {/* Existing DB docs */}
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-md">
                      <FileUp className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{field.fileName}</p>
                      <p className="text-xs text-muted-foreground uppercase">{field.type.replace('_', ' ')}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => remove(index)} className="text-muted-foreground hover:text-red-500">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              {/* New files to upload */}
              {newDocs.map((doc, index) => (
                <div key={`new-${index}`} className="flex items-center justify-between p-3 rounded-lg border border-dashed border-blue-400">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-md">
                      <FileUp className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-900">{doc.file.name}</p>
                      <p className="text-xs text-blue-600 uppercase">Ready to upload • {doc.type.replace('_', ' ')}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeNewDoc(index)} className="text-muted-foreground hover:text-red-500">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

        </div>
      </AssistantCard>
    </motion.div>
  );
}
