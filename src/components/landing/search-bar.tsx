"use client";

import { Search, MapPin, Grid } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SearchBar() {
  return (
    <div className="w-full bg-white/90 backdrop-blur-md p-2.5 md:p-3.5 rounded-2xl md:rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 flex flex-col md:flex-row items-center gap-3 transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] focus-within:shadow-[0_8px_40px_rgb(37,99,235,0.12)] focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-500/10 relative z-30">
      
      <div className="flex-1 w-full flex items-center px-5 py-3 border-b md:border-b-0 md:border-r border-slate-200 focus-within:bg-blue-50/50 rounded-t-xl md:rounded-l-full md:rounded-tr-none transition-colors group">
        <Search className="h-5 w-5 text-slate-400 mr-3 shrink-0 group-focus-within:text-blue-500 transition-colors" />
        <input 
          type="text" 
          placeholder="What are you looking for?" 
          className="w-full bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400 font-medium text-lg"
        />
      </div>

      <div className="flex-1 w-full flex items-center px-5 py-3 border-b md:border-b-0 md:border-r border-slate-200 focus-within:bg-blue-50/50 transition-colors group">
        <MapPin className="h-5 w-5 text-slate-400 mr-3 shrink-0 group-focus-within:text-blue-500 transition-colors" />
        <input 
          type="text" 
          placeholder="Location (e.g., Mathura)" 
          className="w-full bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400 font-medium text-lg"
        />
      </div>

      <div className="flex-1 w-full flex items-center px-5 py-3 focus-within:bg-blue-50/50 md:rounded-r-full transition-colors group">
        <Grid className="h-5 w-5 text-slate-400 mr-3 shrink-0 group-focus-within:text-blue-500 transition-colors" />
        <select className="w-full bg-transparent border-none outline-none text-slate-800 font-medium text-lg appearance-none cursor-pointer">
          <option value="">All Categories</option>
          <option value="restaurants">Restaurants</option>
          <option value="hotels">Hotels</option>
          <option value="hospitals">Hospitals</option>
          <option value="shopping">Shopping</option>
        </select>
      </div>

      <Button className="w-full md:w-auto mt-3 md:mt-0 h-14 md:h-16 px-10 rounded-xl md:rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-[0_8px_20px_-6px_rgba(37,99,235,0.4)] hover:shadow-[0_12px_24px_-6px_rgba(37,99,235,0.6)] hover:-translate-y-0.5 text-lg font-semibold transition-all duration-300">
        Search
      </Button>
    </div>
  );
}
