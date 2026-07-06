import { mockBusiness } from '../data/mock-business';
import { MapPin, Star, CheckCircle, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function RelatedBusinesses({ business = mockBusiness }: { business?: typeof mockBusiness }) {
  const related = business.relatedBusinesses || [];
  if (related.length === 0) return null;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Similar Businesses</h2>
          <p className="text-slate-500 dark:text-slate-400">People also viewed these businesses</p>
        </div>
        <Button variant="outline" className="hidden sm:flex rounded-xl dark:border-slate-800">
          View All <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {related.map((rb) => (
          <Card key={rb.id} className="group overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:shadow-lg shadow-sm cursor-pointer">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={rb.logo} alt={rb.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-bold text-slate-900 dark:text-white truncate" title={rb.name}>
                      {rb.name}
                    </h3>
                    {rb.verified && (
                      <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-500 shrink-0" />
                    )}
                  </div>
                  
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-2 truncate">
                    {rb.category}
                  </p>
                  
                  <div className="flex items-center gap-3 text-sm font-medium">
                    <span className="flex items-center text-slate-700 dark:text-slate-300">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400 mr-1" />
                      {rb.rating}
                    </span>
                    <span className="flex items-center text-slate-500 dark:text-slate-400 truncate">
                      <MapPin className="w-4 h-4 mr-1 shrink-0" />
                      {rb.location}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Button variant="outline" className="w-full mt-6 sm:hidden rounded-xl dark:border-slate-800">
        View All <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
}
