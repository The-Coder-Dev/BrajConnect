import { Variants } from "framer-motion";

export const fadeSlideVariants: Variants = {
  initial: { opacity: 0, y: 12, filter: "blur(4px)" },
  animate: { 
    opacity: 1, 
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] } 
  },
  exit: { 
    opacity: 0, 
    y: -8,
    filter: "blur(2px)",
    transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] } 
  },
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.05
    }
  }
};

export const fadeItem = {
  initial: { opacity: 0, y: 10 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};
