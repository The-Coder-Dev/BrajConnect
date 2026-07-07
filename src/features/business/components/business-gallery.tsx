'use client';

import { useState } from 'react';
import { mockBusiness } from '../data/mock-business';
import { ImageIcon, ChevronLeft, ChevronRight, Maximize, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export function BusinessGallery({ business = mockBusiness }: { business?: typeof mockBusiness }) {
  const images = business.images || [];
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (images.length === 0) return null;

  const featuredImage = images[0];
  const sideImages = images.slice(1, 5);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Photos & Gallery</h2>
        <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors font-medium">
          View All {images.length} Photos
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 h-[300px] sm:h-[400px]">
        
        {/* Featured Image - Takes up left half on desktop */}
        <div 
          className="relative col-span-1 md:col-span-2 row-span-2 group overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 cursor-pointer"
          onClick={() => openLightbox(0)}
        >
          <motion.img 
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
            src={featuredImage} 
            alt="Featured Business Photo" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>

        {/* Grid of 4 smaller images */}
        {sideImages.map((img, idx) => (
          <div 
            key={idx} 
            onClick={() => openLightbox(idx + 1)}
            className={`relative hidden md:block group overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 cursor-pointer`}
          >
            <motion.img 
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
              src={img} 
              alt={`Gallery Image ${idx + 2}`} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            
            {/* Overlay on the last visible image */}
            {idx === 3 && images.length > 5 && (
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white backdrop-blur-[2px] transition-all group-hover:bg-black/60">
                <ImageIcon className="w-6 h-6 mb-2" />
                <span className="font-semibold text-[15px]">+{images.length - 5} More</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-[85vw] lg:max-w-[1200px] h-[90vh] p-0 bg-black/95 border-none shadow-2xl flex flex-col overflow-hidden rounded-2xl">
          <DialogTitle className="sr-only">Image Lightbox</DialogTitle>
          <DialogDescription className="sr-only">View images of {business.name}</DialogDescription>
          
          {/* Top Bar */}
          <div className="absolute top-0 inset-x-0 z-50 flex items-center justify-between p-4 bg-linear-to-b from-black/60 to-transparent">
            <div className="text-white/80 font-medium text-[15px] px-2">
              {currentIndex + 1} / {images.length}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg">
                <ZoomIn className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg">
                <Maximize className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Main Image Container */}
          <div className="flex-1 relative flex items-center justify-center w-full h-full group">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                src={images[currentIndex]}
                alt={`${business.name} Gallery ${currentIndex + 1}`}
                className="max-w-full max-h-[85vh] object-contain p-4 md:p-12"
              />
            </AnimatePresence>

            {/* Navigation Arrows */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md"
              onClick={prevImage}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md"
              onClick={nextImage}
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
