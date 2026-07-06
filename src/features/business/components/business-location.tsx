'use client';

import { mockBusiness } from '../data/mock-business';
import { MapPin, Navigation, Copy, Map as MapIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

export function BusinessLocation({ business = mockBusiness }: { business?: typeof mockBusiness }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(business.location);
    toast.success("Address copied to clipboard");
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <MapIcon className="w-6 h-6 text-slate-700 dark:text-slate-300" />
          Location
        </h2>
      </div>

      <Card className="overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        {/* Map Placeholder */}
        <div className="w-full h-[250px] sm:h-[300px] bg-slate-100 dark:bg-slate-800 relative group flex items-center justify-center overflow-hidden">
          {/* Faux map grid background */}
          <div className="absolute inset-0 opacity-10 dark:opacity-5" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          
          <div className="relative z-10 flex flex-col items-center p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-2 shadow-inner">
              <MapPin className="w-6 h-6" />
            </div>
            <p className="font-semibold text-slate-900 dark:text-white">Google Maps Integration</p>
            <p className="text-xs text-slate-500 mt-1">lat: {business.coordinates.lat}, lng: {business.coordinates.lng}</p>
          </div>
        </div>

        <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex items-start gap-3 flex-1">
            <MapPin className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-slate-900 dark:text-white text-base">
                {business.location}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" className="flex-1 sm:flex-none gap-2 rounded-xl" onClick={handleCopy}>
              <Copy className="w-4 h-4" />
              Copy
            </Button>
            <Button className="flex-1 sm:flex-none gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm">
              <Navigation className="w-4 h-4" />
              Directions
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
