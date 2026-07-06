"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Building2 } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6 max-w-[1440px]">
        <div className="relative rounded-[2.5rem] overflow-hidden bg-slate-900 p-10 md:p-20 text-center flex flex-col items-center justify-center min-h-[400px]">
          
          {/* Background Gradients */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
            <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-600/30 blur-[120px]" />
            <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-indigo-600/30 blur-[120px]" />
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white mb-8 border border-white/20">
              <Building2 className="h-8 w-8" />
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6 leading-tight">
              Grow your business with BrajConnect
            </h2>
            
            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl">
              Join thousands of businesses reaching new customers every day. Setup takes less than 5 minutes and it's completely free to start.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <Button className="w-full sm:w-auto h-14 px-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-lg font-semibold border border-blue-500 shadow-lg shadow-blue-600/20 transition-all hover:scale-105">
                Register Your Business
              </Button>
              <Button variant="outline" className="w-full sm:w-auto h-14 px-8 rounded-full bg-white/10 hover:bg-white/20 text-white border-white/20 text-lg font-semibold backdrop-blur-md transition-all">
                Learn More <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
