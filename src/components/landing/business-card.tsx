"use client";

import Image from "next/image";
import { Star, MapPin, Phone, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BusinessCardProps {
  name: string;
  category: string;
  location: string;
  rating: number;
  reviews: number;
  verified?: boolean;
  image: string;
  logo: string;
}

export function BusinessCard({ name, category, location, rating, reviews, verified, image, logo }: BusinessCardProps) {
  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-300 transition-all duration-300 flex flex-col h-full">
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        {/* Placeholder gradient since we don't have images */}
        <div className="absolute inset-0 bg-linear-to-br from-blue-100 to-indigo-100 group-hover:scale-105 transition-transform duration-500" />
        
        {verified && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1.5 text-xs font-semibold text-emerald-600 shadow-sm">
            <ShieldCheck className="h-3.5 w-3.5" />
            Verified
          </div>
        )}
        
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 text-xs font-bold text-slate-800 shadow-sm">
          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
          {rating} <span className="font-normal text-slate-500">({reviews})</span>
        </div>
      </div>

      <div className="relative flex-1 p-5 pt-8">
        <div className="absolute -top-10 left-5 h-16 w-16 rounded-xl bg-white p-1.5 shadow-md border border-slate-100">
          <div className="w-full h-full rounded-lg bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
            {name.charAt(0)}
          </div>
        </div>

        <div className="mb-1">
          <span className="text-xs font-semibold text-blue-600 tracking-wider uppercase">{category}</span>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">{name}</h3>
        
        <div className="flex items-center text-slate-500 text-sm mb-6">
          <MapPin className="h-4 w-4 mr-1.5 shrink-0" />
          <span className="line-clamp-1">{location}</span>
        </div>

        <div className="mt-auto pt-4 flex items-center gap-3 border-t border-slate-100">
          <Button variant="outline" className="flex-1 rounded-xl border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200">
            View Details
          </Button>
          <Button size="icon" className="rounded-xl bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white shrink-0 transition-colors">
            <Phone className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
