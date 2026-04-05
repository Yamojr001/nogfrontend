'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Youtube, Quote, Globe } from 'lucide-react';

const footerLinks = {
  quickLinks: [
    { label: 'About Us', href: '/about' },
    { label: 'What We Do', href: '/what-we-do' },
    { label: 'Membership', href: '/membership' },
    { label: 'News & Announcements', href: '/news' },
    { label: 'Contact Us', href: '/contact' },
  ],
  services: [
    { label: 'Cooperative Savings', href: '/services/savings' },
    { label: 'Member Loans', href: '/services/loans' },
    { label: 'Empowerment Programs', href: '/services/empowerment' },
    { label: 'Training & Certification', href: '/services/training' },
    { label: 'Digital Banking', href: '/portal' },
  ]
};

const socials = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Youtube, href: '#', label: 'YouTube' },
];

export default function Footer() {
  const pathname = usePathname();
  const isAuthRoute = ['/dashboard', '/member', '/admin', '/partner', '/group', '/sub-org', '/wallet', '/transactions'].some(
    prefix => pathname.startsWith(prefix)
  );

  if (isAuthRoute) return null;

  return (
    <footer className="bg-slate-900 text-slate-300 pt-20 pb-10">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-14 h-14 flex-shrink-0 bg-white rounded-xl p-2">
                <img 
                  src="/logo.png" 
                  alt="NOGALSS Logo" 
                  className="object-contain w-full h-full"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold text-white tracking-tight uppercase">
                  NOGALSS
                </span>
                <span className="text-[10px] font-bold text-[#008A62] tracking-widest uppercase opacity-80">
                  National Apex Cooperative
                </span>
              </div>
            </Link>
            
            <p className="text-slate-400 leading-relaxed text-sm font-medium">
              National Umbrella Body for Skilled-Based, Artisans, NGOs, CSOs, Associations and Literacy-Focused Cooperatives across Nigeria.
            </p>

            <div className="bg-[#008A62]/10 p-4 rounded-xl border border-[#008A62]/20 mt-4">
              <p className="text-[#00DDA3] font-bold italic text-sm flex gap-2">
                <Quote size={16} className="shrink-0" />
                "We work, save and grow together"
              </p>
            </div>

            <div className="flex items-center gap-3 pt-4">
              {socials.map(({ icon: Icon, href, label }) => (
                <a 
                  key={label} 
                  href={href} 
                  aria-label={label} 
                  className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-[#008A62] hover:text-white transition-all text-slate-400"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="lg:col-span-2 space-y-6">
            <h5 className="text-white font-bold uppercase tracking-wider text-sm border-l-2 border-[#008A62] pl-3">
              Quick Links
            </h5>
            <ul className="space-y-4">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href} 
                    className="text-slate-400 hover:text-[#008A62] hover:translate-x-1 transition-all inline-block text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Column */}
          <div className="lg:col-span-3 space-y-6">
            <h5 className="text-white font-bold uppercase tracking-wider text-sm border-l-2 border-[#008A62] pl-3">
              Our Services
            </h5>
            <ul className="space-y-4">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href} 
                    className="text-slate-400 hover:text-[#008A62] hover:translate-x-1 transition-all inline-block text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us Column */}
          <div className="lg:col-span-3 space-y-6">
            <h5 className="text-white font-bold uppercase tracking-wider text-sm border-l-2 border-[#008A62] pl-3">
              Contact Us
            </h5>
            <div className="space-y-4 text-sm text-slate-400">
              <div className="flex items-start gap-3 hover:text-white transition-colors">
                <div className="p-2 rounded-lg bg-slate-800 text-[#008A62] shrink-0">
                  <MapPin size={16} />
                </div>
                <span className="leading-relaxed">
                  4th Floor, Jibril Aminu House, National Commission for Colleges of Education, Plot 829, Ralph Shodeinde Street, Central Business District, Abuja FCT
                </span>
              </div>
              
              <div className="flex items-center gap-3 hover:text-white transition-colors">
                <div className="p-2 rounded-lg bg-slate-800 text-[#008A62] shrink-0">
                  <Phone size={16} />
                </div>
                <div className="flex flex-col">
                  <a href="tel:08067659229">08067659229</a>
                  <a href="tel:09078077777">09078077777</a>
                </div>
              </div>

              <a href="mailto:info@nogalssapexcoop.org" className="flex items-center gap-3 hover:text-white transition-colors">
                <div className="p-2 rounded-lg bg-slate-800 text-[#008A62] shrink-0">
                  <Mail size={16} />
                </div>
                <span>info@nogalssapexcoop.org</span>
              </a>

              <a href="https://www.nogalssapexcoop.org" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white transition-colors">
                <div className="p-2 rounded-lg bg-slate-800 text-[#008A62] shrink-0">
                  <Globe size={16} />
                </div>
                <span>www.nogalssapexcoop.org</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500 text-center md:text-left">
            © 2026 NOGALSS National Apex Cooperative Society Limited. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-xs text-slate-500 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-xs text-slate-500 hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
