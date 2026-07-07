'use client';

import { mockBusiness } from '../data/mock-business';
import { Wifi, Car, Wind, CreditCard, Armchair, Coffee, Accessibility, DoorOpen, CheckCircle2 } from 'lucide-react';

const amenityIconMap: Record<string, React.ElementType> = {
  "Free Wi-Fi": Wifi,
  "Valet Parking": Car,
  "Air Conditioning": Wind,
  "Card/UPI Payment": CreditCard,
  "Waiting Lounge": Armchair,
  "Complimentary Beverages": Coffee,
  "Wheelchair Accessible": Accessibility,
  "Private Rooms": DoorOpen
};

export function BusinessAmenities({ business = mockBusiness }: { business?: typeof mockBusiness }) {
  const amenities = business.amenities || [];
  if (amenities.length === 0) return null;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Amenities & Features</h2>
      </div>

      <div className="flex flex-wrap gap-3">
        {amenities.map((amenity, idx) => {
          const IconComponent = amenityIconMap[amenity] || CheckCircle2;
          return (
            <div 
              key={idx} 
              className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-blue-300 dark:hover:border-blue-700/60 hover:shadow-md transition-all group cursor-default"
            >
              <div className="p-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                <IconComponent className="w-3.5 h-3.5" />
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 pr-1">
                {amenity}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
