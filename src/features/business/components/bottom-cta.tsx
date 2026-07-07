import { mockBusiness } from '../data/mock-business';
import { ArrowRight, Building2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function BottomCta() {
  return (
    <div className="w-full relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 shadow-[0_8px_30px_rgba(37,99,235,0.2)]">
      
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400/20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>

      <div className="relative z-10 px-6 py-14 sm:px-12 sm:py-20 flex flex-col md:flex-row items-center justify-between gap-10 md:gap-16">
        
        <div className="flex-1 max-w-2xl text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/20 text-blue-50 text-sm font-semibold mb-6 shadow-sm backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-blue-300" />
            Grow Your Reach
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-white mb-5 leading-tight tracking-tight">
            Own a business? <br className="hidden sm:block" />
            <span className="text-blue-200">Get discovered by thousands.</span>
          </h2>
          <p className="text-blue-100/90 text-[17px] leading-relaxed max-w-xl">
            Join BrajConnect to showcase your services, manage bookings, and build your brand presence in the local community.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto shrink-0">
          <Button size="lg" className="h-14 px-8 text-[15px] font-semibold rounded-xl bg-white text-blue-700 hover:bg-slate-50 hover:text-blue-800 shadow-lg shadow-black/10 transition-transform hover:scale-[1.02] active:scale-[0.98]">
            <Building2 className="w-5 h-5 mr-2" />
            Register Your Business
          </Button>
          <Button size="lg" variant="outline" className="h-14 px-8 text-[15px] font-semibold rounded-xl border-white/20 text-white bg-white/5 hover:bg-white/10 hover:text-white backdrop-blur-md transition-all active:scale-[0.98]">
            Learn More <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

      </div>
    </div>
  );
}
