import { mockBusiness } from '../data/mock-business';
import { Info, Users, Briefcase, Languages, Calendar, Clock, DollarSign, Activity } from 'lucide-react';

export function BusinessInfo({ business = mockBusiness }: { business?: typeof mockBusiness }) {
  const highlights = [
    { label: "Established", value: business.highlights.established || "2015", icon: Calendar },
    { label: "Owner", value: "Priya Sharma", icon: Users }, // Following wireframe example "Owner"
    { label: "Languages", value: business.highlights.languages || "English, Hindi", icon: Languages },
    { label: "Price Range", value: "$$ - $$$", icon: DollarSign },
    { label: "Team Size", value: business.highlights.employees || "10-50", icon: Users },
    { label: "Business Type", value: "Premium Salon", icon: Briefcase }, // Following wireframe example
  ];

  return (
    <div className="w-full space-y-8">
      
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">About the Business</h2>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[15px]">
          {business.description}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {highlights.map((item, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400 shrink-0">
              <item.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-0.5">{item.label}</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
