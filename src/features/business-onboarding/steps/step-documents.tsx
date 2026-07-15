"use client";

import React from "react";
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

export function StepDocuments() {
  const { control, setValue, formState: { errors } } = useFormContext<BusinessSetupInput>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "documents",
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "gst" | "pan" | "registration_certificate" | "trade_license" | "other") => {
    const file = e.target.files?.[0];
    if (file) {
      // Note: Actual upload logic to Supabase Storage would go here
      // For now we populate the form state to simulate a successful upload
      append({
        type,
        fileName: file.name,
        mimeType: file.type,
        storagePath: `temp/${file.name}`, // Simulated path
      });
    }
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
              <Select defaultValue="gst">
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
                  onChange={(e) => handleFileUpload(e, "gst")}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <Button variant="outline" className="w-32 gap-2">
                  <FileUp className="w-4 h-4" /> Upload
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Supported formats: PDF, JPG, PNG (Max 5MB)</p>
          </div>

          {fields.length > 0 && (
            <div className="space-y-3">
              <Label>Uploaded Documents</Label>
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
            </div>
          )}

        </div>
      </AssistantCard>
    </motion.div>
  );
}
