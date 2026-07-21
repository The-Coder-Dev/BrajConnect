import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Cloudinary — business logos, covers, gallery images
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      // Supabase Storage — any assets stored via Supabase
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      // Unsplash — used on landing page static data
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  experimental: {
    // Tree-shake named imports from heavy packages at the module level,
    // reducing the client JS bundle per-page significantly.
    optimizePackageImports: ["lucide-react", "framer-motion", "@radix-ui/react-icons"],
  },
};

export default nextConfig;
