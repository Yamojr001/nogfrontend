import type { Metadata } from 'next';
import { Target, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'What We Do',
  description: 'The core functions and mandate of NOGALSS National Apex Cooperative Society Limited.',
};

const functions = [
  'Facilitate cooperative savings, loans, and financial empowerment',
  'Implement government and donor-funded programs',
  'Manage the National Cooperative Development Fund (CDF)',
  'Provide training, skills acquisition & cooperative education',
  'Support cooperative registration and compliance',
  'Offer welfare, insurance, and social protection',
  'Create shared markets, logistics, and infrastructure',
  'Advocate cooperative-friendly policies',
  'Drive digital transformation of cooperatives',
  'Promote gender equity and inclusion',
  'Connect members to global opportunities',
];

export default function WhatWeDoPage() {
  return (
    <>
      <section style={{ background: 'var(--primary-dark)', padding: '160px 0 100px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="container reveal">
          <span className="section-tag" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>What We Do</span>
          <h1 className="display-2" style={{ color: 'white', textAlign: 'center', marginBottom: '24px' }}>Our Core Functions</h1>
          <p className="body-lg" style={{ color: 'rgba(255,255,255,0.7)', margin: '0 auto', maxWidth: '800px' }}>Building shared infrastructure, markets, and value chains for Nigerians.</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: '960px' }}>
          <div className="card reveal" style={{ padding: '64px', boxShadow: 'var(--shadow-xl)', border: 'none', background: 'var(--white)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
              {functions.map((f, i) => (
                <div key={i} className="reveal-left" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', transitionDelay: `${i * 0.05}s` }}>
                  <div style={{ width: '48px', height: '48px', background: 'var(--primary-soft)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid var(--primary-light)' }}>
                    <Target size={24} color="var(--primary)" />
                  </div>
                  <p style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '1.05rem', lineHeight: '1.5', paddingTop: '8px' }}>{f}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
