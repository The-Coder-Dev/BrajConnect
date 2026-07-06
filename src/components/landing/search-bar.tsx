"use client";

import { Search, MapPin, Grid } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SearchBar() {
  return (
    <div className="w-full bg-white p-2 md:p-3 rounded-2xl md:rounded-full shadow-lg shadow-slate-200/50 border border-slate-200 flex flex-col md:flex-row items-center gap-2 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/60 focus-within:shadow-xl focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-100">
      
      <div className="flex-1 w-full flex items-center px-4 py-2 border-b md:border-b-0 md:border-r border-slate-200 focus-within:bg-slate-50 rounded-t-xl md:rounded-l-full md:rounded-tr-none transition-colors">
        <Search className="h-5 w-5 text-slate-400 mr-3 shrink-0" />
        <input 
          type="text" 
          placeholder="What are you looking for?" 
          className="w-full bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400"
        />
      </div>

      <div className="flex-1 w-full flex items-center px-4 py-2 border-b md:border-b-0 md:border-r border-slate-200 focus-within:bg-slate-50 transition-colors">
        <MapPin className="h-5 w-5 text-slate-400 mr-3 shrink-0" />
        <input 
          type="text" 
          placeholder="Location (e.g., Mathura)" 
          className="w-full bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400"
        />
      </div>

      <div className="flex-1 w-full flex items-center px-4 py-2 focus-within:bg-slate-50 md:rounded-r-full transition-colors">
        <Grid className="h-5 w-5 text-slate-400 mr-3 shrink-0" />
        <select className="w-full bg-transparent border-none outline-none text-slate-800 appearance-none cursor-pointer">
          <option value="">All Categories</option>
          <option value="restaurants">Restaurants</option>
          <option value="hotels">Hotels</option>
          <option value="hospitals">Hospitals</option>
          <option value="shopping">Shopping</option>
        </select>
      </div>

      <Button className="w-full md:w-auto mt-2 md:mt-0 h-12 md:h-14 px-8 rounded-xl md:rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 text-base font-semibold">
        Search
      </Button>
    </div>
  );
}
