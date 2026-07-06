"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeSlideVariants } from "../animations";
import { AssistantCard, AssistantQuestion } from "../components/ui/assistant-card";
import { useFormContext } from "react-hook-form";
import { BusinessSetupInput } from "@/lib/validations/business/setup";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useAssistant } from "../context/assistant-context";

export function Step8Review() {
  const { getValues } = useFormContext<BusinessSetupInput>();
  const { goToStep } = useAssistant();
  const data = getValues();

  const Section = ({ title, onEdit, children }: { title: string, onEdit: () => void, children: React.ReactNode }) => (
    <div className="py-5 border-b border-slate-200/60 last:border-0">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-slate-900">{title}</h4>
        <Button variant="ghost" size="sm" onClick={onEdit} className="h-8 px-2.5 rounded-lg text-blue-600 hover:text-blue-700 hover:bg-blue-50/80 transition-colors">
          <Pencil className="h-3.5 w-3.5 mr-1.5" /> Edit
        </Button>
      </div>
      <div className="text-slate-500 text-sm space-y-1.5">
        {children}
      </div>
    </div>
  );

  return (
    <motion.div
      variants={fadeSlideVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-2xl mx-auto mt-8"
    >
      <AssistantCard>
        <AssistantQuestion>Review your business details.</AssistantQuestion>
        <p className="text-slate-500 mb-6">Make sure everything looks good before submitting for review.</p>
        
        <div className="bg-slate-50/50 rounded-2xl border border-slate-100 px-6 shadow-sm">
          <Section title="Business Name & Category" onEdit={() => goToStep(1)}>
            <p><span className="font-medium text-foreground">Name:</span> {data.name}</p>
            <p><span className="font-medium text-foreground">Category:</span> {data.categoryId}</p>
          </Section>
          
          <Section title="Contact Information" onEdit={() => goToStep(3)}>
            <p><span className="font-medium text-foreground">Phone:</span> {data.phone}</p>
            <p><span className="font-medium text-foreground">Email:</span> {data.email}</p>
            {data.website && <p><span className="font-medium text-foreground">Website:</span> {data.website}</p>}
          </Section>

          <Section title="Location" onEdit={() => goToStep(4)}>
            <p>{data.address}</p>
            <p>{data.city}, {data.state} ({data.country})</p>
          </Section>

          <Section title="About" onEdit={() => goToStep(6)}>
            <p className="line-clamp-3">{data.description || "No description provided."}</p>
          </Section>
        </div>
      </AssistantCard>
    </motion.div>
  );
}
