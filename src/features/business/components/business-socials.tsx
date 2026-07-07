import { mockBusiness } from '../data/mock-business';
import { Globe, MessageCircle } from 'lucide-react';
import { FaInstagram, FaFacebook, FaLinkedin, FaYoutube } from 'react-icons/fa';

export function BusinessSocials({ business = mockBusiness }: { business?: typeof mockBusiness }) {
  const { socials, contact } = business;

  const socialLinks = [
    { name: "Website", icon: Globe, url: contact.website ? `https://${contact.website}` : null, color: "text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white" },
    { name: "WhatsApp", icon: MessageCircle, url: contact.whatsapp ? `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}` : null, color: "text-emerald-500 group-hover:text-emerald-600" },
    { name: "Instagram", icon: FaInstagram, url: socials?.instagram, color: "text-pink-500 group-hover:text-pink-600" },
    { name: "Facebook", icon: FaFacebook, url: socials?.facebook, color: "text-blue-500 group-hover:text-blue-600" },
    { name: "LinkedIn", icon: FaLinkedin, url: socials?.linkedin, color: "text-blue-600 group-hover:text-blue-700" },
    { name: "YouTube", icon: FaYoutube, url: socials?.youtube, color: "text-red-500 group-hover:text-red-600" }
  ].filter(link => link.url);

  if (socialLinks.length === 0) return null;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Connect & Follow</h2>
      </div>

      <div className="flex flex-wrap gap-4">
        {socialLinks.map((link, idx) => (
          <a 
            key={idx} 
            href={link.url!} 
            target="_blank" 
            rel="noopener noreferrer"
            title={link.name}
            className="group w-14 h-14 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 hover:border-slate-200 dark:hover:border-slate-700 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_15px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-0.5"
          >
            <link.icon className={`w-6 h-6 transition-colors duration-300 ${link.color}`} />
          </a>
        ))}
      </div>
    </div>
  );
}
