'use client';

import { mockBusiness } from '../data/mock-business';
import { Scissors, Sparkles, Heart, Droplets, Smile, Activity, Sparkle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const iconMap: Record<string, React.ElementType> = {
  Scissors: Scissors,
  Sparkles: Sparkles,
  Heart: Heart,
  Droplets: Droplets,
  Smile: Smile,
  Activity: Activity
};

export function BusinessServices({ business = mockBusiness }: { business?: typeof mockBusiness }) {
  const services = business.services || [];
  if (services.length === 0) return null;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Services & Pricing</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service, index) => {
          const IconComponent = iconMap[service.icon] || Sparkle;
          // Mock data for missing fields if needed
          const description = "Premium quality service tailored for your needs with best-in-class experts.";
          const duration = service.duration || "45 min";
          const badge = index === 0 ? "Popular" : index === 2 ? "New" : null;
          
          return (
            <div 
              key={service.id} 
              className="group relative flex flex-col p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:border-blue-200 dark:hover:border-blue-900/50 transition-all duration-300"
            >
              {badge && (
                <div className="absolute top-4 right-4">
                  <Badge className={`bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 border-0 ${badge === 'New' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 hover:bg-emerald-100' : ''}`}>
                    {badge}
                  </Badge>
                </div>
              )}
              
              <div className="flex items-start gap-4 mb-4 pr-16">
                <div className="w-12 h-12 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 flex items-center justify-center text-slate-600 dark:text-slate-400 shrink-0 group-hover:scale-105 group-hover:bg-blue-50 group-hover:text-blue-600 dark:group-hover:bg-blue-500/10 dark:group-hover:text-blue-400 transition-all duration-300">
                  <IconComponent className="w-6 h-6" />
                </div>
                
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-lg">
                    {service.name}
                  </h3>
                  <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mt-1">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    {duration}
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 line-clamp-2 leading-relaxed">
                {description}
              </p>
              
              <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/60">
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-0.5">Starting from</p>
                  <p className="font-bold text-xl text-slate-900 dark:text-white">
                    {service.price}
                  </p>
                </div>
                <Button className="rounded-lg bg-slate-900 text-white hover:bg-blue-600 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-blue-500 transition-colors">
                  Book Now
                </Button>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
