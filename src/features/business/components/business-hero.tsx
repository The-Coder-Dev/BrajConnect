'use client';

import { mockBusiness } from '../data/mock-business';
import { 
  CheckCircle, 
  MapPin, 
  Star, 
  Eye, 
  Share2, 
  Bookmark, 
  Phone, 
  MessageCircle, 
  Globe, 
  Navigation,
  AlertOctagon,
  ShieldCheck,
  CalendarDays
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

export function BusinessHero({ business = mockBusiness }: { business?: typeof mockBusiness }) {
  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
      {/* Cover Image */}
      <div className="relative h-64 sm:h-80 lg:h-[400px] w-full group overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={business.coverImage} 
          alt={`${business.name} Cover`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Action Buttons Top Right */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button variant="secondary" size="icon" className="rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md border-0 text-white">
            <Share2 className="w-4 h-4" />
          </Button>
          <Button variant="secondary" size="icon" className="rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md border-0 text-white">
            <Bookmark className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="relative px-4 sm:px-8 pb-8">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          
          {/* Logo (Overlapping) */}
          <div className="relative -mt-16 md:-mt-20 shrink-0 z-10 flex flex-col items-center">
            <div className="p-1.5 bg-white dark:bg-slate-900 rounded-2xl shadow-lg">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-xl overflow-hidden relative">
                <img 
                  src={business.logo} 
                  alt={`${business.name} Logo`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            {business.verified && (
              <Badge className="absolute -bottom-3 bg-blue-600 hover:bg-blue-700 text-white shadow-md border-2 border-white dark:border-slate-900 px-3 py-1">
                <CheckCircle className="w-3.5 h-3.5 mr-1" />
                Verified
              </Badge>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 pt-2 md:pt-4">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
              
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    {business.category}
                  </Badge>
                  {business.openNow ? (
                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      Open Now
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">
                      Closed
                    </Badge>
                  )}
                </div>
                
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">
                  {business.name}
                </h1>

                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-slate-900 dark:text-white">{business.rating}</span>
                    <span>({business.reviewCount} Reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {business.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <CalendarDays className="w-4 h-4" />
                    Est. {business.established}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {business.viewCount} Views
                  </div>
                </div>
              </div>

              {/* Primary Actions */}
              <div className="flex flex-wrap gap-3 mt-4 lg:mt-0">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition-transform hover:scale-105 active:scale-95">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </Button>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm transition-transform hover:scale-105 active:scale-95">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
              </div>

            </div>

            {/* Secondary Actions Grid */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 lg:flex gap-3">
              <Button variant="outline" className="rounded-xl flex-1 justify-center dark:border-slate-800">
                <Navigation className="w-4 h-4 mr-2 text-blue-600" />
                Directions
              </Button>
              <Button variant="outline" className="rounded-xl flex-1 justify-center dark:border-slate-800">
                <Globe className="w-4 h-4 mr-2 text-slate-600" />
                Website
              </Button>
              <Button variant="outline" className="rounded-xl flex-1 justify-center dark:border-slate-800 text-slate-500 hover:text-slate-700">
                <ShieldCheck className="w-4 h-4 mr-2" />
                Claim
              </Button>
              <Button variant="outline" className="rounded-xl flex-1 justify-center dark:border-slate-800 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 border-red-100 dark:border-red-900/30">
                <AlertOctagon className="w-4 h-4 mr-2" />
                Report
              </Button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
