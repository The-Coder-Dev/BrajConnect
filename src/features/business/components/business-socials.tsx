import { mockBusiness } from '../data/mock-business';
import { Globe, MessageCircle, Share2 } from 'lucide-react';
import { FaInstagram, FaFacebook, FaLinkedin, FaYoutube } from 'react-icons/fa';
import { Button } from '@/components/ui/button';

export function BusinessSocials({ business = mockBusiness }: { business?: typeof mockBusiness }) {
  const { socials, contact } = business;

  const socialLinks = [
    { name: "Website", icon: Globe, url: contact.website ? `https://${contact.website}` : null, color: "text-slate-700 dark:text-slate-300" },
    { name: "WhatsApp", icon: MessageCircle, url: contact.whatsapp ? `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}` : null, color: "text-emerald-600 dark:text-emerald-400" },
    { name: "Instagram", icon: FaInstagram, url: socials?.instagram, color: "text-pink-600 dark:text-pink-400" },
    { name: "Facebook", icon: FaFacebook, url: socials?.facebook, color: "text-blue-600 dark:text-blue-400" },
    { name: "LinkedIn", icon: FaLinkedin, url: socials?.linkedin, color: "text-blue-700 dark:text-blue-500" },
    { name: "YouTube", icon: FaYoutube, url: socials?.youtube, color: "text-red-600 dark:text-red-500" }
  ].filter(link => link.url);

  if (socialLinks.length === 0) return null;

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-6">
        <Share2 className="w-6 h-6 text-slate-700 dark:text-slate-300" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Connect & Follow</h2>
      </div>

      <div className="flex flex-wrap gap-4">
        {socialLinks.map((link, idx) => (
          <Button 
            key={idx} 
            variant="outline" 
            className="rounded-2xl h-14 px-6 flex items-center gap-3 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:scale-105 transition-all shadow-sm group"
            render={<a href={link.url!} target="_blank" rel="noopener noreferrer" />}
          >
            <link.icon className={`w-6 h-6 ${link.color} group-hover:scale-110 transition-transform`} />
            <span className="font-medium text-slate-700 dark:text-slate-300">{link.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
