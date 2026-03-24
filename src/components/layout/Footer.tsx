import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Youtube, ArrowRight } from 'lucide-react';
import styles from './Footer.module.css';

const footerLinks = {
  organisation: [
    { label: 'About NOGALSS', href: '/about' },
    { label: 'Vision & Mission', href: '/vision' },
    { label: 'Governance', href: '/governance' },
    { label: 'International Partnerships', href: '/partnerships' },
  ],
  services: [
    { label: 'Cooperative Savings', href: '/financial-services#savings' },
    { label: 'Loans & Financing', href: '/financial-services#loans' },
    { label: 'Empowerment Programs', href: '/empowerment' },
    { label: 'What We Do', href: '/what-we-do' },
  ],
  membership: [
    { label: 'Become a Member', href: '/membership' },
    { label: 'Register Individual', href: '/register/member' },
    { label: 'Register Organisation', href: '/register/partner' },
    { label: 'Login Portal', href: '/login' },
  ],
};

const socials = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Youtube, href: '#', label: 'YouTube' },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* CTA Strip */}
      <div className={styles.ctaStrip}>
        <div className="container">
          <div className={styles.ctaInner}>
            <div>
              <h3 className={styles.ctaTitle}>Ready to Join Nigeria's Premier Cooperative?</h3>
              <p className={styles.ctaText}>Empowering over 100,000+ members across Nigeria's skilled workforce.</p>
            </div>
            <div className={styles.ctaBtns}>
              <Link href="/register/member" className="btn btn-secondary btn-lg">
                Become a Member <ArrowRight size={16} />
              </Link>
              <Link href="/register/partner" className="btn btn-outline">
                Register Organisation
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className={styles.main}>
        <div className="container">
          <div className={styles.grid}>
            {/* Brand */}
            <div className={styles.brand}>
              <div className={styles.logoWrap}>
                <img src="/logo.png" alt="NOGALSS Logo" width={56} height={56} style={{ objectFit: 'contain' }} />
                <div>
                  <div className={styles.logoName}>NOGALSS</div>
                  <div className={styles.logoTagline}>National Apex Cooperative</div>
                </div>
              </div>
              <p className={styles.brandDesc}>
                NOGALSS National Apex Cooperative Society Limited — uniting Nigeria's skilled workforce through cooperative power and financial empowerment.
              </p>
              <div className={styles.contact}>
                <a href="tel:08067659229" className={styles.contactItem}><Phone size={14} /> 0806 765 9229</a>
                <a href="mailto:info@nogalssapexcoop.org" className={styles.contactItem}><Mail size={14} /> info@nogalssapexcoop.org</a>
                <span className={styles.contactItem}><MapPin size={14} /> Abuja, FCT, Nigeria</span>
              </div>
              <div className={styles.socials}>
                {socials.map(({ icon: Icon, href, label }) => (
                  <a key={label} href={href} aria-label={label} className={styles.socialLink}>
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            {Object.entries(footerLinks).map(([key, links]) => (
              <div key={key} className={styles.linkCol}>
                <h5 className={styles.colTitle}>{key === 'organisation' ? 'Organisation' : key === 'services' ? 'Services' : 'Membership'}</h5>
                <ul className={styles.linkList}>
                  {links.map((l) => (
                    <li key={l.label}><Link href={l.href} className={styles.footerLink}>{l.label}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className={styles.bottom}>
        <div className="container">
          <div className={styles.bottomInner}>
            <p className={styles.copyright}>© {new Date().getFullYear()} NOGALSS National Apex Cooperative Society Limited. All rights reserved.</p>
            <div className={styles.bottomLinks}>
              <Link href="/privacy" className={styles.bottomLink}>Privacy Policy</Link>
              <Link href="/terms" className={styles.bottomLink}>Terms of Use</Link>
              <Link href="/accessibility" className={styles.bottomLink}>Accessibility</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
