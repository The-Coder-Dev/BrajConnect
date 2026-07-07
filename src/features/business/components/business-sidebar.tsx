import { mockBusiness } from '../data/mock-business';
import { Phone, MessageCircle, Mail, Globe, MapPin, Clock, Share2, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function BusinessSidebar({ business = mockBusiness }: { business?: typeof mockBusiness }) {
  const { contact } = business;

  return (
    <div className="space-y-6">
      
      {/* Quick Contact Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="p-5 sm:p-6">
          <div className="mb-5 pb-5 border-b border-slate-100 dark:border-slate-800/60">
            <h3 className="text-[17px] font-bold text-slate-900 dark:text-white mb-4">Contact Business</h3>
            <div className="space-y-2.5">
              <Button className="w-full justify-center text-[15px] font-semibold h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-[0_2px_10px_rgba(37,99,235,0.2)] transition-all">
                <Phone className="w-4 h-4 mr-2" />
                {contact.phone}
              </Button>
              <Button className="w-full justify-center text-[15px] font-semibold h-11 bg-[#25D366] hover:bg-[#1ebd5a] text-white rounded-xl shadow-[0_2px_10px_rgba(37,211,102,0.2)] transition-all">
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp Us
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-2.5 mt-2.5">
              <Button variant="outline" className="h-10 text-[14px] rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <Mail className="w-3.5 h-3.5 mr-2 text-slate-500" />
                Email
              </Button>
              <Button variant="outline" className="h-10 text-[14px] rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
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
                  {business.openNow ? (
                    <span className="text-[14px] text-emerald-600 dark:text-emerald-400 font-bold">Open Now</span>
                  ) : (
                    <span className="text-[14px] text-red-500 dark:text-red-400 font-bold">Closed</span>
                  )}
                </div>
                <p className="text-[13px] text-slate-500 dark:text-slate-400">Closes today at 8:00 PM</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[14px] text-slate-900 dark:text-white block mb-0.5">Location:</span>
                <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed">{business.location}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2.5 mt-5 pt-5 border-t border-slate-100 dark:border-slate-800/60">
            <Button variant="ghost" className="flex-1 h-10 rounded-xl text-[14px] text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
              <Share2 className="w-3.5 h-3.5 mr-2" />
              Share
            </Button>
            <Button variant="ghost" className="flex-1 h-10 rounded-xl text-[14px] text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
              <Bookmark className="w-3.5 h-3.5 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </div>

    </div>
  );
}
