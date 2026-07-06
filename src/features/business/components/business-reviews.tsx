import { mockBusiness } from '../data/mock-business';
import { Star, CheckCircle, MessageSquare, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

export function BusinessReviews({ business = mockBusiness }: { business?: typeof mockBusiness }) {
  const reviews = business.reviews;
  if (!reviews) return null;

  const totalReviews = business.reviewCount;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-slate-700 dark:text-slate-300" />
          Reviews & Ratings
        </h2>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm">
          Write a Review
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        
        {/* Overall Rating */}
        <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <div className="text-5xl font-extrabold text-slate-900 dark:text-white mb-2">{reviews.overall}</div>
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className={`w-5 h-5 ${star <= Math.round(reviews.overall) ? 'fill-amber-400 text-amber-400' : 'fill-slate-100 text-slate-200 dark:fill-slate-800 dark:text-slate-700'}`} />
            ))}
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Based on {totalReviews} reviews</p>
        </div>

        {/* Rating Breakdown */}
        <div className="md:col-span-2 flex flex-col justify-center gap-3">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = reviews.breakdown[rating as keyof typeof reviews.breakdown] || 0;
            const percentage = (count / totalReviews) * 100;
            
            return (
              <div key={rating} className="flex items-center gap-4">
                <div className="flex items-center gap-1 w-12 text-sm font-medium text-slate-700 dark:text-slate-300">
                  {rating} <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                </div>
                <Progress value={percentage} className="h-2.5 bg-slate-100 dark:bg-slate-800" />
                <div className="w-10 text-right text-sm text-slate-500 dark:text-slate-400">{count}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review List */}
      <div className="space-y-4">
        {reviews.recent.map((review) => (
          <Card key={review.id} className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12 border border-slate-200 dark:border-slate-700">
                    <AvatarImage src={review.avatar} alt={review.author} />
                    <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 dark:text-white">{review.author}</h4>
                      {review.verified && (
                        <span className="flex items-center text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{review.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-100 text-slate-200 dark:fill-slate-800 dark:text-slate-700'}`} />
                  ))}
                </div>
              </div>
              <p className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
                {review.content}
              </p>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <button className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
                  <ThumbsUp className="w-4 h-4" />
                  Helpful
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <Button variant="outline" className="rounded-xl px-8 dark:border-slate-800">
          View All Reviews
        </Button>
      </div>
    </div>
  );
}
