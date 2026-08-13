"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { submitContactMessage } from "@/server/actions/contact";
import { toast } from "sonner";
import { Loader2, CheckCircle2, Send, Mail, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  category: z.enum(["general", "business_support", "partnership", "feedback", "other"]),
  subject: z.string().min(3, "Subject must be at least 3 characters").max(150, "Subject is too long"),
  message: z.string().min(10, "Message must be at least 10 characters").max(3000, "Message cannot exceed 3000 characters"),
  consent: z.boolean().refine((val) => val === true, {
    message: "You must agree to our privacy policy to proceed",
  }),
});

type ContactFormValues = z.infer<typeof contactSchema>;

interface ContactFormProps {
  defaultSubject?: string;
  defaultCategory?: string;
}

export function ContactForm({ defaultSubject = "", defaultCategory = "general" }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      category: (["general", "business_support", "partnership", "feedback", "other"].includes(defaultCategory)
        ? defaultCategory
        : "general") as any,
      subject: defaultSubject,
      message: "",
      consent: false,
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await submitContactMessage(values);

      if (response.success) {
        setIsSubmitted(true);
        toast.success("Message sent successfully!", {
          description: "Our support team will get back to you shortly.",
        });
        form.reset();
      } else {
        setErrorMessage(response.error || "Failed to send your message. Please try again.");
        toast.error("Message submission failed", {
          description: response.error || "Please check your form details and retry.",
        });
      }
    } catch (err: any) {
      const msg = err?.message || "An unexpected error occurred. Please try again.";
      setErrorMessage(msg);
      toast.error("Error", { description: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {isSubmitted ? (
          <motion.div
            key="success-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-8 sm:p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl"
          >
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center mx-auto mb-6 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
              Message Received!
            </h3>

            <p className="text-slate-600 dark:text-slate-300 max-w-md mx-auto mb-8 text-sm sm:text-base leading-relaxed">
              Thank you for reaching out to BachatLal. We have received your inquiry and our team will get back to you via email within 24 business hours.
            </p>

            <Button
              onClick={() => setIsSubmitted(false)}
              variant="outline"
              className="rounded-xl px-6 h-11 border-slate-200 dark:border-slate-800 text-sm font-semibold"
            >
              Send Another Message
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="contact-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl"
          >
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
                Send Us a Message
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Fill out the form below and we will route your inquiry to the right department.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 flex items-start gap-3 text-red-700 dark:text-red-300 text-sm">
                <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                <p>{errorMessage}</p>
              </div>
            )}

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Row 1: Name and Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="name"
                    placeholder="e.g. Rahul Sharma"
                    className="h-11 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 focus-visible:ring-red-500 text-sm"
                    {...form.register("name")}
                  />
                  {form.formState.errors.name && (
                    <p className="text-xs font-medium text-red-500">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="rahul@example.com"
                    className="h-11 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 focus-visible:ring-red-500 text-sm"
                    {...form.register("email")}
                  />
                  {form.formState.errors.email && (
                    <p className="text-xs font-medium text-red-500">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 2: Phone and Inquiry Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Phone Number <span className="text-xs text-slate-400 font-normal lowercase">(optional)</span>
                  </label>
                  <Input
                    id="phone"
                    placeholder="+91 98765 43210"
                    className="h-11 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 focus-visible:ring-red-500 text-sm"
                    {...form.register("phone")}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="category" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Inquiry Type <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger id="category" className="h-11 rounded-xl w-full bg-slate-50/70 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 focus-visible:ring-red-500 text-sm">
                          <SelectValue placeholder="Select inquiry category" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="business_support">Business Listing & Verification Support</SelectItem>
                          <SelectItem value="partnership">Partnerships & Advertising</SelectItem>
                          <SelectItem value="feedback">Product Feedback / Bug Report</SelectItem>
                          <SelectItem value="other">Other Inquiries</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {form.formState.errors.category && (
                    <p className="text-xs font-medium text-red-500">
                      {form.formState.errors.category.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 3: Subject */}
              <div className="space-y-2">
                <label htmlFor="subject" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Subject <span className="text-red-500">*</span>
                </label>
                <Input
                  id="subject"
                  placeholder="How can we help your business?"
                  className="h-11 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 focus-visible:ring-red-500 text-sm"
                  {...form.register("subject")}
                />
                {form.formState.errors.subject && (
                  <p className="text-xs font-medium text-red-500">
                    {form.formState.errors.subject.message}
                  </p>
                )}
              </div>

              {/* Row 4: Message */}
              <div className="space-y-2">
                <label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Message <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="message"
                  rows={5}
                  placeholder="Please provide details about your enquiry so we can assist you better..."
                  className="rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 focus-visible:ring-red-500 resize-none p-4 text-sm"
                  {...form.register("message")}
                />
                {form.formState.errors.message && (
                  <p className="text-xs font-medium text-red-500">
                    {form.formState.errors.message.message}
                  </p>
                )}
              </div>

              {/* Row 5: Consent Checkbox */}
              <div className="flex items-start space-x-3 pt-1">
                <Controller
                  control={form.control}
                  name="consent"
                  render={({ field }) => (
                    <Checkbox
                      id="consent"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="mt-0.5 rounded-md border-slate-300 dark:border-slate-700 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                    />
                  )}
                />
                <div className="space-y-1 leading-none">
                  <label htmlFor="consent" className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                    I agree to the collection and processing of my contact information in accordance with BachatLal&apos;s{" "}
                    <a href="/privacy-policy" target="_blank" className="text-red-600 underline hover:text-red-700">
                      Privacy Policy
                    </a>.
                  </label>
                  {form.formState.errors.consent && (
                    <p className="text-xs font-medium text-red-500 pt-1">
                      {form.formState.errors.consent.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-md transition-transform active:scale-[0.99]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting Message...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
