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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Amenities & Features</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {amenities.map((amenity, idx) => {
          const IconComponent = amenityIconMap[amenity] || CheckCircle2;
          return (
            <div 
              key={idx} 
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-center gap-2 group"
            >
              <IconComponent className="w-6 h-6 text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {amenity}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
