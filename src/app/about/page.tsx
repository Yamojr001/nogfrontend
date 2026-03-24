import type { Metadata } from 'next';
import { Target, Eye, Shield, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about NOGALSS National Apex Cooperative Society Limited and our mandate.',
};

const values = [
  'Cooperation & Inclusiveness',
  'Transparency & Accountability',
  'Equity & Social Justice',
  'Innovation & Sustainability',
  'Professionalism & Integrity',
];

const mandates = [
  'National coordination and supervision of member cooperatives',
  'Cooperative financial inclusion and empowerment',
  'Capacity building and skills development',
  'Government and donor project implementation',
  'Advocacy and policy engagement',
  'Digital transformation of cooperatives',
];

export default function AboutPage() {
  return (
    <>
      <section style={{ background: 'var(--primary-dark)', padding: '160px 0 100px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="container reveal">
          <span className="section-tag" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>About NOGALSS</span>
          <h1 className="display-2" style={{ color: 'white', textAlign: 'center', marginBottom: '24px' }}>Who We Are</h1>
          <p className="body-lg" style={{ color: 'rgba(255,255,255,0.7)', margin: '0 auto', maxWidth: '800px' }}>NOGALSS National Apex Cooperative Society Limited is a duly registered National Apex Cooperative operating under the Nigerian Cooperative Societies Act.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
            <div className="reveal-left">
              <h2 className="display-2" style={{ color: 'var(--primary-dark)', marginBottom: '24px', fontSize: '2.5rem' }}>The Central Coordinating Body</h2>
              <div style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.8', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <p>
                  We serve as the central coordinating, technical, and implementing body for skilled-based cooperatives, artisans, NGOs, CSOs, associations, and literacy-focused cooperative institutions across Nigeria.
                </p>
                <p>
                  We provide governance coordination, financial systems, capacity development, digital infrastructure, and national representation for our members.
                </p>
              </div>
            </div>
            <div className="reveal-right" style={{ background: 'var(--gray-50)', borderRadius: 'var(--radius-xl)', padding: '56px', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
              <h3 className="h3" style={{ color: 'var(--primary)', marginBottom: '28px', fontFamily: 'var(--font-display)' }}>Our Mandate</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {mandates.map((m, i) => (
                  <li key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    <CheckCircle size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: '3px' }} />
                    <span style={{ color: 'var(--text-primary)', fontWeight: '500', fontSize: '1.05rem' }}>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--primary-soft)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '40px' }}>
            {/* Vision */}
            <div className="card reveal-left" style={{ padding: '64px', textAlign: 'center', border: 'none', boxShadow: 'var(--shadow-lg)' }}>
              <div style={{ width: '80px', height: '80px', background: 'var(--primary-soft)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px', border: '1px solid var(--primary-light)' }}>
                <Eye size={36} color="var(--primary)" />
              </div>
              <h3 className="h3" style={{ marginBottom: '20px', color: 'var(--primary-dark)', fontFamily: 'var(--font-display)' }}>Vision</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.7' }}>
                To be Nigeria’s leading apex cooperative institution uniting and empowering skilled-based, artisan, NGO, association, unions, and literacy communities through inclusive development, sustainable economic growth, and social transformation.
              </p>
            </div>

            {/* Mission */}
            <div className="card reveal-right" style={{ padding: '64px', textAlign: 'center', border: 'none', boxShadow: 'var(--shadow-lg)' }}>
              <div style={{ width: '80px', height: '80px', background: 'var(--secondary-soft)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px', border: '1px solid #FFAB91' }}>
                <Target size={36} color="var(--secondary)" />
              </div>
              <h3 className="h3" style={{ marginBottom: '20px', color: 'var(--primary-dark)', fontFamily: 'var(--font-display)' }}>Mission</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.7' }}>
                To empower and unify cooperatives nationwide through structured coordination, financial access, capacity building, digital systems, and strategic partnerships.
              </p>
            </div>
          </div>

          <div style={{ marginTop: '100px', textAlign: 'center' }}>
            <h2 className="display-2 reveal" style={{ marginBottom: '48px', color: 'var(--primary-dark)', fontSize: '2.5rem' }}>Core Values</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
              {values.map((v, i) => (
                <div key={v} className="reveal" style={{ transitionDelay: `${i * 0.1}s`, background: 'white', padding: '18px 32px', borderRadius: 'var(--radius-full)', fontSize: '1.05rem', fontWeight: '700', color: 'var(--primary)', boxShadow: 'var(--shadow)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Shield size={20} color="var(--primary)" /> {v}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
