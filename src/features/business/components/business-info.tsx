import { mockBusiness } from '../data/mock-business';
import { Info, Users, Briefcase, Languages, MapPin, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function BusinessInfo({ business = mockBusiness }: { business?: typeof mockBusiness }) {
  const highlights = [
    { label: "Established", value: business.highlights.established, icon: Calendar },
    { label: "Owner", value: business.highlights.owner, icon: Info },
    { label: "Languages", value: business.highlights.languages, icon: Languages },
    { label: "Service Area", value: business.highlights.serviceArea, icon: MapPin },
    { label: "Team", value: business.highlights.employees, icon: Users },
    { label: "Business Type", value: business.highlights.businessType, icon: Briefcase },
  ];

  return (
    <div className="w-full space-y-6">
      
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">About the Business</h2>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
          {business.description}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {highlights.map((item, idx) => (
          <Card key={idx} className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/50 dark:border-slate-800/50 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-start gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400 shrink-0">
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{item.label}</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
}
