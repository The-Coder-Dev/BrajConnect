import { mockBusiness } from '../data/mock-business';
import { Star, CheckCircle, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

export function BusinessReviews({ business = mockBusiness }: { business?: typeof mockBusiness }) {
  const reviews = business.reviews;
  if (!reviews) return null;

  const totalReviews = business.reviewCount;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Reviews & Ratings</h2>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-[0_2px_10px_rgba(37,99,235,0.2)] transition-all">
          Write a Review
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        
        {/* Overall Rating */}
        <div className="flex flex-col items-center justify-center py-8 px-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-center h-full">
          <div className="text-6xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">{reviews.overall}</div>
          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className={`w-5 h-5 ${star <= Math.round(reviews.overall) ? 'fill-amber-400 text-amber-400' : 'fill-slate-100 text-slate-200 dark:fill-slate-800 dark:text-slate-700'}`} />
            ))}
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Based on {totalReviews} reviews</p>
        </div>

        {/* Rating Breakdown */}
        <div className="md:col-span-2 flex flex-col justify-center gap-4 py-6 px-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = reviews.breakdown[rating as keyof typeof reviews.breakdown] || 0;
            const percentage = (count / totalReviews) * 100;
            
            return (
              <div key={rating} className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 w-14 text-sm font-medium text-slate-700 dark:text-slate-300">
                  {rating} <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                </div>
                <Progress value={percentage} className="h-2.5 bg-slate-100 dark:bg-slate-800 flex-1 **:data-[slot=progress-indicator]:bg-amber-400" />
                <div className="w-12 text-right text-sm text-slate-500 dark:text-slate-400">{count}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review List */}
      <div className="space-y-5">
        {reviews.recent.map((review) => (
          <div key={review.id} className="p-6 sm:p-8 rounded-2xl border border-slate-100 dark:border-slate-800/60 bg-white dark:bg-slate-900 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-shadow hover:shadow-[0_4px_15px_rgba(0,0,0,0.04)]">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-5 gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12 border border-slate-100 dark:border-slate-800">
                  <AvatarImage src={review.avatar} alt={review.author} />
                  <AvatarFallback className="bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 font-semibold">{review.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2.5 mb-0.5">
                    <h4 className="font-bold text-slate-900 dark:text-white text-base">{review.author}</h4>
                    {review.verified && (
                      <span className="flex items-center text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-100 text-slate-200 dark:fill-slate-800 dark:text-slate-700'}`} />
                      ))}
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">• {review.date}</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-300 mb-5 leading-relaxed text-[15px]">
              {review.content}
            </p>
            <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/60">
              <button className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors bg-slate-50 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-900/30 px-3 py-1.5 rounded-lg">
                <ThumbsUp className="w-4 h-4" />
                Helpful
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <Button variant="outline" className="rounded-lg px-8 py-6 h-auto text-base font-medium border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
          View All Reviews
        </Button>
      </div>
    </div>
  );
}
