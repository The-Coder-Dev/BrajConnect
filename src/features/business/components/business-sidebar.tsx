import { mockBusiness } from '../data/mock-business';
import { Phone, MessageCircle, Mail, Globe, MapPin, Clock, Share2, Bookmark, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function BusinessSidebar({ business = mockBusiness }: { business?: typeof mockBusiness }) {
  const { contact } = business;

  return (
    <div className="space-y-6">
      
      {/* Quick Contact Card */}
      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
        <CardContent className="p-6">
          <div className="mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Contact Business</h3>
            <div className="space-y-3">
              <Button className="w-full justify-center text-base h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm">
                <Phone className="w-5 h-5 mr-2" />
                {contact.phone}
              </Button>
              <Button className="w-full justify-center text-base h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm">
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp Us
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-3">
              <Button variant="outline" className="h-11 rounded-xl dark:border-slate-800">
                <Mail className="w-4 h-4 mr-2 text-slate-500" />
                Email
              </Button>
              <Button variant="outline" className="h-11 rounded-xl dark:border-slate-800">
                <Globe className="w-4 h-4 mr-2 text-slate-500" />
                Website
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-slate-900 dark:text-white">Status:</span>
                  {business.openNow ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">Open Now</span>
                  ) : (
                    <span className="text-red-500 dark:text-red-400 font-bold">Closed</span>
                  )}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Closes today at 8:00 PM</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-900 dark:text-white block mb-1">Location:</span>
                <p className="text-sm text-slate-500 dark:text-slate-400">{business.location}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" className="flex-1 rounded-xl text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="ghost" className="flex-1 rounded-xl text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950">
              <Bookmark className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mini CTA */}
      <Card className="bg-gradient-to-br from-blue-600 to-blue-800 text-white border-0 overflow-hidden relative group cursor-pointer shadow-lg shadow-blue-900/20">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <CardContent className="p-6 relative z-10 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-lg mb-1">Own a Business?</h4>
            <p className="text-blue-100 text-sm">Register on BrajConnect</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 group-hover:scale-110 transition-all">
            <ArrowRight className="w-5 h-5" />
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
