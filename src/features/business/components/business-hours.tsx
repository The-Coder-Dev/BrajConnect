'use client';

import { mockBusiness } from '../data/mock-business';
import { Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

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
        <Clock className="w-6 h-6 text-slate-700 dark:text-slate-300" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Business Hours</h2>
      </div>

      <Card className="overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {hours.map((schedule, idx) => {
              const isToday = schedule.day === currentDayName;
              return (
                <div 
                  key={idx} 
                  className={`flex items-center justify-between p-4 sm:px-6 transition-colors ${
                    isToday ? 'bg-blue-50/50 dark:bg-blue-900/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`font-medium ${isToday ? 'text-blue-700 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}>
                      {schedule.day}
                    </span>
                    {isToday && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400">
                        Today
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {schedule.isOpen ? (
                      <span className={`font-medium ${isToday ? 'text-blue-700 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'}`}>
                        {schedule.time}
                      </span>
                    ) : (
                      <span className="font-medium text-red-500 dark:text-red-400">
                        Closed
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
