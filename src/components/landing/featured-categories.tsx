import { 
  Utensils, 
  Hotel, 
  Stethoscope, 
  GraduationCap, 
  ShoppingBag, 
  Car, 
  Dumbbell, 
  Scissors,
  Coffee,
  Building,
  HeartPulse,
  Landmark
} from "lucide-react";
import { SectionHeader } from "@/components/landing/section-header";

const categories = [
  { name: "Restaurants", icon: Utensils, count: 120, color: "bg-orange-100 text-orange-600", hoverBorder: "hover:border-orange-300", hoverText:"group-hover:text-orange-600", hoverShadow: "hover:shadow-orange-500/10" },
  { name: "Hotels", icon: Hotel, count: 85, color: "bg-blue-100 text-blue-600", hoverBorder: "hover:border-blue-300", hoverText:"group-hover:text-blue-600", hoverShadow: "hover:shadow-blue-500/10" },
  { name: "Hospitals", icon: HeartPulse, count: 42, color: "bg-red-100 text-red-600", hoverBorder: "hover:border-red-300", hoverText:"group-hover:text-red-600", hoverShadow: "hover:shadow-red-500/10" },
  { name: "Temples", icon: Landmark, count: 56, color: "bg-amber-100 text-amber-600", hoverBorder: "hover:border-amber-300", hoverText:"group-hover:text-amber-600", hoverShadow: "hover:shadow-amber-500/10" },
  { name: "Schools", icon: GraduationCap, count: 94, color: "bg-emerald-100 text-emerald-600", hoverBorder: "hover:border-emerald-300", hoverText:"group-hover:text-emerald-600", hoverShadow: "hover:shadow-emerald-500/10" },
  { name: "Shopping", icon: ShoppingBag, count: 215, color: "bg-purple-100 text-purple-600", hoverBorder: "hover:border-purple-300", hoverText:"group-hover:text-purple-600", hoverShadow: "hover:shadow-purple-500/10" },
  { name: "Automobile", icon: Car, count: 63, color: "bg-slate-100 text-slate-600", hoverBorder: "hover:border-slate-300", hoverText:"group-hover:text-slate-600", hoverShadow: "hover:shadow-slate-500/10" },
  { name: "Gyms", icon: Dumbbell, count: 38, color: "bg-zinc-100 text-zinc-800", hoverBorder: "hover:border-zinc-300", hoverText:"group-hover:text-zinc-800", hoverShadow: "hover:shadow-zinc-500/10" },
  { name: "Beauty", icon: Scissors, count: 104, color: "bg-pink-100 text-pink-600", hoverBorder: "hover:border-pink-300", hoverText:"group-hover:text-pink-600", hoverShadow: "hover:shadow-pink-500/10" },
  { name: "Cafes", icon: Coffee, count: 45, color: "bg-yellow-100 text-yellow-700", hoverBorder: "hover:border-yellow-300", hoverText:"group-hover:text-yellow-700", hoverShadow: "hover:shadow-yellow-500/10" },
  { name: "Real Estate", icon: Building, count: 72, color: "bg-indigo-100 text-indigo-600", hoverBorder: "hover:border-indigo-300", hoverText:"group-hover:text-indigo-600", hoverShadow: "hover:shadow-indigo-500/10" },
  { name: "Doctors", icon: Stethoscope, count: 156, color: "bg-cyan-100 text-cyan-600", hoverBorder: "hover:border-cyan-300", hoverText:"group-hover:text-cyan-600", hoverShadow: "hover:shadow-cyan-500/10" },
];

export function FeaturedCategories() {
  return (
    <section id="categories" className="py-24 bg-white relative">
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-slate-200 to-transparent"></div>
      <div className="container mx-auto px-4 md:px-6 max-w-[1440px]">
        <SectionHeader 
          title="Explore by Category" 
          subtitle="Find exactly what you're looking for from our comprehensive list of local business categories."
          align="center"
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5 md:gap-6 mt-16">
          {categories.map((category) => (
            <div key={category.name}>
              <a 
                href="#" 
                className={`group flex flex-col items-center p-6 bg-slate-50/50 backdrop-blur-sm rounded-3xl border border-slate-200/60 hover:bg-white transition-all duration-500 text-center cursor-pointer hover:-translate-y-1 hover:shadow-xl ${category.hoverBorder} ${category.hoverShadow}`}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-inner ${category.color}`}>
                  <category.icon className="h-7 w-7" />
                </div>
                <h3 className={`font-semibold text-slate-900 mb-1.5 ${category.hoverText} transition-colors`}>{category.name}</h3>
                <p className="text-sm font-medium text-slate-500">{category.count} Listings</p>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

