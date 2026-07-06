import Link from "next/link";
import { Building2 } from "lucide-react";

import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 pt-20 pb-10">
      <div className="container mx-auto px-4 md:px-6 max-w-[1440px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-16">
          
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="bg-blue-600 p-2 rounded-xl text-white">
                <Building2 className="h-5 w-5" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-slate-900">
                BrajConnect
              </span>
            </Link>
            <p className="text-slate-500 leading-relaxed mb-8 max-w-sm">
              The premium business discovery platform connecting customers with trusted local services, shops, and experiences.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-blue-600 hover:text-white transition-colors">
                <FaFacebook className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-blue-400 hover:text-white transition-colors">
                <FaTwitter className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-pink-600 hover:text-white transition-colors">
                <FaInstagram className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-blue-800 hover:text-white transition-colors">
                <FaLinkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link href="/" className="text-slate-500 hover:text-blue-600 transition-colors">Home</Link></li>
              <li><Link href="#about" className="text-slate-500 hover:text-blue-600 transition-colors">About Us</Link></li>
              <li><Link href="#businesses" className="text-slate-500 hover:text-blue-600 transition-colors">Explore</Link></li>
              <li><Link href="#" className="text-slate-500 hover:text-blue-600 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-6">Categories</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-slate-500 hover:text-blue-600 transition-colors">Restaurants</Link></li>
              <li><Link href="#" className="text-slate-500 hover:text-blue-600 transition-colors">Hotels</Link></li>
              <li><Link href="#" className="text-slate-500 hover:text-blue-600 transition-colors">Hospitals</Link></li>
              <li><Link href="#" className="text-slate-500 hover:text-blue-600 transition-colors">Shopping</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-6">Legal</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-slate-500 hover:text-blue-600 transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="text-slate-500 hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-slate-500 hover:text-blue-600 transition-colors">Cookie Policy</Link></li>
              <li><Link href="#" className="text-slate-500 hover:text-blue-600 transition-colors">Disclaimer</Link></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} BrajConnect. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-sm font-medium text-slate-900 flex items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
              Created with ❤️ By Dev
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
