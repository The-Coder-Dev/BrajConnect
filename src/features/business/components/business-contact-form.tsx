"use client";

import { useState } from "react";
import { mockBusiness } from "../data/mock-business";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ShieldCheck, Zap, Lock, CheckCircle } from "lucide-react";
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
import { motion, AnimatePresence } from "framer-motion";

const formSchema = z.object({
  fullName: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number required"),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message is too short"),
  preferredContact: z.string(),
  consent: z.boolean().refine((val) => val === true, {
    message: "You must agree to be contacted",
  }),
});

export function BusinessContactForm({
  business = mockBusiness,
}: {
  business?: typeof mockBusiness;
}) {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      preferredContact: "phone",
      consent: false,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("Mock Submit:", values);
    setIsSubmitted(true);
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-5">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Send an Enquiry
        </h2>
      </div>

      <div className="overflow-hidden border border-slate-100 dark:border-slate-800/60 bg-white dark:bg-slate-900 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <AnimatePresence mode="wait">
          {isSubmitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="flex flex-col items-center justify-center p-12 py-20 text-center"
            >
              <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-6 ring-8 ring-emerald-50/50 dark:ring-emerald-900/10">
                <CheckCircle className="w-10 h-10 text-emerald-500 dark:text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                Message Sent Successfully
              </h3>
              <p className="text-slate-600 dark:text-slate-400 max-w-md mb-8 leading-relaxed">
                Thank you for reaching out to{" "}
                <span className="font-semibold text-slate-900 dark:text-white">
                  {business.name}
                </span>
                . They will get back to you shortly via your preferred contact
                method.
              </p>
              <Button
                onClick={() => setIsSubmitted(false)}
                variant="outline"
                className="rounded-lg h-11 px-8 border-slate-200 dark:border-slate-800"
              >
                Send Another Message
              </Button>
            </motion.div>
          ) : (
            <motion.div key="form" className="">
              {/* Form Side */}
              <div className=" w-full lg:col-span-2 p-6 sm:p-8 md:p-10">
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="  grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2.5">
                      <label className="text-sm font-medium leading-none text-slate-700 dark:text-slate-300">
                        Full Name
                      </label>
                      <Input
                        placeholder="John Doe"
                        className="rounded-lg h-11 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 focus-visible:ring-blue-500"
                        {...form.register("fullName")}
                      />
                      {form.formState.errors.fullName && (
                        <p className="text-xs font-medium text-red-500">
                          {form.formState.errors.fullName.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-sm font-medium leading-none text-slate-700 dark:text-slate-300">
                        Email Address
                      </label>
                      <Input
                        placeholder="john@example.com"
                        type="email"
                        className="rounded-lg h-11 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 focus-visible:ring-blue-500"
                        {...form.register("email")}
                      />
                      {form.formState.errors.email && (
                        <p className="text-xs font-medium text-red-500">
                          {form.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2.5">
                      <label className="text-sm h-11 font-medium leading-none text-slate-700 dark:text-slate-300">
                        Phone Number
                      </label>
                      <Input
                        placeholder="+91 98765 43210"
                        className="rounded-lg h-11 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 focus-visible:ring-blue-500"
                        {...form.register("phone")}
                      />
                      {form.formState.errors.phone && (
                        <p className="text-xs font-medium text-red-500">
                          {form.formState.errors.phone.message}
                        </p>
                      )}
                    </div>
                    <div className="w-full space-y-2.5">
                      <label className="text-sm font-medium leading-none text-slate-700 dark:text-slate-300">
                        Preferred Contact
                      </label>
                      <Controller
                        control={form.control}
                        name="preferredContact"
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="rounded-lg h-11 w-full border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 focus-visible:ring-blue-500">
                              <SelectValue placeholder="Select method" />
                            </SelectTrigger>
                            <SelectContent className="rounded-lg">
                              <SelectItem value="phone">Phone Call</SelectItem>
                              <SelectItem value="whatsapp">WhatsApp</SelectItem>
                              <SelectItem value="email">Email</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {form.formState.errors.preferredContact && (
                        <p className="text-xs font-medium text-red-500">
                          {form.formState.errors.preferredContact.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <label className="text-sm font-medium leading-none text-slate-700 dark:text-slate-300">
                      Subject
                    </label>
                    <Input
                      placeholder="How can they help you?"
                      className="rounded-lg h-11 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 focus-visible:ring-blue-500"
                      {...form.register("subject")}
                    />
                    {form.formState.errors.subject && (
                      <p className="text-xs font-medium text-red-500">
                        {form.formState.errors.subject.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2.5">
                    <label className="text-sm font-medium leading-none text-slate-700 dark:text-slate-300">
                      Message
                    </label>
                    <Textarea
                      placeholder="Write your message here..."
                      className="min-h-[140px] rounded-lg border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 focus-visible:ring-blue-500 resize-none p-4"
                      {...form.register("message")}
                    />
                    {form.formState.errors.message && (
                      <p className="text-xs font-medium text-red-500">
                        {form.formState.errors.message.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-row items-start space-x-3 pt-2">
                    <Controller
                      control={form.control}
                      name="consent"
                      render={({ field }) => (
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="mt-0.5 rounded border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                        />
                      )}
                    />
                    <div className="space-y-1.5 leading-none">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                        I agree to be contacted by this business regarding my
                        enquiry.
                      </label>
                      <p className="text-xs text-slate-500 dark:text-slate-500">
                        Your information will not be shared with third parties.
                      </p>
                      {form.formState.errors.consent && (
                        <p className="text-xs font-medium text-red-500 pt-1">
                          {form.formState.errors.consent.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 text-[15px] font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-[0_2px_10px_rgba(37,99,235,0.2)] transition-transform active:scale-[0.98]"
                  >
                    Send Message
                  </Button>
                </form>
              </div>

              {/* Sidebar Info Side */}
              {/* <div className="bg-slate-50/80 dark:bg-slate-800/20 p-6 sm:p-8 md:p-10 flex flex-col justify-center gap-10 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800/60">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400 shrink-0">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-1.5">
                      Fast Response
                    </h4>
                    <p className="text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      This business usually responds within 2-4 hours to most
                      enquiries.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400 shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-1.5">
                      Secure Enquiry
                    </h4>
                    <p className="text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      Your information is sent directly to the business
                      securely.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-500/10 rounded-xl text-purple-600 dark:text-purple-400 shrink-0">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-1.5">
                      Privacy Notice
                    </h4>
                    <p className="text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      We do not share your contact details with any third
                      parties.
                    </p>
                  </div>
                </div>
              </div> */}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
