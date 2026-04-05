'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'What We Do', href: '/what-we-do' },
  { label: 'Membership', href: '/membership' },
  { label: 'News', href: '/news' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAuthRoute = ['/dashboard', '/member', '/admin', '/partner', '/group', '/sub-org', '/wallet', '/transactions'].some(
    prefix => pathname?.startsWith(prefix)
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (isAuthRoute) return null;

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-3' : 'bg-white/95 backdrop-blur-sm py-4'
      }`}
    >
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 transition-transform hover:scale-[1.02]">
          <div className="relative w-12 h-12 flex-shrink-0">
            <img 
              src="/logo.png" 
              alt="NOGALSS Logo" 
              className="object-contain w-full h-full"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-bold leading-tight text-primary uppercase tracking-wide">
              NATIONAL APEX COOPERATIVE
            </span>
            <span className="text-[10px] font-semibold leading-tight text-primary/80 uppercase">
              SOCIETY LTD
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-10">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className={`text-[15px] font-medium transition-all hover:text-primary relative group ${
                    pathname === link.href ? 'text-primary' : 'text-foreground/80'
                  }`}
                >
                  {link.label}
                  <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full ${
                    pathname === link.href ? 'w-full' : ''
                  }`} />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          <Link 
            href="/register/member" 
            className="px-6 py-2.5 rounded-lg border-2 border-primary text-primary text-[14px] font-bold hover:bg-primary/5 transition-all"
          >
            Become a Member
          </Link>
          <Link 
            href="/login" 
            className="px-6 py-2.5 rounded-lg bg-primary text-white text-[14px] font-bold hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95"
          >
            Member Portal
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden p-2 text-primary bg-primary/5 rounded-md"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 transition-all duration-500 ease-in-out shadow-2xl overflow-hidden ${
          mobileOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="container py-8 flex flex-col gap-8">
          <ul className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className={`text-lg font-semibold transition-colors ${
                    pathname === link.href ? 'text-primary px-4 border-l-4 border-primary' : 'text-foreground/80 px-4'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-4 pt-6 border-t border-gray-100">
            <Link 
              href="/register/member" 
              className="w-full py-4 rounded-xl border-2 border-primary text-primary text-center font-bold"
            >
              Become a Member
            </Link>
            <Link 
              href="/login" 
              className="w-full py-4 rounded-xl bg-primary text-white text-center font-bold shadow-lg shadow-primary/10"
            >
              Member Portal
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
