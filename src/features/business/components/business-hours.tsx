'use client';

import { mockBusiness } from '../data/mock-business';
import { Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function BusinessHours({ business = mockBusiness }: { business?: typeof mockBusiness }) {
  const hours = business.hours || [];
  if (hours.length === 0) return null;

  // In a real app, this would be computed dynamically based on the current date
  const currentDayIndex = new Date().getDay(); // 0 is Sunday, 1 is Monday...
  const daysMap = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currentDayName = daysMap[currentDayIndex];

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Business Hours</h2>
      </div>

      <div className="overflow-hidden border border-slate-100 dark:border-slate-800/60 rounded-xl bg-white dark:bg-slate-900 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {hours.map((schedule, idx) => {
            const isToday = schedule.day === currentDayName;
            return (
              <div 
                key={idx} 
                className={`flex items-center justify-between p-4 sm:px-6 transition-colors ${
                  isToday ? 'bg-blue-50/40 dark:bg-blue-500/5' : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`font-medium ${isToday ? 'text-blue-700 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}>
                    {schedule.day}
                  </span>
                  {isToday && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 border-0 h-5 px-1.5 text-[10px] uppercase font-bold tracking-wider rounded-md">
                      Today
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-4">
                  {schedule.isOpen ? (
                    <div className="flex items-center gap-3">
                      {isToday && business.openNow && (
                        <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Open Now
                        </span>
                      )}
                      <span className={`font-medium text-sm ${isToday ? 'text-blue-700 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'}`}>
                        {schedule.time}
                      </span>
                    </div>
                  ) : (
                    <span className="font-medium text-sm text-slate-400 dark:text-slate-500">
                      Closed
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
