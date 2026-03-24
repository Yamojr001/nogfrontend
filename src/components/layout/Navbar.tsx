'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';
import styles from './Navbar.module.css';

const navLinks = [
  { label: 'About', href: '/about' },
  { label: 'What We Do', href: '/what-we-do' },
  {
    label: 'Services', href: '#', children: [
      { label: 'Financial Services', href: '/financial-services' },
      { label: 'Empowerment Programs', href: '/empowerment' },
      { label: 'Membership', href: '/membership' },
    ]
  },
  { label: 'Governance', href: '/governance' },
  { label: 'Partnerships', href: '/partnerships' },
  { label: 'News', href: '/news' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <>
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
        <div className="container">
          <div className={styles.inner}>
            {/* Logo */}
            <Link href="/" className={styles.logo}>
              <img src="/logo.png" alt="NOGALSS Logo" width={48} height={48} style={{ objectFit: 'contain' }} />
              <div className={styles.logoText}>
                <span className={styles.logoTitle}>NOGALSS</span>
                <span className={styles.logoSub}>National Apex Cooperative</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <ul className={styles.navLinks}>
              {navLinks.map((link) => (
                <li
                  key={link.label}
                  className={`${styles.navItem} ${link.children ? styles.hasDropdown : ''}`}
                  onMouseEnter={() => link.children && setActiveDropdown(link.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={link.href}
                    className={`${styles.navLink} ${pathname === link.href ? styles.active : ''}`}
                  >
                    {link.label}
                    {link.children && <ChevronDown size={14} />}
                  </Link>
                  {link.children && activeDropdown === link.label && (
                    <ul className={styles.dropdown}>
                      {link.children.map((child) => (
                        <li key={child.label}>
                          <Link href={child.href} className={styles.dropdownLink}>{child.label}</Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>

            {/* CTA Buttons */}
            <div className={styles.ctaGroup}>
              <Link href="/login" className={`btn btn-outline btn-sm ${scrolled ? styles.portalBtnScrolled : ''}`} style={{ border: scrolled ? '1.5px solid var(--primary)' : 'none' }}>Member Portal</Link>
              <Link href="/register/member" className="btn btn-primary btn-sm">Become a Member</Link>
            </div>

            {/* Mobile Toggle */}
            <button className={styles.mobileToggle} onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`${styles.mobileDrawer} ${mobileOpen ? styles.drawerOpen : ''}`}>
        <ul className={styles.mobileLinks}>
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link href={link.href} className={styles.mobileLink}>{link.label}</Link>
              {link.children && (
                <ul className={styles.mobileSubLinks}>
                  {link.children.map((child) => (
                    <li key={child.label}>
                      <Link href={child.href} className={styles.mobileSubLink}>{child.label}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
        <div className={styles.mobileCtaGroup}>
          <Link href="/login" className="btn btn-outline-dark">Login Portal</Link>
          <Link href="/register/member" className="btn btn-primary">Become a Member</Link>
          <Link href="/register/partner" className="btn btn-secondary">Register Organisation</Link>
        </div>
      </div>
      {mobileOpen && <div className={styles.overlay} onClick={() => setMobileOpen(false)} />}
    </>
  );
}
