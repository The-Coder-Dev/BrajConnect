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

  const filledSocials = (data.socialLinks || []).filter((s) => s.url && s.url.trim().length > 0);
  const openHours = (data.hours || []).filter((h) => !h.isClosed);
  const galleryCount = (data.gallery || []).length;

  return (
    <motion.div
      variants={fadeSlideVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-4xl mx-auto mt-4"
    >
      <AssistantCard>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <AssistantQuestion>Review your business details.</AssistantQuestion>
            <p className="text-slate-500 text-sm mt-1">
              Please double-check all your information before final submission for review.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={saveAsDraft}
            disabled={isSubmitting}
            className="rounded-xl border-slate-200 shrink-0 self-start sm:self-auto"
          >
            Save as Draft
          </Button>
        </div>

        <div className="bg-slate-50/70 rounded-2xl border border-slate-200/80 px-6 py-2 shadow-2xs divide-y divide-slate-200/60">
          {/* 1. Business Basics & Category */}
          <Section title="1. Business Basics" onEdit={() => goToStep(1)}>
            <p>
              <span className="font-medium text-slate-900">Name:</span> {data.name || "—"}
            </p>
            <p>
              <span className="font-medium text-slate-900">Category:</span>{" "}
              <span className="capitalize">{data.categoryId ? data.categoryId.replace("cat_", "") : "—"}</span>
            </p>
          </Section>

          {/* 2. Category Specific Details */}
          {data.categoryData && Object.keys(data.categoryData).length > 0 && (
            <Section title="2. Category Specific Details" onEdit={() => goToStep(3)}>
              <div className="space-y-1 mt-1">
                {Object.entries(data.categoryData).map(([key, val]) => {
                  if (
                    val === undefined ||
                    val === null ||
                    val === "" ||
                    (Array.isArray(val) && val.length === 0)
                  )
                    return null;
                  const displayKey = key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase());
                  let displayVal = String(val);
                  if (Array.isArray(val)) {
                    displayVal = val
                      .map((v) => (typeof v === "object" ? JSON.stringify(v) : String(v)))
                      .join(", ");
                  } else if (typeof val === "object") {
                    displayVal = Object.entries(val as Record<string, unknown>)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(" | ");
                  }
                  return (
                    <p key={key} className="text-xs">
                      <span className="font-medium text-slate-900">{displayKey}:</span> {displayVal}
                    </p>
                  );
                })}
              </div>
            </Section>
          )}

          {/* 3. Contact & Social Profiles */}
          <Section title="3. Contact & Social Profiles" onEdit={() => goToStep(4)}>
            <div className="space-y-1">
              <p>
                <span className="font-medium text-slate-900">Primary Phone:</span> {data.phone ? `+91 ${data.phone}` : "—"}
              </p>
              {data.whatsapp && (
                <p>
                  <span className="font-medium text-slate-900">WhatsApp:</span> +91 {data.whatsapp}
                </p>
              )}
              {data.email && (
                <p>
                  <span className="font-medium text-slate-900">Email:</span> {data.email}
                </p>
              )}
              {data.website && (
                <p>
                  <span className="font-medium text-slate-900">Website:</span>{" "}
                  <a href={data.website} target="_blank" rel="noreferrer" className="text-red-600 hover:underline">
                    {data.website}
                  </a>
                </p>
              )}
              {filledSocials.length > 0 && (
                <div className="pt-1.5">
                  <span className="font-medium text-slate-900 block text-xs mb-1">Social Profiles:</span>
                  <div className="flex flex-wrap gap-2">
                    {filledSocials.map((s, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        <span className="font-semibold capitalize">{s.platform}:</span>
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-600 hover:text-red-600 truncate max-w-[140px]"
                        >
                          {s.url}
                        </a>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Section>

          {/* 4. Location */}
          <Section title="4. Location" onEdit={() => goToStep(5)}>
            <p className="font-medium text-slate-900">{data.address || "No street address provided"}</p>
            <p>
              {[data.city, data.state, data.postalCode ? `PIN: ${data.postalCode}` : "", data.country]
                .filter(Boolean)
                .join(", ")}
            </p>
          </Section>

          {/* 5. Business Hours */}
          <Section title="5. Business Hours" onEdit={() => goToStep(6)}>
            {openHours.length > 0 ? (
              <p>Operating hours set for {openHours.length} days a week.</p>
            ) : (
              <p className="text-slate-400 italic">No business hours specified.</p>
            )}
          </Section>

          {/* 6. Brand & Media */}
          <Section title="6. Brand & Media" onEdit={() => goToStep(7)}>
            <div className="flex flex-wrap gap-4 text-xs">
              <span>
                <span className="font-medium text-slate-900">Logo:</span>{" "}
                {data.logo ? "✓ Uploaded" : "Not set"}
              </span>
              <span>
                <span className="font-medium text-slate-900">Cover Banner:</span>{" "}
                {data.cover ? "✓ Uploaded" : "Not set"}
              </span>
              <span>
                <span className="font-medium text-slate-900">Gallery:</span>{" "}
                {galleryCount > 0 ? `${galleryCount} photo(s) added` : "No photos"}
              </span>
            </div>
          </Section>

          {/* 7. About Business */}
          <Section title="7. About Business" onEdit={() => goToStep(8)}>
            {data.shortDescription && (
              <p className="font-medium text-slate-900 mb-1">{data.shortDescription}</p>
            )}
            <p className="line-clamp-3 text-slate-600">
              {data.description || "No full description provided."}
            </p>
            {data.establishedYear && (
              <p className="text-xs text-slate-400 mt-1">Established: {data.establishedYear}</p>
            )}
          </Section>

          {/* 8. Verification Documents */}
          <Section title="8. Verification Documents" onEdit={() => goToStep(9)}>
            {data.documents && data.documents.length > 0 ? (
              <ul className="list-disc pl-4 space-y-1 text-xs">
                {data.documents.map((doc, i) => (
                  <li key={i}>
                    {doc.fileName}{" "}
                    <span className="text-[11px] uppercase text-slate-400 ml-1">
                      ({doc.type?.replace("_", " ")})
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-amber-600 text-xs font-medium">
                No documents uploaded yet. (Verification requires at least one valid business document).
              </p>
            )}
          </Section>
        </div>
      </AssistantCard>
    </motion.div>
  );
}

