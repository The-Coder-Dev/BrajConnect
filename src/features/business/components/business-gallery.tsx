'use client';

import { mockBusiness } from '../data/mock-business';
import { ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export function BusinessGallery({ business = mockBusiness }: { business?: typeof mockBusiness }) {
  const images = business.images || [];
  if (images.length === 0) return null;

  const featuredImage = images[0];
  const sideImages = images.slice(1, 5);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Photos & Gallery</h2>
        <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950">
          View All {images.length} Photos
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 sm:gap-4 rounded-3xl overflow-hidden h-[300px] sm:h-[400px]">
        
        {/* Featured Image - Takes up left half on desktop */}
        <div className="relative col-span-1 md:col-span-2 row-span-2 group overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer">
          <motion.img 
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
            src={featuredImage} 
            alt="Featured Business Photo" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
        </div>

        {/* Grid of 4 smaller images */}
        {sideImages.map((img, idx) => (
          <div 
            key={idx} 
            className={`relative hidden md:block group overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer
              ${idx === 3 ? 'relative' : ''}
            `}
          >
            <motion.img 
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
              src={img} 
              alt={`Gallery Image ${idx + 2}`} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            
            {/* Overlay on the last visible image */}
            {idx === 3 && images.length > 5 && (
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white backdrop-blur-[2px] transition-all group-hover:bg-black/60">
                <ImageIcon className="w-6 h-6 mb-2" />
                <span className="font-semibold">+{images.length - 5} More</span>
              </div>
            )}
          </div>
        ))}
        
      </div>
    </div>
  );
}
