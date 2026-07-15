"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeSlideVariants } from "../animations";
import { AssistantCard, AssistantQuestion } from "../components/ui/assistant-card";
import { useFormContext, useFieldArray } from "react-hook-form";
import { BusinessSetupInput } from "@/lib/validations/business/setup";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe, Image as Instagram, User as Facebook, Briefcase as Linkedin, Video as Youtube, Hash as Twitter, Phone as Whatsapp, MessageCircle as Telegram } from "lucide-react";

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  website: <Globe className="w-4 h-4" />,
  instagram: <Instagram className="w-4 h-4" />,
  facebook: <Facebook className="w-4 h-4" />,
  linkedin: <Linkedin className="w-4 h-4" />,
  youtube: <Youtube className="w-4 h-4" />,
  x: <Twitter className="w-4 h-4" />,
  whatsapp: <Whatsapp className="w-4 h-4" />,
  telegram: <Telegram className="w-4 h-4" />,
};

export function StepSocial() {
  const { register, control, formState: { errors } } = useFormContext<BusinessSetupInput>();
  const { fields } = useFieldArray({
    control,
    name: "socialLinks",
  });

  return (
    <motion.div
      variants={fadeSlideVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-3xl mx-auto mt-8"
    >
      <AssistantCard>
        <AssistantQuestion>Where else can customers find you?</AssistantQuestion>
        <p className="text-muted-foreground mt-2">Add links to your social media profiles. You can leave these blank if you don't have them.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {fields.map((field, index) => {
            const platform = field.platform;
            const error = errors.socialLinks?.[index]?.url?.message;

            return (
              <div key={field.id} className="space-y-2">
                <Label className="flex items-center gap-2 capitalize">
                  {SOCIAL_ICONS[platform]} {platform === 'x' ? 'X (Twitter)' : platform}
                </Label>
                <Input 
                  placeholder={`https://${platform === 'website' ? 'yourdomain.com' : platform + '.com/yourprofile'}`}
                  className="h-11 rounded-xl"
                  {...register(`socialLinks.${index}.url`)}
                />
                {error && <p className="text-red-500 text-xs">{error}</p>}
              </div>
            );
          })}
        </div>
      </AssistantCard>
    </motion.div>
  );
}
