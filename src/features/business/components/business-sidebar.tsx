"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Phone, MessageCircle, Mail, Globe, MapPin, Clock, Share2, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trackBusinessMetric } from '@/server/actions/analytics';
import { toast } from 'sonner';

export function BusinessSidebar({ business }: { business?: any }) {
  if (!business) return null;

  const contact = business.contact || {};
  const phone = contact.primaryPhone || contact.phone || "+91 98765 43210";
  const whatsapp = contact.whatsapp || phone;
  const email = contact.email || "contact@bachatlal.com";
  const website = contact.website;

  const locationText = typeof business.location === 'object'
    ? (business.location?.formattedAddress || `${business.location?.city || 'Mathura'}, ${business.location?.state || 'UP'}`)
    : (business.location || 'Mathura, UP');
  const isOpen = business.openNow ?? true;

  const handlePhoneClick = () => {
    trackBusinessMetric(business.id, 'phone_click');
    window.location.href = `tel:${phone}`;
  };

  const handleWhatsAppClick = () => {
    trackBusinessMetric(business.id, 'whatsapp_click');
    const cleanPhone = whatsapp.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}`, '_blank');
  };

  const handleEmailClick = () => {
    trackBusinessMetric(business.id, 'email_click');
    window.location.href = `mailto:${email}`;
  };

  const handleWebsiteClick = () => {
    if (!website) return;
    trackBusinessMetric(business.id, 'website_click');
    window.open(website.startsWith('http') ? website : `https://${website}`, '_blank');
  };

  const handleShareClick = async () => {
    trackBusinessMetric(business.id, 'share');
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: business.name,
          text: `Check out ${business.name} on BachatLal!`,
          url: shareUrl,
        });
        toast.success("Shared successfully!");
      } catch {
        // User cancelled or share failed
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard!");
      } catch {
        toast.error("Failed to copy link.");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Contact Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="p-5 sm:p-6">
          <div className="mb-5 pb-5 border-b border-slate-100 dark:border-slate-800/60">
            <h3 className="text-[17px] font-bold text-slate-900 dark:text-white mb-4">Contact Business</h3>
            <div className="space-y-2.5">
              <Button
                onClick={handlePhoneClick}
                className="w-full justify-center text-[15px] font-semibold h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-[0_2px_10px_rgba(37,99,235,0.2)] transition-all cursor-pointer"
              >
                <Phone className="w-4 h-4 mr-2" />
                {phone}
              </Button>
              <Button
                onClick={handleWhatsAppClick}
                className="w-full justify-center text-[15px] font-semibold h-11 bg-[#25D366] hover:bg-[#1ebd5a] text-white rounded-xl shadow-[0_2px_10px_rgba(37,211,102,0.2)] transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp Us
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-2.5 mt-2.5">
              <Button
                onClick={handleEmailClick}
                variant="outline"
                className="h-10 text-[14px] rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5 mr-2 text-slate-500" />
                Email
              </Button>
              <Button
                onClick={handleWebsiteClick}
                disabled={!website}
                variant="outline"
                className="h-10 text-[14px] rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 mr-2 text-slate-500" />
                Website
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="font-semibold text-[14px] text-slate-900 dark:text-white">Status:</span>
                  {isOpen ? (
                    <span className="text-[14px] text-emerald-600 dark:text-emerald-400 font-bold">Open Now</span>
                  ) : (
                    <span className="text-[14px] text-red-500 dark:text-red-400 font-bold">Closed</span>
                  )}
                </div>
                <p className="text-[13px] text-slate-500 dark:text-slate-400">Operating regular hours</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[14px] text-slate-900 dark:text-white block mb-0.5">Location:</span>
                <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed">{locationText}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2.5 mt-5 pt-5 border-t border-slate-100 dark:border-slate-800/60">
            <Button
              onClick={handleShareClick}
              variant="ghost"
              className="flex-1 h-10 rounded-xl text-[14px] text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 mr-2" />
              Share
            </Button>
            <Button
              onClick={() => toast.success("Saved to favorites!")}
              variant="ghost"
              className="flex-1 h-10 rounded-xl text-[14px] text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
