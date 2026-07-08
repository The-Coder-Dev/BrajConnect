import Link from "next/link";
import { Building2 } from "lucide-react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="bg-slate-50 pt-32 pb-12 border-t border-slate-200/60 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-linear-to-r from-transparent via-slate-300 to-transparent" />
      
      <div className="container mx-auto px-6 md:px-12 max-w-[1440px] relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-8 mb-24">
          
          <div className="lg:col-span-5 pr-8">
            <Link href="/" className="flex items-center gap-3 mb-8 group  ">
              <div className="bg-primary p-2.5 rounded-2xl text-white shadow-lg shadow-blue-600/20 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
                <Building2 className="h-6 w-6" />
              </div>
              <span className="text-3xl font-extrabold tracking-tight text-slate-900">
                BrajConnect
              </span>
            </Link>
            <p className="text-slate-500 text-lg leading-relaxed mb-10 max-w-md">
              The premium business discovery platform connecting customers with trusted local services, shops, and experiences across the Braj region.
            </p>
            <div className="flex items-center gap-5">
              <a href="#" className="w-12 h-12 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-500 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <FaFacebook className="h-5 w-5" />
              </a>
              <a href="#" className="w-12 h-12 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-500 hover:bg-sky-500 hover:text-white hover:border-sky-500 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <FaTwitter className="h-5 w-5" />
              </a>
              <a href="#" className="w-12 h-12 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-500 hover:bg-pink-600 hover:text-white hover:border-pink-600 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <FaInstagram className="h-5 w-5" />
              </a>
              <a href="#" className="w-12 h-12 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-500 hover:bg-blue-800 hover:text-white hover:border-blue-800 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <FaLinkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-2 lg:col-start-7">
            <h4 className="font-bold text-slate-900 mb-8 text-lg">Quick Links</h4>
            <ul className="space-y-5">
              <li><Link href="/" className="text-slate-500 font-medium hover:text-red-600 hover:translate-x-1 inline-block transition-all duration-300">Home</Link></li>
              <li><Link href="#about" className="text-slate-500 font-medium hover:text-red-600 hover:translate-x-1 inline-block transition-all duration-300">About Us</Link></li>
              <li><Link href="#businesses" className="text-slate-500 font-medium hover:text-red-600 hover:translate-x-1 inline-block transition-all duration-300">Explore</Link></li>
              <li><Link href="#" className="text-slate-500 font-medium hover:text-red-600 hover:translate-x-1 inline-block transition-all duration-300">Contact</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-bold text-slate-900 mb-8 text-lg">Categories</h4>
            <ul className="space-y-5">
              <li><Link href="#" className="text-slate-500 font-medium hover:text-red-600 hover:translate-x-1 inline-block transition-all duration-300">Restaurants</Link></li>
              <li><Link href="#" className="text-slate-500 font-medium hover:text-red-600 hover:translate-x-1 inline-block transition-all duration-300">Hotels</Link></li>
              <li><Link href="#" className="text-slate-500 font-medium hover:text-red-600 hover:translate-x-1 inline-block transition-all duration-300">Hospitals</Link></li>
              <li><Link href="#" className="text-slate-500 font-medium hover:text-red-600 hover:translate-x-1 inline-block transition-all duration-300">Shopping</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-bold text-slate-900 mb-8 text-lg">Legal</h4>
            <ul className="space-y-5">
              <li><Link href="#" className="text-slate-500 font-medium hover:text-red-600 hover:translate-x-1 inline-block transition-all duration-300">Terms of Service</Link></li>
              <li><Link href="#" className="text-slate-500 font-medium hover:text-red-600 hover:translate-x-1 inline-block transition-all duration-300">Privacy Policy</Link></li>
              <li><Link href="#" className="text-slate-500 font-medium hover:text-red-600 hover:translate-x-1 inline-block transition-all duration-300">Cookie Policy</Link></li>
              <li><Link href="#" className="text-slate-500 font-medium hover:text-red-600 hover:translate-x-1 inline-block transition-all duration-300">Disclaimer</Link></li>
            </ul>
          </div>

        </div>

        <div className="pt-10 border-t border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-slate-500 font-medium">
            © {new Date().getFullYear()} BrajConnect. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="font-medium text-slate-700 flex items-center bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
              
              Created with ❤️ 
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
