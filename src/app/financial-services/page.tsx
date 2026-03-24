import type { Metadata } from 'next';
import Link from 'next/link';
import { Wallet, CheckCircle, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Financial Services',
  description: 'Explore NOGALSS cooperative financial services including savings, loans, and asset financing.',
};

const services = [
  'Cooperative savings schemes',
  'Member-friendly loan products',
  'Asset financing (tools, equipment, vehicles)',
  'Working capital support',
  'Emergency and welfare funds',
  'Dividend distribution',
];

export default function FinancialServicesPage() {
  return (
    <>
      <section style={{ background: 'linear-gradient(135deg, #061c10 0%, #0D4A2F 60%, #1a6e45 100%)', padding: '120px 0 80px', textAlign: 'center' }}>
        <div className="container">
          <span className="section-tag" style={{ background: 'rgba(201,150,43,0.2)', color: '#f0c84e' }}>Financial Services</span>
          <h1 className="display-2 section-title" style={{ color: 'white', textAlign: 'center' }}>Cooperative Financial Services</h1>
          <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.75)', margin: '0 auto' }}>All financial services are cooperative-based and governed by internal bylaws and regulatory frameworks.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="card" style={{ padding: '48px', boxShadow: '0 24px 60px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
                {services.map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{ width: '40px', height: '40px', background: 'var(--primary-soft)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Wallet size={20} color="var(--primary)" />
                    </div>
                    <p style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '1.1rem', lineHeight: '1.4', paddingTop: '8px' }}>{s}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '48px' }}>
              <Link href="/register/member" className="btn btn-primary btn-lg">Start Saving Today <ArrowRight size={18} /></Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
