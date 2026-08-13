import { Metadata } from "next";
import { ContactForm } from "@/components/marketing/contact-form";
import { siteConfig } from "@/config/site";
import {
  Mail,
  MessageSquare,
  Building2,
  Clock,
  MapPin,
  Sparkles,
  HelpCircle,
  Briefcase,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Contact BachatLal | Get in Touch",
  description:
    "Have questions about listing your business, verification status, partnerships, or support? Contact the BachatLal team today.",
  openGraph: {
    title: "Contact BachatLal | Get in Touch",
    description:
      "Get in touch with BachatLal for support, business listing questions, and partnerships.",
    url: `${siteConfig.url}/contact`,
  },
};

const contactCards = [
  {
    title: "General Inquiries",
    description: "Questions about using BachatLal, searching businesses, or general platform questions.",
    email: siteConfig.contact.generalEmail,
    icon: Mail,
    color: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border-blue-500/20",
  },
  {
    title: "Business Support & Listings",
    description: "Assistance with business onboarding, verification documents, and profile edits.",
    email: siteConfig.contact.businessEmail,
    icon: Building2,
    color: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-500/20",
  },
  {
    title: "Partnerships & Press",
    description: "Inquiries regarding strategic collaborations, advertising, or media coverage.",
    email: siteConfig.contact.partnershipsEmail,
    icon: Briefcase,
    color: "bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 border-purple-500/20",
  },
];

export default async function ContactPage({
  searchParams,
}: {
  searchParams?: Promise<{ subject?: string; category?: string }>;
}) {
  const params = await searchParams;
  const defaultSubject = params?.subject || "";
  const defaultCategory = params?.category || "general";

  return (
    <div className="py-16 md:py-24 space-y-20">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        
        {/* 1. Header Section */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-red-500/10 text-red-600 border border-red-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Contact BachatLal</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Let&apos;s Talk.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Whether you are a business owner looking to get verified, a visitor seeking assistance, or interested in partnering with us, our team is here to help.
          </p>
        </div>

        {/* 2. Grid: Form (7 cols) + Info Sidebar (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* Left / Main: Contact Form */}
          <div className="lg:col-span-7">
            <ContactForm
              defaultSubject={defaultSubject}
              defaultCategory={defaultCategory}
            />
          </div>

          {/* Right: Contact Information & Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Department Cards */}
            <div className="space-y-4">
              {contactCards.map((card, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex items-start gap-4"
                >
                  <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${card.color}`}>
                    <card.icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {card.description}
                    </p>
                    <a
                      href={`mailto:${card.email}`}
                      className="inline-block text-xs font-semibold text-red-600 dark:text-red-400 hover:underline pt-1"
                    >
                      {card.email}
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Operating Hours & Regional Coverage */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 text-white border border-slate-800 shadow-xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-red-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Regional Operations</h4>
                  <p className="text-xs text-slate-400">{siteConfig.contact.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Support Hours</h4>
                  <p className="text-xs text-slate-400">{siteConfig.contact.workingHours}</p>
                </div>
              </div>

              <div className="pt-2 text-xs text-slate-400 leading-relaxed bg-white/5 p-3.5 rounded-xl border border-white/5">
                <span className="font-semibold text-slate-200">Response Notice: </span>
                {siteConfig.contact.responseTime}. For urgent business verification queries, please include your Business ID.
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
