'use client';

import { mockBusiness } from '../data/mock-business';
import { MapPin, Navigation, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function BusinessLocation({ business = mockBusiness }: { business?: typeof mockBusiness }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(business.location);
    toast.success("Address copied to clipboard");
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Location</h2>
      </div>

      <div className="overflow-hidden border border-slate-100 dark:border-slate-800/60 rounded-xl bg-white dark:bg-slate-900 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col">
        {/* Map Placeholder */}
        <div className="w-full h-[240px] sm:h-[280px] bg-slate-100 dark:bg-slate-800 relative group flex items-center justify-center overflow-hidden">
          {/* Faux map grid background */}
          <div className="absolute inset-0 opacity-10 dark:opacity-5" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          
          <div className="relative z-10 flex flex-col items-center p-5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-white/20 dark:border-slate-700/50">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3 shadow-sm">
              <MapPin className="w-5 h-5" />
            </div>
            <p className="font-semibold text-slate-900 dark:text-white text-sm">Interactive Map</p>
            <p className="text-[11px] text-slate-500 mt-0.5">lat: {business.coordinates.lat}, lng: {business.coordinates.lng}</p>
          </div>
        </div>

        <div className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white dark:bg-slate-900">
          <div className="flex items-start gap-3 flex-1">
            <div className="mt-0.5 p-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-400 shrink-0 border border-slate-100 dark:border-slate-700/50">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p className="font-medium text-slate-900 dark:text-white text-sm sm:text-base leading-tight mt-1 sm:mt-1.5">
                {business.location}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100 dark:border-slate-800/60">
            <Button variant="outline" className="flex-1 sm:flex-none gap-2 rounded-lg h-9 border-slate-200 dark:border-slate-800 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600" onClick={handleCopy}>
              <Copy className="w-3.5 h-3.5" />
              Copy
            </Button>
            <Button className="flex-1 sm:flex-none gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-[0_2px_10px_rgba(37,99,235,0.2)] h-9 transition-all">
              <Navigation className="w-3.5 h-3.5" />
              Directions
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
