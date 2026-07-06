'use client';

import { mockBusiness } from '../data/mock-business';
import { Scissors, Sparkles, Heart, Droplets, Smile, Activity, Sparkle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
        {services.map((service) => {
          const IconComponent = iconMap[service.icon] || Sparkle;
          
          return (
            <Card key={service.id} className="group overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-700 transition-colors shadow-sm">
              <CardContent className="p-4 sm:p-5 flex items-center gap-4">
                
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="w-6 h-6" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 dark:text-white text-base truncate">
                    {service.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Starting from
                  </p>
                </div>
                
                <div className="text-right shrink-0">
                  <p className="font-bold text-lg text-blue-600 dark:text-blue-400">
                    {service.price}
                  </p>
                  <Button variant="link" className="p-0 h-auto text-xs text-slate-500 hover:text-blue-600 dark:hover:text-blue-400">
                    Book Now
                  </Button>
                </div>

              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
