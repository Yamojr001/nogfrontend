'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, ChevronRight, Users, Globe, Building2, Quote, 
  ArrowRight, Landmark, Briefcase, GraduationCap, Network, 
  Activity, Zap, Heart, CheckCircle2, TrendingUp, Presentation
} from 'lucide-react';
import styles from './page.module.css';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el));
    
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className={`${styles.hero} hero-pattern`} style={{ paddingTop: '180px', paddingBottom: '140px' }}>
        <div className="container">
          <div className={`${styles.heroContent} reveal`}>
            <span className="section-tag" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--white)', border: '1px solid rgba(255,255,255,0.2)' }}>
              NOGALSS National Apex Cooperative Society Ltd
            </span>
            <h1 className={styles.heroTitle}>
              Replacing Individual Struggle With <span style={{ color: 'var(--primary-light)' }}>Collective Strength.</span>
            </h1>
            <p className={styles.heroSubtitle}>
              National Umbrella Body for Skilled-Based Professionals, Artisans, NGOs, CSOs, Associations and Literacy-Focused Cooperatives across Nigeria.
            </p>
            
            <div className={styles.ctaGroup}>
              <Link href="/register/member" className="btn btn-primary btn-lg">
                Become a Member <ChevronRight size={18} />
              </Link>
              <Link href="/register/partner" className="btn btn-outline btn-lg">
                Partner With Us
              </Link>
            </div>
            
            <div className={styles.heroStats}>
              {[
                { icon: Globe, label: 'National Coverage' },
                { icon: ShieldCheck, label: 'Digital Infrastructure' },
                { icon: Users, label: 'Access to Finance' },
                { icon: Building2, label: 'Global Partnerships' },
              ].map((stat, i) => (
                <div key={i} className={styles.statItem}>
                  <div className={styles.statIcon}><stat.icon size={20} /></div>
                  <span className={styles.statLabel}>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* President's Message */}
      <section className="section" style={{ background: 'var(--gray-50)', overflow: 'hidden' }}>
        <div className="container">
          <div className={styles.presidentGrid}>
            <div className="reveal-left">
              <div className={styles.presidentCard}>
                <div className={styles.quoteIcon}><Quote size={40} fill="currentColor" /></div>
                <h3 className={styles.presidentHeader}>FROM THE DESK OF THE NATIONAL PRESIDENT/CEO</h3>
                <p className={styles.presidentQuote}>
                  "Reclaiming Nigeria’s Informal Economy Through Cooperative Power"
                </p>
                <div className={styles.presidentInfo}>
                  <div className={styles.avatarPlaceholder}>NE</div>
                  <div>
                    <p className={styles.presidentName}>Comrade Noah Emmanuel</p>
                    <p className={styles.presidentTitle}>National President/CEO</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="reveal-right">
              <h2 className="display-2" style={{ color: 'var(--primary-dark)', marginBottom: '32px', fontSize: '2.4rem' }}>
                This Is Not Another Association. <br /><span style={{ color: 'var(--primary)' }}>This Is a Movement.</span>
              </h2>
              <div className={styles.messageContent}>
                <p>
                  Nigeria’s informal sector is not weak. It has only been unorganized, underfinanced, and undervalued for far too long.
                </p>
                <p>
                  Across our streets, farms, workshops, markets, transport corridors, classrooms, and communities are millions of skilled Nigerians—artisans, technicians, traders, farmers, drivers, educators, NGOs, and associations—who keep this country running every single day.
                </p>
                <p>
                  Yet, despite their numbers and productivity, they have remained financially invisible, structurally excluded, and economically unsecured. That era must end.
                </p>
                <p style={{ fontWeight: '700', color: 'var(--primary-dark)', fontSize: '1.2rem' }}>
                  NOGALSS exists for that singular purpose.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mandate Section */}
      <section className="section">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-tag">Our Mandate</span>
            <h2 className="display-2 section-title">A Clear Path for National Development</h2>
            <p className="section-subtitle">
              NOGALSS is a national economic instrument. We are building a unified cooperative force—digitally enabled, legally grounded, and financially structured.
            </p>
          </div>
          
          <div className="grid grid-3">
            {[
              { id: 'a', icon: Network, title: 'Organize the unorganized', color: 'var(--primary)' },
              { id: 'b', icon: Landmark, title: 'Finance the unfunded', color: 'var(--accent-blue)' },
              { id: 'c', icon: ShieldCheck, title: 'Protect the unprotected', color: 'var(--primary)' },
              { id: 'd', icon: GraduationCap, title: 'Train the untrained', color: 'var(--secondary)' },
              { id: 'e', icon: Zap, title: 'Connect the disconnected', color: 'var(--accent-blue)' },
              { id: 'f', icon: Activity, title: 'Give voice to the ignored', color: 'var(--secondary)' },
            ].map((m, i) => (
              <div key={i} className={`${styles.mandateCard} reveal`} style={{ '--delay': i } as any}>
                <div className={styles.mandateIcon} style={{ background: `${m.color}15`, color: m.color }}><m.icon size={28} /></div>
                <h3 className={styles.mandateTitle}>{m.title}</h3>
                <div className={styles.mandateLetter}>{m.id}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="section" style={{ background: 'var(--primary-dark)', color: 'white' }}>
        <div className="container">
          <div className={styles.impactWrapper}>
            <div className="reveal-left">
              <h2 className="display-2" style={{ color: 'white', marginBottom: '24px' }}>From Survival to Structure. <br /><span style={{ color: 'var(--primary-light)' }}>From Hustle to Wealth.</span></h2>
              <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', marginBottom: '40px', maxWidth: '600px' }}>
                For decades, millions have worked hard without systems and businesses without scale. We are changing that narrative.
              </p>
              <ul className={styles.impactList}>
                {[
                  'Providing access to cooperative savings, loans, and investments',
                  'Delivering empowerment assets and working capital',
                  'Creating digital identity and financial visibility',
                  'Opening access to government, donor, and global programs',
                  'Building shared infrastructure, markets, and value chains',
                  'Ensuring dividends, welfare, and long-term security'
                ].map((item, i) => (
                  <li key={i} className="reveal" style={{ transitionDelay: `${i * 0.1}s` }}><CheckCircle2 size={18} color="var(--primary-light)" /> {item}</li>
                ))}
              </ul>
            </div>
            <div className={`${styles.impactImage} reveal-right`}>
              <div className={styles.imageOverlay}>
                <div className={styles.overlayText}>
                  <h3>Collective Strength</h3>
                  <p>Uniting 500k+ Professionals</p>
                </div>
              </div>
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000" alt="Empowerment" />
            </div>
          </div>
        </div>
      </section>

      {/* Values & Goals grid */}
      <section className="section">
        <div className="container">
          <div className="grid grid-2">
            <div className={`${styles.visionCard} reveal-left`}>
              <div className={styles.cardHeader}>
                <div className={styles.accentBar} style={{ background: 'var(--primary)' }} />
                <Heart size={32} color="var(--primary)" />
                <h3>Our Vision</h3>
              </div>
              <p>To be Nigeria’s leading apex cooperative institution uniting and empowering skilled-based, artisan, NGO, association, unions, and literacy communities through inclusive development, sustainable economic growth, and social transformation.</p>
            </div>
            
            <div className={`${styles.visionCard} reveal-right`}>
              <div className={styles.cardHeader}>
                <div className={styles.accentBar} style={{ background: 'var(--secondary)' }} />
                <TrendingUp size={32} color="var(--secondary)" />
                <h3>Our Mission</h3>
              </div>
              <p>To empower and unify cooperatives nationwide through structured coordination, financial access, capacity building, digital systems, and strategic partnerships.</p>
            </div>
          </div>

          <div className={styles.valuesGrid}>
            <div className="section-header reveal" style={{ marginBottom: '40px', textAlign: 'left', marginLeft: 0 }}>
              <h2 className="display-2" style={{ fontSize: '2.2rem' }}>Core Values</h2>
            </div>
            <div className="grid grid-4">
              {[
                { title: 'Cooperation & Inclusiveness', desc: 'Working together across all sectors.', icon: Users },
                { title: 'Transparency & Accountability', desc: 'Open systems, clear governance.', icon: ShieldCheck },
                { title: 'Equity & Social Justice', desc: 'Fairness for every Nigerian.', icon: Heart },
                { title: 'Innovation & Sustainability', desc: 'Modern tools for lasting impact.', icon: Zap },
              ].map((v, i) => (
                <div key={i} className={`${styles.valueItem} reveal`}>
                  <div className={styles.valueIcon}><v.icon size={24} /></div>
                  <h4>{v.title}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Leaders */}
      <section className="section" style={{ background: 'var(--gray-900)', color: 'white' }}>
        <div className="container">
          <div className="section-header reveal">
            <h2 className="display-2" style={{ color: 'white' }}>A Call to Leaders, Associations, and Partners</h2>
          </div>
          
          <div className="grid grid-2">
            {[
              { role: 'Association Leaders', text: 'This is your opportunity to institutionalize your members’ future.', color: 'var(--primary)' },
              { role: 'Artisans & Workers', text: 'This is your pathway from daily income to lasting prosperity.', color: 'var(--accent-blue)' },
              { role: 'Cooperatives & NGOs', text: 'This is the platform to scale your impact nationally.', color: 'var(--secondary)' },
              { role: 'Investors & Partners', text: 'The most structured gateway into Nigeria’s grassroots economy.', color: 'var(--primary-light)' },
            ].map((item, i) => (
              <div key={i} className={`${styles.roleCard} reveal`}>
                <div className={styles.roleHeader} style={{ color: item.color }}>{item.role}</div>
                <p>{item.text}</p>
                <Link href="/contact" className={styles.roleLink}>Learn more <ArrowRight size={14} /></Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="section" style={{ overflow: 'hidden' }}>
        <div className="container">
          <div className={`${styles.finalCta} reveal`}>
            <div className={styles.ctaTextContent}>
              <h2 className="display-2" style={{ marginBottom: '24px' }}>The Time Is Now</h2>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '40px' }}>
                Nigeria cannot grow by ignoring the majority of its workforce. <br />
                <strong>NOGALSS is ready. Join us today.</strong>
              </p>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <Link href="/register/member" className="btn btn-primary btn-lg">Join us</Link>
                <Link href="/register/partner" className="btn btn-outline-dark btn-lg">Partner with us</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
