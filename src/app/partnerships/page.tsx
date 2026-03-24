import type { Metadata } from 'next';
import { Globe, Users, Trophy, Target, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'International Partnerships',
  description: 'NOGALSS global cooperative networks and partnerships.',
};

const networks = [
  'International Cooperative Alliance (ICA)',
  'African cooperative federations',
  'International donor agencies',
  'Development NGOs',
];

const opportunities = [
  'Grants & technical assistance',
  'Exchange programs & study tours',
  'Export market access',
  'International certifications',
  'Global cooperative recognition',
];

const investors = [
  'Government MDAs',
  'Development agencies',
  'Investors & financial institutions',
  'Corporate partners',
];

export default function PartnershipsPage() {
  return (
    <>
      <section style={{ background: 'linear-gradient(135deg, #061c10 0%, #0D4A2F 60%, #1a6e45 100%)', padding: '120px 0 80px', textAlign: 'center' }}>
        <div className="container">
          <span className="section-tag" style={{ background: 'rgba(201,150,43,0.2)', color: '#f0c84e' }}>International Partnerships</span>
          <h1 className="display-2 section-title" style={{ color: 'white', textAlign: 'center' }}>Global Networks & Investment</h1>
          <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.75)', margin: '0 auto' }}>Connecting members to global cooperative networks and partnership opportunities.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '48px', alignItems: 'stretch' }}>
            
            <div style={{ background: 'var(--gray-50)', borderRadius: '24px', padding: '48px', border: '1px solid var(--border)' }}>
              <Globe size={48} color="var(--primary)" style={{ marginBottom: '24px' }} />
              <h2 className="display-2" style={{ color: 'var(--primary-dark)', marginBottom: '24px' }}>Global Networks</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '1.05rem' }}>NOGALSS Apex Cooperative connects members to global cooperative networks including:</p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {networks.map(n => (
                  <li key={n} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', color: 'var(--text-primary)', fontWeight: '500' }}>
                    <div style={{ width: '8px', height: '8px', background: 'var(--secondary)', borderRadius: '50%', marginTop: '8px', flexShrink: 0 }} /> {n}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ background: 'var(--primary)', color: 'white', borderRadius: '24px', padding: '48px', boxShadow: '0 24px 60px rgba(13,74,47,0.2)' }}>
              <Trophy size={48} color="var(--secondary)" style={{ marginBottom: '24px' }} />
              <h2 className="display-2" style={{ color: 'white', marginBottom: '24px' }}>International Opportunities</h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '32px', fontSize: '1.05rem' }}>Members enjoy extensive global opportunities for growth and expansion:</p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {opportunities.map(o => (
                  <li key={o} style={{ display: 'flex', gap: '12px', alignItems: 'center', color: 'white', fontWeight: '500' }}>
                    <CheckCircle size={20} color="var(--secondary)" /> {o}
                  </li>
                ))}
              </ul>
            </div>

          </div>

          <div style={{ marginTop: '80px', textAlign: 'center', maxWidth: '800px', margin: '80px auto 0' }}>
            <span className="section-tag" style={{ background: 'var(--primary-soft)', color: 'var(--primary)' }}>Opportunities</span>
            <h2 className="display-2" style={{ color: 'var(--primary-dark)', marginBottom: '24px' }}>Partnership & Investment Opportunities</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', fontSize: '1.1rem' }}>Interested partners are invited to engage with us. We work with:</p>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '48px' }}>
              {investors.map(i => (
                <div key={i} style={{ padding: '16px 24px', background: 'white', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', fontWeight: '600', color: 'var(--text-primary)' }}>
                  {i}
                </div>
              ))}
            </div>
            <Link href="/contact" className="btn btn-secondary btn-lg">Engage With Us <ArrowRight size={18} /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
