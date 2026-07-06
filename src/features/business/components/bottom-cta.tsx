import { mockBusiness } from '../data/mock-business';
import { ArrowRight, Building2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function BottomCta() {
  return (
    <div className="w-full relative rounded-[2rem] overflow-hidden bg-blue-600 border border-blue-500 shadow-2xl">
      
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>

      <div className="relative z-10 px-6 py-12 sm:px-12 sm:py-16 md:py-20 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
        
        <div className="flex-1 max-w-2xl text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/30 border border-blue-400/30 text-blue-50 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Grow Your Reach
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight tracking-tight">
            Own a business? <br className="hidden sm:block" />
            <span className="text-blue-100">Get discovered by thousands of customers.</span>
          </h2>
          <p className="text-blue-100/80 text-lg max-w-xl">
            Join BrajConnect to showcase your services, manage bookings, and build your brand presence in the local community.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto shrink-0">
          <Button size="lg" className="h-14 px-8 text-base font-semibold rounded-2xl bg-white text-blue-600 hover:bg-slate-50 hover:text-blue-700 shadow-lg shadow-black/10 hover:scale-105 transition-transform">
            <Building2 className="w-5 h-5 mr-2" />
            Register Your Business
          </Button>
          <Button size="lg" variant="outline" className="h-14 px-8 text-base font-semibold rounded-2xl border-white/20 text-slate-800 bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors">
            Learn More <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

      </div>
    </div>
  );
}
