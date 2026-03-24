import type { Metadata } from 'next';
import { Network, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Governance Structure',
  description: 'NOGALSS democratic governance structure and organs.',
};

const levels = [
  'General Assembly',
  'Board of Trustees',
  'Governing Council',
  'Management Committee',
  'Zonal, State, Senatorial, LGA & Ward Executives',
  'Standing & Ad-hoc Committees',
];

export default function GovernancePage() {
  return (
    <>
      <section style={{ background: 'linear-gradient(135deg, #061c10 0%, #0D4A2F 60%, #1a6e45 100%)', padding: '120px 0 80px', textAlign: 'center' }}>
        <div className="container">
          <span className="section-tag" style={{ background: 'rgba(201,150,43,0.2)', color: '#f0c84e' }}>Governance</span>
          <h1 className="display-2 section-title" style={{ color: 'white', textAlign: 'center' }}>Governance Structure</h1>
          <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.75)', margin: '0 auto' }}>NOGALSS operates through structured democratic governance and internal control systems.</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: '760px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0', position: 'relative' }}>
            <div style={{ position: 'absolute', left: '31px', top: '64px', bottom: '64px', width: '2px', background: 'linear-gradient(to bottom, #0D4A2F, #C9962B)', borderRadius: '1px', zIndex: 0 }} />
            {levels.map((l, i) => (
              <div key={l} style={{ display: 'flex', gap: '32px', alignItems: 'center', paddingBottom: i < levels.length - 1 ? '32px' : '0', position: 'relative', zIndex: 1 }}>
                <div style={{ flexShrink: 0, width: '64px', height: '64px', background: i === 0 ? '#0D4A2F' : i === 1 ? '#1a6e45' : i === 2 ? '#1a7a4a' : i === 3 ? '#23955b' : i === 4 ? '#2caa6b' : '#33b876', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: '800', boxShadow: '0 4px 16px rgba(0,0,0,0.2)', border: '3px solid white' }}>{String(i + 1).padStart(2, '0')}</div>
                <div style={{ flex: 1, background: 'white', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--primary-dark)' }}>{l}</h3>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: 'var(--primary-soft)', borderRadius: '16px', padding: '32px', marginTop: '64px', textAlign: 'center', border: '1px solid rgba(13,74,47,0.1)' }}>
            <Network size={32} color="var(--primary)" style={{ margin: '0 auto 16px' }} />
            <p style={{ fontSize: '1.05rem', color: 'var(--primary-dark)', fontWeight: '500' }}>All organs operate under cooperative laws, bylaws, and internal control systems ensuring total transparency and accountability.</p>
          </div>
        </div>
      </section>
    </>
  );
}
