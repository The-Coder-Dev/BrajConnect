'use client';

import { useState } from 'react';
import { mockBusiness } from '../data/mock-business';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ShieldCheck, Zap, Lock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

const formSchema = z.object({
  fullName: z.string().min(2, 'Name is too short'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Valid phone number required'),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message is too short'),
  preferredContact: z.string(),
  consent: z.boolean().refine(val => val === true, {
    message: 'You must agree to be contacted'
  })
});

export function BusinessContactForm({ business = mockBusiness }: { business?: typeof mockBusiness }) {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      preferredContact: 'phone',
      consent: false,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("Mock Submit:", values);
    setIsSubmitted(true);
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Send an Enquiry</h2>
      </div>

      <Card className="overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl shadow-blue-900/5">
        <CardContent className="p-0">
          
          {isSubmitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center p-12 text-center"
            >
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Message Sent Successfully!</h3>
              <p className="text-slate-600 dark:text-slate-400 max-w-sm mb-8">
                Thank you for reaching out to {business.name}. They will get back to you shortly via your preferred contact method.
              </p>
              <Button onClick={() => setIsSubmitted(false)} variant="outline" className="rounded-xl">
                Send Another Message
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3">
              
              {/* Form Side */}
              <div className="lg:col-span-2 p-6 sm:p-8">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none text-slate-700 dark:text-slate-300">Full Name</label>
                      <Input placeholder="John Doe" className="rounded-xl border-slate-200 dark:border-slate-700" {...form.register('fullName')} />
                      {form.formState.errors.fullName && <p className="text-[0.8rem] font-medium text-destructive">{form.formState.errors.fullName.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none text-slate-700 dark:text-slate-300">Email Address</label>
                      <Input placeholder="john@example.com" type="email" className="rounded-xl border-slate-200 dark:border-slate-700" {...form.register('email')} />
                      {form.formState.errors.email && <p className="text-[0.8rem] font-medium text-destructive">{form.formState.errors.email.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none text-slate-700 dark:text-slate-300">Phone Number</label>
                      <Input placeholder="+91 98765 43210" className="rounded-xl border-slate-200 dark:border-slate-700" {...form.register('phone')} />
                      {form.formState.errors.phone && <p className="text-[0.8rem] font-medium text-destructive">{form.formState.errors.phone.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none text-slate-700 dark:text-slate-300">Preferred Contact</label>
                      <Controller
                        control={form.control}
                        name="preferredContact"
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="rounded-xl border-slate-200 dark:border-slate-700">
                              <SelectValue placeholder="Select method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="phone">Phone Call</SelectItem>
                              <SelectItem value="whatsapp">WhatsApp</SelectItem>
                              <SelectItem value="email">Email</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {form.formState.errors.preferredContact && <p className="text-[0.8rem] font-medium text-destructive">{form.formState.errors.preferredContact.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none text-slate-700 dark:text-slate-300">Subject</label>
                    <Input placeholder="How can they help you?" className="rounded-xl border-slate-200 dark:border-slate-700" {...form.register('subject')} />
                    {form.formState.errors.subject && <p className="text-[0.8rem] font-medium text-destructive">{form.formState.errors.subject.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none text-slate-700 dark:text-slate-300">Message</label>
                    <Textarea 
                      placeholder="Write your message here..." 
                      className="min-h-[120px] rounded-xl border-slate-200 dark:border-slate-700 resize-none" 
                      {...form.register('message')} 
                    />
                    {form.formState.errors.message && <p className="text-[0.8rem] font-medium text-destructive">{form.formState.errors.message.message}</p>}
                  </div>

                  <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md py-4">
                    <Controller
                      control={form.control}
                      name="consent"
                      render={({ field }) => (
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="rounded border-slate-300 data-[state=checked]:bg-blue-600"
                        />
                      )}
                    />
                    <div className="space-y-1 leading-none">
                      <label className="text-sm font-normal text-slate-600 dark:text-slate-400">
                        I agree to be contacted by this business regarding my enquiry.
                      </label>
                      {form.formState.errors.consent && <p className="text-[0.8rem] font-medium text-destructive">{form.formState.errors.consent.message}</p>}
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-14 text-lg rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-transform active:scale-95">
                    Send Message
                  </Button>

                </form>
              </div>

              {/* Sidebar Info Side */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 sm:p-8 flex flex-col justify-center gap-8 border-l border-slate-100 dark:border-slate-800/80">
                
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full text-emerald-600 dark:text-emerald-400 shrink-0">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">Fast Response</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">This business usually responds within 2-4 hours to most enquiries.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">Secure Enquiry</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Your information is sent directly to the business securely.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-400 shrink-0">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">Privacy Notice</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">We do not share your contact details with any third parties.</p>
                  </div>
                </div>

              </div>

            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
