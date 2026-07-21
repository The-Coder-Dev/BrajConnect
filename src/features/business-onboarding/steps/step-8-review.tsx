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
import { getActiveAmenities } from "@/server/actions/business/onboarding/get-amenities";
import { useEffect, useState } from "react";

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

export function Step8Review() {
  const { getValues } = useFormContext<BusinessSetupInput>();
  const { goToStep, saveAsDraft, isSubmitting } = useAssistant();
  const data = getValues();
  const [amenitiesMap, setAmenitiesMap] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetchMap() {
      if (data.amenities.length > 0) {
        const res = await getActiveAmenities();
        if (res.success && res.data) {
          const map: Record<string, string> = {};
          res.data.forEach(a => map[a.id] = a.name);
          setAmenitiesMap(map);
        }
      }
    }
    fetchMap();
  }, [data.amenities]);

  return (
    <motion.div
      variants={fadeSlideVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-2xl mx-auto mt-8"
    >
      <AssistantCard>
        <div className="flex justify-between items-start mb-6">
          <div>
            <AssistantQuestion>Review your business details.</AssistantQuestion>
            <p className="text-slate-500 mt-2">Make sure everything looks good before submitting for review.</p>
          </div>
          <Button variant="outline" onClick={saveAsDraft} disabled={isSubmitting}>
            Save as Draft
          </Button>
        </div>
        
        <div className="bg-slate-50/50 rounded-2xl border border-slate-100 px-6 shadow-sm">
          <Section title="Business Name & Category" onEdit={() => goToStep(1)}>
            <p><span className="font-medium text-foreground">Name:</span> {data.name}</p>
            <p><span className="font-medium text-foreground">Category:</span> {data.categoryId}</p>
          </Section>
          
          <Section title="Contact Information" onEdit={() => goToStep(4)}>
            <p><span className="font-medium text-foreground">Phone:</span> {data.phone}</p>
            {data.whatsapp && <p><span className="font-medium text-foreground">WhatsApp:</span> {data.whatsapp}</p>}
            <p><span className="font-medium text-foreground">Email:</span> {data.email}</p>
            {data.website && <p><span className="font-medium text-foreground">Website:</span> {data.website}</p>}
          </Section>

          <Section title="Location" onEdit={() => goToStep(5)}>
            <p>{data.address}</p>
            <p>{data.city}, {data.state} {data.postalCode}</p>
            <p>{data.country}</p>
          </Section>

          <Section title="Business Hours" onEdit={() => goToStep(6)}>
            {data.hours.filter(h => !h.isClosed).length > 0 ? (
              <p>Hours configured for {data.hours.filter(h => !h.isClosed).length} days.</p>
            ) : (
              <p>No business hours set.</p>
            )}
          </Section>
          
          <Section title="Social Links" onEdit={() => goToStep(7)}>
            {data.socialLinks.filter(s => s.url).length > 0 ? (
              <ul className="list-disc pl-4 space-y-1">
                {data.socialLinks.filter(s => s.url).map((s, i) => (
                  <li key={i} className="capitalize">{s.platform}: <a href={s.url} target="_blank" rel="noreferrer" className="text-primary hover:underline lowercase">{s.url}</a></li>
                ))}
              </ul>
            ) : (
              <p>No social links provided.</p>
            )}
          </Section>

          <Section title="About" onEdit={() => goToStep(10)}>
            {data.shortDescription && <p className="font-medium mb-1 line-clamp-2">{data.shortDescription}</p>}
            <p className="line-clamp-3">{data.description || "No full description provided."}</p>
          </Section>
          
          <Section title="Verification Documents" onEdit={() => goToStep(11)}>
            {data.documents.length > 0 ? (
              <ul className="list-disc pl-4 space-y-1">
                {data.documents.map((doc, i) => (
                  <li key={i}>{doc.fileName} <span className="text-xs uppercase text-muted-foreground ml-2">({doc.type.replace('_', ' ')})</span></li>
                ))}
              </ul>
            ) : (
              <p className="text-red-500">No documents uploaded. Verification requires at least one document.</p>
            )}
          </Section>

          <Section title="Services Offered" onEdit={() => goToStep(12)}>
            {data.services.length > 0 ? (
              <ul className="list-disc pl-4 space-y-1">
                {data.services.map((svc, i) => (
                  <li key={i} className="font-medium text-foreground">{svc.name}</li>
                ))}
              </ul>
            ) : (
              <p>No services listed.</p>
            )}
          </Section>

          <Section title="Amenities" onEdit={() => goToStep(13)}>
            {data.amenities.length > 0 ? (
              <ul className="space-y-1">
                {data.amenities.map((amId, i) => (
                  <li key={i} className="text-foreground">✓ {amId}</li>
                ))}
              </ul>
            ) : (
              <p>No amenities listed.</p>
            )}
          </Section>
        </div>
      </AssistantCard>
    </motion.div>
  );
}

