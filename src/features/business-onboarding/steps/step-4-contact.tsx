import React, { useState } from "react";
import { motion } from "framer-motion";
import { fadeSlideVariants } from "../animations";
import { AssistantCard, AssistantQuestion } from "../components/ui/assistant-card";
import { Input } from "@/components/ui/input";
import { useFormContext, Controller, useFieldArray } from "react-hook-form";
import { BusinessSetupInput } from "@/lib/validations/business/setup";
import { Label } from "@/components/ui/label";
import {
  Phone,
  Mail,
  Globe,
  MessageCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  FaInstagram,
  FaFacebook,
  FaLinkedin,
  FaYoutube,
  FaTwitter,
  FaTelegramPlane,
} from "react-icons/fa";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  instagram: <FaInstagram className="w-4 h-4 text-pink-600" />,
  facebook: <FaFacebook className="w-4 h-4 text-blue-600" />,
  linkedin: <FaLinkedin className="w-4 h-4 text-sky-700" />,
  youtube: <FaYoutube className="w-4 h-4 text-red-600" />,
  x: <FaTwitter className="w-4 h-4 text-slate-800" />,
  telegram: <FaTelegramPlane className="w-4 h-4 text-sky-500" />,
};

const SOCIAL_PLATFORM_LABELS: Record<string, string> = {
  instagram: "Instagram Profile",
  facebook: "Facebook Page",
  linkedin: "LinkedIn Profile / Page",
  youtube: "YouTube Channel",
  x: "X (Twitter) Profile",
  telegram: "Telegram Channel / Group",
};

const SOCIAL_PLACEHOLDERS: Record<string, string> = {
  instagram: "https://instagram.com/yourbusiness",
  facebook: "https://facebook.com/yourbusiness",
  linkedin: "https://linkedin.com/company/yourbusiness",
  youtube: "https://youtube.com/@yourbusiness",
  x: "https://x.com/yourbusiness",
  telegram: "https://t.me/yourbusiness",
};

export function Step4Contact() {
  const { register, control, formState: { errors } } = useFormContext<BusinessSetupInput>();
  const { fields } = useFieldArray({
    control,
    name: "socialLinks",
  });

  const [showSocials, setShowSocials] = useState(true);

  // Filter out website/whatsapp from the social profiles grid since they are in Primary Contact
  const socialProfiles = fields
    .map((field, index) => ({ field, index }))
    .filter(({ field }) => !["website", "whatsapp"].includes(field.platform));

  return (
    <motion.div
      variants={fadeSlideVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-3xl mx-auto mt-4"
    >
      <AssistantCard>
        <AssistantQuestion>How can customers reach you?</AssistantQuestion>
        <p className="text-slate-500 text-sm mt-1.5">
          Provide your business contact details and optional social profiles so customers can connect with you.
        </p>

        {/* Section 1: Primary Contact */}
        <div className="mt-8 space-y-5">
          <div className="border-b border-slate-100 pb-2">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
              Primary Contact Information
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Phone Input with +91 indicator */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-slate-700 text-sm font-medium flex items-center gap-1.5">
                <Phone className="h-4 w-4 text-slate-500" /> Phone Number <span className="text-red-500">*</span>
              </Label>
              <div className="flex rounded-xl border border-slate-200 bg-white focus-within:ring-2 focus-within:ring-red-500 focus-within:border-red-500 overflow-hidden transition-all shadow-2xs">
                <div className="flex items-center justify-center px-3.5 bg-slate-50 border-r border-slate-200 text-xs font-semibold text-slate-700 select-none">
                  🇮🇳 +91
                </div>
                <Input
                  id="phone"
                  placeholder="98765 43210"
                  className="h-11 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none text-slate-900"
                  {...register("phone")}
                />
              </div>
              {errors.phone && <p className="text-red-500 text-xs font-medium">{errors.phone.message}</p>}
            </div>

            {/* WhatsApp Input with +91 indicator */}
            <div className="space-y-2">
              <Label htmlFor="whatsapp" className="text-slate-700 text-sm font-medium flex items-center gap-1.5">
                <MessageCircle className="h-4 w-4 text-emerald-600" /> WhatsApp Number{" "}
                <span className="text-xs text-slate-400 font-normal">(Optional)</span>
              </Label>
              <div className="flex rounded-xl border border-slate-200 bg-white focus-within:ring-2 focus-within:ring-red-500 focus-within:border-red-500 overflow-hidden transition-all shadow-2xs">
                <div className="flex items-center justify-center px-3.5 bg-slate-50 border-r border-slate-200 text-xs font-semibold text-slate-700 select-none">
                  🇮🇳 +91
                </div>
                <Input
                  id="whatsapp"
                  placeholder="98765 43210"
                  className="h-11 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none text-slate-900"
                  {...register("whatsapp")}
                />
              </div>
              {errors.whatsapp && <p className="text-red-500 text-xs font-medium">{errors.whatsapp.message}</p>}
            </div>

            {/* Email Address */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 text-sm font-medium flex items-center gap-1.5">
                <Mail className="h-4 w-4 text-slate-500" /> Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="contact@yourbusiness.com"
                className="h-11 rounded-xl"
                {...register("email")}
              />
              {errors.email && <p className="text-red-500 text-xs font-medium">{errors.email.message}</p>}
            </div>

            {/* Website */}
            <div className="space-y-2">
              <Label htmlFor="website" className="text-slate-700 text-sm font-medium flex items-center gap-1.5">
                <Globe className="h-4 w-4 text-slate-500" /> Website <span className="text-xs text-slate-400 font-normal">(Optional)</span>
              </Label>
              <Input
                id="website"
                placeholder="https://yourbusiness.com"
                className="h-11 rounded-xl"
                {...register("website")}
              />
              {errors.website && <p className="text-red-500 text-xs font-medium">{errors.website.message}</p>}
            </div>
          </div>

          {/* Preferred Contact Channel */}
          <div className="space-y-2 pt-1">
            <Label htmlFor="preferredContactMethod" className="text-slate-700 text-sm font-medium">
              Preferred Customer Contact Channel
            </Label>
            <Controller
              control={control}
              name="preferredContactMethod"
              render={({ field }) => (
                <Select value={field.value || "phone"} onValueChange={field.onChange}>
                  <SelectTrigger className="h-11 rounded-xl max-w-sm">
                    <SelectValue placeholder="Select preferred contact method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="phone">Phone Call</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp Message</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.preferredContactMethod && (
              <p className="text-red-500 text-xs font-medium">
                {errors.preferredContactMethod.message}
              </p>
            )}
          </div>
        </div>

        {/* Section 2: Social Profiles (Integrated) */}
        <div className="mt-10 pt-6 border-t border-slate-200/80">
          <div
            role="button"
            tabIndex={0}
            onClick={() => setShowSocials(!showSocials)}
            className="flex items-center justify-between cursor-pointer select-none py-1 group"
          >
            <div>
              <h3 className="text-sm font-semibold text-slate-900 group-hover:text-red-600 transition-colors flex items-center gap-2">
                Social Profiles & Online Links
                <span className="text-xs font-normal text-slate-400">(Optional)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Connect your social media accounts to build trust with customers.
              </p>
            </div>
            <button
              type="button"
              className="h-8 w-8 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-red-50 group-hover:text-red-600 flex items-center justify-center transition-colors"
            >
              {showSocials ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>

          {showSocials && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5"
            >
              {socialProfiles.map(({ field, index }) => {
                const platform = field.platform;
                const error = errors.socialLinks?.[index]?.url?.message;

                return (
                  <div key={field.id} className="space-y-1.5">
                    <Label className="flex items-center gap-2 text-xs font-medium text-slate-700">
                      {SOCIAL_ICONS[platform] || <Globe className="w-4 h-4 text-slate-400" />}
                      {SOCIAL_PLATFORM_LABELS[platform] || platform}
                    </Label>
                    <Input
                      placeholder={SOCIAL_PLACEHOLDERS[platform] || `https://${platform}.com/yourbusiness`}
                      className="h-10 rounded-xl text-sm"
                      {...register(`socialLinks.${index}.url`)}
                    />
                    {error && <p className="text-red-500 text-xs font-medium">{error}</p>}
                  </div>
                );
              })}
            </motion.div>
          )}
        </div>
      </AssistantCard>
    </motion.div>
  );
}
