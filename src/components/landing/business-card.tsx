"use client";

import { Star, MapPin, Phone, ShieldCheck, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface BusinessCardProps {
  name: string;
  category: string;
  location: string;
  rating: number;
  reviews: number;
  verified?: boolean;
  description?: string;
  image: string;
  logo: string;
  slug?: string;
}

export function BusinessCard({ name, category, location, rating, reviews, verified, description, image, logo, slug }: BusinessCardProps) {
  return (
    <div className="group bg-white rounded-3xl border border-slate-200/60 overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-500 flex flex-col h-full relative">
      
      {/* Save Button (Floating) */}
      <button className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/50 backdrop-blur-md text-slate-600 hover:text-red-500 hover:bg-white hover:scale-110 shadow-sm transition-all duration-300">
        <Heart className="h-4 w-4" />
      </button>

      {/* Cover Image */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        {/* Using standard img for external URLs to avoid next/image domain configs */}
        <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
        
        {verified && (
          <div className="absolute top-4 left-4 bg-emerald-500/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 text-xs font-bold text-white shadow-[0_4px_10px_rgba(16,185,129,0.3)]">
            <ShieldCheck className="h-3.5 w-3.5" />
            Verified
          </div>
        )}
        
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-bold text-slate-800 shadow-md">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          {rating} <span className="font-medium text-slate-500">({reviews})</span>
        </div>
      </div>

      <div className="relative flex-1 p-6 pt-10">
        {/* Overlapping Logo */}
        <div className="absolute -top-10 left-6 h-16 w-16 rounded-2xl bg-white p-1 shadow-lg shadow-black/5 border border-slate-100 group-hover:-translate-y-1 transition-transform duration-500">
          <img src={logo} alt={`${name} logo`} className="w-full h-full object-cover rounded-xl" />
        </div>

        <div className="mb-2">
          <span className="text-xs font-bold text-blue-600 tracking-wider uppercase bg-blue-50 px-2 py-1 rounded-md">{category}</span>
        </div>
        
        <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">{name}</h3>
        
        {description && (
          <p className="text-sm text-slate-600 mb-4 line-clamp-2">
            {description}
          </p>
        )}
        
        <div className="flex items-center text-slate-500 text-sm mb-6">
          <MapPin className="h-4 w-4 mr-2 shrink-0 text-slate-400" />
          <span className="line-clamp-1 font-medium">{location}</span>
        </div>

        <div className="mt-auto pt-5 flex items-center gap-3 border-t border-slate-100/80">
          <Button render={<Link href={`/business/${slug || name.toLowerCase().replace(/\s+/g, '-')}`} />} variant="default" className="flex-1 h-11 rounded-xl border-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 font-semibold shadow-sm transition-all duration-300">
              View Details
          </Button>
          <Button size="icon" className="h-11 w-11 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white shrink-0 transition-colors shadow-sm">
            <Phone className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
