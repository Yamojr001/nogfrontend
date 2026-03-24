import type { Metadata } from 'next';
import Link from 'next/link';
import { Users, Building2, UserCircle, CheckCircle, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Membership & Benefits',
  description: 'NOGALSS Membership Categories, Benefits, and Stakeholder Structure.',
};

const categories = [
  { 
    title: 'Apex / Umbrella Organizations', icon: Building2,
    items: ['National associations, unions, federations', 'Sector-based apex bodies', 'NGOs, CSOs, Professional groups', 'Cooperatives']
  },
  {
    title: 'Member Organizations', icon: Users,
    items: ['Registered cooperatives', 'Associations and community-based groups', 'Occupational and trade groups']
  },
  {
    title: 'Individual Members (Financial)', icon: UserCircle,
    items: ['Artisans', 'Skilled workers', 'Entrepreneurs', 'Informal sector participants']
  }
];

const stakeholderBenefits = [
  {
    title: 'Association Leadership',
    items: ['Registration commissions', 'Leadership dividend pool', 'Mobilization bonuses', 'Priority access to contracts', 'Governance & committee appointments', 'International exposure', 'Policy engagement opportunities']
  },
  {
    title: 'Member Organizations',
    items: ['Share of registration fees', 'Performance bonuses', 'Group loan eligibility', 'CDF grant access', 'Franchise & dealership rights', 'Institutional capacity development', 'National visibility & branding']
  },
  {
    title: 'Individual Members',
    items: ['Savings & loan access', 'Annual dividends', 'Empowerment assets (tools, tricycles, inputs)', 'Market access & trade fairs', 'Training & certification', 'Digital identity & networking', 'Welfare & emergency assistance']
  }
];

export default function MembershipPage() {
  return (
    <>
      <section style={{ background: 'linear-gradient(135deg, #061c10 0%, #0D4A2F 60%, #1a6e45 100%)', padding: '120px 0 80px', textAlign: 'center' }}>
        <div className="container">
          <span className="section-tag" style={{ background: 'rgba(201,150,43,0.2)', color: '#f0c84e' }}>Membership</span>
          <h1 className="display-2 section-title" style={{ color: 'white', textAlign: 'center' }}>Categories & Benefits</h1>
          <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.75)', margin: '0 auto' }}>Join the cooperative movement shaping Nigeria’s economic future.</p>
        </div>
      </section>

      {/* Categories */}
      <section className="section" style={{ background: 'var(--gray-50)' }}>
        <div className="container">
          <h2 className="display-2" style={{ textAlign: 'center', color: 'var(--primary-dark)', marginBottom: '48px' }}>Membership Categories</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {categories.map(c => {
              const Icon = c.icon;
              return (
                <div key={c.title} className="card">
                  <div style={{ width: '56px', height: '56px', background: 'var(--primary-soft)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                    <Icon size={28} color="var(--primary)" />
                  </div>
                  <h3 className="h4" style={{ marginBottom: '16px' }}>{c.title}</h3>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {c.items.map(item => (
                      <li key={item} style={{ display: 'flex', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        <div style={{ width: '6px', height: '6px', background: 'var(--secondary)', borderRadius: '50%', marginTop: '8px', flexShrink: 0 }} /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section">
        <div className="container">
          <h2 className="display-2" style={{ textAlign: 'center', color: 'var(--primary-dark)', marginBottom: '48px' }}>Top Member Benefits</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            {[
              'Access to low-interest cooperative loans',
              'Participation in empowerment programs',
              'Cooperative dividends and surplus sharing',
              'Bulk purchasing and shared infrastructure',
              'Cooperative Development Fund (CDF) access',
              'Training, certification & skills development',
              'Health insurance & welfare schemes',
              'Digital ID & cooperative wallet',
              'Policy advocacy & national representation',
              'Youth, women & PWD inclusion programs',
              'International partnerships & exchange programs',
            ].map((b, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '16px', border: '1px solid var(--border)', borderRadius: '12px', background: 'white' }}>
                <CheckCircle size={20} color="var(--primary)" />
                <span style={{ fontSize: '0.95rem', fontWeight: '500', color: 'var(--text-primary)' }}>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stakeholders */}
      <section className="section" style={{ background: 'var(--primary-dark)', color: 'white' }}>
        <div className="container">
          <h2 className="display-2" style={{ textAlign: 'center', color: 'white', marginBottom: '48px' }}>Stakeholder Benefit Structure</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
            {stakeholderBenefits.map(sb => (
              <div key={sb.title} style={{ background: 'rgba(255,255,255,0.05)', padding: '32px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <h3 className="h4" style={{ marginBottom: '24px', color: 'var(--secondary)' }}>{sb.title}</h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {sb.items.map(item => (
                    <li key={item} style={{ display: 'flex', gap: '12px', color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
                      <CheckCircle size={16} color="var(--secondary)" style={{ flexShrink: 0, marginTop: '2px' }} /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '64px' }}>
            <Link href="/register/member" className="btn btn-secondary btn-lg">Join us via Registration Portal <ArrowRight size={18} /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
