'use client';

import { mockBusiness } from '../data/mock-business';
import { 
  CheckCircle, 
  MapPin, 
  Star, 
  Eye, 
  Share2, 
  Bookmark, 
  AlertOctagon,
  CalendarDays
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function BusinessHero({ business = mockBusiness }: { business?: typeof mockBusiness }) {
  return (
    <div className="relative w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-6 sm:p-8">
      
      {/* Top right circular buttons */}
      <div className="absolute top-6 right-6 flex items-center gap-2">
        <Button variant="outline" size="icon" className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 hover:text-blue-600 transition-colors">
          <Share2 className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="icon" className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 hover:text-blue-600 transition-colors">
          <Bookmark className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="icon" className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 hover:text-red-600 transition-colors hidden sm:flex">
          <AlertOctagon className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex flex-col gap-5">
        
        {/* Logo (Overlapping the page cover image) */}
        <div className="relative -mt-16 sm:-mt-20 z-10">
          <div className="w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] p-1.5 bg-white dark:bg-slate-950 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
            <div className="w-full h-full rounded-full overflow-hidden bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <img 
                src={business.logo} 
                alt={`${business.name} Logo`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary" className="bg-blue-50/80 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 rounded-md px-2.5 py-0.5 font-medium border-0 hover:bg-blue-100">
              {business.category}
            </Badge>
            <Badge variant="secondary" className="bg-emerald-50/80 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 rounded-md px-2.5 py-0.5 font-medium border-0">
              Premium
            </Badge>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              {business.name}
            </h1>
            {business.verified && (
              <div className="flex items-center text-[11px] uppercase tracking-wider font-bold bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 px-2.5 py-1 rounded-full border border-blue-100 dark:border-blue-800/30">
                <CheckCircle className="w-3.5 h-3.5 mr-1" />
                Verified
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-y-3 gap-x-5 text-[15px] text-slate-600 dark:text-slate-400 font-medium">
            <div className="flex items-center gap-1.5 text-slate-900 dark:text-white">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{business.rating}</span>
              <span className="text-slate-500 font-normal">({business.reviewCount} Reviews)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-400" />
              {business.location}
            </div>
            <div className="flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4 text-slate-400" />
              Est. {business.established}
            </div>
            <div className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-slate-400" />
              {business.viewCount} Views
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
