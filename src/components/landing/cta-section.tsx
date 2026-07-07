"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, Sparkles } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-32 bg-white relative">
      <div className="container mx-auto px-4 md:px-6 max-w-[1440px]">
        <div className="relative rounded-[3rem] overflow-hidden bg-slate-950 p-10 md:p-24 text-center flex flex-col items-center justify-center min-h-[500px] shadow-2xl border border-slate-800">
          {/* Animated Background Gradients & Parallax Shapes */}
          <div className="absolute inset-0 overflow-hidden z-0">
            <div className="absolute inset-0">
              <div className="absolute top-[-30%] left-[-10%] w-[60%] h-[60%] rounded-[100%] bg-blue-600/40 blur-[120px]" />
              <div className="absolute bottom-[-30%] right-[-10%] w-[60%] h-[60%] rounded-[100%] bg-indigo-600/40 blur-[120px]" />
            </div>

            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
            <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-xl flex items-center justify-center text-white mb-10 border border-white/20 shadow-inner relative group">
              <div className="absolute inset-0 bg-white/20 rounded-3xl blur-md group-hover:bg-white/30 transition-colors" />
              <Building2 className="h-10 w-10 relative z-10" />
              <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-amber-300" />
            </div>

            <h2 className="text-5xl md:text-6xl lg:text-6xl font-extrabold text-white tracking-tight mb-8 leading-[1.1]">
              Grow your business with{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-indigo-400">
                BrajConnect
              </span>
            </h2>

            <p className="text-xl md:text-xl text-slate-300 mb-12 max-w-3xl font-medium leading-relaxed">
              Join thousands of businesses reaching new customers every day.
              Setup takes less than 5 minutes and it&apos;s completely free to
              start.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full sm:w-auto">
              <Button render={<Link href="/" />} className="w-full sm:w-auto h-16 px-10 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xl font-bold shadow-[0_0_40px_rgba(37,99,235,0.4)] hover:shadow-[0_0_60px_rgba(37,99,235,0.6)] hover:-translate-y-1 transition-all duration-300 border-none">
                Register Your Business
              </Button>
              <Button
                variant="outline"
                className="w-full sm:w-auto h-16 px-10 rounded-full bg-white/5 hover:bg-white/15 text-white hover:text-white border-white/20 text-xl font-semibold backdrop-blur-md transition-all duration-300 hover:-translate-y-1"
              >
                Learn More <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
