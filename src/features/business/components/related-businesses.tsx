import { MapPin, Star, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function RelatedBusinesses({ business }: { business?: any }) {
  const related = business?.relatedBusinesses || [];
  if (related.length === 0) return null;

  return (
    <div className="w-full border-t border-slate-100 dark:border-slate-800/80 pt-12 mt-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Similar Businesses</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Discover other verified businesses in Braj</p>
        </div>
        <Button variant="ghost" className="hidden sm:flex rounded-lg text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 font-medium cursor-pointer" render={<Link href="/business" />}>
          View All <ArrowRight className="w-4 h-4 ml-1.5" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {related.map((rb: any) => {
          const logo = rb.logoUrl || rb.logo || "https://images.unsplash.com/photo-1595476108010-b4d1f10d5e43?auto=format&fit=crop&q=80&w=150";
          const categoryName = typeof rb.category === 'object' ? rb.category?.name : (rb.category || 'General');
          const isVerified = rb.isVerified ?? rb.verified ?? false;
          const ratingAvg = typeof rb.rating === 'object' ? rb.rating?.average : (rb.rating || 4.8);
          const locationText = typeof rb.location === 'object' ? (rb.location?.city || rb.location?.formattedAddress || 'Mathura') : (rb.location || 'Mathura');

          return (
            <Link
              key={rb.id}
              href={`/business/${rb.slug}`}
              className="group flex items-start gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800/60 bg-white dark:bg-slate-900 hover:border-blue-200 dark:hover:border-slate-700 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all cursor-pointer"
            >
              <div className="w-[84px] h-[84px] rounded-lg overflow-hidden shrink-0 border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
                <img src={logo} alt={rb.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              
              <div className="flex-1 min-w-0 py-0.5">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <h3 className="font-bold text-slate-900 dark:text-white truncate text-[15px]" title={rb.name}>
                    {rb.name}
                  </h3>
                  {isVerified && (
                    <CheckCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-500 shrink-0" />
                  )}
                </div>
                
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 truncate">
                  {categoryName}
                </p>
                
                <div className="flex items-center gap-3 text-[13px] font-medium mt-auto pt-1">
                  <span className="flex items-center text-slate-700 dark:text-slate-300">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
                    {ratingAvg}
                  </span>
                  <span className="flex items-center text-slate-500 dark:text-slate-400 truncate">
                    <MapPin className="w-3.5 h-3.5 mr-1 shrink-0" />
                    <span className="truncate max-w-[100px]">{locationText}</span>
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      
      <Button variant="outline" className="w-full mt-6 sm:hidden rounded-lg h-12 text-sm font-medium border-slate-200 dark:border-slate-800 cursor-pointer" render={<Link href="/business" />}>
        View All Similar Businesses <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
}
