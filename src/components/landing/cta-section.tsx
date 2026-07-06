"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, Sparkles } from "lucide-react";
import { useRef } from "react";

export function CTASection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const yParallax = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.5, 1], [0.5, 1, 0.8]);

  return (
    <section className="py-32 bg-white relative">
      <div className="container mx-auto px-4 md:px-6 max-w-[1440px]">
        <motion.div 
          ref={containerRef}
          style={{ opacity: opacityFade }}
          className="relative rounded-[3rem] overflow-hidden bg-slate-950 p-10 md:p-24 text-center flex flex-col items-center justify-center min-h-[500px] shadow-2xl border border-slate-800"
        >
          
          {/* Animated Background Gradients & Parallax Shapes */}
          <div className="absolute inset-0 overflow-hidden z-0">
            <motion.div 
              style={{ y: yParallax }}
              className="absolute inset-0"
            >
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 90, 0],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-[30%] -left-[10%] w-[60%] h-[60%] rounded-[100%] bg-blue-600/40 blur-[120px]" 
              />
              <motion.div 
                animate={{ 
                  scale: [1, 1.3, 1],
                  rotate: [0, -90, 0],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-[30%] -right-[10%] w-[60%] h-[60%] rounded-[100%] bg-indigo-600/40 blur-[120px]" 
              />
            </motion.div>
            
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
              className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-xl flex items-center justify-center text-white mb-10 border border-white/20 shadow-inner relative group"
            >
              <div className="absolute inset-0 bg-white/20 rounded-3xl blur-md group-hover:bg-white/30 transition-colors" />
              <Building2 className="h-10 w-10 relative z-10" />
              <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-amber-300" />
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-8 leading-[1.1]"
            >
              Grow your business with <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-indigo-400">BrajConnect</span>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl font-medium leading-relaxed"
            >
              Join thousands of businesses reaching new customers every day. Setup takes less than 5 minutes and it&apos;s completely free to start.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full sm:w-auto"
            >
              <Button className="w-full sm:w-auto h-16 px-10 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xl font-bold shadow-[0_0_40px_rgba(37,99,235,0.4)] hover:shadow-[0_0_60px_rgba(37,99,235,0.6)] hover:-translate-y-1 transition-all duration-300 border-none">
                Register Your Business
              </Button>
              <Button variant="outline" className="w-full sm:w-auto h-16 px-10 rounded-full bg-white/5 hover:bg-white/15 text-white border-white/20 text-xl font-semibold backdrop-blur-md transition-all duration-300 hover:-translate-y-1">
                Learn More <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </motion.div>
          </div>
          
        </motion.div>
      </div>
    </section>
  );
}
